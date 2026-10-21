'use strict';
/* Kiểm thử engine bằng Node, không cần trình duyệt.
   Chạy ở thư mục gốc repo:  node --test tests/
   (Node 18 trở lên; không cần cài thêm gói nào.)

   Test 1 chơi lại đúng kịch bản W6/demo-input.md (Seed 7, runNo = 1): cùng câu hỏi, cùng nút bấm,
   và so mọi con số trong tài liệu: điểm từng Arena, W1, W2, kế hoạch Boss, Credit, nhãn O4.
   Các test sau kiểm tra luật v12 dễ vỡ khi sửa code: phạt quá giờ, luật thoát, luật Bùa, World Quest. */

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

// localStorage giả trong bộ nhớ (engine lưu tiến trình qua localStorage)
const mem = new Map();
globalThis.localStorage = {
  getItem: k => (mem.has(k) ? mem.get(k) : null),
  setItem: (k, v) => { mem.set(k, String(v)); },
  removeItem: k => { mem.delete(k); }
};

const E = require('../src/cfa_quest_engine.js');
const bank = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'ethics_bank_220.json'), 'utf8'));
const loaded = E.loadBankData(bank);
assert.ok(loaded.ok, 'ngân hàng không hợp lệ: ' + loaded.errors.join('; '));

const BTN = { A: 0, B: 1, C: 2 };

// Bắt đầu lượt mới như sau "reset state → reload → CFAQ.setSeed(seed) → Bắt đầu lượt chơi"
function freshRun(seed) {
  mem.clear();
  localStorage.setItem(E.CONFIG.runCounterKey, '0');
  E.wipeAll();
  E.restoreState();
  E.setSeed(seed);
  E.newRun();
}

// Vào round, trả lời theo chọn(câu, thứ tự) → { nút: 0/1/2, ms, bua }, chấm round. Trả về LAST.
function play(prepared, choose) {
  assert.equal(prepared.error, undefined, prepared.error);
  E.beginRun(prepared.arena, prepared.attempt, prepared.qs, prepared.ctx);
  for (;;) {
    const q = E.beginQuestion();
    const c = choose(q, E.run.qi);
    if (c.bua) assert.ok(E.applyItem('eliminate').ok, 'không dùng được Bùa');
    E.recordAnswer(c.btn, c.ms ?? 5000);
    if (E.advanceQuestion()) return E.finishRun();
  }
}

// Kịch bản lấy từ các bảng trong W6/demo-input.md (bản 21/10/2026, ngân hàng 220 câu): [mã câu, nút bấm]
const DEMO = {
  arena1: [['ETH-C1-GIPS-001', 'A'], ['ETH-C1-CODE-001', 'A'], ['ETH-C1-GIPS-009', 'A'], ['ETH-C2-S1-003', 'A'], ['ETH-C2-S2-001', 'A'], ['ETH-C2-S1-002', 'B'], ['ETH-C3-S3-001', 'B'], ['ETH-C3-S3-002', 'B'], ['ETH-C3-S3-005', 'A'], ['ETH-C4-S4-005', 'B'], ['ETH-C4-S5-001', 'B'], ['ETH-C4-S4-003', 'C'], ['ETH-C5-S6-002', 'A'], ['ETH-C5-S7-001', 'A'], ['ETH-C5-S6-004', 'B']],
  trap1: [['ETH-C2-S1-007', 'A'], ['ETH-C2-S2-019', 'B'], ['ETH-C2-S1-020', 'A'], ['ETH-C2-S1-013', 'B'], ['ETH-C2-S2-017', 'A'], ['ETH-C2-S2-013', 'B'], ['ETH-C2-S2-006', 'B'], ['ETH-C2-S2-007', 'A'], ['ETH-C2-S1-001', 'B'], ['ETH-C2-S1-012', 'A']],
  crossroads: [['ETH-C3-S3-010', 'A'], ['ETH-C1-CODE-009', 'C'], ['ETH-C5-S6-024', 'C'], ['ETH-C1-GIPS-007', 'A'], ['ETH-C3-S3-004', 'C'], ['ETH-C2-S1-016', 'B'], ['ETH-C2-S2-003', 'A'], ['ETH-C4-S5-008', 'A'], ['ETH-C4-S4-016', 'B'], ['ETH-C5-S7-009', 'A']],
  trap2: [['ETH-C1-GIPS-016', 'B'], ['ETH-C1-GIPS-018', 'C'], ['ETH-C1-GIPS-017', 'C'], ['ETH-C1-CODE-004', 'C'], ['ETH-C1-CODE-015', 'B'], ['ETH-C1-CODE-017', 'C'], ['ETH-C1-CODE-010', 'A'], ['ETH-C1-CODE-008', 'A'], ['ETH-C1-GIPS-004', 'B'], ['ETH-C1-GIPS-003', 'C']],
  boss: [['ETH-C1-GIPS-002', 'A'], ['ETH-C2-S1-021', 'A'], ['ETH-C3-S3-024', 'A'], ['ETH-C1-CODE-018', 'B'], ['ETH-C1-CODE-006', 'B'], ['ETH-C2-S2-004', 'B'], ['ETH-C2-S1-014', 'C'], ['ETH-C1-GIPS-019', 'B'], ['ETH-C2-S2-011', 'C'], ['ETH-C2-S1-015', 'A'], ['ETH-C3-S3-009', 'A'], ['ETH-C1-CODE-023', 'A'], ['ETH-C3-S3-038', 'B'], ['ETH-C2-S1-008', 'C'], ['ETH-C2-S2-014', 'C']]
};

