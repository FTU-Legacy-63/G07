'use strict';
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

   File này không đụng S, RUN của engine và không vẽ ảnh. Hình vẽ mặc định là hình khối;
   lớp skin (cfa_quest_skin.js) thay các hàm trong GAME.renderer bằng sprite.
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
  // Khung logic 960×540 phủ kín màn hình (kiểu "cover"): màn hình khác tỉ lệ 16:9 thì phần thừa bị cắt,
  // camera bám theo nhân vật để nhân vật luôn trong khung. Không đổi luật hay toạ độ.
  // Arena 1–4, World Quest: ảnh sàn phủ kín màn hình, camera bám nhân vật (viewTop = null).
  // Boss: luôn thấy cả Boss lẫn nhân vật, nên hiện đủ từ y = viewTop tới mép dưới, chừa hudReserve px (CSS)
  // phía trên cho thanh máu; màn hình rộng hơn thì phần dư hai bên phủ bằng ảnh sàn làm mờ (renderer.backdrop).
  camera: { follow: 6, maxPixelRatio: 2, viewTop: { arena: null, boss: 34 }, hudReserve: { arena: 0, boss: 64 } }
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

  // Phủ kín canvas: phóng to tối đa nhưng vẫn thấy đủ phần sàn cần cho lối chơi (từ y = viewTop),
  // camera bám nhân vật khi khung logic lớn hơn màn hình; nhỏ hơn thì canh giữa và căn đáy.
  function camera(dt) {
    const V = C.view, cw = canvas.width, ch = canvas.height;
    const kind = G.boss ? 'boss' : 'arena';
    const reserve = C.camera.hudReserve[kind] * pxRatio;
    const top = C.camera.viewTop[kind];
    const cover = Math.max(cw / V.width, ch / V.height);
    const fit = top === null ? cover : (ch - reserve) / (V.height - top);
    const scale = Math.min(cover, fit);
    const vw = cw / scale, vh = ch / scale;
    const minTop = top === null ? 0 : top - reserve / scale;   // điểm cao nhất được phép đưa lên mép trên màn hình
    const P = G.player;
    const tx = vw >= V.width ? V.width / 2 : clamp(P.x, vw / 2, V.width - vw / 2);
    const lowY = Math.max(minTop + vh / 2, V.height - vh / 2);
    const ty = vh >= V.height - minTop ? V.height - vh / 2 : clamp(P.y, minTop + vh / 2, V.height - vh / 2);
    if (!G.cam) G.cam = { x: tx, y: Math.min(ty, lowY) };
    if (dt) {
      const k = 1 - Math.exp(-C.camera.follow * dt);
      G.cam.x += (tx - G.cam.x) * k;
      G.cam.y += (ty - G.cam.y) * k;
    }
    if (vw >= V.width) G.cam.x = V.width / 2; else G.cam.x = clamp(G.cam.x, vw / 2, V.width - vw / 2);
    if (vh >= V.height - minTop) G.cam.y = V.height - vh / 2; else G.cam.y = clamp(G.cam.y, minTop + vh / 2, V.height - vh / 2);
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
