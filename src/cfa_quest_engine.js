'use strict';
/* =============================================================================
   CFA Quest — Ethics · engine (tách khỏi cfa_quest_v11.js ngày 21/10/2026, sau tag v1.0-core)

   File này giữ toàn bộ luật game và không đụng tới DOM:
   - cấu hình, ngân hàng câu hỏi, sinh đề, chấm điểm, Credit, phạt quá giờ
   - xếp hạng cụm yếu (W1, W2, kế hoạch Boss), số liệu cho bảng tổng kết
   - trạng thái lượt chơi S, Arena đang làm RUN, kết quả vừa xong LAST, lưu trên trình duyệt

   Lớp giao diện (cfa_quest_v11.js, sau này thêm lớp game canvas) đọc S, RUN, LAST và gọi các
   hàm ở khối 6b để đổi trạng thái. Đồng hồ (performance.now) nằm ở lớp giao diện; engine nhận
   thời gian trả lời đã đo sẵn (timeMs).

   Nạp trong trang bằng thẻ <script> thường, sau cfa_quest_v11_bank.js và trước
   cfa_quest_tutorial.js. Hằng và hàm ở đây là biến toàn cục, các file nạp sau dùng chung.
   Chạy bằng Node để kiểm thử: require('./cfa_quest_engine.js') trả về object CFAE (khối 6c).

   Khối 1–6 chép nguyên từ v1.0-core, luật không đổi. Thứ tự gọi rng giữ nguyên nên
   CFAQ.setSeed(7) vẫn ra đúng đề như W6/demo-input.md.
   ============================================================================= */

/* ---------- 1. Cấu hình (Mục 4, 5, 8) ---------- */
const CONFIG = {
  // Ngưỡng đỗ theo round (luật v12). Xét trên arena_score_correct, tính cả câu dùng Bùa.
  passPercentByArena: { arena1: 70, trap1: 75, crossroads: 75, trap2: 85, boss: 90 },
  // Nhãn "Đã cải thiện" ở bảng tổng kết vẫn dùng mốc 70% như v11 (luật 15)
  diagnosticPassPercent: 70,
  startCredits: 3,               // Mục 8: số dư khởi đầu
  creditTiers: [                 // Mục 8: Credit khi đỗ Arena (xét từ trên xuống), giữ như v11
    { minPercent: 90, credit: 4 },
    { minPercent: 80, credit: 3 },
    { minPercent: 70, credit: 2 }
  ],
  bossFirstClearBonus: 5,        // Mục 8: vượt Boss lần đầu +5 Credit
  // Đồng hồ mỗi câu (giây). Round không có trong danh sách thì không có đồng hồ.
  timeLimitSec: { crossroads: 100, trap2: 80, boss: 60 },
  penaltyStepSec: 10,            // mỗi 10 giây quá giờ (làm tròn lên) trừ 1 Credit
  bossUnlockCost: 15,            // trả 1 lần để mở Boss
  questPerCluster: 5,            // World Quest: 5 câu x 3 cụm yếu nhất
  questTiers: [                  // World Quest không có ngưỡng đỗ, chỉ thưởng theo bậc
    { minPercent: 90, credit: 4 },
    { minPercent: 80, credit: 3 },
    { minPercent: 60, credit: 2 }
  ],
  // Mục 7 chỉ ghi rõ Arena 1 không hiện đúng/sai ngay. Để false thì mọi Arena
  // đều chờ tới màn kết quả mới hiện. Đổi thành true nếu nhóm muốn Trap/Crossroads
  // hiện đáp án ngay sau từng câu (Arena 1 luôn không hiện).
  showFeedbackImmediately: false,
  // Khoá lưu mới: tiến trình v11 còn trên trình duyệt không làm hỏng v12
  storageKey: 'cfaQuestV12',
  inProgressKey: 'cfaQuestV12_inProgress',
  runCounterKey: 'cfaQuestV12_runCount'
};

// Tỉ lệ dễ/vừa/khó quy ra số câu (luật 5, 6). Khoá là mức khó 1/2/3.
const DIFFICULTY_MIX = {
  trap1: { 1: 4, 2: 4, 3: 2 },
  crossroads: { 1: 2, 2: 5, 3: 3 },     // chia cho 5 cụm, mỗi cụm 2 câu
  trap2: { 1: 2, 2: 4, 3: 4 }
};
// Boss 2/4/9, chia theo thứ tự cụm yếu nhất → yếu thứ ba (7/5/3 câu)
const BOSS_MIX = [
  { 1: 1, 2: 2, 3: 4 },
  { 1: 1, 2: 1, 3: 3 },
  { 1: 0, 2: 1, 3: 2 }
];

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
  { id: 'trap1',      name: 'Arena 2',            size: 10, itemsAllowed: true },   // trước 28/09: Trap I
  { id: 'crossroads', name: 'Arena 3',            size: 10, itemsAllowed: true },   // trước 28/09: The Crossroads
  { id: 'trap2',      name: 'Arena 4',            size: 10, itemsAllowed: true },   // trước 28/09: Trap II
  { id: 'boss',       name: 'Boss',               size: 15, itemsAllowed: true }    // v12: Boss được dùng 1 Bùa
];
// World Quest không nằm trong chuỗi 5 Arena: không có ngưỡng đỗ, không vào dữ liệu chẩn đoán
const QUEST = { id: 'quest', name: 'World Quest', size: 15, itemsAllowed: false, isQuest: true };
const ARENA_INDEX = Object.fromEntries(ARENAS.map((a, i) => [a.id, i]));
// Tên hiển thị của Arena theo mã nội bộ. Đổi tên thì chỉ sửa mảng ARENAS ở trên.
const NAME = id => ARENAS[ARENA_INDEX[id]].name;
const BOSS_SPLIT = [7, 5, 3];   // Mục 4: 3 cụm yếu nhất, yếu nhất nhận 7 câu

