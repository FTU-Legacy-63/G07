'use strict';
/* =============================================================================
   CFA Quest — Ethics · lớp hướng dẫn (tutorial), đi kèm demo v12

   Đặc tả: tài liệu "Tutorial — CFA Quest · Ethics (bản khớp code v12)", 17/10/2026.
   File này nạp TRƯỚC cfa_quest_v11.js. Nó chỉ dùng các hàm/biến của file chính
   (CONFIG, S, RUN, store, $, esc, needToPass, ...) lúc chạy, không lúc nạp.

   Không có NPC. Luật được dạy bằng:
   - thẻ giữa màn hình (thẻ mở đầu, thẻ trước round)
   - coach mark: khung sáng quanh một phần màn hình + thẻ nhỏ cạnh đó
   - toast không chặn trong màn câu hỏi

   Quy tắc:
   - Mỗi thẻ hiện một lần. Cờ đã xem lưu ở key riêng cfaQuestTutorialSeen,
     không gộp vào cfaQuestV12, nên Reset lượt chơi không làm hiện lại hướng dẫn.
   - Thẻ trước round hiện TRƯỚC khi sinh đề: đồng hồ chưa chạy.
   - Trong màn câu hỏi chỉ dùng toast.
   - Thẻ không mở chồng lên hộp notice()/ask() đang mở; chờ hộp đó đóng.
   - Số liệu trên thẻ đọc từ CONFIG, không gõ tay.

   Muốn sửa chữ trên thẻ: sửa trong CARDS bên dưới, giữ nguyên ID.

   Thêm 21/10/2026 cho lớp game hành động (SOLUTION_STRUCTURE Mục 15): thẻ game_move (trước
   Arena 1), boss_dodge và boss_white (trước Boss), toast game_coin (lần đầu rơi xu).
   Số liệu đọc từ GAME_CONFIG và CONFIG, không gõ tay.
   ============================================================================= */

