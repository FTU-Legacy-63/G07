'use strict';
/* =============================================================================
   CFA Quest — Ethics · lớp giao diện (mọi thứ chạy trên trang, trừ luật game)
   Gộp ngày 22/10/2026 từ 4 file JS cũ, giữ nguyên thứ tự nạp cũ:
     1. Lớp game hành động (GAME): canvas, nhân vật, quái, Boss, đạn, xu, camera
     2. Hướng dẫn (TUT): thẻ hướng dẫn, coach mark, toast, bảng Luật chơi
     3. Giao diện chính: bảng tiến trình, màn câu hỏi, kết quả, Shop, bảng tổng kết, chế độ demo, init()
     4. Lớp skin (SKIN): vẽ sprite, bản đồ thế giới, cảnh chuyển, màn đầu, Shop có lái buôn

   Nạp sau cùng trong cfa_quest_v11.html, sau các file:
     cfa_quest_v11_bank.js   ngân hàng câu hỏi nhúng sẵn (sinh tự động từ data/ethics_bank_220.json)
     cfa_quest_engine.js     luật game, không đụng DOM; test/ chạy file này bằng Node
     cfa_quest_scenarios.js  4 kịch bản demo (sinh tự động bởi tools/build_scenarios.js)
     asset/assets.js         danh mục ảnh (sinh tự động bởi tools/asset_pipeline/build_manifest.py)
   Các phần dùng chung biến toàn cục của nhau như khi còn là file riêng.
   ============================================================================= */

/* ====================================================================================================
   1. Lớp game hành động (GAME): canvas, nhân vật, quái, Boss, đạn, xu, camera
   (trước ngày 22/10/2026 là file riêng cfa_quest_game.js)
   ==================================================================================================== */
/* =============================================================================
   CFA Quest — Ethics · lớp game hành động (canvas), 21/10/2026

   Đặc tả: SOLUTION_STRUCTURE.md Mục 15 (15.1–15.8). Tham số chỉ đọc từ GAME_CONFIG bên dưới,
   khớp bảng 15.8; chỉnh sau buổi chơi thử thì sửa một chỗ này.

   Lớp game chỉ quyết định KHI NÀO câu hỏi hiện (Mục 15.1). Câu nào hiện, đáp án, chấm điểm,
   Credit, lượt trắng do engine (cfa_quest_engine.js) xử lý. Hai bên nối nhau ở ba chỗ:
   - game gọi cb.onSlash()      khi chém trúng quái/Boss  → giao diện mở câu kế tiếp của engine
   - giao diện gọi GAME.answered(isLast) khi người chơi đã xác nhận → game chạy tiếp
   - game gọi cb.onHeartsOut()  khi mất hết tim ở Boss    → giao diện gọi engine whiteRun()
   Hết câu thì giao diện chấm round bằng engine (Credit vào ví trước), rồi gọi
   GAME.endArena({ coins }) để rơi đồng xu; nhặt xong game gọi cb.onEndDone().

   Phần này không đụng S, RUN của engine và không vẽ ảnh. Hình vẽ mặc định là hình khối;
   lớp skin (phần 4 cuối file) thay các hàm trong GAME.renderer bằng sprite.
   ============================================================================= */

const GAME_CONFIG = {
  view: { width: 960, height: 540 },
  floor: { x0: 30, y0: 140, x1: 930, y1: 520 },
  maxDt: 1 / 30,                       // s
  player: { speed: 200, radius: 10, slashTime: 0.3 },
  arena: {                             // Arena 1–4 và World Quest
    maxMonsters: 4,
    monster: { speed: 120, radius: 14, separation: 28 },
    slashRange: 48,
    spawn: { minDistance: 260, warn: 0.5, gap: 0.3 },
    afterAnswer: { invuln: 1.0, noAutoSlash: true, pushRadius: 260, pushTime: 0.25 },
    vanishTime: 0.43
  },
  boss: {
    center: { x: 480, y: 160 },
    radius: 70,
    slashRange: 100,
    hearts: 2,
    hitInvuln: 1.0,
    push: {
      radius: 340, time: 0.25, invuln: 1.0,
      keepBullets: true,               // luật 2: không xoá đạn
      restartFromTelegraph: true       // luật 6: báo hiệu lại sau mỗi lần đẩy
    },
    pattern: {
      rays: 6,
      spin: 0.30,                      // rad/s; trên canvas, dương = cùng chiều kim đồng hồ
      firstSpinSign: +1,               // luật 4: đợt đầu cùng chiều kim đồng hồ
      alternateSpin: true,             // đổi dấu sau mỗi đợt, đếm liên tục trong lượt Boss
      aimFirstRay: true,               // luật 1
      telegraph: 1.0, fire: 3.0, rest: 1.2,
      emitInterval: 0.08,
      emitRadius: 60
    },
    bullet: { speed: 300, radius: 4, drawLength: 16, drawWidth: 6 },
    startDelay: 0.6,                   // nghỉ ngắn trước đợt báo hiệu đầu tiên của lượt
    lostDelay: 1.0                     // hoạt cảnh ngã trước khi báo lượt trắng
  },
  // autoFlyAfter: 2,0 s theo SOLUTION_STRUCTURE 15.8 (THAM_SO_LOP_GAME bản 1.1 ghi 3,0 s; bảng 15.8 là bản gốc)
  coins: { scatterMin: 60, scatterMax: 120, popTime: 0.4, magnetRadius: 40, autoFlyAfter: 2.0, flySpeed: 600, maxCoins: 12 },
  end: { failPause: 1.0, passPause: 0.6, afterCoins: 0.5, bossDefeat: 0.8 },
  // Khung logic 960×540 hiện trọn trong màn hình (kiểu "contain", 22/10/2026): không cắt mép trên/dưới của sàn.
  // Màn hình khác tỉ lệ 16:9 thì phần dư phủ bằng chính ảnh sàn làm mờ (renderer.backdrop). Không đổi luật hay toạ độ.
  // viewTop: hiện sàn từ y = viewTop tới mép dưới (0 = cả sàn). hudReserve: số px (CSS) chừa ở trên, không vẽ sàn.
  // Boss không cần chừa: ảnh sd_boss có dải tối trống ở trên cùng (y = 0–58), thanh máu và số máu nằm đè lên dải đó.
  // Camera vẫn bám nhân vật nếu sau này đặt viewTop > 0 làm khung logic lớn hơn màn hình.
  camera: { follow: 6, maxPixelRatio: 2, viewTop: { arena: 0, boss: 0 }, hudReserve: { arena: 0, boss: 0 } }
};

