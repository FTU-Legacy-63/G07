'use strict';
/* =============================================================================
   CFA Quest — Ethics · demo v12 (tăng độ khó theo góp ý của thầy, luật chốt 06/10/2026)

   File đi kèm:
   - cfa_quest_v11.html        (khung màn hình; giữ tên file cũ, nội dung là v12)
   - cfa_quest_engine.js       (luật game: cấu hình, sinh đề, chấm điểm, Credit, trạng thái; nạp trước file này)
   - cfa_dungeon_ui_v10_skipfix_updated.css  (giao diện cũ, dùng lại nguyên)
   - cfa_quest_v11.css         (style của v11: bảng chẩn đoán, biểu đồ, hộp thông báo)
   - cfa_quest_v12.css         (style mới của v12: đồng hồ, ô World Quest, khoá Boss)
   - cfa_quest_v11_bank.js     (ngân hàng nhúng, sinh tự động từ ethics_bank_220.json)
   - cfa_quest_tutorial.js     (lớp hướng dẫn, nạp trước file này; nội dung thẻ nằm ở đó)
   - cfa_quest_tutorial.css    (style của thẻ hướng dẫn và bảng Luật chơi)

   Thay đổi so với v11 (chi tiết: tài liệu "CFA Quest — Thiết kế độ khó mới (tuần 7)"):
   - Ngưỡng đỗ theo round 70/75/75/85/90%
   - Tỉ lệ dễ/vừa/khó riêng cho Arena 2, 3, 4 và Boss
   - Đồng hồ mỗi câu ở Arena 3, 4, Boss; quá giờ trừ Credit
   - Boss khoá, mở bằng 15 Credit; Boss được dùng 1 Bùa
   - World Quest: 15 câu ôn 3 cụm yếu nhất để kiếm thêm Credit

   Sửa ngày 14/10/2026 (rà lại trường hợp trượt Boss rồi đỗ):
   - Cột Boss ở bảng tổng kết lấy lượt ĐỖ Boss, không lấy lượt Boss đầu tiên.
     Câu lấy lại đã gặp (reused) trong lượt đó bị loại khỏi mẫu, như câu dùng Bùa.
   - Arena 1–4 vẫn lấy lượt làm đầu tiên. performance_score giữ theo lượt đầu ở cả 5 Arena.

   Thêm ngày 17/10/2026 (tutorial, không NPC — đặc tả: "Tutorial — CFA Quest · Ethics (bản khớp code v12)"):
   - Các điểm gọi TUT.* ở startRun, startArena, startQuest, beginPlay, renderTimer,
     renderResult, openShop, openReport. Luật game không đổi.
   - Nút "Luật chơi" trên thanh HUD, có nút "Xem lại hướng dẫn".
   - Thêm id làm điểm neo coach mark: diagTable, creditLine, reportClusterTable.
   - Bảng tổng kết có ghi chú cố định 3 câu (Mục 14 SOLUTION_STRUCTURE).
   - Hộp mở khoá Boss nhấn mạnh luật thoát, thêm "kể cả tải lại trang hoặc đóng tab".

   Tách engine ngày 21/10/2026 (sau tag v1.0-core):
   - Khối 1–6 và các bước đổi trạng thái (vào Arena, ghi câu trả lời, dùng Bùa, thoát, chấm round,
     mở Boss, mua Bùa) chuyển sang cfa_quest_engine.js. File này chỉ còn phần giao diện.
   - Luật và thứ tự gọi rng không đổi: cùng seed, cùng thao tác thì ra cùng kết quả như v1.0-core.

   Lớp game hành động ngày 21/10/2026 (SOLUTION_STRUCTURE Mục 15):
   - Vào Arena là vào màn chơi canvas (cfa_quest_game.js). Câu hỏi chỉ hiện khi chém trúng quái/Boss,
     hiện đè lên khung cảnh đứng hình; đồng hồ câu vẫn đo bằng performance.now như cũ.
   - Hết câu: engine chấm round và cộng Credit trước, sau đó mới rơi đồng xu, nhặt xong mới hiện
     màn kết quả (Mục 15.5).
   - Boss: mất hết 2 tim thì gọi engine whiteRun() (lượt trắng, Mục 15.4).
   - Chế độ demo ?demo=1 (Mục 15.6): khối 15 ở cuối file, dữ liệu ở cfa_quest_scenarios.js.
   - UI_HOOKS cho lớp skin (cfa_quest_skin.js): cảnh chuyển, bản đồ thế giới.
   ============================================================================= */

/* Khối 1–6 (cấu hình, ngân hàng, trạng thái, sinh đề, tính toán) và khối 6b (đổi trạng thái)
   nằm ở cfa_quest_engine.js. Các tên CONFIG, S, RUN, LAST, BANK_OK, rankClusters… ở file này
   là biến toàn cục của engine. */

let shopReturn = 'dashboard';

// Chỗ móc cho lớp skin. Để null thì giao diện chạy như không có skin.
// beforePlay(arenaOrQuest) → Promise: cảnh chuyển trước khi vào màn chơi
// afterDashboard(model): vẽ bản đồ thế giới từ cùng dữ liệu với các ô tiến trình
const UI_HOOKS = { beforePlay: null, afterDashboard: null };

// Sàn đấu của từng round (khoá ở asset/assets.js → floors)
const FLOOR_OF = { arena1: 'arena1', trap1: 'arena2', crossroads: 'arena3', trap2: 'arena4', boss: 'boss', quest: 'world_quest' };

// Engine gọi khi trình duyệt không cho lưu tiến trình
ENGINE_HOOKS.saveFailed = () => toast('Trình duyệt không cho lưu tiến trình. Lượt chơi vẫn chạy nhưng sẽ mất khi tải lại trang.');


/* ---------- 7. Tiện ích giao diện ---------- */
const $ = id => document.getElementById(id);
function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function show(id) {
  document.querySelectorAll('.screen').forEach(x => x.classList.toggle('active', x.id === id));
  document.body.dataset.screen = id;
  window.scrollTo(0, 0);
}
function toast(text, ms = 2600) {
  const x = $('toast');
  x.textContent = text;
  x.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => x.classList.remove('show'), ms);
}
// Hộp thông báo dùng chung cho thông báo một nút (notice) và hỏi xác nhận hai nút (ask).
// ask() thay cho confirm() của trình duyệt ở các bước mới của v12 (mở Boss, thoát Arena).
let noticeResolve = null;
// warn: dòng cảnh báo in đậm dưới nội dung (để trống thì ẩn)
function openOverlay(title, text, okLabel, cancelLabel, warn = '') {
  $('noticeTitle').textContent = title;
  $('noticeText').textContent = text;
  $('noticeWarn').textContent = warn;
  $('noticeWarn').classList.toggle('hidden', !warn);
  $('noticeOk').textContent = okLabel;
  $('noticeCancel').textContent = cancelLabel || '';
  $('noticeCancel').classList.toggle('hidden', !cancelLabel);
  $('noticeOverlay').classList.remove('hidden');
  $('noticeOk').focus();
}
function notice(title, text) {
  noticeResolve = null;
  openOverlay(title, text, 'Đã hiểu', null);
}
function ask(title, text, okLabel = 'Đồng ý', cancelLabel = 'Huỷ', warn = '') {
  return new Promise(resolve => {
    noticeResolve = resolve;
    openOverlay(title, text, okLabel, cancelLabel, warn);
  });
}
function closeNotice(answer = true) {
  $('noticeOverlay').classList.add('hidden');
  const r = noticeResolve;
  noticeResolve = null;
  // Thông báo hiện ngay khi vào Arena: đồng hồ câu đầu chỉ chạy sau khi đóng thông báo
  if (RUN && RUN.waitNotice) { RUN.waitNotice = false; RUN.shownAt = performance.now(); }
  if (r) r(answer);
}

function updateHUD() {
  demoSyncBar();
  $('hudCredits').textContent = S.credits;
  $('hudStage').textContent = !S.started ? '—' : S.finished ? 'Đã vượt Boss' : ARENAS[S.stage].name;
  $('hudItems').textContent = `${S.inventory.eliminate} Bùa Loại Trừ`;
  TUT.syncRulesButton();   // nút Luật chơi mờ khi đang làm câu có đồng hồ
}

// Dòng luật ngắn trên ô Arena: số câu cần đúng và đồng hồ
function arenaRule(a) {
  const need = needToPass(a.size, a.id);
  const t = timeLimitFor(a.id);
  return `Cần ${need}/${a.size} (${passPercentFor(a.id)}%)` + (t ? ` · ${t} giây/câu` : '');
}

function arenaDesc(id) {
  switch (id) {
    case 'arena1': return '15 câu, 3 câu mỗi cụm, phủ 9 module, đủ 3 mức khó';
    case 'trap1': return (S.w1 ? `10 câu cụm ${S.w1}` : '10 câu của cụm yếu nhất (W1)') + ', dễ/vừa/khó 4/4/2';
    case 'crossroads': return '10 câu, 2 câu mỗi cụm, dễ/vừa/khó 2/5/3';
    case 'trap2': return (S.w2 ? `10 câu cụm ${S.w2}` : '10 câu của cụm yếu thứ hai (W2)') + ', dễ/vừa/khó 2/4/4';
    case 'boss': return (S.bossPlan ? `15 câu: ${S.bossPlan.map(p => `${p.cluster} ${p.count}`).join(', ')}` : '15 câu, 7/5/3 cho 3 cụm yếu nhất') + ', dễ/vừa/khó 2/4/9';
    default: return '';
  }
}


