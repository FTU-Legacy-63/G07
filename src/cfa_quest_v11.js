'use strict';
/* =============================================================================
   CFA Quest — Ethics · demo v11

   File đi kèm:
   - cfa_quest_v11.html        (khung màn hình)
   - cfa_dungeon_ui_v10_skipfix_updated.css  (giao diện cũ, dùng lại nguyên)
   - cfa_quest_v11.css         (vài style mới: bảng chẩn đoán, biểu đồ, hộp thông báo)
   - cfa_quest_v11_bank.js     (ngân hàng nhúng, sinh tự động từ ethics_bank_170.json)
   ============================================================================= */

/* ---------- 1. Cấu hình (Mục 4, 5, 8) ---------- */
const CONFIG = {
  passPercent: 70,               // Mục 8: ngưỡng đỗ >= 70% cho mọi Arena
  startCredits: 3,               // Mục 8: số dư khởi đầu
  creditTiers: [                 // Mục 8: Credit theo kết quả Arena (xét từ trên xuống)
    { minPercent: 90, credit: 4 },
    { minPercent: 80, credit: 3 },
    { minPercent: 70, credit: 2 }
  ],
  bossFirstClearBonus: 5,        // Mục 8: vượt Boss lần đầu +5 Credit
  // Mục 7 chỉ ghi rõ Arena 1 không hiện đúng/sai ngay. Để false thì mọi Arena
  // đều chờ tới màn kết quả mới hiện. Đổi thành true nếu nhóm muốn Trap/Crossroads
  // hiện đáp án ngay sau từng câu (Arena 1 luôn không hiện).
  showFeedbackImmediately: false,
  storageKey: 'cfaQuestV11',
  inProgressKey: 'cfaQuestV11_inProgress',
  runCounterKey: 'cfaQuestV11_runCount'
};

const DIFFICULTY_POINTS = { 1: 1, 2: 2, 3: 3 };   // Mục 5, công thức (3)

// Mục 2: 9 module gom thành 5 cụm
const CLUSTERS = ['C1', 'C2', 'C3', 'C4', 'C5'];
const CLUSTER_INFO = {
  C1: { name: 'Khung đạo đức nền', modules: ['GIPS', 'CODE'] },
  C2: { name: 'Standards I–II', modules: ['S1', 'S2'] },
  C3: { name: 'Standard III', modules: ['S3'] },
  C4: { name: 'Standards IV–V', modules: ['S4', 'S5'] },
  C5: { name: 'Standards VI–VII', modules: ['S6', 'S7'] }
};
const MODULE_NAMES = {
  GIPS: 'GIPS',
  CODE: 'Code of Ethics',
  S1: 'I. Professionalism',
  S2: 'II. Integrity of Capital Markets',
  S3: 'III. Duties to Clients',
  S4: 'IV. Duties to Employers',
  S5: 'V. Investment Analysis, Recommendations & Actions',
  S6: 'VI. Conflicts of Interest',
  S7: 'VII. Responsibilities as CFA Member/Candidate'
};

// Mục 4 + Mục 8 (luật dùng vật phẩm)
const ARENAS = [
  { id: 'arena1',     name: 'Arena 1 · The Gate', size: 15, itemsAllowed: false },
  { id: 'trap1',      name: 'Trap I',             size: 10, itemsAllowed: true },
  { id: 'crossroads', name: 'The Crossroads',     size: 10, itemsAllowed: true },
  { id: 'trap2',      name: 'Trap II',            size: 10, itemsAllowed: true },
  { id: 'boss',       name: 'Boss',               size: 15, itemsAllowed: false }
];
const ARENA_INDEX = Object.fromEntries(ARENAS.map((a, i) => [a.id, i]));
const BOSS_SPLIT = [7, 5, 3];   // Mục 4: 3 cụm yếu nhất, yếu nhất nhận 7 câu

// Mục 8 (Shop): đúng 1 vật phẩm
const ITEMS = {
  eliminate: { name: 'Bùa Loại Trừ', cost: 3, desc: 'Loại 1 phương án sai của câu đang làm (3 còn 2 phương án).' },
};


/* ---------- 2. Ngẫu nhiên có thể cố định seed (phục vụ kiểm thử, demo lặp lại được) ---------- */
let rng = Math.random;
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}


/* ---------- 3. Ngân hàng câu hỏi (Mục 1 Input, Mục 2 định dạng, Mục 9) ---------- */
let BANK = [];
let BANK_OK = false;

function normalizeQuestion(q) {
  return {
    id: String(q.id ?? ''),
    cluster: String(q.cluster ?? '').trim(),
    module: String(q.module ?? '').trim(),
    subStandard: String(q.sub_standard ?? ''),
    difficulty: Number(q.difficulty),
    stem: String(q.stem ?? ''),
    options: Array.isArray(q.options) ? q.options.map(String) : [],
    answer: Number(q.answer),
    distractorReason: Array.isArray(q.distractor_reason) ? q.distractor_reason.map(x => String(x ?? '')) : [],
    hint: String(q.hint ?? ''),
    explanation: String(q.explanation ?? '')
  };
}

function validateBank(list) {
  const errors = [];
  const warnings = [];
  if (!list.length) errors.push('ngân hàng rỗng');
  const seen = new Set();
  list.forEach((q, i) => {
    const tag = q.id || `#${i + 1}`;
    if (!q.id) errors.push(`câu #${i + 1} thiếu id`);
    else if (seen.has(q.id)) errors.push(`trùng id ${q.id}`);
    seen.add(q.id);
    const info = CLUSTER_INFO[q.cluster];
    if (!info) errors.push(`${tag}: cụm "${q.cluster}" không có trong bảng cụm`);
    else if (!info.modules.includes(q.module)) errors.push(`${tag}: module ${q.module} không thuộc ${q.cluster}`);
    if (q.options.length !== 3) errors.push(`${tag}: cần đúng 3 phương án`);
    if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer > 2) errors.push(`${tag}: answer phải là 0, 1 hoặc 2`);
    if (![1, 2, 3].includes(q.difficulty)) errors.push(`${tag}: difficulty phải là 1, 2 hoặc 3`);
    if (!q.stem) errors.push(`${tag}: thiếu stem`);
  });
  Object.keys(MODULE_NAMES).forEach(m => {
    if (!list.some(q => q.module === m)) errors.push(`module ${m} không có câu nào`);
  });
  CLUSTERS.forEach(c => {
    const n = list.filter(q => q.cluster === c).length;
    if (n < 22) warnings.push(`${c} có ${n} câu (target 22)`);
  });
  return { errors, warnings };
}

function applyBank(raw) {
  const arr = Array.isArray(raw) ? raw : (raw?.questions ?? raw?.bank ?? []);
  const list = arr.map(normalizeQuestion);
  const { errors, warnings } = validateBank(list);
  BANK = list;
  BANK_OK = errors.length === 0;
  const el = $('bankStatus');
  if (el) {
    if (BANK_OK) {
      el.textContent = `Ngân hàng hợp lệ: ${list.length} câu, 5 cụm, 9 module.` + (warnings.length ? ` Lưu ý: ${warnings.join('; ')}.` : '');
      el.className = 'status ok';
    } else {
      el.textContent = `Ngân hàng chưa hợp lệ: ${errors.slice(0, 3).join('; ')}${errors.length > 3 ? '…' : ''}`;
      el.className = 'status error';
    }
  }
  return BANK_OK;
}

