(function () {
  'use strict';

  const STORAGE_KEYS = {
    save: 'cmsl_save_v1',
    endings: 'cmsl_endings_v1',
    achievements: 'cmsl_achievements_v1'
  };

  const eventMap = new Map(GAME_DATA.events.map((event) => [event.id, event]));
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
    logList: document.getElementById('log-list'),
    feedback: document.getElementById('change-feedback'),
    stats: document.getElementById('stats'),
    disclaimer: document.getElementById('disclaimer-text'),
    endingTitle: document.getElementById('ending-title'),
    endingText: document.getElementById('ending-text'),
    endingStats: document.getElementById('ending-stats'),
    unlockedEndings: document.getElementById('unlocked-endings'),
    unlockedAchievements: document.getElementById('unlocked-achievements'),
    restartFromEndingBtn: document.getElementById('restart-from-ending')
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
    return Math.min(max, Math.max(min, value));
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
        notes.push(`${statNames[stat]} ${actualDelta > 0 ? '+' : ''}${actualDelta}`);
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

  function tryLoadSave() {
    const raw = localStorage.getItem(STORAGE_KEYS.save);
    if (!raw) return false;
    try {
      const parsed = JSON.parse(raw);
      if (!eventMap.has(parsed.currentEventId)) return false;
      state = parsed;
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

  function advanceByOption(option) {
    state.turn += 1;
    state.lastChanges = [];

    processDelayedConsequences();
    applyEffects(option.effects, '本次选择');
    applyFlags(option.flagsSet);

    if (option.delayed?.length) {
      state.delayedConsequences.push(...option.delayed.map((item) => ({ ...item })));
    }

    const currentEvent = getCurrentEvent();
    const deltaYear = typeof option.yearDelta === 'number' ? option.yearDelta : (currentEvent.yearDelta || 0);
    if (deltaYear > 0) {
      state.age += deltaYear;
    }

    let targetId = option.target;
    if (option.randomTargets?.length) {
      targetId = randomByWeight(option.randomTargets).target;
      state.lastChanges.push('随机事件：命运骰子已生效');
    }

    state.currentEventId = targetId;
    const targetEvent = eventMap.get(targetId);
    state.stage = targetEvent?.stage || state.stage;
    state.log.unshift(`你选择了：${option.text}`);

    const crisisEndingId = checkCrisisEnding();
    if (crisisEndingId) {
      state.currentEventId = crisisEndingId;
      state.stage = 'ending';
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

  function renderStats() {
    refs.stats.innerHTML = '';
    for (const [key, name] of Object.entries(statNames)) {
      const value = state.stats[key];
      const li = document.createElement('li');
      li.className = 'stat-row';
      li.innerHTML = `<span>${name}</span><strong>${value}</strong>`;
      refs.stats.appendChild(li);
    }
  }

  function renderFeedback() {
    refs.feedback.innerHTML = '';
    for (const line of state.lastChanges.slice(0, 3)) {
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

  function renderOptions(event) {
    refs.options.innerHTML = '';
    const validOptions = (event.options || []).filter((option) => {
      if (!option.target || !eventMap.has(option.target)) return false;
      return true;
    });

    for (const option of validOptions) {
      const btn = document.createElement('button');
      const available = evaluateConditions(option.conditions);
      btn.className = 'choice-btn';
      btn.type = 'button';
      btn.disabled = !available;
      btn.innerHTML = `${option.text}${available ? '' : `<small>${describeRequirements(option)}</small>`}`;
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
        state.currentEventId = 'ending_balanced_life';
        state.endingId = 'ending_balanced_life';
        state.stage = 'ending';
        recordEnding(state.endingId);
        updateAchievements();
        renderCurrentState();
      });
      refs.options.appendChild(btn);
    }
  }

  function renderGameScreen(event) {
    refs.stageTag.textContent = `${GAME_DATA.stages[event.stage] || event.stage}`;
    refs.ageTag.textContent = `年龄 ${state.age}`;
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
      const li = document.createElement('li');
      li.textContent = `${name}：${state.stats[key]}`;
      refs.endingStats.appendChild(li);
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
      state.currentEventId = 'ending_crisis_stress';
      state.endingId = 'ending_crisis_stress';
      renderCurrentState();
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

  function runDataSelfCheck() {
    const ids = new Set();
    const issues = [];
    for (const event of GAME_DATA.events) {
      if (ids.has(event.id)) issues.push(`重复事件ID: ${event.id}`);
      ids.add(event.id);
      for (const option of event.options || []) {
        if (option.target && !eventMap.has(option.target)) {
          issues.push(`事件 ${event.id} 指向不存在目标 ${option.target}`);
        }
        for (const rt of option.randomTargets || []) {
          if (!eventMap.has(rt.target)) issues.push(`事件 ${event.id} 的随机目标不存在: ${rt.target}`);
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
