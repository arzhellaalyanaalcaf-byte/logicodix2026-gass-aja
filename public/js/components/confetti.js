// Konfeti kanvas ringan (berhenti otomatis).
export function confetti(canvas, { duration = 5200, count = 140 } = {}) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const resize = () => { canvas.width = canvas.clientWidth * dpr; canvas.height = canvas.clientHeight * dpr; };
  resize();
  const colors = ['#1a56db', '#5b8ff2', '#fbbf24', '#f472b6', '#22c55e', '#f97316', '#7c5cf0', '#38bdf8'];
  const W = () => canvas.width; const H = () => canvas.height;
  const parts = Array.from({ length: count }, () => ({
    x: Math.random() * W(), y: -Math.random() * H() * 0.8,
    w: (6 + Math.random() * 6) * dpr, h: (10 + Math.random() * 8) * dpr,
    vy: (1.6 + Math.random() * 2.4) * dpr, vx: (Math.random() - 0.5) * 1.6 * dpr,
    r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.2, c: colors[(Math.random() * colors.length) | 0],
    sway: Math.random() * Math.PI * 2,
  }));
  const start = performance.now();
  let raf;
  const tick = (t) => {
    const el = t - start;
    ctx.clearRect(0, 0, W(), H());
    const fade = el > duration - 1200 ? Math.max(0, (duration - el) / 1200) : 1;
    for (const p of parts) {
      p.sway += 0.04; p.x += p.vx + Math.sin(p.sway) * 0.6 * dpr; p.y += p.vy; p.r += p.vr;
      if (p.y > H() + 20 && el < duration - 1500) { p.y = -20; p.x = Math.random() * W(); }
      ctx.save(); ctx.globalAlpha = fade; ctx.translate(p.x, p.y); ctx.rotate(p.r);
      ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.sway)));
      ctx.restore();
    }
    if (el < duration) raf = requestAnimationFrame(tick); else ctx.clearRect(0, 0, W(), H());
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}
