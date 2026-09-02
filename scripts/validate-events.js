'use strict';

const gameData = require('../events.js');
const checkSystem = require('../check-system.js');

const events = gameData.events;
const map = new Map();
const issues = [];
const validStats = new Set(checkSystem.STAT_KEYS);

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

if (issues.length) {
  console.error('❌ 数据校验失败:');
  for (const issue of issues) console.error('-', issue);
  process.exit(1);
}

console.log('✅ 数据校验通过');
console.log(`事件总数: ${events.length}`);
console.log(`结局总数: ${events.filter((event) => event.type === 'ending').length}`);
console.log(`可达结局数: ${reachableEndings.length}`);
console.log(`判定选项数: ${events.reduce((sum, event) => sum + (event.options || []).filter((option) => option.check).length, 0)}`);
