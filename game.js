(function () {
  'use strict';

  const STORAGE_KEYS = {
    save: 'cmsl_save_v1',
    endings: 'cmsl_endings_v1',
    achievements: 'cmsl_achievements_v1'
  };
  const SAVE_VERSION = 2;

  const checkSystem = window.CHECK_SYSTEM || globalThis.CHECK_SYSTEM;
  const eventMap = new Map(GAME_DATA.events.map((event) => [event.id, event]));
  const randomEventMap = new Map((GAME_DATA.randomEvents || []).map((event) => [event.id, event]));
  const RANDOM_EVENT_CHANCE = 0.3;
  const MAX_GENERATION = 3;
  const SPECIALTY_CHAPTER_QUOTA = 3;
  const ROMANCE_GUARANTEE_AGE = 32;
  const fallbackEndingId = GAME_DATA.fallbackEndingId || 'ending_balanced_life';
  const positiveStats = new Set(['health', 'skill', 'research', 'network', 'ethics']);
  const negativeStats = new Set(['stress', 'legalRisk']);
  const statNames = {
    health: '健康',
    stress: '压力',
    money: '经济状况',
    skill: '医术/临床能力',
    research: '科研',
    network: '人脉',
    ethics: '医德/初心',
    legalRisk: '法律风险'
  };
  const careerFieldLabels = {
    undergradInstitutionTier: '本科平台',
    graduateInstitutionTier: '研究生平台',
    degreeTrack: '培养路径',
    cityTier: '城市',
    hospitalTier: '医院',
    hospitalType: '单位类型',
    careerTitle: '职称'
  };
  const defaultCareerDisplayNames = {
    undergradInstitutionTier: { tier985: '985医学院本科' },
    graduateInstitutionTier: { top_national: '全国头部平台', regional_strong: '区域强校', regular: '普通院校', diaoji: '调剂平台' },
    degreeTrack: { undergrad: '本科', masters_pro: '专业型硕士', masters_academic: '学术型硕士', phd: '博士/直博', direct_work: '直接就业' },
    cityTier: { mega: '超大城市', strong_province: '强省会/区域中心', prefecture: '普通地级市', county_rural: '县域/基层' },
    hospitalTier: { top_tier3: '全国头部/强三甲', regular_tier3: '省会普通三甲', prefecture_tier3_strong2: '地市中心/强二甲', regular_tier2: '普通二级医院', county_basic: '县域/基层医院', premium_private: '高端私立/连锁专科', international: '国际部/高端医疗' },
    hospitalType: { public_general: '公立综合医院', public_specialist: '公立专科医院', grassroots: '基层医疗机构', private: '民营医院', international: '国际部/高端医疗', academic_research: '科研教学单位', industry: '医疗产业相关' },
    careerTitle: { trainee: '规培医师', resident: '住院医师', attending: '主治医师', associate_chief: '副主任医师', chief: '主任医师', dept_head: '科室负责人' }
  };
  const careerDisplayNames = GAME_DATA.careerMeta?.labels || defaultCareerDisplayNames;
  const careerEnumValues = Object.fromEntries(
    Object.entries(GAME_DATA.careerMeta?.enums || Object.fromEntries(
      Object.entries(careerDisplayNames).map(([key, values]) => [key, Object.keys(values)])
    )).map(([key, values]) => [key, new Set(values)])
  );
  const specialtyRestrictionNotes = {
    acute: '（调剂平台，热门方向竞争名额受限）',
    surgery: '（调剂平台，热门方向竞争名额受限）',
    platform: '（调剂平台，竞争名额受限）',
    pediatrics: '（调剂平台，竞争名额受限）',
    emergency_critical: '（调剂平台，竞争名额受限）',
    surgery_sp: '（调剂平台，竞争名额受限）',
    obgyn: '（调剂平台，竞争名额受限）',
    anesthesia: '（调剂平台，竞争名额受限）',
    dental: '（调剂平台，竞争名额受限）',
    ent_oph: '（调剂平台，竞争名额受限）',
    imaging_ultrasound: '（调剂平台，竞争名额受限）'
  };

  const achievementsCatalog = [
    { id: 'start', name: '白袍启程', desc: '完成第一局', check: (s) => !!s.endingId },
    { id: 'chief', name: '极少数', desc: '达成“科主任”结局', check: (s) => s.endingId === 'ending_department_chief' },
    { id: 'balance', name: '稳住心率', desc: '以健康≥70通关', check: (s) => !!s.endingId && s.stats.health >= 70 },
    { id: 'ethics', name: '初心在线', desc: '以医德≥80通关', check: (s) => !!s.endingId && s.stats.ethics >= 80 },
    { id: 'law_safe', name: '合规高手', desc: '以法律风险≤20通关', check: (s) => !!s.endingId && s.stats.legalRisk <= 20 },
    { id: 'researcher', name: '论文灯塔', desc: '以科研≥80通关', check: (s) => !!s.endingId && s.stats.research >= 80 },
    { id: 'networker', name: '会诊通讯录', desc: '以人脉≥75通关', check: (s) => !!s.endingId && s.stats.network >= 75 },
    { id: 'community', name: '社区守门人', desc: '触发基层深耕标记', check: (s) => s.flags.community_trust === true },
    { id: 'switcher', name: '赛道切换大师', desc: '达成任一转行结局', check: (s) => ['ending_industry_ma', 'ending_internet_health', 'ending_public_service'].includes(s.endingId) },
    { id: 'collector', name: '人生样本库', desc: '累计解锁 5 个不同结局', check: (_s, meta) => meta.unlockedEndings.length >= 5 },
    { id: 'family_founded', name: '成家', desc: '建立了家庭', check: (s) => s.flags.married === true },
    { id: 'has_child_achievement', name: '为人父母', desc: '有了孩子', check: (s) => s.flags.has_child === true },
    { id: 'second_gen', name: '薪火相传', desc: '开启了下一代', check: (s) => (s.generation || 1) >= 2 },
    { id: 'single_proud', name: '单身无憾', desc: '选择单身并抵达良好结局', check: (s) => s.flags.single_choice === true && !!s.endingId && s.stats.health >= 60 && s.stats.ethics >= 50 && !String(s.endingId).includes('crisis') },
    { id: 'dink_success', name: '丁克美满', desc: '选择丁克并抵达良好结局', check: (s) => s.flags.dink === true && !!s.endingId && s.stats.health >= 60 && !String(s.endingId).includes('crisis') }
  ];

  const refs = {
    startScreen: document.getElementById('start-screen'),
    gameScreen: document.getElementById('game-screen'),
    endingScreen: document.getElementById('ending-screen'),
    startBtn: document.getElementById('start-btn'),
    continueBtn: document.getElementById('continue-btn'),
    resetBtn: document.getElementById('reset-btn'),
    clearBtn: document.getElementById('clear-btn'),
    eventTitle: document.getElementById('event-title'),
    eventText: document.getElementById('event-text'),
    options: document.getElementById('options'),
    stageTag: document.getElementById('stage-tag'),
    ageTag: document.getElementById('age-tag'),
    timelineTag: document.getElementById('timeline-tag'),
    specialtyTag: document.getElementById('specialty-tag'),
    chapterTag: document.getElementById('chapter-tag'),
    originTag: document.getElementById('origin-tag'),
    timelineBanner: document.getElementById('timeline-banner'),
    majorTag: document.getElementById('major-tag'),
    logList: document.getElementById('log-list'),
    feedback: document.getElementById('change-feedback'),
    resumeCard: document.getElementById('resume-card'),
    resumeList: document.getElementById('resume-list'),
    stats: document.getElementById('stats'),
    disclaimer: document.getElementById('disclaimer-text'),
    endingTitle: document.getElementById('ending-title'),
    endingText: document.getElementById('ending-text'),
    endingStats: document.getElementById('ending-stats'),
    unlockedEndings: document.getElementById('unlocked-endings'),
    unlockedAchievements: document.getElementById('unlocked-achievements'),
    restartFromEndingBtn: document.getElementById('restart-from-ending'),
    eventCard: document.querySelector('.event-card'),
    outcomeCard: document.getElementById('outcome-card'),
    outcomeLabel: document.getElementById('outcome-label'),
    outcomeText: document.getElementById('outcome-text')
  };

  let state = null;

  function getInitialState(legacy) {
    const stats = {
      health: 80,
      stress: 20,
      money: 55,
      skill: 10,
      research: 5,
      network: 8,
      ethics: 70,
      legalRisk: 5
    };

    const generation = legacy && typeof legacy.generation === 'number' ? legacy.generation : 1;
    const log = [GAME_DATA.startLog || '你已经走进 985 医学院，真正的人生抉择从这里开始。'];

    if (legacy && generation > 1) {
      stats.ethics = clampStat('ethics', stats.ethics + (legacy.ethicsBonus || 0));
      stats.skill = clampStat('skill', stats.skill + (legacy.skillBonus || 0));
      stats.research = clampStat('research', stats.research + (legacy.researchBonus || 0));
      stats.network = clampStat('network', stats.network + (legacy.networkBonus || 0));
      stats.money = clampStat('money', stats.money + (legacy.moneyBonus || 0));
      log.unshift(`👶 第 ${generation} 代人生开启：你继承了上一代留下的一部分底蕴。`);
    }

    return {
      saveVersion: SAVE_VERSION,
      currentEventId: GAME_DATA.startEventId,
      age: 18,
      careerYear: 1,
      stage: GAME_DATA.startStage || 'undergrad',
      stats,
      flags: {},
      delayedConsequences: [],
      scheduledEvents: [],
      scheduledHistory: [],
      log,
      endingId: null,
      turn: 0,
      lastChanges: [],
      seenRandomEvents: [],
      retryState: {},
      inRandomEvent: false,
      randomEventReturnTo: null,
      eventOrigin: 'main',
      specialty: null,
      undergradInstitutionTier: 'tier985',
      graduateInstitutionTier: null,
      degreeTrack: 'undergrad',
      cityTier: null,
      hospitalTier: null,
      hospitalType: null,
      careerTitle: null,
      financialCrises: 0,
      generation,
      legacy: legacy && generation > 1 ? legacy : {},
      generationLog: legacy && Array.isArray(legacy.generationLog) ? legacy.generationLog.slice(0, MAX_GENERATION) : [],
      family: { partner: false, married: false, child: false, dink: false, single: false },
      lastOutcomeNarrative: null,
      lastOutcomeType: null,
      lastOutcomeSource: null,
      specialtyChapter: { active: false, done: 0, quota: SPECIALTY_CHAPTER_QUOTA, seen: [], turnsWaited: 0 },
      diminishingCarry: { skill: 0, network: 0, research: 0 }
    };
  }

  function normalizeSpecialtyChapter(raw) {
    const base = { active: false, done: 0, quota: SPECIALTY_CHAPTER_QUOTA, seen: [], turnsWaited: 0 };
    if (!raw || typeof raw !== 'object') return base;
    return {
      active: !!raw.active,
      done: typeof raw.done === 'number' ? Math.max(0, Math.round(raw.done)) : 0,
      quota: typeof raw.quota === 'number' ? Math.max(1, Math.round(raw.quota)) : SPECIALTY_CHAPTER_QUOTA,
      seen: Array.isArray(raw.seen) ? raw.seen.filter((id) => typeof id === 'string').slice(0, 30) : [],
      turnsWaited: typeof raw.turnsWaited === 'number' ? Math.max(0, Math.round(raw.turnsWaited)) : 0
    };
  }

  function clampStat(stat, value) {
    const [min, max] = GAME_DATA.statBounds[stat];
    return checkSystem.clamp(value, min, max);
  }

  function getSpecialtyProfile(id) {
    return id ? GAME_DATA.specialties?.[id] : null;
  }

  function getSpecialtyName(id) {
    return getSpecialtyProfile(id)?.name || '尚未定科';
  }

  function convertLegacyMoney(rawValue) {
    if (typeof rawValue !== 'number' || !Number.isFinite(rawValue)) return 55;
    const bounded = checkSystem.clamp(rawValue, -20, 200);
    if (bounded <= 0) {
      return Math.round(((bounded + 20) / 20) * 12);
    }
    if (bounded <= 20) {
      return Math.round(12 + (bounded / 20) * 48);
    }
    if (bounded <= 80) {
      return Math.round(60 + ((bounded - 20) / 60) * 25);
    }
    return Math.round(85 + ((bounded - 80) / 120) * 15);
  }

  function normalizeStats(rawStats, rawState, initialStats) {
    const stats = { ...initialStats };
    const isLegacySave = !rawState || typeof rawState.saveVersion !== 'number' || rawState.saveVersion < SAVE_VERSION;
    for (const stat of Object.keys(initialStats)) {
      const rawValue = rawStats?.[stat];
      if (typeof rawValue !== 'number') continue;
      const value = stat === 'money' && isLegacySave ? convertLegacyMoney(rawValue) : rawValue;
      stats[stat] = clampStat(stat, value);
    }
    return stats;
  }

  function normalizeScheduledEvents(items) {
    if (!Array.isArray(items)) return [];
    return items
      .filter((item) => item && typeof item === 'object')
      .map((item) => ({
        turns: typeof item.turns === 'number' ? Math.max(0, Math.round(item.turns)) : Math.max(0, Math.round(item.delay || 0)),
        eventId: typeof item.eventId === 'string' ? item.eventId : '',
        once: !!item.once,
        source: typeof item.source === 'string' ? item.source : '',
        preview: typeof item.preview === 'string' ? item.preview : '',
        conditions: item.conditions && typeof item.conditions === 'object' ? item.conditions : undefined
      }))
      .filter((item) => item.eventId && (randomEventMap.has(item.eventId) || eventMap.has(item.eventId)));
  }

  const LEGACY_EVENT_ID_MIGRATIONS = {
    gaokao_choice: 'admission_985_intro',
    major_confirm: 'freshman_life',
    admission_notice: 'freshman_life'
  };

  function mapLegacyEventId(eventId) {
    return LEGACY_EVENT_ID_MIGRATIONS[eventId] || eventId;
  }

  function formatStatValue(stat, value, signed) {
    if (!signed) return `${value}`;
    return `${value > 0 ? '+' : ''}${value}`;
  }

  function randomByWeight(items) {
    const total = items.reduce((sum, item) => sum + item.weight, 0);
    let point = Math.random() * total;
    for (const item of items) {
      point -= item.weight;
      if (point <= 0) {
        return item;
      }
    }
    return items[items.length - 1];
  }

  function evaluateConditions(conditions, snapshot) {
    const current = snapshot || state;
    if (!conditions) return true;
    const matchStats = (ranges) => {
      for (const [key, range] of Object.entries(ranges || {})) {
        const val = current.stats[key];
        if (typeof range.min === 'number' && val < range.min) return false;
        if (typeof range.max === 'number' && val > range.max) return false;
      }
      return true;
    };

    if (conditions.flags) {
      for (const flag of conditions.flags) {
        if (!current.flags[flag]) return false;
      }
    }

    if (conditions.requireFlags) {
      for (const flag of conditions.requireFlags) {
        if (!current.flags[flag]) return false;
      }
    }

    if (conditions.forbidFlags || conditions.notFlags) {
      for (const flag of [...(conditions.forbidFlags || []), ...(conditions.notFlags || [])]) {
        if (current.flags[flag]) return false;
      }
    }

    if (conditions.anyFlags?.length) {
      if (!conditions.anyFlags.some((flag) => current.flags[flag])) return false;
    }

    if (conditions.stats) {
      if (!matchStats(conditions.stats)) return false;
    }

    if (conditions.anyStats?.length) {
      if (!conditions.anyStats.some((ranges) => matchStats(ranges))) return false;
    }

    const specialties = conditions.specialties
      || (typeof conditions.specialty === 'string' ? [conditions.specialty] : Array.isArray(conditions.specialty) ? conditions.specialty : null);
    if (specialties?.length && !specialties.includes(current.specialty)) {
      return false;
    }

    if (conditions.stage && current.stage !== conditions.stage) return false;
    if (conditions.requireUndergradTier && !conditions.requireUndergradTier.includes(current.undergradInstitutionTier)) return false;
    if (conditions.requireHospitalTier && !conditions.requireHospitalTier.includes(current.hospitalTier)) return false;
    if (conditions.forbidHospitalTier && conditions.forbidHospitalTier.includes(current.hospitalTier)) return false;
    if (conditions.requireCityTier && !conditions.requireCityTier.includes(current.cityTier)) return false;
    if (conditions.requireGraduateTier && !conditions.requireGraduateTier.includes(current.graduateInstitutionTier)) return false;
    if (conditions.requireCareerTitle && !conditions.requireCareerTitle.includes(current.careerTitle)) return false;

    if (conditions.generation) {
      const generation = current.generation || 1;
      if (typeof conditions.generation.min === 'number' && generation < conditions.generation.min) return false;
      if (typeof conditions.generation.max === 'number' && generation > conditions.generation.max) return false;
    }

    if (conditions.age) {
      const age = current.age || 0;
      if (typeof conditions.age.min === 'number' && age < conditions.age.min) return false;
      if (typeof conditions.age.max === 'number' && age > conditions.age.max) return false;
    }

    return true;
  }

  function describeRequirements(option) {
    if (!option.conditions) return '';
    const chunks = [];

    if (option.conditions.flags?.length) {
      chunks.push(`需要标记：${option.conditions.flags.join('、')}`);
    }

    if (option.conditions.stats) {
      for (const [k, range] of Object.entries(option.conditions.stats)) {
        if (typeof range.min === 'number') chunks.push(`${statNames[k]}≥${range.min}`);
        if (typeof range.max === 'number') chunks.push(`${statNames[k]}≤${range.max}`);
      }
    }

    if (option.conditions.anyStats?.length) {
      const variants = option.conditions.anyStats.map((ranges) => Object.entries(ranges).map(([k, range]) => {
        const bits = [];
        if (typeof range.min === 'number') bits.push(`${statNames[k]}≥${range.min}`);
        if (typeof range.max === 'number') bits.push(`${statNames[k]}≤${range.max}`);
        return bits.join(' ');
      }).filter(Boolean).join(' 且 ')).filter(Boolean);
      if (variants.length) chunks.push(`满足其一：${variants.join(' / ')}`);
    }

    if (option.conditions.specialty || option.conditions.specialties) {
      const specialties = option.conditions.specialties
        || (typeof option.conditions.specialty === 'string' ? [option.conditions.specialty] : option.conditions.specialty);
      chunks.push(`需科室：${specialties.map(getSpecialtyName).join('、')}`);
    }

    if (option.conditions.requireGraduateTier?.length) {
      chunks.push(`需研究生平台：${option.conditions.requireGraduateTier.map((value) => getCareerDisplayName('graduateInstitutionTier', value)).join('、')}`);
    }
    if (option.conditions.requireUndergradTier?.length) {
      chunks.push(`需本科平台：${option.conditions.requireUndergradTier.map((value) => getCareerDisplayName('undergradInstitutionTier', value)).join('、')}`);
    }
    if (option.conditions.requireCityTier?.length) {
      chunks.push(`需城市：${option.conditions.requireCityTier.map((value) => getCareerDisplayName('cityTier', value)).join('、')}`);
    }
    if (option.conditions.requireHospitalTier?.length) {
      chunks.push(`需医院层级：${option.conditions.requireHospitalTier.map((value) => getCareerDisplayName('hospitalTier', value)).join('、')}`);
    }
    if (option.conditions.requireCareerTitle?.length) {
      chunks.push(`需职称：${option.conditions.requireCareerTitle.map((value) => getCareerDisplayName('careerTitle', value)).join('、')}`);
    }

    return chunks.length ? `（${chunks.join('，')}）` : '';
  }

  function describeFactor(factor) {
    const rounded = Math.round(Math.abs(factor.contribution));
    if (rounded === 0) return '';

    if (factor.contribution >= 0) {
      return `${statNames[factor.stat]}助力 +${rounded}%`;
    }

    return `${statNames[factor.stat]}拖累 -${rounded}%`;
  }

  function describeCheckSummary(details, limit) {
    return details.factors
      .map(describeFactor)
      .filter(Boolean)
      .slice(0, limit)
      .join('、');
  }

  function applyEffects(effects, sourceName) {
    if (!effects) return;
    const notes = [];

    for (const [stat, delta] of Object.entries(effects)) {
      if (!(stat in state.stats)) continue;
      const prev = state.stats[stat];
      const adjusted = checkSystem.applyDiminishingReturns
        ? checkSystem.applyDiminishingReturns(stat, prev, delta, state.diminishingCarry)
        : delta;
      const next = clampStat(stat, prev + adjusted);
      state.stats[stat] = next;
      const actualDelta = next - prev;
      if (actualDelta !== 0) {
        notes.push(`${statNames[stat]} ${formatStatValue(stat, actualDelta, true)}`);
      } else if (delta > 0 && adjusted === 0 && checkSystem.DIMINISHING_STATS?.has(stat)) {
        notes.push(`${statNames[stat]} 已接近天花板，收益被稀释`);
      }
    }

    if (notes.length) {
      state.lastChanges.push(`${sourceName}：${notes.join('，')}`);
    }
  }

  function syncFamily() {
    if (!state.family) {
      state.family = { partner: false, married: false, child: false, dink: false, single: false };
    }
    state.family.partner = !!state.flags.has_partner || !!state.flags.married;
    state.family.married = !!state.flags.married;
    state.family.child = !!state.flags.has_child;
    state.family.dink = !!state.flags.dink;
    state.family.single = !!state.flags.single_choice;
  }

  function applyFlags(flags) {
    if (!flags) return;
    for (const flag of flags) {
      state.flags[flag] = true;
    }
    syncFamily();
  }

  function applySpecialty(specialtyId) {
    if (!specialtyId || !GAME_DATA.specialties?.[specialtyId]) return;
    const isNewSpecialty = state.specialty !== specialtyId;
    state.specialty = specialtyId;
    state.flags[`specialty_${specialtyId}`] = true;
    if (isNewSpecialty) {
      state.specialtyChapter = { active: true, done: 0, quota: SPECIALTY_CHAPTER_QUOTA, seen: [], turnsWaited: 0 };
      state.log.unshift(`🏥 科室体验章节开启：${getSpecialtyName(specialtyId)}（0/${SPECIALTY_CHAPTER_QUOTA}）`);
    }
  }

  function getSpecialtyChapterCandidates() {
    if (!state.specialty || !state.specialtyChapter?.active) return [];
    return (GAME_DATA.randomEvents || []).filter((re) =>
      re.specialtyChapter === state.specialty &&
      !state.specialtyChapter.seen.includes(re.id) &&
      !state.seenRandomEvents.includes(re.id) &&
      canShowRandomEvent(re)
    );
  }

  function noteSpecialtyChapterProgress(eventId) {
    const chapter = state.specialtyChapter;
    if (!chapter || !state.specialty) return;
    const event = randomEventMap.get(eventId);
    if (!event || event.specialtyChapter !== state.specialty) return;
    if (chapter.seen.includes(eventId)) return;

    chapter.seen.push(eventId);
    chapter.done = Math.min(chapter.quota, chapter.done + 1);
    chapter.turnsWaited = 0;

    if (chapter.done >= chapter.quota) {
      chapter.active = false;
      state.log.unshift(`🏥 科室体验章节完成：已亲历 ${chapter.quota}/${chapter.quota} 个 ${getSpecialtyName(state.specialty)} 专属场景。`);
    } else {
      state.log.unshift(`🏥 科室体验 ${chapter.done}/${chapter.quota}：${getSpecialtyName(state.specialty)}`);
    }
  }

  function normalizeCareerField(field, value, fallback) {
    if (value == null) return fallback ?? null;
    return careerEnumValues[field]?.has(value) ? value : (fallback ?? null);
  }

  function getCareerDisplayName(field, value) {
    return careerDisplayNames[field]?.[value] || value || '';
  }

  function getHospitalResumeValue(current) {
    if (!current.hospitalTier && !current.hospitalType) return '';
    const typeText = getCareerDisplayName('hospitalType', current.hospitalType);
    const tierText = getCareerDisplayName('hospitalTier', current.hospitalTier);
    if (typeText && tierText) return `${typeText}（${tierText}）`;
    return typeText || tierText;
  }

  function extractCareerUpdates(container) {
    if (!container || typeof container !== 'object') return null;
    const direct = {};
    for (const key of Object.keys(careerFieldLabels)) {
      if (Object.prototype.hasOwnProperty.call(container, key)) {
        direct[key] = container[key];
      }
    }
    return { ...(container.career || {}), ...direct };
  }

  function applyCareerUpdates(container) {
    const updates = extractCareerUpdates(container);
    if (!updates || !Object.keys(updates).length) return [];

    const prevHospitalText = getHospitalResumeValue(state);
    const careerNotes = [];
    for (const key of Object.keys(careerFieldLabels)) {
      if (!Object.prototype.hasOwnProperty.call(updates, key)) continue;
      const nextValue = normalizeCareerField(key, updates[key], key === 'undergradInstitutionTier' ? 'tier985' : null);
      if (state[key] === nextValue) continue;
      state[key] = nextValue;
      if (!nextValue) continue;
      if (key === 'hospitalTier' || key === 'hospitalType') continue;
      careerNotes.push(`${careerFieldLabels[key]}：${getCareerDisplayName(key, nextValue)}`);
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'hospitalTier') || Object.prototype.hasOwnProperty.call(updates, 'hospitalType')) {
      const hospitalText = getHospitalResumeValue(state);
      if (hospitalText && hospitalText !== prevHospitalText) {
        careerNotes.push(`医院：${hospitalText}`);
      }
    }

    for (const note of careerNotes) {
      state.lastChanges.push(note);
      state.log.unshift(`🧾 ${note}`);
    }
    return careerNotes;
  }

  function queueDelayedConsequences(delayed) {
    if (!delayed?.length) return;
    state.delayedConsequences.push(...delayed.map((item) => ({ ...item })));
  }

  function queueScheduledEvents(items) {
    if (!items?.length) return;
    state.scheduledEvents.push(...items.map((item) => ({
      turns: Math.max(0, Math.round(item.turns ?? item.delay ?? 0)),
      eventId: item.eventId,
      once: !!item.once,
      source: item.source || '',
      preview: item.preview || '',
      conditions: item.conditions
    })));
  }

  function processDelayedConsequences() {
    if (!state.delayedConsequences.length) return [];

    const nextQueue = [];
    const firedLogs = [];
    for (const item of state.delayedConsequences) {
      item.turns -= 1;
      if (item.turns <= 0) {
        applyEffects(item.effects, '延迟后果');
        applyFlags(item.flagsSet);
        if (item.log) {
          state.log.unshift(`⚠️ ${item.log}`);
          firedLogs.push(item.log);
        }
      } else {
        nextQueue.push(item);
      }
    }

    state.delayedConsequences = nextQueue;
    return firedLogs;
  }

  function triggerInterruptEvent(eventId, origin, sourceText) {
    if (!eventId || !randomEventMap.has(eventId)) return false;
    state.seenRandomEvents.push(eventId);
    state.randomEventReturnTo = state.currentEventId;
    state.inRandomEvent = true;
    state.currentEventId = eventId;
    state.eventOrigin = origin;
    if (sourceText) {
      state.log.unshift(`🧭 ${sourceText}`);
    }
    return true;
  }

  function maybeTriggerScheduledEvent() {
    if (!state.scheduledEvents.length) return false;

    const nextQueue = [];
    let triggered = null;
    for (const item of state.scheduledEvents) {
      if (triggered) {
        nextQueue.push(item);
        continue;
      }
      const turns = item.turns - 1;
      const signature = `${item.eventId}:${item.source}`;
      if (turns <= 0 && evaluateConditions(item.conditions)) {
        if (item.once && state.scheduledHistory.includes(signature)) {
          continue;
        }
        triggered = { ...item, turns };
        if (item.once) state.scheduledHistory.push(signature);
      } else {
        nextQueue.push({ ...item, turns });
      }
    }
    state.scheduledEvents = nextQueue;
    if (!triggered) return false;
    return triggerInterruptEvent(triggered.eventId, 'forced', triggered.source || `因为你之前的选择，现在迎来了 ${randomEventMap.get(triggered.eventId)?.title || '后续事件'}。`);
  }

  function getProgressMeta() {
    const endings = JSON.parse(localStorage.getItem(STORAGE_KEYS.endings) || '[]');
    const achievements = JSON.parse(localStorage.getItem(STORAGE_KEYS.achievements) || '[]');
    return { unlockedEndings: endings, unlockedAchievements: achievements };
  }

  function saveProgress() {
    localStorage.setItem(STORAGE_KEYS.save, JSON.stringify(state));
  }

  function clearSaveOnly() {
    localStorage.removeItem(STORAGE_KEYS.save);
  }

  function clearAllProgress() {
    localStorage.removeItem(STORAGE_KEYS.save);
    localStorage.removeItem(STORAGE_KEYS.endings);
    localStorage.removeItem(STORAGE_KEYS.achievements);
  }

  function normalizeDelayedConsequences(items) {
    if (!Array.isArray(items)) return [];
    return items
      .filter((item) => item && typeof item === 'object')
      .map((item) => ({
        turns: typeof item.turns === 'number' ? item.turns : 0,
        effects: item.effects && typeof item.effects === 'object' ? item.effects : undefined,
        flagsSet: Array.isArray(item.flagsSet) ? item.flagsSet : undefined,
        log: typeof item.log === 'string' ? item.log : undefined
      }));
  }

  function normalizeGameState(rawState) {
    const initial = getInitialState();
    const nextState = rawState && typeof rawState === 'object' ? rawState : {};
    const stats = normalizeStats(nextState.stats, nextState, initial.stats);

    const validRandomId = (id) => randomEventMap.has(id) || eventMap.has(id);
    const migratedCurrentEventId = mapLegacyEventId(nextState.currentEventId);
    const currentValid = eventMap.has(migratedCurrentEventId) || randomEventMap.has(migratedCurrentEventId);
    const flags = nextState.flags && typeof nextState.flags === 'object' ? nextState.flags : {};

    const retryState = {};
    if (nextState.retryState && typeof nextState.retryState === 'object') {
      for (const [key, value] of Object.entries(nextState.retryState)) {
        if (value && typeof value === 'object') {
          retryState[key] = {
            attempts: typeof value.attempts === 'number' ? Math.max(0, Math.round(value.attempts)) : 0,
            bonus: typeof value.bonus === 'number' ? value.bonus : 0
          };
        }
      }
    }

    const generation = typeof nextState.generation === 'number'
      ? Math.min(MAX_GENERATION, Math.max(1, Math.round(nextState.generation)))
      : 1;

    return {
      saveVersion: SAVE_VERSION,
      currentEventId: currentValid ? migratedCurrentEventId : initial.currentEventId,
      age: typeof nextState.age === 'number' ? Math.max(18, Math.round(nextState.age)) : initial.age,
      careerYear: typeof nextState.careerYear === 'number' ? Math.max(1, Math.round(nextState.careerYear)) : Math.max(1, (typeof nextState.age === 'number' ? Math.round(nextState.age) : initial.age) - 17),
      stage: typeof nextState.stage === 'string' ? nextState.stage : initial.stage,
      stats,
      flags,
      delayedConsequences: normalizeDelayedConsequences(nextState.delayedConsequences),
      scheduledEvents: normalizeScheduledEvents(nextState.scheduledEvents),
      scheduledHistory: Array.isArray(nextState.scheduledHistory) ? nextState.scheduledHistory.filter((item) => typeof item === 'string').slice(0, 80) : [],
      log: Array.isArray(nextState.log) && nextState.log.length ? nextState.log.slice(0, 80) : initial.log.slice(),
      endingId: typeof nextState.endingId === 'string' ? nextState.endingId : null,
      turn: typeof nextState.turn === 'number' ? Math.max(0, Math.round(nextState.turn)) : 0,
      lastChanges: Array.isArray(nextState.lastChanges) ? nextState.lastChanges.slice(0, 10) : [],
      seenRandomEvents: Array.isArray(nextState.seenRandomEvents)
        ? nextState.seenRandomEvents.filter((id) => randomEventMap.has(id))
        : [],
      retryState,
      inRandomEvent: randomEventMap.has(migratedCurrentEventId),
      randomEventReturnTo: validRandomId(mapLegacyEventId(nextState.randomEventReturnTo)) ? mapLegacyEventId(nextState.randomEventReturnTo) : null,
      eventOrigin: typeof nextState.eventOrigin === 'string' ? nextState.eventOrigin : 'main',
      specialty: typeof nextState.specialty === 'string' && GAME_DATA.specialties?.[nextState.specialty] ? nextState.specialty : null,
      undergradInstitutionTier: normalizeCareerField('undergradInstitutionTier', nextState.undergradInstitutionTier, initial.undergradInstitutionTier),
      graduateInstitutionTier: normalizeCareerField('graduateInstitutionTier', nextState.graduateInstitutionTier, initial.graduateInstitutionTier),
      degreeTrack: normalizeCareerField('degreeTrack', nextState.degreeTrack, initial.degreeTrack),
      cityTier: normalizeCareerField('cityTier', nextState.cityTier, initial.cityTier),
      hospitalTier: normalizeCareerField('hospitalTier', nextState.hospitalTier, initial.hospitalTier),
      hospitalType: normalizeCareerField('hospitalType', nextState.hospitalType, initial.hospitalType),
      careerTitle: normalizeCareerField('careerTitle', nextState.careerTitle, initial.careerTitle),
      financialCrises: typeof nextState.financialCrises === 'number' ? Math.max(0, Math.round(nextState.financialCrises)) : 0,
      generation,
      legacy: nextState.legacy && typeof nextState.legacy === 'object' ? nextState.legacy : {},
      generationLog: Array.isArray(nextState.generationLog) ? nextState.generationLog.slice(0, MAX_GENERATION) : [],
      family: nextState.family && typeof nextState.family === 'object'
        ? nextState.family
        : { partner: !!flags.has_partner, married: !!flags.married, child: !!flags.has_child, dink: !!flags.dink, single: !!flags.single_choice },
      lastOutcomeNarrative: typeof nextState.lastOutcomeNarrative === 'string' ? nextState.lastOutcomeNarrative : null,
      lastOutcomeType: typeof nextState.lastOutcomeType === 'string' ? nextState.lastOutcomeType : null,
      lastOutcomeSource: typeof nextState.lastOutcomeSource === 'string' ? nextState.lastOutcomeSource : null,
      specialtyChapter: normalizeSpecialtyChapter(nextState.specialtyChapter),
      diminishingCarry: {
        skill: typeof nextState.diminishingCarry?.skill === 'number' ? nextState.diminishingCarry.skill : 0,
        network: typeof nextState.diminishingCarry?.network === 'number' ? nextState.diminishingCarry.network : 0,
        research: typeof nextState.diminishingCarry?.research === 'number' ? nextState.diminishingCarry.research : 0
      }
    };
  }

  function tryLoadSave() {
    const raw = localStorage.getItem(STORAGE_KEYS.save);
    if (!raw) return false;
    try {
      const parsed = JSON.parse(raw);
      const mappedId = mapLegacyEventId(parsed.currentEventId);
      if (!eventMap.has(mappedId) && !randomEventMap.has(mappedId)) return false;
      state = normalizeGameState(parsed);
      saveProgress();
      return true;
    } catch (_err) {
      return false;
    }
  }

  function updateAchievements() {
    const meta = getProgressMeta();
    const unlocked = new Set(meta.unlockedAchievements);

    for (const achievement of achievementsCatalog) {
      if (unlocked.has(achievement.id)) continue;
      if (achievement.check(state, meta)) {
        unlocked.add(achievement.id);
        state.log.unshift(`🏅 成就解锁：${achievement.name}`);
      }
    }

    localStorage.setItem(STORAGE_KEYS.achievements, JSON.stringify(Array.from(unlocked)));
  }

  function recordEnding(endingId) {
    const endings = new Set(JSON.parse(localStorage.getItem(STORAGE_KEYS.endings) || '[]'));
    endings.add(endingId);
    localStorage.setItem(STORAGE_KEYS.endings, JSON.stringify(Array.from(endings)));
  }

  function checkCrisisEnding() {
    if (state.stats.health <= 0) return 'ending_crisis_health';
    if (state.stats.legalRisk >= 100) return 'ending_crisis_legal';
    if (state.stats.ethics <= 5) return 'ending_ethics_fall';
    if (state.stats.stress >= 100) return pickStressCrisisEnding();
    if (state.stats.money <= 0 && state.financialCrises >= 3) return 'ending_finance_debt_loop';
    return null;
  }

  function shouldTriggerFinancialCrisis() {
    return state.stats.money <= 0 && !state.inRandomEvent;
  }

  function pickStressCrisisEnding() {
    const s = state.stats;
    if (s.health <= 30) return 'ending_crisis_night_shift_ghost';
    if (s.legalRisk >= 40) return 'ending_crisis_pc_crash';
    if (s.network >= 40) return 'ending_crisis_badge_off';
    if (s.health >= 40 && s.network >= 30) return 'ending_crisis_read_receipts';
    if (s.ethics >= 50) return 'ending_crisis_phone_reflex';
    return 'ending_crisis_stress';
  }

  function getCurrentEvent() {
    return eventMap.get(state.currentEventId) || randomEventMap.get(state.currentEventId);
  }

  function canShowRandomEvent(re) {
    const mergedConditions = {
      ...(re.conditions || {}),
      requireFlags: [...(re.conditions?.requireFlags || []), ...(re.requireFlags || [])],
      forbidFlags: [...(re.conditions?.forbidFlags || []), ...(re.forbidFlags || [])]
    };
    return evaluateConditions(mergedConditions);
  }

  function maybeTriggerSpecialtyChapter() {
    const chapter = state.specialtyChapter;
    if (!chapter?.active || chapter.done >= chapter.quota) return false;

    const candidates = getSpecialtyChapterCandidates();
    if (!candidates.length) return false;

    chapter.turnsWaited = (chapter.turnsWaited || 0) + 1;
    const remaining = chapter.quota - chapter.done;
    const overdue = chapter.turnsWaited >= Math.max(2, remaining * 3);
    if (!overdue && Math.random() >= 0.5) return false;

    const chosen = randomByWeight(candidates.map((re) => ({ ...re, weight: (re.weight || 1) * 2 })));
    triggerInterruptEvent(chosen.id, 'random', `科室体验触发：${String(chosen.title || '').replace(/^[🎲⚠️🎯]\s*/, '')}`);
    state.stage = chosen.stage || state.stage;
    noteSpecialtyChapterProgress(chosen.id);
    return true;
  }

  function maybeInjectRandomEvent() {
    const cur = getCurrentEvent();
    if (!cur || cur.type === 'ending') return;

    if (maybeTriggerSpecialtyChapter()) return;

    if (Math.random() > RANDOM_EVENT_CHANCE) return;

    const candidates = (GAME_DATA.randomEvents || []).filter((re) =>
      re.stage === state.stage &&
      !state.seenRandomEvents.includes(re.id) &&
      canShowRandomEvent(re)
    );
    if (!candidates.length) return;

    const chosen = randomByWeight(candidates.map((re) => ({ ...re, weight: re.weight || 1 })));
    triggerInterruptEvent(chosen.id, 'random', `随机事件触发：${String(chosen.title || '').replace(/^[🎲⚠️🎯]\s*/, '')}`);
    state.stage = chosen.stage || state.stage;
    noteSpecialtyChapterProgress(chosen.id);
  }

  const ROMANCE_GUARANTEE_EVENT_ID = 're_rm_guarantee_late';
  const ROMANCE_SKIP_FLAGS = ['has_partner', 'single_choice', 'dink', 'romance_guarantee_used'];

  function maybeTriggerRomanceGuarantee() {
    if (state.age < ROMANCE_GUARANTEE_AGE) return false;
    if (ROMANCE_SKIP_FLAGS.some((flag) => state.flags[flag])) return false;
    if (!randomEventMap.has(ROMANCE_GUARANTEE_EVENT_ID)) return false;
    if (state.seenRandomEvents.includes(ROMANCE_GUARANTEE_EVENT_ID)) return false;

    return triggerInterruptEvent(
      ROMANCE_GUARANTEE_EVENT_ID,
      'forced',
      '你已经很久没有认真谈过这件事，命运在这一年替你按下了暂停键。'
    );
  }

  // 婚姻/子女线的事件原本按科室阶段严格限定（training/resident），
  // 一旦伴侣关系较晚才成立（例如通过 32 岁保底），角色可能已经跨过那些
  // 阶段而永远无法再遇到结婚/生育节点。这里用与恋爱保底相同的“强制直达”
  // 方式，跳过阶段筛选，只保证家庭线不会因为时间点错过而彻底断掉。
  const MARRIAGE_GUARANTEE_AGE = 30;
  const MARRIAGE_EVENT_CANDIDATES = ['re_marriage', 're_marriage_resident'];

  function maybeTriggerMarriageGuarantee() {
    if (state.age < MARRIAGE_GUARANTEE_AGE) return false;
    if (!state.flags.has_partner || state.flags.married || state.flags.dink) return false;
    const candidate = MARRIAGE_EVENT_CANDIDATES.find(
      (id) => randomEventMap.has(id) && !state.seenRandomEvents.includes(id)
    );
    if (!candidate) return false;
    return triggerInterruptEvent(
      candidate,
      'forced',
      '你们都清楚这段关系走到了该有个说法的时候。'
    );
  }

  const NEXT_GEN_GUARANTEE_AGE = 33;
  const NEXT_GEN_GUARANTEE_EVENT_ID = 're_child_choice';

  function maybeTriggerNextGenGuarantee() {
    if (state.age < NEXT_GEN_GUARANTEE_AGE) return false;
    if (!state.flags.married) return false;
    if (state.flags.has_child || state.flags.dink || state.flags.adopted_child) return false;
    if (!randomEventMap.has(NEXT_GEN_GUARANTEE_EVENT_ID)) return false;
    if (state.seenRandomEvents.includes(NEXT_GEN_GUARANTEE_EVENT_ID)) return false;
    return triggerInterruptEvent(
      NEXT_GEN_GUARANTEE_EVENT_ID,
      'forced',
      '关于要不要迎接下一代，你们已经没法一直含糊过去了。'
    );
  }

  function resolveTarget(target, randomTargets) {
    let resolvedTarget = target;
    if (randomTargets?.length) {
      resolvedTarget = randomByWeight(randomTargets).target;
      state.lastChanges.push('随机事件：命运骰子已生效');
    }
    return resolvedTarget;
  }

  function applyCheckOutcome(option, currentEvent, bonus) {
    const effectiveCheck = bonus
      ? { ...option.check, baseChance: option.check.baseChance + bonus }
      : option.check;
    const details = checkSystem.computeCheckDetails(effectiveCheck, state.stats);
    const roll = Math.floor(Math.random() * 100) + 1;
    const success = roll <= details.chance;
    const branch = success ? details.check.success : details.check.failure;

    applyEffects(branch.effects, success ? '判定成功' : '判定失败');
    applyFlags(branch.flagsSet);
    applySpecialty(branch.specialty);
    const careerNotes = applyCareerUpdates(branch);
    queueDelayedConsequences(branch.delayed);
    queueScheduledEvents(branch.scheduledEvents);

    const summary = describeCheckSummary(details, 3);
    const feedback = branch.feedback || (success ? '你顶住了关键节点。' : '这次没能如愿，只能转向补救路线。');
    const narrative = branch.resultText || feedback;
    const resultText = `${success ? '判定成功' : '判定失败'}（掷骰 ${roll} / 成功率 ${details.chance}%）：${feedback}`;
    const logPrefix = currentEvent.major ? '✦' : '•';
    const extraLog = typeof branch.log === 'string' && !/^判定(成功|失败)/.test(branch.log) ? ` ${branch.log}` : '';

    state.lastChanges.unshift(resultText);
    if (summary) {
      state.lastChanges.splice(1, 0, `主要因素：${summary}`);
    }

    state.log.unshift(`${logPrefix} ${resultText}${extraLog}`);
    return {
      targetId: resolveTarget(branch.target, branch.randomTargets),
      success,
      narrative,
      careerNotes
    };
  }

  function handleRetryFailure(option, event) {
    const cfg = option.retry;
    const record = state.retryState[event.id] || { attempts: 0, bonus: 0 };
    record.attempts += 1;
    record.bonus = (record.bonus || 0) + (cfg.bonusPerRetry || 0);
    state.retryState[event.id] = record;

    if (record.attempts >= cfg.maxAttempts) {
      state.log.unshift(`⏳ 重试次数已用尽（${record.attempts}/${cfg.maxAttempts}），转入备选路线。`);
      delete state.retryState[event.id];
      return false;
    }

    applyEffects(cfg.costPerRetry, '重试代价');
    if (typeof cfg.yearCostPerRetry === 'number' && cfg.yearCostPerRetry > 0) {
      state.age += cfg.yearCostPerRetry;
      state.careerYear += cfg.yearCostPerRetry;
    }
    state.log.unshift(`🔁 你决定明年再战（第 ${record.attempts + 1}/${cfg.maxAttempts} 次），成功率已提升。`);
    return true;
  }

  function pushOutcomeLog(text) {
    if (!text) return;
    if (state.log[0] === text) return;
    state.log.unshift(text);
  }

  function advanceByOption(option) {
    state.turn += 1;
    state.lastChanges = [];
    state.eventOrigin = 'main';

    const currentEvent = getCurrentEvent();
    const wasRandom = randomEventMap.has(state.currentEventId);

    const firedDelayedLogs = processDelayedConsequences();
    applyEffects(option.effects, '本次选择');
    applyFlags(option.flagsSet);
    applySpecialty(option.specialty);
    let careerNotes = applyCareerUpdates(option);
    queueDelayedConsequences(option.delayed);
    queueScheduledEvents(option.scheduledEvents);

    const deltaYear = typeof option.yearDelta === 'number' ? option.yearDelta : (currentEvent.yearDelta || 0);
    const choicePrefix = currentEvent.major ? '◆' : '•';

    let targetId;
    let retriedStay = false;
    let outcomeNarrative = '';
    let outcomeType = 'neutral';
    let optionNarrativeLogged = false;

    if (option.check) {
      const bonus = option.retry ? (state.retryState[currentEvent.id]?.bonus || 0) : 0;
      const outcome = applyCheckOutcome(option, currentEvent, bonus);
      targetId = outcome.targetId;
      outcomeNarrative = outcome.narrative;
      outcomeType = outcome.success ? 'success' : 'failure';
      optionNarrativeLogged = true; // applyCheckOutcome already logged its own line
      if (outcome.careerNotes?.length) careerNotes = careerNotes.concat(outcome.careerNotes);

      if (option.retry && !wasRandom) {
        if (outcome.success) {
          delete state.retryState[currentEvent.id];
        } else {
          retriedStay = handleRetryFailure(option, currentEvent);
          targetId = retriedStay ? currentEvent.id : option.retry.alternativeTarget;
          if (retriedStay) {
            outcomeType = 'retry';
          }
        }
      }
    } else {
      targetId = resolveTarget(option.target, option.randomTargets);
      if (option.resultText) {
        outcomeNarrative = option.resultText;
        outcomeType = careerNotes.length ? 'career' : 'neutral';
      } else if (careerNotes.length) {
        outcomeNarrative = `履历变化：${careerNotes.join('；')}`;
        outcomeType = 'career';
        optionNarrativeLogged = true; // already logged per career note in applyCareerUpdates
      } else if (state.lastChanges.length) {
        outcomeNarrative = `${state.lastChanges.join('；')}。`;
        outcomeType = 'neutral';
      }
    }

    if (outcomeNarrative && !optionNarrativeLogged) {
      pushOutcomeLog(`📖 ${outcomeNarrative}`);
    }

    if (firedDelayedLogs.length) {
      outcomeNarrative = outcomeNarrative
        ? `${firedDelayedLogs.join('；')}｜本次选择：${outcomeNarrative}`
        : firedDelayedLogs.join('；');
      outcomeType = 'consequence';
    }

    if (outcomeNarrative) {
      state.lastOutcomeNarrative = outcomeNarrative;
      state.lastOutcomeType = outcomeType;
      state.lastOutcomeSource = currentEvent.title || '';
    }

    if (wasRandom) {
      state.currentEventId = targetId || state.randomEventReturnTo || currentEvent.returnTo || fallbackEndingId;
      state.inRandomEvent = false;
      state.randomEventReturnTo = null;
    } else {
      state.currentEventId = targetId || fallbackEndingId;
    }

    const targetEvent = getCurrentEvent();
    state.stage = targetEvent?.stage || state.stage;
    state.log.unshift(`${choicePrefix} 你选择了：${option.text}`);

    const crisisEndingId = checkCrisisEnding();
    if (crisisEndingId) {
      state.currentEventId = crisisEndingId;
      state.stage = 'ending';
    } else if (!retriedStay && deltaYear > 0) {
      state.age += deltaYear;
      state.careerYear += deltaYear;
    }

    if (!crisisEndingId && !wasRandom && !retriedStay && shouldTriggerFinancialCrisis()) {
      state.financialCrises += 1;
      triggerInterruptEvent('re_forced_financial_crisis', 'forced', `因为你的经济状况已经跌到 ${state.stats.money}，财务危机被立刻触发。`);
    }

    if (!crisisEndingId && !wasRandom && !retriedStay && !state.inRandomEvent) {
      if (!maybeTriggerScheduledEvent() && !maybeTriggerRomanceGuarantee() && !maybeTriggerMarriageGuarantee() && !maybeTriggerNextGenGuarantee()) {
        maybeInjectRandomEvent();
      }
    } else if (retriedStay) {
      state.eventOrigin = 'retry';
    }

    const nowEvent = getCurrentEvent();
    if (nowEvent?.type === 'ending') {
      state.endingId = nowEvent.id;
      state.stage = 'ending';
      recordEnding(nowEvent.id);
      updateAchievements();
      clearSaveOnly();
    } else {
      updateAchievements();
      saveProgress();
    }
  }

  function getStatStatus(stat, value) {
    if (stat === 'money') {
      if (value <= 0) return { icon: '⚠', label: '破产', tone: 'danger' };
      if (value <= 10) return { icon: '⚠', label: '濒临破产', tone: 'danger' };
      if (value <= 30) return { icon: '▲', label: '警戒', tone: 'warn' };
      if (value <= 55) return { icon: '●', label: '吃紧', tone: 'stable' };
      if (value <= 80) return { icon: '✓', label: '稳定', tone: 'good' };
      return { icon: '▲', label: '宽裕', tone: 'good' };
    }

    if (positiveStats.has(stat)) {
      if (value <= 15) return { icon: '⚠', label: '危险', tone: 'danger' };
      if (value <= 35) return { icon: '◔', label: '偏低', tone: 'warn' };
      if (value <= 65) return { icon: '●', label: '正常', tone: 'stable' };
      return { icon: '▲', label: '良好', tone: 'good' };
    }

    if (negativeStats.has(stat)) {
      if (value >= 85) return { icon: '⚠', label: '危险', tone: 'danger' };
      if (value >= 60) return { icon: '▲', label: '警戒', tone: 'warn' };
      if (value >= 30) return { icon: '●', label: '可控', tone: 'stable' };
      return { icon: '✓', label: '安全', tone: 'good' };
    }

    return { icon: '●', label: '正常', tone: 'stable' };
  }

  const IMPACT_STAT_LABELS = {
    health: '健康', stress: '压力', money: '经济', skill: '医术',
    research: '科研', network: '人脉', ethics: '医德', legalRisk: '法律风险'
  };

  function classifyImpactMagnitude(stat, delta) {
    const abs = Math.abs(delta);
    const dir = delta > 0 ? '上升' : '下降';
    const label = IMPACT_STAT_LABELS[stat] || stat;
    if (abs >= 8) return `${label}大幅${dir}`;
    if (abs >= 5) return `${label}明显${dir}`;
    if (abs >= 3) return `${label}${dir}`;
    return `${label}轻微${dir}`;
  }

  function collectImpactHints(effects, limit = 4) {
    if (!effects) return [];
    return Object.entries(effects)
      .filter(([stat, delta]) => typeof delta === 'number' && delta !== 0 && IMPACT_STAT_LABELS[stat])
      .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
      .slice(0, limit)
      .map(([stat, delta]) => classifyImpactMagnitude(stat, delta));
  }

  function generateImpactHint(option) {
    if (option.impactHint) return `预计影响：${option.impactHint}`;
    const parts = [];
    const baseHints = collectImpactHints(option.effects);
    if (option.check) {
      if (baseHints.length) parts.push(baseHints.join('、'));
      const successHints = collectImpactHints(option.check.success?.effects);
      const failureHints = collectImpactHints(option.check.failure?.effects);
      if (successHints.length) parts.push(`成功：${successHints.join('、')}`);
      if (failureHints.length) parts.push(`失败：${failureHints.join('、')}`);
    } else if (baseHints.length) {
      parts.push(baseHints.join('、'));
    }
    if (typeof option.yearDelta === 'number' && option.yearDelta > 0) {
      parts.push(`耗时约 ${option.yearDelta} 年`);
    }
    if (option.delayed?.length) parts.push('存在延迟后果');
    if (option.scheduledEvents?.length) parts.push('触发后续事件');

    const legalDeltas = [
      option.effects?.legalRisk,
      option.check?.success?.effects?.legalRisk,
      option.check?.failure?.effects?.legalRisk
    ].filter((v) => typeof v === 'number');
    if (legalDeltas.some((v) => v >= 6)) parts.push('⚠ 法律/合规风险明显上升');

    const healthDeltas = [
      option.effects?.health,
      option.check?.success?.effects?.health,
      option.check?.failure?.effects?.health
    ].filter((v) => typeof v === 'number');
    if (healthDeltas.some((v) => v <= -8)) parts.push('⚠ 健康代价较高');

    const moneyWarning = getProjectedMoneyWarning(option);
    if (moneyWarning) parts.push(moneyWarning.replace('⚠ ', '⚠ '));

    if (careerUpdateHasLock(option)) parts.push('⚠ 涉及履历锁定');

    if (!parts.length) return '';
    return `预计影响：${parts.join('｜')}`;
  }

  function careerUpdateHasLock(option) {
    const updates = [option.careerUpdate, option.check?.success?.careerUpdate, option.check?.failure?.careerUpdate].filter(Boolean);
    return updates.some((update) => update && (update.hospitalTier || update.careerTitle || update.hospitalType));
  }

  function getProjectedMoneyWarning(option) {
    const deltas = [];
    if (typeof option.effects?.money === 'number') deltas.push(option.effects.money);
    if (option.check) {
      for (const branch of [option.check.success, option.check.failure]) {
        if (typeof branch?.effects?.money === 'number') {
          deltas.push((option.effects?.money || 0) + branch.effects.money);
        }
      }
    }
    if (!deltas.length) return '';
    const projected = Math.min(...deltas.map((delta) => clampStat('money', state.stats.money + delta)));
    if (projected <= 0) return '⚠ 经济状况可能直接破产';
    if (projected <= 10) return '⚠ 经济状况可能跌到濒临破产';
    if (projected <= 30) return '⚠ 经济状况可能进入警戒';
    return '';
  }

  function buildStatRow(key, name, value) {
    const li = document.createElement('li');
    const [min, max] = GAME_DATA.statBounds[key];
    const width = ((value - min) / (max - min)) * 100;
    const status = getStatStatus(key, value);

    li.className = `stat-row stat-${status.tone}`;
    li.innerHTML = `
      <div class="stat-head">
        <span>${name}</span>
        <strong>${formatStatValue(key, value, false)}</strong>
      </div>
      <div class="stat-bar" aria-hidden="true">
        <span class="stat-fill stat-fill-${status.tone}" style="width:${Math.max(0, Math.min(100, width)).toFixed(1)}%"></span>
      </div>
      <div class="stat-meta">
        <span class="stat-status">${status.icon} ${status.label}</span>
      </div>
    `;
    return li;
  }

  function renderStats() {
    refs.stats.innerHTML = '';
    for (const [key, name] of Object.entries(statNames)) {
      refs.stats.appendChild(buildStatRow(key, name, state.stats[key]));
    }
  }

  function renderResume() {
    const items = [
      ['undergradInstitutionTier', getCareerDisplayName('undergradInstitutionTier', state.undergradInstitutionTier)],
      ['graduateInstitutionTier', getCareerDisplayName('graduateInstitutionTier', state.graduateInstitutionTier)],
      ['degreeTrack', getCareerDisplayName('degreeTrack', state.degreeTrack)],
      ['cityTier', getCareerDisplayName('cityTier', state.cityTier)],
      ['hospitalTier', getHospitalResumeValue(state)],
      ['careerTitle', getCareerDisplayName('careerTitle', state.careerTitle)]
    ].filter(([, value]) => value);

    refs.resumeList.innerHTML = '';
    refs.resumeCard.hidden = items.length === 0;
    for (const [key, value] of items) {
      const li = document.createElement('li');
      li.innerHTML = `<span>${careerFieldLabels[key]}</span><strong>${value}</strong>`;
      refs.resumeList.appendChild(li);
    }
  }

  function renderFeedback() {
    refs.feedback.innerHTML = '';
    for (const line of state.lastChanges.slice(0, 5)) {
      const item = document.createElement('div');
      item.className = 'feedback-line';
      item.textContent = line;
      refs.feedback.appendChild(item);
    }
  }

  function renderLog() {
    refs.logList.innerHTML = '';
    for (const line of state.log.slice(0, 14)) {
      const li = document.createElement('li');
      li.textContent = line;
      refs.logList.appendChild(li);
    }
  }

  function getOptionDisplayText(event, option) {
    let text = option.text;
    if (!state.flags.adjusted_specialty) return text;
    if (event.id === 'specialty_direction_choice') {
      if (option.target === 'specialty_acute_choice') return `${text}${specialtyRestrictionNotes.acute}`;
      if (option.target === 'specialty_surgery_choice') return `${text}${specialtyRestrictionNotes.surgery}`;
      if (option.target === 'specialty_platform_choice') return `${text}${specialtyRestrictionNotes.platform}`;
    }
    if (option.specialty) {
      const key = option.specialty === 'surgery' ? 'surgery_sp' : option.specialty;
      if (specialtyRestrictionNotes[key]) return `${text}${specialtyRestrictionNotes[key]}`;
    }
    return text;
  }

  function optionHasTarget(option) {
    if (option.target || option.randomTargets?.length) return true;
    if (!option.check) return false;
    return Boolean(
      option.check.success?.target ||
      option.check.success?.randomTargets?.length ||
      option.check.failure?.target ||
      option.check.failure?.randomTargets?.length
    );
  }

  function getTimelineLabel(event) {
    if (event.timeLabel) return event.timeLabel;
    const deltaYear = typeof event.yearDelta === 'number' ? event.yearDelta : 0;
    if (deltaYear <= 0) return '阶段事件';
    return `约 ${deltaYear} 年`;
  }

  const STRATEGY_LABEL_MAP = {
    '稳妥': 'safe',
    '均衡': 'balanced',
    '激进': 'risky',
    '团队协作': 'team',
    '长期主义': 'longterm',
    '休息': 'rest'
  };

  function renderOptions(event) {
    refs.options.innerHTML = '';
    const isRandom = randomEventMap.has(event.id);
    const validOptions = (event.options || []).filter((option) => isRandom || optionHasTarget(option));

    for (const option of validOptions) {
      const btn = document.createElement('button');
      const available = evaluateConditions(option.conditions);
      const hints = [];
      const retryRecord = option.retry ? state.retryState[event.id] : null;

      if (option.check) {
        const bonus = retryRecord ? (retryRecord.bonus || 0) : 0;
        const effectiveCheck = bonus ? { ...option.check, baseChance: option.check.baseChance + bonus } : option.check;
        const details = checkSystem.computeCheckDetails(effectiveCheck, state.stats);
        hints.push(`预计成功率 ${details.chance}%`);
        const factorSummary = describeCheckSummary(details, 2);
        if (factorSummary) hints.push(`主要因素：${factorSummary}`);
      }
      if (!available) {
        hints.push(describeRequirements(option));
      }
      if (option.consequenceHint) {
        hints.push(`可能后果：${option.consequenceHint}`);
      }
      const projectedMoneyWarning = getProjectedMoneyWarning(option);
      if (projectedMoneyWarning) {
        hints.push(projectedMoneyWarning);
      }
      if (option.scheduledEvents?.length) {
        const previews = option.scheduledEvents.map((item) => item.preview).filter(Boolean).slice(0, 2);
        if (previews.length) {
          hints.push(`后续牵连：${previews.join('；')}`);
        }
      }
      const impactHintText = generateImpactHint(option);

      const tags = [];
      if (option.label && STRATEGY_LABEL_MAP[option.label]) {
        tags.push(`<span class="choice-tag choice-tag-strategy choice-tag-${STRATEGY_LABEL_MAP[option.label]}">${option.label}</span>`);
      } else if (option.safeChoice) {
        tags.push('<span class="choice-tag choice-tag-strategy choice-tag-safe">稳妥</span>');
      } else if (option.riskyChoice) {
        tags.push('<span class="choice-tag choice-tag-strategy choice-tag-risky">激进</span>');
      }
      if (option.retry && retryRecord && retryRecord.attempts > 0) {
        tags.push(`<span class="choice-tag choice-tag-retry">第 ${retryRecord.attempts + 1}/${option.retry.maxAttempts} 次尝试</span>`);
      }
      const tagHtml = tags.length ? `<span class="choice-tags">${tags.join(' ')}</span>` : '';

      const isRisky = option.label === '激进' || option.riskyChoice;
      const isSafe = option.label === '稳妥' || option.safeChoice;
      btn.className = `choice-btn${option.check ? ' check-choice' : ''}${isSafe ? ' safe-choice' : ''}${isRisky ? ' risky-choice' : ''}`;
      btn.type = 'button';
      btn.disabled = !available;
      btn.innerHTML = `${tagHtml}${getOptionDisplayText(event, option)}${hints.length ? `<small>${hints.join('｜')}</small>` : ''}${impactHintText ? `<small class="impact-hint">${impactHintText}</small>` : ''}`;
      btn.addEventListener('click', () => {
        advanceByOption(option);
        renderCurrentState();
      });
      refs.options.appendChild(btn);
    }

    if (validOptions.length === 0) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'choice-btn';
      btn.textContent = '进入默认结局';
      btn.addEventListener('click', () => {
        state.currentEventId = fallbackEndingId;
        state.endingId = fallbackEndingId;
        state.stage = 'ending';
        recordEnding(state.endingId);
        updateAchievements();
        clearSaveOnly();
        renderCurrentState();
      });
      refs.options.appendChild(btn);
    }
  }

  const OUTCOME_TYPE_META = {
    success: { label: '✅ 判定成功', tone: 'success' },
    failure: { label: '❌ 判定失败', tone: 'failure' },
    retry: { label: '🔁 重试进行中', tone: 'retry' },
    career: { label: '🧾 履历变化', tone: 'career' },
    consequence: { label: '⚠ 必然后果', tone: 'consequence' },
    neutral: { label: 'ℹ️ 上次选择结果', tone: 'neutral' }
  };

  function renderOutcomeCard() {
    if (!state.lastOutcomeNarrative) {
      refs.outcomeCard.hidden = true;
      return;
    }
    const meta = OUTCOME_TYPE_META[state.lastOutcomeType] || OUTCOME_TYPE_META.neutral;
    refs.outcomeCard.hidden = false;
    refs.outcomeCard.className = `outcome-card outcome-${meta.tone}`;
    refs.outcomeLabel.textContent = state.lastOutcomeSource ? `${meta.label}｜${state.lastOutcomeSource}` : meta.label;
    refs.outcomeText.textContent = state.lastOutcomeNarrative;
  }

  function renderChapterTag() {
    const chapter = state.specialtyChapter;
    if (!chapter || !state.specialty || (!chapter.active && chapter.done === 0)) {
      refs.chapterTag.hidden = true;
      return;
    }
    refs.chapterTag.hidden = false;
    refs.chapterTag.textContent = `科室体验 ${chapter.done}/${chapter.quota}`;
  }

  function renderGameScreen(event) {
    const isRandom = randomEventMap.has(event.id);
    const rarityLabels = { common: '普通', uncommon: '稀有', rare: '罕见', 'very-rare': '极罕见' };
    const originLabels = {
      main: '主线事件',
      random: '随机事件',
      forced: '必然后果',
      retry: '重试事件'
    };
    refs.timelineBanner.textContent = `医学生涯第 ${state.careerYear} 年 · ${state.age} 岁`;
    refs.stageTag.textContent = GAME_DATA.stages[event.stage] || event.stage;
    refs.ageTag.textContent = `年龄 ${state.age}`;
    refs.timelineTag.textContent = `第 ${state.careerYear} 年`;
    refs.specialtyTag.textContent = `当前科室：${getSpecialtyName(state.specialty)}`;
    renderChapterTag();
    refs.originTag.textContent = originLabels[state.eventOrigin] || originLabels.main;
    refs.originTag.classList.toggle('random-tag', isRandom || state.eventOrigin === 'forced' || state.eventOrigin === 'retry');
    if (isRandom && event.rarity) {
      const rl = rarityLabels[event.rarity] || event.rarity;
      refs.originTag.textContent = `${originLabels[state.eventOrigin] || originLabels.random}｜${rl}`;
    }
    refs.stageTag.classList.toggle('random-tag', false);
    refs.majorTag.hidden = !event.major;
    refs.majorTag.textContent = event.major ? '重大抉择' : '';
    refs.eventCard.classList.toggle('major-event', !!event.major);
    renderOutcomeCard();
    refs.eventTitle.textContent = event.title;
    refs.eventText.textContent = event.text;
    renderResume();
    renderStats();
    renderFeedback();
    renderLog();
    renderOptions(event);
  }

  function renderEndingScreen(event) {
    refs.endingTitle.textContent = event.title;
    refs.endingText.textContent = event.text;

    refs.endingStats.innerHTML = '';
    Object.entries(statNames).forEach(([key, name]) => {
      refs.endingStats.appendChild(buildStatRow(key, name, state.stats[key]));
    });

    const endings = JSON.parse(localStorage.getItem(STORAGE_KEYS.endings) || '[]');
    refs.unlockedEndings.textContent = endings.map((id) => eventMap.get(id)?.title || id).join(' / ') || '暂无';

    const unlockedAchievementIds = JSON.parse(localStorage.getItem(STORAGE_KEYS.achievements) || '[]');
    const unlockedAchievementNames = achievementsCatalog
      .filter((item) => unlockedAchievementIds.includes(item.id))
      .map((item) => `${item.name}（${item.desc}）`);
    refs.unlockedAchievements.textContent = unlockedAchievementNames.join(' / ') || '暂无';

    if (refs.nextGenBtn) {
      refs.nextGenBtn.remove();
      refs.nextGenBtn = null;
    }
    if (state.flags && state.flags.has_child && (state.generation || 1) < MAX_GENERATION) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'nextgen-btn';
      btn.textContent = `以孩子身份开启下一代 →（第 ${(state.generation || 1) + 1} 代）`;
      btn.addEventListener('click', () => {
        startNextGeneration();
        renderCurrentState();
      });
      refs.endingScreen.appendChild(btn);
      refs.nextGenBtn = btn;
    }
  }

  function buildLifeSummary(source) {
    const endingTitle = eventMap.get(source.endingId)?.title || '未竟的人生';
    return `第${source.generation || 1}代 · ${endingTitle}（医术${source.stats.skill}/医德${source.stats.ethics}）`;
  }

  function startNextGeneration() {
    const parentMoney = state.stats.money;
    const nextGen = Math.min(MAX_GENERATION, (state.generation || 1) + 1);
    const genLog = [buildLifeSummary(state), ...(state.generationLog || [])].slice(0, MAX_GENERATION);

    const legacy = {
      generation: nextGen,
      ethicsBonus: 8,
      skillBonus: 6,
      researchBonus: 3,
      networkBonus: 4,
      moneyBonus: parentMoney > 0 ? Math.min(10, Math.round(parentMoney * 0.12)) : 0,
      parentEnding: eventMap.get(state.endingId)?.title || '上一代人生',
      generationLog: genLog
    };

    state = getInitialState(legacy);
    for (const line of state.generationLog) {
      state.log.push(`　└ 上代回顾：${line}`);
    }
    saveProgress();
  }

  function renderCurrentState() {
    const event = getCurrentEvent();
    if (!event) {
      const safeEvent = eventMap.get(fallbackEndingId) || GAME_DATA.events.find((item) => item.type === 'ending');
      if (!safeEvent) {
        refs.startScreen.hidden = false;
        refs.gameScreen.hidden = true;
        refs.endingScreen.hidden = true;
        refs.disclaimer.textContent = '数据异常：缺少可用结局事件，请检查 events.js。';
        return;
      }
      state.currentEventId = safeEvent.id;
      state.endingId = safeEvent.id;
      state.stage = 'ending';
      recordEnding(safeEvent.id);
      updateAchievements();
      clearSaveOnly();
      renderEndingScreen(safeEvent);
      return;
    }

    refs.startScreen.hidden = true;
    refs.gameScreen.hidden = event.type === 'ending';
    refs.endingScreen.hidden = event.type !== 'ending';

    if (event.type === 'ending') {
      renderEndingScreen(event);
      return;
    }

    renderGameScreen(event);
  }

  function startNewGame() {
    state = getInitialState();
    saveProgress();
    renderCurrentState();
  }

  function showStartScreen() {
    refs.startScreen.hidden = false;
    refs.gameScreen.hidden = true;
    refs.endingScreen.hidden = true;

    refs.continueBtn.disabled = !localStorage.getItem(STORAGE_KEYS.save);
    refs.disclaimer.textContent = GAME_DATA.disclaimer;
  }

  function bindActions() {
    refs.startBtn.addEventListener('click', startNewGame);
    refs.continueBtn.addEventListener('click', () => {
      if (tryLoadSave()) {
        renderCurrentState();
      }
    });
    refs.resetBtn.addEventListener('click', startNewGame);
    refs.restartFromEndingBtn.addEventListener('click', startNewGame);
    refs.clearBtn.addEventListener('click', () => {
      clearAllProgress();
      showStartScreen();
      alert('存档、结局与成就已清除。');
    });
  }

  function collectTargets(option) {
    const targets = [];

    if (option.target) targets.push(option.target);
    for (const item of option.randomTargets || []) targets.push(item.target);

    if (option.check) {
      for (const branch of [option.check.success, option.check.failure]) {
        if (!branch) continue;
        if (branch.target) targets.push(branch.target);
        for (const item of branch.randomTargets || []) targets.push(item.target);
      }
    }

    return targets;
  }

  function runDataSelfCheck() {
    const ids = new Set();
    const issues = [];
    for (const event of GAME_DATA.events) {
      if (ids.has(event.id)) issues.push(`重复事件ID: ${event.id}`);
      ids.add(event.id);
      for (const option of event.options || []) {
        for (const targetId of collectTargets(option)) {
          if (!eventMap.has(targetId)) issues.push(`事件 ${event.id} 指向不存在目标 ${targetId}`);
        }
      }
    }

    const totalEventCount = GAME_DATA.events.length;
    const endingCount = GAME_DATA.events.filter((event) => event.type === 'ending').length;
    if (totalEventCount < 45) issues.push(`事件总数不足：${totalEventCount}`);
    if (endingCount < 12) issues.push(`结局总数不足：${endingCount}`);

    if (issues.length) {
      console.error('[数据自检失败]', issues);
    } else {
      console.info(`[数据自检通过] 事件${totalEventCount}，结局${endingCount}`);
    }
  }

  bindActions();
  runDataSelfCheck();
  showStartScreen();
})();
