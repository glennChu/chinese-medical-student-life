'use strict';

const fs = require('fs');
const path = require('path');
const gameData = require('../events.js');
const checkSystem = require('../check-system.js');

const events = gameData.events;
const randomEvents = gameData.randomEvents || [];
const map = new Map();
const randomMap = new Map();
const issues = [];
const validStats = new Set(checkSystem.STAT_KEYS);
const DEFAULT_STATS = { health: 80, stress: 20, money: 55, skill: 10, research: 5, network: 8, ethics: 70, legalRisk: 5 };
const RANDOM_EVENT_CHANCE = 0.25;
const REQUIRED_SPECIALTY_FIELDS = ['name', 'group', 'intensity', 'dispute', 'learning', 'procedure', 'research', 'demand', 'income', 'control', 'risk', 'opportunity'];
const KEY_FLAGS = ['questionable_research', 'record_shortcut', 'ai_overtrust', 'over_controlled_cost', 'has_child', 'grassroots_path', 'tier3_path'];
const FINANCE_ENDINGS = new Set(['ending_finance_debt_loop', 'ending_finance_forced_exit']);

function collectTargets(option) {
  const targets = [];
  if (option.target) targets.push(option.target);
  for (const rt of option.randomTargets || []) targets.push(rt.target);
  for (const se of option.scheduledEvents || []) targets.push(se.eventId);
  if (option.check) {
    for (const branch of [option.check.success, option.check.failure]) {
      if (!branch) continue;
      if (branch.target) targets.push(branch.target);
      for (const rt of branch.randomTargets || []) targets.push(rt.target);
      for (const se of branch.scheduledEvents || []) targets.push(se.eventId);
    }
  }
  return targets.filter(Boolean);
}

function hasBranchTarget(branch) {
  return Boolean(branch?.target || branch?.randomTargets?.length);
}

function visitContainers(list, visitor) {
  for (const event of list) {
    for (const option of event.options || []) {
      visitor(option, event, 'option');
      if (option.check) {
        if (option.check.success) visitor(option.check.success, event, 'success');
        if (option.check.failure) visitor(option.check.failure, event, 'failure');
      }
    }
  }
}

