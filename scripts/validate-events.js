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
const DEFAULT_STATS = { health: 80, stress: 20, money: 55, skill: 10, research: 5, network: 8, ethics: 70, legalRisk: 5, strength: 35 };
const RANDOM_EVENT_CHANCE = 0.25;
const REQUIRED_SPECIALTY_FIELDS = ['name', 'group', 'intensity', 'dispute', 'learning', 'procedure', 'research', 'demand', 'income', 'control', 'risk', 'opportunity'];
const KEY_FLAGS = ['questionable_research', 'record_shortcut', 'ai_overtrust', 'over_controlled_cost', 'has_child', 'grassroots_path', 'tier3_path'];
const FINANCE_ENDINGS = new Set(['ending_finance_debt_loop', 'ending_finance_forced_exit']);
const POSITIVE_FINANCE_ENDINGS = new Set(['ending_financial_freedom', 'ending_financial_freedom_teaching']);
const RELATIONSHIP_STAGES = ['single', 'met', 'interested', 'dating', 'committed', 'cohabiting', 'engaged_or_discussing_marriage', 'married_or_long_term_partner'];
const SPECIALTY_CHAPTER_QUOTA = 3;
const REGIONAL_CHAPTER_QUOTA = 5;
const CLINICAL_TITLES = ['resident', 'attending', 'associate_chief', 'chief', 'dept_head'];
const careerMeta = gameData.careerMeta || {};
const careerEnums = Object.fromEntries(
  Object.entries(careerMeta.enums || {}).map(([key, values]) => [key, new Set(values)])
);
const tierCoverage = {
  hospitalTier: new Set(),
  cityTier: new Set()
};

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

function applyCareer(state, container) {
  if (!container || typeof container !== 'object') return;
  const updates = { ...(container.career || {}) };
  for (const key of Object.keys(careerEnums)) {
    if (Object.prototype.hasOwnProperty.call(container, key)) updates[key] = container[key];
  }
  for (const [key, value] of Object.entries(updates)) {
    if (value == null || careerEnums[key]?.has(value)) {
      state[key] = value ?? null;
    }
  }
}

function validateCareerEnums(eventId, label, container) {
  if (!container || typeof container !== 'object') return;
  const updates = { ...(container.career || {}) };
  for (const key of Object.keys(careerEnums)) {
    if (Object.prototype.hasOwnProperty.call(container, key)) updates[key] = container[key];
  }
  for (const [key, value] of Object.entries(updates)) {
    if (value == null) continue;
    if (!careerEnums[key]?.has(value)) issues.push(`事件 ${eventId} 的 ${label} 使用了非法 career 枚举 ${key}: ${value}`);
  }
}

function validateConditionEnums(eventId, conditions) {
  if (!conditions) return;
  const mapList = [
    ['requireUndergradTier', 'undergradInstitutionTier'],
    ['requireHospitalTier', 'hospitalTier'],
    ['forbidHospitalTier', 'hospitalTier'],
    ['requireHospitalType', 'hospitalType'],
    ['requireCityTier', 'cityTier'],
    ['requireGraduateTier', 'graduateInstitutionTier'],
    ['requireCareerTitle', 'careerTitle']
  ];
  for (const [condKey, enumKey] of mapList) {
    if (!conditions[condKey]) continue;
    if (!Array.isArray(conditions[condKey]) || !conditions[condKey].length) {
      issues.push(`事件 ${eventId} 的条件 ${condKey} 非法`);
      continue;
    }
    for (const value of conditions[condKey]) {
      if (!careerEnums[enumKey]?.has(value)) {
        issues.push(`事件 ${eventId} 的条件 ${condKey} 使用了非法枚举值: ${value}`);
      } else if (condKey === 'requireHospitalTier' || condKey === 'requireCityTier') {
        tierCoverage[enumKey].add(value);
      }
    }
  }
  if (conditions.anyStats) {
    if (!Array.isArray(conditions.anyStats) || !conditions.anyStats.length) {
      issues.push(`事件 ${eventId} 的条件 anyStats 非法`);
    } else {
      for (const ranges of conditions.anyStats) {
        for (const stat of Object.keys(ranges || {})) {
          if (!validStats.has(stat)) issues.push(`事件 ${eventId} 的 anyStats 使用了未知属性 ${stat}`);
        }
      }
    }
  }
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
  if (event.type !== 'ending' && (options.length < 2 || options.length > 5)) {
    issues.push(`事件 ${event.id} 选项数不在 2-5: ${options.length}`);
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
    validateCareerEnums(event.id, `选项 ${index + 1}`, option);
    validateCareerEnums(event.id, `选项 ${index + 1} success`, option.check?.success);
    validateCareerEnums(event.id, `选项 ${index + 1} failure`, option.check?.failure);
    validateConditionEnums(`${event.id} 选项 ${index + 1}`, option.conditions);
    if (option.specialty && !gameData.specialties?.[option.specialty]) {
      issues.push(`事件 ${event.id} 选项 ${index + 1} 使用了未知 specialty: ${option.specialty}`);
    }
  }
}

