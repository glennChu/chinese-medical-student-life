(function () {
  'use strict';

  const STORAGE_KEYS = {
    save: 'cmsl_save_v1',
    endings: 'cmsl_endings_v1',
    achievements: 'cmsl_achievements_v1'
  };

  const checkSystem = window.CHECK_SYSTEM || globalThis.CHECK_SYSTEM;
  const eventMap = new Map(GAME_DATA.events.map((event) => [event.id, event]));
  const fallbackEndingId = GAME_DATA.fallbackEndingId || 'ending_balanced_life';
  const positiveStats = new Set(['health', 'skill', 'research', 'network', 'ethics']);
  const negativeStats = new Set(['stress', 'legalRisk']);
  const statNames = {
    health: '健康',
    stress: '压力',
    money: '金钱',
    skill: '医术/临床能力',
    research: '科研',
    network: '人脉',
    ethics: '医德/初心',
    legalRisk: '法律风险'
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
    { id: 'collector', name: '人生样本库', desc: '累计解锁 5 个不同结局', check: (_s, meta) => meta.unlockedEndings.length >= 5 }
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
    majorTag: document.getElementById('major-tag'),
    logList: document.getElementById('log-list'),
    feedback: document.getElementById('change-feedback'),
    stats: document.getElementById('stats'),
    disclaimer: document.getElementById('disclaimer-text'),
    endingTitle: document.getElementById('ending-title'),
    endingText: document.getElementById('ending-text'),
    endingStats: document.getElementById('ending-stats'),
    unlockedEndings: document.getElementById('unlocked-endings'),
    unlockedAchievements: document.getElementById('unlocked-achievements'),
    restartFromEndingBtn: document.getElementById('restart-from-ending'),
    eventCard: document.querySelector('.event-card')
  };

  let state = null;

  function getInitialState() {
    return {
      currentEventId: GAME_DATA.startEventId,
      age: 18,
      stage: 'gaokao',
      stats: {
        health: 80,
        stress: 20,
        money: 10,
        skill: 10,
        research: 5,
        network: 8,
        ethics: 70,
        legalRisk: 5
      },
      flags: {},
      delayedConsequences: [],
      log: ['你站在高考志愿填报界面前。'],
      endingId: null,
      turn: 0,
      lastChanges: []
    };
  }

  function clampStat(stat, value) {
    const [min, max] = GAME_DATA.statBounds[stat];
    return checkSystem.clamp(value, min, max);
  }

  function formatMoney(value, signed) {
    const prefix = signed ? (value > 0 ? '+' : value < 0 ? '-' : '') : '';
    return `${prefix}¥${Math.abs(value).toFixed(1)} 万`;
  }

  function formatStatValue(stat, value, signed) {
    if (stat === 'money') return formatMoney(value, signed);
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

  function evaluateConditions(conditions) {
    if (!conditions) return true;

    if (conditions.flags) {
      for (const flag of conditions.flags) {
        if (!state.flags[flag]) return false;
      }
    }

    if (conditions.stats) {
      for (const [key, range] of Object.entries(conditions.stats)) {
        const val = state.stats[key];
        if (typeof range.min === 'number' && val < range.min) return false;
        if (typeof range.max === 'number' && val > range.max) return false;
      }
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
      const next = clampStat(stat, prev + delta);
      state.stats[stat] = next;
      const actualDelta = next - prev;
      if (actualDelta !== 0) {
        notes.push(`${statNames[stat]} ${formatStatValue(stat, actualDelta, true)}`);
      }
    }

    if (notes.length) {
      state.lastChanges.push(`${sourceName}：${notes.join('，')}`);
    }
  }

  function applyFlags(flags) {
    if (!flags) return;
    for (const flag of flags) {
      state.flags[flag] = true;
    }
  }

  function queueDelayedConsequences(delayed) {
    if (!delayed?.length) return;
    state.delayedConsequences.push(...delayed.map((item) => ({ ...item })));
  }

  function processDelayedConsequences() {
    if (!state.delayedConsequences.length) return;

    const nextQueue = [];
    for (const item of state.delayedConsequences) {
      item.turns -= 1;
      if (item.turns <= 0) {
        applyEffects(item.effects, '延迟后果');
        applyFlags(item.flagsSet);
        if (item.log) {
          state.log.unshift(`⚠️ ${item.log}`);
        }
      } else {
        nextQueue.push(item);
      }
    }

    state.delayedConsequences = nextQueue;
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
    const stats = { ...initial.stats };

    for (const stat of Object.keys(initial.stats)) {
      const rawValue = nextState.stats?.[stat];
      stats[stat] = typeof rawValue === 'number' ? clampStat(stat, rawValue) : initial.stats[stat];
    }

    return {
      currentEventId: eventMap.has(nextState.currentEventId) ? nextState.currentEventId : initial.currentEventId,
      age: typeof nextState.age === 'number' ? Math.max(18, Math.round(nextState.age)) : initial.age,
      stage: typeof nextState.stage === 'string' ? nextState.stage : initial.stage,
      stats,
      flags: nextState.flags && typeof nextState.flags === 'object' ? nextState.flags : {},
      delayedConsequences: normalizeDelayedConsequences(nextState.delayedConsequences),
      log: Array.isArray(nextState.log) && nextState.log.length ? nextState.log.slice(0, 80) : initial.log.slice(),
      endingId: typeof nextState.endingId === 'string' ? nextState.endingId : null,
      turn: typeof nextState.turn === 'number' ? Math.max(0, Math.round(nextState.turn)) : 0,
      lastChanges: Array.isArray(nextState.lastChanges) ? nextState.lastChanges.slice(0, 10) : []
    };
  }

  function tryLoadSave() {
    const raw = localStorage.getItem(STORAGE_KEYS.save);
    if (!raw) return false;
    try {
      const parsed = JSON.parse(raw);
      if (!eventMap.has(parsed.currentEventId)) return false;
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
    if (state.stats.stress >= 100) return 'ending_crisis_stress';
    if (state.stats.legalRisk >= 100) return 'ending_crisis_legal';
    if (state.stats.ethics <= 5) return 'ending_ethics_fall';
    return null;
  }

  function getCurrentEvent() {
    return eventMap.get(state.currentEventId);
  }

  function resolveTarget(target, randomTargets) {
    let resolvedTarget = target;
    if (randomTargets?.length) {
      resolvedTarget = randomByWeight(randomTargets).target;
      state.lastChanges.push('随机事件：命运骰子已生效');
    }
    return resolvedTarget;
  }

  function applyCheckOutcome(option, currentEvent) {
    const details = checkSystem.computeCheckDetails(option.check, state.stats);
    const roll = Math.floor(Math.random() * 100) + 1;
    const success = roll <= details.chance;
    const branch = success ? details.check.success : details.check.failure;

    applyEffects(branch.effects, success ? '判定成功' : '判定失败');
    applyFlags(branch.flagsSet);
    queueDelayedConsequences(branch.delayed);

    const summary = describeCheckSummary(details, 3);
    const feedback = branch.feedback || (success ? '你顶住了关键节点。' : '这次没能如愿，只能转向补救路线。');
    const resultText = `${success ? '判定成功' : '判定失败'}（掷骰 ${roll} / 成功率 ${details.chance}%）：${feedback}`;
    const logPrefix = currentEvent.major ? '✦' : '•';
    const extraLog = typeof branch.log === 'string' && !/^判定[成功失败]/.test(branch.log) ? ` ${branch.log}` : '';

    state.lastChanges.unshift(resultText);
    if (summary) {
      state.lastChanges.splice(1, 0, `主要因素：${summary}`);
    }

    state.log.unshift(`${logPrefix} ${resultText}${extraLog}`);
    return resolveTarget(branch.target, branch.randomTargets);
  }

  function advanceByOption(option) {
    state.turn += 1;
    state.lastChanges = [];

    processDelayedConsequences();
    applyEffects(option.effects, '本次选择');
    applyFlags(option.flagsSet);
    queueDelayedConsequences(option.delayed);

    const currentEvent = getCurrentEvent();
    const deltaYear = typeof option.yearDelta === 'number' ? option.yearDelta : (currentEvent.yearDelta || 0);
    const choicePrefix = currentEvent.major ? '◆' : '•';

    let targetId = option.target;
    if (option.check) {
      targetId = applyCheckOutcome(option, currentEvent);
    } else {
      targetId = resolveTarget(option.target, option.randomTargets);
    }

    state.currentEventId = targetId || fallbackEndingId;
    const targetEvent = eventMap.get(state.currentEventId);
    state.stage = targetEvent?.stage || state.stage;
    state.log.unshift(`${choicePrefix} 你选择了：${option.text}`);

    const crisisEndingId = checkCrisisEnding();
    if (crisisEndingId) {
      state.currentEventId = crisisEndingId;
      state.stage = 'ending';
    } else if (deltaYear > 0) {
      state.age += deltaYear;
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
      if (value < 0) return { icon: '⚠', label: '赤字', tone: 'danger' };
      if (value < 6) return { icon: '◔', label: '紧张', tone: 'warn' };
      if (value < 20) return { icon: '●', label: '尚可', tone: 'stable' };
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

  function renderFeedback() {
    refs.feedback.innerHTML = '';
    for (const line of state.lastChanges.slice(0, 4)) {
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

  function renderOptions(event) {
    refs.options.innerHTML = '';
    const validOptions = (event.options || []).filter(optionHasTarget);

    for (const option of validOptions) {
      const btn = document.createElement('button');
      const available = evaluateConditions(option.conditions);
      const hints = [];
      if (option.check) {
        const details = checkSystem.computeCheckDetails(option.check, state.stats);
        hints.push(`预计成功率 ${details.chance}%`);
        const factorSummary = describeCheckSummary(details, 2);
        if (factorSummary) hints.push(`主要因素：${factorSummary}`);
      }
      if (!available) {
        hints.push(describeRequirements(option));
      }

      btn.className = `choice-btn${option.check ? ' check-choice' : ''}`;
      btn.type = 'button';
      btn.disabled = !available;
      btn.innerHTML = `${option.text}${hints.length ? `<small>${hints.join('｜')}</small>` : ''}`;
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

  function renderGameScreen(event) {
    refs.stageTag.textContent = `${GAME_DATA.stages[event.stage] || event.stage}`;
    refs.ageTag.textContent = `年龄 ${state.age}`;
    refs.timelineTag.textContent = getTimelineLabel(event);
    refs.majorTag.hidden = !event.major;
    refs.eventCard.classList.toggle('major-event', !!event.major);
    refs.eventTitle.textContent = event.title;
    refs.eventText.textContent = event.text;
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
