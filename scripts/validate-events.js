'use strict';

const gameData = require('../events.js');
const checkSystem = require('../check-system.js');

const events = gameData.events;
const randomEvents = gameData.randomEvents || [];
const map = new Map();
const issues = [];
const validStats = new Set(checkSystem.STAT_KEYS);
const DEFAULT_STATS = { health: 80, stress: 20, money: 10, skill: 10, research: 5, network: 8, ethics: 70, legalRisk: 5 };

function collectTargets(option) {
  const targets = [];

  if (option.target) targets.push(option.target);
  for (const rt of option.randomTargets || []) targets.push(rt.target);

  if (option.check) {
    for (const branch of [option.check.success, option.check.failure]) {
      if (!branch) continue;
      if (branch.target) targets.push(branch.target);
      for (const rt of branch.randomTargets || []) targets.push(rt.target);
    }
  }

  return targets;
}

function hasBranchTarget(branch) {
  return Boolean(branch?.target || branch?.randomTargets?.length);
}

function validateRandomTargets(eventId, label, randomTargets) {
  if (!randomTargets) return;
  if (!Array.isArray(randomTargets) || randomTargets.length === 0) {
    issues.push(`事件 ${eventId} 的 ${label} randomTargets 非法`);
    return;
  }

  for (const rt of randomTargets) {
    if (!map.has(rt.target)) issues.push(`事件 ${eventId} 的 ${label} 随机目标不存在: ${rt.target}`);
    if (typeof rt.weight !== 'number' || rt.weight <= 0) {
      issues.push(`事件 ${eventId} 的 ${label} 随机目标权重非法: ${rt.target}`);
    }
  }
}

function validateCheck(event, option, index) {
  if (!option.check) return;

  const check = option.check;
  const normalized = checkSystem.normalizeCheck(check);
  if (!normalized) {
    issues.push(`事件 ${event.id} 选项 ${index + 1} 的 check 非法`);
    return;
  }

  if (typeof check.baseChance !== 'number' || check.baseChance < 0 || check.baseChance > 100) {
    issues.push(`事件 ${event.id} 选项 ${index + 1} 的 baseChance 非法`);
  }
  if (typeof check.minChance !== 'number' || typeof check.maxChance !== 'number' || check.minChance < 0 || check.maxChance > 100 || check.minChance > check.maxChance) {
    issues.push(`事件 ${event.id} 选项 ${index + 1} 的成功率上下限非法`);
  }

  const statEntries = Object.entries(check.stats || {});
  if (statEntries.length === 0) {
    issues.push(`事件 ${event.id} 选项 ${index + 1} 的 check 缺少属性权重`);
  }
  for (const [stat, weight] of statEntries) {
    if (!validStats.has(stat)) issues.push(`事件 ${event.id} 选项 ${index + 1} 使用了未知属性 ${stat}`);
    if (typeof weight !== 'number' || !Number.isFinite(weight)) {
      issues.push(`事件 ${event.id} 选项 ${index + 1} 的属性权重非法: ${stat}`);
    }
  }

  if (!hasBranchTarget(check.success) || !hasBranchTarget(check.failure)) {
    issues.push(`事件 ${event.id} 选项 ${index + 1} 的成功/失败分支缺少目标`);
  }

  validateRandomTargets(event.id, `选项 ${index + 1} 顶层`, option.randomTargets);
  validateRandomTargets(event.id, `选项 ${index + 1} 成功分支`, check.success?.randomTargets);
  validateRandomTargets(event.id, `选项 ${index + 1} 失败分支`, check.failure?.randomTargets);

  const sampleStats = Object.fromEntries(checkSystem.STAT_KEYS.map((stat) => [stat, 50]));
  const details = checkSystem.computeCheckDetails(check, sampleStats);
  if (!details || details.chance < normalized.minChance || details.chance > normalized.maxChance) {
    issues.push(`事件 ${event.id} 选项 ${index + 1} 的判定计算超出上下限`);
  }
}

for (const event of events) {
  if (map.has(event.id)) issues.push(`重复 ID: ${event.id}`);
  map.set(event.id, event);
}

for (const event of events) {
  const options = event.options || [];
  if (event.type !== 'ending' && (options.length < 2 || options.length > 4)) {
    issues.push(`事件 ${event.id} 选项数不在 2-4: ${options.length}`);
  }

  for (const [index, option] of options.entries()) {
    if (!option.target && !option.randomTargets?.length && !option.check) {
      issues.push(`事件 ${event.id} 选项 ${index + 1} 缺少目标或判定配置`);
    }

    for (const targetId of collectTargets(option)) {
      if (!map.has(targetId)) issues.push(`事件 ${event.id} 的目标不存在: ${targetId}`);
    }

    validateRandomTargets(event.id, `选项 ${index + 1}`, option.randomTargets);
    validateCheck(event, option, index);
  }
}