/* ---------- 8. Bảng chẩn đoán 2 tầng và biểu đồ (Mục 1 Output, Mục 6, Mục 10) ---------- */
function diagnosticTableHTML(highlight, upto = Infinity) {
  const recs = reportRecords(upto);
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
  <p class="note">Tính cộng dồn từ lượt làm đầu tiên của Arena 1–4 và lượt đỗ Boss (không tính câu Boss lấy lại đã gặp), không tính câu dùng vật phẩm. Mỗi module mới có vài câu nên đây là tín hiệu trong lượt chơi này, chưa phải kết luận về năng lực.</p>`;
}

const CLUSTER_STYLE = {
  C1: { color: '#3d6ee8', dash: '' },
  C2: { color: '#c93c4b', dash: '7 4' },
  C3: { color: '#1f9d70', dash: '2 4' },
  C4: { color: '#b7791f', dash: '10 4 2 4' },
  C5: { color: '#7a4fc4', dash: '4 2' }
};

function progressChartHTML(upto = Infinity) {
  // Boss chỉ có điểm trên biểu đồ khi đã đỗ (cột Boss lấy lượt đỗ)
  const done = ARENAS.filter((a, i) => i <= upto && (a.id === 'boss' ? bossReportAttempt() !== null : S.attempts[a.id].length > 0));
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
      const st = clusterStats(reportRecords(ARENA_INDEX[a.id])).find(s => s.cluster === c);
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
  <p class="note">Mỗi điểm là tỷ lệ đúng cộng dồn của cụm tính tới hết Arena đó. Đường nét đứt màu xám là mốc chẩn đoán 70% dùng cho nhãn ở bảng tổng kết, không phải ngưỡng đỗ của từng Arena.</p>`;
}


/* ---------- 9. Màn bảng tiến trình ---------- */
// Từ 28/09 bảng tiến trình chỉ còn 6 ô. Bảng chẩn đoán, biểu đồ và cụm bị nhắm
// xem ở màn kết quả ngay sau mỗi Arena, hoặc bấm lại ô Arena đã đỗ (reviewArena).
function makeClickable(card, fn) {
  card.setAttribute('role', 'button');
  card.tabIndex = 0;
  card.addEventListener('click', fn);
  card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); } });
}

// v12: 7 ô — Arena 1–4, World Quest, Boss, Bảng tổng kết
const TOTAL_CARDS = 7;

// Dòng tóm tắt một lượt làm (Mục 15.4: lượt trắng và lượt thoát không có điểm)
function tryText(t) {
  if (t.outcome === 'white') return `Lượt ${t.attempt}: lượt trắng (không tính)`;
  if (t.outcome === 'quit') return `Lượt ${t.attempt}: thoát`;
  return `Lượt ${t.attempt}: ${t.correct}/${t.total}, ${t.passed ? 'đỗ' : 'trượt'}`;
}

// Dữ liệu của 7 ô. Bảng tiến trình dạng ô và bản đồ thế giới (lớp skin) dựng từ cùng dữ liệu này.
// status: done | active | boss-gate | locked
function dashboardModel() {
  const list = [];
  let num = 0;
  ARENAS.forEach((a, i) => {
    if (a.id === 'boss') list.push(questModel(++num));
    num++;
    const done = S.stage > i;
    const reachable = S.started && !S.finished && S.stage === i;
    const bossLocked = a.id === 'boss' && reachable && !S.bossUnlocked;
    const active = reachable && !bossLocked;
    const tries = S.attempts[a.id];
    const lastTry = tries[tries.length - 1];
    const status = done ? 'done' : active ? 'active' : bossLocked ? 'boss-gate' : 'locked';
    let extra = '';
    if (bossLocked) {
      const lack = CONFIG.bossUnlockCost - S.credits;
      extra = `<p class="gate-line">Mở khoá: <b>${CONFIG.bossUnlockCost} Credit</b> · bạn có ${S.credits}</p>`
        + (lack > 0 ? `<p class="gate-lack">Còn thiếu ${lack} Credit. Chơi World Quest để kiếm thêm.</p>` : '<p class="gate-ok">Đủ Credit, bấm để mở khoá</p>');
    }
    if (a.id === 'boss' && active) extra = `<p class="gate-line">Còn <b>${whiteLeft()}</b> lượt trắng</p>`;
    const badge = done ? 'Đã đỗ' : active ? (tries.length ? 'Chơi lại' : 'Mở') : bossLocked ? 'Cần mở khoá' : 'Khoá';
    let action = null;
    if (active) action = startArena;
    else if (bossLocked) action = unlockBoss;
    else if (done) action = () => { reviewArena(a.id); show('result'); };
    list.push({
      id: a.id, num, status, badge, name: a.name, desc: arenaDesc(a.id), rule: arenaRule(a),
      extra, tryLine: lastTry ? tryText(lastTry) : '', action,
      label: done ? `Xem lại kết quả ${a.name}` : a.name
    });
  });
  list.push({
    id: 'report', num: TOTAL_CARDS, status: S.finished ? 'active' : 'locked', badge: S.finished ? 'Mở' : 'Khoá',
    name: 'Bảng tổng kết', desc: 'So mốc chẩn đoán với Boss theo từng cụm', rule: '', extra: '', tryLine: '',
    action: S.finished ? () => { openReport(); } : null, label: 'Bảng tổng kết'
  });
  return list;
}

function questModel(num) {
  const open = questOpen();
  const runs = S.questRuns;
  const last = runs[runs.length - 1];
  const clusters = S.bossPlan ? S.bossPlan.map(p => p.cluster).join(', ') : '3 cụm yếu nhất';
  return {
    id: 'quest', num, status: open ? 'active' : 'locked', badge: open ? (runs.length ? 'Chơi tiếp' : 'Mở') : 'Khoá',
    name: QUEST.name, desc: `15 câu ôn ${clusters}, 5 câu mỗi cụm`,
    rule: 'Không đồng hồ · thưởng 0 đến +4 Credit' + (open ? '' : ' · Mở sau khi đỗ Arena 4'),
    extra: '', tryLine: last ? `Đã chơi ${runs.length} lần · lần cuối ${last.correct}/${last.total}, +${last.credit}` : '',
    action: open ? startQuest : null, label: QUEST.name, quest: true
  };
}

function renderDashboard() {
  updateHUD();
  const grid = $('stageGrid');
  grid.innerHTML = '';
  const model = dashboardModel();
  model.forEach(m => {
    const card = document.createElement('div');
    card.className = 'stage panel ' + (m.quest ? 'quest-card ' : '') + (m.status === 'done' ? 'done reviewable' : m.status);
    card.dataset.zone = m.id;
    card.innerHTML = `<span class="num">${m.num}/${TOTAL_CARDS}</span><span class="badge">${esc(m.badge)}</span>
      <h3>${esc(m.name)}</h3><p>${esc(m.desc)}</p>
      ${m.rule ? `<p class="rule-line">${esc(m.rule)}</p>` : ''}
      ${m.extra}
      ${m.tryLine ? `<p class="try">${esc(m.tryLine)}</p>` : ''}
      ${m.status === 'done' ? '<p class="review-link">Xem lại kết quả ›</p>' : ''}`;
    if (m.action) {
      if (m.status === 'done') card.setAttribute('aria-label', m.label);
      makeClickable(card, m.action);
    }
    grid.appendChild(card);
  });
  if (UI_HOOKS.afterDashboard) UI_HOOKS.afterDashboard(model);
}

// Mở khoá Boss bằng Credit (luật 8, 9): trả 1 lần, trượt Boss chơi lại không trả thêm
async function unlockBoss() {
  if (!S.started || S.finished || S.stage !== BOSS_INDEX || S.bossUnlocked) return;
  const cost = CONFIG.bossUnlockCost;
  if (S.credits < cost) {
    const go = await ask('Chưa đủ Credit mở Boss',
      `Mở Boss cần ${cost} Credit, bạn đang có ${S.credits}. Chơi World Quest để kiếm thêm Credit.`,
      'Chơi World Quest', 'Để sau');
    if (go) startQuest();
    return;
  }
  const ok = await ask('Mở khoá Boss',
    `Trả ${cost} Credit để mở Boss (còn lại ${S.credits - cost}). Trả một lần: trượt Boss thì chơi lại không mất thêm.`,
    `Trả ${cost} Credit`, 'Để sau',
    `Lưu ý: thoát giữa Boss (kể cả tải lại trang hoặc đóng tab) sẽ mất ${cost} Credit này và Boss khoá lại.`);
  if (!ok || !payBossUnlock()) return;
  renderDashboard();
  show('dashboard');
  toast(`Đã mở Boss. Còn ${S.credits} Credit. Bạn có ${whiteLeft()} lượt trắng.`);
}


/* ---------- 10. Làm bài (Mục 1 Input, Mục 7 đường lỗi, Mục 8 luật vật phẩm) ---------- */
function startRun() {
  if (deviceBlocked()) return;
  if (DEMO.active) { demoStartRun(); return; }
  if (!BANK_OK) { notice('Chưa có ngân hàng câu hỏi', 'Hãy nạp ethics_bank_220.json hợp lệ trước khi bắt đầu.'); return; }
  if (S.started && !S.finished && !confirm('Bắt đầu lượt mới sẽ xoá lượt đang chơi. Tiếp tục?')) return;
  newRun();
  renderDashboard();
  show('dashboard');
  TUT.onStartRun();   // thẻ intro_1–3 (chỉ hiện lần đầu)
}

