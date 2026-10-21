'use strict';
/* Sinh src/cfa_quest_scenarios.js từ W6/demo-input.md (SOLUTION_STRUCTURE Mục 15.6:
   "Bản gốc của 4 kịch bản là W6/demo-input.md. Dữ liệu cho code được chuyển từ file đó sang một file .js").

   Chạy ở thư mục gốc repo:   node tools/build_scenarios.js
   Sửa kịch bản thì sửa bảng trong W6/demo-input.md rồi chạy lại lệnh trên; không sửa tay file .js sinh ra.

   Phần đọc tự động: mọi bảng câu hỏi (mã câu, nút bấm, timeMs, item_used) theo tiêu đề "#### Arena n / Boss / World Quest".
   Phần ghi tay ở META bên dưới (chép từ mục "Kết quả mong đợi", "Sổ Credit", Phụ lục A của cùng tài liệu):
   tên kịch bản, Credit ban đầu, điểm dừng, lúc mua Bùa, kết quả mong đợi từng màn. */

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'W6', 'demo-input.md');
const OUT = path.join(ROOT, 'src', 'cfa_quest_scenarios.js');

// Kết quả mong đợi: chép từ W6/demo-input.md. correct/total/passed/credits = ví sau màn.
const META = {
  1: {
    id: 'k1', name: 'Kịch bản 1 — Chuẩn', proves: 'Toàn bộ luồng 5 màn ra đúng kết quả đã tính trước',
    startCredits: 3, stopAfter: 'report',
    expected: {
      arena1: { correct: 11, total: 15, passed: true, credits: 5, w1: 'C2', points: [22, 30] },
      trap1: { correct: 8, total: 10, passed: true, credits: 8, points: [12, 18] },
      crossroads: { correct: 8, total: 10, passed: true, credits: 11, w2: 'C1', points: [18, 21] },
      trap2: { correct: 9, total: 10, passed: true, credits: 15, bossPlan: 'C2:7,C1:5,C3:3', points: [21, 22] },
      boss: { correct: 14, total: 15, passed: true, credits: 9, points: [34, 37] },
      report: { performance: 84, o4: { C1: 'Đã cải thiện', C2: 'Đã cải thiện', C3: 'Cần cải thiện tiếp', C4: 'Không kiểm tra lại ở Boss', C5: 'Không kiểm tra lại ở Boss' } }
    }
  },
  2: {
    id: 'k2', name: 'Kịch bản 2 — Lật pass/fail', proves: 'Đổi đúng một câu trả lời (Arena 1 câu 15) làm màn đổi từ đỗ sang trượt',
    startCredits: 3, stopAfter: 'arena1',
    expected: { arena1: { correct: 10, total: 15, passed: false, credits: 3, points: [19, 30] } }
  },
  3: {
    id: 'k3', name: 'Kịch bản 3 — Hòa điểm', proves: 'Hòa tỷ lệ đúng và độ khó câu sai, phân định W1 bằng thời gian trả lời trung bình',
    startCredits: 3, stopAfter: 'arena1',
    expected: { arena1: { correct: 11, total: 15, passed: true, credits: 5, w1: 'C2', w1Step: 'thời gian', points: [22, 30] } }
  },
  4: {
    id: 'k4', name: 'Kịch bản 4 — Bật/tắt Bùa', proves: 'arena_score_correct và accuracy_cumulative chạy độc lập khi dùng Bùa',
    startCredits: 3, stopAfter: 'report',
    // Sổ Credit: mua 1 Bùa sau Arena 2 (trước Arena 3); World Quest sau Arena 4
    buy: { before: 'crossroads', item: 'eliminate', n: 1 },
    expected: {
      arena1: { correct: 11, total: 15, passed: true, credits: 5, w1: 'C2', points: [22, 30] },
      trap1: { correct: 8, total: 10, passed: true, credits: 8, points: [12, 18] },
      crossroads: { correct: 8, total: 10, passed: true, credits: 8, w2: 'C1', points: [15, 21] },
      trap2: { correct: 9, total: 10, passed: true, credits: 12, bossPlan: 'C1:7,C2:5,C3:3', points: [21, 22] },
      quest: { correct: 12, total: 15, credit: 3, credits: 15 },
      boss: { correct: 14, total: 15, passed: true, credits: 9, points: [34, 37] },
      report: { performance: 81, o4: { C1: 'Đã cải thiện', C2: 'Đã cải thiện', C3: 'Cần cải thiện tiếp', C4: 'Không kiểm tra lại ở Boss', C5: 'Không kiểm tra lại ở Boss' } }
    }
  }
};