const GAME = (() => {
  const C = GAME_CONFIG;
  const TAU = Math.PI * 2;
  const F = C.floor;

  /* ---------- 1. Tiện ích hình học ---------- */
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeOut = t => 1 - (1 - t) * (1 - t);
  const clampToFloor = p => { p.x = clamp(p.x, F.x0, F.x1); p.y = clamp(p.y, F.y0, F.y1); return p; };
  const rand = (a, b) => a + Math.random() * (b - a);   // vị trí quái, xu: không dùng rng của engine

  /* ---------- 2. Trạng thái ---------- */
  let canvas = null, ctx = null;
  let rafId = 0, lastTs = 0;
  let cb = {};
  let isBlocked = () => false;
  const keys = new Set();
  let G = null;           // trạng thái của màn đang chơi
  let hudCache = '';

  function newState(opts) {
    const boss = opts.kind === 'boss';
    return {
      kind: opts.kind,                   // 'arena' | 'boss'
      floorId: opts.floorId,             // arena1 … arena4, world_quest, boss (khoá ở assets.js → floors)
      total: opts.total,                 // số câu = số quái (Arena) hoặc số nấc máu (Boss)
      demo: !!opts.demo,
      phase: 'play',                     // play | slash | question | push | ending | coins | lost | done
      phaseT: 0,
      time: 0,                           // thời gian thế giới (đứng khi đứng hình)
      real: 0,                           // thời gian thật kể từ lúc vào màn (cho hoạt cảnh UI)
      answered: 0,
      slashed: 0,
      player: {
        x: 480, y: boss ? 470 : 330, r: C.player.radius,
        face: 1, moving: false,
        anim: 'stand', animT: 0,
        invuln: 0,                       // còn bao nhiêu giây bất tử
        noSlash: 0,                      // còn bao nhiêu giây không tự chém (Arena: sau khi trả lời)
        hearts: boss ? C.boss.hearts : 0,
        bump: 0
      },
      monsters: [],
      spawned: 0,
      spawnCooldown: 0.4,
      target: null,                      // quái/Boss vừa bị chém, đang chờ câu trả lời
      fx: [],                            // hiệu ứng: chém, biến mất, nhặt xu, trúng đạn
      bullets: [],
      coins: [],
      boss: boss ? {
        x: C.boss.center.x, y: C.boss.center.y, r: C.boss.radius,
        cycle: 'wait', cycleT: 0, startDelay: C.boss.startDelay,
        wavesFired: 0, baseAngle: 0, sign: 1, emitAcc: 0, fireT: 0,
        anim: 'idle', animT: 0, hp: opts.total, hpMax: opts.total
      } : null,
      whiteLeft: opts.whiteLeft ?? null,
      cam: null,                         // tâm camera trên khung logic, đặt ở lần vẽ đầu
      push: null,
      endInfo: null,
      coinsLeft: 0
    };
  }

  /* ---------- 3. Bàn phím ---------- */
  const MOVE_KEYS = { w: [0, -1], a: [-1, 0], s: [0, 1], d: [1, 0], arrowup: [0, -1], arrowleft: [-1, 0], arrowdown: [0, 1], arrowright: [1, 0] };
  function onKeyDown(e) {
    const k = e.key.toLowerCase();
    if (!(k in MOVE_KEYS)) return;
    if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    keys.add(k);
    if (G && G.phase !== 'question' && G.phase !== 'done' && k.startsWith('arrow')) e.preventDefault();
  }
  function onKeyUp(e) { keys.delete(e.key.toLowerCase()); }
  function clearKeys() { keys.clear(); }

  /* ---------- 4. Vòng lặp ---------- */
  function frame(ts) {
    rafId = requestAnimationFrame(frame);
    const dtReal = lastTs ? Math.min((ts - lastTs) / 1000, 0.25) : 0;
    lastTs = ts;
    if (!G) return;
    const dt = Math.min(dtReal, C.maxDt);
    const blocked = isBlocked();
    if (!blocked) update(dt);
    if (!G) return;                                // update() có thể kết thúc màn (cb.onEndDone → stop)
    G.real += dtReal;
    draw(blocked ? 0 : dtReal);
    emitHud();
  }

  function setPhase(p) { G.phase = p; G.phaseT = 0; }

  function update(dt) {
    G.phaseT += dt;
    const P = G.player;
    switch (G.phase) {
      case 'slash':
        tickFx(dt);
        P.animT += dt;
        if (G.boss) G.boss.animT += dt;
        if (G.phaseT >= C.player.slashTime) {
          setPhase('question');
          if (cb.onSlash) cb.onSlash();
        }
        return;
      case 'question':
      case 'done':
        return;                                   // đứng hình (Mục 15.1); đồng hồ câu chạy ở giao diện
      case 'lost':
        P.animT += dt;
        tickFx(dt);
        if (G.phaseT >= C.boss.lostDelay) {
          setPhase('done');
          if (cb.onHeartsOut) cb.onHeartsOut();
        }
        return;
    }
    G.time += dt;
    timers(dt);
    if (G.phase !== 'ending') movePlayer(dt);
    else P.animT += dt;
    if (G.kind === 'arena') updateArena(dt);
    else updateBoss(dt);
    updateCoins(dt);
    tickFx(dt);
    if (G.phase === 'ending' && G.phaseT >= (G.endInfo ? G.endInfo.pause : Infinity)) startCoins();
    if (G.phase === 'coins' && G.coinsLeft === 0) {
      if (G.phaseT >= C.end.afterCoins || G.coins.length === 0) finishEnd();
    }
  }

  function timers(dt) {
    const P = G.player;
    P.invuln = Math.max(0, P.invuln - dt);
    P.noSlash = Math.max(0, P.noSlash - dt);
    P.bump = Math.max(0, P.bump - dt);
    P.animT += dt;
  }

  function movePlayer(dt) {
    const P = G.player;
    if (G.push) {                                  // đang bị Boss hất ra
      G.push.t += dt;
      const k = easeOut(Math.min(1, G.push.t / G.push.dur));
      P.x = lerp(G.push.from.x, G.push.to.x, k);
      P.y = lerp(G.push.from.y, G.push.to.y, k);
      if (G.push.t >= G.push.dur) { G.push = null; afterPush(); }
      return;
    }
    let dx = 0, dy = 0;
    keys.forEach(k => { const v = MOVE_KEYS[k]; if (v) { dx += v[0]; dy += v[1]; } });
    const len = Math.hypot(dx, dy);
    const moving = len > 0;
    if (moving) {
      P.x += dx / len * C.player.speed * dt;
      P.y += dy / len * C.player.speed * dt;
      if (dx) P.face = dx > 0 ? 1 : -1;
    }
    clampToFloor(P);
    if (G.boss) {                                  // không đi xuyên thân Boss
      const d = dist(P, G.boss), min = G.boss.r + P.r;
      if (d < min) {
        const a = Math.atan2(P.y - G.boss.y, P.x - G.boss.x);
        P.x = G.boss.x + Math.cos(a) * min;
        P.y = G.boss.y + Math.sin(a) * min;
        clampToFloor(P);
      }
    }
    const anim = P.anim;
    if (anim === 'stand' || anim === 'walk') {
      const next = moving ? 'walk' : 'stand';
      if (next !== anim) { P.anim = next; P.animT = 0; }
    } else if ((anim === 'attack' && P.animT > 0.5) || (anim === 'hurt' && P.animT > 0.4) || ((anim === 'win' || anim === 'sad') && moving)) {
      P.anim = moving ? 'walk' : 'stand'; P.animT = 0;
    }
    P.moving = moving;
  }

  /* ---------- 5. Arena 1–4 và World Quest (Mục 15.2) ---------- */
  function liveMonsters() { return G.monsters.filter(m => m.state !== 'vanish'); }

  function updateArena(dt) {
    const A = C.arena;
    const P = G.player;
    // Sinh quái: tối đa 4 con trên màn, tổng đúng bằng số câu, cách nhau 0,3 s
    if (G.phase === 'play') {
      G.spawnCooldown = Math.max(0, G.spawnCooldown - dt);
      const alive = liveMonsters().length;
      if (G.spawned < G.total && alive < A.maxMonsters && G.spawnCooldown === 0) {
        spawnMonster();
        G.spawnCooldown = A.spawn.gap;
      }
    }
    G.monsters.forEach(m => {
      m.t += dt;
      if (m.state !== 'vanish') m.face = P.x >= m.x ? 1 : -1;   // quái luôn quay mặt về phía nhân vật
      if (m.state === 'warn' && m.t >= A.spawn.warn) { m.state = 'chase'; m.t = 0; }
      if (m.push) {
        m.push.t += dt;
        const k = easeOut(Math.min(1, m.push.t / m.push.dur));
        m.x = lerp(m.push.from.x, m.push.to.x, k);
        m.y = lerp(m.push.from.y, m.push.to.y, k);
        if (m.push.t >= m.push.dur) m.push = null;
        return;
      }
      if (m.state !== 'chase' || G.phase !== 'play') return;
      const d = dist(m, P);
      const stop = m.r + P.r;
      if (d > stop) {
        const step = Math.min(A.monster.speed * dt, d - stop);
        m.x += (P.x - m.x) / d * step;
        m.y += (P.y - m.y) / d * step;
      } else if (P.bump === 0) {
        P.bump = 0.5;                              // chạm chỉ tạo hiệu ứng (Mục 15.2)
        G.fx.push({ type: 'bump', x: P.x, y: P.y - 12, t: 0, dur: 0.3 });
      }
    });
    separateMonsters();
    G.monsters = G.monsters.filter(m => !(m.state === 'vanish' && m.t >= A.vanishTime));
    // Tự chém: quái gần nhất trong tầm; hai con vào tầm cùng lúc thì chỉ mở một câu (Mục 15.2)
    if (G.phase === 'play' && P.noSlash === 0 && !G.push) {
      let best = null, bd = Infinity;
      G.monsters.forEach(m => {
        if (m.state !== 'chase') return;
        const d = dist(m, P);
        if (d <= A.slashRange && d < bd) { best = m; bd = d; }
      });
      if (best) startSlash(best);
    }
  }

  function spawnMonster() {
    const A = C.arena;
    const P = G.player;
    let pos = null, far = null, farD = -1;
    for (let i = 0; i < 40; i++) {
      const c = { x: rand(F.x0 + 20, F.x1 - 20), y: rand(F.y0 + 20, F.y1 - 10) };
      const d = dist(c, P);
      const tooClose = G.monsters.some(m => dist(m, c) < A.monster.separation * 2);
      if (d >= A.spawn.minDistance && !tooClose) { pos = c; break; }
      if (d > farD) { far = c; farD = d; }
    }
    pos = pos || far;                              // điểm sinh dự phòng: điểm xa nhân vật nhất đã thử
    G.monsters.push({ id: ++G.spawned, x: pos.x, y: pos.y, r: A.monster.radius, state: 'warn', t: 0, face: pos.x < P.x ? 1 : -1, bob: Math.random() * TAU, push: null });
  }

  function separateMonsters() {
    const sep = C.arena.monster.separation;
    const list = G.monsters.filter(m => m.state === 'chase' && !m.push);
    for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
      const a = list[i], b = list[j];
      let d = dist(a, b);
      if (d >= sep) continue;
      if (d < 0.01) { b.x += 0.5; d = 0.5; }
      const k = (sep - d) / 2 / d;
      const ox = (b.x - a.x) * k, oy = (b.y - a.y) * k;
      a.x -= ox; a.y -= oy; b.x += ox; b.y += oy;
      clampToFloor(a); clampToFloor(b);
    }
  }

  function startSlash(target) {
    const P = G.player;
    G.target = target;
    if (target !== G.boss) target.state = 'slashed';
    P.face = target.x >= P.x ? 1 : -1;
    P.anim = 'attack'; P.animT = 0;
    G.slashed++;
    const ang = Math.atan2(target.y - P.y, target.x - P.x);
    G.fx.push({ type: 'slash', x: P.x, y: P.y - 14, ang, t: 0, dur: C.player.slashTime, boss: target === G.boss });
    if (G.boss && target === G.boss) {
      G.boss.hp = Math.max(0, G.boss.hp - 1);    // 15 nấc, giảm một nấc mỗi lần chém trúng (Mục 15.3)
      G.boss.anim = 'hit'; G.boss.animT = 0;
    }
    setPhase('slash');
  }

  // Giao diện gọi sau khi người chơi xác nhận câu (Mục 15.2, 15.3)
  function answered(isLast) {
    if (!G || G.phase !== 'question') return;
    G.answered++;
    const P = G.player;
    if (G.kind === 'arena') {
      const m = G.target;
      if (m) { m.state = 'vanish'; m.t = 0; }       // biến mất, cùng một hiệu ứng dù đúng hay sai
      G.target = null;
      if (isLast) { setPhase('ending'); G.endInfo = { pause: Infinity }; return; }
      P.invuln = C.arena.afterAnswer.invuln;
      P.noSlash = C.arena.afterAnswer.invuln;
      const R = C.arena.afterAnswer.pushRadius;
      G.monsters.forEach(o => {
        if (o.state !== 'chase' && o.state !== 'warn') return;
        const d = dist(o, P);
        if (d >= R) return;
        const a = d < 0.01 ? Math.random() * TAU : Math.atan2(o.y - P.y, o.x - P.x);
        const to = clampToFloor({ x: P.x + Math.cos(a) * R, y: P.y + Math.sin(a) * R });
        o.push = { from: { x: o.x, y: o.y }, to, t: 0, dur: C.arena.afterAnswer.pushTime };
      });
      setPhase('play');
      return;
    }
    // Boss
    G.target = null;
    const B = G.boss;
    if (isLast) { setPhase('ending'); G.endInfo = { pause: Infinity }; B.anim = 'idle'; B.animT = 0; return; }
    const a = Math.atan2(P.y - B.y, P.x - B.x);
    const to = clampToFloor({ x: B.x + Math.cos(a) * C.boss.push.radius, y: B.y + Math.sin(a) * C.boss.push.radius });
    G.push = { from: { x: P.x, y: P.y }, to, t: 0, dur: C.boss.push.time };
    P.invuln = C.boss.push.invuln;                 // bất tử 1,0 s tính từ lúc bị đẩy (Mục 15.3, 15.8)
    P.anim = 'hurt'; P.animT = 0;
    B.anim = 'attack'; B.animT = 0;
    B.cycle = 'pushed'; B.cycleT = 0;
    if (!C.boss.push.keepBullets) G.bullets = [];
    setPhase('play');
  }

  function afterPush() {
    const B = G.boss;
    if (!B) return;
    if (C.boss.push.restartFromTelegraph) beginTelegraph();
  }

  /* ---------- 6. Boss (Mục 15.3) ---------- */
  function beginTelegraph() {
    const B = G.boss, P = G.player, pat = C.boss.pattern;
    B.cycle = 'telegraph'; B.cycleT = 0;
    B.baseAngle = pat.aimFirstRay ? Math.atan2(P.y - B.y, P.x - B.x) : 0;
    B.sign = pat.firstSpinSign * (pat.alternateSpin && B.wavesFired % 2 === 1 ? -1 : 1);
    B.anim = 'telegraph'; B.animT = 0;
  }

  function rayAngle(k, tFire) {
    const B = G.boss, pat = C.boss.pattern;
    return B.baseAngle + k * TAU / pat.rays + B.sign * pat.spin * tFire;
  }

  function updateBoss(dt) {
    const B = G.boss, P = G.player, pat = C.boss.pattern;
    B.animT += dt;
    if (G.phase === 'play') {
      B.cycleT += dt;
      switch (B.cycle) {
        case 'wait':
          if (B.cycleT >= B.startDelay) beginTelegraph();
          break;
        case 'pushed':
          break;                                  // chờ đẩy xong (afterPush)
        case 'telegraph':
          if (B.cycleT >= pat.telegraph) {
            B.cycle = 'fire'; B.cycleT = 0; B.fireT = 0; B.emitAcc = pat.emitInterval;
            B.wavesFired++;
            B.anim = 'idle'; B.animT = 0;
          }
          break;
        case 'fire': {
          B.emitAcc += dt;
          while (B.emitAcc >= pat.emitInterval && B.fireT <= pat.fire) {
            B.emitAcc -= pat.emitInterval;
            const late = B.emitAcc;                // viên phát ra sớm hơn khung này bao nhiêu giây
            for (let k = 0; k < pat.rays; k++) {
              const a = rayAngle(k, B.fireT);
              const v = C.boss.bullet.speed;
              G.bullets.push({
                x: B.x + Math.cos(a) * (pat.emitRadius + v * late),
                y: B.y + Math.sin(a) * (pat.emitRadius + v * late),
                vx: Math.cos(a) * v, vy: Math.sin(a) * v, a
              });
            }
            B.fireT += pat.emitInterval;
          }
          if (B.cycleT >= pat.fire) { B.cycle = 'rest'; B.cycleT = 0; }
          break;
        }
        case 'rest':
          if (B.cycleT >= pat.rest) beginTelegraph();
          break;
      }
    }
    if (B.anim === 'attack' && B.animT > 0.3) { B.anim = 'idle'; B.animT = 0; }
    if (B.anim === 'hit' && G.phase === 'play' && B.animT > 0.3) { B.anim = 'idle'; B.animT = 0; }
    // Đạn bay thẳng; ra khỏi khung thì bỏ
    const br = C.boss.bullet.radius;
    const V = C.view;
    G.bullets.forEach(b => { b.x += b.vx * dt; b.y += b.vy * dt; });
    G.bullets = G.bullets.filter(b => b.x > -20 && b.x < V.width + 20 && b.y > F.y0 - 40 && b.y < V.height + 20);
    if (G.phase !== 'play') return;
    // Trúng đạn: mất 1 tim, bất tử 1,0 s để một luồng đạn không tính nhiều lần
    if (P.invuln === 0 && !G.push) {
      const hit = G.bullets.find(b => Math.hypot(b.x - P.x, b.y - (P.y - 8)) < br + P.r);
      if (hit) {
        P.hearts--;
        P.invuln = C.boss.hitInvuln;
        P.anim = 'hurt'; P.animT = 0;
        G.fx.push({ type: 'hit', x: P.x, y: P.y - 14, t: 0, dur: 0.35 });
        if (P.hearts <= 0) {
          P.anim = 'down'; P.animT = 0;
          clearKeys();
          setPhase('lost');
          return;
        }
      }
    }
    // Tự chém Boss khi vào tầm (Mục 15.3). Một lần chém mở tối đa một câu.
    if (!G.push && G.slashed < G.total && dist(P, B) <= C.boss.slashRange) {
      startSlash(B);
    }
  }

  /* ---------- 7. Kết thúc màn và đồng xu (Mục 15.5) ---------- */
  // Giao diện gọi sau khi engine đã chấm round và cộng Credit. coins = số Credit thực nhận (>= 0).
  function endArena(info = {}) {
    if (!G) return;
    const P = G.player;
    G.monsters.forEach(m => { if (m.state !== 'vanish') { m.state = 'vanish'; m.t = 0; } });
    G.target = null;
    G.push = null;
    const pause = info.passed ? C.end.passPause : C.end.failPause;
    G.endInfo = { coins: Math.max(0, Math.min(C.coins.maxCoins, info.coins | 0)), passed: !!info.passed, pause };
    if (G.boss) {
      G.bullets = [];
      if (info.passed) { G.boss.anim = 'defeat'; G.boss.animT = 0; G.endInfo.pause = C.end.bossDefeat; }
    }
    P.anim = info.passed ? 'win' : 'sad'; P.animT = 0;
    P.invuln = 0;
    setPhase('ending');
  }

  function startCoins() {
    const n = G.endInfo.coins;
    const P = G.player;
    G.coins = [];
    for (let i = 0; i < n; i++) {
      const a = (i / Math.max(1, n)) * TAU + rand(-0.3, 0.3);
      const r = rand(C.coins.scatterMin, C.coins.scatterMax);
      const to = clampToFloor({ x: P.x + Math.cos(a) * r, y: P.y + Math.sin(a) * r });
      G.coins.push({ from: { x: P.x, y: P.y - 10 }, to, x: P.x, y: P.y, z: 0, t: 0, state: 'pop', i });
    }
    G.coinsLeft = n;
    setPhase('coins');
    if (n && cb.onCoinsStart) cb.onCoinsStart(n);
  }

  function updateCoins(dt) {
    if (!G.coins.length) return;
    const P = G.player, K = C.coins;
    G.coins.forEach(c => {
      if (c.state === 'got') return;
      c.t += dt;
      if (c.state === 'pop') {
        const k = Math.min(1, c.t / K.popTime);
        c.x = lerp(c.from.x, c.to.x, k);
        c.y = lerp(c.from.y, c.to.y, k);
        c.z = Math.sin(k * Math.PI) * 26;          // nảy lên rồi rơi xuống
        if (k >= 1) { c.state = 'rest'; c.z = 0; }
        return;
      }
      const d = Math.hypot(P.x - c.x, P.y - 8 - c.y);
      if (c.state === 'rest' && (d < K.magnetRadius || G.phaseT >= K.autoFlyAfter)) c.state = 'fly';
      if (c.state === 'fly') {
        const step = K.flySpeed * dt;
        if (d <= step + 6) {
          c.state = 'got';
          G.coinsLeft--;
          G.fx.push({ type: 'coin', x: P.x, y: P.y - 30, t: 0, dur: 0.5 });
          if (cb.onCoin) cb.onCoin(G.endInfo.coins - G.coinsLeft, G.endInfo.coins);
        } else {
          c.x += (P.x - c.x) / d * step;
          c.y += (P.y - 8 - c.y) / d * step;
        }
      }
    });
  }

  function finishEnd() {
    setPhase('done');
    const done = cb.onEndDone;
    if (done) done();
  }

  function tickFx(dt) {
    G.fx.forEach(f => { f.t += dt; });
    G.fx = G.fx.filter(f => f.t < f.dur);
  }

  /* ---------- 8. Vẽ mặc định (hình khối). Lớp skin thay từng hàm. ---------- */
  const renderer = {
    backdrop(c, g, cam) {
      c.fillStyle = '#120d18';
      c.fillRect(0, 0, cam.cw, cam.ch);
    },
    floor(c, g) {
      c.fillStyle = '#2b2735'; c.fillRect(0, 0, C.view.width, C.view.height);
      c.fillStyle = '#3b3548'; c.fillRect(0, 0, C.view.width, F.y0);
      c.fillStyle = '#4a4458'; c.fillRect(F.x0, F.y0, F.x1 - F.x0, F.y1 - F.y0);
      c.strokeStyle = 'rgba(255,255,255,.05)'; c.lineWidth = 1;
      for (let x = F.x0; x <= F.x1; x += 30) { c.beginPath(); c.moveTo(x, F.y0); c.lineTo(x, F.y1); c.stroke(); }
      for (let y = F.y0; y <= F.y1; y += 30) { c.beginPath(); c.moveTo(F.x0, y); c.lineTo(F.x1, y); c.stroke(); }
    },
    shadow(c, x, y, w) {
      c.fillStyle = 'rgba(0,0,0,.28)';
      c.beginPath(); c.ellipse(x, y, w, w * 0.38, 0, 0, TAU); c.fill();
    },
    player(c, p, g) {
      this.shadow(c, p.x, p.y, 13);
      const blink = p.invuln > 0 && Math.floor(g.real * 12) % 2 === 0;
      c.globalAlpha = blink ? 0.45 : 1;
      c.fillStyle = p.anim === 'hurt' || p.anim === 'down' ? '#ff8a8a' : '#f2b632';
      c.beginPath(); c.arc(p.x, p.y - 16, 12, 0, TAU); c.fill();
      c.fillStyle = '#3a220c';
      c.beginPath(); c.arc(p.x + p.face * 5, p.y - 19, 2.4, 0, TAU); c.fill();
      c.globalAlpha = 1;
    },
    monster(c, m, g) {
      if (m.state === 'warn') {
        const k = m.t / C.arena.spawn.warn;
        c.strokeStyle = `rgba(190,120,255,${0.3 + 0.5 * k})`; c.lineWidth = 2;
        c.beginPath(); c.ellipse(m.x, m.y, 18, 7, 0, 0, TAU); c.stroke();
        return;
      }
      const vanish = m.state === 'vanish' ? Math.min(1, m.t / C.arena.vanishTime) : 0;
      c.globalAlpha = 1 - vanish;
      this.shadow(c, m.x, m.y, 12);
      const bob = Math.sin(g.real * 3 + m.bob) * 3;
      c.fillStyle = m.state === 'slashed' ? '#ffffff' : '#8b5cf6';
      c.beginPath(); c.arc(m.x, m.y - 16 + bob, 14 * (1 + vanish * 0.6), 0, TAU); c.fill();
      c.globalAlpha = 1;
    },
    boss(c, b, g) {
      this.shadow(c, b.x, b.y + 50, 60);
      c.fillStyle = b.anim === 'telegraph' ? '#ff5a6a' : b.anim === 'hit' ? '#ffffff' : '#c93c4b';
      c.beginPath(); c.arc(b.x, b.y, b.r, 0, TAU); c.fill();
    },
    telegraph(c, b, g) {
      if (b.cycle !== 'telegraph') return;
      const k = b.cycleT / C.boss.pattern.telegraph;
      c.save();
      c.strokeStyle = `rgba(255,80,110,${0.15 + 0.45 * k})`;
      c.lineWidth = 2 + 4 * k;
      c.setLineDash([10, 8]);
      for (let i = 0; i < C.boss.pattern.rays; i++) {
        const a = b.baseAngle + i * TAU / C.boss.pattern.rays;
        c.beginPath();
        c.moveTo(b.x + Math.cos(a) * C.boss.pattern.emitRadius, b.y + Math.sin(a) * C.boss.pattern.emitRadius);
        c.lineTo(b.x + Math.cos(a) * 1200, b.y + Math.sin(a) * 1200);
        c.stroke();
      }
      c.restore();
    },
    bullets(c, list, g) {
      const B = C.boss.bullet;
      list.forEach(b => {
        c.save();
        c.translate(b.x, b.y); c.rotate(b.a);
        c.fillStyle = '#ff3355';
        c.fillRect(-B.drawLength / 2, -B.drawWidth / 2, B.drawLength, B.drawWidth);
        c.fillStyle = '#ffffff';
        c.fillRect(-B.drawLength / 2 + 3, -1, B.drawLength - 6, 2);
        c.restore();
      });
    },
    coin(c, k, g) {
      if (k.state === 'got') return;
      this.shadow(c, k.x, k.y, 6);
      c.fillStyle = '#f2b632';
      c.beginPath(); c.arc(k.x, k.y - 8 - k.z, 7, 0, TAU); c.fill();
      c.strokeStyle = '#3a220c'; c.lineWidth = 1.5; c.stroke();
    },
    fx(c, f, g) {
      const k = f.t / f.dur;
      if (f.type === 'slash') {
        c.save();
        c.strokeStyle = `rgba(255,255,255,${1 - k})`;
        c.lineWidth = 6 * (1 - k) + 1;
        c.lineCap = 'round';
        const r = f.boss ? 56 : 34;
        c.beginPath(); c.arc(f.x, f.y, r, f.ang - 1.1 + k * 0.6, f.ang + 0.6 + k * 0.6); c.stroke();
        c.restore();
      } else if (f.type === 'hit') {
        c.fillStyle = `rgba(255,60,80,${0.6 * (1 - k)})`;
        c.beginPath(); c.arc(f.x, f.y, 14 + 26 * k, 0, TAU); c.fill();
      } else if (f.type === 'coin') {
        c.fillStyle = `rgba(242,182,50,${1 - k})`;
        c.font = 'bold 14px system-ui, sans-serif'; c.textAlign = 'center';
        c.fillText('+1', f.x, f.y - 20 * k);
      } else if (f.type === 'bump') {
        c.strokeStyle = `rgba(255,255,255,${0.6 * (1 - k)})`; c.lineWidth = 2;
        c.beginPath(); c.arc(f.x, f.y, 10 + 10 * k, 0, TAU); c.stroke();
      }
    },
    overlay(c, g) {
      if (g.phase === 'question' || g.phase === 'done') {
        c.fillStyle = 'rgba(10,8,20,.35)';
        c.fillRect(0, 0, C.view.width, C.view.height);
      }
    }
  };

  // Hiện trọn khung logic (kiểu contain): phóng lớn nhất mà vẫn thấy đủ bề ngang và phần sàn từ y = viewTop.
  // Sàn nằm giữa màn hình (bên dưới phần chừa hudReserve); phần dư phủ bằng ảnh sàn làm mờ (renderer.backdrop).
  function camera(dt) {
    const V = C.view, cw = canvas.width, ch = canvas.height;
    const kind = G.boss ? 'boss' : 'arena';
    const reserve = C.camera.hudReserve[kind] * pxRatio;
    const top = C.camera.viewTop[kind] || 0;
    const scale = Math.min(cw / V.width, (ch - reserve) / (V.height - top));
    const vw = cw / scale, vh = ch / scale;
    const minTop = top - reserve / scale;   // điểm cao nhất được phép đưa lên mép trên màn hình
    const fitsY = vh >= V.height - minTop - 0.01;
    // sàn vừa màn hình theo chiều dọc: canh giữa phần sàn [top, V.height] trong vùng dưới hudReserve
    const fitY = top + (ch / 2 - reserve - ((ch - reserve) - (V.height - top) * scale) / 2) / scale;
    const P = G.player;
    const tx = vw >= V.width ? V.width / 2 : clamp(P.x, vw / 2, V.width - vw / 2);
    const ty = fitsY ? fitY : clamp(P.y, minTop + vh / 2, V.height - vh / 2);
    if (!G.cam) G.cam = { x: tx, y: ty };
    if (dt) {
      const k = 1 - Math.exp(-C.camera.follow * dt);
      G.cam.x += (tx - G.cam.x) * k;
      G.cam.y += (ty - G.cam.y) * k;
    }
    if (vw >= V.width) G.cam.x = V.width / 2; else G.cam.x = clamp(G.cam.x, vw / 2, V.width - vw / 2);
    if (fitsY) G.cam.y = fitY; else G.cam.y = clamp(G.cam.y, minTop + vh / 2, V.height - vh / 2);
    return { scale, ox: cw / 2 - G.cam.x * scale, oy: ch / 2 - G.cam.y * scale, cw, ch };
  }

  function draw(dt = 0) {
    if (!ctx) return;
    fitCanvas();
    const cam = camera(dt);
    const R = renderer;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    R.backdrop(ctx, G, cam);                         // phần màn hình nằm ngoài khung logic
    ctx.setTransform(cam.scale, 0, 0, cam.scale, cam.ox, cam.oy);
    R.floor(ctx, G);
    if (G.boss) R.telegraph(ctx, G.boss, G);
    G.coins.forEach(k => { if (k.state === 'rest' || k.state === 'pop') R.coin(ctx, k, G); });
    // vẽ theo chiều sâu: vật có y lớn hơn vẽ sau
    const list = [];
    G.monsters.forEach(m => list.push({ y: m.y, f: () => R.monster(ctx, m, G) }));
    list.push({ y: G.player.y, f: () => R.player(ctx, G.player, G) });
    if (G.boss) list.push({ y: G.boss.y + 52, f: () => R.boss(ctx, G.boss, G) });
    list.sort((a, b) => a.y - b.y).forEach(o => o.f());
    if (G.bullets.length) R.bullets(ctx, G.bullets, G);
    G.coins.forEach(k => { if (k.state === 'fly') R.coin(ctx, k, G); });
    G.fx.forEach(f => R.fx(ctx, f, G));
    R.overlay(ctx, G);
  }

  /* ---------- 9. Số liệu cho thanh HUD của giao diện ---------- */
  function hud() {
    if (!G) return null;
    const P = G.player;
    return {
      kind: G.kind, phase: G.phase,
      total: G.total,
      remaining: G.total - G.slashed,              // quái/nấc máu còn lại
      answered: G.answered,
      hearts: P.hearts, maxHearts: G.kind === 'boss' ? C.boss.hearts : 0,
      bossHp: G.boss ? G.boss.hp : 0, bossHpMax: G.boss ? G.boss.hpMax : 0,
      whiteLeft: G.whiteLeft,
      coinsTotal: G.endInfo ? G.endInfo.coins : 0,
      coinsGot: G.endInfo ? G.endInfo.coins - G.coinsLeft : 0
    };
  }
  function emitHud() {
    if (!cb.onHud) return;
    const h = hud();
    const key = JSON.stringify(h);
    if (key === hudCache) return;
    hudCache = key;
    cb.onHud(h);
  }

  // Độ phân giải canvas theo kích thước hiển thị thật (tối đa 2 px ảnh cho 1 px CSS)
  let pxRatio = 1;
  function fitCanvas() {
    const r = canvas.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, C.camera.maxPixelRatio);
    pxRatio = dpr;
    const w = Math.round(r.width * dpr), h = Math.round(r.height * dpr);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
  }

  /* ---------- 10. Cổng ra ngoài ---------- */
  function init(el, opts = {}) {
    canvas = el;
    ctx = canvas.getContext('2d');
    if (opts.isBlocked) isBlocked = opts.isBlocked;
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', clearKeys);
    document.addEventListener('visibilitychange', () => { if (document.hidden) clearKeys(); });
    return !!ctx;
  }

  // opts: { kind: 'arena'|'boss', floorId, total, whiteLeft, demo, callbacks }
  function start(opts) {
    stop();
    G = newState(opts);
    cb = opts.callbacks || {};
    hudCache = '';
    clearKeys();
    lastTs = 0;
    rafId = requestAnimationFrame(frame);
    return G;
  }

  function stop() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
    G = null;
    cb = {};
  }

  // Thiết bị không có bàn phím/chuột (điện thoại, máy tính bảng): Mục 15.7
  function touchOnly() {
    try {
      const coarse = matchMedia('(pointer: coarse)').matches;
      const fine = matchMedia('(any-pointer: fine)').matches;
      return coarse && !fine;
    } catch { return false; }
  }

  return {
    config: C,
    renderer,
    init, start, stop, answered, endArena,
    hud,
    touchOnly,
    get state() { return G; },
    get running() { return !!G && G.phase !== 'done'; },
    // Cho nhóm kiểm thử trong Console (GAME.debug.*): không dùng trong luồng chơi
    debug: {
      // Đưa nhân vật tới sát quái gần nhất (hoặc vào tầm Boss) để mở câu ngay
      dashToTarget() {
        if (!G || G.phase !== 'play') return false;
        const P = G.player;
        if (G.boss) {
          const a = Math.atan2(P.y - G.boss.y, P.x - G.boss.x);
          P.x = G.boss.x + Math.cos(a) * (G.boss.r + P.r + 2);
          P.y = G.boss.y + Math.sin(a) * (G.boss.r + P.r + 2);
          P.invuln = Math.min(P.invuln, C.boss.hitInvuln - 0.01);
          G.boss.cycle = G.boss.cycle === 'pushed' ? 'telegraph' : G.boss.cycle;
          return true;
        }
        const m = G.monsters.find(o => o.state === 'chase');
        if (!m) return false;
        P.noSlash = 0;
        P.x = m.x - 20; P.y = m.y;
        return true;
      },
      hitPlayer() { if (G && G.boss) { G.player.invuln = 0; G.bullets.push({ x: G.player.x, y: G.player.y - 8, vx: 0, vy: 0, a: 0 }); } }
    }
  };
})();

