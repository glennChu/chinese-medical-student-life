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

  const api = {
    STAT_KEYS,
    clamp,
    normalizeCheck,
    computeCheckDetails
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }

  global.CHECK_SYSTEM = api;
})(typeof window !== 'undefined' ? window : globalThis);
