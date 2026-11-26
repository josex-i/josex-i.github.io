/* Hero: portrait rebuilt from small tiles that fly in, settle, and shy away from the mouse.
   Uses the transparent photo set as `portrait` in content.js. You normally don't need to edit this. */
(function () {
  const C = window.CONTENT || CONTENT;
  const hero = document.querySelector(".hero");
  const canvas = document.getElementById("mosaic");
  if (!hero || !canvas || !C.portrait) return;
  const ctx = canvas.getContext("2d");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lowPower = matchMedia("(pointer: coarse)").matches || innerWidth < 760;   // phones & tablets

  /* live Kisumu clock in the meta row */
  const clock = document.getElementById("clock");
  const tick = () => { if (clock) clock.textContent = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Nairobi" }) + " EAT"; };
  tick(); setInterval(tick, 30000);

  // accent tints drawn from the photos on this site (cathedral purple, NewDawn orange, ledger green, gold, sky)
  const TINTS = [[124, 58, 237], [245, 140, 30], [31, 168, 100], [201, 162, 39], [80, 140, 240]];
  let W = 0, H = 0, dpr = 1, tiles = [], specks = [], mouse = { x: -9999, y: -9999 }, running = false, visible = true, settledFrames = 0;

  const img = new Image();
  img.src = C.portrait;
  img.onload = () => { build(); start(); };

  function build() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = hero.clientWidth; H = hero.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const narrow = W < 760;
    const ph = H * (narrow ? 0.62 : 0.9);              // portrait height on screen
    const pw = ph * img.width / img.height;
    const cell = Math.max(5, Math.round(ph / (narrow ? 56 : 95)));   // fewer, bigger tiles on phones
    const cols = Math.round(pw / cell), rows = Math.round(ph / cell);
    const ox = (W - cols * cell) / 2 + (narrow ? 0 : W * 0.06);
    const oy = H - rows * cell - (narrow ? H * 0.14 : 0);

    const off = document.createElement("canvas");
    off.width = cols; off.height = rows;
    const o = off.getContext("2d", { willReadFrequently: true });
    o.drawImage(img, 0, 0, cols, rows);
    const px = o.getImageData(0, 0, cols, rows).data;

    tiles = [];
    const instant = reduce || document.hidden;   // opened in a background tab: show the finished portrait straight away
    let seed = 7;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    // stretch the photo's own brightness range to full contrast, so features read clearly
    let lo = 1, hi = 0;
    const lumAt = (i) => (0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2]) / 255;
    for (let i = 0; i < px.length; i += 4) if (px[i + 3] >= 110) { const v = lumAt(i); if (v < lo) lo = v; if (v > hi) hi = v; }
    const span = Math.max(0.05, hi - lo);
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      const i = (y * cols + x) * 4;
      if (px[i + 3] < 110) continue;
      const n = Math.min(1, Math.max(0, (lumAt(i) - lo) / span));
      const l = 0.12 + 0.88 * Math.pow(n, 0.85);
      let r = 245 * l, g = 243 * l, b = 238 * l;
      if (rnd() < 0.07) { const t = TINTS[(rnd() * TINTS.length) | 0]; const k = 0.45 + 0.55 * l; r = t[0] * k; g = t[1] * k; b = t[2] * k; }
      const hx = ox + x * cell, hy = oy + y * cell;
      tiles.push({
        hx, hy,
        x: instant ? hx : Math.random() * W, y: instant ? hy : Math.random() * H * 1.2 - H * 0.1,
        vx: 0, vy: 0,
        s: cell * (0.34 + 0.56 * l),
        c: `rgb(${r | 0},${g | 0},${b | 0})`,
        d: 0.03 + rnd() * 0.05,                          // per-tile stiffness: they arrive at different speeds
      });
    }
    specks = Array.from({ length: narrow ? 30 : 140 }, () => ({
      x: Math.random() * W, y: Math.random() * H, s: 1 + Math.random() * 3,
      vx: (Math.random() - 0.5) * 0.15, vy: (Math.random() - 0.5) * 0.15,
      a: 0.08 + Math.random() * 0.35, t: TINTS[(Math.random() * TINTS.length) | 0],
    }));
    settledFrames = 0;
    if (instant) draw();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const p of specks) {
      ctx.fillStyle = `rgba(${p.t[0]},${p.t[1]},${p.t[2]},${p.a})`;
      ctx.fillRect(p.x, p.y, p.s, p.s);
    }
    for (const t of tiles) { ctx.fillStyle = t.c; ctx.fillRect(t.x, t.y, t.s, t.s); }
  }

  function step() {
    let moving = 0;
    const R = 110, R2 = R * R;
    for (const t of tiles) {
      let ax = (t.hx - t.x) * t.d, ay = (t.hy - t.y) * t.d;
      const dx = t.x - mouse.x, dy = t.y - mouse.y, d2 = dx * dx + dy * dy;
      if (d2 < R2) { const f = (1 - d2 / R2) * 6; const d = Math.sqrt(d2) || 1; ax += dx / d * f; ay += dy / d * f; }
      t.vx = (t.vx + ax) * 0.82; t.vy = (t.vy + ay) * 0.82;
      t.x += t.vx; t.y += t.vy;
      if (Math.abs(t.vx) + Math.abs(t.vy) > 0.05) moving++;
    }
    for (const p of specks) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0; if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
    }
    draw();
    settledFrames = moving ? 0 : settledFrames + 1;
  }

  function loop() {
    if (!visible) { running = false; return; }
    step();
    // once settled and the mouse is away: on phones stop completely; on desktop drift gently at low frame rate
    if (settledFrames > 60 && mouse.x < -999) {
      running = false;
      if (!lowPower) setTimeout(start, 120);
      return;
    }
    requestAnimationFrame(loop);
  }
  function start() { if (reduce || running || !visible) return; running = true; requestAnimationFrame(loop); }

  hero.addEventListener("pointermove", (e) => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; start(); });
  hero.addEventListener("pointerleave", () => { mouse.x = mouse.y = -9999; start(); });
  new IntersectionObserver(([e]) => { visible = e.isIntersecting && !document.hidden; if (visible) start(); }).observe(hero);
  document.addEventListener("visibilitychange", () => { visible = !document.hidden && hero.getBoundingClientRect().bottom > 0; if (visible) start(); });
  let rt; addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { if (Math.abs(hero.clientWidth - W) > 40) { build(); start(); } }, 200); });
})();