function startArena() {
  if (!S.started || S.finished || deviceBlocked()) return;
  if (!BANK_OK) { notice('Chưa có ngân hàng câu hỏi', 'Hãy nạp ethics_bank_220.json hợp lệ ở màn hình đầu.'); return; }
  const arena = currentArena();
  if (arena.id === 'boss' && !S.bossUnlocked) { unlockBoss(); return; }
  // Thẻ trước round: hiện trước khi sinh đề, đồng hồ chưa chạy. Bấm "Vào Arena" thì hàm này chạy lại.
  if (TUT.gateBefore(arena.id, startArena)) return;
  const p = DEMO.active ? demoPrepare(arena.id) : prepareArena();
  if (p.error) { notice('Không sinh được đề', p.error); return; }
  beginPlay(p.arena, p.attempt, p.qs, p.ctx);
}

// World Quest: mở sau khi đỗ Arena 4, chơi bao nhiêu lần cũng được
function startQuest() {
  if (!questOpen() || deviceBlocked()) return;
  if (!BANK_OK) { notice('Chưa có ngân hàng câu hỏi', 'Hãy nạp ethics_bank_220.json hợp lệ ở màn hình đầu.'); return; }
  if (TUT.gateBefore('quest', startQuest)) return;   // thẻ pre_quest_a, pre_quest_b
  const p = DEMO.active ? demoPrepare('quest') : prepareQuest();
  if (p.error) { notice('Không sinh được đề', p.error); return; }
  beginPlay(p.arena, p.attempt, p.qs, p.ctx);
}

let entering = false;   // đang chạy cảnh chuyển vào màn chơi: chặn bấm hai lần

async function beginPlay(arena, attempt, qs, ctx) {
  if (entering) return;
  entering = true;
  try {
    if (UI_HOOKS.beforePlay) await UI_HOOKS.beforePlay(arena);
  } catch (err) { console.error(err); }
  entering = false;
  ctx.log.forEach(t => console.warn('[CFA Quest]', t));
  beginRun(arena, attempt, qs, ctx);
  // Trường riêng của giao diện: mốc giờ câu hiện, id đồng hồ, chờ đóng thông báo
  Object.assign(RUN, { shownAt: 0, timerId: null, waitNotice: false });
  hideQuestion();
  $('playArena').textContent = RUN.attempt > 1 ? `${arena.name} · ${arena.isQuest ? 'lần' : 'lượt'} ${RUN.attempt}` : arena.name;
  $('playSub').textContent = arena.id === 'boss' ? 'Né đạn, tiến lại gần để chém Boss' : 'Đánh quái để mở câu hỏi';
  $('playHint').innerHTML = arena.id === 'boss'
    ? '<b>W A S D</b> di chuyển · vạch sáng chĩa vào bạn thì bước sang khe rồi mới tiến vào'
    : '<b>W A S D</b> di chuyển · quái vào tầm thì tự chém';
  document.body.dataset.kind = arena.id === 'boss' ? 'boss' : 'arena';
  show('play');
  updateHUD();
  GAME.start({
    kind: arena.id === 'boss' ? 'boss' : 'arena',
    floorId: FLOOR_OF[arena.id],
    total: qs.length,
    whiteLeft: arena.id === 'boss' ? whiteLeft() : null,
    demo: DEMO.active,
    callbacks: {
      onSlash: openQuestionFromGame,
      onHeartsOut: bossHeartsOut,
      onEndDone: showResultAfterGame,
      onHud: renderPlayHud,
      onCoinsStart: n => TUT.onCoins(n)
    }
  });
  if (ctx.notices.length) notice('Thông báo về câu hỏi', ctx.notices.join('\n'));   // game đứng hình tới khi đóng
  TUT.onBeginPlay(arena);   // toast quiz_bua, không chặn
}

// ---------- Câu hỏi hiện đè lên màn chơi ----------
function quizOpen() { return !$('quiz').classList.contains('hidden'); }
function hideQuestion() { $('quiz').classList.add('hidden'); }

// Game báo vừa chém trúng: mở câu kế tiếp trong hàng đợi của engine (con chết trước nhận câu trước)
function openQuestionFromGame() {
  if (!RUN) return;
  renderQuestion();
  $('quiz').classList.remove('hidden');
  $('quiz').scrollTop = 0;
  // Focus vào khung câu hỏi (không vào ô phương án) để A/B/C chọn và Enter xác nhận như bản cũ
  $('quiz').focus({ preventScroll: true });
}

// Thanh trạng thái trên màn chơi: quái còn lại, hoặc máu Boss, tim, lượt trắng
function renderPlayHud(h) {
  if (!h) return;
  const stats = [];
  if (h.phase === 'coins' || (h.phase === 'ending' && h.coinsTotal)) stats.push(`<span class="ps ps-coin">+${h.coinsGot}/${h.coinsTotal} Credit</span>`);
  else if (h.kind === 'arena') stats.push(`<span class="ps ps-mob">Quái còn <b>${h.remaining}</b>/${h.total}</span>`);
  else stats.push(`<span class="ps ps-hp">Máu Boss <b>${h.bossHp}</b>/${h.bossHpMax}</span>`);
  stats.push(`<span class="ps ps-credit">Credit <b>${S.credits}</b></span>`);
  $('playStats').innerHTML = stats.join('');
  let hud = '';
  if (h.kind === 'boss') {
    let bar = '';
    for (let i = 0; i < h.bossHpMax; i++) bar += `<i class="${i < h.bossHp ? 'on' : 'off'}"></i>`;
    let hearts = '';
    for (let i = 0; i < h.maxHearts; i++) hearts += `<i class="heart ${i < h.hearts ? 'full' : 'empty'}"></i>`;
    hud = `<div class="boss-bar" title="Máu Boss: còn ${h.bossHp} câu">${bar}</div>
      <div class="hearts">${hearts}</div>
      <div class="white-left">còn ${h.whiteLeft ?? 0} lượt trắng</div>`;
  }
  $('playHud').innerHTML = hud;
}

// Boss: mất hết 2 tim (Mục 15.4)
function bossHeartsOut() {
  stopTimer();
  hideQuestion();
  const r = whiteRun();
  GAME.stop();
  updateHUD();
  if (!r) return;
  if (r.outcome === 'white') {
    renderWhiteResult();
    show('result');
  } else {
    renderDashboard();
    show('dashboard');
    notice('Hết lượt trắng: tính là thoát Boss', `Bạn mất hết tim lần thứ ${CONFIG.bossWhiteRuns + 1} trong lần mở khoá này. ${r.msg} Bùa đã dùng trong lượt này được hoàn lại.`);
  }
}

// Hết đồng xu: hiện màn kết quả
function showResultAfterGame() {
  GAME.stop();
  hideQuestion();
  if (!LAST) { renderDashboard(); show('dashboard'); return; }
  if (LAST.arena.isQuest) renderQuestResult();
  else renderResult();
  show('result');
  updateHUD();
}

// ---------- Đồng hồ mỗi câu (Arena 3, 4, Boss) ----------
function elapsedSec() { return RUN ? Math.floor((performance.now() - RUN.shownAt) / 1000) : 0; }

function renderTimer() {
  const el = $('qTimer');
  if (!RUN || !RUN.limit) { el.classList.add('hidden'); return; }
  el.classList.remove('hidden');
  if (RUN.waitNotice) { el.textContent = `${RUN.limit} giây`; el.className = 'q-timer'; return; }
  const left = RUN.limit - elapsedSec();
  if (left >= 0) {
    el.textContent = `Còn ${left} giây`;
    el.className = 'q-timer' + (left <= 10 ? ' warn' : '');
  } else {
    const over = -left;
    el.textContent = `Quá giờ ${over} giây · −${penaltyFor(over)} Credit`;
    el.className = 'q-timer over';
    TUT.onOvertime(penaltyFor(over));   // toast quiz_quagio, chỉ lần đầu
  }
}
function startTimer() {
  stopTimer();
  renderTimer();
  if (RUN && RUN.limit) RUN.timerId = setInterval(renderTimer, 250);
}
function stopTimer() {
  if (RUN && RUN.timerId) { clearInterval(RUN.timerId); RUN.timerId = null; }
}

function renderQuestion() {
  const q = beginQuestion();
  $('quizArena').textContent = RUN.attempt > 1 ? `${RUN.arena.name} · ${RUN.arena.isQuest ? 'lần' : 'lượt'} ${RUN.attempt}` : RUN.arena.name;
  $('quizCount').textContent = `${RUN.qi + 1} / ${RUN.qs.length}`;
  $('progress').style.width = (RUN.qi / RUN.qs.length * 100) + '%';
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
  demoPrefill(q);                      // chế độ demo: đáp án kịch bản chọn sẵn và khoá
  RUN.shownAt = performance.now();     // Mục 1: mốc bắt đầu đo thời gian trả lời
  startTimer();
  saveInProgress();
}

