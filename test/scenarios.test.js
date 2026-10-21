'use strict';
/* Chạy 4 kịch bản demo (src/cfa_quest_scenarios.js, sinh từ W6/demo-input.md) qua engine
   và so với kết quả mong đợi ghi trong tài liệu (DAU_VIEC E5, F2).
   Chạy ở thư mục gốc repo:  node --test */

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const mem = new Map();
globalThis.localStorage = {
  getItem: k => (mem.has(k) ? mem.get(k) : null),
  setItem: (k, v) => { mem.set(k, String(v)); },
  removeItem: k => { mem.delete(k); }
};

const E = require('../src/cfa_quest_engine.js');
const SCENARIOS = require('../src/cfa_quest_scenarios.js');
const bank = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'ethics_bank_220.json'), 'utf8'));
assert.ok(E.loadBankData(bank).ok);
const byId = new Map(bank.map(q => [q.id, q]));

const ORDER = ['arena1', 'trap1', 'crossroads', 'trap2', 'quest', 'boss'];

function playRound(list, isQuest) {
  const p = E.prepareFixed(list.map(x => x.id), isQuest);
  assert.equal(p.error, undefined, p.error);
  E.beginRun(p.arena, p.attempt, p.qs, p.ctx);
  for (const step of list) {
    E.beginQuestion();
    if (step.item) assert.ok(E.applyItem(step.item).ok, `không dùng được Bùa ở ${step.id}`);
    E.recordAnswer(step.choice, step.timeMs);
    E.advanceQuestion();
  }
  return E.finishRun();
}

const points = id => { const p = E.state.performance_by_arena[id]; return p ? [p.points_earned, p.points_offered] : null; };

SCENARIOS.forEach(sc => {
  test(`${sc.name}: kết quả engine khớp W6/demo-input.md`, () => {
    mem.clear();
    E.wipeAll();
    E.restoreState();
    E.newRun();
    E.state.credits = sc.startCredits;

    for (const id of ORDER) {
      const list = sc.rounds[id];
      if (!list) continue;
      if (sc.buy && sc.buy.before === id) for (let i = 0; i < sc.buy.n; i++) assert.ok(E.buyItem(sc.buy.item), 'không đủ Credit mua Bùa');
      if (id === 'boss') assert.ok(E.payBossUnlock(), `không mở được Boss (ví ${E.state.credits})`);
      const L = playRound(list, id === 'quest');
      const exp = sc.expected[id];
      assert.ok(exp, `thiếu kết quả mong đợi cho ${id}`);
      assert.equal(L.correct, exp.correct, `${id}: số câu đúng`);
      assert.equal(L.total, exp.total, `${id}: số câu`);
      if ('passed' in exp) assert.equal(L.passed, exp.passed, `${id}: đỗ/trượt`);
      if ('credit' in exp) assert.equal(L.credit, exp.credit, `${id}: Credit thưởng`);
      assert.equal(E.state.credits, exp.credits, `${id}: ví sau màn`);
      if (exp.w1) assert.equal(E.state.w1, exp.w1, `${id}: W1`);
      if (exp.w1Step) assert.match(E.state.w1Why, new RegExp(exp.w1Step), `${id}: bước phân định W1`);
      if (exp.w2) assert.equal(E.state.w2, exp.w2, `${id}: W2`);
      if (exp.bossPlan) assert.equal(E.state.bossPlan.map(p => `${p.cluster}:${p.count}`).join(','), exp.bossPlan, `${id}: kế hoạch Boss`);
      if (exp.points) assert.deepEqual(points(id), exp.points, `${id}: points_earned/points_offered`);
      if (sc.stopAfter === id) break;
    }

    if (sc.expected.report) {
      const r = sc.expected.report;
      let earned = 0, offered = 0;
      Object.values(E.state.performance_by_arena).forEach(p => { earned += p.points_earned; offered += p.points_offered; });
      assert.equal(Math.round(earned / offered * 100), r.performance, 'performance_score trên bảng tổng kết');
      Object.entries(r.o4).forEach(([c, label]) => assert.equal(E.conclude(c).text, label, `O4 ${c}`));
    }
  });

  test(`${sc.name}: đáp án đúng trong tài liệu khớp ngân hàng, câu không trùng trong một màn`, () => {
    Object.entries(sc.rounds).forEach(([r, list]) => {
      list.forEach(x => assert.ok(byId.has(x.id), `${r}: ${x.id} không có trong ngân hàng`));
      assert.equal(new Set(list.map(x => x.id)).size, list.length, `${r}: có mã câu lặp`);
    });
  });
});