// Mục 8 (Shop): đúng 1 vật phẩm
const ITEMS = {
  eliminate: { name: 'Bùa Loại Trừ', cost: 3, desc: 'Loại 1 phương án sai của câu đang làm (3 còn 2 phương án).' },
};
// Vật phẩm đã bỏ ở tuần 6 nhưng có thể còn trong tiến trình lưu từ bản cũ trên trình duyệt
const RETIRED_ITEMS = { hint: 'Cuộn Giấy Gợi Ý (bản cũ)' };
// Tên vật phẩm để hiển thị; không bao giờ lỗi kể cả khi gặp mã vật phẩm lạ
function itemName(id) { return ITEMS[id]?.name ?? RETIRED_ITEMS[id] ?? String(id); }


/* ---------- 2. Ngẫu nhiên có thể cố định seed (phục vụ kiểm thử, demo lặp lại được) ---------- */
let rng = Math.random;
// Cố định seed: cùng seed + cùng thao tác thì ra cùng đề (CFAQ.setSeed trong Console)
function setSeed(n) { rng = mulberry32(n); }
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

// Nạp ngân hàng vào engine. Trả về kết quả kiểm tra; lớp giao diện tự hiện dòng trạng thái.
function loadBankData(raw) {
  const arr = Array.isArray(raw) ? raw : (raw?.questions ?? raw?.bank ?? []);
  const list = arr.map(normalizeQuestion);
  const { errors, warnings } = validateBank(list);
  BANK = list;
  BANK_OK = errors.length === 0;
  return { ok: BANK_OK, count: list.length, errors, warnings };
}


/* ---------- 4. Trạng thái và lưu trữ (Mục 5 cấu trúc dữ liệu, Mục 7 đường lỗi) ---------- */
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); return true; } catch { return false; } },
  del(k) { try { localStorage.removeItem(k); } catch { /* bỏ qua */ } }
};

function freshState() {
  return {
    version: 12,
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
    // { arena, attempt, qid, cluster, module, difficulty, choice, answer, correct, item, timeMs, reused, order }
    records: [],
    attempts: { arena1: [], trap1: [], crossroads: [], trap2: [], boss: [] },
    accuracy_by_arena: {},                      // dựng lại từ records sau mỗi Arena
    performance_by_arena: {},                   // dựng lại từ records sau mỗi Arena
    bankLog: [],                                // log thiếu câu để nhóm bổ sung ngân hàng
    hadFailure: false,
    bossClearedOnce: false,
    // v12
    bossUnlocked: false,                        // đã trả 15 Credit mở Boss
    questUsedIds: [],                           // câu đã ra ở World Quest: Boss không hỏi lại
    questRecords: [],                           // câu trả lời ở Quest, tách khỏi records (không vào chẩn đoán)
    questRuns: [],                              // { n, correct, total, credit, at }
    quits: []                                   // các lần thoát giữa chừng: { arena, penalty, at }
  };
}

function loadState() {
  const raw = store.get(CONFIG.storageKey);
  if (raw === null) return { state: freshState(), problem: null };
  try {
    const x = JSON.parse(raw);
    if (!x || x.version !== 12) throw new Error('sai phiên bản');
    return { state: Object.assign(freshState(), x), problem: null };
  } catch {
    store.del(CONFIG.storageKey);
    return { state: freshState(), problem: 'corrupt' };
  }
}

// Lớp giao diện gán ENGINE_HOOKS.saveFailed để báo người chơi khi trình duyệt không cho lưu
const ENGINE_HOOKS = { saveFailed: null };

function saveState() {
  if (store.set(CONFIG.storageKey, JSON.stringify(S))) return true;
  if (ENGINE_HOOKS.saveFailed) ENGINE_HOOKS.saveFailed();
  return false;
}

let S = freshState();
let RUN = null;     // Arena đang làm. Không bao giờ lưu (Mục 7: thoát giữa Arena thì huỷ lượt)
let LAST = null;    // Kết quả Arena vừa xong, dùng cho màn kết quả