const adjacency = new Map(events.map((event) => [event.id, []]));
for (const event of events) {
  for (const option of event.options || []) {
    for (const targetId of collectTargets(option)) {
      adjacency.get(event.id).push(targetId);
    }
  }
}

const reachable = new Set();
const queue = [gameData.startEventId];
for (let i = 0; i < queue.length; i += 1) {
  const id = queue[i];
  if (reachable.has(id)) continue;
  reachable.add(id);
  for (const nextId of adjacency.get(id) || []) {
    if (!reachable.has(nextId)) queue.push(nextId);
  }
}

const reverse = new Map(events.map((event) => [event.id, []]));
for (const [from, targets] of adjacency.entries()) {
  for (const to of targets) {
    reverse.get(to)?.push(from);
  }
}

const canReachEnding = new Set();
const endingQueue = events.filter((event) => event.type === 'ending').map((event) => event.id);
for (let i = 0; i < endingQueue.length; i += 1) {
  const id = endingQueue[i];
  if (canReachEnding.has(id)) continue;
  canReachEnding.add(id);
  for (const prev of reverse.get(id) || []) {
    if (!canReachEnding.has(prev)) endingQueue.push(prev);
  }
}

const reachableEndings = events.filter((event) => event.type === 'ending' && reachable.has(event.id));
if (reachableEndings.length < 1) issues.push('没有可达结局');
if (events.length < 45) issues.push(`事件总数不足 45，当前 ${events.length}`);
if (events.filter((event) => event.type === 'ending').length < 12) issues.push('结局总数不足 12');

for (const event of events) {
  if (reachable.has(event.id) && !canReachEnding.has(event.id)) {
    issues.push(`事件 ${event.id} 可达但无法通向任何结局`);
  }
}

const probabilityTestCheck = {
  baseChance: 50,
  stats: { skill: 0.5, stress: -0.4, legalRisk: -0.3 },
  minChance: 25,
  maxChance: 75,
  success: { target: gameData.fallbackEndingId },
  failure: { target: gameData.fallbackEndingId }
};

const weakStats = { health: 50, stress: 90, money: 10, skill: 10, research: 50, network: 50, ethics: 50, legalRisk: 80 };
const strongStats = { health: 50, stress: 10, money: 10, skill: 90, research: 50, network: 50, ethics: 50, legalRisk: 10 };
const lowChance = checkSystem.computeCheckDetails(probabilityTestCheck, weakStats).chance;
const highChance = checkSystem.computeCheckDetails(probabilityTestCheck, strongStats).chance;
const cappedLow = checkSystem.computeCheckDetails(probabilityTestCheck, { health: 50, stress: 100, money: 10, skill: 0, research: 50, network: 50, ethics: 50, legalRisk: 100 }).chance;
const cappedHigh = checkSystem.computeCheckDetails(probabilityTestCheck, { health: 50, stress: 0, money: 10, skill: 100, research: 50, network: 50, ethics: 50, legalRisk: 0 }).chance;

if (!(highChance > lowChance)) {
  issues.push(`概率测试失败：高属性未提升成功率（${lowChance}% -> ${highChance}%）`);
}
if (cappedLow !== 25) {
  issues.push(`概率测试失败：下限未生效（得到 ${cappedLow}%）`);
}
if (cappedHigh !== 75) {
  issues.push(`概率测试失败：上限未生效（得到 ${cappedHigh}%）`);
}

// --- 新增校验：安全选项（safeChoice） ---
for (const event of events) {
  if (!event.major) continue;
  const options = event.options || [];
  const safeOptions = options.filter((option) => option.safeChoice === true || option.label === '稳妥');
  if (safeOptions.length === 0) {
    issues.push(`重大事件 ${event.id} 缺少 safeChoice: true 或 label: '稳妥' 的安全选项`);
    continue;
  }
  for (const safe of safeOptions) {
    if (safe.check) {
      const details = checkSystem.computeCheckDetails(safe.check, DEFAULT_STATS);
      if (!details || details.chance < 65) {
        issues.push(`重大事件 ${event.id} 的安全选项默认成功率不足 65%（当前 ${details ? details.chance : 'N/A'}%）`);
      }
    }
  }
}

