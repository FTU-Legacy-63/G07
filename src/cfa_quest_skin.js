'use strict';
/* =============================================================================
   CFA Quest — Ethics · lớp skin (21/10/2026)

   Dùng bộ ảnh đã xử lý trong src/asset (danh mục: asset/assets.js → window.CFA_ASSETS,
   quy ước: asset/README_ASSETS.md). File này chỉ đổi cách VẼ:
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
    fade.style.backgroundImage = url(f);
    fade.innerHTML = title ? `<div class="scene-title"><span>${esc(title)}</span></div>` : '';
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

  // Khung ảnh nền phủ kín màn hình (kiểu cover). Toạ độ % bên trong khớp toạ độ % của ảnh gốc.
  function coverBox(cls, bgKey) {
    const b = A.bg[bgKey];
    const el = document.createElement('div');
    el.className = 'cover ' + cls;
    el.style.setProperty('--ar', (b.w / b.h).toFixed(5));
    el.style.backgroundImage = url(b.file);
    return el;
  }

  /* ---------- 6. Bản đồ thế giới phủ kín màn hình (thay bảng 7 ô) ---------- */
  const dash = document.getElementById('dashboard');
  const mapWrap = document.createElement('div');
  mapWrap.className = 'scene-full world-map-wrap';
  const mapBox = coverBox('world-map', A.map.image);
  mapBox.id = 'worldMap';
  mapBox.setAttribute('role', 'group');
  mapBox.setAttribute('aria-label', 'Bản đồ hầm ngục');
  mapBox.innerHTML = '<div class="map-nodes" id="mapNodes"></div>';
  mapWrap.appendChild(mapBox);
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
  mapBox.addEventListener('click', e => { if (e.target === mapBox || e.target.id === 'mapNodes') hideCard(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') hideCard(); });
  window.addEventListener('resize', hideCard);

  UI_HOOKS.afterDashboard = renderMap;

  /* ---------- 7. Màn đầu: nền phủ kín, cổng xoay, cụm logo lơ lửng ---------- */
  const home = document.getElementById('home');
  const menu = home.querySelector('.menu');
  if (menu) {
    const P = A.menu.portal;
    menu.classList.add('scene-full', 'menu-scene');
    const box = coverBox('menu-cover', A.menu.image);
    box.innerHTML = `<canvas class="menu-portal" aria-hidden="true" style="left:${P.x}%;top:${P.y}%;width:${P.w}%;height:${P.h}%"></canvas>`;
    menu.prepend(box);
    menu.insertAdjacentHTML('afterbegin', `<img class="menu-logo" src="${BASE}${A.ui.logo_large.file}" alt="CFA Quest — Ethics, Level I">`);
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

  /* ---------- 8. Shop: trong lều phủ kín màn hình, lái buôn đứng sau bàn, Bùa lơ lửng trên bàn ----------
     Toạ độ % theo ảnh bg_shop (2752×1536): mép xa của mặt bàn ở y ≈ 49%, bàn chính x 40–60%. */
  const shop = document.getElementById('shop');
  if (shop) {
    const SHOP = { tableEdge: 49.5, merchant: { cx: 50, feet: 57, w: 10 }, charm: { cx: 50, bottom: 56.5, h: 7.5 } };
    const M = A.sprites.merchant_idle;
    const mh = SHOP.merchant.w * (M.fh / M.fw) * (A.bg.bg_shop.w / A.bg.bg_shop.h);   // chiều cao lái buôn, % chiều cao ảnh
    const scene = document.createElement('div');
    scene.className = 'scene-full shop-full';
    const box = coverBox('shop-cover', A.map.zones.shop.inside);
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
    scene.appendChild(box);
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