// Chơi round theo kịch bản DEMO, kiểm tra từng câu hiện đúng mã câu trong tài liệu
function playDemo(id) {
  const p = E.prepareArena();
  assert.equal(p.arena.id, id);
  return play(p, (q, i) => {
    assert.equal(q.id, DEMO[id][i][0], `${id} câu ${i + 1}`);
    return { btn: BTN[DEMO[id][i][1]] };
  });
}

// Đáp án cho các test luật: đúng hết, hoặc sai câu thứ i nằm trong danh sách wrong
const answerAll = (wrong = []) => (q, i) => ({ btn: wrong.includes(i) ? (q.answer + 1) % 3 : q.answer });

// Đưa lượt chơi tới trước Arena tuỳ chọn, đỗ hết các round trước bằng cách trả lời đúng hết
function reach(stageId, seed = 11) {
  freshRun(seed);
  while (E.currentArena().id !== stageId) play(E.prepareArena(), answerAll());
}

test('Seed 7: khớp từng con số của W6/demo-input.md', () => {
  freshRun(7);
  const S = () => E.state;
  assert.equal(S().runNo, 1);

  let L = playDemo('arena1');
  assert.deepEqual([L.correct, L.total, L.passed, L.credit], [11, 15, true, 2]);
  assert.equal(S().w1, 'C2');
  assert.equal(S().credits, 5);

  L = playDemo('trap1');
  assert.deepEqual([L.correct, L.total, L.passed, L.credit], [8, 10, true, 3]);
  assert.equal(S().credits, 8);

  L = playDemo('crossroads');
  assert.deepEqual([L.correct, L.total, L.passed, L.credit, L.penalty], [8, 10, true, 3, 0]);
  assert.equal(S().w2, 'C1');
  assert.equal(S().credits, 11);

  L = playDemo('trap2');
  assert.deepEqual([L.correct, L.total, L.passed, L.credit, L.penalty], [9, 10, true, 4, 0]);
  assert.equal(S().credits, 15);

  // Mục 6 của tài liệu: xếp hạng sau Arena 4
  const rank = E.rankClusters(E.diagnosticRecords()).map(s => `${s.cluster} ${s.correct}/${s.attempted}`);
  assert.deepEqual(rank, ['C2 11/15', 'C1 11/15', 'C3 4/5', 'C4 5/5', 'C5 5/5']);
  assert.deepEqual(S().bossPlan, [{ cluster: 'C2', count: 7 }, { cluster: 'C1', count: 5 }, { cluster: 'C3', count: 3 }]);

  // Mục 7: mở Boss
  assert.equal(E.payBossUnlock(), true);
  assert.equal(S().credits, 0);

  L = playDemo('boss');
  assert.deepEqual([L.correct, L.total, L.passed, L.credit, L.bossBonus, L.penalty], [14, 15, true, 4, 5, 0]);
  assert.equal(S().credits, 9);
  assert.equal(S().finished, true);

  // Mục 9: bảng tổng kết O4
  const o4 = c => { const r = E.conclude(c); return `${r.baseC}/${r.baseA} ${r.bossC}/${r.bossA} ${r.text}`; };
  assert.equal(o4('C1'), '2/5 5/5 Đã cải thiện');
  assert.equal(o4('C2'), '3/5 7/7 Đã cải thiện');
  assert.equal(o4('C3'), '4/5 2/3 Cần cải thiện tiếp');
  assert.equal(E.conclude('C4').text, 'Không kiểm tra lại ở Boss');

  // Không có câu nào bị phạt giờ, không ghi log thiếu câu
  assert.equal(S().records.filter(r => r.penalty > 0).length, 0);
  assert.equal(S().bankLog.length, 0);
});

