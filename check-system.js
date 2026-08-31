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
  const DIMINISHING_TIERS = [
    { from: 95, factor: 0.15 },
    { from: 85, factor: 0.35 },
    { from: 70, factor: 0.6 },
    { from: 0, factor: 1 }
  ];

  function getDiminishingFactor(current) {
    for (const tier of DIMINISHING_TIERS) {
      if (current >= tier.from) return tier.factor;
    }
    return 1;
  }

  // 增益按当前值分段衰减；扣减不受影响。
  function applyDiminishingReturns(stat, current, delta) {
    if (!DIMINISHING_STATS.has(stat)) return delta;
    if (typeof delta !== 'number' || delta <= 0) return delta;
    const factor = getDiminishingFactor(current);
    if (factor >= 1) return delta;
    const scaled = delta * factor;
    // 保证高成本事件仍能推动 95+，但普通事件基本被磨平
    if (scaled <= 0) return 0;
    return scaled < 1 ? (delta >= 6 ? 1 : 0) : Math.round(scaled);
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