function selectOption(i) {
  if (!RUN || RUN.locked || i === RUN.eliminated || DEMO.lockChoice) return;
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
  const measured = Math.round(performance.now() - RUN.shownAt);
  const timeMs = demoTimeMs(RUN.arena.id, RUN.qi, measured);   // demo: thời gian lấy từ kịch bản (Mục 15.6)
  const { correct } = recordAnswer(RUN.selected, timeMs);   // ghi câu trả lời, khoá câu
  stopTimer();
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

// Xác nhận xong: đóng câu hỏi, game chạy tiếp. Câu cuối thì chấm round.
function nextQuestion() {
  if (!RUN) return;
  hideQuestion();
  const done = advanceQuestion();
  GAME.answered(done);
  if (done) finishArena();
}

function renderItemBox() {
  const box = $('itemBox');
  if (!RUN.arena.itemsAllowed) {
    const why = RUN.arena.id === 'arena1' ? 'Arena 1 là bài chẩn đoán gốc.' : 'World Quest chỉ để ôn và kiếm Credit, không có ngưỡng đỗ.';
    box.innerHTML = `<div class="item-card"><b>Không dùng vật phẩm ở ${esc(RUN.arena.name)}</b><p>${why}</p></div>`;
    return;
  }
  box.innerHTML = Object.entries(ITEMS).map(([id, it]) => {
    const owned = S.inventory[id];
    return `<div class="item-card"><b>${esc(it.name)}</b> <span>(đang có ${owned})</span><p>${esc(it.desc)}</p>
      <button type="button" data-item="${id}" ${owned ? '' : 'disabled'}>${owned ? 'Dùng cho câu này' : 'Chưa có'}</button></div>`;
  }).join('') + `<p class="note">Mỗi Arena dùng tối đa 1 vật phẩm.${RUN.itemUsedInArena ? ` Đã dùng: ${esc(itemName(RUN.itemUsedInArena))}.` : ''}</p>`;
  box.querySelectorAll('button[data-item]').forEach(b => b.addEventListener('click', () => useItem(b.dataset.item)));
}

function useItem(id) {
  const r = applyItem(id);
  if (!r.ok) {
    if (r.reason === 'perQuestion') notice('Không dùng thêm được', 'Mỗi câu tối đa 1 vật phẩm.');
    else if (r.reason === 'perArena') notice('Không dùng thêm được', 'Mỗi arena sử dụng tối đa 1 vật phẩm.');
    else if (r.reason === 'notOwned') toast('Bạn chưa có vật phẩm này.');
    return;
  }
  if (id === 'eliminate') {
    // Engine đã bỏ chọn nếu phương án đang chọn bị loại
    const b = $('qOptions').children[r.eliminated];
    b.disabled = true;
    b.classList.add('eliminated');
    b.classList.remove('selected');
    toast('Đã dùng Bùa Loại Trừ.');
  }
  renderItemBox();
  updateHUD();
}

// Mục 7: thoát giữa Arena thì huỷ lượt, không lưu dở dang. Bùa đã dùng được hoàn lại.
// v12 thêm hai luật (đã chốt 06/10):
// - Arena 3, 4: tiền phạt quá giờ của các câu đã trả lời trước khi thoát vẫn bị trừ.
// - Boss: không hoàn 15 Credit đã trả, Boss khoá lại; các câu đã hiện coi như đã gặp để đề sau bốc lại.
function exitWarning(id, penalty) {
  if (id === 'quest') return 'Thoát World Quest sẽ huỷ lần chơi này, không nhận Credit. Thoát?';
  if (id === 'boss') return `Thoát giữa Boss sẽ huỷ lượt này. ${CONFIG.bossUnlockCost} Credit đã trả để mở Boss KHÔNG được hoàn lại và Boss sẽ khoá lại: muốn vào lại phải trả ${CONFIG.bossUnlockCost} Credit lần nữa. Bùa đã dùng trong lượt này được hoàn lại. Thoát?`;
  const base = 'Thoát giữa Arena sẽ huỷ lượt này. Các câu đã làm không được lưu, vật phẩm đã dùng trong lượt này được hoàn lại.';
  if (timeLimitFor(id)) return `${base} Tiền phạt quá giờ của các câu đã trả lời vẫn bị trừ${penalty ? ` (hiện là −${penalty} Credit)` : ' (hiện là 0)'}. Thoát?`;
  return base + ' Thoát?';
}

async function exitArena() {
  // Đã chấm round, đang nhặt xu: nút Thoát chỉ bỏ qua phần đồng xu (Credit đã vào ví)
  if (!RUN) { if (GAME.state) showResultAfterGame(); return; }
  const ok = await ask('Thoát giữa chừng?', exitWarning(RUN.arena.id, runPenalty()), 'Thoát', 'Ở lại làm tiếp');
  if (!ok || !RUN) return;
  stopTimer();
  const msg = abandonRun();   // huỷ lượt, đọc lại bản lưu, áp luật thoát
  GAME.stop();
  hideQuestion();
  renderDashboard();
  show('dashboard');
  if (msg) toast(msg);
}

// Hết câu: engine chấm round và cộng Credit TRƯỚC (Mục 15.5), rồi game rơi đồng xu.
// Màn kết quả hiện khi nhặt xong xu (showResultAfterGame).
function finishArena() {
  stopTimer();
  hideQuestion();
  const L = finishRun();   // chấm round, cộng trừ Credit, chọn cụm yếu, lưu
  updateHUD();
  demoCheckExpected(L);
  GAME.endArena({ coins: Math.max(0, L.net), passed: L.passed });
}


/* ---------- 11. Màn kết quả sau mỗi Arena (Mục 7 đường chính, Mục 5 output sau mỗi arena) ---------- */
// Thông báo "Arena kế tiếp" sau khi đỗ một Arena (dùng chung cho màn kết quả và màn xem lại)
function announceAfter(id) {
  if (id === 'arena1') return `${S.w1Why} ${NAME('trap1')} sẽ gồm 10 câu của ${S.w1}.`;
  if (id === 'trap1') return `${NAME('crossroads')} sẽ hỏi 2 câu mỗi cụm để cập nhật bảng chẩn đoán.`;
  if (id === 'crossroads') return `${S.w2Why} ${NAME('trap2')} sẽ gồm 10 câu của ${S.w2}.`;
  if (id === 'trap2') return `Boss sẽ hỏi ${S.bossWhy}`;
  if (id === 'boss') return 'Bạn đã vượt Boss. Bảng tổng kết đã mở.';
  return '';
}

// Danh sách giải thích câu sai. Mỗi phần tử { r: bản ghi câu trả lời, q: câu hỏi đúng thứ tự phương án đã hiện }
function wrongAnswersHTML(wrong) {
  let html = `<h3>Giải thích câu sai (${wrong.length})</h3>`;
  if (!wrong.length) return html + '<p class="muted">Không có câu sai trong Arena này.</p>';
  wrong.forEach(({ r, q }, k) => {
    if (!q) {
      html += `<p class="note">Câu ${esc(r.qid)} không còn trong ngân hàng đang nạp nên không hiện được giải thích.</p>`;
      return;
    }
    const known = q.orderKnown !== false;          // false: câu lấy lại lưu từ bản cũ, không biết thứ tự đã xáo
    const reason = known ? q.distractorReason[r.choice] : '';
    html += `<details class="review" ${k === 0 ? 'open' : ''}>
      <summary>${esc(q.cluster)} · ${esc(MODULE_NAMES[q.module])} · mức ${q.difficulty}${r.item ? ` · đã dùng ${esc(itemName(r.item))}` : ''}${r.overSec ? ` · quá giờ ${r.overSec} giây` : ''}</summary>
      <p class="stem">${esc(q.stem)}</p>
      ${known ? `<p><span class="tag wrong">Bạn chọn</span> ${'ABC'[r.choice]}. ${esc(q.options[r.choice])}</p>` : '<p class="note">Câu lấy lại từ bản lưu cũ: không khôi phục được phương án bạn đã chọn.</p>'}
      ${reason ? `<p class="reason">Vì sao dễ chọn nhầm: ${esc(reason)}</p>` : ''}
      <p><span class="tag right">Đáp án</span> ${known ? 'ABC'[q.answer] + '. ' : ''}${esc(q.options[q.answer])}</p>
      <p class="explain">${esc(q.explanation)}</p>
    </details>`;
  });
  return html;
}
function renderResult() {
  const L = LAST;
  const a = L.arena;
  const next = ARENAS[ARENA_INDEX[a.id] + 1];
  const need = needToPass(L.total, a.id);
  let html = demoResultBox(L) + `<div class="eyebrow">Kết quả${L.attempt > 1 ? ` · lượt ${L.attempt}` : ''}</div>
    <h1>${esc(a.name)}</h1>
    <div class="result-score ${L.passed ? 'pass' : 'fail'}">
      <b>${fmtPct(L.correct, L.total)}</b>
      <span>${L.correct}/${L.total} câu đúng · ngưỡng ${need}/${L.total} (${passPercentFor(a.id)}%) · ${L.passed ? 'Đỗ' : 'Trượt'}</span>
    </div>`;

  if (!L.passed) {
    html += `<p>Chưa đạt ngưỡng ${passPercentFor(a.id)}% (cần ${need}/${L.total} câu). Không cấp Credit thưởng. ${next ? esc(next.name) + ' bị khoá' : 'Bảng tổng kết bị khoá'} cho tới khi bạn chơi lại và đỗ. Lượt chơi lại dùng bộ câu rút mới.</p>`;
  }
  html += `<div id="creditLine">${creditLineHTML(L)}</div>`;   // id: điểm neo coach mark res_arena1_credit
  if (a.id === 'boss') {
    // Sửa 14/10/2026: cột Boss ở bảng tổng kết lấy lượt đỗ
    html += L.passed
      ? `<p class="note">Bảng tổng kết dùng lượt Boss này${L.attempt > 1 ? ` (lượt ${L.attempt})` : ''} cho cột Boss và kết luận từng cụm, không tính câu lấy lại đã gặp. Performance score vẫn giữ theo lượt Boss đầu tiên.</p>`
      : '<p class="note">Lượt Boss trượt chỉ tính cho Credit. Cột Boss ở bảng tổng kết sẽ lấy từ lượt bạn đỗ Boss.</p>';
  } else if (L.attempt > 1) {
    html += '<p class="note">Lượt này tính cho đỗ/trượt và Credit. Bảng chẩn đoán và performance score vẫn giữ theo lượt làm đầu tiên.</p>';
  }
  if (L.notices.length) html += `<div class="warn-box">${L.notices.map(esc).join('<br>')}</div>`;

  if (L.passed) html += `<div class="announce"><h3>Arena kế tiếp</h3><p>${esc(announceAfter(a.id))}</p></div>`;

  // id diagTable: điểm neo coach mark res_arena1_bang
  html += `<h3>Bảng chẩn đoán</h3><div id="diagTable">${diagnosticTableHTML([S.w1, S.w2].filter(Boolean))}</div>`;
  html += `<h3>Tỷ lệ đúng của các cụm qua từng Arena</h3>${progressChartHTML()}`;

  html += wrongAnswersHTML(L.answers.map((r, i) => ({ r, q: L.qs[i] })).filter(x => !x.r.correct));
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
    addBtn('Xem bảng tổng kết', 'primary-btn', () => { openReport(); });
  } else {
    addBtn('Vào Shop', 'secondary-btn', () => openShop('result'));
    addBtn('Về bảng tiến trình', 'secondary-btn', () => { renderDashboard(); show('dashboard'); });
    if (L.passed && next && next.id === 'boss') {
      // Sau Arena 4: Boss phải mở khoá bằng Credit, thiếu thì đi World Quest
      addBtn('Chơi World Quest', 'secondary-btn', startQuest);
      addBtn(S.credits >= CONFIG.bossUnlockCost ? `Mở khoá Boss (${CONFIG.bossUnlockCost} Credit)` : `Mở Boss: còn thiếu ${CONFIG.bossUnlockCost - S.credits} Credit`, 'primary-btn', unlockBoss);
    } else {
      addBtn(L.passed ? `Vào ${next.name}` : `Chơi lại ${a.name}`, 'primary-btn', startArena);
    }
  }
  TUT.onResult(L);   // coach mark sau Arena 1 và sau khi đỗ Arena 4
}