async function loadBank() {
  try {
    const r = await fetch('../data/ethics_bank_170.json', { cache: 'no-store' });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    applyBank(await r.json());
  } catch {
    // Mở bằng file:// thì trình duyệt chặn fetch, dùng bản nhúng.
    if (Array.isArray(window.CFA_EMBEDDED_BANK) && window.CFA_EMBEDDED_BANK.length) {
      applyBank(window.CFA_EMBEDDED_BANK);
    } else {
      const el = $('bankStatus');
      el.textContent = 'Chưa nạp được ethics_bank_170.json. Dùng nút nạp file bên dưới hoặc chạy bằng local server.';
      el.className = 'status error';
    }
  }
}


/* ---------- 4. Trạng thái và lưu trữ (Mục 5 cấu trúc dữ liệu, Mục 7 đường lỗi) ---------- */
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); return true; } catch { return false; } },
  del(k) { try { localStorage.removeItem(k); } catch { /* bỏ qua */ } }
};

function freshState() {
  return {
    version: 11,
    started: false,
    finished: false,
    runNo: 0,
    stage: 0,                                   // chỉ số Arena kế tiếp cần đỗ
    credits: CONFIG.startCredits,
    inventory: { eliminate: 0 },
    w1: null, w1Why: '',
    w2: null, w2Why: '',
    bossPlan: null, bossWhy: '',
    usedIds: [],                                // câu đã xuất hiện trong lượt chơi
    // Mỗi câu đã xác nhận là một bản ghi:
    // { arena, attempt, qid, cluster, module, difficulty, choice, answer, correct, item, timeMs, reused }
    records: [],
    attempts: { arena1: [], trap1: [], crossroads: [], trap2: [], boss: [] },
    accuracy_by_arena: {},                      // dựng lại từ records sau mỗi Arena
    performance_by_arena: {},                   // dựng lại từ records sau mỗi Arena
    bankLog: [],                                // log thiếu câu để nhóm bổ sung ngân hàng
    hadFailure: false,
    bossClearedOnce: false
  };
}

function loadState() {
  const raw = store.get(CONFIG.storageKey);
  if (raw === null) return { state: freshState(), problem: null };
  try {
    const x = JSON.parse(raw);
    if (!x || x.version !== 11) throw new Error('sai phiên bản');
    return { state: Object.assign(freshState(), x), problem: null };
  } catch {
    store.del(CONFIG.storageKey);
    return { state: freshState(), problem: 'corrupt' };
  }
}

function saveState() {
  if (!store.set(CONFIG.storageKey, JSON.stringify(S))) {
    toast('Trình duyệt không cho lưu tiến trình. Lượt chơi vẫn chạy nhưng sẽ mất khi tải lại trang.');
  }
}

let S = freshState();
let RUN = null;     // Arena đang làm. Không bao giờ lưu (Mục 7: thoát giữa Arena thì huỷ lượt)
let LAST = null;    // Kết quả Arena vừa xong, dùng cho màn kết quả
let shopReturn = 'dashboard';


/* ---------- 5. Sinh đề (Mục 2 ba quy tắc phủ module, Mục 4, Mục 7 đường lỗi) ---------- */
function makeDrawContext() {
  return { used: new Set(S.usedIds), taken: new Set(), log: [], notices: [] };
}

// Câu chưa từng xuất hiện trong lượt chơi và chưa bốc vào Arena này
function freshPool(ctx, filter) {
  return BANK.filter(q => filter(q) && !ctx.used.has(q.id) && !ctx.taken.has(q.id));
}

// Câu lấy lại thì xáo thứ tự phương án (Mục 7, Mục 9)
function takeQuestion(ctx, q, reused) {
  ctx.taken.add(q.id);
  if (!reused) return { ...q, reused: false };
  const order = shuffle([0, 1, 2]);
  return {
    ...q,
    options: order.map(i => q.options[i]),
    distractorReason: order.map(i => q.distractorReason[i] ?? ''),
    answer: order.indexOf(q.answer),
    reused: true
  };
}

// Arena 1: 3 câu mỗi cụm, rải hết module, mỗi mức khó 1 câu.
// Cụm 2 module: module "nặng" nhận mức 1 và 3, module còn lại nhận mức 2.
// Module nặng luân phiên giữa hai lần chơi theo số thứ tự lượt chơi (runNo).
function arena1Slots(modules, heavyIndex) {
  if (modules.length === 1) return [1, 2, 3].map(d => ({ module: modules[0], difficulty: d }));
  if (modules.length === 2) {
    const heavy = modules[heavyIndex];
    const light = modules[1 - heavyIndex];
    return [
      { module: heavy, difficulty: 1 },
      { module: light, difficulty: 2 },
      { module: heavy, difficulty: 3 }
    ];
  }
  return [1, 2, 3].map((d, i) => ({ module: modules[i % modules.length], difficulty: d }));
}

function buildArena1(ctx) {
  const heavyIndex = S.runNo % 2 === 1 ? 0 : 1;
  const qs = [];
  CLUSTERS.forEach(c => {
    let reusedCount = 0;
    arena1Slots(CLUSTER_INFO[c].modules, heavyIndex).forEach(({ module, difficulty }) => {
      // Đề cố định: lấy câu đầu tiên theo thứ tự ngân hàng, không bốc ngẫu nhiên
      let q = freshPool(ctx, x => x.module === module && x.difficulty === difficulty)[0];
      if (q) { qs.push(takeQuestion(ctx, q, false)); return; }
      q = freshPool(ctx, x => x.cluster === c && x.difficulty === difficulty)[0];
      if (q) {
        ctx.log.push(`Arena 1: ${module} hết câu mới mức ${difficulty}, bù bằng ${q.module}`);
        qs.push(takeQuestion(ctx, q, false));
        return;
      }
      q = shuffle(BANK.filter(x => x.module === module && x.difficulty === difficulty && !ctx.taken.has(x.id)))[0];
      if (q) { reusedCount++; qs.push(takeQuestion(ctx, q, true)); return; }
      ctx.log.push(`Arena 1: ${c} không có câu mức ${difficulty}`);
    });
    if (reusedCount) ctx.notices.push(`Cụm ${c} đã hết câu mới cho Arena 1: lấy lại ${reusedCount} câu đã gặp, thứ tự phương án đã được xáo lại.`);
  });
  return qs;
}

// Bốc n câu của một cụm, chia đều cho các module trong cụm (Mục 2 quy tắc 2)
function drawCluster(ctx, cluster, n, label) {
  const modules = CLUSTER_INFO[cluster].modules;
  const base = Math.floor(n / modules.length);
  const rest = n - base * modules.length;
  const quota = Object.fromEntries(modules.map(m => [m, base]));
  // Câu dư chia cho module còn nhiều câu mới hơn; bằng nhau thì theo thứ tự module
  [...modules]
    .sort((a, b) => freshPool(ctx, q => q.module === b).length - freshPool(ctx, q => q.module === a).length)
    .slice(0, rest)
    .forEach(m => { quota[m]++; });

  const out = [];
  let shortage = 0;
  modules.forEach(m => {
    const got = shuffle(freshPool(ctx, q => q.module === m)).slice(0, quota[m]);
    got.forEach(q => out.push(takeQuestion(ctx, q, false)));
    if (got.length < quota[m]) {
      const miss = quota[m] - got.length;
      shortage += miss;
      ctx.log.push(`${label}: module ${m} thiếu ${miss} câu mới để chia đều, bù bằng module khác trong ${cluster}`);
    }
  });
  if (shortage > 0) {
    const got = shuffle(freshPool(ctx, q => q.cluster === cluster)).slice(0, shortage);
    got.forEach(q => out.push(takeQuestion(ctx, q, false)));
    shortage -= got.length;
  }
  if (shortage > 0) {
    const got = shuffle(BANK.filter(q => q.cluster === cluster && !ctx.taken.has(q.id))).slice(0, shortage);
    got.forEach(q => out.push(takeQuestion(ctx, q, true)));
    if (got.length) ctx.notices.push(`Cụm ${cluster} đã hết câu mới: lấy lại ${got.length} câu đã gặp, thứ tự phương án đã được xáo lại.`);
    shortage -= got.length;
  }
  if (shortage > 0) ctx.log.push(`${label}: ${cluster} không đủ câu kể cả khi lấy lại`);
  return out;
}

