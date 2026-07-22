// Active nav on scroll
const navLinks = document.querySelectorAll('.nav-links a');
const sections = ['experience', 'education', 'impact', 'contact'].map((id) =>
  document.getElementById(id)
);

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach((section) => {
    if (section && window.scrollY >= section.offsetTop - 220) {
      current = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.style.color =
      link.getAttribute('href') === `#${current}` ? 'var(--accent)' : '';
  });
});

// =============================================
// Low-Code Technology Hero Animation
// Subtle, looping network of connected nodes
// representing visual modeling, flows, components
// Fully responsive + respects prefers-reduced-motion
// =============================================
(function initHeroAnimation() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  let width = 0;
  let height = 0;
  let nodes = [];
  let time = 0;
  let nodeCount = 16;
  const MAX_DIST = 185;
  const BASE_SPEED = 0.35;

  let reducedMotion = false;
  try {
    reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {}

  function updateNodeCount() {
    const w = window.innerWidth;
    if (w < 480) nodeCount = 9;
    else if (w < 768) nodeCount = 12;
    else nodeCount = 16;
  }

  function resizeCanvas() {
    width = canvas.offsetWidth || window.innerWidth;
    height = canvas.offsetHeight || Math.max(600, window.innerHeight * 0.9);
    canvas.width = width;
    canvas.height = height;
  }

  function createNodes() {
    nodes = [];
    updateNodeCount();
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * (height * 0.95),
        vx: (Math.random() - 0.5) * BASE_SPEED,
        vy: (Math.random() - 0.5) * BASE_SPEED,
        radius: Math.random() * 2.2 + 1.8,
        phase: Math.random() * Math.PI * 2,
        type: Math.random() > 0.65 ? 'accent' : 'normal'
      });
    }
  }

  function updateNodes() {
    for (let node of nodes) {
      node.x += node.vx;
      node.y += node.vy;

      const pad = 28;
      if (node.x < pad) { node.x = pad; node.vx = Math.abs(node.vx); }
      if (node.x > width - pad) { node.x = width - pad; node.vx = -Math.abs(node.vx); }
      if (node.y < pad) { node.y = pad; node.vy = Math.abs(node.vy); }
      if (node.y > height - pad) { node.y = height - pad; node.vy = -Math.abs(node.vy); }

      node.vx += (Math.random() - 0.5) * 0.018;
      node.vy += (Math.random() - 0.5) * 0.018;

      const speed = Math.hypot(node.vx, node.vy);
      if (speed > 0.55) {
        node.vx = (node.vx / speed) * 0.55;
        node.vy = (node.vy / speed) * 0.55;
      }

      const oscAmp = 0.22;
      node.x += Math.sin(time * 0.42 + node.phase) * oscAmp;
      node.y += Math.cos(time * 0.51 + node.phase * 1.1) * oscAmp * 0.9;

      node.x = Math.max(pad, Math.min(width - pad, node.x));
      node.y = Math.max(pad, Math.min(height - pad, node.y));
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Subtle tech grid
    ctx.strokeStyle = 'rgba(97, 93, 85, 0.045)';
    ctx.lineWidth = 1;
    const grid = 52;
    for (let x = grid; x < width; x += grid) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = grid; y < height; y += grid) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Connections
    ctx.lineWidth = 1.15;
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);

        if (dist < MAX_DIST && dist > 4) {
          const alpha = Math.pow(1 - dist / MAX_DIST, 1.15) * 0.22;

          let r = 97, g = 93, b = 85;
          const pulse = Math.sin(time * 0.9 + i * 1.7 + j) > 0.65;
          if (pulse || a.type === 'accent' || b.type === 'accent') {
            r = 217; g = 119; b = 87;
          }

          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();

          if (!reducedMotion && dist < MAX_DIST * 0.78 && (i + j) % 4 < 2) {
            const speed = 0.9 + Math.sin(time * 0.3) * 0.15;
            const t = ((time * speed) + (i * 0.3)) % 1;
            const px = a.x + (b.x - a.x) * t;
            const py = a.y + (b.y - a.y) * t;

            const flowAlpha = alpha * 1.35;
            ctx.fillStyle = `rgba(217, 119, 87, ${flowAlpha})`;
            ctx.beginPath();
            ctx.arc(px, py, 1.65, 0, Math.PI * 2);
            ctx.fill();

            const t2 = (t - 0.12 + 1) % 1;
            const px2 = a.x + (b.x - a.x) * t2;
            const py2 = a.y + (b.y - a.y) * t2;
            ctx.fillStyle = `rgba(217, 119, 87, ${flowAlpha * 0.55})`;
            ctx.beginPath();
            ctx.arc(px2, py2, 1.1, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }

    // Nodes
    for (let node of nodes) {
      const pulse = 1 + Math.sin(time * 1.35 + node.phase) * 0.18;
      const r = node.radius * pulse;

      ctx.fillStyle = 'rgba(37, 35, 31, 0.09)';
      ctx.beginPath();
      ctx.arc(node.x, node.y, r * 0.95, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(97, 93, 85, 0.32)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
      ctx.stroke();

      const highlight = Math.sin(time * 0.75 + node.phase * 1.3) > 0.78 || node.type === 'accent';
      if (highlight) {
        const ringSize = r + 4.5 + Math.sin(time * 1.1 + node.phase) * 1.5;
        ctx.strokeStyle = 'rgba(217, 119, 87, 0.38)';
        ctx.lineWidth = 1.9;
        ctx.beginPath();
        ctx.arc(node.x, node.y, ringSize, 0, Math.PI * 2);
        ctx.stroke();
      }

      if (node.type === 'accent' || Math.random() < 0.3) {
        ctx.fillStyle = 'rgba(217, 119, 87, 0.25)';
        ctx.beginPath();
        ctx.arc(node.x, node.y, Math.max(0.8, r * 0.28), 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function animate() {
    if (reducedMotion) return;
    updateNodes();
    draw();
    time += 0.018;
    requestAnimationFrame(animate);
  }

  function start() {
    resizeCanvas();
    createNodes();
    draw();

    if (!reducedMotion) {
      animate();
    }

    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const oldW = width;
        const oldH = height;
        resizeCanvas();
        updateNodeCount();

        const scaleX = width / (oldW || width);
        const scaleY = height / (oldH || height);
        for (let node of nodes) {
          node.x *= scaleX;
          node.y *= scaleY;
          node.x = Math.max(20, Math.min(width - 20, node.x));
          node.y = Math.max(20, Math.min(height - 20, node.y));
        }

        if (nodes.length !== nodeCount) {
          createNodes();
        }
        draw();
      }, 120);
    });
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    start();
  } else {
    window.addEventListener('load', start);
  }
})();