// Màn kết quả của lượt trắng (Mục 15.4)
function renderWhiteResult() {
  const L = LAST;
  let html = `<div class="eyebrow">Boss · lượt ${L.attempt}</div>
    <h1>Lượt trắng</h1>
    <div class="result-score fail white">
      <b>Mất hết tim</b>
      <span>Đã trả lời ${L.answers.length}/${L.size} câu · lượt này không tính điểm</span>
    </div>
    <p>Lượt Boss kết thúc vì bạn trúng đạn ${CONFIG.bossWhiteRuns} lần. Các câu trả lời trong lượt này không vào bảng chẩn đoán, bảng tổng kết hay performance score. Boss vẫn mở, bạn không mất ${CONFIG.bossUnlockCost} Credit mở khoá.</p>
    <div class="announce"><h3>Còn ${L.whiteLeft} lượt trắng</h3><p>${L.whiteLeft > 0
      ? `Mỗi lần mở Boss có ${CONFIG.bossWhiteRuns} lượt trắng. Lượt Boss làm đủ ${L.size} câu, dù đỗ hay trượt, không làm mất lượt trắng.`
      : `Bạn đã dùng hết lượt trắng. Nếu mất hết tim thêm một lần nữa, lượt đó tính là thoát Boss: mất ${CONFIG.bossUnlockCost} Credit và Boss khoá lại.`}</p></div>
    <div id="creditLine">${creditLineHTML(L)}</div>
    <p class="note">Bùa đã dùng trong lượt trắng không được hoàn. Câu đã hiện trong lượt này được tính là đã gặp.</p>`;
  $('resultBody').innerHTML = html;
  const actions = $('resultActions');
  actions.innerHTML = '';
  const addBtn = (label, cls, fn) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = cls; b.textContent = label;
    b.addEventListener('click', fn);
    actions.appendChild(b);
  };
  addBtn('Vào Shop', 'secondary-btn', () => openShop('result'));
  addBtn('Về bảng tiến trình', 'secondary-btn', () => { renderDashboard(); show('dashboard'); });
  addBtn('Vào Boss lại', 'primary-btn', startArena);
}

// Dòng tính Credit sau mỗi round: thưởng − phạt quá giờ = thực nhận (v12)
function creditLineHTML(L) {
  const parts = [];
  if (L.passed) parts.push(`thưởng +${L.credit}`);
  if (L.bossBonus) parts.push(`thưởng vượt Boss lần đầu +${L.bossBonus}`);
  if (L.penalty) parts.push(`phạt quá giờ −${L.penalty} (${L.overCount} câu quá giờ)`);
  if (!parts.length) return `<p>Credit không đổi. Số dư hiện tại: <b>${S.credits} Credit</b>.</p>`;
  const capped = L.net !== (L.passed ? L.credit : 0) + (L.bossBonus || 0) - (L.penalty || 0);
  return `<div class="credit-line"><span>${esc(parts.join(' · '))}</span>
    <b>Thực nhận ${L.net >= 0 ? '+' : '−'}${Math.abs(L.net)} Credit</b>
    <span>Số dư hiện tại: <b>${S.credits} Credit</b>${capped ? ' (ví không xuống dưới 0)' : ''}</span></div>`;
}

// Màn kết quả của World Quest
function renderQuestResult() {
  const L = LAST;
  const lack = Math.max(0, CONFIG.bossUnlockCost - S.credits);
  let html = demoResultBox(L) + `<div class="eyebrow">World Quest · lần ${L.attempt}</div>
    <h1>World Quest</h1>
    <div class="result-score pass">
      <b>${fmtPct(L.correct, L.total)}</b>
      <span>${L.correct}/${L.total} câu đúng · nhận +${L.credit} Credit</span>
    </div>
    <p>Bậc thưởng: từ 60% được +2, từ 80% được +3, từ 90% được +4, dưới 60% không nhận. Số dư hiện tại: <b>${S.credits} Credit</b>.</p>`;
  if (!S.bossUnlocked && !S.finished) {
    html += lack > 0
      ? `<div class="announce"><h3>Còn thiếu ${lack} Credit để mở Boss</h3><p>Chơi World Quest thêm để kiếm đủ ${CONFIG.bossUnlockCost} Credit.</p></div>`
      : `<div class="announce"><h3>Đã đủ Credit mở Boss</h3><p>Mở Boss tốn ${CONFIG.bossUnlockCost} Credit, trả một lần.</p></div>`;
  }
  html += '<p class="note">Kết quả World Quest không tính vào bảng chẩn đoán và bảng tổng kết. Các câu đã ra ở đây sẽ không xuất hiện lại ở Boss.</p>';
  if (L.notices.length) html += `<div class="warn-box">${L.notices.map(esc).join('<br>')}</div>`;
  html += wrongAnswersHTML(L.answers.map((r, i) => ({ r, q: L.qs[i] })).filter(x => !x.r.correct));
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
  addBtn('Về bảng tiến trình', 'secondary-btn', () => { renderDashboard(); show('dashboard'); });
  addBtn('Chơi World Quest lần nữa', 'secondary-btn', startQuest);
  if (!S.bossUnlocked && !S.finished && lack === 0) addBtn(`Mở khoá Boss (${CONFIG.bossUnlockCost} Credit)`, 'primary-btn', unlockBoss);
  if (S.bossUnlocked && !S.finished) addBtn('Vào Boss', 'primary-btn', startArena);
}


/* ---------- 11b. Xem lại Arena đã đỗ (bấm ô trên bảng tiến trình) ---------- */
// Dựng lại câu hỏi đúng thứ tự phương án người chơi đã thấy, từ mã câu và thứ tự xáo đã lưu
function questionAsShown(r, byId) {
  const q = byId.get(r.qid);
  if (!q) return null;
  if (!r.reused) return q;
  if (!Array.isArray(r.order)) return { ...q, orderKnown: false };
  return {
    ...q,
    options: r.order.map(i => q.options[i]),
    distractorReason: r.order.map(i => q.distractorReason[i] ?? ''),
    answer: r.order.indexOf(q.answer)
  };
}

// Số liệu hiện đúng như lúc vừa đỗ Arena đó: bảng chẩn đoán và biểu đồ chỉ tính tới hết Arena này
function reviewArena(id) {
  const idx = ARENA_INDEX[id];
  const a = ARENAS[idx];
  const tries = S.attempts[id];
  const t = [...tries].reverse().find(x => x.passed) || tries[tries.length - 1];
  if (!t) return;

  let html = `<div class="eyebrow">Xem lại${tries.length > 1 ? ` · lượt ${t.attempt}` : ''}</div>
    <h1>${esc(a.name)}</h1>
    <div class="result-score ${t.passed ? 'pass' : 'fail'}">
      <b>${fmtPct(t.correct, t.total)}</b>
      <span>${t.correct}/${t.total} câu đúng · ${t.passed ? 'Đỗ' : 'Trượt'}</span>
    </div>
    <p>Thưởng <b>${t.credit} Credit</b>${t.bossBonus ? ` và thưởng vượt Boss lần đầu <b>+${t.bossBonus}</b>` : ''}${t.penalty ? `, phạt quá giờ <b>−${t.penalty}</b>, thực nhận <b>${t.net >= 0 ? '+' : '−'}${Math.abs(t.net)}</b>` : ''}${t.itemUsed ? `. Đã dùng ${esc(itemName(t.itemUsed))}` : ''}.</p>`;
  if (tries.length > 1) {
    const earlier = tries.filter(x => x !== t).map(x => tryText(x).replace('Lượt', 'lượt')).join('; ');
    html += `<p class="note">Các lượt khác: ${esc(earlier)}. Bảng chẩn đoán vẫn tính theo lượt làm đầu tiên.</p>`;
  }
  if (t.passed) html += `<div class="announce"><h3>Arena kế tiếp</h3><p>${esc(announceAfter(id))}</p></div>`;

  const targets = idx >= ARENA_INDEX.crossroads ? [S.w1, S.w2] : [S.w1];
  html += `<h3>Bảng chẩn đoán sau ${esc(a.name)}</h3>${diagnosticTableHTML(targets.filter(Boolean), idx)}`;
  html += `<h3>Tỷ lệ đúng của các cụm tới hết ${esc(a.name)}</h3>${progressChartHTML(idx)}`;

  const byId = new Map(BANK.map(q => [q.id, q]));
  const wrong = S.records
    .filter(r => r.arena === id && r.attempt === t.attempt && !r.correct)
    .map(r => ({ r, q: questionAsShown(r, byId) }));
  html += wrongAnswersHTML(wrong);
  $('resultBody').innerHTML = html;

  const actions = $('resultActions');
  actions.innerHTML = '';
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'primary-btn';
  b.textContent = 'Về bảng tiến trình';
  b.addEventListener('click', () => { renderDashboard(); show('dashboard'); });
  actions.appendChild(b);
}