function collectFlagReads(conditions, bucket) {
  if (!conditions) return;
  for (const key of ['flags', 'requireFlags', 'anyFlags']) {
    for (const flag of conditions[key] || []) bucket.add(flag);
  }
  for (const flag of conditions.notFlags || []) bucket.add(flag);
  for (const flag of conditions.forbidFlags || []) bucket.add(flag);
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

function validateScheduledEvents(eventId, label, scheduledEvents) {
  if (!scheduledEvents) return;
  if (!Array.isArray(scheduledEvents) || scheduledEvents.length === 0) {
    issues.push(`事件 ${eventId} 的 ${label} scheduledEvents 非法`);
    return;
  }
  for (const item of scheduledEvents) {
    if (!item || typeof item !== 'object') {
      issues.push(`事件 ${eventId} 的 ${label} scheduledEvents 存在非法条目`);
      continue;
    }
    if (!item.eventId || !(map.has(item.eventId) || randomMap.has(item.eventId))) {
      issues.push(`事件 ${eventId} 的 ${label} scheduledEvents 目标不存在: ${item.eventId}`);
    }
    const delay = item.turns ?? item.delay;
    if (typeof delay !== 'number' || delay < 1 || delay > 8) {
      issues.push(`事件 ${eventId} 的 ${label} scheduledEvents.delay 非法: ${delay}`);
    }
    if (item.eventId === eventId) {
      issues.push(`事件 ${eventId} 的 ${label} scheduledEvents 不能直接回指自身`);
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
  if (statEntries.length === 0) issues.push(`事件 ${event.id} 选项 ${index + 1} 的 check 缺少属性权重`);
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
  validateScheduledEvents(event.id, `选项 ${index + 1}`, option.scheduledEvents);
  validateScheduledEvents(event.id, `选项 ${index + 1} 成功分支`, check.success?.scheduledEvents);
  validateScheduledEvents(event.id, `选项 ${index + 1} 失败分支`, check.failure?.scheduledEvents);

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
for (const event of randomEvents) {
  if (randomMap.has(event.id)) issues.push(`随机事件重复 ID: ${event.id}`);
  randomMap.set(event.id, event);
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
      if (!map.has(targetId) && !randomMap.has(targetId)) issues.push(`事件 ${event.id} 的目标不存在: ${targetId}`);
    }
    validateRandomTargets(event.id, `选项 ${index + 1}`, option.randomTargets);
    validateScheduledEvents(event.id, `选项 ${index + 1}`, option.scheduledEvents);
    validateCheck(event, option, index);
    if (option.specialty && !gameData.specialties?.[option.specialty]) {
      issues.push(`事件 ${event.id} 选项 ${index + 1} 使用了未知 specialty: ${option.specialty}`);
    }
  }
}

const adjacency = new Map(events.map((event) => [event.id, []]));
for (const event of events) {
  for (const option of event.options || []) {
    for (const targetId of collectTargets(option)) {
      if (map.has(targetId)) adjacency.get(event.id).push(targetId);
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
  for (const to of targets) reverse.get(to)?.push(from);
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
if (!map.has(gameData.startEventId)) issues.push(`startEventId 不存在: ${gameData.startEventId}`);
const startEvent = map.get(gameData.startEventId);
if (!startEvent || !/985/.test(`${startEvent.title || ''}${startEvent.text || ''}`)) {
  issues.push(`startEventId 未直接指向 985 医学院开局: ${gameData.startEventId}`);
}
if (reachableEndings.length < 1) issues.push('没有可达结局');
if (events.length < 70) issues.push(`事件总数不足 70，当前 ${events.length}`);
if (events.filter((event) => event.type === 'ending').length < 14) issues.push('结局总数不足 14');
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
const weakStats = { health: 50, stress: 90, money: 30, skill: 10, research: 50, network: 50, ethics: 50, legalRisk: 80 };
const strongStats = { health: 50, stress: 10, money: 70, skill: 90, research: 50, network: 50, ethics: 50, legalRisk: 10 };
const lowChance = checkSystem.computeCheckDetails(probabilityTestCheck, weakStats).chance;
const highChance = checkSystem.computeCheckDetails(probabilityTestCheck, strongStats).chance;
const cappedLow = checkSystem.computeCheckDetails(probabilityTestCheck, { health: 50, stress: 100, money: 20, skill: 0, research: 50, network: 50, ethics: 50, legalRisk: 100 }).chance;
const cappedHigh = checkSystem.computeCheckDetails(probabilityTestCheck, { health: 50, stress: 0, money: 80, skill: 100, research: 50, network: 50, ethics: 50, legalRisk: 0 }).chance;
if (!(highChance > lowChance)) issues.push(`概率测试失败：高属性未提升成功率（${lowChance}% -> ${highChance}%）`);
if (cappedLow !== 25) issues.push(`概率测试失败：下限未生效（得到 ${cappedLow}%）`);
if (cappedHigh !== 75) issues.push(`概率测试失败：上限未生效（得到 ${cappedHigh}%）`);

for (const event of events) {
  if (!event.major) continue;
  const safeOptions = (event.options || []).filter((option) => option.safeChoice === true || option.label === '稳妥');
  if (safeOptions.length === 0) {
    issues.push(`重大事件 ${event.id} 缺少安全选项`);
    continue;
  }
  for (const safe of safeOptions) {
    if (safe.check) {
      const details = checkSystem.computeCheckDetails(safe.check, DEFAULT_STATS);
      if (!details || details.chance < 65) issues.push(`重大事件 ${event.id} 的安全选项默认成功率不足 65%（当前 ${details ? details.chance : 'N/A'}%）`);
    }
  }
}

if (!Array.isArray(randomEvents) || randomEvents.length < 160) {
  issues.push(`随机事件不足 160 个，当前 ${Array.isArray(randomEvents) ? randomEvents.length : 0}`);
}
const validRarities = new Set(['common', 'uncommon', 'rare', 'very-rare']);
const stageMins = { undergrad: 18, graduate: 14, training: 12, resident: 45, senior: 22 };
const stageCounts = {};
for (const re of randomEvents) {
  if (!re || typeof re !== 'object') {
    issues.push('随机事件存在非法条目');
    continue;
  }
  if (map.has(re.id)) issues.push(`随机事件 ID 与主事件冲突: ${re.id}`);
  if (!re.stage || !gameData.stages?.[re.stage]) {
    issues.push(`随机事件 ${re.id} 的 stage 非法: ${re.stage}`);
  } else {
    stageCounts[re.stage] = (stageCounts[re.stage] || 0) + 1;
  }
  if (typeof re.weight !== 'number' || re.weight <= 0) issues.push(`随机事件 ${re.id} 的 weight 非法`);
  if (re.rarity && !validRarities.has(re.rarity)) issues.push(`随机事件 ${re.id} 的 rarity 非法: ${re.rarity}`);
  if (!map.has(re.returnTo)) issues.push(`随机事件 ${re.id} 的 returnTo 目标不存在: ${re.returnTo}`);
  const reOptions = re.options || [];
  if (reOptions.length < 2 || reOptions.length > 4) issues.push(`随机事件 ${re.id} 选项数不在 2-4: ${reOptions.length}`);
  for (const [index, option] of reOptions.entries()) {
    const hasEffect = option.effects && typeof option.effects === 'object';
    const hasFlags = Array.isArray(option.flagsSet) && option.flagsSet.length > 0;
    if (!hasEffect && !hasFlags && !option.check && !option.target) {
      issues.push(`随机事件 ${re.id} 选项 ${index + 1} 缺少 effects/flagsSet/check/target`);
    }
    if (option.check) {
      const normalized = checkSystem.normalizeCheck(option.check);
      if (!normalized) issues.push(`随机事件 ${re.id} 选项 ${index + 1} 的 check 非法`);
      if (Object.keys(option.check.stats || {}).length === 0) issues.push(`随机事件 ${re.id} 选项 ${index + 1} 的 check 缺少属性权重`);
    }
    validateScheduledEvents(re.id, `随机选项 ${index + 1}`, option.scheduledEvents);
  }
}
for (const [stage, min] of Object.entries(stageMins)) {
  if ((stageCounts[stage] || 0) < min) issues.push(`随机事件 ${stage} 阶段不足 ${min} 个，当前 ${stageCounts[stage] || 0}`);
}

visitContainers(events, (container, event) => {
  if (container.retry) {
    const retry = container.retry;
    if (typeof retry.maxAttempts !== 'number' || retry.maxAttempts < 1 || retry.maxAttempts > 5) issues.push(`事件 ${event.id} 的 retry.maxAttempts 非法`);
    if (!container.check) issues.push(`事件 ${event.id} 配置了 retry 但缺少 check`);
    if (!retry.alternativeTarget || !map.has(retry.alternativeTarget)) issues.push(`事件 ${event.id} 的 retry.alternativeTarget 不存在: ${retry.alternativeTarget}`);
  }
});

for (const endingId of FINANCE_ENDINGS) {
  const target = map.get(endingId);
  if (!target || target.type !== 'ending') issues.push(`财务结局缺失或类型错误: ${endingId}`);
}
if (!randomMap.has('re_forced_financial_crisis')) issues.push('缺少财务危机事件 re_forced_financial_crisis');
if (!randomMap.has('re_financial_recovery_window')) issues.push('缺少财务恢复事件 re_financial_recovery_window');

const specialtyProfiles = gameData.specialties || {};
const specialtyIds = Object.keys(specialtyProfiles);
if (specialtyIds.length < 12) issues.push(`specialty 数量不足 12，当前 ${specialtyIds.length}`);
for (const [id, profile] of Object.entries(specialtyProfiles)) {
  for (const field of REQUIRED_SPECIALTY_FIELDS) {
    if (!(field in profile)) issues.push(`specialty ${id} 缺少字段 ${field}`);
  }
  const relatedCount = randomEvents.filter((event) => event.id.startsWith(`re_sp_${id}_`)).length;
  if (relatedCount < 3) issues.push(`specialty ${id} 的专属事件不足 3 个，当前 ${relatedCount}`);
}

const flagSets = new Map(KEY_FLAGS.map((flag) => [flag, 0]));
const flagReads = new Map(KEY_FLAGS.map((flag) => [flag, 0]));
visitContainers(events, (container) => {
  for (const flag of container.flagsSet || []) if (flagSets.has(flag)) flagSets.set(flag, flagSets.get(flag) + 1);
});
visitContainers(events, (container) => {
  const reads = new Set();
  collectFlagReads(container.conditions, reads);
  for (const flag of reads) if (flagReads.has(flag)) flagReads.set(flag, flagReads.get(flag) + 1);
});
visitContainers(randomEvents, (container) => {
  const reads = new Set();
  collectFlagReads(container.conditions, reads);
  for (const flag of container.flagsSet || []) if (flagSets.has(flag)) flagSets.set(flag, flagSets.get(flag) + 1);
  for (const flag of reads) if (flagReads.has(flag)) flagReads.set(flag, flagReads.get(flag) + 1);
});
for (const event of randomEvents) {
  const reads = new Set();
  collectFlagReads(event.conditions, reads);
  collectFlagReads({ requireFlags: event.requireFlags, forbidFlags: event.forbidFlags }, reads);
  for (const flag of reads) if (flagReads.has(flag)) flagReads.set(flag, flagReads.get(flag) + 1);
}
for (const flag of KEY_FLAGS) {
  if ((flagSets.get(flag) || 0) < 1) issues.push(`关键 flag 缺少设置来源: ${flag}`);
  if ((flagReads.get(flag) || 0) < 1) issues.push(`关键 flag 缺少消费位置: ${flag}`);
}

visitContainers(events, (container, event, branchType) => {
  const money = container.effects?.money;
  if (money !== undefined && (money < -25 || money > 25)) issues.push(`事件 ${event.id} 的 ${branchType} money 超出新量纲: ${money}`);
});
visitContainers(randomEvents, (container, event, branchType) => {
  const money = container.effects?.money;
  if (money !== undefined && (money < -25 || money > 25)) issues.push(`随机事件 ${event.id} 的 ${branchType} money 超出新量纲: ${money}`);
});

const readme = fs.readFileSync(path.join(__dirname, '..', 'README.md'), 'utf8');
for (const keyword of ['百分制', '财务危机', '科室', '必然后果', '重大抉择']) {
  if (!readme.includes(keyword)) issues.push(`README 缺少关键词说明: ${keyword}`);
}
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
for (const id of ['timeline-banner', 'specialty-tag', 'origin-tag', 'major-tag']) {
  if (!html.includes(`id="${id}"`)) issues.push(`index.html 缺少 UI 元素: ${id}`);
}
const css = fs.readFileSync(path.join(__dirname, '..', 'styles.css'), 'utf8');
if (!css.includes('[hidden]')) issues.push('styles.css 缺少 [hidden] 修复');
if (!css.includes('prefers-reduced-motion')) issues.push('styles.css 缺少 reduced motion 处理');
if (!css.includes('.timeline-banner')) issues.push('styles.css 缺少年份横幅样式');

function evaluateConditions(conditions, state) {
  if (!conditions) return true;
  if (conditions.flags) for (const flag of conditions.flags) if (!state.flags[flag]) return false;
  if (conditions.requireFlags) for (const flag of conditions.requireFlags) if (!state.flags[flag]) return false;
  for (const flag of conditions.notFlags || []) if (state.flags[flag]) return false;
  for (const flag of conditions.forbidFlags || []) if (state.flags[flag]) return false;
  if (conditions.anyFlags?.length && !conditions.anyFlags.some((flag) => state.flags[flag])) return false;
  if (conditions.stats) {
    for (const [key, range] of Object.entries(conditions.stats)) {
      const value = state.stats[key];
      if (typeof range.min === 'number' && value < range.min) return false;
      if (typeof range.max === 'number' && value > range.max) return false;
    }
  }
  const specialties = conditions.specialties || (typeof conditions.specialty === 'string' ? [conditions.specialty] : conditions.specialty);
  if (specialties?.length && !specialties.includes(state.specialty)) return false;
  return true;
}

function applyEffects(state, effects) {
  if (!effects) return;
  for (const [stat, delta] of Object.entries(effects)) {
    if (!(stat in state.stats)) continue;
    const [min, max] = gameData.statBounds[stat];
    state.stats[stat] = checkSystem.clamp(state.stats[stat] + delta, min, max);
  }
}

function applyFlags(state, flags) {
  for (const flag of flags || []) state.flags[flag] = true;
}

function queueScheduled(state, entries) {
  for (const item of entries || []) {
    state.scheduled.push({
      turns: Math.max(0, Math.round(item.turns ?? item.delay ?? 0)),
      eventId: item.eventId,
      once: !!item.once,
      source: item.source || '',
      conditions: item.conditions || null
    });
  }
}

function eligibleRandomEvents(state) {
  return randomEvents.filter((event) => {
    if (event.stage !== state.stage) return false;
    if (state.seenRandom.has(event.id)) return false;
    const conditions = { ...(event.conditions || {}), requireFlags: [...(event.conditions?.requireFlags || []), ...(event.requireFlags || [])], forbidFlags: [...(event.conditions?.forbidFlags || []), ...(event.forbidFlags || [])] };
    return evaluateConditions(conditions, state);
  });
}

function pickWeighted(items) {
  const total = items.reduce((sum, item) => sum + (item.weight || 1), 0);
  let point = Math.random() * total;
  for (const item of items) {
    point -= (item.weight || 1);
    if (point <= 0) return item;
  }
  return items[items.length - 1];
}

function chooseOption(event, state, desiredSpecialty) {
  const available = (event.options || []).filter((option) => !option.conditions || evaluateConditions(option.conditions, state));
  if (!available.length) return null;
  if (event.id === 'specialty_direction_choice') {
    const profile = specialtyProfiles[desiredSpecialty];
    return available.find((option) => option.target === `specialty_${profile.group}_choice`) || available[0];
  }
  if (event.id.startsWith('specialty_') && event.id.endsWith('_choice')) {
    return available.find((option) => option.specialty === desiredSpecialty) || available[0];
  }
  if (event.id === gameData.startEventId) {
    return available[Math.floor(Math.random() * available.length)];
  }
  const safe = available.filter((option) => option.safeChoice || option.label === '稳妥');
  if (safe.length && Math.random() < 0.35) return safe[Math.floor(Math.random() * safe.length)];
  return available[Math.floor(Math.random() * available.length)];
}

function resolveBranch(option, state) {
  if (!option.check) return { targetId: option.target, container: option, success: null };
  const details = checkSystem.computeCheckDetails(option.check, state.stats);
  const roll = Math.floor(Math.random() * 100) + 1;
  const success = roll <= details.chance;
  const branch = success ? option.check.success : option.check.failure;
  return { targetId: branch.target, container: branch, success };
}

function triggerFinanceCrisis(state) {
  state.financialCrises += 1;
  state.inRandom = true;
  state.randomReturnTo = state.currentEventId;
  state.currentEventId = 're_forced_financial_crisis';
  state.stage = randomMap.get('re_forced_financial_crisis').stage;
  state.seenRandom.add('re_forced_financial_crisis');
}

function maybeTriggerScheduled(state) {
  const nextQueue = [];
  let triggered = null;
  for (const item of state.scheduled) {
    if (triggered) {
      nextQueue.push(item);
      continue;
    }
    const turns = item.turns - 1;
    const signature = `${item.eventId}:${item.source}`;
    if (turns <= 0 && evaluateConditions(item.conditions, state)) {
      if (item.once && state.scheduledHistory.has(signature)) continue;
      if (item.once) state.scheduledHistory.add(signature);
      triggered = { ...item, turns };
    } else {
      nextQueue.push({ ...item, turns });
    }
  }
  state.scheduled = nextQueue;
  if (!triggered) return false;
  state.inRandom = true;
  state.randomReturnTo = state.currentEventId;
  state.currentEventId = triggered.eventId;
  state.stage = randomMap.get(triggered.eventId)?.stage || state.stage;
  state.seenRandom.add(triggered.eventId);
  return true;
}

function simulateRun(desiredSpecialty) {
  const state = {
    currentEventId: gameData.startEventId,
    stage: gameData.startStage || map.get(gameData.startEventId)?.stage,
    stats: { ...DEFAULT_STATS },
    flags: {},
    scheduled: [],
    scheduledHistory: new Set(),
    seenRandom: new Set(),
    randomReturnTo: null,
    inRandom: false,
    age: 18,
    careerYear: 1,
    specialty: null,
    financialCrises: 0,
    retryState: {}
  };

  for (let steps = 0; steps < 90; steps += 1) {
    const event = map.get(state.currentEventId) || randomMap.get(state.currentEventId);
    if (!event) return { endingId: null, specialty: state.specialty, financialCrises: state.financialCrises };
    if (event.type === 'ending') return { endingId: event.id, specialty: state.specialty, financialCrises: state.financialCrises };

    const option = chooseOption(event, state, desiredSpecialty);
    if (!option) return { endingId: null, specialty: state.specialty, financialCrises: state.financialCrises };
    applyEffects(state, option.effects);
    applyFlags(state, option.flagsSet);
    if (option.specialty) state.specialty = option.specialty;
    queueScheduled(state, option.scheduledEvents);

    const deltaYear = typeof option.yearDelta === 'number' ? option.yearDelta : (event.yearDelta || 0);
    let targetId = option.target;
    let retriedStay = false;

    if (option.check) {
      const branchResult = resolveBranch(option, state);
      targetId = branchResult.targetId;
      applyEffects(state, branchResult.container.effects);
      applyFlags(state, branchResult.container.flagsSet);
      if (branchResult.container.specialty) state.specialty = branchResult.container.specialty;
      queueScheduled(state, branchResult.container.scheduledEvents);
      if (option.retry && !state.inRandom && branchResult.success === false) {
        const record = state.retryState[event.id] || { attempts: 0, bonus: 0 };
        record.attempts += 1;
        state.retryState[event.id] = record;
        if (record.attempts < option.retry.maxAttempts) {
          retriedStay = true;
          targetId = event.id;
        } else {
          targetId = option.retry.alternativeTarget;
          delete state.retryState[event.id];
        }
      }
    }

    if (state.inRandom) {
      state.currentEventId = targetId || state.randomReturnTo || event.returnTo || gameData.fallbackEndingId;
      state.inRandom = false;
      state.randomReturnTo = null;
    } else {
      state.currentEventId = targetId || gameData.fallbackEndingId;
    }

    const targetEvent = map.get(state.currentEventId) || randomMap.get(state.currentEventId);
    state.stage = targetEvent?.stage || state.stage;
    if (!retriedStay && deltaYear > 0) {
      state.age += deltaYear;
      state.careerYear += deltaYear;
    }

    if (state.stats.money <= 0 && !state.inRandom) {
      triggerFinanceCrisis(state);
      continue;
    }

    if (!retriedStay && maybeTriggerScheduled(state)) continue;
    if (!retriedStay && Math.random() < RANDOM_EVENT_CHANCE) {
      const candidates = eligibleRandomEvents(state);
      if (candidates.length) {
        const chosen = pickWeighted(candidates);
        state.inRandom = true;
        state.randomReturnTo = state.currentEventId;
        state.currentEventId = chosen.id;
        state.stage = chosen.stage;
        state.seenRandom.add(chosen.id);
      }
    }
  }

  return { endingId: null, specialty: state.specialty, financialCrises: state.financialCrises };
}

const specialtyResults = {};
const endingSet = new Set();
let totalRuns = 0;
let financeEndingRuns = 0;
for (const specialtyId of specialtyIds) {
  const results = [];
  for (let i = 0; i < 20; i += 1) {
    const result = simulateRun(specialtyId);
    results.push(result);
    totalRuns += 1;
    if (result.endingId) endingSet.add(result.endingId);
    if (FINANCE_ENDINGS.has(result.endingId)) financeEndingRuns += 1;
  }
  specialtyResults[specialtyId] = results;
  const specialtyEndingCount = new Set(results.map((item) => item.endingId).filter(Boolean)).size;
  const hasNormalEnding = results.some((item) => item.endingId && !String(item.endingId).includes('crisis') && !FINANCE_ENDINGS.has(item.endingId));
  if (specialtyEndingCount < 1) issues.push(`specialty ${specialtyId} 模拟未跑到结局`);
  if (!hasNormalEnding) issues.push(`specialty ${specialtyId} 模拟缺少正常可达结局`);
}
if (endingSet.size < 7) issues.push(`批量模拟结局多样性不足，当前仅 ${endingSet.size} 种`);
if (financeEndingRuns / totalRuns > 0.35) issues.push(`财务结局占比过高：${financeEndingRuns}/${totalRuns}`);

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
console.log(`specialty 模拟覆盖: ${specialtyIds.length} 个方向，结局 ${endingSet.size} 种，财务结局 ${financeEndingRuns}/${totalRuns}`);