const ROUND_OF = heading => {
  const h = heading.toLowerCase();
  if (h.startsWith('arena 1')) return 'arena1';
  if (h.startsWith('arena 2')) return 'trap1';
  if (h.startsWith('arena 3')) return 'crossroads';
  if (h.startsWith('arena 4')) return 'trap2';
  if (h.startsWith('boss')) return 'boss';
  if (h.startsWith('world quest')) return 'quest';
  return null;
};
const BTN = { A: 0, B: 1, C: 2 };

function parse(md) {
  const scenarios = {};
  let cur = null, round = null;
  md.split(/\r?\n/).forEach((line, no) => {
    const sec = line.match(/^## (\d+)\. KỊCH BẢN/);
    if (sec) { cur = scenarios[sec[1]] = { rounds: {} }; round = null; return; }
    if (/^## /.test(line)) { cur = null; return; }
    if (!cur) return;
    const h = line.match(/^#### (.+)$/);
    if (h) { round = ROUND_OF(h[1].trim()); return; }
    if (!round || !line.startsWith('|')) return;
    const cells = line.split('|').slice(1, -1).map(c => c.trim().replace(/`/g, ''));
    if (cells.length < 10 || !/^\d+$/.test(cells[0])) return;
    const [, id, cluster, , answerLetter, pressed, , , ms, item] = cells;
    if (!(pressed in BTN)) throw new Error(`Dòng ${no + 1}: nút bấm "${pressed}" không hợp lệ`);
    const list = (cur.rounds[round] ??= []);
    list.push({ id, choice: BTN[pressed], timeMs: Number(ms.replace(/[\s.]/g, '')), item: item === 'true' ? 'eliminate' : null, cluster, key: BTN[answerLetter] });
  });
  return scenarios;
}

const parsed = parse(fs.readFileSync(SRC, 'utf8'));

// Đối chiếu cột "Đáp án đúng" của tài liệu với ngân hàng: lệch thì dừng, không sinh file
const bank = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'ethics_bank_220.json'), 'utf8'));
const answerOf = new Map((Array.isArray(bank) ? bank : bank.questions).map(q => [q.id, Number(q.answer)]));
const problems = [];
Object.entries(parsed).forEach(([n, sc]) => Object.entries(sc.rounds).forEach(([r, list]) => list.forEach((x, i) => {
  if (!answerOf.has(x.id)) problems.push(`K${n} ${r} câu ${i + 1}: ${x.id} không có trong ngân hàng`);
  else if (answerOf.get(x.id) !== x.key) problems.push(`K${n} ${r} câu ${i + 1}: ${x.id} tài liệu ghi đáp án ${'ABC'[x.key]}, ngân hàng là ${'ABC'[answerOf.get(x.id)]}`);
})));
if (problems.length) { console.error(problems.join('\n')); process.exit(1); }
const out = Object.keys(META).map(n => {
  const p = parsed[n];
  if (!p) throw new Error(`Không tìm thấy kịch bản ${n} trong ${SRC}`);
  const m = META[n];
  const rounds = {};
  Object.entries(p.rounds).forEach(([r, list]) => {
    rounds[r] = list.map(({ id, choice, timeMs, item }) => ({ id, choice, timeMs, item }));
  });
  return { ...m, rounds };
});

const header = `/* CFA Quest — Ethics · 4 kịch bản demo (SOLUTION_STRUCTURE Mục 15.6).
   FILE SINH TỰ ĐỘNG bởi tools/build_scenarios.js từ W6/demo-input.md — không sửa tay.
   Mỗi câu: { id: mã câu, choice: 0/1/2 (A/B/C), timeMs, item: 'eliminate' | null }. */
`;
fs.writeFileSync(OUT, header + "(typeof window !== 'undefined' ? window : globalThis).CFA_SCENARIOS = " + JSON.stringify(out, null, 1) + ';\n'
  + "if (typeof module !== 'undefined' && module.exports) module.exports = globalThis.CFA_SCENARIOS;\n");
console.log(`Đã ghi ${path.relative(ROOT, OUT)}: ${out.map(s => `${s.id} (${Object.entries(s.rounds).map(([r, l]) => `${r} ${l.length}`).join(', ')})`).join('; ')}`);