/* ---------- 12. Shop (Mục 8, Mục 7 đường lỗi) ---------- */
function openShop(from) {
  shopReturn = from;
  renderShop();
  show('shop');
  TUT.onShop();   // tooltip shop_a, shop_b (lần đầu mở Shop)
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
      if (!buyItem(id)) return;
      renderShop();
      updateHUD();
      toast(`Đã mua ${it.name}.`);
    });
    g.appendChild(d);
  });
}

function closeShop() {
  if (shopReturn === 'result' && LAST) {
    if (LAST.outcome === 'white') renderWhiteResult();
    else if (LAST.arena.isQuest) renderQuestResult();
    else renderResult();
    show('result');
  }
  else { renderDashboard(); show('dashboard'); }
}


/* ---------- 13. Bảng tổng kết sau Boss (Mục 5 Bảng A, Mục 7) ---------- */
// Luôn mở màn bảng tổng kết. Nếu dựng bảng bị lỗi thì hiện lỗi ngay trên màn hình
// (kèm dữ liệu lượt chơi để nhóm gửi lại), thay vì bấm vào không có phản hồi gì.
function openReport() {
  show('report');
  try {
    renderReport();
    TUT.onReport();   // coach mark report_a, report_b (lần đầu mở)
  } catch (err) {
    console.error(err);
    $('reportBody').innerHTML = `<div class="eyebrow">Bảng tổng kết</div><h1>Không dựng được bảng tổng kết</h1>
      <div class="warn-box">Lỗi: ${esc(err && err.message)}<br><small>${esc(err && err.stack ? err.stack.split('\n').slice(0, 3).join(' | ') : '')}</small></div>
      <p class="note">Chụp màn hình này gửi nhóm. Dữ liệu lượt chơi bên dưới giúp tái hiện lỗi.</p>
      <details class="review"><summary>Dữ liệu lượt chơi</summary><pre>${esc(JSON.stringify(S))}</pre></details>`;
  }
}