function buildArena(id, ctx) {
  switch (id) {
    case 'arena1':     return buildArena1(ctx);
    case 'trap1':      return shuffle(drawCluster(ctx, S.w1, 10, 'Trap I'));
    case 'crossroads': return shuffle(CLUSTERS.flatMap(c => drawCluster(ctx, c, 2, 'Crossroads')));
    case 'trap2':      return shuffle(drawCluster(ctx, S.w2, 10, 'Trap II'));
    case 'boss':       return shuffle(S.bossPlan.flatMap(p => drawCluster(ctx, p.cluster, p.count, 'Boss')));
    default:           return [];
  }
}


/* ---------- 6. Tính toán (Mục 5: ba công thức, phân định khi bằng nhau) ---------- */

// Mẫu chẩn đoán: chỉ lượt làm đầu tiên của mỗi Arena, bỏ câu dùng vật phẩm
function diagnosticRecords(uptoArenaIndex = Infinity) {
  return S.records.filter(r => r.attempt === 1 && !r.item && ARENA_INDEX[r.arena] <= uptoArenaIndex);
}

// Công thức (1) accuracy_cumulative + dữ liệu phụ để phân định
function clusterStats(records) {
  const m = Object.fromEntries(CLUSTERS.map(c => [c, { cluster: c, correct: 0, attempted: 0, wrongDiffSum: 0, wrongCount: 0, timeSum: 0 }]));
  records.forEach(r => {
    const s = m[r.cluster];
    if (!s) return;
    s.attempted++;
    s.timeSum += r.timeMs;
    if (r.correct) s.correct++;
    else { s.wrongCount++; s.wrongDiffSum += r.difficulty; }
  });
  return CLUSTERS.map(c => {
    const s = m[c];
    return {
      ...s,
      rate: s.attempted ? s.correct / s.attempted : null,
      wrongDiffAvg: s.wrongCount ? s.wrongDiffSum / s.wrongCount : 0,
      avgTimeMs: s.attempted ? s.timeSum / s.attempted : 0
    };
  });
}

function moduleStats(records) {
  const m = {};
  Object.keys(MODULE_NAMES).forEach(k => { m[k] = { module: k, correct: 0, attempted: 0 }; });
  records.forEach(r => {
    if (!m[r.module]) return;
    m[r.module].attempted++;
    if (r.correct) m[r.module].correct++;
  });
  return m;
}

// Kết quả âm nghĩa là a yếu hơn b. So tỷ lệ bằng nhân chéo để tránh sai số số thực.
const TIE_STEPS = [
  {
    label: 'tỷ lệ đúng thấp hơn',
    cmp: (a, b) => {
      if (!a.attempted && !b.attempted) return 0;
      if (!a.attempted) return 1;
      if (!b.attempted) return -1;
      return a.correct * b.attempted - b.correct * a.attempted;
    }
  },
  {
    label: 'độ khó trung bình của câu làm sai cao hơn',
    cmp: (a, b) => { const d = b.wrongDiffAvg - a.wrongDiffAvg; return Math.abs(d) < 1e-9 ? 0 : d; }
  },
  { label: 'thời gian trả lời trung bình dài hơn', cmp: (a, b) => b.avgTimeMs - a.avgTimeMs },
  { label: 'thứ tự mã cụm', cmp: (a, b) => CLUSTERS.indexOf(a.cluster) - CLUSTERS.indexOf(b.cluster) }
];

function rankClusters(records, exclude = []) {
  return clusterStats(records)
    .filter(s => !exclude.includes(s.cluster))
    .sort((a, b) => {
      for (const step of TIE_STEPS) {
        const v = step.cmp(a, b);
        if (v !== 0) return v;
      }
      return 0;
    });
}

function decidingStep(a, b) {
  for (let i = 0; i < TIE_STEPS.length; i++) if (TIE_STEPS[i].cmp(a, b) !== 0) return i;
  return TIE_STEPS.length - 1;
}

function statText(s) {
  return `${s.correct}/${s.attempted} = ${fmtPct(s.correct, s.attempted)}`;
}

function explainPick(ranked, label) {
  const [first, second] = ranked;
  if (!second) return `${label} = ${first.cluster} (${statText(first)}).`;
  const step = decidingStep(first, second);
  if (step === 0) return `${label} = ${first.cluster} vì có tỷ lệ đúng thấp nhất (${statText(first)}).`;
  const tied = ranked.filter(s => TIE_STEPS[0].cmp(s, first) === 0).map(s => s.cluster);
  let detail = '';
  if (step === 1) detail = ` (độ khó TB câu sai: ${first.cluster} ${first.wrongDiffAvg.toFixed(2)}, ${second.cluster} ${second.wrongDiffAvg.toFixed(2)})`;
  if (step === 2) detail = ` (thời gian TB: ${first.cluster} ${(first.avgTimeMs / 1000).toFixed(1)} giây, ${second.cluster} ${(second.avgTimeMs / 1000).toFixed(1)} giây)`;
  return `${tied.join(', ')} bằng tỷ lệ đúng (${statText(first)}). Phân định theo ${TIE_STEPS[step].label}${detail}: ${label} = ${first.cluster}.`;
}

function passed(correct, total) { return correct * 100 >= total * CONFIG.passPercent; }

function creditFor(correct, total) {
  for (const t of CONFIG.creditTiers) if (correct * 100 >= total * t.minPercent) return t.credit;
  return 0;
}

// accuracy_by_arena[cụm][arena] = { correct, attempted } — Mục 5, ba quy tắc lưu
function buildAccuracyByArena() {
  const out = {};
  S.records.filter(r => r.attempt === 1 && !r.item).forEach(r => {
    out[r.cluster] ??= {};
    const cell = (out[r.cluster][r.arena] ??= { correct: 0, attempted: 0 });
    cell.attempted++;
    if (r.correct) cell.correct++;
  });
  return out;
}

// performance_by_arena[arena] = { points_earned, points_offered } — Mục 5, công thức (3)
function buildPerformanceByArena() {
  const out = {};
  S.records.filter(r => r.attempt === 1).forEach(r => {
    const p = (out[r.arena] ??= { points_earned: 0, points_offered: 0 });
    const pts = DIFFICULTY_POINTS[r.difficulty];
    p.points_offered += pts;
    if (r.correct && !r.item) p.points_earned += pts;
  });
  return out;
}

