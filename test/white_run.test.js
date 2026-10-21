'use strict';
/* Kiểm thử luật lượt trắng (SOLUTION_STRUCTURE Mục 15.4) và cách đếm câu đã hiện của lớp game.
   Chạy ở thư mục gốc repo:  node --test
   Mỗi file test chạy trong một tiến trình Node riêng, nên localStorage giả ở đây không dính file khác. */

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
const bank = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'ethics_bank_220.json'), 'utf8'));
assert.ok(E.loadBankData(bank).ok);

function freshRun(seed) {
  mem.clear();
  localStorage.setItem(E.CONFIG.runCounterKey, '0');
  E.wipeAll();
  E.restoreState();
  E.setSeed(seed);
  E.newRun();
}
function play(p, choose) {
  assert.equal(p.error, undefined, p.error);
  E.beginRun(p.arena, p.attempt, p.qs, p.ctx);
  for (;;) {
    const q = E.beginQuestion();
    const c = choose(q, E.run.qi);
    if (c.bua) assert.ok(E.applyItem('eliminate').ok);
    E.recordAnswer(c.btn, c.ms ?? 5000);
    if (E.advanceQuestion()) return E.finishRun();
  }
}
const answerAll = (wrong = []) => (q, i) => ({ btn: wrong.includes(i) ? (q.answer + 1) % 3 : q.answer });

// Tới Boss, kiếm đủ Credit bằng World Quest, mở Boss
function reachBossUnlocked(seed) {
  freshRun(seed);
  while (E.currentArena().id !== 'boss') play(E.prepareArena(), answerAll());
  while (E.state.credits < E.CONFIG.bossUnlockCost + 8) play(E.prepareQuest(), answerAll());
  assert.equal(E.payBossUnlock(), true);
}

// Vào Boss kiểu lớp game: chỉ mở câu khi chém trúng. Trả lời n câu rồi mất hết tim.
function bossThenLoseHearts(n, opts = {}) {
  const p = E.prepareArena();
  assert.equal(p.arena.id, 'boss');
  E.beginRun(p.arena, p.attempt, p.qs, p.ctx);
  const shown = [];
  for (let i = 0; i < n; i++) {
    const q = E.beginQuestion();
    shown.push(q.id);
    if (opts.buaAt === i) assert.ok(E.applyItem('eliminate').ok);
    E.recordAnswer(q.answer, opts.msAt?.[i] ?? 4000);
    E.advanceQuestion();
  }
  return { attempt: p.attempt, shown, notShown: p.qs[n].id, result: E.whiteRun() };
}

test('Mở Boss có 2 lượt trắng; mất hết tim lần 1 là lượt trắng: Boss vẫn mở, trừ phạt giờ, Bùa không hoàn', () => {
  reachBossUnlocked(31);
  assert.equal(E.whiteLeft(), 2);
  E.buyItem('eliminate');
  const credits = E.state.credits;
  const bua = E.state.inventory.eliminate;
  const recordsBefore = E.state.records.length;

  // câu 2 trả lời ở giây 75 → quá 15 giây → phạt 2 Credit
  const r = bossThenLoseHearts(3, { buaAt: 0, msAt: [4000, 75000, 4000] });
  assert.equal(r.result.outcome, 'white');
  assert.equal(E.state.bossUnlocked, true);
  assert.equal(E.whiteLeft(), 1);
  assert.equal(E.state.credits, credits - 2);
  assert.equal(E.state.inventory.eliminate, bua - 1);
  assert.equal(E.state.records.length, recordsBefore);            // không vào dữ liệu chẩn đoán
  const t = E.state.attempts.boss.at(-1);
  assert.deepEqual([t.attempt, t.outcome, t.passed], [1, 'white', false]);
  r.shown.forEach(id => assert.ok(E.state.usedIds.includes(id)));   // câu đã hiện tính là đã gặp
  assert.ok(!E.state.usedIds.includes(r.notShown));                 // câu chưa hiện thì không
  assert.equal(E.run, null);
});