/* ====================================================================================================
   2. Hướng dẫn (TUT): thẻ hướng dẫn, coach mark, toast, bảng Luật chơi
   (trước ngày 22/10/2026 là file riêng cfa_quest_tutorial.js)
   ==================================================================================================== */
/* =============================================================================
   CFA Quest — Ethics · lớp hướng dẫn (tutorial), đi kèm demo v12

   Đặc tả: tài liệu "Tutorial — CFA Quest · Ethics (bản khớp code v12)", 17/10/2026.
   Phần này đứng TRƯỚC phần giao diện chính (phần 3). Nó chỉ dùng các hàm/biến của phần đó
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

/* ====================================================================================================
   3. Giao diện chính: bảng tiến trình, màn câu hỏi, kết quả, Shop, bảng tổng kết, chế độ demo, init()
   (trước ngày 22/10/2026 là file riêng cfa_quest_v11.js)
   ==================================================================================================== */
/* =============================================================================
   CFA Quest — Ethics · demo v12 (tăng độ khó theo góp ý của thầy, luật chốt 06/10/2026)

   File đi kèm (sau khi gộp file ngày 22/10/2026):
   - cfa_quest_v11.html        (khung màn hình; giữ tên file cũ, nội dung là v12)
   - cfa_quest_engine.js       (luật game: cấu hình, sinh đề, chấm điểm, Credit, trạng thái; nạp trước file này)
   - cfa_quest_v11.css         (toàn bộ giao diện CSS)
   - cfa_quest_v11_bank.js     (ngân hàng nhúng, sinh tự động từ ethics_bank_220.json)
   - lớp hướng dẫn: phần 2 của chính file này (nội dung thẻ nằm ở đó)

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
   - Vào Arena là vào màn chơi canvas (phần 1 của file này). Câu hỏi chỉ hiện khi chém trúng quái/Boss,
     hiện đè lên khung cảnh đứng hình; đồng hồ câu vẫn đo bằng performance.now như cũ.
   - Hết câu: engine chấm round và cộng Credit trước, sau đó mới rơi đồng xu, nhặt xong mới hiện
     màn kết quả (Mục 15.5).
   - Boss: mất hết 2 tim thì gọi engine whiteRun() (lượt trắng, Mục 15.4).
   - Chế độ demo ?demo=1 (Mục 15.6): khối 15 ở cuối file, dữ liệu ở cfa_quest_scenarios.js.
   - UI_HOOKS cho lớp skin (phần 4 của file này): cảnh chuyển, bản đồ thế giới.
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

/* ====================================================================================================
   4. Lớp skin (SKIN): vẽ sprite, bản đồ thế giới, cảnh chuyển, màn đầu, Shop có lái buôn
   (trước ngày 22/10/2026 là file riêng cfa_quest_skin.js)
   ==================================================================================================== */