const TUT = (() => {
  const KEY = 'cfaQuestTutorialSeen';

  /* ---------- 1. Lưu cờ đã xem ---------- */
  let cache = null;
  function seenMap() {
    if (cache) return cache;
    let o = {};
    try { o = JSON.parse(store.get(KEY) || '{}'); } catch { o = {}; }
    cache = o && typeof o === 'object' && !Array.isArray(o) ? o : {};
    return cache;
  }
  function isSeen(id) { return !!seenMap()[id]; }
  function markSeen(...ids) {
    const m = seenMap();
    ids.forEach(id => { m[id] = true; });
    store.set(KEY, JSON.stringify(m));   // không ghi được thì vẫn chơi bình thường
  }
  function resetSeen() {
    cache = {};
    store.del(KEY);
  }

  /* ---------- 2. Hàm phụ cho nội dung thẻ ---------- */
  const arenaOf = id => ARENAS[ARENA_INDEX[id]];
  const sizeOf = id => (id === 'quest' ? QUEST.size : arenaOf(id).size);
  const needLine = id => `${needToPass(sizeOf(id), id)}/${sizeOf(id)} (${passPercentFor(id)}%)`;
  const cl = c => (c && CLUSTER_INFO[c] ? `<b>${esc(c)} · ${esc(CLUSTER_INFO[c].name)}</b>` : '');
  const bossCost = () => CONFIG.bossUnlockCost;
  const itemCost = () => ITEMS.eliminate.cost;
  const tiers = list => list.map(t => `từ ${t.minPercent}% được +${t.credit}`).reverse().join(', ');
  // Bảng thưởng Quest theo số câu: "dưới 9/15 được 0; 9–11 được +2; ..."
  function questTierLine() {
    const n = QUEST.size;
    const rows = [];
    let from = 0, cur = questCredit(0, n);
    for (let c = 1; c <= n + 1; c++) {
      const v = c <= n ? questCredit(c, n) : null;
      if (v !== cur) {
        const range = from === 0 ? `dưới ${c}/${n}` : (from === c - 1 ? `${from}` : `${from}–${c - 1}`);
        rows.push(`${range} được ${cur ? '+' + cur : '0'}`);
        from = c; cur = v;
      }
    }
    return rows.join('; ');
  }
  function timerLine() {
    const t = CONFIG.timeLimitSec;
    return `${NAME('crossroads')} ${t.crossroads} giây, ${NAME('trap2')} ${t.trap2} giây, Boss ${t.boss} giây`;
  }
  const step = () => CONFIG.penaltyStepSec;

  /* ---------- 3. Nội dung thẻ (ID khớp bảng ở Mục 2 của tài liệu) ---------- */
  // target: phần màn hình mà coach mark chỉ vào (selector). Không có target thì thẻ ở giữa màn hình.
  const CARDS = {
    intro_1: {
      title: 'Mục tiêu',
      body: () => `<p>Vượt ${NAME('arena1').replace(' · The Gate', '')}–4 và Boss, rồi mở Bảng tổng kết để xem cụm nào đã cải thiện, cụm nào chưa.</p>`
    },
    intro_2: {
      title: 'Game chọn bài luyện cho bạn',
      body: () => '<p>Bạn không tự chọn bài luyện. Sau mỗi Arena, game tìm cụm bạn có tỷ lệ đúng thấp nhất và ra đề Arena sau từ cụm đó.</p>'
    },
    intro_3: {
      title: 'Credit',
      body: () => `<p>Bạn có ${CONFIG.startCredits} Credit khởi đầu. Credit dùng để mua Bùa và mở Boss. Credit không bao giờ xuống dưới 0.</p>`
    },

    game_move: {
      title: 'Đánh quái để mở câu hỏi',
      body: () => `<p><span class="tut-keys"><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd></span> để di chuyển. Quái tự đuổi theo bạn; vào tầm thì nhân vật tự chém và câu hỏi hiện ra.</p>
        <p>Khi câu hỏi hiện, cả khung cảnh đứng yên. Trả lời xong, quái biến mất và trận đánh chạy tiếp. Quái biến mất giống nhau dù bạn trả lời đúng hay sai.</p>
        <p>Số quái bằng số câu của màn. Đánh hết quái là làm xong màn; Credit thưởng rơi ra thành đồng xu.</p>`
    },
    boss_dodge: {
      title: 'Né đạn Boss',
      body: () => `<p>Boss đứng yên và bắn đạn thành ${GAME_CONFIG.boss.pattern.rays} cánh xoắn. Trước mỗi đợt bắn, Boss sáng lên và hiện ${GAME_CONFIG.boss.pattern.rays} vạch mờ; <b>vạch đầu tiên chĩa vào bạn</b>.</p>
        <p>Thấy vạch chĩa vào mình thì bước sang khe giữa hai vạch rồi mới tiến vào. Vào tầm là tự chém, mỗi lần chém mở 1 câu. Trả lời xong, Boss hất bạn ra xa rồi báo hiệu đợt bắn mới.</p>
        <p>Thanh máu Boss có ${sizeOf('boss')} nấc, giảm 1 nấc mỗi lần chém, dù bạn trả lời đúng hay sai.</p>`
    },
    boss_white: {
      title: '2 tim và lượt trắng',
      body: () => `<p>Mỗi lượt Boss bạn có ${GAME_CONFIG.boss.hearts} tim. Trúng đạn mất 1 tim. Mất hết tim là <b>lượt trắng</b>: câu trả lời của lượt đó không được tính, Boss vẫn mở, không mất Credit mở khoá. Bùa đã dùng không được hoàn, phạt quá giờ vẫn trừ.</p>
        <p>Mỗi lần mở Boss có ${CONFIG.bossWhiteRuns} lượt trắng. <b>Mất hết tim lần thứ ${CONFIG.bossWhiteRuns + 1} tính là thoát Boss</b>: mất ${bossCost()} Credit và Boss khoá lại.</p>`
    },

    pre_arena1: {
      title: 'Arena 1',
      body: () => `<p>${sizeOf('arena1')} câu, mỗi cụm 3 câu. Đỗ cần <b>${needLine('arena1')}</b>. Không dùng Bùa, không có đồng hồ.</p>
        <p>Ở mọi Arena, game chỉ báo đúng/sai sau khi bạn làm xong cả round. Trượt thì chơi lại bằng đề mới.</p>`
    },
    res_arena1_bang: {
      title: 'Bảng chẩn đoán',
      target: '#diagTable',
      body: () => `<p>Bảng này là tỷ lệ đúng của 5 cụm. Khi bạn đỗ Arena 1, cụm có tỷ lệ đúng thấp nhất trở thành <b>cụm yếu nhất (W1)</b> và ${NAME('trap1')} lấy câu từ cụm đó.</p>
        <p>Nếu nhiều cụm bằng nhau, game phân định theo luật cố định; lý do ghi ở mục "Arena kế tiếp" khi bạn đỗ.</p>`
    },
    res_arena1_credit: {
      title: 'Credit sau mỗi Arena',
      target: '#creditLine',
      body: () => `<p>Đỗ được thưởng theo tỷ lệ đúng: ${tiers(CONFIG.creditTiers)}. Trượt thì không có thưởng.</p>
        <p>Chơi lại bao nhiêu lần, bảng chẩn đoán vẫn tính lần làm đầu tiên của Arena 1–4.</p>`
    },

    shop_a: {
      title: 'Bùa Loại Trừ',
      target: '#shopGrid .shop-item',
      body: () => `<p>Giá ${itemCost()} Credit: loại 1 phương án sai của câu đang làm, còn 2 phương án.</p>
        <p>Mỗi Arena dùng tối đa 1 Bùa, kể cả Boss. Không dùng ở Arena 1 và World Quest.</p>`
    },
    shop_b: {
      title: 'Bùa và dữ liệu chẩn đoán',
      target: '.shop-note',
      body: () => `<p>Câu dùng Bùa vẫn tính để xét đỗ nhưng không vào bảng chẩn đoán.</p>
        <p>Credit mua Bùa cũng là Credit để mở Boss (${bossCost()} Credit), nên mua Bùa thì xa mốc này hơn.</p>`
    },

    pre_arena2: {
      title: () => NAME('trap1'),
      body: () => `<p>${sizeOf('trap1')} câu của <b>cụm yếu nhất (W1)</b>: ${cl(S.w1)}. Đỗ cần <b>${needLine('trap1')}</b>. Không có đồng hồ.</p>
        <p>Từ Arena này bạn được dùng 1 Bùa mỗi round; Bùa mua ở Shop.</p>`
    },

    pre_arena3_a: {
      title: () => NAME('crossroads'),
      body: () => `<p>${sizeOf('crossroads')} câu, mỗi cụm 2 câu. Đỗ cần <b>${needLine('crossroads')}</b>.</p>
        <p>Sau ${NAME('crossroads')}, game tìm <b>cụm yếu thứ hai (W2)</b>, khác cụm yếu nhất.</p>`
    },
    pre_arena3_b: {
      title: 'Đồng hồ và phạt quá giờ',
      demo: true,
      body: () => `<p>Từ ${NAME('crossroads')}, mỗi câu có đồng hồ: ${timerLine()}. Hết giờ, câu không tự nộp mà đồng hồ chuyển sang đếm quá giờ.</p>
        <p>Mỗi ${step()} giây quá giờ trừ 1 Credit: 1–${step()} giây trừ 1, ${step() + 1}–${2 * step()} giây trừ 2. Bấm Xác nhận khi đồng hồ còn 0 giây thì chưa bị phạt.</p>
        <p>Tiền phạt trừ khi làm xong round, kể cả khi trượt.</p>
        <div class="tut-demo" aria-hidden="true">
          <div class="tut-demo-head"><span>Ví dụ, không tính điểm</span><span class="q-timer" data-tut-demo-timer></span></div>
          <p class="tut-demo-stem">Câu ví dụ: đồng hồ chạy nhanh để bạn xem lúc hết giờ.</p>
        </div>`
    },
    pre_arena3_c: {
      title: 'Thoát giữa chừng',
      body: () => `<p>Thoát hoặc tải lại trang giữa ${NAME('crossroads')}, ${NAME('trap2')}: lượt bị huỷ, Bùa được hoàn, nhưng tiền phạt quá giờ của các câu đã xác nhận vẫn bị trừ.</p>`
    },

    pre_arena4: {
      title: () => NAME('trap2'),
      body: () => `<p>${sizeOf('trap2')} câu của <b>cụm yếu thứ hai (W2)</b>: ${cl(S.w2)}. Đỗ cần <b>${needLine('trap2')}</b>.</p>
        <p>Đồng hồ ${CONFIG.timeLimitSec.trap2} giây/câu, phạt quá giờ như ${NAME('crossroads')}.</p>`
    },

    res_arena4_du: {
      title: 'Đủ Credit mở Boss',
      target: '#resultActions',
      body: () => `<p>Bạn có <b>${S.credits} Credit</b>, đủ để mở Boss (${bossCost()} Credit, trả một lần).</p>
        <p>World Quest là tuỳ chọn, bạn có thể bỏ qua.</p>`
    },
    res_arena4_thieu: {
      title: 'Chưa đủ Credit mở Boss',
      target: '#resultActions',
      body: () => `<p>Mở Boss cần ${bossCost()} Credit. Bạn đang có <b>${S.credits}</b>, còn thiếu <b>${Math.max(0, bossCost() - S.credits)}</b>.</p>
        <p>Chơi World Quest để kiếm thêm; sau mỗi lần chơi, game xét lại số Credit của bạn.</p>
        <ol class="tut-flow">
          <li>Đỗ ${esc(NAME('trap2'))}</li>
          <li>Có từ ${bossCost()} Credit?</li>
          <li><span class="ok">Đủ:</span> trả ${bossCost()} Credit, vào Boss</li>
          <li><span class="lack">Thiếu:</span> World Quest → cộng Credit → xét lại</li>
        </ol>`
    },

    pre_quest_a: {
      title: 'World Quest',
      body: () => `<p>${QUEST.size} câu, mỗi cụm ${CONFIG.questPerCluster} câu, lấy từ 3 cụm yếu nhất: ${(S.bossPlan || []).map(p => cl(p.cluster)).join(', ')}.</p>
        <p>Không đồng hồ, không đỗ/trượt, không dùng Bùa. Chơi bao nhiêu lần cũng được. Quest ưu tiên câu bạn đã gặp; câu đã ra ở Quest sẽ không ra lại ở Boss.</p>`
    },
    pre_quest_b: {
      title: 'Thưởng World Quest',
      body: () => `<p>Thưởng Credit: ${questTierLine()}.</p>
        <p>Thoát hoặc tải lại trang giữa Quest thì không nhận Credit. Quest không làm đổi bảng chẩn đoán và bảng tổng kết.</p>`
    },

    pre_boss_a: {
      title: 'Boss',
      body: () => `<p>${sizeOf('boss')} câu từ 3 cụm yếu nhất, chia ${BOSS_SPLIT.join('/')}, trong đó ${BOSS_MIX.reduce((s, m) => s + m[3], 0)} câu khó. Đỗ cần <b>${needLine('boss')}</b>.</p>
        <p>Đồng hồ ${CONFIG.timeLimitSec.boss} giây/câu, phạt quá giờ như ${NAME('crossroads')} và ${NAME('trap2')}.</p>`
    },
    pre_boss_b: {
      title: 'Luật riêng của Boss',
      body: () => `<p>Được dùng tối đa 1 Bùa. Đỗ Boss lần đầu được thêm ${CONFIG.bossFirstClearBonus} Credit. Trượt thì Boss vẫn mở, chơi lại bằng đề mới, không trả thêm.</p>
        <p><b>Thoát, tải lại trang hoặc đóng tab giữa Boss: mất ${bossCost()} Credit đã trả và Boss khoá lại.</b></p>`
    },

    report_a: {
      title: 'Đọc Bảng tổng kết',
      target: '#reportClusterTable',
      body: () => `<p>Cột Kết luận so tỷ lệ đúng của mỗi cụm ở Boss với <b>mốc chẩn đoán</b>. Mốc chẩn đoán = Arena 1 + ${NAME('crossroads')}, lần làm đầu tiên. Cột Boss lấy lượt bạn đỗ Boss.</p>
        <p>Câu dùng Bùa và câu lấy lại (câu đã gặp, game ra lại vì hết câu mới) không được tính.</p>`
    },
    report_b: {
      title: 'Năm nhãn kết luận',
      target: '#reportClusterTable',
      body: () => `<p>Kết luận dùng mốc ${CONFIG.diagnosticPassPercent}%, khác ngưỡng ${passPercentFor('boss')}% để đỗ Boss.</p>
        <ul class="tut-list">
          <li><b>Đã cải thiện</b>: Boss từ ${CONFIG.diagnosticPassPercent}% và không thấp hơn mốc.</li>
          <li><b>Đã cải thiện nhưng chưa đủ</b>: Boss dưới ${CONFIG.diagnosticPassPercent}% nhưng cao hơn mốc.</li>
          <li><b>Cần cải thiện tiếp</b>: các trường hợp còn lại.</li>
          <li><b>Chưa đủ câu mới ở Boss để kết luận</b>: mọi câu Boss của cụm đều là câu lấy lại hoặc câu dùng Bùa.</li>
          <li><b>Không kiểm tra lại ở Boss</b>: cụm không vào Boss; nghĩa là thiếu dữ liệu, không có nghĩa cụm đã ổn.</li>
        </ul>`
    }
  };

  // Toast trong màn câu hỏi (không chặn)
  const TOASTS = {
    quiz_bua: () => 'Bấm Bùa ở cột bên phải để loại 1 phương án sai của câu này.',
    quiz_quagio: penalty => `Câu này đang quá giờ, hiện bị tính −${penalty} Credit. Tiền phạt trừ khi bạn làm xong round.`,
    game_coin: n => `Đã cộng ${n} Credit vào ví. Đồng xu chỉ là hình ảnh: chạy tới nhặt hoặc chờ vài giây xu tự bay về.`
  };

  // Thẻ trước round, theo mã nội bộ của round
  const BEFORE = {
    arena1: ['game_move', 'pre_arena1'],
    trap1: ['pre_arena2'],
    crossroads: ['pre_arena3_a', 'pre_arena3_b', 'pre_arena3_c'],
    trap2: ['pre_arena4'],
    boss: ['pre_boss_a', 'pre_boss_b', 'boss_dodge', 'boss_white'],
    quest: ['game_move', 'pre_quest_a', 'pre_quest_b']
  };
  const GO_LABEL = { quest: 'Vào Quest', boss: 'Vào Boss' };

  /* ---------- 4. Hiển thị ---------- */
  let open = false;              // đang có thẻ trên màn hình
  let chain = Promise.resolve(); // hàng đợi: thẻ sau chờ thẻ trước đóng
  let demoTimer = null;
  let reposition = null;

  const layer = () => $('tutLayer');
  const noticeOpen = () => !$('noticeOverlay').classList.contains('hidden');
  const narrow = () => window.innerWidth < 600;

  function waitNoticeClosed() {
    if (!noticeOpen()) return Promise.resolve();
    return new Promise(resolve => {
      const t = setInterval(() => { if (!noticeOpen()) { clearInterval(t); resolve(); } }, 150);
    });
  }

  function enqueue(fn) {
    const run = chain.then(waitNoticeClosed).then(fn);
    chain = run.catch(err => { console.error('[CFA Quest tutorial]', err); });
    return run;
  }

  function stopDemo() {
    if (demoTimer) { clearInterval(demoTimer); demoTimer = null; }
  }
  // Đồng hồ demo tua nhanh: Còn 3 giây → 0 → quá giờ, mỗi nhịp 0,5 giây. Không chạm S, RUN, bank.
  function startDemo(root) {
    stopDemo();
    const el = root.querySelector('[data-tut-demo-timer]');
    if (!el) return;
    const limit = 3;
    const last = 2 * step() + 2;   // chạy tới khi thấy mức phạt thứ 3
    let t = 0;
    const paint = () => {
      const left = limit - t;
      if (left >= 0) {
        el.textContent = `Còn ${left} giây`;
        el.className = 'q-timer' + (left <= 1 ? ' warn' : '');
      } else {
        el.textContent = `Quá giờ ${-left} giây · −${penaltyFor(-left)} Credit`;
        el.className = 'q-timer over';
      }
    };
    paint();
    demoTimer = setInterval(() => {
      t = t >= limit + last ? 0 : t + (t < limit + 1 ? 1 : 3);
      paint();
    }, 600);
  }

  function clearLayer() {
    stopDemo();
    if (reposition) {
      window.removeEventListener('resize', reposition);
      window.removeEventListener('scroll', reposition, true);
      reposition = null;
    }
    const L = layer();
    L.innerHTML = '';
    L.classList.add('hidden');
    document.body.classList.remove('tut-open');
    open = false;
  }

  // Đặt thẻ coach mark cạnh phần được chỉ vào; màn hẹp thì thành thẻ ở cuối màn hình.
  function place(card, spot, target) {
    const r = target.getBoundingClientRect();
    const pad = 6;
    // Không cho khung sáng trùm lên thanh HUD dính ở đầu trang
    const bar = document.querySelector('.topbar');
    const minTop = bar ? bar.getBoundingClientRect().bottom + 4 : 0;
    const spotTop = Math.max(r.top - pad, minTop);
    const spotBottom = Math.max(r.bottom + pad, spotTop);
    Object.assign(spot.style, {
      top: spotTop + 'px', left: (r.left - pad) + 'px',
      width: (r.width + 2 * pad) + 'px', height: (spotBottom - spotTop) + 'px'
    });
    if (narrow()) { card.classList.add('sheet'); card.style.top = card.style.left = ''; return; }
    card.classList.remove('sheet');
    const w = card.offsetWidth, h = card.offsetHeight, gap = 14, vw = window.innerWidth, vh = window.innerHeight;
    let top;
    if (r.bottom + gap + h <= vh - 12) top = r.bottom + gap;
    else if (r.top - gap - h >= 12) top = r.top - gap - h;
    else { card.classList.add('sheet'); card.style.top = card.style.left = ''; return; }
    card.style.top = top + 'px';
    card.style.left = Math.min(Math.max(12, r.left), vw - w - 12) + 'px';
  }

  /**
   * Hiện một dãy thẻ. Trả về Promise với 'done' (bấm nút cuối), 'later' (bấm Để sau / Esc),
   * 'skip' (bấm Bỏ qua) hoặc 'extra' (bấm nút phụ).
   * opts: { finalLabel, laterLabel, skipLabel, extra: { label, action } }
   */
  function showSequence(ids, opts = {}) {
    const list = ids.filter(id => CARDS[id] && !isSeen(id));
    if (!list.length) return Promise.resolve('done');
    return enqueue(() => new Promise(resolve => {
      let i = 0;
      const finish = result => { clearLayer(); resolve(result); };

      const render = () => {
        stopDemo();
        const id = list[i];
        const card = CARDS[id];
        const target = card.target ? document.querySelector(card.target) : null;
        const isLast = i === list.length - 1;
        const coach = !!target;
        const L = layer();
        L.classList.remove('hidden');
        document.body.classList.add('tut-open');
        open = true;

        const secondary = opts.skipLabel && !isLast ? opts.skipLabel : opts.laterLabel;
        L.innerHTML = `
          <div class="tut-backdrop${coach ? ' clear' : ''}"></div>
          ${coach ? '<div class="tut-spot"></div>' : ''}
          <div class="panel tut-card${coach ? ' coach' : ''}" role="dialog" aria-modal="true" aria-labelledby="tutTitle">
            <div class="eyebrow">Hướng dẫn${list.length > 1 ? ` · ${i + 1}/${list.length}` : ''}</div>
            <h3 id="tutTitle">${esc(typeof card.title === 'function' ? card.title() : card.title)}</h3>
            <div class="tut-body">${card.body()}</div>
            <div class="tut-actions">
              ${secondary ? `<button type="button" class="secondary-btn" data-tut="later">${esc(secondary)}</button>` : ''}
              ${isLast && opts.extra ? `<button type="button" class="secondary-btn" data-tut="extra">${esc(opts.extra.label)}</button>` : ''}
              <button type="button" class="primary-btn" data-tut="next">${esc(isLast ? (opts.finalLabel || 'Đã hiểu') : 'Tiếp')}</button>
            </div>
          </div>`;

        const cardEl = L.querySelector('.tut-card');
        if (coach) {
          // Đưa phần được chỉ vào lên sát dưới thanh HUD, chừa chỗ cho thẻ ở bên dưới
          target.scrollIntoView({ block: 'start', inline: 'nearest' });
          const bar = document.querySelector('.topbar');
          window.scrollBy(0, -((bar ? bar.offsetHeight : 0) + 24));
          const spot = L.querySelector('.tut-spot');
          reposition = () => place(cardEl, spot, target);
          reposition();
          window.addEventListener('resize', reposition);
          window.addEventListener('scroll', reposition, true);
        }
        if (card.demo) startDemo(cardEl);

        L.querySelector('[data-tut="next"]').addEventListener('click', () => {
          markSeen(id);
          if (isLast) finish('done');
          else { i++; render(); }
        });
        const later = L.querySelector('[data-tut="later"]');
        if (later) later.addEventListener('click', () => {
          if (opts.skipLabel && !isLast) { markSeen(...list); finish('skip'); }
          else finish('later');
        });
        const extra = L.querySelector('[data-tut="extra"]');
        if (extra) extra.addEventListener('click', () => { markSeen(...list); finish('extra'); opts.extra.action(); });
        L.querySelector('[data-tut="next"]').focus();
      };

      // Esc = nút phụ (Để sau / Bỏ qua); không có nút phụ thì như bấm nút chính
      const onKey = e => {
        if (!open || e.key !== 'Escape') return;
        e.preventDefault();
        const b = layer().querySelector('[data-tut="later"]') || layer().querySelector('[data-tut="next"]');
        if (b) b.click();
      };
      document.addEventListener('keydown', onKey);
      const done = resolve;
      resolve = r => { document.removeEventListener('keydown', onKey); done(r); };
      render();
    }));
  }

  // Toast một lần
  function toastOnce(id, ...args) {
    if (isSeen(id)) return;
    markSeen(id);
    toast(TOASTS[id](...args), 5000);
  }

  /* ---------- 5. Điểm gọi từ file chính ---------- */

  // Sau khi bấm Bắt đầu (startRun)
  function onStartRun() {
    showSequence(['intro_1', 'intro_2', 'intro_3'], { finalLabel: 'Bắt đầu', skipLabel: 'Bỏ qua' });
  }

  // Đầu startArena()/startQuest(). Còn thẻ chưa xem thì hiện thẻ, trả về true để hàm gọi dừng;
  // bấm nút cuối thì gọi lại cont() để vào round. Đề chưa sinh, đồng hồ chưa chạy.
  function gateBefore(roundId, cont) {
    const ids = (BEFORE[roundId] || []).filter(id => !isSeen(id));
    if (!ids.length || open) return open;   // đang có thẻ thì chặn bấm thêm
    const opts = { finalLabel: GO_LABEL[roundId] || 'Vào Arena', laterLabel: 'Để sau' };
    if (roundId === 'trap1') opts.extra = { label: 'Vào Shop', action: () => openShop(LAST && $('result').classList.contains('active') ? 'result' : 'dashboard') };
    showSequence(ids, opts).then(r => { if (r === 'done') cont(); });
    return true;
  }

  // Cuối renderResult()
  function onResult(L) {
    if (!L || !L.arena) return;
    if (L.arena.id === 'arena1' && L.attempt === 1) {
      showSequence(['res_arena1_bang', 'res_arena1_credit']);
    }
    if (L.arena.id === 'trap2' && L.passed && !isSeen('res_arena4_du') && !isSeen('res_arena4_thieu')) {
      const id = S.credits >= CONFIG.bossUnlockCost ? 'res_arena4_du' : 'res_arena4_thieu';
      showSequence([id]).then(() => markSeen('res_arena4_du', 'res_arena4_thieu'));
    }
  }

  // Cuối openShop()
  function onShop() { showSequence(['shop_a', 'shop_b']); }

  // Cuối openReport() khi dựng bảng thành công
  function onReport() {
    if ($('reportClusterTable')) showSequence(['report_a', 'report_b']);
  }

  // Cuối beginPlay()
  function onBeginPlay(arena) {
    if (arena.itemsAllowed && S.inventory.eliminate > 0) toastOnce('quiz_bua');
  }

  // Trong renderTimer(), khi câu đang quá giờ
  function onOvertime(penalty) { toastOnce('quiz_quagio', penalty); }

  // Lớp game: lần đầu rơi đồng xu
  function onCoins(n) { if (n > 0) toastOnce('game_coin', n); }

  /* ---------- 6. Bảng Luật chơi (luôn mở được, trừ khi đang làm câu có đồng hồ) ---------- */
  const ROUNDS = ['arena1', 'trap1', 'crossroads', 'trap2', 'boss', 'quest'];
  const roundName = id => (id === 'quest' ? QUEST.name : NAME(id).replace(' · The Gate', ''));

  function rewardText(id) {
    if (id === 'quest') return [...new Set(Array.from({ length: QUEST.size + 1 }, (_, c) => questCredit(c, QUEST.size)))].map(v => (v ? '+' + v : '0')).join(' / ');
    const n = sizeOf(id);
    const vals = [...new Set(Array.from({ length: n - needToPass(n, id) + 1 }, (_, k) => creditFor(needToPass(n, id) + k, n)))];
    return vals.map(v => '+' + v).join(' / ') + (id === 'boss' ? `, lần đầu thêm +${CONFIG.bossFirstClearBonus}` : '');
  }
  function quitText(id) {
    if (id === 'quest') return 'Huỷ, không nhận Credit';
    if (id === 'boss') return `Mất ${CONFIG.bossUnlockCost} Credit, Boss khoá lại, hoàn Bùa (mất hết tim lần thứ ${CONFIG.bossWhiteRuns + 1} cũng vậy)`;
    const arena = arenaOf(id);
    return 'Huỷ lượt' + (arena.itemsAllowed ? ', hoàn Bùa' : '') + (timeLimitFor(id) ? ', vẫn trừ phạt' : '');
  }
  function sizeText(id) {
    if (id === 'trap1') return `${sizeOf(id)} (W1)`;
    if (id === 'trap2') return `${sizeOf(id)} (W2)`;
    if (id === 'crossroads') return `${sizeOf(id)} (2 câu/cụm)`;
    if (id === 'boss') return `${sizeOf(id)} (${BOSS_SPLIT.join('/')})`;
    if (id === 'quest') return `${QUEST.size} (${CONFIG.questPerCluster} câu/cụm)`;
    return String(sizeOf(id));
  }

  function rulesHTML() {
    const row = (label, f) => `<tr><th scope="row">${esc(label)}</th>${ROUNDS.map(id => `<td>${esc(f(id))}</td>`).join('')}</tr>`;
    return `<div class="tbl-wrap"><table class="diag rules-table">
      <thead><tr><th>Luật</th>${ROUNDS.map(id => `<th>${esc(roundName(id))}</th>`).join('')}</tr></thead>
      <tbody>
        ${row('Số câu', sizeText)}
        ${row('Ngưỡng đỗ', id => (id === 'quest' ? 'Không có' : needLine(id).replace(/<[^>]+>/g, '')))}
        ${row('Đồng hồ mỗi câu', id => (timeLimitFor(id) ? `${timeLimitFor(id)} giây` : 'Không'))}
        ${row('Bùa (tối đa 1/round)', id => ((id === 'quest' ? QUEST : arenaOf(id)).itemsAllowed ? 'Có' : 'Không'))}
        ${row('Thưởng khi đỗ', rewardText)}
        ${row('Thoát hoặc tải lại trang', quitText)}
      </tbody></table></div>
      <ul class="tut-list">
        <li>Credit khởi đầu: ${CONFIG.startCredits}. Bùa Loại Trừ: ${itemCost()} Credit.</li>
        <li>Mở Boss: ${CONFIG.bossUnlockCost} Credit, trả một lần. Trượt Boss không phải trả thêm.</li>
        <li>Quá giờ: mỗi ${step()} giây trừ 1 Credit. Credit không xuống dưới 0.</li>
        <li>Bảng chẩn đoán tính lần làm đầu tiên của Arena 1–4. Cột Boss ở Bảng tổng kết tính lượt đỗ Boss.</li>
        <li>Game chỉ báo đúng/sai sau khi làm xong cả round.</li>
        <li>Điều khiển: W, A, S, D. Quái vào tầm thì tự chém, câu hỏi hiện ra và khung cảnh đứng yên; đồng hồ câu vẫn chạy.</li>
        <li>Boss: ${GAME_CONFIG.boss.hearts} tim mỗi lượt. Mất hết tim là lượt trắng (không tính điểm, Boss vẫn mở); mỗi lần mở Boss có ${CONFIG.bossWhiteRuns} lượt trắng.</li>
      </ul>`;
  }

  function rulesLocked() { return !!(RUN && RUN.limit); }

  function openRules() {
    if (rulesLocked()) { toast('Đang làm câu có đồng hồ. Xem Luật chơi sau khi xong round.'); return; }
    $('rulesBody').innerHTML = rulesHTML();
    $('rulesOverlay').classList.remove('hidden');
    $('rulesClose').focus();
  }
  function closeRules() { $('rulesOverlay').classList.add('hidden'); }
  function replayTutorial() {
    resetSeen();
    closeRules();
    toast('Hướng dẫn sẽ hiện lại ở từng bước.');
    if ($('dashboard').classList.contains('active') && S.started) onStartRun();
  }
  function syncRulesButton() {
    const b = $('rulesBtn');
    if (b) b.disabled = rulesLocked();
  }

  function init() {
    $('rulesBtn').addEventListener('click', openRules);
    $('rulesClose').addEventListener('click', closeRules);
    $('rulesReplay').addEventListener('click', replayTutorial);
    $('rulesOverlay').addEventListener('click', e => { if (e.target === $('rulesOverlay')) closeRules(); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !$('rulesOverlay').classList.contains('hidden')) closeRules();
    });
  }

  return {
    init, onStartRun, gateBefore, onResult, onShop, onReport, onBeginPlay, onOvertime, onCoins, syncRulesButton,
    // Bảng tutorial hoặc bảng Luật chơi đang mở: phím tắt A/B/C/Enter của màn câu hỏi phải tắt
    isOpen: () => open || !$('rulesOverlay').classList.contains('hidden'),
    // Cho nhóm kiểm thử trong Console: TUT.debug.seen(), TUT.debug.reset()
    debug: { seen: () => ({ ...seenMap() }), reset: resetSeen, cards: () => Object.keys(CARDS) }
  };
})();
