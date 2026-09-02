(function (global) {
  'use strict';

  const STAT_KEYS = ['health', 'stress', 'money', 'skill', 'research', 'network', 'ethics', 'legalRisk'];

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function normalizeCheck(check) {
    if (!check || typeof check !== 'object') return null;

    const stats = {};
    for (const [key, weight] of Object.entries(check.stats || {})) {
      if (STAT_KEYS.includes(key) && typeof weight === 'number' && Number.isFinite(weight)) {
        stats[key] = weight;
      }
    }

    return {
      baseChance: typeof check.baseChance === 'number' ? check.baseChance : 50,
      stats,
      minChance: typeof check.minChance === 'number' ? check.minChance : 5,
      maxChance: typeof check.maxChance === 'number' ? check.maxChance : 95,
      success: check.success && typeof check.success === 'object' ? check.success : {},
      failure: check.failure && typeof check.failure === 'object' ? check.failure : {}
    };
  }

  function computeCheckDetails(check, stats) {
    const normalized = normalizeCheck(check);
    if (!normalized) return null;

    let chance = normalized.baseChance;
    const factors = [];

    for (const [stat, weight] of Object.entries(normalized.stats)) {
      const value = typeof stats?.[stat] === 'number' ? stats[stat] : 0;
      const contribution = (value - 50) * weight;
      chance += contribution;
      factors.push({ stat, value, weight, contribution });
    }

    factors.sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));

    return {
      chance: clamp(Math.round(chance), normalized.minChance, normalized.maxChance),
      unclampedChance: chance,
      factors,
      check: normalized
    };
  }

  // ===== 成长边际递减：医术/人脉/科研越高，越难继续增长 =====
  const DIMINISHING_STATS = new Set(['skill', 'network', 'research']);
  // skill 增长机会明显多于 network（主线复访事件更集中在医术上），
  // 因此 skill 曲线更早、更严地衰减；network/research 保留原有强度。
  const DIMINISHING_TIERS = {
    skill: [
      { from: 92, factor: 0.15 },
      { from: 80, factor: 0.42 },
      { from: 60, factor: 0.5 },
      { from: 0, factor: 1 }
    ],
    network: [
      { from: 95, factor: 0.15 },
      { from: 85, factor: 0.44 },
      { from: 70, factor: 0.6 },
      { from: 0, factor: 1 }
    ],
    research: [
      { from: 95, factor: 0.15 },
      { from: 85, factor: 0.44 },
      { from: 70, factor: 0.6 },
      { from: 0, factor: 1 }
    ]
  };
  // 每个 stat 曲线的最高一级门槛：越过它之后，只有高代价里程碑（原始 delta>=6）
  // 才能继续 +1，避免琐碎选项的小数堆积把角色顶到满值。
  const TOP_TIER_FLOOR = { skill: 92, network: 95, research: 95 };

  function getDiminishingFactor(current, stat) {
    const tiers = DIMINISHING_TIERS[stat] || DIMINISHING_TIERS.research;
    for (const tier of tiers) {
      if (current >= tier.from) return tier.factor;
    }
    return 1;
  }

  // 增益按当前值分段衰减；扣减不受影响。
  // carryState（可选）：用于在衰减区间内累积小数余量，避免“每次都被舍成 0”
  // 或“只要 delta>=6 就必涨”这类离散跳变；顶层门槛以上不做小数累积，
  // 只放行高代价里程碑事件，保证 95+/满值仍然是稀有事件。
  function applyDiminishingReturns(stat, current, delta, carryState) {
    if (!DIMINISHING_STATS.has(stat)) return delta;
    if (typeof delta !== 'number' || delta <= 0) return delta;
    const factor = getDiminishingFactor(current, stat);
    if (factor >= 1) return delta;
    const scaled = delta * factor;
    if (scaled <= 0) return 0;

    const topFloor = TOP_TIER_FLOOR[stat] ?? 95;
    if (current >= topFloor) {
      return scaled < 1 ? (delta >= 6 ? 1 : 0) : Math.round(scaled);
    }

    if (!carryState) {
      return scaled < 1 ? (delta >= 6 ? 1 : 0) : Math.round(scaled);
    }
    const total = scaled + (carryState[stat] || 0);
    const wholePart = Math.floor(total);
    carryState[stat] = total - wholePart;
    return wholePart;
  }

  const api = {
    STAT_KEYS,
    DIMINISHING_STATS,
    clamp,
    normalizeCheck,
    computeCheckDetails,
    getDiminishingFactor,
    applyDiminishingReturns
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }

  global.CHECK_SYSTEM = api;
})(typeof window !== 'undefined' ? window : globalThis);