// Mục 5: bốn điều kiện kết luận, chạy theo thứ tự
function conclude(cluster) {
  const d = S.accuracy_by_arena[cluster] || {};
  if (!d.boss) return { text: 'Không kiểm tra lại ở Boss', cls: 'na' };
  const baseC = (d.arena1?.correct || 0) + (d.crossroads?.correct || 0);
  const baseA = (d.arena1?.attempted || 0) + (d.crossroads?.attempted || 0);
  const bossOk = passed(d.boss.correct, d.boss.attempted);
  const change = Math.sign(d.boss.correct * baseA - baseC * d.boss.attempted);   // dấu của (Boss − mốc)
  const detail = { baseC, baseA, bossC: d.boss.correct, bossA: d.boss.attempted };
  if (bossOk && change >= 0) return { text: 'Đã cải thiện', cls: 'good', ...detail };
  if (!bossOk && change > 0) return { text: 'Đã cải thiện nhưng chưa đủ', cls: 'mid', ...detail };
  return { text: 'Cần cải thiện tiếp', cls: 'weak', ...detail };
}


/* ---------- 7. Tiện ích giao diện ---------- */
const $ = id => document.getElementById(id);
function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function fmtPct(c, a) { return a ? (c / a * 100).toFixed(1) + '%' : '--'; }
function show(id) {
  document.querySelectorAll('.screen').forEach(x => x.classList.toggle('active', x.id === id));
  window.scrollTo(0, 0);
}
function toast(text) {
  const x = $('toast');
  x.textContent = text;
  x.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => x.classList.remove('show'), 2600);
}
function notice(title, text) {
  $('noticeTitle').textContent = title;
  $('noticeText').textContent = text;
  $('noticeOverlay').classList.remove('hidden');
  $('noticeOk').focus();
}
function closeNotice() { $('noticeOverlay').classList.add('hidden'); }

function updateHUD() {
  $('hudCredits').textContent = S.credits;
  $('hudStage').textContent = !S.started ? '—' : S.finished ? 'Đã vượt Boss' : ARENAS[S.stage].name;
  $('hudItems').textContent = `${S.inventory.eliminate} Bùa Loại Trừ`;
}

function arenaDesc(id) {
  switch (id) {
    case 'arena1': return '15 câu, 3 câu mỗi cụm, phủ 9 module, đủ 3 mức khó';
    case 'trap1': return S.w1 ? `10 câu cụm ${S.w1}, chia đều theo module` : '10 câu của cụm yếu nhất (W1)';
    case 'crossroads': return '10 câu, 2 câu mỗi cụm';
    case 'trap2': return S.w2 ? `10 câu cụm ${S.w2}, chia đều theo module` : '10 câu của cụm yếu thứ hai (W2)';
    case 'boss': return S.bossPlan ? `15 câu: ${S.bossPlan.map(p => `${p.cluster} ${p.count}`).join(', ')}` : '15 câu, 7/5/3 cho 3 cụm yếu nhất';
    default: return '';
  }
}


/* ---------- 8. Bảng chẩn đoán 2 tầng và biểu đồ (Mục 1 Output, Mục 6, Mục 10) ---------- */
function diagnosticTableHTML(highlight) {
  const recs = diagnosticRecords();
  if (!recs.length) return '<p class="muted">Bảng chẩn đoán hiện sau khi hoàn thành Arena 1.</p>';
  const cs = clusterStats(recs);
  const ms = moduleStats(recs);
  let rows = '';
  cs.forEach(s => {
    const mark = highlight && highlight.includes(s.cluster) ? ' class="hl"' : '';
    rows += `<tr${mark}><th scope="row">${s.cluster} · ${esc(CLUSTER_INFO[s.cluster].name)}</th><td>${s.correct}/${s.attempted}</td><td>${fmtPct(s.correct, s.attempted)}</td></tr>`;
    CLUSTER_INFO[s.cluster].modules.forEach(m => {
      const x = ms[m];
      rows += `<tr class="sub"><th scope="row">${esc(MODULE_NAMES[m])}</th><td>${x.attempted ? `${x.correct}/${x.attempted}` : '--'}</td><td>${fmtPct(x.correct, x.attempted)}</td></tr>`;
    });
  });
  return `<div class="tbl-wrap"><table class="diag"><thead><tr><th>Cụm / module</th><th>Đúng / đã hỏi</th><th>Tỷ lệ</th></tr></thead><tbody>${rows}</tbody></table></div>
  <p class="note">Tính cộng dồn từ lượt làm đầu tiên của mỗi Arena, không tính câu dùng vật phẩm. Mỗi module mới có vài câu nên đây là tín hiệu trong lượt chơi này, chưa phải kết luận về năng lực.</p>`;
}

const CLUSTER_STYLE = {
  C1: { color: '#3d6ee8', dash: '' },
  C2: { color: '#c93c4b', dash: '7 4' },
  C3: { color: '#1f9d70', dash: '2 4' },
  C4: { color: '#b7791f', dash: '10 4 2 4' },
  C5: { color: '#7a4fc4', dash: '4 2' }
};

function progressChartHTML() {
  const done = ARENAS.filter(a => S.attempts[a.id].length > 0);
  if (!done.length) return '<p class="muted">Biểu đồ hiện sau khi hoàn thành Arena 1.</p>';
  const W = 660, H = 270, L = 46, R = 170, T = 18, B = 40;
  const x = i => done.length === 1 ? L + (W - L - R) / 2 : L + i * (W - L - R) / (done.length - 1);
  const y = v => T + (1 - v) * (H - T - B);
  let svg = '';
  [0, 0.5, 0.7, 1].forEach(v => {
    const cls = v === 0.7 ? 'grid threshold' : 'grid';
    svg += `<line class="${cls}" x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}"/><text class="axis" x="${L - 8}" y="${y(v) + 4}" text-anchor="end">${v * 100}%</text>`;
  });
  done.forEach((a, i) => {
    svg += `<text class="axis" x="${x(i)}" y="${H - 14}" text-anchor="middle">${esc(a.name.replace(' · The Gate', ''))}</text>`;
  });
  const ends = [];
  CLUSTERS.forEach(c => {
    const pts = [];
    done.forEach((a, i) => {
      const st = clusterStats(diagnosticRecords(ARENA_INDEX[a.id])).find(s => s.cluster === c);
      if (st.attempted) pts.push([x(i), y(st.rate), st]);
    });
    if (!pts.length) return;
    const st = CLUSTER_STYLE[c];
    if (pts.length > 1) svg += `<polyline fill="none" stroke="${st.color}" stroke-width="2.2" stroke-dasharray="${st.dash}" points="${pts.map(p => p[0] + ',' + p[1]).join(' ')}"/>`;
    pts.forEach(p => { svg += `<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="${st.color}"><title>${c}: ${statText(p[2])}</title></circle>`; });
    const last = pts[pts.length - 1];
    ends.push({ c, x: last[0], y: last[1], text: `${c} ${fmtPct(last[2].correct, last[2].attempted)}`, color: st.color });
  });
  // Đẩy nhãn cuối đường ra xa nhau để không chồng lên nhau
  ends.sort((a, b) => a.y - b.y);
  for (let i = 1; i < ends.length; i++) if (ends[i].y - ends[i - 1].y < 14) ends[i].y = ends[i - 1].y + 14;
  ends.forEach(e => { svg += `<text class="end-label" x="${W - R + 10}" y="${e.y + 4}" fill="${e.color}">${esc(e.text)}</text>`; });
  return `<div class="chart-wrap"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Tỷ lệ đúng cộng dồn của 5 cụm qua các Arena">${svg}</svg></div>
  <p class="note">Mỗi điểm là tỷ lệ đúng cộng dồn của cụm tính tới hết Arena đó. Đường nét đứt màu xám là mốc 70%.</p>`;
}


