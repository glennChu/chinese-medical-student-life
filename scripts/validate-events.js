'use strict';

const gameData = require('../events.js');

const events = gameData.events;
const map = new Map();
const issues = [];

for (const event of events) {
  if (map.has(event.id)) issues.push(`重复 ID: ${event.id}`);
  map.set(event.id, event);
}

for (const event of events) {
  const options = event.options || [];
  if (event.type !== 'ending' && (options.length < 2 || options.length > 4)) {
    issues.push(`事件 ${event.id} 选项数不在 2-4: ${options.length}`);
  }

  for (const option of options) {
    if (!map.has(option.target)) issues.push(`事件 ${event.id} 的目标不存在: ${option.target}`);
    for (const rt of option.randomTargets || []) {
      if (!map.has(rt.target)) issues.push(`事件 ${event.id} 的随机目标不存在: ${rt.target}`);
    }
  }
}

const reachable = new Set();
const queue = [gameData.startEventId];
while (queue.length) {
  const id = queue.shift();
  if (reachable.has(id)) continue;
  reachable.add(id);
  const event = map.get(id);
  if (!event) continue;
  for (const option of event.options || []) {
    if (option.target && !reachable.has(option.target)) queue.push(option.target);
    for (const rt of option.randomTargets || []) {
      if (rt.target && !reachable.has(rt.target)) queue.push(rt.target);
    }
  }
}

const reachableEndings = events.filter((e) => e.type === 'ending' && reachable.has(e.id));
if (reachableEndings.length < 1) issues.push('没有可达结局');
if (events.length < 45) issues.push(`事件总数不足 45，当前 ${events.length}`);
if (events.filter((e) => e.type === 'ending').length < 12) issues.push('结局总数不足 12');

if (issues.length) {
  console.error('❌ 数据校验失败:');
  for (const issue of issues) console.error('-', issue);
  process.exit(1);
}

console.log('✅ 数据校验通过');
console.log(`事件总数: ${events.length}`);
console.log(`结局总数: ${events.filter((e) => e.type === 'ending').length}`);
console.log(`可达结局数: ${reachableEndings.length}`);