// --- 新增校验：随机事件池（randomEvents） ---
if (!Array.isArray(randomEvents) || randomEvents.length < 105) {
  issues.push(`随机事件不足 105 个，当前 ${Array.isArray(randomEvents) ? randomEvents.length : 0}`);
}
const randomIds = new Set();
const validRarities = new Set(['common', 'uncommon', 'rare', 'very-rare']);
// Per-stage minimums
const stageMins = { gaokao: 8, undergrad: 18, graduate: 14, training: 10, resident: 20, senior: 10 };
const stageCounts = {};
for (const re of randomEvents) {
  if (!re || typeof re !== 'object') {
    issues.push('随机事件存在非法条目');
    continue;
  }
  if (randomIds.has(re.id)) issues.push(`随机事件重复 ID: ${re.id}`);
  randomIds.add(re.id);
  if (map.has(re.id)) issues.push(`随机事件 ID 与主事件冲突: ${re.id}`);
  if (!re.stage || !gameData.stages || !gameData.stages[re.stage]) {
    issues.push(`随机事件 ${re.id} 的 stage 非法: ${re.stage}`);
  } else {
    stageCounts[re.stage] = (stageCounts[re.stage] || 0) + 1;
  }
  if (typeof re.weight !== 'number' || re.weight <= 0) {
    issues.push(`随机事件 ${re.id} 的 weight 非法`);
  }
  if (re.rarity && !validRarities.has(re.rarity)) {
    issues.push(`随机事件 ${re.id} 的 rarity 非法: ${re.rarity}`);
  }
  if (!map.has(re.returnTo)) {
    issues.push(`随机事件 ${re.id} 的 returnTo 目标不存在: ${re.returnTo}`);
  }
  const reOptions = re.options || [];
  if (reOptions.length < 2 || reOptions.length > 4) {
    issues.push(`随机事件 ${re.id} 选项数不在 2-4: ${reOptions.length}`);
  }
  for (const [index, option] of reOptions.entries()) {
    const hasEffect = option.effects && typeof option.effects === 'object';
    const hasFlags = Array.isArray(option.flagsSet) && option.flagsSet.length > 0;
    if (!hasEffect && !hasFlags && !option.check) {
      issues.push(`随机事件 ${re.id} 选项 ${index + 1} 缺少 effects/flagsSet/check`);
    }
    if (option.check) {
      const normalized = checkSystem.normalizeCheck(option.check);
      if (!normalized) issues.push(`随机事件 ${re.id} 选项 ${index + 1} 的 check 非法`);
      if (Object.keys(option.check.stats || {}).length === 0) {
        issues.push(`随机事件 ${re.id} 选项 ${index + 1} 的 check 缺少属性权重`);
      }
    }
  }
}
// Check per-stage minimums
for (const [stage, min] of Object.entries(stageMins)) {
  const count = stageCounts[stage] || 0;
  if (count < min) {
    issues.push(`随机事件 ${stage} 阶段不足 ${min} 个，当前 ${count}`);
  }
}

// --- 新增校验：重试配置（retry） ---
for (const event of events) {
  for (const [index, option] of (event.options || []).entries()) {
    if (!option.retry) continue;
    const retry = option.retry;
    if (typeof retry.maxAttempts !== 'number' || retry.maxAttempts < 1 || retry.maxAttempts > 5) {
      issues.push(`事件 ${event.id} 选项 ${index + 1} 的 retry.maxAttempts 非法（应为 1-5）`);
    }
    if (!option.check) {
      issues.push(`事件 ${event.id} 选项 ${index + 1} 配置了 retry 但缺少 check`);
    }
    if (!retry.alternativeTarget || !map.has(retry.alternativeTarget)) {
      issues.push(`事件 ${event.id} 选项 ${index + 1} 的 retry.alternativeTarget 不存在: ${retry.alternativeTarget}`);
    }
    if (retry.bonusPerRetry !== undefined && typeof retry.bonusPerRetry !== 'number') {
      issues.push(`事件 ${event.id} 选项 ${index + 1} 的 retry.bonusPerRetry 非法`);
    }
  }
}

// --- 新增校验：家庭系统相关事件与结局 ID ---
const familyRandomIds = ['re_marriage', 're_child_choice', 're_dink_choice'];
for (const id of familyRandomIds) {
  if (!randomIds.has(id)) issues.push(`家庭系统随机事件缺失: ${id}`);
}
const memeCrisisEndings = [
  'ending_crisis_read_receipts',
  'ending_crisis_phone_reflex',
  'ending_crisis_night_shift_ghost',
  'ending_crisis_badge_off',
  'ending_crisis_pc_crash'
];
for (const id of memeCrisisEndings) {
  const target = map.get(id);
  if (!target || target.type !== 'ending') issues.push(`梗结局缺失或类型错误: ${id}`);
}

if (issues.length) {
  console.error('❌ 数据校验失败:');
  for (const issue of issues) console.error('-', issue);
  process.exit(1);
}

console.log('✅ 数据校验通过');
console.log(`事件总数: ${events.length}`);
console.log(`结局总数: ${events.filter((event) => event.type === 'ending').length}`);
console.log(`可达结局数: ${reachableEndings.length}`);
console.log(`随机事件数: ${randomEvents.length}`);
console.log(`判定选项数: ${events.reduce((sum, event) => sum + (event.options || []).filter((option) => option.check).length, 0)}`);
console.log(`各阶段随机事件: ${JSON.stringify(stageCounts)}`);