/* ---------- 9. Màn bảng tiến trình ---------- */
function renderDashboard() {
  updateHUD();
  const grid = $('stageGrid');
  grid.innerHTML = '';
  ARENAS.forEach((a, i) => {
    const done = S.stage > i;
    const active = S.started && !S.finished && S.stage === i;
    const tries = S.attempts[a.id];
    const lastTry = tries[tries.length - 1];
    const card = document.createElement('div');
    card.className = 'stage panel ' + (done ? 'done' : active ? 'active' : 'locked');
    card.innerHTML = `<span class="num">${i + 1}/6</span><span class="badge">${done ? 'Đã đỗ' : active ? (tries.length ? 'Chơi lại' : 'Mở') : 'Khoá'}</span>
      <h3>${esc(a.name)}</h3><p>${esc(arenaDesc(a.id))}</p>
      ${lastTry ? `<p class="try">Lượt ${lastTry.attempt}: ${lastTry.correct}/${lastTry.total}, ${lastTry.passed ? 'đỗ' : 'trượt'}</p>` : ''}`;
    if (active) {
      card.setAttribute('role', 'button');
      card.tabIndex = 0;
      card.addEventListener('click', startArena);
      card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); startArena(); } });
    }
    grid.appendChild(card);
  });
  const rep = document.createElement('div');
  rep.className = 'stage panel ' + (S.finished ? 'active' : 'locked');
  rep.innerHTML = `<span class="num">6/6</span><span class="badge">${S.finished ? 'Mở' : 'Khoá'}</span><h3>Bảng tổng kết</h3><p>So mốc chẩn đoán với Boss theo từng cụm</p>`;
  if (S.finished) {
    rep.setAttribute('role', 'button');
    rep.tabIndex = 0;
    rep.addEventListener('click', () => { renderReport(); show('report'); });
  }
  grid.appendChild(rep);

  $('dashTargets').innerHTML = `
    <p><b>W1:</b> ${S.w1 ? esc(S.w1Why) : 'chưa xác định (sau khi đỗ Arena 1)'}</p>
    <p><b>W2:</b> ${S.w2 ? esc(S.w2Why) : 'chưa xác định (sau khi đỗ Crossroads)'}</p>
    <p><b>Boss:</b> ${S.bossPlan ? esc(S.bossWhy) : 'chưa xác định (sau khi đỗ Trap II)'}</p>`;
  $('dashDiag').innerHTML = diagnosticTableHTML([S.w1, S.w2].filter(Boolean));
  $('dashChart').innerHTML = progressChartHTML();
}


/* ---------- 10. Làm bài (Mục 1 Input, Mục 7 đường lỗi, Mục 8 luật vật phẩm) ---------- */
function startRun() {
  if (!BANK_OK) { notice('Chưa có ngân hàng câu hỏi', 'Hãy nạp ethics_bank_170.json hợp lệ trước khi bắt đầu.'); return; }
  if (S.started && !S.finished && !confirm('Bắt đầu lượt mới sẽ xoá lượt đang chơi. Tiếp tục?')) return;
  const runNo = Number(store.get(CONFIG.runCounterKey) || 0) + 1;
  store.set(CONFIG.runCounterKey, String(runNo));
  S = freshState();
  S.started = true;
  S.runNo = runNo;
  saveState();
  renderDashboard();
  show('dashboard');
}

function startArena() {
  if (!S.started || S.finished) return;
  if (!BANK_OK) { notice('Chưa có ngân hàng câu hỏi', 'Hãy nạp ethics_bank_170.json hợp lệ ở màn hình đầu.'); return; }
  const arena = ARENAS[S.stage];
  const ctx = makeDrawContext();
  const qs = buildArena(arena.id, ctx);
  if (qs.length !== arena.size) {
    notice('Không sinh được đề', `${arena.name} cần ${arena.size} câu nhưng chỉ bốc được ${qs.length}. Chi tiết: ${ctx.log.join('; ')}`);
    return;
  }
  if (arena.id === 'arena1') {
    const pts = qs.reduce((s, q) => s + DIFFICULTY_POINTS[q.difficulty], 0);
    if (pts !== 30) ctx.log.push(`Kiểm tra tự động: tổng điểm độ khó Arena 1 = ${pts}, phải bằng 30`);
  }
  ctx.log.forEach(t => console.warn('[CFA Quest]', t));
  RUN = {
    arena,
    attempt: S.attempts[arena.id].length + 1,
    qs, ctx,
    qi: 0,
    answers: [],
    itemUsedInArena: null,
    itemOnQuestion: null,
    selected: null,
    eliminated: null,
    locked: false,
    shownAt: 0
  };
  store.set(CONFIG.inProgressKey, arena.id);
  renderQuestion();
  show('quiz');
  if (ctx.notices.length) notice('Thông báo về câu hỏi', ctx.notices.join('\n'));
}

function renderQuestion() {
  const q = RUN.qs[RUN.qi];
  RUN.selected = null;
  RUN.eliminated = null;
  RUN.itemOnQuestion = null;
  RUN.locked = false;
  $('quizArena').textContent = RUN.attempt > 1 ? `${RUN.arena.name} · lượt ${RUN.attempt}` : RUN.arena.name;
  $('quizTitle').textContent = arenaDesc(RUN.arena.id);
  $('quizCount').textContent = `${RUN.qi + 1} / ${RUN.qs.length}`;
  $('progress').style.width = (RUN.qi / RUN.qs.length * 100) + '%';
  $('qDifficulty').textContent = `Mức khó ${q.difficulty}`;
  $('qReused').classList.toggle('hidden', !q.reused);
  $('qStem').textContent = q.stem;
  $('qMsg').textContent = '';
  $('feedback').classList.add('hidden');
  $('nextBtn').classList.add('hidden');
  $('confirmBtn').classList.remove('hidden');
  const box = $('qOptions');
  box.innerHTML = '';
  q.options.forEach((txt, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'ans';
    b.textContent = `${'ABC'[i]}. ${txt}`;
    b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', () => selectOption(i));
    box.appendChild(b);
  });
  $('sideProgress').textContent = `${RUN.qi} / ${RUN.qs.length}`;
  $('sideCredits').textContent = S.credits;
  renderItemBox();
  RUN.shownAt = performance.now();     // Mục 1: mốc bắt đầu đo thời gian trả lời
}

function selectOption(i) {
  if (!RUN || RUN.locked || i === RUN.eliminated) return;
  RUN.selected = i;
  [...$('qOptions').children].forEach((b, k) => {
    b.classList.toggle('selected', k === i);
    b.setAttribute('aria-pressed', String(k === i));
  });
  $('qMsg').textContent = '';
}

function confirmAnswer() {
  if (!RUN || RUN.locked) return;
  if (RUN.selected === null) {                        // Mục 7: chưa chọn thì chặn
    $('qMsg').textContent = 'Chọn một phương án trước khi bấm Xác nhận.';
    return;
  }
  const q = RUN.qs[RUN.qi];
  const timeMs = Math.round(performance.now() - RUN.shownAt);
  const correct = RUN.selected === q.answer;
  RUN.answers.push({
    arena: RUN.arena.id, attempt: RUN.attempt, qid: q.id,
    cluster: q.cluster, module: q.module, difficulty: q.difficulty,
    choice: RUN.selected, answer: q.answer, correct,
    item: RUN.itemOnQuestion, timeMs, reused: !!q.reused
  });
  RUN.locked = true;
  if (CONFIG.showFeedbackImmediately && RUN.arena.id !== 'arena1') {
    const bs = [...$('qOptions').children];
    bs.forEach(b => { b.disabled = true; });
    bs[q.answer].classList.add('correct');
    if (!correct) bs[RUN.selected].classList.add('wrong');
    $('feedback').textContent = (correct ? 'Đúng. ' : 'Sai. ') + q.explanation;
    $('feedback').classList.remove('hidden');
    $('confirmBtn').classList.add('hidden');
    $('nextBtn').classList.remove('hidden');
    return;
  }
  nextQuestion();
}