// ===== 需求4：高收益（skill/research/network 单次 >=5）必须伴随可辨识代价 =====
function hasRecognizedCost(effects, option) {
  if (!effects) return false;
  return (effects.health || 0) < 0
    || (effects.stress || 0) > 0
    || (effects.money || 0) < 0
    || (effects.ethics || 0) < 0
    || (effects.legalRisk || 0) > 0
    || (typeof option?.yearDelta === 'number' && option.yearDelta > 0)
    || (Array.isArray(option?.scheduledEvents) && option.scheduledEvents.length > 0)
    || Boolean(option?.delayed);
}
function validateHighGainCost(eventId, label, effects, option) {
  if (!effects) return;
  const gainKeys = ['skill', 'research', 'network'].filter((key) => (effects[key] || 0) >= 5);
  if (!gainKeys.length) return;
  if (!hasRecognizedCost(effects, option)) {
    issues.push(`事件 ${eventId} ${label} 高收益(${gainKeys.join('/')})缺少代价（health/stress/money/ethics/legalRisk/yearDelta/scheduled 之一）`);
  }
}
for (const event of [...events, ...randomEvents]) {
  for (const [index, option] of (event.options || []).entries()) {
    validateHighGainCost(event.id, `选项 ${index + 1}`, option.effects, option);
    if (option.check) {
      validateHighGainCost(event.id, `选项 ${index + 1} check-failure`, option.check.failure?.effects, option);
      // check-success 分支的收益已由失败分支的真实风险覆盖，因此不单独要求代价
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

// ===== 需求5：晋升长链（副高 → 主任医师 → 科室负责人）可达性 =====
const PROMOTION_CHAIN_EVENTS = [
  'career_mobility_county_chief', 'promotion_gate', 'chief_competition', 'promotion_setback',
  'assoc_subspecialty_focus', 'assoc_duty_portfolio', 'assoc_faction_alignment',
  'chief_title_qualification', 'chief_title_review', 'chief_title_setback', 'chief_title_outcome',
  'dept_head_competition', 'dept_head_coordination', 'dept_head_external_recruit', 'dept_head_outcome',
  'ending_department_chief', 'ending_county_dept_head', 'ending_chief_physician_expert',
  'ending_dept_head_builder', 'ending_dept_head_handover', 'ending_dept_head_reckoning'
];
const promotionChainPresent = PROMOTION_CHAIN_EVENTS.filter((id) => map.has(id));
const promotionChainReachable = promotionChainPresent.filter((id) => reachable.has(id));
if (promotionChainPresent.length < PROMOTION_CHAIN_EVENTS.length) {
  issues.push(`晋升链事件缺失: ${PROMOTION_CHAIN_EVENTS.filter((id) => !map.has(id)).join(', ')}`);
}
if (promotionChainReachable.length < 8) {
  issues.push(`晋升链实际可达事件不足 8 个，当前 ${promotionChainReachable.length}`);
}
const promotionEndingIds = ['ending_department_chief', 'ending_county_dept_head', 'ending_chief_physician_expert', 'ending_dept_head_builder', 'ending_dept_head_handover', 'ending_dept_head_reckoning'];
const promotionEndingsReachable = promotionEndingIds.filter((id) => reachable.has(id) && map.has(id));
if (promotionEndingsReachable.length < 3) {
  issues.push(`晋升链结局可达数量不足 3 个，当前 ${promotionEndingsReachable.length}`);
}

// ===== 需求3：早期经济压力/转行与私立路线可达性 =====
const CAREER_SWITCH_EVENTS = [
  'career_mobility_window', 'career_mobility_private', 'private_track',
  'career_switch_gateway', 'career_switch_industry_pick', 'career_switch_private_pick',
  'career_switch_public_pick', 'career_switch_probation', 'career_switch_settled', 'career_switch_unemployed'
];
const CAREER_SWITCH_SUCCESS_ENDINGS = [
  'ending_switch_industry_lead', 'ending_switch_ops_stable', 'ending_switch_content_editor',
  'ending_switch_return_clinic', 'ending_switch_reemployed', 'ending_switch_grassroots_return',
  'ending_switch_freelance', 'ending_premium_private_expert'
];
const CAREER_SWITCH_FAILURE_ENDINGS = [
  'ending_switch_probation_out', 'ending_switch_long_unemployed', 'ending_switch_gig_drift',
  'ending_finance_debt_loop', 'ending_finance_forced_exit'
];
const switchEventsMissing = CAREER_SWITCH_EVENTS.filter((id) => !map.has(id));
if (switchEventsMissing.length) issues.push(`转行/私立路线事件缺失: ${switchEventsMissing.join(', ')}`);
const switchEventsReachable = CAREER_SWITCH_EVENTS.filter((id) => reachable.has(id));
if (switchEventsReachable.length < CAREER_SWITCH_EVENTS.length) {
  issues.push(`转行/私立路线事件不可达: ${CAREER_SWITCH_EVENTS.filter((id) => !reachable.has(id)).join(', ')}`);
}
const switchSuccessReachable = CAREER_SWITCH_SUCCESS_ENDINGS.filter((id) => map.has(id) && reachable.has(id));
if (switchSuccessReachable.length < 3) {
  issues.push(`转行/私立正向结局可达数量不足 3 个，当前 ${switchSuccessReachable.length}`);
}
const switchFailureReachable = CAREER_SWITCH_FAILURE_ENDINGS.filter((id) => map.has(id) && reachable.has(id));
if (switchFailureReachable.length < 3) {
  issues.push(`转行/私立失败（试用期淘汰/裁撤/失业等）结局可达数量不足 3 个，当前 ${switchFailureReachable.length}`);
}
const RECOVERY_AFTER_FAILURE_EVENTS = ['career_switch_unemployed'];
for (const id of RECOVERY_AFTER_FAILURE_EVENTS) {
  const event = map.get(id);
  if (!event) continue;
  const recoveryOptions = (event.options || []).filter((option) => option.check || option.target);
  if (recoveryOptions.length < 2) {
    issues.push(`失败恢复事件 ${id} 缺少足够的再就业/恢复路线选项`);
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
  validateConditionEnums(`随机事件 ${re.id}`, re.conditions);
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
    validateCareerEnums(re.id, `随机选项 ${index + 1}`, option);
    validateCareerEnums(re.id, `随机选项 ${index + 1} success`, option.check?.success);
    validateCareerEnums(re.id, `随机选项 ${index + 1} failure`, option.check?.failure);
    validateConditionEnums(`随机事件 ${re.id} 选项 ${index + 1}`, option.conditions);
  }
}
for (const [stage, min] of Object.entries(stageMins)) {
  if ((stageCounts[stage] || 0) < min) issues.push(`随机事件 ${stage} 阶段不足 ${min} 个，当前 ${stageCounts[stage] || 0}`);
}
const contextConditionKeys = ['requireUndergradTier', 'requireHospitalTier', 'forbidHospitalTier', 'requireCityTier', 'requireGraduateTier', 'requireCareerTitle'];
const contextEventCount = randomEvents.filter((event) => contextConditionKeys.some((key) => event.conditions?.[key]?.length)).length;
if (contextEventCount < 60) issues.push(`带职业上下文条件的随机事件不足 60 个，当前 ${contextEventCount}`);
for (const value of careerEnums.cityTier || []) {
  if (!tierCoverage.cityTier.has(value)) issues.push(`缺少覆盖城市层级 ${value} 的上下文随机事件`);
}
for (const value of careerEnums.hospitalTier || []) {
  if (!tierCoverage.hospitalTier.has(value)) issues.push(`缺少覆盖医院层级 ${value} 的上下文随机事件`);
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
for (const eventId of ['hospital_job_application', 'hospital_tier_fallback', 'career_mobility_window', 'career_mobility_private', 'career_mobility_county_chief']) {
  if (!map.has(eventId)) issues.push(`缺少关键职业路径事件: ${eventId}`);
}
for (const endingId of ['ending_county_dept_head', 'ending_premium_private_expert', 'ending_regional_backbone', 'ending_talent_return']) {
  if (!map.has(endingId)) issues.push(`缺少新增职业结局: ${endingId}`);
}
function hasCareerPayload(container, fields) {
  const updates = { ...(container?.career || {}) };
  for (const key of Object.keys(careerEnums)) {
    if (container && Object.prototype.hasOwnProperty.call(container, key)) updates[key] = container[key];
  }
  return fields.every((field) => Object.prototype.hasOwnProperty.call(updates, field));
}
const hospitalJobEvent = map.get('hospital_job_application');
for (const [index, option] of (hospitalJobEvent?.options || []).entries()) {
  const branch = option.check ? option.check.success : option;
  if (!hasCareerPayload(branch, ['cityTier', 'hospitalTier', 'hospitalType', 'careerTitle'])) {
    issues.push(`hospital_job_application 选项 ${index + 1} 缺少完整职业字段更新`);
  }
}
const mobilityEvent = map.get('career_mobility_window');
for (const [index, option] of (mobilityEvent?.options || []).entries()) {
  if (index === 4) continue;
  const branch = option.check ? option.check.success : option;
  if (!hasCareerPayload(branch, ['cityTier', 'hospitalTier', 'hospitalType', 'careerTitle'])) {
    issues.push(`career_mobility_window 选项 ${index + 1} 缺少完整职业字段更新`);
  }
}

const specialtyProfiles = gameData.specialties || {};
const specialtyIds = Object.keys(specialtyProfiles);
if (specialtyIds.length < 12) issues.push(`specialty 数量不足 12，当前 ${specialtyIds.length}`);
const SPECIALTY_CHAPTER_MIN_EVENTS = 5;
const specialtyChapterEvents = new Map(specialtyIds.map((id) => [id, []]));
for (const event of randomEvents) {
  if (event.specialtyChapter && specialtyChapterEvents.has(event.specialtyChapter)) {
    specialtyChapterEvents.get(event.specialtyChapter).push(event);
  }
}
for (const [id, profile] of Object.entries(specialtyProfiles)) {
  for (const field of REQUIRED_SPECIALTY_FIELDS) {
    if (!(field in profile)) issues.push(`specialty ${id} 缺少字段 ${field}`);
  }
  const legacyCount = randomEvents.filter((event) => event.id.startsWith(`re_sp_${id}_`)).length;
  const chapterList = specialtyChapterEvents.get(id) || [];
  if (chapterList.length < SPECIALTY_CHAPTER_MIN_EVENTS) {
    issues.push(`specialty ${id} 的 specialtyChapter 专属事件不足 ${SPECIALTY_CHAPTER_MIN_EVENTS} 个，当前 ${chapterList.length}`);
  }
  for (const event of chapterList) {
    const requireFlags = event.requireFlags || [];
    if (!requireFlags.includes(`specialty_${id}`)) {
      issues.push(`specialtyChapter 事件 ${event.id} 未设置 requireFlags: specialty_${id}`);
    }
    if (!event.returnTo || !map.has(event.returnTo)) {
      issues.push(`specialtyChapter 事件 ${event.id} 的 returnTo 目标无效: ${event.returnTo}`);
    }
  }
  if (legacyCount < 3 && chapterList.length < 3) {
    issues.push(`specialty ${id} 的专属事件（旧+新）合计不足 3 个`);
  }
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
for (const keyword of ['百分制', '财务危机', '科室', '必然后果', '重大抉择', '游戏化抽象']) {
  if (!readme.includes(keyword)) issues.push(`README 缺少关键词说明: ${keyword}`);
}
for (const keyword of ['历史原型事件', '虚构', '架空', '体能/应急自保', '经济自由', '性别中性', '地市/县域/基层医院']) {
  if (!readme.includes(keyword)) issues.push(`README 缺少新功能说明: ${keyword}`);
}
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
for (const id of ['timeline-banner', 'specialty-tag', 'origin-tag', 'major-tag', 'resume-card', 'resume-list']) {
  if (!html.includes(`id="${id}"`)) issues.push(`index.html 缺少 UI 元素: ${id}`);
}
if (!html.includes('historical-events-toggle')) issues.push('index.html 缺少历史原型事件开关');
const css = fs.readFileSync(path.join(__dirname, '..', 'styles.css'), 'utf8');
if (!css.includes('[hidden]')) issues.push('styles.css 缺少 [hidden] 修复');
if (!css.includes('prefers-reduced-motion')) issues.push('styles.css 缺少 reduced motion 处理');
if (!css.includes('.timeline-banner')) issues.push('styles.css 缺少年份横幅样式');
if (!css.includes('.resume-list')) issues.push('styles.css 缺少履历卡样式');
if (!css.includes('.regional-tag')) issues.push('styles.css 缺少区域章节标签样式');
const eventsSource = fs.readFileSync(path.join(__dirname, '..', 'events.js'), 'utf8');

function evaluateConditions(conditions, state) {
  if (!conditions) return true;
  const matchStats = (ranges) => {
    for (const [key, range] of Object.entries(ranges || {})) {
      const value = state.stats[key];
      if (typeof range.min === 'number' && value < range.min) return false;
      if (typeof range.max === 'number' && value > range.max) return false;
    }
    return true;
  };
  if (conditions.flags) for (const flag of conditions.flags) if (!state.flags[flag]) return false;
  if (conditions.requireFlags) for (const flag of conditions.requireFlags) if (!state.flags[flag]) return false;
  for (const flag of conditions.notFlags || []) if (state.flags[flag]) return false;
  for (const flag of conditions.forbidFlags || []) if (state.flags[flag]) return false;
  if (conditions.anyFlags?.length && !conditions.anyFlags.some((flag) => state.flags[flag])) return false;
  if (conditions.stats && !matchStats(conditions.stats)) return false;
  if (conditions.anyStats?.length && !conditions.anyStats.some((ranges) => matchStats(ranges))) return false;
  const specialties = conditions.specialties || (typeof conditions.specialty === 'string' ? [conditions.specialty] : conditions.specialty);
  if (specialties?.length && !specialties.includes(state.specialty)) return false;
  if (conditions.requireUndergradTier && !conditions.requireUndergradTier.includes(state.undergradInstitutionTier)) return false;
  if (conditions.requireHospitalTier && !conditions.requireHospitalTier.includes(state.hospitalTier)) return false;
  if (conditions.forbidHospitalTier && conditions.forbidHospitalTier.includes(state.hospitalTier)) return false;
  if (conditions.requireHospitalType && !conditions.requireHospitalType.includes(state.hospitalType)) return false;
  if (conditions.requireCityTier && !conditions.requireCityTier.includes(state.cityTier)) return false;
  if (conditions.requireGraduateTier && !conditions.requireGraduateTier.includes(state.graduateInstitutionTier)) return false;
  if (conditions.requireCareerTitle && !conditions.requireCareerTitle.includes(state.careerTitle)) return false;
  if (typeof conditions.requireHistoricalRealNames === 'boolean' && !!state.settings?.historicalEventsRealNames !== conditions.requireHistoricalRealNames) return false;
  if (conditions.relationshipStages?.length && !conditions.relationshipStages.includes(state.romance?.stage || 'single')) return false;
  if (typeof conditions.minRelationshipInteractions === 'number' && (state.romance?.interactions || 0) < conditions.minRelationshipInteractions) return false;
  if (typeof conditions.minCohabitationCount === 'number' && (state.romance?.cohabitationCount || 0) < conditions.minCohabitationCount) return false;
  if (typeof conditions.minRealIssueCount === 'number' && (state.romance?.realIssueCount || 0) < conditions.minRealIssueCount) return false;
  if (typeof conditions.minRegionalChapterDone === 'number' && (state.regionalChapter?.done || 0) < conditions.minRegionalChapterDone) return false;
  if (typeof conditions.maxFinancialCrises === 'number' && (state.financialCrises || 0) > conditions.maxFinancialCrises) return false;
  return true;
}

const whistleIds = ['re_whistle_signal_real', 're_whistle_restriction_real', 're_whistle_role_real', 're_whistle_signal_fiction', 're_whistle_restriction_fiction', 're_whistle_role_fiction'];
const whistleEndingIds = ['ending_whistleblower', 'ending_suppressed_warning', 'ending_frontline_survivor', 'ending_health_crisis'];
for (const id of whistleIds) {
  const event = randomMap.get(id);
  if (!event) issues.push(`吹哨人事件链缺少节点: ${id}`);
  else if (!['resident', 'senior'].includes(event.stage)) issues.push(`吹哨人事件 ${id} 不应出现在住院医/高年资之前`);
}
for (const id of whistleEndingIds) {
  if (!map.has(id)) issues.push(`吹哨人结局缺失: ${id}`);
}

const retrialIds = ['re_retrial_night_case_real', 're_retrial_review_real', 're_retrial_second_instance_real', 're_retrial_night_case_fiction', 're_retrial_review_fiction', 're_retrial_second_instance_fiction'];
for (const id of retrialIds) {
  const event = randomMap.get(id);
  if (!event) issues.push(`再审事件链缺少节点: ${id}`);
  else if (!['resident', 'senior'].includes(event.stage)) issues.push(`再审事件 ${id} 不应出现在住院医/高年资之前`);
}
const fictionalRetrialEnding = map.get('ending_fictional_retrial_overturned');
if (!fictionalRetrialEnding) {
  issues.push('缺少架空再审改判结局');
} else {
  const markerText = `${fictionalRetrialEnding.title} ${fictionalRetrialEnding.text}`;
  if (!/(架空|虚构|alternate)/i.test(markerText)) issues.push('架空再审改判结局缺少“架空/虚构/alternate”标记');
}
const invalidAppealUse = /(?<!而不是“)(?<!不存在的“)继续上诉/.test(eventsSource);
if (invalidAppealUse) issues.push('事件文案包含错误法律表述“继续上诉”');
if (!eventsSource.includes('申诉/申请再审')) issues.push('事件文案缺少“申诉/申请再审”规范表述');

const violenceEvents = randomEvents.filter((event) => event.id.startsWith('re_violence_') && !event.id.includes('recovery'));
if (violenceEvents.length < 5) issues.push(`暴力风险事件不足 5 个，当前 ${violenceEvents.length}`);
for (const event of violenceEvents) {
  if (!['resident', 'senior'].includes(event.stage)) issues.push(`暴力风险事件 ${event.id} 只能出现在 resident/senior`);
  const checkOptions = (event.options || []).filter((option) => option.check);
  if (checkOptions.length) {
    const hasStrengthCheck = checkOptions.some((option) => typeof option.check?.stats?.strength === 'number' && option.check.stats.strength > 0);
    if (!hasStrengthCheck) issues.push(`暴力风险事件 ${event.id} 缺少 strength 正向判定`);
  }
}
const violenceChecks = violenceEvents.flatMap((event) => (event.options || []).map((option) => option.check).filter(Boolean));
if (violenceChecks.length) {
  const lowState = { ...DEFAULT_STATS, strength: 10 };
  const highState = { ...DEFAULT_STATS, strength: 85 };
  const avgLow = violenceChecks.reduce((sum, check) => sum + checkSystem.computeCheckDetails(check, lowState).chance, 0) / violenceChecks.length;
  const avgHigh = violenceChecks.reduce((sum, check) => sum + checkSystem.computeCheckDetails(check, highState).chance, 0) / violenceChecks.length;
  if (avgHigh <= avgLow + 6) issues.push(`strength 对暴力风险判定影响过弱：低体能 ${avgLow.toFixed(1)} vs 高体能 ${avgHigh.toFixed(1)}`);
}

const residencyMatch = map.get('residency_match');
if (!residencyMatch || !residencyMatch.options?.[3]?.text?.includes('地市中心医院/强二甲')) {
  issues.push('residency_match 第 4 个选项文案未保持“地市中心医院/强二甲”');
}
if (!eventsSource.includes("setCareerOnBranch('residency_match', 3, 'success', { cityTier: 'prefecture', hospitalTier: 'prefecture_tier3_strong2'")) {
  issues.push('residency_match 第 4 个选项成功分支未保持 prefecture_tier3_strong2');
}

function applyEffects(state, effects) {
  if (!effects) return;
  for (const [stat, delta] of Object.entries(effects)) {
    if (!(stat in state.stats)) continue;
    const [min, max] = gameData.statBounds[stat];
    const scaledDelta = checkSystem.DIMINISHING_STATS?.has(stat)
      ? checkSystem.applyDiminishingReturns(stat, state.stats[stat], delta, state.diminishingCarry)
      : delta;
    state.stats[stat] = checkSystem.clamp(state.stats[stat] + scaledDelta, min, max);
  }
}

function applyFlags(state, flags) {
  for (const flag of flags || []) state.flags[flag] = true;
}

function clearFlags(state, flags) {
  for (const flag of flags || []) delete state.flags[flag];
}

function createDefaultRomance(stage = 'single') {
  return {
    stage,
    interactions: stage === 'single' ? 0 : 1,
    stageInteractions: 0,
    cohabitationCount: 0,
    realIssueCount: 0,
    longDistance: false,
    reunionCount: 0,
    history: [stage]
  };
}

function getRelationshipStageIndex(stage) {
  return Math.max(0, RELATIONSHIP_STAGES.indexOf(stage));
}

function fillRelationshipHistory(state, targetStage) {
  state.romance = state.romance || createDefaultRomance();
  let currentIndex = getRelationshipStageIndex(state.romance.stage || 'single');
  const targetIndex = getRelationshipStageIndex(targetStage);
  while (currentIndex < targetIndex) {
    currentIndex += 1;
    const nextStage = RELATIONSHIP_STAGES[currentIndex];
    state.romance.history.push(nextStage);
  }
  state.romance.stage = targetStage;
  state.romance.history = state.romance.history.slice(-24);
}

function syncFamilyState(state) {
  if (state.flags.married && getRelationshipStageIndex(state.romance?.stage || 'single') < getRelationshipStageIndex('married_or_long_term_partner')) {
    state.romance = state.romance || createDefaultRomance();
    fillRelationshipHistory(state, 'married_or_long_term_partner');
  } else if (state.flags.has_partner && getRelationshipStageIndex(state.romance?.stage || 'single') < getRelationshipStageIndex('dating')) {
    state.romance = state.romance || createDefaultRomance();
    fillRelationshipHistory(state, 'dating');
    state.romance.interactions = Math.max(2, state.romance.interactions || 0);
  }
  const romanceStage = state.romance?.stage || 'single';
  const partnered = getRelationshipStageIndex(romanceStage) >= getRelationshipStageIndex('dating');
  const married = romanceStage === 'married_or_long_term_partner';
  if (partnered) state.flags.has_partner = true; else delete state.flags.has_partner;
  if (married) state.flags.married = true; else delete state.flags.married;
  state.family.partner = partnered || !!state.flags.dink;
  state.family.married = married;
  state.family.child = !!state.flags.has_child;
  state.family.dink = !!state.flags.dink;
  state.family.single = !!state.flags.single_choice && !partnered && !married;
}

function canAdvanceRelationship(state, targetStage) {
  const romance = state.romance || createDefaultRomance();
  if (targetStage === 'single') return true;
  const currentIndex = getRelationshipStageIndex(romance.stage);
  const targetIndex = getRelationshipStageIndex(targetStage);
  if (targetIndex <= currentIndex) return true;
  if (targetIndex > currentIndex + 1) return false;
  if (targetStage === 'committed' && romance.interactions < 2) return false;
  if (targetStage === 'engaged_or_discussing_marriage' && (romance.cohabitationCount < 1 || romance.realIssueCount < 1)) return false;
  if (targetStage === 'married_or_long_term_partner' && (romance.cohabitationCount < 1 || romance.realIssueCount < 2)) return false;
  return true;
}

function advanceRelationshipStage(state, targetStage) {
  if (!RELATIONSHIP_STAGES.includes(targetStage)) return false;
  state.romance = state.romance || createDefaultRomance();
  if (targetStage === 'single') {
    state.romance = createDefaultRomance('single');
    syncFamilyState(state);
    return true;
  }
  const currentIndex = getRelationshipStageIndex(state.romance.stage);
  const targetIndex = getRelationshipStageIndex(targetStage);
  if (targetIndex === currentIndex) return true;
  if (!canAdvanceRelationship(state, targetStage)) {
    if (targetIndex > currentIndex + 1) {
      targetStage = RELATIONSHIP_STAGES[currentIndex + 1];
    } else {
      return false;
    }
  }
  state.romance.stage = targetStage;
  state.romance.stageInteractions = 0;
  state.romance.history.push(targetStage);
  state.romance.history = state.romance.history.slice(-16);
  syncFamilyState(state);
  return true;
}

function queueChildDiscussionFollowup(state, years = 2) {
  state.family.childDecisionDeferred = true;
  state.childDeferralEver = true;
  state.family.nextChildDiscussionAge = state.age + years;
  state.scheduled.push({
    turns: 3,
    eventId: 're_child_discussion_followup',
    once: false,
    source: '你们把生育与家庭方案继续往后讨论。',
    conditions: { age: { min: state.family.nextChildDiscussionAge }, forbidFlags: ['dink', 'has_child', 'adopted_child', 'flag_dink_confirmed'] }
  });
}

function applyNarrativeState(state, container) {
  if (!container || typeof container !== 'object') return;
  if (container.romance && typeof container.romance === 'object') {
    state.romance = state.romance || createDefaultRomance();
    const romance = container.romance;
    if (romance.interaction) {
      const amount = romance.interaction === true ? 1 : Math.max(1, Math.round(romance.interaction));
      state.romance.interactions += amount;
      state.romance.stageInteractions += amount;
    }
    if (romance.cohabitation) state.romance.cohabitationCount += romance.cohabitation === true ? 1 : Math.max(1, Math.round(romance.cohabitation));
    if (romance.realIssue) state.romance.realIssueCount += romance.realIssue === true ? 1 : Math.max(1, Math.round(romance.realIssue));
    if (typeof romance.longDistance === 'boolean') state.romance.longDistance = romance.longDistance;
    if (romance.reunion) state.romance.reunionCount += romance.reunion === true ? 1 : Math.max(1, Math.round(romance.reunion));
    if (romance.breakup) {
      state.romance = createDefaultRomance('single');
    } else if (typeof romance.advanceTo === 'string') {
      advanceRelationshipStage(state, romance.advanceTo);
    }
  }
  if (container.family && typeof container.family === 'object') {
    const family = container.family;
    if (family.childDecision === 'defer') queueChildDiscussionFollowup(state, typeof family.delayYears === 'number' ? family.delayYears : 2);
    if (family.childDecision === 'child') {
      state.flags.has_child = true;
      state.family.childDecisionDeferred = false;
      state.family.nextChildDiscussionAge = null;
    }
    if (family.childDecision === 'adopt') {
      state.flags.has_child = true;
      state.flags.adopted_child = true;
      state.family.childDecisionDeferred = false;
      state.family.nextChildDiscussionAge = null;
    }
    if (family.childDecision === 'dink') {
      state.flags.dink = true;
      state.flags.flag_dink_confirmed = true;
      state.family.childDecisionDeferred = false;
      state.family.nextChildDiscussionAge = null;
    }
    if (family.clearDeferred) {
      state.family.childDecisionDeferred = false;
      state.family.nextChildDiscussionAge = null;
    }
  }
  syncFamilyState(state);
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
    if (state.seenRandom.has(event.id) && !event.repeatable) return false;
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
  if (!state.flags.has_partner && !state.flags.married) {
    const partnerStart = available.filter((option) => (option.flagsSet || []).includes('has_partner') || option.romance?.advanceTo === 'met' || option.romance?.advanceTo === 'interested' || option.romance?.advanceTo === 'dating');
    const singleOut = available.find((option) => (option.flagsSet || []).includes('single_choice'));
    if (partnerStart.length) {
      const roll = Math.random();
      if (roll < 0.84) return partnerStart[Math.floor(Math.random() * partnerStart.length)];
      if (singleOut && roll > 0.96) return singleOut;
    }
  }
  if (event.id === ROMANCE_GUARANTEE_EVENT_ID) {
    const positive = available.filter((option) => (option.flagsSet || []).includes('has_partner') || option.romance?.advanceTo);
    const single = available.find((option) => (option.flagsSet || []).includes('single_choice'));
    const roll = Math.random();
    if (positive.length && roll < 0.85) return positive[Math.floor(Math.random() * positive.length)];
    if (single) return single;
  }
  if (event.id === 're_marriage' || event.id === 're_marriage_resident') {
    const marry = available.filter((option) => (option.flagsSet || []).includes('married') || option.romance?.advanceTo === 'married_or_long_term_partner');
    if (marry.length && Math.random() < 0.82) return marry[Math.floor(Math.random() * marry.length)];
  }
  if (event.requireFlags?.includes('has_partner') && !event.forbidFlags?.includes('married')) {
    const partnerForward = available.filter((option) =>
      (option.flagsSet || []).includes('married') ||
      option.romance?.advanceTo === 'committed' ||
      option.romance?.advanceTo === 'cohabiting' ||
      option.romance?.advanceTo === 'engaged_or_discussing_marriage' ||
      option.romance?.advanceTo === 'married_or_long_term_partner' ||
      option.romance?.realIssue ||
      option.romance?.cohabitation
    );
    if (partnerForward.length && Math.random() < 0.68) return partnerForward[Math.floor(Math.random() * partnerForward.length)];
  }
  const advancingRomance = available.filter((option) => option.romance?.advanceTo && !option.romance?.breakup);
  if (advancingRomance.length && Math.random() < 0.58) {
    return advancingRomance[Math.floor(Math.random() * advancingRomance.length)];
  }
  if ((event.id === 're_child_choice' || event.id === 're_child_discussion_followup') && state.flags.married) {
    const child = available.find((option) => option.family?.childDecision === 'child' || (option.flagsSet || []).includes('has_child'));
    const defer = available.find((option) => option.family?.childDecision === 'defer');
    const dink = available.find((option) => option.family?.childDecision === 'dink' || (option.flagsSet || []).includes('dink'));
    const roll = Math.random();
    if (child && roll < 0.52) return child;
    if (defer && roll < 0.82) return defer;
    if (dink) return dink;
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
  if (!randomMap.get('re_forced_financial_crisis')?.repeatable) state.seenRandom.add('re_forced_financial_crisis');
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
  if (!randomMap.get(triggered.eventId)?.repeatable) state.seenRandom.add(triggered.eventId);
  return true;
}

const ROMANCE_GUARANTEE_AGE = 32;
const ROMANCE_GUARANTEE_EVENT_ID = 're_rm_guarantee_late';
const ROMANCE_SKIP_FLAGS = ['has_partner', 'single_choice', 'dink', 'romance_guarantee_used'];
const REGIONAL_TIERS = new Set(['prefecture_tier3_strong2', 'regular_tier2', 'county_basic']);

function applySpecialtyToState(state, specialtyId) {
  if (!specialtyId || !specialtyProfiles[specialtyId]) return;
  const isNew = state.specialty !== specialtyId;
  state.specialty = specialtyId;
  state.flags[`specialty_${specialtyId}`] = true;
  if (isNew) {
    state.specialtyChapter = { active: true, done: 0, quota: SPECIALTY_CHAPTER_QUOTA, seen: new Set(), turnsWaited: 0 };
  }
}

function getSpecialtyChapterCandidates(state) {
  if (!state.specialty || !state.specialtyChapter?.active) return [];
  return randomEvents.filter((re) =>
    re.specialtyChapter === state.specialty &&
    !state.specialtyChapter.seen.has(re.id) &&
    (!state.seenRandom.has(re.id) || re.repeatable) &&
    evaluateConditions({ ...(re.conditions || {}), requireFlags: [...(re.conditions?.requireFlags || []), ...(re.requireFlags || [])], forbidFlags: [...(re.conditions?.forbidFlags || []), ...(re.forbidFlags || [])] }, state)
  );
}

function noteSpecialtyChapterProgress(state, eventId) {
  const chapter = state.specialtyChapter;
  if (!chapter || !state.specialty) return;
  const event = randomMap.get(eventId);
  if (!event || event.specialtyChapter !== state.specialty) return;
  if (chapter.seen.has(eventId)) return;
  chapter.seen.add(eventId);
  chapter.done = Math.min(chapter.quota, chapter.done + 1);
  chapter.turnsWaited = 0;
  if (chapter.done >= chapter.quota) chapter.active = false;
}

function maybeTriggerSpecialtyChapter(state) {
  const chapter = state.specialtyChapter;
  if (!chapter?.active || chapter.done >= chapter.quota) return false;
  const candidates = getSpecialtyChapterCandidates(state);
  if (!candidates.length) return false;
  chapter.turnsWaited = (chapter.turnsWaited || 0) + 1;
  const remaining = chapter.quota - chapter.done;
  const overdue = chapter.turnsWaited >= Math.max(2, remaining * 3);
  if (!overdue && Math.random() >= 0.5) return false;
  const chosen = pickWeighted(candidates.map((re) => ({ ...re, weight: (re.weight || 1) * 2 })));
  state.inRandom = true;
  state.randomReturnTo = state.currentEventId;
  state.currentEventId = chosen.id;
  state.stage = chosen.stage || state.stage;
  if (!chosen.repeatable) state.seenRandom.add(chosen.id);
  noteSpecialtyChapterProgress(state, chosen.id);
  return true;
}

function syncRegionalChapter(state) {
  const eligible = REGIONAL_TIERS.has(state.hospitalTier);
  if (!eligible) {
    state.regionalChapter.active = false;
    state.regionalChapter.tier = state.hospitalTier || null;
    return;
  }
  if (state.regionalChapter.tier !== state.hospitalTier || (!state.regionalChapter.active && state.regionalChapter.done === 0)) {
    state.regionalChapter.active = true;
    state.regionalChapter.tier = state.hospitalTier;
    state.regionalChapter.quota = REGIONAL_CHAPTER_QUOTA;
    state.regionalChapter.turnsWaited = 0;
  }
}

function getRegionalChapterCandidates(state) {
  if (!state.regionalChapter?.active || !REGIONAL_TIERS.has(state.hospitalTier)) return [];
  return randomEvents.filter((re) =>
    re.regionalChapter === true &&
    !state.regionalChapter.seen.has(re.id) &&
    (!state.seenRandom.has(re.id) || re.repeatable) &&
    evaluateConditions({ ...(re.conditions || {}), requireFlags: [...(re.conditions?.requireFlags || []), ...(re.requireFlags || [])], forbidFlags: [...(re.conditions?.forbidFlags || []), ...(re.forbidFlags || [])] }, state)
  );
}

function noteRegionalChapterProgress(state, eventId) {
  const event = randomMap.get(eventId);
  if (!event || event.regionalChapter !== true) return;
  if (state.regionalChapter.seen.has(eventId)) return;
  state.regionalChapter.seen.add(eventId);
  state.regionalChapter.done = Math.min(state.regionalChapter.quota, state.regionalChapter.done + 1);
  state.regionalChapter.turnsWaited = 0;
  if (state.regionalChapter.done >= state.regionalChapter.quota) state.regionalChapter.active = false;
}

function maybeTriggerRegionalChapter(state) {
  const chapter = state.regionalChapter;
  if (!chapter?.active || chapter.done >= chapter.quota) return false;
  const candidates = getRegionalChapterCandidates(state);
  if (!candidates.length) return false;
  chapter.turnsWaited = (chapter.turnsWaited || 0) + 1;
  const remaining = chapter.quota - chapter.done;
  const overdue = chapter.turnsWaited >= Math.max(2, remaining * 2);
  if (!overdue && Math.random() >= 0.55) return false;
  const chosen = pickWeighted(candidates.map((re) => ({ ...re, weight: (re.weight || 1) * 2.2 })));
  state.inRandom = true;
  state.randomReturnTo = state.currentEventId;
  state.currentEventId = chosen.id;
  state.stage = chosen.stage || state.stage;
  if (!chosen.repeatable) state.seenRandom.add(chosen.id);
  noteRegionalChapterProgress(state, chosen.id);
  return true;
}

function maybeTriggerRomanceGuarantee(state) {
  if (state.age < ROMANCE_GUARANTEE_AGE) return false;
  if (ROMANCE_SKIP_FLAGS.some((flag) => state.flags[flag])) return false;
  if (!randomMap.has(ROMANCE_GUARANTEE_EVENT_ID)) return false;
  if (state.seenRandom.has(ROMANCE_GUARANTEE_EVENT_ID)) return false;
  state.inRandom = true;
  state.randomReturnTo = state.currentEventId;
  state.currentEventId = ROMANCE_GUARANTEE_EVENT_ID;
  state.stage = randomMap.get(ROMANCE_GUARANTEE_EVENT_ID)?.stage || state.stage;
  if (!randomMap.get(ROMANCE_GUARANTEE_EVENT_ID)?.repeatable) state.seenRandom.add(ROMANCE_GUARANTEE_EVENT_ID);
  return true;
}

const MARRIAGE_GUARANTEE_AGE = 30;
const MARRIAGE_EVENT_CANDIDATES = ['re_marriage', 're_marriage_resident'];

function maybeTriggerMarriageGuarantee(state) {
  if (state.age < MARRIAGE_GUARANTEE_AGE) return false;
  if (!state.flags.has_partner || state.flags.married || state.flags.dink) return false;
  const candidate = MARRIAGE_EVENT_CANDIDATES.find((id) => {
    const event = randomMap.get(id);
    if (!event || state.seenRandom.has(id)) return false;
    const conditions = { ...(event.conditions || {}), requireFlags: [...(event.conditions?.requireFlags || []), ...(event.requireFlags || [])], forbidFlags: [...(event.conditions?.forbidFlags || []), ...(event.forbidFlags || [])] };
    return evaluateConditions(conditions, state);
  });
  if (!candidate) return false;
  state.inRandom = true;
  state.randomReturnTo = state.currentEventId;
  state.currentEventId = candidate;
  state.stage = randomMap.get(candidate)?.stage || state.stage;
  if (!randomMap.get(candidate)?.repeatable) state.seenRandom.add(candidate);
  return true;
}

const NEXT_GEN_GUARANTEE_AGE = 33;
const NEXT_GEN_GUARANTEE_EVENT_ID = 're_child_choice';

function maybeTriggerNextGenGuarantee(state) {
  if (state.age < NEXT_GEN_GUARANTEE_AGE) return false;
  if (!state.flags.married) return false;
  if (state.flags.has_child || state.flags.dink || state.flags.adopted_child || state.flags.flag_dink_confirmed) return false;
  if (state.family.childDecisionDeferred && typeof state.family.nextChildDiscussionAge === 'number' && state.age < state.family.nextChildDiscussionAge) return false;
  if (!randomMap.has(NEXT_GEN_GUARANTEE_EVENT_ID)) return false;
  if (state.seenRandom.has(NEXT_GEN_GUARANTEE_EVENT_ID)) return false;
  state.inRandom = true;
  state.randomReturnTo = state.currentEventId;
  state.currentEventId = NEXT_GEN_GUARANTEE_EVENT_ID;
  state.stage = randomMap.get(NEXT_GEN_GUARANTEE_EVENT_ID)?.stage || state.stage;
  if (!randomMap.get(NEXT_GEN_GUARANTEE_EVENT_ID)?.repeatable) state.seenRandom.add(NEXT_GEN_GUARANTEE_EVENT_ID);
  return true;
}

function advancePassiveRelationshipState(state, deltaYear) {
  if (!deltaYear || !state.flags.has_partner || state.flags.married || state.flags.dink) return;
  state.romance = state.romance || createDefaultRomance(state.flags.has_partner ? 'dating' : 'single');
  for (let i = 0; i < deltaYear; i += 1) {
    state.romance.interactions += 1;
    state.romance.stageInteractions += 1;
    if (state.romance.stage === 'dating' && state.romance.interactions >= 2 && Math.random() < 0.45) {
      state.romance.realIssueCount += 1;
      advanceRelationshipStage(state, 'committed');
      continue;
    }
    if (state.romance.stage === 'committed' && Math.random() < 0.35) {
      state.romance.realIssueCount += 1;
      state.romance.cohabitationCount += 1;
      advanceRelationshipStage(state, 'cohabiting');
      continue;
    }
    if (state.romance.stage === 'cohabiting' && state.romance.realIssueCount >= 1 && Math.random() < 0.3) {
      state.romance.realIssueCount += 1;
      advanceRelationshipStage(state, 'engaged_or_discussing_marriage');
    }
  }
  syncFamilyState(state);
}

function simulateRun(desiredSpecialty) {
  const state = {
    currentEventId: gameData.startEventId,
    stage: gameData.startStage || map.get(gameData.startEventId)?.stage,
    stats: { ...DEFAULT_STATS },
    flags: {},
    settings: { historicalEventsRealNames: false },
    family: { partner: false, married: false, child: false, dink: false, single: false, childDecisionDeferred: false, nextChildDiscussionAge: null },
    romance: createDefaultRomance(),
    scheduled: [],
    scheduledHistory: new Set(),
    seenRandom: new Set(),
    randomReturnTo: null,
    inRandom: false,
    age: 18,
    careerYear: 1,
    specialty: null,
    undergradInstitutionTier: 'tier985',
    graduateInstitutionTier: null,
    degreeTrack: 'undergrad',
    cityTier: null,
    hospitalTier: null,
    hospitalType: null,
    careerTitle: null,
    financialCrises: 0,
    retryState: {},
    specialtyChapter: null,
    regionalChapter: { active: false, tier: null, done: 0, quota: REGIONAL_CHAPTER_QUOTA, seen: new Set(), turnsWaited: 0 },
    childDeferralEver: false,
    childRepromptCount: 0,
    violenceInjurySeen: false,
    diminishingCarry: { skill: 0, network: 0, research: 0 }
  };

  let stepsTaken = 0;
  for (let steps = 0; steps < 90; steps += 1) {
    stepsTaken = steps;
    const event = map.get(state.currentEventId) || randomMap.get(state.currentEventId);
    if (!event) return buildRunResult(state, null, stepsTaken);
    if (event.type === 'ending') return buildRunResult(state, event.id, stepsTaken);
    if (event.id === 're_child_discussion_followup') state.childRepromptCount += 1;

    const option = chooseOption(event, state, desiredSpecialty);
    if (!option) return buildRunResult(state, null, stepsTaken);
    applyEffects(state, option.effects);
    applyFlags(state, option.flagsSet);
    if ((option.flagsSet || []).some((flag) => flag === 'violence_injury' || flag === 'violence_minor_injury')) state.violenceInjurySeen = true;
    clearFlags(state, option.flagsCleared);
    applyNarrativeState(state, option);
    if (option.specialty) applySpecialtyToState(state, option.specialty);
    applyCareer(state, option);
    syncRegionalChapter(state);
    queueScheduled(state, option.scheduledEvents);

    const deltaYear = typeof option.yearDelta === 'number' ? option.yearDelta : (event.yearDelta || 0);
    let targetId = option.target;
    let retriedStay = false;

    if (option.check) {
      const branchResult = resolveBranch(option, state);
      targetId = branchResult.targetId;
      applyEffects(state, branchResult.container.effects);
      applyFlags(state, branchResult.container.flagsSet);
      if ((branchResult.container.flagsSet || []).some((flag) => flag === 'violence_injury' || flag === 'violence_minor_injury')) state.violenceInjurySeen = true;
      clearFlags(state, branchResult.container.flagsCleared);
      applyNarrativeState(state, branchResult.container);
      if (branchResult.container.specialty) applySpecialtyToState(state, branchResult.container.specialty);
      applyCareer(state, branchResult.container);
      syncRegionalChapter(state);
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
      advancePassiveRelationshipState(state, deltaYear);
      state.age += deltaYear;
      state.careerYear += deltaYear;
    }

    if (state.stats.money <= 0 && !state.inRandom) {
      triggerFinanceCrisis(state);
      continue;
    }

    if (!retriedStay && maybeTriggerScheduled(state)) continue;
    if (!retriedStay && maybeTriggerSpecialtyChapter(state)) continue;
    if (!retriedStay && maybeTriggerRegionalChapter(state)) continue;
    if (!retriedStay && maybeTriggerRomanceGuarantee(state)) continue;
    if (!retriedStay && maybeTriggerMarriageGuarantee(state)) continue;
    if (!retriedStay && maybeTriggerNextGenGuarantee(state)) continue;
    if (!retriedStay && Math.random() < RANDOM_EVENT_CHANCE) {
      const candidates = eligibleRandomEvents(state);
      if (candidates.length) {
        const chosen = pickWeighted(candidates);
        state.inRandom = true;
        state.randomReturnTo = state.currentEventId;
        state.currentEventId = chosen.id;
        state.stage = chosen.stage;
        if (!chosen.repeatable) state.seenRandom.add(chosen.id);
        noteSpecialtyChapterProgress(state, chosen.id);
        noteRegionalChapterProgress(state, chosen.id);
      }
    }
  }

  return buildRunResult(state, null, stepsTaken);
}

function buildRunResult(state, endingId, stepsTaken) {
  return {
    endingId,
    stepsTaken,
    specialty: state.specialty,
    financialCrises: state.financialCrises,
    finalStats: { ...state.stats },
    chapterDone: state.specialtyChapter?.seen ? state.specialtyChapter.seen.size : 0,
    chapterQuota: state.specialtyChapter?.quota || SPECIALTY_CHAPTER_QUOTA,
    regionalChapterDone: state.regionalChapter?.seen ? state.regionalChapter.seen.size : 0,
    regionalChapterQuota: state.regionalChapter?.quota || REGIONAL_CHAPTER_QUOTA,
    hasPartner: !!(state.flags.has_partner || state.flags.dink),
    hasNextGen: !!(state.flags.has_child || state.flags.adopted_child),
    relationshipStage: state.romance?.stage || 'single',
    relationshipHistory: [...(state.romance?.history || ['single'])],
    childDeferred: !!state.family?.childDecisionDeferred,
    childDeferralEver: !!state.childDeferralEver,
    childRepromptCount: state.childRepromptCount || 0,
    dinkConfirmed: !!(state.flags.dink || state.flags.flag_dink_confirmed),
    violenceInjurySeen: !!state.violenceInjurySeen,
    whistleArcSeen: !!state.flags.flag_whistleblower_arc_seen,
    retrialArcSeen: !!state.flags.flag_retrial_arc_seen,
    careerTitle: state.careerTitle,
    hospitalTier: state.hospitalTier
  };
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

// ===== 固定种子的大规模模拟：成长曲线分布 + 恋爱/下一代比例 + 科室章节达成率 =====
function mulberry32(seed) {
  let a = seed >>> 0;
  return function random() {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function percentile(sortedArr, p) {
  if (!sortedArr.length) return 0;
  const idx = Math.min(sortedArr.length - 1, Math.floor((p / 100) * sortedArr.length));
  return sortedArr[idx];
}

const BULK_SIM_SEED = 20260902;
const BULK_SIM_RUNS = 2400;
const originalRandom = Math.random;
Math.random = mulberry32(BULK_SIM_SEED);

const bulkResults = [];
try {
  for (let i = 0; i < BULK_SIM_RUNS; i += 1) {
    const specialtyId = specialtyIds[i % specialtyIds.length];
    bulkResults.push(simulateRun(specialtyId));
  }
} finally {
  Math.random = originalRandom;
}

function summarizeStat(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const mean = sorted.reduce((sum, v) => sum + v, 0) / (sorted.length || 1);
  const median = percentile(sorted, 50);
  const p90 = percentile(sorted, 90);
  const p95 = percentile(sorted, 95);
  const rate95 = sorted.filter((v) => v >= 95).length / (sorted.length || 1);
  const rate100 = sorted.filter((v) => v >= 100).length / (sorted.length || 1);
  return { mean, median, p90, p95, rate95, rate100 };
}

const skillValues = bulkResults.map((r) => r.finalStats.skill);
const networkValues = bulkResults.map((r) => r.finalStats.network);
const skillStat = summarizeStat(skillValues);
const networkStat = summarizeStat(networkValues);

for (const [label, stat] of [['skill', skillStat], ['network', networkStat]]) {
  if (stat.rate95 < 0.03 || stat.rate95 > 0.18) {
    issues.push(`${label} 达到 95+ 的比例超出预期区间（约 6%-14%，允许 3%-18% 容差）：${(stat.rate95 * 100).toFixed(1)}%`);
  }
  if (stat.rate100 > 0.05) {
    issues.push(`${label} 达到 100 的比例过高：${(stat.rate100 * 100).toFixed(1)}%`);
  }
}

const partnerRate = bulkResults.filter((r) => r.hasPartner).length / bulkResults.length;
const nextGenRate = bulkResults.filter((r) => r.hasNextGen).length / bulkResults.length;
if (partnerRate < 0.30 || partnerRate > 0.60) {
  issues.push(`伴侣关系达成率超出预期区间（目标 35%-55%，允许 30%-60% 容差）：${(partnerRate * 100).toFixed(1)}%`);
}
if (nextGenRate < 0.15 || nextGenRate > 0.40) {
  issues.push(`下一代入口达成率超出预期区间（目标 20%-35%，允许 15%-40% 容差）：${(nextGenRate * 100).toFixed(1)}%`);
}
const historicalEventRate = bulkResults.filter((r) => r.whistleArcSeen || r.retrialArcSeen).length / bulkResults.length;
const whistleblowerEndingRate = bulkResults.filter((r) => r.endingId === 'ending_whistleblower').length / bulkResults.length;
const fictionalRetrialRate = bulkResults.filter((r) => r.endingId === 'ending_fictional_retrial_overturned').length / bulkResults.length;
const violenceInjuryRate = bulkResults.filter((r) => r.violenceInjurySeen).length / bulkResults.length;
const violenceDeathRate = bulkResults.filter((r) => r.endingId === 'ending_violence_fatality').length / bulkResults.length;
const financialFreedomRate = bulkResults.filter((r) => POSITIVE_FINANCE_ENDINGS.has(r.endingId)).length / bulkResults.length;
const regionalEligibleRuns = bulkResults.filter((r) => ['prefecture_tier3_strong2', 'regular_tier2', 'county_basic'].includes(r.hospitalTier));
const regionalCompletionRate = regionalEligibleRuns.length ? regionalEligibleRuns.filter((r) => r.regionalChapterDone >= r.regionalChapterQuota).length / regionalEligibleRuns.length : 0;
const relationshipStageDistribution = RELATIONSHIP_STAGES.reduce((acc, stage) => {
  acc[stage] = bulkResults.filter((r) => r.relationshipStage === stage).length;
  return acc;
}, {});
for (const result of bulkResults) {
  for (let i = 1; i < result.relationshipHistory.length; i += 1) {
    const prev = getRelationshipStageIndex(result.relationshipHistory[i - 1]);
    const next = getRelationshipStageIndex(result.relationshipHistory[i]);
    const resetToSingle = result.relationshipHistory[i] === 'single';
    if (!resetToSingle && next - prev > 1) {
      issues.push(`关系阶段发生跳级：${result.relationshipHistory[i - 1]} -> ${result.relationshipHistory[i]}`);
      break;
    }
  }
}
const deferredRuns = bulkResults.filter((r) => r.childDeferralEver);
const deferredRepromptRate = deferredRuns.length ? deferredRuns.filter((r) => r.childRepromptCount > 0 || r.hasNextGen || r.dinkConfirmed).length / deferredRuns.length : 1;
if (deferredRuns.length && deferredRepromptRate < 0.6) {
  issues.push(`孩子延期后再次进入讨论/结局的比例过低：${(deferredRepromptRate * 100).toFixed(1)}%`);
}
if (violenceDeathRate >= 0.01) issues.push(`暴力风险死亡率过高：${(violenceDeathRate * 100).toFixed(2)}%`);
if (financialFreedomRate <= 0 || financialFreedomRate >= 0.15) issues.push(`经济自由结局需“可达但稀有”，当前占比 ${(financialFreedomRate * 100).toFixed(1)}%`);
if (historicalEventRate > 0.12) issues.push(`历史原型/复合虚构链触发率过高：${(historicalEventRate * 100).toFixed(1)}%`);
if (!bulkResults.some((r) => r.endingId === 'ending_whistleblower')) issues.push('固定种子模拟未触发“吹哨人”结局');
if (!bulkResults.some((r) => r.endingId === 'ending_fictional_retrial_overturned')) issues.push('固定种子模拟未触发“架空再审”结局');

const chapterCompletionRate = bulkResults.filter((r) => r.chapterDone >= r.chapterQuota).length / bulkResults.length;
if (chapterCompletionRate < 0.5) {
  issues.push(`科室体验章节 3/3 达成率过低：${(chapterCompletionRate * 100).toFixed(1)}%`);
}

const chapterCompletionBySpecialty = {};
for (const id of specialtyIds) {
  const runsOfSpecialty = bulkResults.filter((r) => r.specialty === id);
  const completed = runsOfSpecialty.filter((r) => r.chapterDone >= r.chapterQuota).length;
  chapterCompletionBySpecialty[id] = runsOfSpecialty.length ? `${completed}/${runsOfSpecialty.length}` : '0/0';
}

// ===== 需求9：幽默/讽刺文案密度抽查 =====
const HUMOR_MARKERS = ['Excel', '群里', '群消息', 'KPI', '绩效', '指标', 'OA', '通知', '排班', '考核', '系统', '医保', '质控', 'DRG', '飞检', '打卡', '红头文件', '表格', '汇报', '复盘', '截图', '已阅', '会议纪要'];
let humorScanTotal = 0;
let humorScanHit = 0;
function scanHumorText(text) {
  if (!text) return;
  humorScanTotal += 1;
  if (HUMOR_MARKERS.some((marker) => text.includes(marker))) humorScanHit += 1;
}
for (const event of [...events, ...randomEvents]) {
  scanHumorText(event.text);
  for (const option of event.options || []) {
    scanHumorText(option.resultText);
    if (option.check) {
      scanHumorText(option.check.success?.resultText);
      scanHumorText(option.check.failure?.resultText);
    }
  }
}
const humorDensity = humorScanTotal ? humorScanHit / humorScanTotal : 0;
if (humorDensity < 0.15) {
  issues.push(`幽默/讽刺文案密度过低（${(humorDensity * 100).toFixed(1)}%），行业梗未实际接入正文`);
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
console.log(`specialty 模拟覆盖: ${specialtyIds.length} 个方向，结局 ${endingSet.size} 种，财务结局 ${financeEndingRuns}/${totalRuns}`);
console.log(`--- 固定种子大规模模拟（种子 ${BULK_SIM_SEED}，共 ${BULK_SIM_RUNS} 局） ---`);
console.log(`skill: 均值 ${skillStat.mean.toFixed(1)}，中位数 ${skillStat.median}，P90 ${skillStat.p90}，P95 ${skillStat.p95}，95+比例 ${(skillStat.rate95 * 100).toFixed(1)}%，100比例 ${(skillStat.rate100 * 100).toFixed(1)}%`);
console.log(`network: 均值 ${networkStat.mean.toFixed(1)}，中位数 ${networkStat.median}，P90 ${networkStat.p90}，P95 ${networkStat.p95}，95+比例 ${(networkStat.rate95 * 100).toFixed(1)}%，100比例 ${(networkStat.rate100 * 100).toFixed(1)}%`);
console.log(`伴侣关系达成率: ${(partnerRate * 100).toFixed(1)}%，下一代入口达成率: ${(nextGenRate * 100).toFixed(1)}%`);
console.log(`历史事件触发率: ${(historicalEventRate * 100).toFixed(1)}%，吹哨人结局率: ${(whistleblowerEndingRate * 100).toFixed(2)}%，架空再审结局率: ${(fictionalRetrialRate * 100).toFixed(2)}%`);
console.log(`医闹/暴力风险受伤率: ${(violenceInjuryRate * 100).toFixed(1)}%，死亡率: ${(violenceDeathRate * 100).toFixed(2)}%`);
console.log(`关系阶段分布: ${JSON.stringify(relationshipStageDistribution)}`);
console.log(`孩子延期后回流率: ${(deferredRepromptRate * 100).toFixed(1)}%，经济自由结局率: ${(financialFreedomRate * 100).toFixed(2)}%`);
console.log(`科室体验 3/3 达成率（总体）: ${(chapterCompletionRate * 100).toFixed(1)}%`);
console.log(`科室体验 3/3 达成率（分科室）: ${JSON.stringify(chapterCompletionBySpecialty)}`);
console.log(`低层级医院区域章节 ${REGIONAL_CHAPTER_QUOTA}/${REGIONAL_CHAPTER_QUOTA} 达成率: ${(regionalCompletionRate * 100).toFixed(1)}%`);
console.log(`幽默/讽刺文案密度: ${(humorDensity * 100).toFixed(1)}%（${humorScanHit}/${humorScanTotal} 条含行业梗关键词）`);