/* =============================================================================
   CFA Quest — Ethics · lớp skin (21/10/2026)

   Dùng bộ ảnh đã xử lý trong src/asset (danh mục: asset/assets.js → window.CFA_ASSETS,
   quy ước: asset/README_ASSETS.md). Phần này chỉ đổi cách VẼ:
   - thay các hàm trong GAME.renderer bằng sprite (nhân vật, quái, Boss, xu, sàn đấu)
   - vẽ bản đồ thế giới từ dashboardModel() thay cho bảng 7 ô (UI_HOOKS.afterDashboard)
   - cảnh chuyển trước khi vào màn chơi, Shop, Bảng tổng kết (UI_HOOKS.beforePlay)
   - màn đầu có cổng xoay, Shop có lái buôn
   Luật game, engine, câu hỏi không đổi. Thiếu assets.js hoặc ảnh lỗi thì game vẫn chạy bằng hình khối.
   ============================================================================= */

const SKIN = (() => {
  const A = window.CFA_ASSETS;
  if (!A || typeof GAME === 'undefined') return { active: false };
  const BASE = 'asset/';
  const K = A.spriteScale;                         // 2,5 px ảnh cho 1 px logic
  const TAU = Math.PI * 2;
  const C = GAME.config;
  document.body.classList.add('skin');

  /* ---------- 1. Nạp ảnh ---------- */
  const cache = new Map();
  function img(file) {
    let im = cache.get(file);
    if (!im) {
      im = new Image();
      im.decoding = 'async';
      im.src = BASE + file;
      cache.set(file, im);
    }
    return im;
  }
  const ok = im => im && im.complete && im.naturalWidth > 0;
  const url = file => `url('${BASE}${file}')`;   // nháy đơn: chuỗi này còn nằm trong thuộc tính style="…"
  const bgFile = key => A.bg[key] && A.bg[key].file;
  function preload(list) {
    return Promise.all(list.map(f => new Promise(res => {
      const im = img(f);
      if (ok(im)) return res();
      im.addEventListener('load', res, { once: true });
      im.addEventListener('error', res, { once: true });
    })));
  }
  // Ảnh nặng nạp dần sau khi trang mở
  const later = window.requestIdleCallback || (fn => setTimeout(fn, 600));
  later(() => {
    Object.values(A.sprites).forEach(s => img(s.file));
    Object.values(A.floors).forEach(f => img(bgFile(f.image)));
  });

  /* ---------- 2. Vẽ sprite ---------- */
  // frame: số khung trong sheet. (x, y) là toạ độ chân trên khung logic. flip: quay sang trái.
  function sprite(c, key, frame, x, y, opt = {}) {
    const s = A.sprites[key];
    if (!s) return false;
    const im = img(s.file);
    if (!ok(im)) return false;
    const f = Math.max(0, Math.min(s.frames - 1, frame | 0));
    const sc = opt.scale || 1;
    const w = s.fw / K * sc, h = s.fh / K * sc;
    const ax = s.anchor[0] / K * sc, ay = s.anchor[1] / K * sc;
    c.save();
    if (opt.alpha !== undefined) c.globalAlpha *= opt.alpha;
    if (opt.flip) { c.translate(x, y); c.scale(-1, 1); c.drawImage(im, f * s.fw, 0, s.fw, s.fh, -ax, -ay, w, h); }
    else c.drawImage(im, f * s.fw, 0, s.fw, s.fh, x - ax, y - ay, w, h);
    if (opt.flash) {                                // loé trắng khi bị chém
      c.globalCompositeOperation = 'source-atop';
      c.globalAlpha = opt.flash;
      c.fillStyle = '#fff';
      if (opt.flip) c.fillRect(-ax, -ay, w, h); else c.fillRect(x - ax, y - ay, w, h);
    }
    c.restore();
    return true;
  }
  // Khung theo thời gian. once: dừng ở khung cuối. clip: danh sách khung con.
  function frameAt(key, t, once, clip) {
    const s = A.sprites[key];
    const list = clip || null;
    const n = list ? list.length : s.frames;
    let i = Math.floor(t * s.fps);
    i = once ? Math.min(n - 1, i) : ((i % n) + n) % n;
    return list ? list[i] : i;
  }
  // Bóng dưới chân, đặt dưới sprite để nhân vật "đứng" trên sàn
  function shadow(c, x, y, w, a = 0.3) {
    c.fillStyle = `rgba(10,6,20,${a})`;
    c.beginPath(); c.ellipse(x, y, w, w * 0.32, 0, 0, TAU); c.fill();
  }

  /* ---------- 3. Thay hàm vẽ của lớp game ---------- */
  const R = GAME.renderer;
  const MOB_FACES_LEFT = true;
  const base = { ...R };                           // giữ hình khối làm phương án dự phòng
  const FLOOR = id => A.floors[id] ? bgFile(A.floors[id].image) : null;

  // Nền mờ cho phần màn hình nằm ngoài khung 960×540 (màn hình rộng): chính ảnh sàn phủ kín, làm mờ và tối.
  // Vẽ một lần vào canvas phụ, chỉ vẽ lại khi đổi sàn hoặc đổi cỡ màn hình.
  const backCache = { key: '', canvas: null };
  function backdropFor(f, cw, ch) {
    const key = `${f}|${cw}x${ch}`;
    if (backCache.key === key) return backCache.canvas;
    const im = img(f);
    if (!ok(im)) return null;
    const cv = backCache.canvas || document.createElement('canvas');
    cv.width = cw; cv.height = ch;
    const c = cv.getContext('2d');
    const sc = Math.max(cw / im.naturalWidth, ch / im.naturalHeight) * 1.08;
    const w = im.naturalWidth * sc, h = im.naturalHeight * sc;
    c.filter = 'blur(10px) brightness(.5) saturate(.85)';
    c.drawImage(im, (cw - w) / 2, (ch - h) / 2, w, h);
    c.filter = 'none';
    backCache.key = key; backCache.canvas = cv;
    return cv;
  }

  Object.assign(R, {
    backdrop(c, g, cam) {
      const f = FLOOR(g.floorId);
      const cv = f && backdropFor(f, cam.cw, cam.ch);
      if (!cv) return base.backdrop(c, g, cam);
      c.drawImage(cv, 0, 0);
      // bóng mờ quanh mép khung logic để chỗ nối liền mạch
      const x0 = cam.ox, x1 = cam.ox + C.view.width * cam.scale, y0 = cam.oy;
      const sh = 40 * cam.scale / 2;
      if (x0 > 1) {
        let gr = c.createLinearGradient(x0 - sh, 0, x0, 0);
        gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,.55)');
        c.fillStyle = gr; c.fillRect(x0 - sh, 0, sh, cam.ch);
        gr = c.createLinearGradient(x1, 0, x1 + sh, 0);
        gr.addColorStop(0, 'rgba(0,0,0,.55)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
        c.fillStyle = gr; c.fillRect(x1, 0, sh, cam.ch);
      }
      if (y0 > 1) {
        const gr = c.createLinearGradient(0, y0 - sh, 0, y0);
        gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,.55)');
        c.fillStyle = gr; c.fillRect(0, y0 - sh, cam.cw, sh);
      }
      const y1 = cam.oy + C.view.height * cam.scale;   // màn hình cao hơn 16:9 thì sàn nằm giữa, có dải dư phía dưới
      if (y1 < cam.ch - 1) {
        const gr = c.createLinearGradient(0, y1, 0, y1 + sh);
        gr.addColorStop(0, 'rgba(0,0,0,.55)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
        c.fillStyle = gr; c.fillRect(0, y1, cam.cw, sh);
      }
    },

    floor(c, g) {
      const f = FLOOR(g.floorId);
      const im = f && img(f);
      if (!ok(im)) return base.floor(c, g);
      c.imageSmoothingEnabled = true;
      c.drawImage(im, 0, 0, C.view.width, C.view.height);
    },

    player(c, p, g) {
      shadow(c, p.x, p.y, 15);
      const blink = p.invuln > 0 && p.anim !== 'down' && Math.floor(g.real * 14) % 2 === 0;
      const opt = { flip: p.face < 0, alpha: blink ? 0.45 : 1 };
      let drawn;
      const S = A.sprites;
      switch (p.anim) {
        case 'walk': drawn = sprite(c, 'player_walk', frameAt('player_walk', p.animT), p.x, p.y, opt); break;
        case 'attack': {
          const clip = [...S.player_attack.clips.slash, ...S.player_attack.clips.recover];
          drawn = sprite(c, 'player_attack', frameAt('player_attack', p.animT, true, clip), p.x, p.y, opt);
          break;
        }
        case 'hurt': drawn = sprite(c, 'player_hurt', frameAt('player_hurt', p.animT, true, S.player_hurt.clips.hit), p.x, p.y, opt); break;
        case 'down': drawn = sprite(c, 'player_hurt', S.player_hurt.clips.down[0], p.x, p.y, opt); break;
        case 'win': drawn = sprite(c, 'player_win', frameAt('player_win', p.animT, true), p.x, p.y, opt); break;
        case 'sad': drawn = sprite(c, 'player_sad', frameAt('player_sad', p.animT, true), p.x, p.y, opt); break;
        default: {
          const breathe = Math.round(Math.sin(g.real * 2.4) * 1.2);   // đứng thở: nhún 1–2 px
          drawn = sprite(c, 'player_stand', 0, p.x, p.y + breathe, opt);
        }
      }
      if (!drawn) base.player(c, p, g);
    },

    monster(c, m, g) {
      // Ảnh quái của bộ 21-10 vẽ quay mặt sang TRÁI (khác quy ước "sprite quay sang phải"),
      // nên lật khi quái cần nhìn sang phải để luôn hướng về nhân vật.
      const flip = MOB_FACES_LEFT ? m.face > 0 : m.face < 0;
      if (m.state === 'warn') {
        const k = Math.min(1, m.t / C.arena.spawn.warn);
        const fr = Math.min(A.sprites.mob_spawn.frames - 1, Math.floor(k * A.sprites.mob_spawn.frames));
        if (!sprite(c, 'mob_spawn', fr, m.x, m.y, { flip })) base.monster(c, m, g);
        return;
      }
      if (m.state === 'vanish') {
        if (!sprite(c, 'mob_vanish', frameAt('mob_vanish', m.t, true), m.x, m.y, { flip })) base.monster(c, m, g);
        return;
      }
      shadow(c, m.x, m.y, 13, 0.25);
      const bob = Math.sin(g.real * 3 + m.bob) * 3.5;  // lơ lửng 3–4 px, mỗi con lệch nhịp
      const flash = m.state === 'slashed' ? 0.55 + 0.35 * Math.sin(g.real * 30) : 0;
      if (!sprite(c, 'mob_idle', 0, m.x, m.y - 4 + bob, { flip, flash })) base.monster(c, m, g);
    },

    boss(c, b, g) {
      const feet = (A.floors.boss && A.floors.boss.bossFeet) || [b.x, b.y + 52];
      const [fx, fy] = feet;
      let key = 'boss_idle', fr = frameAt('boss_idle', b.animT), alpha = 1;
      if (b.anim === 'telegraph') { key = 'boss_telegraph'; fr = frameAt(key, b.animT, true); }
      else if (b.anim === 'hit') { key = 'boss_hit'; fr = frameAt(key, b.animT, true); }
      else if (b.anim === 'attack') { key = 'boss_attack'; fr = frameAt(key, b.animT, true); }
      else if (b.anim === 'defeat') {
        key = 'boss_defeat'; fr = frameAt(key, b.animT, true);
        alpha = Math.max(0, 1 - Math.max(0, b.animT - 0.8) / 0.5);
      }
      if (b.anim === 'telegraph') {                   // quầng sáng đỏ lớn dần khi báo hiệu
        const k = Math.min(1, b.cycleT / C.boss.pattern.telegraph);
        const gr = c.createRadialGradient(b.x, b.y, 10, b.x, b.y, 120);
        gr.addColorStop(0, `rgba(255,70,100,${0.35 * k})`);
        gr.addColorStop(1, 'rgba(255,70,100,0)');
        c.fillStyle = gr; c.beginPath(); c.arc(b.x, b.y, 120, 0, TAU); c.fill();
      }
      if (!sprite(c, key, fr, fx, fy, { alpha })) base.boss(c, b, g);
    },

    telegraph(c, b, g) {
      if (b.cycle !== 'telegraph') return;
      const pat = C.boss.pattern;
      const k = Math.min(1, b.cycleT / pat.telegraph);
      c.save();
      c.lineCap = 'round';
      for (let i = 0; i < pat.rays; i++) {
        const a = b.baseAngle + i * TAU / pat.rays;
        const x0 = b.x + Math.cos(a) * pat.emitRadius, y0 = b.y + Math.sin(a) * pat.emitRadius;
        const x1 = b.x + Math.cos(a) * 1200, y1 = b.y + Math.sin(a) * 1200;
        const first = i === 0;                         // vạch đầu tiên chĩa vào người chơi
        c.strokeStyle = first ? `rgba(255,214,90,${0.25 + 0.55 * k})` : `rgba(255,70,110,${0.15 + 0.45 * k})`;
        c.lineWidth = (first ? 4 : 2.5) + 6 * k;
        c.globalAlpha = 0.35;
        c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke();
        c.globalAlpha = 1;
        c.lineWidth = 1.5;
        c.setLineDash([12, 10]);
        c.lineDashOffset = -g.real * 60;
        c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke();
        c.setLineDash([]);
      }
      c.restore();
    },

    bullets(c, list, g) {
      const B = C.boss.bullet, col = A.colors || {};
      c.save();
      c.globalCompositeOperation = 'lighter';
      list.forEach(b => {
        c.save();
        c.translate(b.x, b.y); c.rotate(b.a);
        c.fillStyle = 'rgba(255,40,90,.28)';
        c.fillRect(-B.drawLength / 2 - 3, -B.drawWidth / 2 - 3, B.drawLength + 6, B.drawWidth + 6);
        c.fillStyle = col.bullet || '#ff3355';
        c.fillRect(-B.drawLength / 2, -B.drawWidth / 2, B.drawLength, B.drawWidth);
        c.fillStyle = col.bulletCore || '#fff';
        c.fillRect(-B.drawLength / 2 + 3, -1, B.drawLength - 6, 2);
        c.restore();
      });
      c.restore();
    },

    coin(c, k, g) {
      if (k.state === 'got') return;
      if (k.state !== 'fly') shadow(c, k.x, k.y, 7, 0.25);
      const fr = frameAt('coin_spin', g.real + k.i * 0.09);
      if (!sprite(c, 'coin_spin', fr, k.x, k.y - k.z)) base.coin(c, k, g);
    },

    fx(c, f, g) {
      const k = f.t / f.dur;
      if (f.type === 'slash') {
        c.save();
        const r = f.boss ? 60 : 36;
        const a0 = f.ang - 1.2 + k * 0.7, a1 = f.ang + 0.7 + k * 0.7;
        c.lineCap = 'round';
        c.strokeStyle = `rgba(255,236,170,${0.5 * (1 - k)})`;
        c.lineWidth = 14 * (1 - k) + 2;
        c.beginPath(); c.arc(f.x, f.y, r, a0, a1); c.stroke();
        c.strokeStyle = `rgba(255,255,255,${1 - k})`;
        c.lineWidth = 4 * (1 - k) + 1;
        c.beginPath(); c.arc(f.x, f.y, r, a0, a1); c.stroke();
        c.restore();
        return;
      }
      if (f.type === 'coin') {
        c.save();
        c.font = '800 15px "Be Vietnam Pro", system-ui, sans-serif';
        c.textAlign = 'center';
        c.lineWidth = 3; c.strokeStyle = 'rgba(58,34,12,' + (1 - k) + ')';
        c.fillStyle = 'rgba(242,182,50,' + (1 - k) + ')';
        c.strokeText('+1 Credit', f.x, f.y - 22 * k);
        c.fillText('+1 Credit', f.x, f.y - 22 * k);
        c.restore();
        return;
      }
      base.fx(c, f, g);
    },

    overlay(c, g) {
      if (g.phase === 'question' || g.phase === 'done') {
        const gr = c.createRadialGradient(480, 300, 120, 480, 300, 620);
        gr.addColorStop(0, 'rgba(10,6,20,.25)');
        gr.addColorStop(1, 'rgba(10,6,20,.6)');
        c.fillStyle = gr;
        c.fillRect(0, 0, C.view.width, C.view.height);
      }
    }
  });

  /* ---------- 4. Cảnh chuyển (MAP-01: bấm vùng → cảnh của vùng → màn chơi) ---------- */
  const fade = document.getElementById('sceneFade');
  const ZONE_OF = { arena1: 'arena1', trap1: 'arena2', crossroads: 'arena3', trap2: 'arena4', boss: 'boss', quest: 'world_quest', report: 'report', shop: 'shop' };
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const quick = () => (typeof DEMO !== 'undefined' && DEMO.active);   // demo: cảnh chuyển ngắn hơn

  async function transition(zoneKey, title) {
    const z = A.map.zones[zoneKey];
    const f = z && bgFile(z.transition);
    if (!f || !fade) return;
    await Promise.race([preload([f]), wait(1200)]);
    // Ảnh cảnh chuyển hiện trọn (contain), phần dư phủ bằng chính ảnh làm mờ
    fade.style.setProperty('--fade-bg', url(f));
    fade.innerHTML = '<div class="scene-blur"></div><div class="fade-img"></div>'
      + (title ? `<div class="scene-title"><span>${esc(title)}</span></div>` : '');
    fade.classList.remove('hidden');
    void fade.offsetWidth;
    fade.classList.add('show');
    await wait(quick() ? 650 : 1250);
  }
  function endTransition() {
    if (!fade) return;
    setTimeout(() => {
      fade.classList.remove('show');
      setTimeout(() => fade.classList.add('hidden'), 400);
    }, 60);
  }

  UI_HOOKS.beforePlay = async arena => {
    const key = ZONE_OF[arena.isQuest ? 'quest' : arena.id];
    const floor = FLOOR(FLOOR_OF[arena.isQuest ? 'quest' : arena.id]);
    const sprites = arena.id === 'boss'
      ? ['boss_idle', 'boss_telegraph', 'boss_hit', 'boss_attack', 'boss_defeat']
      : ['mob_spawn', 'mob_idle', 'mob_vanish'];
    const files = [floor, ...['player_stand', 'player_walk', 'player_attack', 'coin_spin'].concat(sprites).map(k => A.sprites[k].file)].filter(Boolean);
    const loading = preload(files);
    await transition(key, arena.name);
    await Promise.race([loading, wait(2500)]);
    endTransition();
  };

  /* ---------- 5. Hoạt ảnh sprite trên DOM (cổng xoay, lái buôn) ----------
     Vẽ từng khung bằng canvas thay cho CSS animation, để khung không bị trượt nửa ô. */
  function domSprite(canvas, key) {
    const c = canvas.getContext('2d');
    let cur = key, t0 = performance.now(), then = null;
    function setSize(k) {
      const s = A.sprites[k];
      if (canvas.width !== s.fw || canvas.height !== s.fh) { canvas.width = s.fw; canvas.height = s.fh; }
    }
    function tick(now) {
      requestAnimationFrame(tick);
      if (!canvas.isConnected || canvas.offsetParent === null) return;   // màn đang ẩn thì không vẽ
      const s = A.sprites[cur];
      const im = img(s.file);
      if (!ok(im)) return;
      const t = (now - t0) / 1000;
      let f = Math.floor(t * s.fps);
      if (!s.loop && f >= s.frames) {
        if (then) { cur = then; then = null; t0 = now; setSize(cur); return; }
        f = s.frames - 1;
      }
      f %= s.frames;
      setSize(cur);
      c.clearRect(0, 0, canvas.width, canvas.height);
      c.drawImage(im, f * s.fw, 0, s.fw, s.fh, 0, 0, s.fw, s.fh);
    }
    setSize(key);
    requestAnimationFrame(tick);
    // Chạy một hoạt cảnh một lần rồi quay lại hoạt cảnh nền (ví dụ lái buôn vẫy chào)
    return { play(k, back) { cur = k; then = back; t0 = performance.now(); setSize(k); } };
  }

  // Khung ảnh nền hiện trọn trong màn hình (kiểu contain, 22/10/2026). Toạ độ % bên trong khớp toạ độ % của ảnh gốc.
  // Phần màn hình dư ra hai bên (hoặc trên dưới) phủ bằng chính ảnh đó làm mờ, đặt ngay trước khung trong wrap.
  function sceneBox(wrap, cls, bgKey) {
    const b = A.bg[bgKey];
    const blur = document.createElement('div');
    blur.className = 'scene-blur';
    blur.setAttribute('aria-hidden', 'true');
    blur.style.backgroundImage = url(b.file);
    const el = document.createElement('div');
    el.className = 'scene-img ' + cls;
    el.style.setProperty('--ar', (b.w / b.h).toFixed(5));
    el.style.backgroundImage = url(b.file);
    wrap.prepend(blur, el);
    return el;
  }

  /* ---------- 6. Bản đồ thế giới phủ kín màn hình (thay bảng 7 ô) ---------- */
  const dash = document.getElementById('dashboard');
  const mapWrap = document.createElement('div');
  mapWrap.className = 'scene-full world-map-wrap';
  const mapBox = sceneBox(mapWrap, 'world-map', A.map.image);
  mapBox.id = 'worldMap';
  mapBox.setAttribute('role', 'group');
  mapBox.setAttribute('aria-label', 'Bản đồ hầm ngục');
  mapBox.innerHTML = '<div class="map-nodes" id="mapNodes"></div>';
  mapWrap.insertAdjacentHTML('beforeend', '<div class="zone-card hidden" id="zoneCard" role="dialog" aria-live="polite"></div>');
  dash.appendChild(mapWrap);
  let selected = null;
  let lastModel = [];

  const NODE_IMG = { done: 'node_passed', active: 'node_current', 'boss-gate': 'node_boss_locked', locked: 'node_locked', alert: 'node_alert' };
  const ACTION_LABEL = m => {
    if (m.id === 'shop') return 'Vào Shop';
    if (m.status === 'done') return 'Xem lại kết quả';
    if (m.status === 'boss-gate') return `Mở khoá Boss (${CONFIG.bossUnlockCost} Credit)`;
    if (m.status === 'locked') return 'Đang khoá';
    if (m.id === 'report') return 'Mở Bảng tổng kết';
    if (m.id === 'quest') return 'Vào World Quest';
    if (m.id === 'boss') return 'Vào Boss';
    return 'Vào màn';
  };

  function shopModel() {
    return {
      id: 'shop', num: '', status: 'active', badge: 'Mở', name: 'Shop · Lái buôn',
      desc: `${ITEMS.eliminate.name}: ${ITEMS.eliminate.cost} Credit`, rule: `Bạn có ${S.credits} Credit · ${S.inventory.eliminate} Bùa`,
      extra: '', tryLine: '', action: () => openShop('dashboard'), label: 'Shop'
    };
  }

  async function runAction(m) {
    if (!m.action) return;
    hideCard();
    // Shop và Bảng tổng kết có cảnh chuyển riêng; Arena chạy cảnh chuyển trong beforePlay
    if (m.id === 'shop') { await transition('shop', 'Lái buôn'); m.action(); endTransition(); return; }
    if (m.id === 'report' && m.status === 'active') { await transition('report', 'Bảng tổng kết'); m.action(); endTransition(); return; }
    m.action();
  }

  function renderMap(model) {
    lastModel = [...model, shopModel()];
    const nodes = document.getElementById('mapNodes');
    nodes.innerHTML = '';
    lastModel.forEach(m => {
      const z = A.map.zones[ZONE_OF[m.id]];
      if (!z) return;
      const status = m.id === 'quest' && m.status === 'active' ? 'alert' : m.id === 'shop' ? 'shop' : m.status;
      const b = document.createElement('button');
      b.type = 'button';
      b.className = `map-node st-${status}${m.id === 'boss' ? ' is-boss' : ''}`;
      b.style.left = z.node[0] + '%';
      b.style.top = z.node[1] + '%';
      b.dataset.zone = m.id;
      b.setAttribute('aria-label', `${m.name}: ${m.badge}`);
      const icon = NODE_IMG[status] ? A.ui[NODE_IMG[status]] : null;
      b.innerHTML = `${icon ? `<img src="${BASE}${icon.file}" alt="" draggable="false">` : '<span class="shop-dot"></span>'}<span class="node-label">${esc(m.name.replace(' · The Gate', ''))}</span>`;
      b.addEventListener('click', e => { e.stopPropagation(); showCard(m, b); });
      nodes.appendChild(b);
    });
    if (selected) {
      const m = lastModel.find(x => x.id === selected);
      const b = nodes.querySelector(`[data-zone="${selected}"]`);
      if (m && b) showCard(m, b); else hideCard();
    }
  }

  // Thẻ thông tin vùng đặt cạnh node, luôn nằm gọn trong màn hình
  function showCard(m, anchor) {
    selected = m.id;
    const card = document.getElementById('zoneCard');
    const disabled = !m.action;
    card.innerHTML = `<button type="button" class="zone-close" aria-label="Đóng">×</button>
      <div class="zone-badge st-${m.status}">${esc(m.badge)}</div>
      <h3>${esc(m.name)}</h3>
      <p>${esc(m.desc)}</p>
      ${m.rule ? `<p class="rule-line">${esc(m.rule)}</p>` : ''}
      ${m.extra || ''}
      ${m.tryLine ? `<p class="try">${esc(m.tryLine)}</p>` : ''}
      <button type="button" class="primary-btn zone-go" ${disabled ? 'disabled' : ''}>${esc(ACTION_LABEL(m))}</button>`;
    card.classList.remove('hidden');
    const wrap = mapWrap.getBoundingClientRect();
    const n = anchor.getBoundingClientRect();
    const cw = card.offsetWidth, ch = card.offsetHeight, gap = 16, pad = 12;
    let x = n.right + gap;
    if (x + cw > wrap.right - pad) x = n.left - gap - cw;
    let y = n.top + n.height / 2 - ch * 0.35;
    x = Math.max(wrap.left + pad, Math.min(x, wrap.right - pad - cw));
    y = Math.max(wrap.top + pad, Math.min(y, wrap.bottom - pad - ch));
    card.style.left = (x - wrap.left) + 'px';
    card.style.top = (y - wrap.top) + 'px';
    card.querySelector('.zone-close').addEventListener('click', hideCard);
    const go = card.querySelector('.zone-go');
    go.addEventListener('click', () => runAction(m));
    go.focus({ preventScroll: true });
  }
  function hideCard() {
    selected = null;
    const card = document.getElementById('zoneCard');
    if (card) card.classList.add('hidden');
  }
  // Bấm ra chỗ trống (trên bản đồ hoặc phần nền mờ hai bên) thì đóng thẻ vùng
  mapWrap.addEventListener('click', e => {
    const t = e.target;
    if (t === mapWrap || t === mapBox || t.id === 'mapNodes' || t.classList.contains('scene-blur')) hideCard();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') hideCard(); });
  window.addEventListener('resize', hideCard);

  UI_HOOKS.afterDashboard = renderMap;

  /* ---------- 7. Màn đầu: nền hiện trọn, cổng xoay, cụm logo lơ lửng ----------
     Logo và nút Bắt đầu nằm trong khung ảnh, đặt theo % ảnh bg_menu (CSS .menu-logo, .gate-btn),
     nên luôn đè đúng chỗ trên cổng đá dù màn hình to hay nhỏ. */
  const home = document.getElementById('home');
  const menu = home.querySelector('.menu');
  if (menu) {
    const P = A.menu.portal;
    menu.classList.add('scene-full', 'menu-scene');
    const box = sceneBox(menu, 'menu-cover', A.menu.image);
    box.innerHTML = `<canvas class="menu-portal" aria-hidden="true" style="left:${P.x}%;top:${P.y}%;width:${P.w}%;height:${P.h}%"></canvas>
      <img class="menu-logo" src="${BASE}${A.ui.logo_large.file}" alt="CFA Quest — Ethics, Level I">`;
    box.appendChild(document.getElementById('startBtn'));
    // Khung cổng đá đứng yên (đã có trong bg_menu); chỉ vòng xoáy bên trong chuyển động.
    // Lớp sáng sinh bởi tools/asset_pipeline/make_portal_glow.py, vẽ lên nền với chế độ hoà trộn "screen".
    const src = A.sprites[P.sprite];
    A.sprites.menu_portal_glow = A.sprites.menu_portal_glow || {
      frames: src.frames, fw: src.fw, fh: src.fh, fps: src.fps, loop: true,
      file: `sprites/spr_menu_portal_glow_${src.frames}x${src.fw}x${src.fh}.webp`
    };
    domSprite(box.querySelector('.menu-portal'), 'menu_portal_glow');
    document.getElementById('startBtn').classList.add('primary-btn');
    const foot = home.querySelector('.menu-foot');
    if (foot) menu.appendChild(foot);
  }

  /* ---------- 8. Shop: trong lều hiện trọn màn hình, lái buôn đứng sau bàn, Bùa lơ lửng trên bàn ----------
     Toạ độ % theo ảnh bg_shop (2752×1536): mép xa của mặt bàn ở y ≈ 49%, bàn chính x 40–60%. */
  const shop = document.getElementById('shop');
  if (shop) {
    const SHOP = { tableEdge: 49.5, merchant: { cx: 50, feet: 57, w: 10 }, charm: { cx: 50, bottom: 56.5, h: 7.5 } };
    const M = A.sprites.merchant_idle;
    const mh = SHOP.merchant.w * (M.fh / M.fw) * (A.bg.bg_shop.w / A.bg.bg_shop.h);   // chiều cao lái buôn, % chiều cao ảnh
    const scene = document.createElement('div');
    scene.className = 'scene-full shop-full';
    const box = sceneBox(scene, 'shop-cover', A.map.zones.shop.inside);
    const charmH = SHOP.charm.h;
    box.innerHTML = `
      <div class="merchant-clip" style="height:${SHOP.tableEdge}%">
        <canvas class="merchant" aria-hidden="true" style="left:${SHOP.merchant.cx - SHOP.merchant.w / 2}%;width:${SHOP.merchant.w}%;top:${(SHOP.merchant.feet - mh) / SHOP.tableEdge * 100}%;height:${mh / SHOP.tableEdge * 100}%"></canvas>
      </div>
      <div class="charm-glow" style="left:${SHOP.charm.cx}%;top:${SHOP.charm.bottom - 1}%"></div>
      <button type="button" class="shop-charm" id="shopCharm" style="left:${SHOP.charm.cx}%;top:${SHOP.charm.bottom - charmH}%;height:${charmH}%" aria-label="${esc(ITEMS.eliminate.name)}: bấm để xem và mua">
        <img src="${BASE}${A.ui.item_charm_large.file}" alt="" draggable="false">
      </button>
      <div class="speech" id="merchantSpeech">Chào lữ khách! Bấm vào lá Bùa trên bàn để xem nhé.</div>`;
    scene.insertAdjacentHTML('beforeend', `<div class="shop-panel hidden" id="shopPanel" role="dialog" aria-label="Mua vật phẩm">
        <button type="button" class="zone-close" id="shopPanelClose" aria-label="Đóng">×</button>
      </div>`);
    shop.prepend(scene);
    const panel = scene.querySelector('#shopPanel');
    // Chuyển ô số dư và lưới vật phẩm có sẵn vào khung dưới cùng: logic mua (renderShop, buyItem)
    // và điểm neo của thẻ hướng dẫn (#shopGrid .shop-item, .shop-note) giữ nguyên
    const note = shop.querySelector('.shop-note'), grid = document.getElementById('shopGrid');
    if (note) panel.appendChild(note);
    if (grid) panel.appendChild(grid);
    const back = document.getElementById('shopBack');
    if (back) { back.classList.add('shop-back'); scene.appendChild(back); }

    const merchant = domSprite(box.querySelector('.merchant'), 'merchant_idle');
    const openPanel = () => { panel.classList.remove('hidden'); document.getElementById('merchantSpeech').textContent = `${ITEMS.eliminate.name}: loại 1 phương án sai, giá ${ITEMS.eliminate.cost} Credit.`; };
    const closePanel = () => panel.classList.add('hidden');
    box.querySelector('#shopCharm').addEventListener('click', openPanel);
    panel.querySelector('#shopPanelClose').addEventListener('click', closePanel);

    const origOpen = openShop;
    window.openShop = function (from) {
      closePanel();
      document.getElementById('merchantSpeech').textContent = 'Chào lữ khách! Bấm vào lá Bùa trên bàn để xem nhé.';
      origOpen(from);
      merchant.play('merchant_greet', 'merchant_idle');   // lái buôn vẫy chào mỗi lần vào Shop
      // Lần đầu vào Shop có thẻ hướng dẫn chỉ vào khung mua: mở sẵn khung để thẻ chỉ đúng chỗ
      let seen = {};
      try { seen = JSON.parse(store.get('cfaQuestTutorialSeen') || '{}'); } catch { seen = {}; }
      if (!seen.shop_a || !seen.shop_b) openPanel();
    };
  }

  /* ---------- 9. Biểu tượng trên thanh HUD ---------- */
  const brand = document.querySelector('.topbar .brand');
  if (brand) brand.innerHTML = `<img src="${BASE}${A.ui.logo_small.file}" alt="CFA Quest">`;

  // Đặt biến CSS cho ảnh UI để file CSS không phải ghi đường dẫn từng ảnh
  const root = document.documentElement.style;
  Object.entries(A.ui).forEach(([k, v]) => root.setProperty(`--ui-${k.replace(/_/g, '-')}`, url(v.file)));
  root.setProperty('--spr-coin', url(A.sprites.coin_icon.file));
  Object.entries(A.bg).forEach(([k, v]) => root.setProperty(`--bg-${k}`, url(v.file)));

  return { active: true, transition, img, sprite };
})();