function nextQuestion() {
  RUN.qi++;
  if (RUN.qi >= RUN.qs.length) finishArena();
  else renderQuestion();
}

function renderItemBox() {
  const box = $('itemBox');
  if (!RUN.arena.itemsAllowed) {
    const why = RUN.arena.id === 'arena1' ? 'Arena 1 là bài chẩn đoán gốc.' : 'Boss là chặng đo quyết định của bảng tổng kết.';
    box.innerHTML = `<div class="item-card"><b>Không dùng vật phẩm ở ${esc(RUN.arena.name)}</b><p>${why}</p></div>`;
    return;
  }
  box.innerHTML = Object.entries(ITEMS).map(([id, it]) => {
    const owned = S.inventory[id];
    return `<div class="item-card"><b>${esc(it.name)}</b> <span>(đang có ${owned})</span><p>${esc(it.desc)}</p>
      <button type="button" data-item="${id}" ${owned ? '' : 'disabled'}>${owned ? 'Dùng cho câu này' : 'Chưa có'}</button></div>`;
  }).join('') + `<p class="note">Mỗi Arena dùng tối đa 1 vật phẩm.${RUN.itemUsedInArena ? ` Đã dùng: ${esc(ITEMS[RUN.itemUsedInArena].name)}.` : ''}</p>`;
  box.querySelectorAll('button[data-item]').forEach(b => b.addEventListener('click', () => useItem(b.dataset.item)));
}

function useItem(id) {
  if (!RUN || RUN.locked || !RUN.arena.itemsAllowed) return;
  if (RUN.itemOnQuestion) { notice('Không dùng thêm được', 'Mỗi câu tối đa 1 vật phẩm.'); return; }
  if (RUN.itemUsedInArena) { notice('Không dùng thêm được', 'Mỗi arena sử dụng tối đa 1 vật phẩm.'); return; }
  if (!S.inventory[id]) { toast('Bạn chưa có vật phẩm này.'); return; }
  const q = RUN.qs[RUN.qi];
  S.inventory[id]--;
  RUN.itemUsedInArena = id;
  RUN.itemOnQuestion = id;
  if (id === 'eliminate') {
    const drop = shuffle([0, 1, 2].filter(i => i !== q.answer))[0];   // chỉ loại 1 phương án sai
    RUN.eliminated = drop;
    const b = $('qOptions').children[drop];
    b.disabled = true;
    b.classList.add('eliminated');
    if (RUN.selected === drop) { RUN.selected = null; b.classList.remove('selected'); }
    toast('Đã dùng Bùa Loại Trừ.');
  }
  renderItemBox();
  updateHUD();
}

// Mục 7: thoát giữa Arena thì huỷ lượt, không lưu dở dang
function exitArena() {
  if (!RUN) return;
  if (!confirm('Thoát giữa Arena sẽ huỷ lượt này. Các câu đã làm không được lưu, vật phẩm đã dùng trong lượt này được hoàn lại. Thoát?')) return;
  S = loadState().state;
  RUN = null;
  store.del(CONFIG.inProgressKey);
  renderDashboard();
  show('dashboard');
}

function finishArena() {
  const { arena, attempt, answers, ctx, qs } = RUN;
  const correct = answers.filter(a => a.correct).length;   // công thức (2): tính cả câu dùng vật phẩm
  const total = answers.length;
  const ok = passed(correct, total);
  const credit = ok ? creditFor(correct, total) : 0;
  let bossBonus = 0;
  if (arena.id === 'boss' && ok && !S.bossClearedOnce) { bossBonus = CONFIG.bossFirstClearBonus; S.bossClearedOnce = true; }
  S.credits += credit + bossBonus;
  S.records.push(...answers);
  S.usedIds = [...new Set([...S.usedIds, ...qs.map(q => q.id)])];
  S.attempts[arena.id].push({ attempt, correct, total, passed: ok, credit, bossBonus, itemUsed: RUN.itemUsedInArena, at: new Date().toISOString() });
  S.bankLog.push(...ctx.log.map(text => ({ arena: arena.id, attempt, text })));
  if (!ok) S.hadFailure = true;

  if (ok) {
    if (arena.id === 'arena1') {
      const r = rankClusters(diagnosticRecords());
      S.w1 = r[0].cluster;
      S.w1Why = explainPick(r, 'W1');
    }
    if (arena.id === 'crossroads') {
      const r = rankClusters(diagnosticRecords(), [S.w1]);   // W2 khác W1
      S.w2 = r[0].cluster;
      S.w2Why = explainPick(r, 'W2');
    }
    if (arena.id === 'trap2') {
      const r = rankClusters(diagnosticRecords());           // Boss không loại trừ cụm nào
      S.bossPlan = r.slice(0, 3).map((s, i) => ({ cluster: s.cluster, count: BOSS_SPLIT[i] }));
      S.bossWhy = r.slice(0, 3).map((s, i) => `${s.cluster} ${BOSS_SPLIT[i]} câu (${statText(s)})`).join('; ') + '. ' + explainPick(r, 'Cụm yếu nhất');
    }
    if (arena.id === 'boss') S.finished = true;
    S.stage++;
  }
  S.accuracy_by_arena = buildAccuracyByArena();
  S.performance_by_arena = buildPerformanceByArena();
  saveState();
  store.del(CONFIG.inProgressKey);

  LAST = { arena, attempt, correct, total, passed: ok, credit, bossBonus, qs, answers, notices: ctx.notices, log: ctx.log };
  RUN = null;
  renderResult();
  show('result');
  updateHUD();
}


