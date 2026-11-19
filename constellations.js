// Motion and rendering follow the AI × Space Forum hero.
(() => {
  const canvas = document.createElement('canvas');
  canvas.id = 'constellations';
  canvas.setAttribute('aria-hidden', 'true');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let stars = [], width, height, frame, previous;
  let pullX = 0, pullY = 0;
  document.body.prepend(canvas);
  const palette = getComputedStyle(canvas);
  const starColor = palette.getPropertyValue('--star-color').trim();
  const lineColor = palette.getPropertyValue('--star-line').trim();
  function draw(elapsed) {
    ctx.clearRect(0, 0, width, height);
    const step = elapsed * 60;
    for (const star of stars) {
      star.vx = Math.max(-.45, Math.min(.45, star.vx + pullX * step));
      star.vy = Math.max(-.45, Math.min(.45, star.vy + pullY * step));
      star.x = (star.x + star.vx * step + width) % width;
      star.y = (star.y + star.vy * step + height) % height;
    }
    ctx.strokeStyle = lineColor;
    ctx.fillStyle = starColor;
    ctx.lineWidth = .8;
    for (const [i, star] of stars.entries()) {
      for (let j = i + 1; j < stars.length; j++) {
        const next = stars[j];
        const distance = Math.hypot(next.x - star.x, next.y - star.y);
        if (distance >= 120) continue;
        ctx.globalAlpha = .55 * (1 - distance / 120);
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(next.x, next.y);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, 2 * Math.PI);
      ctx.globalAlpha = .75;
      ctx.fill();
    }
  }
  function animate(now) {
    draw(Math.min((now - previous) / 1000, 0.05));
    previous = now;
    frame = requestAnimationFrame(animate);
  }
  function resize() {
    cancelAnimationFrame(frame);
    if (document.hidden || !canvas.clientWidth) return;
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    pullX = 0;
    pullY = 0;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = Math.min(100, Math.max(24, Math.round(width * height / 10000)));
    stars = Array.from({length: count}, () => ({
      x: Math.random() * width, y: Math.random() * height,
      radius: .6 + Math.random() * 1.6,
      vx: (Math.random() - .5) * .22, vy: (Math.random() - .5) * .22
    }));
    draw(0);
    previous = performance.now();
    if (!motion.matches) frame = requestAnimationFrame(animate);
  }
  window.addEventListener('pointermove', event => {
    if (motion.matches || !canvas.clientWidth) return;
    const bounds = canvas.getBoundingClientRect();
    pullX = (event.clientX - bounds.left - width / 2) * .000007;
    pullY = (event.clientY - bounds.top - height / 2) * .000007;
  }, {passive: true});
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', resize);
  motion.addEventListener('change', resize);
  resize();
})();