test('Phạt quá giờ: làm tròn lên theo bước 10 giây, giây thứ 100 không bị phạt', () => {
  assert.equal(E.overtimeSec(100999, 'crossroads'), 0);
  assert.equal(E.overtimeSec(101000, 'crossroads'), 1);
  assert.equal(E.penaltyFor(1), 1);
  assert.equal(E.penaltyFor(10), 1);
  assert.equal(E.penaltyFor(11), 2);
  assert.equal(E.overtimeSec(999999, 'trap1'), 0);   // Arena 2 không có đồng hồ
});

test('Thoát giữa Arena 3: vẫn trừ tiền phạt quá giờ, hoàn Bùa đã dùng', () => {
  reach('crossroads');
  E.buyItem('eliminate');
  const before = { credits: E.state.credits, bua: E.state.inventory.eliminate };
  const p = E.prepareArena();
  E.beginRun(p.arena, p.attempt, p.qs, p.ctx);
  E.beginQuestion();
  assert.ok(E.applyItem('eliminate').ok);
  E.recordAnswer(E.run.qs[0].answer, 125000);         // quá 25 giây → phạt 3 Credit
  E.advanceQuestion();
  E.beginQuestion();
  assert.equal(E.runPenalty(), 3);
  const msg = E.abandonRun();
  assert.equal(E.run, null);
  assert.equal(E.state.credits, Math.max(0, before.credits - 3));
  assert.equal(E.state.inventory.eliminate, before.bua);
  assert.match(msg, /Bị trừ/);
  assert.equal(E.state.attempts.crossroads.length, 0);  // lượt bị huỷ, không ghi kết quả
  assert.equal(E.state.quits.length, 1);
});

test('Thoát giữa Boss: không hoàn Credit mở Boss, Boss khoá lại, câu đã hiện tính là đã gặp', () => {
  reach('boss');
  while (E.state.credits < E.CONFIG.bossUnlockCost) play(E.prepareQuest(), answerAll());
  assert.equal(E.payBossUnlock(), true);
  const after = E.state.credits;
  const p = E.prepareArena();
  E.beginRun(p.arena, p.attempt, p.qs, p.ctx);
  E.beginQuestion();
  const shownId = E.run.qs[0].id;
  E.abandonRun();
  assert.equal(E.state.bossUnlocked, false);
  assert.equal(E.state.credits, after);
  assert.ok(E.state.usedIds.includes(shownId));
});

test('Bùa: cấm ở Arena 1 và World Quest, tối đa 1 lần mỗi Arena, chỉ loại phương án sai', () => {
  freshRun(3);
  let p = E.prepareArena();
  E.beginRun(p.arena, p.attempt, p.qs, p.ctx);
  E.beginQuestion();
  assert.equal(E.applyItem('eliminate').reason, 'blocked');
  E.abandonRun();

  reach('trap1', 5);
  assert.equal(E.applyItem('eliminate').reason, 'blocked');   // chưa vào Arena
  E.buyItem('eliminate');
  p = E.prepareArena();
  E.beginRun(p.arena, p.attempt, p.qs, p.ctx);
  const q = E.beginQuestion();
  const r = E.applyItem('eliminate');
  assert.ok(r.ok);
  assert.notEqual(r.eliminated, q.answer);
  assert.equal(E.applyItem('eliminate').reason, 'perQuestion');
  E.recordAnswer(q.answer, 3000);
  E.advanceQuestion();
  E.beginQuestion();
  assert.equal(E.applyItem('eliminate').reason, 'perArena');
});

test('World Quest: thưởng theo bậc 90/80/60%, không vào dữ liệu chẩn đoán, Boss không hỏi lại câu Quest', () => {
  reach('boss', 21);
  const recordsBefore = E.state.records.length;
  const credits = E.state.credits;
  const L = play(E.prepareQuest(), answerAll([0, 1, 2]));   // 12/15 = 80% → +3
  assert.deepEqual([L.correct, L.total, L.credit], [12, 15, 3]);
  assert.equal(E.state.credits, credits + 3);
  assert.equal(E.state.records.length, recordsBefore);
  assert.equal(E.state.questRecords.length, 15);
  while (E.state.credits < E.CONFIG.bossUnlockCost) play(E.prepareQuest(), answerAll());
  E.payBossUnlock();
  const boss = E.prepareArena();
  const questIds = new Set(E.state.questUsedIds);
  assert.equal(boss.qs.filter(q => questIds.has(q.id)).length, 0);
});