test('Ví dụ Mục 15.4: white → fail 12/15 → pass 14/15', () => {
  reachBossUnlocked(32);
  bossThenLoseHearts(2);                                            // lượt 1: trắng
  const fail = play(E.prepareArena(), answerAll([0, 4, 9]));        // lượt 2: 12/15 trượt
  assert.deepEqual([fail.attempt, fail.correct, fail.passed], [2, 12, false]);
  assert.equal(E.whiteLeft(), 1);                                   // lượt hoàn thành không hồi lượt trắng
  const pass = play(E.prepareArena(), answerAll([3]));              // lượt 3: 14/15 đỗ
  assert.deepEqual([pass.attempt, pass.correct, pass.passed], [3, 14, true]);

  // performance_score của Boss đọc lượt 2 (lượt làm đủ câu đầu tiên), không đọc lượt trắng
  const pts = { 1: 1, 2: 2, 3: 3 };
  const exp = { points_earned: 0, points_offered: 0 };
  E.state.records.filter(x => x.arena === 'boss' && x.attempt === 2).forEach(x => {
    exp.points_offered += pts[x.difficulty];
    if (x.correct && !x.item) exp.points_earned += pts[x.difficulty];
  });
  assert.deepEqual(E.state.performance_by_arena.boss, exp);
  // Cột Boss của O4 đọc lượt đỗ (lượt 3)
  assert.ok(E.reportRecords().filter(x => x.arena === 'boss').every(x => x.attempt === 3));
  assert.deepEqual(E.state.attempts.boss.map(x => x.outcome), ['white', 'fail', 'pass']);
});

test('Mất hết tim lần thứ 3 trong một lần mở khoá: tính là thoát Boss', () => {
  reachBossUnlocked(33);
  E.buyItem('eliminate');
  bossThenLoseHearts(1);
  bossThenLoseHearts(1);
  assert.equal(E.whiteLeft(), 0);
  assert.equal(E.state.bossUnlocked, true);                         // hết lượt trắng nhưng Boss vẫn mở
  const credits = E.state.credits;
  const bua = E.state.inventory.eliminate;
  const r = bossThenLoseHearts(2, { buaAt: 0, msAt: [90000, 4000] });   // có phạt giờ và Bùa
  assert.equal(r.result.outcome, 'quit');
  assert.equal(r.result.last, null);
  assert.equal(E.state.bossUnlocked, false);
  assert.equal(E.state.credits, credits);                           // không trừ phạt của lượt thoát
  assert.equal(E.state.inventory.eliminate, bua);                   // Bùa được hoàn
  assert.deepEqual(E.state.attempts.boss.map(x => x.outcome), ['white', 'white', 'quit']);
  r.shown.forEach(id => assert.ok(E.state.usedIds.includes(id)));

  // Mở khoá lại: 2 lượt trắng mới, số lượt tiếp tục tăng
  while (E.state.credits < E.CONFIG.bossUnlockCost) play(E.prepareQuest(), answerAll());
  assert.equal(E.payBossUnlock(), true);
  assert.equal(E.whiteLeft(), 2);
  assert.equal(E.prepareArena().attempt, 4);
});

test('Thoát Boss chủ động: lượt trắng về 0, số lượt vẫn tăng', () => {
  reachBossUnlocked(34);
  const p = E.prepareArena();
  E.beginRun(p.arena, p.attempt, p.qs, p.ctx);
  E.abandonRun();
  assert.equal(E.whiteLeft(), 0);
  assert.equal(E.state.attempts.boss.at(-1).outcome, 'quit');
  assert.ok(!E.state.usedIds.includes(p.qs[0].id));                 // chưa chém lần nào thì chưa có câu nào hiện
});

test('Bản lưu cũ chưa có trường lượt trắng mà Boss đang mở: coi như còn 2 lượt', () => {
  reachBossUnlocked(35);
  const saved = JSON.parse(localStorage.getItem(E.CONFIG.storageKey));
  delete saved.bossWhiteLeft;
  localStorage.setItem(E.CONFIG.storageKey, JSON.stringify(saved));
  E.restoreState();
  assert.equal(E.whiteLeft(), 2);
});

test('whiteRun chỉ dùng cho Boss', () => {
  freshRun(36);
  const p = E.prepareArena();
  E.beginRun(p.arena, p.attempt, p.qs, p.ctx);
  assert.equal(E.whiteRun(), null);
  assert.ok(E.run);
  E.abandonRun();
});