/* ---------- 11. Màn kết quả sau mỗi Arena (Mục 7 đường chính, Mục 5 output sau mỗi arena) ---------- */
function renderResult() {
  const L = LAST;
  const a = L.arena;
  const next = ARENAS[ARENA_INDEX[a.id] + 1];
  const need = Math.ceil(L.total * CONFIG.passPercent / 100);
  let html = `<div class="eyebrow">Kết quả${L.attempt > 1 ? ` · lượt ${L.attempt}` : ''}</div>
    <h1>${esc(a.name)}</h1>
    <div class="result-score ${L.passed ? 'pass' : 'fail'}">
      <b>${fmtPct(L.correct, L.total)}</b>
      <span>${L.correct}/${L.total} câu đúng · ${L.passed ? 'Đỗ' : 'Trượt'}</span>
    </div>`;

  if (L.passed) {
    html += `<p>Nhận <b>${L.credit} Credit</b>${L.bossBonus ? ` và thưởng vượt Boss lần đầu <b>+${L.bossBonus}</b>` : ''}. Số dư hiện tại: <b>${S.credits} Credit</b>.</p>`;
  } else {
    html += `<p>Chưa đạt ngưỡng ${CONFIG.passPercent}% (cần ${need}/${L.total} câu). Không cấp Credit. ${next ? esc(next.name) + ' bị khoá' : 'Bảng tổng kết bị khoá'} cho tới khi bạn chơi lại và đỗ. Lượt chơi lại dùng bộ câu rút mới.</p>`;
  }
  if (L.attempt > 1) html += '<p class="note">Lượt này tính cho đỗ/trượt và Credit. Bảng chẩn đoán và performance score vẫn giữ theo lượt làm đầu tiên.</p>';
  if (L.notices.length) html += `<div class="warn-box">${L.notices.map(esc).join('<br>')}</div>`;

  if (L.passed) {
    let announce = '';
    if (a.id === 'arena1') announce = `${S.w1Why} Trap I sẽ gồm 10 câu của ${S.w1}.`;
    if (a.id === 'trap1') announce = 'The Crossroads sẽ hỏi 2 câu mỗi cụm để cập nhật bảng chẩn đoán.';
    if (a.id === 'crossroads') announce = `${S.w2Why} Trap II sẽ gồm 10 câu của ${S.w2}.`;
    if (a.id === 'trap2') announce = `Boss sẽ hỏi ${S.bossWhy}`;
    if (a.id === 'boss') announce = 'Bạn đã vượt Boss. Bảng tổng kết đã mở.';
    html += `<div class="announce"><h3>Arena kế tiếp</h3><p>${esc(announce)}</p></div>`;
  }

  html += `<h3>Bảng chẩn đoán</h3>${diagnosticTableHTML([S.w1, S.w2].filter(Boolean))}`;
  html += `<h3>Tỷ lệ đúng của các cụm qua từng Arena</h3>${progressChartHTML()}`;

  const wrong = L.answers.map((r, i) => ({ r, q: L.qs[i] })).filter(x => !x.r.correct);
  html += `<h3>Giải thích câu sai (${wrong.length})</h3>`;
  if (!wrong.length) html += '<p class="muted">Không có câu sai trong Arena này.</p>';
  wrong.forEach(({ r, q }, k) => {
    const reason = q.distractorReason[r.choice];
    html += `<details class="review" ${k === 0 ? 'open' : ''}>
      <summary>${esc(q.cluster)} · ${esc(MODULE_NAMES[q.module])} · mức ${q.difficulty}${r.item ? ` · đã dùng ${esc(ITEMS[r.item].name)}` : ''}</summary>
      <p class="stem">${esc(q.stem)}</p>
      <p><span class="tag wrong">Bạn chọn</span> ${'ABC'[r.choice]}. ${esc(q.options[r.choice])}</p>
      ${reason ? `<p class="reason">Vì sao dễ chọn nhầm: ${esc(reason)}</p>` : ''}
      <p><span class="tag right">Đáp án</span> ${'ABC'[q.answer]}. ${esc(q.options[q.answer])}</p>
      <p class="explain">${esc(q.explanation)}</p>
    </details>`;
  });
  $('resultBody').innerHTML = html;

  const actions = $('resultActions');
  actions.innerHTML = '';
  const addBtn = (label, cls, fn) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = cls;
    b.textContent = label;
    b.addEventListener('click', fn);
    actions.appendChild(b);
  };
  if (L.passed && a.id === 'boss') {
    addBtn('Xem bảng tổng kết', 'primary-btn', () => { renderReport(); show('report'); });
  } else {
    addBtn('Vào Shop', 'secondary-btn', () => openShop('result'));
    addBtn('Về bảng tiến trình', 'secondary-btn', () => { renderDashboard(); show('dashboard'); });
    addBtn(L.passed ? `Vào ${next.name}` : `Chơi lại ${a.name}`, 'primary-btn', startArena);
  }
}


/* ---------- 12. Shop (Mục 8, Mục 7 đường lỗi) ---------- */
function openShop(from) {
  shopReturn = from;
  renderShop();
  show('shop');
}

function renderShop() {
  $('shopCredits').textContent = S.credits;
  const g = $('shopGrid');
  g.innerHTML = '';
  Object.entries(ITEMS).forEach(([id, it]) => {
    const lack = it.cost - S.credits;
    const d = document.createElement('div');
    d.className = 'panel shop-item';
    d.innerHTML = `<h3>${esc(it.name)}</h3><p>${esc(it.desc)}</p>
      <div class="price">${it.cost} Credit · đang có ${S.inventory[id]}</div>
      <button type="button" class="primary-btn" ${lack > 0 ? 'disabled' : ''}>Mua</button>
      ${lack > 0 ? `<p class="lack">Còn thiếu ${lack} Credit</p>` : ''}`;
    d.querySelector('button').addEventListener('click', () => {
      if (S.credits < it.cost) return;
      S.credits -= it.cost;
      S.inventory[id]++;
      saveState();
      renderShop();
      updateHUD();
      toast(`Đã mua ${it.name}.`);
    });
    g.appendChild(d);
  });
}

function closeShop() {
  if (shopReturn === 'result' && LAST) { renderResult(); show('result'); }
  else { renderDashboard(); show('dashboard'); }
}