function renderReport() {
  // Dựng lại để tiến trình lưu từ bản trước 14/10/2026 cũng hiện đúng luật mới
  refreshAccuracy();
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
  if (S.hadFailure) html += '<p class="note">Lượt chơi có ít nhất một lần trượt. Mốc chẩn đoán (Arena 1–4) và performance score đọc theo lượt làm đầu tiên của mỗi Arena. Cột Boss và kết luận từng cụm đọc theo lượt đỗ Boss. Điểm và Credit ghi theo từng lượt, xem bảng "Các lượt làm Arena".</p>';
  const bossAt = bossReportAttempt();
  const reusedOut = bossReusedExcluded();
  if (bossAt) {
    const before = S.attempts.boss.filter(t => t.attempt < bossAt);
    const kinds = [['fail', 'lượt trượt'], ['white', 'lượt trắng'], ['quit', 'lượt thoát']]
      .map(([k, label]) => { const n = before.filter(t => t.outcome === k || (!t.outcome && k === 'fail' && !t.passed)).length; return n ? `${n} ${label}` : ''; })
      .filter(Boolean).join(', ');
    html += `<p class="note">Cột Boss lấy từ lượt đỗ Boss (lượt ${bossAt}${kinds ? `, sau ${kinds}` : ''})${reusedOut ? `; đã bỏ ${reusedOut} câu lấy lại đã gặp khỏi mẫu` : ''}. Lượt trắng và lượt thoát không vào bảng này và không vào performance score.</p>`;
  }
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
    <div class="tbl-wrap" id="reportClusterTable"><table class="diag"><thead><tr><th>Cụm</th>${ARENAS.map(a => `<th>${esc(a.name.replace(' · The Gate', ''))}</th>`).join('')}<th>Kết luận</th></tr></thead><tbody>${rows}</tbody></table></div>
    <p class="note">Ô "--" là Arena không hỏi cụm đó, không phải trả lời sai hết. Arena 1–4 tính theo lượt làm đầu tiên; Boss tính theo lượt đỗ, không gồm câu lấy lại đã gặp. Không gồm câu dùng vật phẩm.</p>
    <div class="claim-note" id="claimNote"><b>Đọc bảng này cần nhớ</b><ol>
      <li>Tỷ lệ đúng ở Boss cao hơn mốc không chứng minh ${esc(NAME('trap1'))} và ${esc(NAME('trap2'))} làm bạn tiến bộ.</li>
      <li>Câu dùng Bùa bị loại khỏi dữ liệu chẩn đoán.</li>
      <li>Cụm yếu thứ ba ở Boss có tối đa ${BOSS_SPLIT[2]} câu, mẫu rất nhỏ.</li>
    </ol></div>`;

  // Câu hỏi MVP phải trả lời
  const targeted = [S.w1, S.w2].filter(Boolean);
  html += `<h3>Cụm yếu được luyện ở ${NAME('trap1')} và ${NAME('trap2')} có tiến bộ ở Boss không?</h3><div class="milestones">`;
  targeted.forEach(c => {
    const k = conclude(c);
    const trap = c === S.w1 ? NAME('trap1') : NAME('trap2');
    html += k.noData
      ? `<div class="milestone"><b>${c}</b> (${trap}): có trong Boss nhưng mọi câu Boss của cụm ở lượt đỗ đều là câu lấy lại hoặc câu dùng Bùa, nên chưa đủ dữ liệu để kết luận.</div>`
      : k.cls === 'na'
      ? `<div class="milestone"><b>${c}</b> (${trap}): không nằm trong 3 cụm yếu nhất lúc vào Boss nên không có câu Boss. Lượt này không trả lời được câu hỏi cho cụm này.</div>`
      : `<div class="milestone"><b>${c}</b> (${trap}): mốc chẩn đoán ${k.baseC}/${k.baseA} = ${fmtPct(k.baseC, k.baseA)}, Boss ${k.bossC}/${k.bossA} = ${fmtPct(k.bossC, k.bossA)}. Kết luận: ${k.text}.</div>`;
  });
  html += `</div><p class="note">Mốc chẩn đoán = Arena 1 + ${NAME('crossroads')}. Kết luận chỉ nói về lượt chơi này, mẫu mỗi cụm còn nhỏ.</p>`;

  // Chi tiết 9 module
  const repRecs = reportRecords();
  const base = moduleStats(repRecs.filter(r => r.arena === 'arena1' || r.arena === 'crossroads'));
  const boss = moduleStats(repRecs.filter(r => r.arena === 'boss'));
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
    const noScore = t.outcome === 'white' || t.outcome === 'quit';
    const verdict = t.outcome === 'white' ? 'Lượt trắng' : t.outcome === 'quit' ? 'Thoát' : t.passed ? 'Đỗ' : 'Trượt';
    arows += `<tr><th scope="row">${esc(a.name)}</th><td>${t.attempt}</td><td>${noScore ? '--' : `${t.correct}/${t.total} (${fmtPct(t.correct, t.total)})`}</td><td>${verdict}</td><td>+${t.credit + t.bossBonus}</td><td>${t.penalty ? '−' + t.penalty : '0'}</td><td>${t.net >= 0 ? '+' : '−'}${Math.abs(t.net)}</td><td>${t.itemUsed ? esc(itemName(t.itemUsed)) : '--'}</td></tr>`;
  }));
  html += `<h3>Các lượt làm Arena</h3><div class="tbl-wrap"><table class="diag"><thead><tr><th>Arena</th><th>Lượt</th><th>Điểm</th><th>Kết quả</th><th>Thưởng</th><th>Phạt giờ</th><th>Thực nhận</th><th>Vật phẩm</th></tr></thead><tbody>${arows}</tbody></table></div>`;

  // v12: World Quest, mở Boss, các lần thoát
  if (S.questRuns.length) {
    const qrows = S.questRuns.map(r => `<tr><td>${r.n}</td><td>${r.correct}/${r.total} (${fmtPct(r.correct, r.total)})</td><td>+${r.credit}</td></tr>`).join('');
    html += `<h3>World Quest</h3><div class="tbl-wrap"><table class="diag"><thead><tr><th>Lần</th><th>Điểm</th><th>Credit</th></tr></thead><tbody>${qrows}</tbody></table></div>
      <p class="note">Không tính vào bảng chẩn đoán và các kết luận ở trên.</p>`;
  }
  const quits = S.quits || [];
  if (quits.length) {
    html += `<p class="note">Thoát giữa chừng ${quits.length} lần: ${esc(quits.map(x => `${NAME(x.arena)}${x.arena === 'boss' ? ' (Boss khoá lại, mất ' + CONFIG.bossUnlockCost + ' Credit)' : x.penalty ? ` (phạt −${x.penalty})` : ''}`).join('; '))}.</p>`;
  }

  if (S.bankLog.length) {
    html += `<details class="review"><summary>Log thiếu câu cho nhóm bổ sung ngân hàng (${S.bankLog.length})</summary><ul>${S.bankLog.map(l => `<li>${esc(l.arena)} lượt ${l.attempt}: ${esc(l.text)}</li>`).join('')}</ul></details>`;
  }
  html += `<details class="review"><summary>Dữ liệu gốc để đối chiếu với SOLUTION_STRUCTURE</summary>
    <pre>accuracy_by_arena = ${esc(JSON.stringify(abya, null, 2))}\n\nperformance_by_arena = ${esc(JSON.stringify(perf, null, 2))}</pre></details>`;

  $('reportBody').innerHTML = demoReportCheck(earned, offered) + html;
}


/* ---------- 14. Khởi động ---------- */
// Nạp ngân hàng vào engine và hiện dòng trạng thái ở màn đầu. Trả về true nếu hợp lệ.
function applyBank(raw) {
  const r = loadBankData(raw);
  const el = $('bankStatus');
  if (el) {
    if (r.ok) {
      el.textContent = `Ngân hàng hợp lệ: ${r.count} câu, 5 cụm, 9 module.` + (r.warnings.length ? ` Lưu ý: ${r.warnings.join('; ')}.` : '');
      el.className = 'status ok';
    } else {
      el.textContent = `Ngân hàng chưa hợp lệ: ${r.errors.slice(0, 3).join('; ')}${r.errors.length > 3 ? '…' : ''}`;
      el.className = 'status error';
    }
  }
  return r.ok;
}

async function loadBank() {
  try {
    const r = await fetch('../data/ethics_bank_220.json', { cache: 'no-store' });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    applyBank(await r.json());
  } catch {
    // Mở bằng file:// thì trình duyệt chặn fetch, dùng bản nhúng.
    if (Array.isArray(window.CFA_EMBEDDED_BANK) && window.CFA_EMBEDDED_BANK.length) {
      applyBank(window.CFA_EMBEDDED_BANK);
    } else {
      const el = $('bankStatus');
      el.textContent = 'Chưa nạp được ethics_bank_220.json. Dùng nút nạp file bên dưới hoặc chạy bằng local server.';
      el.className = 'status error';
    }
  }
}

function resetRun() {
  if (RUN && !confirm('Đang làm dở một Arena. Reset sẽ xoá toàn bộ lượt chơi. Tiếp tục?')) return;
  if (!RUN && !confirm('Reset sẽ xoá toàn bộ dữ liệu lượt chơi hiện tại. Tiếp tục?')) return;
  stopTimer();
  GAME.stop();
  hideQuestion();
  wipeAll();
  updateHUD();
  show('home');
  toast('Đã xoá lượt chơi.');
}

function init() {
  demoInit();   // phải chạy trước restoreState: chế độ demo dùng khoá lưu riêng
  const problem = restoreState();

  $('startBtn').addEventListener('click', startRun);
  $('resetBtn').addEventListener('click', resetRun);
  $('newRunBtn').addEventListener('click', () => {
    if (DEMO.active) { demoStartRun(true); return; }
    discardSave(); startRun();
  });
  $('shopBtn').addEventListener('click', () => openShop('dashboard'));
  $('shopBack').addEventListener('click', closeShop);
  $('reportBack').addEventListener('click', () => { renderDashboard(); show('dashboard'); });
  $('confirmBtn').addEventListener('click', confirmAnswer);
  $('nextBtn').addEventListener('click', nextQuestion);
  $('exitBtn').addEventListener('click', exitArena);
  $('playExit').addEventListener('click', exitArena);
  $('playDemoRun').addEventListener('click', demoRunRest);   // thanh trên cùng ẩn trong màn chơi: nút demo đặt cạnh nút Thoát
  // Game đứng hình khi có hộp thông báo, thẻ hướng dẫn hoặc bảng Luật chơi đang mở
  GAME.init($('gameCanvas'), {
    isBlocked: () => !$('noticeOverlay').classList.contains('hidden') || TUT.isOpen() || entering
  });
  $('noticeOk').addEventListener('click', () => closeNotice(true));
  $('noticeCancel').addEventListener('click', () => closeNotice(false));
  TUT.init();   // nút Luật chơi, Xem lại hướng dẫn
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
    if (!RUN || !quizOpen() || !$('playStage').closest('.screen').classList.contains('active') || !$('noticeOverlay').classList.contains('hidden') || TUT.isOpen()) return;
    const map = { a: 0, b: 1, c: 2, 1: 0, 2: 1, 3: 2 };
    const k = e.key.toLowerCase();
    if (k in map && !e.ctrlKey && !e.metaKey) { selectOption(map[k]); }
    if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') { e.preventDefault(); RUN.locked ? nextQuestion() : confirmAnswer(); }
  });
  window.addEventListener('beforeunload', e => { if (RUN) { e.preventDefault(); e.returnValue = ''; } });

  updateHUD();
  if (GAME.touchOnly()) $('deviceBlock').classList.remove('hidden');
  loadBank().then(() => {
    if (S.started) { renderDashboard(); show('dashboard'); } else show('home');
    const messages = [];
    // Tải lại trang giữa chừng được tính như thoát: engine áp đúng luật thoát của v12
    const left = takeLeftoverRun();
    if (left) {
      const { name, extra } = left;
      messages.push(`Lần trước bạn rời ${name} khi chưa làm xong. Lượt đó không được lưu, hãy vào lại để làm từ đầu.${extra ? ' ' + extra : ''}`);
      if (S.started) renderDashboard();
    }
    if (problem === 'corrupt') {
      messages.push('Dữ liệu tiến trình lưu trên trình duyệt bị lỗi hoặc không còn. Hệ thống đã khởi tạo tiến trình rỗng, hãy bắt đầu lại.');
    }
    if (messages.length) notice(problem === 'corrupt' ? 'Không đọc được tiến trình' : 'Lượt làm dở đã bị huỷ', messages.join('\n\n'));
  });
}


/* ---------- 15. Chế độ demo ?demo=1 (SOLUTION_STRUCTURE Mục 15.6) ---------- */
// Dữ liệu 4 kịch bản: window.CFA_SCENARIOS (cfa_quest_scenarios.js, sinh từ W6/demo-input.md).
// - Header hiện ô chọn kịch bản và nút "Chạy kịch bản". Link thường không hiện gì.
// - Chọn kịch bản = bắt đầu lượt demo mới với Credit theo kịch bản. Vào Arena 1 rồi thì ô chọn khoá.
// - Câu của mọi màn cố định theo kịch bản: con quái chết thứ n nhận câu thứ n. Đáp án kịch bản
//   chọn sẵn và khoá; thời gian ghi vào dữ liệu lấy từ kịch bản.
// - Lượt demo lưu ở khoá riêng (…_demo), không ghi đè tiến trình chơi thường.
const DEMO = { active: false, scenario: null, lockChoice: false, key: 'cfaQuestDemoScenario', lastCheck: null };

function demoInit() {
  DEMO.active = new URLSearchParams(location.search).get('demo') === '1';
  if (!DEMO.active) return;
  CONFIG.storageKey += '_demo';
  CONFIG.inProgressKey += '_demo';
  CONFIG.runCounterKey += '_demo';
  document.body.classList.add('demo-mode');
  const list = window.CFA_SCENARIOS || [];
  const sel = $('demoSelect');
  sel.innerHTML = '<option value="">— Chọn kịch bản —</option>' + list.map(sc => `<option value="${esc(sc.id)}">${esc(sc.name)}</option>`).join('');
  DEMO.scenario = list.find(sc => sc.id === store.get(DEMO.key)) || null;
  sel.value = DEMO.scenario ? DEMO.scenario.id : '';
  $('demoBar').classList.remove('hidden');
  $('playDemoRun').classList.remove('hidden');
  sel.addEventListener('change', () => demoChoose(sel.value));
  $('demoRun').addEventListener('click', demoRunRest);
}

// Ô chọn chỉ mở khi lượt demo chưa vào Arena 1; nút chạy chỉ sáng khi đang ở màn có dữ liệu kịch bản
function demoSyncBar() {
  if (!DEMO.active) return;
  const started = !!RUN || (S.started && (S.attempts.arena1.length > 0 || S.stage > 0));
  $('demoSelect').disabled = started;
  $('demoSelect').title = started ? 'Đã vào Arena 1: muốn đổi kịch bản thì bấm Reset hoặc tạo lượt chơi mới.' : '';
  $('demoRun').disabled = !(RUN && demoSteps(RUN.arena.id, RUN.attempt));
  $('playDemoRun').disabled = $('demoRun').disabled;
}

function demoChoose(id) {
  const sc = (window.CFA_SCENARIOS || []).find(x => x.id === id) || null;
  DEMO.scenario = sc;
  if (sc) store.set(DEMO.key, sc.id); else store.del(DEMO.key);
  if (sc) demoStartRun(true);
}

// Bắt đầu lượt demo mới theo kịch bản đang chọn
function demoStartRun(fresh = false) {
  if (!BANK_OK) { notice('Chưa có ngân hàng câu hỏi', 'Hãy nạp ethics_bank_220.json hợp lệ trước khi bắt đầu.'); return; }
  if (!DEMO.scenario) {
    // Thanh trên cùng (có ô chọn kịch bản) chỉ hiện ở bảng tiến trình: đưa người demo tới đó để chọn
    renderDashboard();
    show('dashboard');
    $('demoSelect').focus();
    toast('Chế độ demo: chọn một kịch bản ở ô "Kịch bản" trên thanh trên cùng.', 4500);
    return;
  }
  if (S.started && !fresh) { renderDashboard(); show('dashboard'); return; }
  if (RUN) { stopTimer(); GAME.stop(); hideQuestion(); }
  wipeAll();
  newRun();
  S.credits = DEMO.scenario.startCredits;
  saveState();
  renderDashboard();
  show('dashboard');
  toast(`${DEMO.scenario.name}: ví ${S.credits} Credit. ${DEMO.scenario.proves}.`, 4500);
}

// Dữ liệu kịch bản của một màn. Chỉ dùng cho lần chơi đầu (Quest: lần đầu); chơi lại thì bốc đề thường.
function demoSteps(roundId, attempt) {
  if (!DEMO.active || !DEMO.scenario) return null;
  const list = DEMO.scenario.rounds[roundId];
  if (!list || attempt !== 1) return null;
  return list;
}

function demoPrepare(roundId) {
  const isQuest = roundId === 'quest';
  const attempt = isQuest ? S.questRuns.length + 1 : S.attempts[roundId].length + 1;
  const steps = demoSteps(roundId, attempt);
  if (!steps) {
    toast('Kịch bản không có dữ liệu cho lượt này: bốc đề như bản thường.', 3500);
    return isQuest ? prepareQuest() : prepareArena();
  }
  // Sổ Credit của kịch bản: mua Bùa trước màn đã ghi (Kịch bản 4 mua 1 Bùa trước Arena 3)
  const buy = DEMO.scenario.buy;
  if (buy && buy.before === roundId && S.inventory[buy.item] < buy.n) {
    let n = 0;
    while (S.inventory[buy.item] < buy.n && buyItem(buy.item)) n++;
    if (n) toast(`Kịch bản: đã mua ${n} ${ITEMS[buy.item].name} (−${n * ITEMS[buy.item].cost} Credit).`, 4000);
    updateHUD();
  }
  return prepareFixed(steps.map(x => x.id), isQuest);
}

function demoStep(roundId, attempt, qi) {
  const steps = demoSteps(roundId, attempt);
  return steps ? steps[qi] : null;
}

// Câu vừa hiện: dùng Bùa nếu kịch bản ghi, chọn sẵn đáp án của kịch bản và khoá
function demoPrefill(q) {
  DEMO.lockChoice = false;
  $('qDemo').classList.add('hidden');
  if (!RUN) return;
  const st = demoStep(RUN.arena.id, RUN.attempt, RUN.qi);
  if (!st || st.id !== q.id) return;
  if (st.item && !RUN.itemOnQuestion) useItem(st.item);
  selectOption(st.choice);
  DEMO.lockChoice = true;
  [...$('qOptions').children].forEach((b, k) => { if (k !== st.choice) b.disabled = true; });
  // Câu nào dùng Bùa do kịch bản quyết định: khoá nút Bùa để người present không bấm nhầm
  $('itemBox').querySelectorAll('button[data-item]').forEach(b => { b.disabled = true; b.title = 'Chế độ demo: kịch bản quyết định câu dùng Bùa'; });
  $('qDemo').textContent = `Kịch bản: chọn sẵn ${'ABC'[st.choice]}${st.item ? ', đã dùng Bùa' : ''} · thời gian ghi nhận ${(st.timeMs / 1000).toLocaleString('vi-VN')} giây`;
  $('qDemo').classList.remove('hidden');
}

// Thời gian ghi vào dữ liệu: lấy từ kịch bản, kể cả câu người demo chơi tay (Mục 15.6)
function demoTimeMs(roundId, qi, measured) {
  if (!RUN) return measured;
  const st = demoStep(roundId, RUN.attempt, qi);
  return st ? st.timeMs : measured;
}

// Nút "Chạy kịch bản": áp đáp án kịch bản cho các câu còn lại của màn đang chơi, kết thúc màn
function demoRunRest() {
  if (!RUN) { toast('Vào một màn rồi bấm Chạy kịch bản.'); return; }
  const steps = demoSteps(RUN.arena.id, RUN.attempt);
  if (!steps) { toast('Màn này không có dữ liệu kịch bản.'); return; }
  stopTimer();
  // Câu đang hiện (nếu có) chốt bằng đáp án kịch bản
  if (quizOpen() && !RUN.locked) {
    const st = steps[RUN.qi];
    RUN.selected = st.choice;
    recordAnswer(st.choice, st.timeMs);
    hideQuestion();
    if (advanceQuestion()) { GAME.answered(true); finishArena(); return; }
  }
  while (RUN && RUN.qi < RUN.qs.length) {
    const st = steps[RUN.qi];
    beginQuestion();
    if (st.item) applyItem(st.item);
    recordAnswer(st.choice, st.timeMs);
    if (advanceQuestion()) break;
  }
  finishArena();
}

// Sau mỗi màn có dữ liệu kịch bản: so với kết quả mong đợi, lệch thì cảnh báo (Mục 15.6)
function demoCheckExpected(L) {
  DEMO.lastCheck = null;
  if (!DEMO.active || !DEMO.scenario) return;
  const id = L.arena.isQuest ? 'quest' : L.arena.id;
  if (L.attempt !== 1) return;
  const exp = DEMO.scenario.expected[id];
  if (!exp || !DEMO.scenario.rounds[id]) return;
  const diff = [];
  const chk = (label, got, want) => { if (want !== undefined && got !== want) diff.push(`${label}: engine ${got}, kịch bản ${want}`); };
  chk('Số câu đúng', L.correct, exp.correct);
  chk('Đỗ', L.passed, exp.passed);
  chk('Credit thưởng', L.credit, exp.credit);
  chk('Ví sau màn', S.credits, exp.credits);
  chk('W1', S.w1, id === 'arena1' ? exp.w1 : undefined);
  chk('W2', S.w2, id === 'crossroads' ? exp.w2 : undefined);
  if (exp.bossPlan) chk('Kế hoạch Boss', (S.bossPlan || []).map(p => `${p.cluster}:${p.count}`).join(','), exp.bossPlan);
  if (exp.points) {
    const p = S.performance_by_arena[id];
    chk('Điểm độ khó', p ? `${p.points_earned}/${p.points_offered}` : '--', exp.points.join('/'));
  }
  DEMO.lastCheck = { L, diff, name: DEMO.scenario.name };
  if (diff.length) notice('Kết quả lệch kịch bản', diff.join('\n'));
}

// Ô đối chiếu ở đầu màn kết quả (giữ trên màn hình, không bị toast khác đè)
function demoResultBox(L) {
  const c = DEMO.lastCheck;
  if (!c || c.L !== L) return '';
  return c.diff.length
    ? `<div class="warn-box"><b>${esc(c.name)}</b>: lệch kết quả mong đợi — ${esc(c.diff.join('; '))}.</div>`
    : `<div class="demo-ok"><b>${esc(c.name)}</b>: khớp kết quả mong đợi ở W6/demo-input.md (số câu đúng, đỗ/trượt, Credit, ví sau màn${L.arena.id === 'arena1' ? ', W1' : L.arena.id === 'crossroads' ? ', W2' : L.arena.id === 'trap2' ? ', kế hoạch Boss' : ''}${L.arena.isQuest ? '' : ', điểm độ khó'}).</div>`;
}

// Hộp đối chiếu ở đầu bảng tổng kết khi đang chạy kịch bản có bảng tổng kết
function demoReportCheck(earned, offered) {
  if (!DEMO.active || !DEMO.scenario || !DEMO.scenario.expected.report) return '';
  const r = DEMO.scenario.expected.report;
  const perf = offered ? Math.round(earned / offered * 100) : 0;
  const rows = [[`Performance score`, `${perf}%`, `${r.performance}%`]]
    .concat(Object.entries(r.o4).map(([c, want]) => [`O4 ${c}`, conclude(c).text, want]));
  const bad = rows.filter(x => x[1] !== x[2]).length;
  return `<div class="${bad ? 'warn-box' : 'demo-ok'}"><b>${esc(DEMO.scenario.name)}</b>: ${bad ? `${bad} chỉ tiêu lệch kết quả mong đợi` : 'khớp toàn bộ kết quả mong đợi ở W6/demo-input.md'}.
    <table class="diag demo-check"><thead><tr><th>Chỉ tiêu</th><th>Engine</th><th>Kịch bản</th></tr></thead><tbody>${rows.map(x => `<tr${x[1] !== x[2] ? ' class="hl"' : ''}><th scope="row">${esc(x[0])}</th><td>${esc(x[1])}</td><td>${esc(x[2])}</td></tr>`).join('')}</tbody></table></div>`;
}

/* ---------- 16. Thiết bị (Mục 15.7) ---------- */
function deviceBlocked() {
  if (!GAME.touchOnly()) return false;
  $('deviceBlock').classList.remove('hidden');
  return true;
}

// Công cụ cho nhóm khi demo/kiểm thử (gõ trong Console): CFAQ.state, CFAQ.ranking(), CFAQ.setSeed(7)
window.CFAQ = {
  game: GAME,
  get state() { return S; },
  get current() { return RUN ? RUN.qs[RUN.qi] : null; },
  ranking: () => rankClusters(diagnosticRecords()),
  setSeed: n => { setSeed(n); return `Đã cố định seed = ${n}`; },
  config: CONFIG
};

init();