/* ---------- 5. Sinh đề (Mục 2 ba quy tắc phủ module, Mục 4, Mục 7 đường lỗi) ---------- */
// banned: câu tuyệt đối không được bốc (Boss loại các câu đã ra ở World Quest, luật 12)
function makeDrawContext(banned = []) {
  return { used: new Set(S.usedIds), taken: new Set(), banned: new Set(banned), log: [], notices: [], reused: {} };
}

// Câu chưa từng xuất hiện trong lượt chơi và chưa bốc vào Arena này
function freshPool(ctx, filter) {
  return BANK.filter(q => filter(q) && !ctx.used.has(q.id) && !ctx.taken.has(q.id) && !ctx.banned.has(q.id));
}

// Câu đã gặp trong lượt chơi (dùng khi hết câu mới), chưa bốc vào Arena này
function seenPool(ctx, filter) {
  return BANK.filter(q => filter(q) && ctx.used.has(q.id) && !ctx.taken.has(q.id) && !ctx.banned.has(q.id));
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
    order,                       // lưu thứ tự đã xáo để màn xem lại hiện đúng A/B/C
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

// v12: bốc câu của một cụm theo số câu từng mức khó, ví dụ { 1: 4, 2: 4, 3: 2 }.
// Mức khó nhất bốc trước (câu khó ít nhất trong ngân hàng). Trong mỗi mức, ưu tiên
// module đang có ít câu hơn để vẫn rải đều module (Mục 2 quy tắc 2).
// Hết câu mới đúng mức khó thì (luật đã chốt, tài liệu mục 4):
//   1) lấy câu cùng mức khó đã gặp trong lượt chơi (xáo lại phương án)
//   2) hết nữa thì hạ một mức (khó → vừa, vừa → dễ; dễ thì lên vừa), mới trước, đã gặp sau
//   3) vẫn thiếu thì lấy bất kỳ câu nào của cụm. Mỗi lần như vậy đều ghi log.
const STEP_DOWN = { 3: 2, 2: 1, 1: 2 };

function drawMix(ctx, cluster, mix, label) {
  const modules = CLUSTER_INFO[cluster].modules;
  const perModule = Object.fromEntries(modules.map(m => [m, 0]));
  const out = [];
  const pickFresh = filter => {
    // module ít câu nhất trước; bằng nhau thì ngẫu nhiên
    const order = shuffle(modules).sort((a, b) => perModule[a] - perModule[b]);
    for (const m of order) {
      const q = shuffle(freshPool(ctx, x => x.module === m && filter(x)))[0];
      if (q) return q;
    }
    return null;
  };
  const pickSeen = filter => shuffle(seenPool(ctx, x => x.cluster === cluster && filter(x)))[0] || null;
  const take = (q, reused) => {
    perModule[q.module] = (perModule[q.module] || 0) + 1;
    if (reused) ctx.reused[cluster] = (ctx.reused[cluster] || 0) + 1;
    out.push(takeQuestion(ctx, q, reused));
  };

  [3, 2, 1].forEach(d => {
    for (let k = 0; k < (mix[d] || 0); k++) {
      const down = STEP_DOWN[d];
      let q = pickFresh(x => x.difficulty === d);
      if (q) { take(q, false); continue; }
      q = pickSeen(x => x.difficulty === d);
      if (q) { ctx.log.push(`${label}: ${cluster} hết câu mới mức ${d}, lấy lại câu mức ${d} đã gặp (${q.id})`); take(q, true); continue; }
      q = pickFresh(x => x.difficulty === down);
      if (q) { ctx.log.push(`${label}: ${cluster} hết câu mức ${d}, hạ xuống câu mới mức ${down} (${q.id})`); take(q, false); continue; }
      q = pickSeen(x => x.difficulty === down);
      if (q) { ctx.log.push(`${label}: ${cluster} hết câu mức ${d}, hạ xuống câu đã gặp mức ${down} (${q.id})`); take(q, true); continue; }
      q = pickFresh(() => true);
      if (q) { ctx.log.push(`${label}: ${cluster} hết câu mức ${d} và ${down}, lấy câu mới mức ${q.difficulty} (${q.id})`); take(q, false); continue; }
      q = pickSeen(() => true);
      if (q) { ctx.log.push(`${label}: ${cluster} hết câu mức ${d} và ${down}, lấy câu đã gặp mức ${q.difficulty} (${q.id})`); take(q, true); continue; }
      ctx.log.push(`${label}: ${cluster} không đủ câu kể cả khi lấy lại`);
    }
  });
  return out;
}

function reusedNotice(ctx) {
  Object.entries(ctx.reused).forEach(([c, n]) => {
    ctx.notices.push(`Cụm ${c} đã hết câu mới ở mức khó cần bốc: lấy lại ${n} câu đã gặp, thứ tự phương án đã được xáo lại.`);
  });
}

// Arena 3: 2 câu mỗi cụm, cả round đủ 2 dễ / 5 vừa / 3 khó. Mức khó chia ngẫu nhiên cho các cụm.
function buildCrossroads(ctx) {
  const slots = shuffle(Object.entries(DIFFICULTY_MIX.crossroads).flatMap(([d, n]) => Array(n).fill(Number(d))));
  return CLUSTERS.flatMap((c, i) => {
    const mix = {};
    [slots[2 * i], slots[2 * i + 1]].forEach(d => { mix[d] = (mix[d] || 0) + 1; });
    return drawMix(ctx, c, mix, NAME('crossroads'));
  });
}

function buildArena(id, ctx) {
  let qs;
  switch (id) {
    case 'arena1':     return buildArena1(ctx);
    case 'trap1':      qs = drawMix(ctx, S.w1, DIFFICULTY_MIX.trap1, NAME('trap1')); break;
    case 'crossroads': qs = buildCrossroads(ctx); break;
    case 'trap2':      qs = drawMix(ctx, S.w2, DIFFICULTY_MIX.trap2, NAME('trap2')); break;
    case 'boss':       qs = S.bossPlan.flatMap((p, i) => drawMix(ctx, p.cluster, BOSS_MIX[i], 'Boss')); break;
    default:           return [];
  }
  reusedNotice(ctx);
  return shuffle(qs);
}

// World Quest (luật 12, 13): 5 câu mỗi cụm trong 3 cụm yếu nhất, độ khó ngẫu nhiên.
// Ưu tiên câu đã gặp (ở Arena 1–4 hoặc Quest trước); thiếu mới lấy câu mới.
// Câu nào đã ra ở Quest thì ghi vào questUsedIds để Boss không hỏi lại.
function buildQuest(ctx) {
  const seen = new Set([...S.usedIds, ...S.questUsedIds]);
  const qs = [];
  S.bossPlan.forEach(({ cluster }) => {
    const old = shuffle(BANK.filter(q => q.cluster === cluster && seen.has(q.id)));
    const got = old.slice(0, CONFIG.questPerCluster);
    got.forEach(q => qs.push(takeQuestion(ctx, q, true)));      // câu cũ: xáo phương án
    const need = CONFIG.questPerCluster - got.length;
    if (need > 0) {
      const fresh = shuffle(BANK.filter(q => q.cluster === cluster && !seen.has(q.id) && !ctx.taken.has(q.id))).slice(0, need);
      fresh.forEach(q => qs.push(takeQuestion(ctx, q, false)));
      if (fresh.length) ctx.log.push(`World Quest: ${cluster} chưa đủ câu đã gặp, lấy thêm ${fresh.length} câu mới (Boss sẽ không hỏi lại các câu này)`);
    }
  });
  return shuffle(qs);
}

/* ---------- 6. Tính toán (Mục 5: ba công thức, phân định khi bằng nhau) ---------- */

// Mẫu chẩn đoán dùng để xếp hạng cụm yếu (W1, W2, 3 cụm vào Boss):
// chỉ lượt làm đầu tiên của mỗi Arena, bỏ câu dùng vật phẩm
function diagnosticRecords(uptoArenaIndex = Infinity) {
  return S.records.filter(r => r.attempt === 1 && !r.item && ARENA_INDEX[r.arena] <= uptoArenaIndex);
}

// Lượt Boss dùng cho bảng tổng kết: lượt đỗ Boss. Chưa đỗ thì trả về null.
function bossReportAttempt() {
  const t = (S.attempts.boss || []).find(x => x.passed);
  return t ? t.attempt : null;
}

// Mẫu dùng cho bảng tổng kết và biểu đồ (sửa 14/10/2026):
// - Arena 1–4: lượt làm đầu tiên (trình độ trước khi luyện)
// - Boss: lượt đỗ (trình độ sau khi luyện), bỏ câu lấy lại đã gặp
// Cả hai đều bỏ câu dùng vật phẩm.
function reportRecords(uptoArenaIndex = Infinity) {
  const bossAt = bossReportAttempt();
  return S.records.filter(r => {
    if (r.item || ARENA_INDEX[r.arena] > uptoArenaIndex) return false;
    if (r.arena === 'boss') return r.attempt === bossAt && !r.reused;
    return r.attempt === 1;
  });
}

// Số câu lấy lại đã gặp bị loại khỏi cột Boss (để ghi chú trên bảng tổng kết)
function bossReusedExcluded() {
  const bossAt = bossReportAttempt();
  return S.records.filter(r => r.arena === 'boss' && r.attempt === bossAt && !r.item && r.reused).length;
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

function fmtPct(c, a) { return a ? (c / a * 100).toFixed(1) + '%' : '--'; }

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

// Ngưỡng đỗ của từng round (v12)
function passPercentFor(arenaId) { return CONFIG.passPercentByArena[arenaId]; }
function passed(correct, total, arenaId) { return correct * 100 >= total * passPercentFor(arenaId); }
function needToPass(total, arenaId) { return Math.ceil(total * passPercentFor(arenaId) / 100); }

function tierCredit(tiers, correct, total) {
  for (const t of tiers) if (correct * 100 >= total * t.minPercent) return t.credit;
  return 0;
}
function creditFor(correct, total) { return tierCredit(CONFIG.creditTiers, correct, total); }
function questCredit(correct, total) { return tierCredit(CONFIG.questTiers, correct, total); }

// Đồng hồ và phạt quá giờ (luật 1–5). Thời gian tính theo giây tròn đã trôi qua,
// khớp với số giây hiện trên đồng hồ: trả lời ở giây thứ 100 của giới hạn 100 giây không bị phạt.
function timeLimitFor(arenaId) { return CONFIG.timeLimitSec[arenaId] || 0; }
function overtimeSec(timeMs, arenaId) {
  const limit = timeLimitFor(arenaId);
  if (!limit) return 0;
  return Math.max(0, Math.floor(timeMs / 1000) - limit);
}
function penaltyFor(overSec) { return overSec > 0 ? Math.ceil(overSec / CONFIG.penaltyStepSec) : 0; }
function sumPenalty(answers) { return answers.reduce((s, a) => s + (a.penalty || 0), 0); }

// accuracy_by_arena[cụm][arena] = { correct, attempted } — Mục 5, các quy tắc lưu
// Arena 1–4 theo lượt đầu; Boss theo lượt đỗ, bỏ câu lấy lại (reportRecords)
function buildAccuracyByArena() {
  const out = {};
  reportRecords().forEach(r => {
    out[r.cluster] ??= {};
    const cell = (out[r.cluster][r.arena] ??= { correct: 0, attempted: 0 });
    cell.attempted++;
    if (r.correct) cell.correct++;
  });
  return out;
}

// performance_by_arena[arena] = { points_earned, points_offered } — Mục 5, công thức (3)
// Giữ theo lượt làm đầu tiên ở cả 5 Arena, kể cả Boss (chốt 14/10/2026)
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
  if (!d.boss) {
    // Cụm có trong kế hoạch Boss nhưng mọi câu Boss của cụm đều là câu lấy lại hoặc câu dùng Bùa
    const planned = (S.bossPlan || []).some(p => p.cluster === cluster);
    return planned
      ? { text: 'Chưa đủ câu mới ở Boss để kết luận', cls: 'na', noData: true }
      : { text: 'Không kiểm tra lại ở Boss', cls: 'na' };
  }
  const baseC = (d.arena1?.correct || 0) + (d.crossroads?.correct || 0);
  const baseA = (d.arena1?.attempted || 0) + (d.crossroads?.attempted || 0);
  // Nhãn cụm dùng mốc chẩn đoán 70%, không dùng ngưỡng đỗ 90% của Boss (luật 15)
  const bossOk = d.boss.correct * 100 >= d.boss.attempted * CONFIG.diagnosticPassPercent;
  const change = Math.sign(d.boss.correct * baseA - baseC * d.boss.attempted);   // dấu của (Boss − mốc)
  const detail = { baseC, baseA, bossC: d.boss.correct, bossA: d.boss.attempted };
  if (bossOk && change >= 0) return { text: 'Đã cải thiện', cls: 'good', ...detail };
  if (!bossOk && change > 0) return { text: 'Đã cải thiện nhưng chưa đủ', cls: 'mid', ...detail };
  return { text: 'Cần cải thiện tiếp', cls: 'weak', ...detail };
}

/* ---------- 6b. Chuyển trạng thái (lớp giao diện gọi các hàm này, không tự sửa S, RUN, LAST) ---------- */
const BOSS_INDEX = ARENA_INDEX.boss;

// Đọc tiến trình đã lưu vào S khi mở trang. Trả về 'corrupt' nếu bản lưu hỏng (đã xoá), còn lại null.
function restoreState() {
  const loaded = loadState();
  S = loaded.state;
  return loaded.problem;
}

// Bắt đầu lượt chơi mới. Bộ đếm lượt quyết định module "nặng" của Arena 1 (luân phiên theo runNo).
function newRun() {
  const runNo = Number(store.get(CONFIG.runCounterKey) || 0) + 1;
  store.set(CONFIG.runCounterKey, String(runNo));
  S = freshState();
  S.started = true;
  S.runNo = runNo;
  saveState();
  return runNo;
}

// Bỏ bản lưu lượt hiện tại (nút "Lượt mới" sau khi vượt Boss). Bộ đếm lượt giữ nguyên.
function discardSave() {
  store.del(CONFIG.storageKey);
  S = freshState();
}

// Xoá hết: bản lưu, lượt đang làm dở, kết quả vừa xong (nút Reset)
function wipeAll() {
  store.del(CONFIG.storageKey);
  store.del(CONFIG.inProgressKey);
  S = freshState();
  RUN = null;
  LAST = null;
}

// Dựng lại accuracy_by_arena theo luật hiện tại. Bảng tổng kết gọi trước khi vẽ để tiến trình
// lưu từ bản trước 14/10/2026 cũng hiện đúng luật mới. Không ghi vào bản lưu.
function refreshAccuracy() { S.accuracy_by_arena = buildAccuracyByArena(); }

function currentArena() { return ARENAS[S.stage]; }

// World Quest mở sau khi đỗ Arena 4
function questOpen() { return S.started && S.stage >= BOSS_INDEX && !!S.bossPlan; }

// Sinh đề cho Arena kế tiếp. Lớp giao diện kiểm tra trước: lượt đang chơi, ngân hàng hợp lệ, Boss đã mở.
// Trả về { arena, attempt, qs, ctx }, hoặc { error } khi không bốc đủ câu.
function prepareArena() {
  const arena = currentArena();
  // Boss không hỏi lại câu đã ra ở World Quest (luật 12)
  const ctx = makeDrawContext(arena.id === 'boss' ? S.questUsedIds : []);
  const qs = buildArena(arena.id, ctx);
  if (qs.length !== arena.size) {
    return { error: `${arena.name} cần ${arena.size} câu nhưng chỉ bốc được ${qs.length}. Chi tiết: ${ctx.log.join('; ')}` };
  }
  if (arena.id === 'arena1') {
    const pts = qs.reduce((s, q) => s + DIFFICULTY_POINTS[q.difficulty], 0);
    if (pts !== 30) ctx.log.push(`Kiểm tra tự động: tổng điểm độ khó Arena 1 = ${pts}, phải bằng 30`);
  }
  return { arena, attempt: S.attempts[arena.id].length + 1, qs, ctx };
}

// Sinh đề World Quest. Lớp giao diện kiểm tra questOpen() và ngân hàng trước.
function prepareQuest() {
  const ctx = makeDrawContext();
  const qs = buildQuest(ctx);
  const size = CONFIG.questPerCluster * S.bossPlan.length;
  if (qs.length !== size) return { error: `${QUEST.name} cần ${size} câu nhưng chỉ bốc được ${qs.length}.` };
  return { arena: QUEST, attempt: S.questRuns.length + 1, qs, ctx };
}

// Vào Arena (hoặc World Quest) với đề đã sinh. RUN không bao giờ lưu nguyên (Mục 7);
// chỉ lưu tóm tắt vào inProgressKey để lần mở sau áp luật thoát nếu người chơi tải lại trang.
// Lớp giao diện được gắn thêm trường của riêng nó vào RUN (mốc giờ, id đồng hồ).
function beginRun(arena, attempt, qs, ctx) {
  RUN = {
    arena,
    attempt,
    qs, ctx,
    qi: 0,
    answers: [],
    itemUsedInArena: null,
    itemOnQuestion: null,
    selected: null,       // phương án đang chọn, chưa xác nhận
    eliminated: null,     // phương án Bùa đã loại ở câu đang làm
    locked: false,        // câu đang làm đã xác nhận
    limit: timeLimitFor(arena.id)
  };
  saveInProgress();
  return RUN;
}

// Lưu tóm tắt lượt đang làm. Nếu người chơi tải lại trang hoặc đóng tab giữa chừng,
// lần mở sau áp đúng luật thoát (phạt giờ ở Arena 3/4, khoá Boss) thay vì bỏ qua.
function saveInProgress() {
  if (!RUN) return;
  store.set(CONFIG.inProgressKey, JSON.stringify({
    arena: RUN.arena.id,
    penalty: sumPenalty(RUN.answers),
    shown: RUN.qs.slice(0, RUN.qi + 1).map(q => q.id)
  }));
}

// Mở câu RUN.qi: xoá lựa chọn, Bùa và khoá của câu trước. Trả về câu hỏi.
function beginQuestion() {
  RUN.selected = null;
  RUN.eliminated = null;
  RUN.itemOnQuestion = null;
  RUN.locked = false;
  return RUN.qs[RUN.qi];
}

// Ghi câu trả lời của câu đang làm (Mục 1 Input). timeMs đo ở lớp giao diện:
// từ lúc câu hiện (sau khi đóng thông báo nếu có) tới lúc bấm Xác nhận.
function recordAnswer(choice, timeMs) {
  const q = RUN.qs[RUN.qi];
  const correct = choice === q.answer;
  const overSec = overtimeSec(timeMs, RUN.arena.id);
  const rec = {
    arena: RUN.arena.id, attempt: RUN.attempt, qid: q.id,
    cluster: q.cluster, module: q.module, difficulty: q.difficulty,
    choice, answer: q.answer, correct,
    item: RUN.itemOnQuestion, timeMs, reused: !!q.reused,
    order: q.reused ? q.order : null,
    overSec, penalty: penaltyFor(overSec)              // v12: phạt quá giờ của câu này
  };
  RUN.answers.push(rec);
  RUN.locked = true;
  saveInProgress();
  return rec;
}

// Sang câu kế. Trả về true khi đã hết câu: lúc đó gọi finishRun().
function advanceQuestion() {
  RUN.qi++;
  return RUN.qi >= RUN.qs.length;
}

// Dùng vật phẩm cho câu đang làm (Mục 8). Không lưu ngay: thoát giữa Arena thì S đọc lại
// từ bản lưu trước khi vào Arena, nên Bùa đã dùng được hoàn.
// Trả về { ok: true, eliminated } hoặc { ok: false, reason } với reason:
// 'blocked' (không có câu đang mở, câu đã xác nhận, hoặc round không cho dùng vật phẩm),
// 'perQuestion', 'perArena', 'notOwned'.
function applyItem(id) {
  if (!RUN || RUN.locked || !RUN.arena.itemsAllowed) return { ok: false, reason: 'blocked' };
  if (RUN.itemOnQuestion) return { ok: false, reason: 'perQuestion' };
  if (RUN.itemUsedInArena) return { ok: false, reason: 'perArena' };
  if (!S.inventory[id]) return { ok: false, reason: 'notOwned' };
  const q = RUN.qs[RUN.qi];
  S.inventory[id]--;
  RUN.itemUsedInArena = id;
  RUN.itemOnQuestion = id;
  let eliminated = null;
  if (id === 'eliminate') {
    eliminated = shuffle([0, 1, 2].filter(i => i !== q.answer))[0];   // chỉ loại 1 phương án sai
    RUN.eliminated = eliminated;
    if (RUN.selected === eliminated) RUN.selected = null;
  }
  return { ok: true, eliminated };
}

// Tổng tiền phạt quá giờ của các câu đã trả lời trong Arena đang làm
function runPenalty() { return RUN ? sumPenalty(RUN.answers) : 0; }

// Thoát giữa Arena (Mục 7 + luật thoát v12): huỷ lượt, đọc lại S từ bản lưu trước khi vào Arena,
// rồi áp phạt. Trả về câu báo cho người chơi (rỗng nếu không mất gì).
function abandonRun() {
  if (!RUN) return '';
  const id = RUN.arena.id;
  const penalty = sumPenalty(RUN.answers);
  const shown = RUN.qs.slice(0, RUN.qi + 1).map(q => q.id);
  RUN = null;
  S = loadState().state;
  store.del(CONFIG.inProgressKey);
  return applyQuit({ arena: id, penalty, shown });
}

// Mục 7: thoát giữa Arena thì huỷ lượt, không lưu dở dang. Bùa đã dùng được hoàn lại.
// v12 thêm hai luật (đã chốt 06/10):
// - Arena 3, 4: tiền phạt quá giờ của các câu đã trả lời trước khi thoát vẫn bị trừ.
// - Boss: không hoàn 15 Credit đã trả, Boss khoá lại; các câu đã hiện coi như đã gặp để đề sau bốc lại.
// Áp hậu quả của việc thoát. S lúc này đã được đọc lại từ bản lưu trước khi vào Arena.
function applyQuit(info) {
  const id = info.arena;
  let msg = '';
  if (timeLimitFor(id) && id !== 'boss' && info.penalty > 0) {
    const before = S.credits;
    S.credits = Math.max(0, S.credits - info.penalty);
    msg = `Bị trừ ${before - S.credits} Credit tiền phạt quá giờ.`;
  }
  if (id === 'boss') {
    S.bossUnlocked = false;
    S.usedIds = [...new Set([...S.usedIds, ...(info.shown || [])])];
    msg = `Boss đã khoá lại. ${CONFIG.bossUnlockCost} Credit đã trả không được hoàn.`;
  }
  if (id !== 'quest') {
    S.quits = S.quits || [];
    S.quits.push({ arena: id, penalty: id === 'boss' ? 0 : (info.penalty || 0), at: new Date().toISOString() });
  }
  saveState();
  return msg;
}

// Lần trước trang bị đóng hoặc tải lại giữa Arena: tính như thoát, áp đúng luật thoát của v12.
// Trả về null nếu không có lượt dở, hoặc { name, extra } để lớp giao diện báo người chơi.
function takeLeftoverRun() {
  const leftover = store.get(CONFIG.inProgressKey);
  if (!leftover) return null;
  store.del(CONFIG.inProgressKey);
  let info;
  try { info = JSON.parse(leftover); } catch { info = { arena: leftover, penalty: 0, shown: [] }; }
  const name = info.arena === 'quest' ? QUEST.name : (ARENAS[ARENA_INDEX[info.arena]]?.name ?? 'Arena');
  const extra = S.started ? applyQuit(info) : '';
  return { name, extra };
}

// Hết câu: chấm round, cộng trừ Credit, chọn W1/W2/kế hoạch Boss, lưu.
// Trả về LAST (dữ liệu cho màn kết quả); RUN về null.
function finishRun() {
  if (RUN.arena.isQuest) return finishQuestRun();
  const { arena, attempt, answers, ctx, qs } = RUN;
  const correct = answers.filter(a => a.correct).length;   // công thức (2): tính cả câu dùng vật phẩm
  const total = answers.length;
  const ok = passed(correct, total, arena.id);
  const credit = ok ? creditFor(correct, total) : 0;
  let bossBonus = 0;
  if (arena.id === 'boss' && ok && !S.bossClearedOnce) { bossBonus = CONFIG.bossFirstClearBonus; S.bossClearedOnce = true; }
  // v12: thưởng − phạt quá giờ, ví không âm. Trượt round vẫn bị phạt (luật 2, 3).
  const penalty = sumPenalty(answers);
  const before = S.credits;
  S.credits = Math.max(0, S.credits + credit + bossBonus - penalty);
  const net = S.credits - before;
  const overCount = answers.filter(a => a.penalty > 0).length;
  S.records.push(...answers);
  S.usedIds = [...new Set([...S.usedIds, ...qs.map(q => q.id)])];
  S.attempts[arena.id].push({ attempt, correct, total, passed: ok, credit, bossBonus, penalty, net, itemUsed: RUN.itemUsedInArena, at: new Date().toISOString() });
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

  LAST = { arena, attempt, correct, total, passed: ok, credit, bossBonus, penalty, net, overCount, qs, answers, notices: ctx.notices, log: ctx.log };
  RUN = null;
  return LAST;
}

// World Quest: chỉ cộng Credit theo bậc, không ngưỡng đỗ, không vào dữ liệu chẩn đoán (luật 11, 14)
function finishQuestRun() {
  const { attempt, answers, ctx, qs } = RUN;
  const correct = answers.filter(a => a.correct).length;
  const total = answers.length;
  const credit = questCredit(correct, total);
  S.credits += credit;
  S.questRecords.push(...answers);
  S.questUsedIds = [...new Set([...S.questUsedIds, ...qs.map(q => q.id)])];
  S.questRuns.push({ n: attempt, correct, total, credit, at: new Date().toISOString() });
  S.bankLog.push(...ctx.log.map(text => ({ arena: 'quest', attempt, text })));
  saveState();
  store.del(CONFIG.inProgressKey);
  LAST = { arena: QUEST, attempt, correct, total, passed: true, credit, bossBonus: 0, penalty: 0, net: credit, overCount: 0, qs, answers, notices: ctx.notices, log: ctx.log };
  RUN = null;
  return LAST;
}

// Mở khoá Boss bằng Credit (luật 8, 9): trả 1 lần, trượt Boss chơi lại không trả thêm.
// Trả về false nếu chưa tới Boss, Boss đã mở, hoặc thiếu Credit.
function payBossUnlock() {
  if (!S.started || S.finished || S.stage !== BOSS_INDEX || S.bossUnlocked) return false;
  if (S.credits < CONFIG.bossUnlockCost) return false;
  S.credits -= CONFIG.bossUnlockCost;
  S.bossUnlocked = true;
  saveState();
  return true;
}

// Mua vật phẩm ở Shop (Mục 8). Trả về false nếu thiếu Credit.
function buyItem(id) {
  const it = ITEMS[id];
  if (!it || S.credits < it.cost) return false;
  S.credits -= it.cost;
  S.inventory[id]++;
  saveState();
  return true;
}


/* ---------- 6c. Cổng dùng chung cho lớp game và kiểm thử ---------- */
// Trong trang, các hàm trên đã là biến toàn cục. CFAE gom lại một chỗ để lớp game canvas
// gọi cho gọn và để Node nạp được file này khi chạy kiểm thử (tests/engine_seed7.test.js).
const CFAE = {
  get state() { return S; },
  get run() { return RUN; },
  get last() { return LAST; },
  get bankOk() { return BANK_OK; },
  get bankSize() { return BANK.length; },
  CONFIG, ARENAS, QUEST, CLUSTERS, CLUSTER_INFO, MODULE_NAMES, ITEMS, NAME,
  hooks: ENGINE_HOOKS,
  setSeed, loadBankData,
  restoreState, newRun, discardSave, wipeAll,
  currentArena, questOpen, prepareArena, prepareQuest,
  beginRun, beginQuestion, recordAnswer, advanceQuestion, applyItem, runPenalty,
  abandonRun, takeLeftoverRun, finishRun, payBossUnlock, buyItem, refreshAccuracy,
  // Đọc số liệu: màn kết quả, bảng tổng kết, lớp game
  rankClusters, diagnosticRecords, reportRecords, clusterStats, moduleStats, conclude, explainPick,
  passPercentFor, needToPass, timeLimitFor, overtimeSec, penaltyFor, creditFor, questCredit,
  buildAccuracyByArena, buildPerformanceByArena
};
if (typeof module !== 'undefined' && module.exports) module.exports = CFAE;