/* ---------- 13. Bảng tổng kết sau Boss (Mục 5 Bảng A, Mục 7) ---------- */
function renderReport() {
  const abya = S.accuracy_by_arena;
  const perf = S.performance_by_arena;
  let earned = 0, offered = 0;
  Object.values(perf).forEach(p => { earned += p.points_earned; offered += p.points_offered; });

  const bossOrder = (S.bossPlan || []).map(p => p.cluster);
  const order = [...bossOrder, ...CLUSTERS.filter(c => !bossOrder.includes(c))];

  let html = `<div class="eyebrow">Bảng tổng kết</div><h1>Kết quả lượt chơi</h1>
    <div class="performance-final"><span>Performance score toàn lượt<br><small>Tỷ lệ đúng có trọng số theo mức khó. Không tính câu dùng vật phẩm vào tử số.</small></span>
    <b>${offered ? Math.round(earned / offered * 100) : 0}%</b></div>
    <p class="note">${earned}/${offered} điểm độ khó.</p>`;
  if (S.hadFailure) html += '<p class="note">Lượt chơi có ít nhất một lần trượt: performance score và mốc chẩn đoán đọc theo lượt làm đầu tiên của mỗi Arena; điểm và Credit ghi theo lượt đỗ.</p>';
  if (perf.arena1 && perf.arena1.points_offered !== 30) {
    html += `<div class="warn-box">Kiểm tra tự động: points_offered của Arena 1 = ${perf.arena1.points_offered}, phải bằng 30. Lỗi nằm ở khâu sinh đề Arena 1.</div>`;
  }

  // Bảng A
  let rows = '';
  order.forEach(c => {
    const k = conclude(c);
    const cells = ARENAS.map(a => { const x = abya[c]?.[a.id]; return `<td>${x ? `${x.correct}/${x.attempted}` : '--'}</td>`; }).join('');
    rows += `<tr><th scope="row">${c}</th>${cells}<td class="verdict ${k.cls}">${k.text}</td></tr>`;
  });
  html += `<h3>Bảng A · Kết quả theo cụm</h3>
    <div class="tbl-wrap"><table class="diag"><thead><tr><th>Cụm</th><th>Arena 1</th><th>Trap I</th><th>Crossroads</th><th>Trap II</th><th>Boss</th><th>Kết luận</th></tr></thead><tbody>${rows}</tbody></table></div>
    <p class="note">Ô "--" là Arena không hỏi cụm đó, không phải trả lời sai hết. Số liệu tính theo lượt làm đầu tiên, không gồm câu dùng vật phẩm.</p>`;

  // Câu hỏi MVP phải trả lời
  const targeted = [S.w1, S.w2].filter(Boolean);
  html += '<h3>Cụm bị Trap nhắm có tiến bộ ở Boss không?</h3><div class="milestones">';
  targeted.forEach(c => {
    const k = conclude(c);
    const trap = c === S.w1 ? 'Trap I' : 'Trap II';
    html += k.cls === 'na'
      ? `<div class="milestone"><b>${c}</b> (${trap}): không nằm trong 3 cụm yếu nhất lúc vào Boss nên không có câu Boss. Lượt này không trả lời được câu hỏi cho cụm này.</div>`
      : `<div class="milestone"><b>${c}</b> (${trap}): mốc chẩn đoán ${k.baseC}/${k.baseA} = ${fmtPct(k.baseC, k.baseA)}, Boss ${k.bossC}/${k.bossA} = ${fmtPct(k.bossC, k.bossA)}. Kết luận: ${k.text}.</div>`;
  });
  html += '</div><p class="note">Mốc chẩn đoán = Arena 1 + Crossroads. Kết luận chỉ nói về lượt chơi này, mẫu mỗi cụm còn nhỏ.</p>';

  // Chi tiết 9 module
  const firstNoItem = S.records.filter(r => r.attempt === 1 && !r.item);
  const base = moduleStats(firstNoItem.filter(r => r.arena === 'arena1' || r.arena === 'crossroads'));
  const boss = moduleStats(firstNoItem.filter(r => r.arena === 'boss'));
  let mrows = '';
  CLUSTERS.forEach(c => CLUSTER_INFO[c].modules.forEach(m => {
    const b = base[m], s = boss[m];
    mrows += `<tr><th scope="row">${c} · ${esc(MODULE_NAMES[m])}</th><td>${b.attempted ? `${b.correct}/${b.attempted} (${fmtPct(b.correct, b.attempted)})` : '--'}</td><td>${s.attempted ? `${s.correct}/${s.attempted} (${fmtPct(s.correct, s.attempted)})` : '--'}</td></tr>`;
  }));
  html += `<h3>Chi tiết 9 module</h3><div class="tbl-wrap"><table class="diag"><thead><tr><th>Module</th><th>Mốc chẩn đoán</th><th>Boss</th></tr></thead><tbody>${mrows}</tbody></table></div>`;

  html += `<h3>Tỷ lệ đúng của các cụm qua từng Arena</h3>${progressChartHTML()}`;

  // Các lượt làm
  let arows = '';
  ARENAS.forEach(a => S.attempts[a.id].forEach(t => {
    arows += `<tr><th scope="row">${esc(a.name)}</th><td>${t.attempt}</td><td>${t.correct}/${t.total} (${fmtPct(t.correct, t.total)})</td><td>${t.passed ? 'Đỗ' : 'Trượt'}</td><td>${t.credit + t.bossBonus}</td><td>${t.itemUsed ? esc(ITEMS[t.itemUsed].name) : '--'}</td></tr>`;
  }));
  html += `<h3>Các lượt làm Arena</h3><div class="tbl-wrap"><table class="diag"><thead><tr><th>Arena</th><th>Lượt</th><th>Điểm</th><th>Kết quả</th><th>Credit</th><th>Vật phẩm</th></tr></thead><tbody>${arows}</tbody></table></div>`;

  if (S.bankLog.length) {
    html += `<details class="review"><summary>Log thiếu câu cho nhóm bổ sung ngân hàng (${S.bankLog.length})</summary><ul>${S.bankLog.map(l => `<li>${esc(l.arena)} lượt ${l.attempt}: ${esc(l.text)}</li>`).join('')}</ul></details>`;
  }
  html += `<details class="review"><summary>Dữ liệu gốc để đối chiếu với SOLUTION_STRUCTURE</summary>
    <pre>accuracy_by_arena = ${esc(JSON.stringify(abya, null, 2))}\n\nperformance_by_arena = ${esc(JSON.stringify(perf, null, 2))}</pre></details>`;

  $('reportBody').innerHTML = html;
}


/* ---------- 14. Khởi động ---------- */
function resetRun() {
  if (RUN && !confirm('Đang làm dở một Arena. Reset sẽ xoá toàn bộ lượt chơi. Tiếp tục?')) return;
  if (!RUN && !confirm('Reset sẽ xoá toàn bộ dữ liệu lượt chơi hiện tại. Tiếp tục?')) return;
  store.del(CONFIG.storageKey);
  store.del(CONFIG.inProgressKey);
  S = freshState();
  RUN = null;
  LAST = null;
  updateHUD();
  show('home');
  toast('Đã xoá lượt chơi.');
}

function init() {
  const loaded = loadState();
  S = loaded.state;

  $('startBtn').addEventListener('click', startRun);
  $('resetBtn').addEventListener('click', resetRun);
  $('newRunBtn').addEventListener('click', () => { store.del(CONFIG.storageKey); S = freshState(); startRun(); });
  $('shopBtn').addEventListener('click', () => openShop('dashboard'));
  $('shopBack').addEventListener('click', closeShop);
  $('reportBack').addEventListener('click', () => { renderDashboard(); show('dashboard'); });
  $('confirmBtn').addEventListener('click', confirmAnswer);
  $('nextBtn').addEventListener('click', nextQuestion);
  $('exitBtn').addEventListener('click', exitArena);
  $('noticeOk').addEventListener('click', closeNotice);
  $('bankFile').addEventListener('change', e => {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      try { toast(applyBank(JSON.parse(reader.result)) ? 'Đã nạp ngân hàng câu hỏi.' : 'Ngân hàng chưa hợp lệ, xem dòng trạng thái.'); }
      catch (err) { toast('File JSON lỗi: ' + err.message); }
    };
    reader.readAsText(f, 'utf-8');
  });
  // Phím tắt: A/B/C hoặc 1/2/3 để chọn, Enter để xác nhận
  document.addEventListener('keydown', e => {
    if (!RUN || !$('quiz').classList.contains('active') || !$('noticeOverlay').classList.contains('hidden')) return;
    const map = { a: 0, b: 1, c: 2, 1: 0, 2: 1, 3: 2 };
    const k = e.key.toLowerCase();
    if (k in map && !e.ctrlKey && !e.metaKey) { selectOption(map[k]); }
    if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') { e.preventDefault(); RUN.locked ? nextQuestion() : confirmAnswer(); }
  });
  window.addEventListener('beforeunload', e => { if (RUN) { e.preventDefault(); e.returnValue = ''; } });

  updateHUD();
  loadBank().then(() => {
    if (S.started) { renderDashboard(); show('dashboard'); } else show('home');
    const messages = [];
    const leftover = store.get(CONFIG.inProgressKey);
    if (leftover) {
      store.del(CONFIG.inProgressKey);
      messages.push(`Lần trước bạn rời ${ARENAS[ARENA_INDEX[leftover]]?.name ?? 'Arena'} khi chưa làm xong. Lượt đó không được lưu, hãy vào lại Arena để làm từ đầu.`);
    }
    if (loaded.problem === 'corrupt') {
      messages.push('Dữ liệu tiến trình lưu trên trình duyệt bị lỗi hoặc không còn. Hệ thống đã khởi tạo tiến trình rỗng, hãy bắt đầu lại.');
    }
    if (messages.length) notice(loaded.problem === 'corrupt' ? 'Không đọc được tiến trình' : 'Lượt làm dở đã bị huỷ', messages.join('\n\n'));
  });
}

// Công cụ cho nhóm khi demo/kiểm thử (gõ trong Console): CFAQ.state, CFAQ.ranking(), CFAQ.setSeed(7)
window.CFAQ = {
  get state() { return S; },
  get current() { return RUN ? RUN.qs[RUN.qi] : null; },
  ranking: () => rankClusters(diagnosticRecords()),
  setSeed: n => { rng = mulberry32(n); return `Đã cố định seed = ${n}`; },
  config: CONFIG
};

init();
