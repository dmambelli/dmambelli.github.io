(() => {
  const canvas = document.getElementById('swarm-canvas');
  const error = document.getElementById('swarm-error');
  if (!window.ThreeZoneSwarm || !canvas.getContext('2d')) {
    error.hidden = false;
    error.textContent = 'The swarm could not start. Reload this page.';
    return;
  }

  const slider = document.getElementById('reach');
  const value = document.getElementById('reach-value');
  const startForm = document.getElementById('start-form');
  const countInput = document.getElementById('agent-count');
  const alignment = document.getElementById('alignment');
  const rotation = document.getElementById('rotation');
  const viewWidth = 1.2, viewHeight = 0.75, fps = 18, frameMs = 1000 / fps;
  let seed = 7;
  let swarm = new ThreeZoneSwarm(seed, Number(slider.value), Number(countInput.value));
  let cameraX = 0, cameraY = 0, lastFrame = 0;

  function draw() {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.round(rect.width * ratio);
    const height = Math.round(rect.height * ratio);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    const metrics = swarm.measures();
    cameraX += 0.04 * (metrics.centerX - cameraX);
    cameraY += 0.04 * (metrics.centerY - cameraY);
    alignment.textContent = metrics.alignment.toFixed(2);
    rotation.textContent = metrics.rotation.toFixed(2);
    const context = canvas.getContext('2d');
    const scale = rect.width / viewWidth;
    const left = cameraX - viewWidth / 2, top = cameraY - viewHeight / 2;
    context.setTransform(ratio * scale, 0, 0, ratio * scale,
      -ratio * scale * left, -ratio * scale * top);
    context.fillStyle = '#fff';
    context.fillRect(left, top, viewWidth, viewHeight);

    context.fillStyle = '#e9e9e9';
    for (let x = Math.floor(left / 0.08) * 0.08; x < left + viewWidth; x += 0.08) {
      for (let y = Math.floor(top / 0.08) * 0.08; y < top + viewHeight; y += 0.08) {
        context.beginPath();
        context.arc(x, y, 0.0012, 0, 2 * Math.PI);
        context.fill();
      }
    }
    context.fillStyle = '#151515';
    for (let i = 0; i < swarm.count; i++) {
      context.save();
      context.translate(swarm.x[i], swarm.y[i]);
      context.rotate(Math.atan2(swarm.vy[i], swarm.vx[i]));
      context.beginPath();
      context.moveTo(0.009, 0);
      context.lineTo(-0.006, 0.006);
      context.lineTo(-0.0025, 0);
      context.lineTo(-0.006, -0.006);
      context.closePath();
      context.fill();
      context.restore();
    }
  }

  function tick(time) {
    if (!lastFrame) lastFrame = time;
    const elapsed = time - lastFrame;
    if (elapsed >= frameMs) {
      swarm.step();
      draw();
      lastFrame = elapsed > 2 * frameMs ? time : lastFrame + frameMs;
    }
    requestAnimationFrame(tick);
  }

  slider.addEventListener('input', () => {
    const radius = Number(slider.value);
    value.textContent = radius.toFixed(3);
    swarm.setAlignmentRadius(radius);
  });
  startForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!startForm.reportValidity()) return;
    const count = Number(countInput.value);
    if (count === swarm.count) seed++;
    swarm = new ThreeZoneSwarm(seed, Number(slider.value), count);
    cameraX = 0;
    cameraY = 0;
    draw();
    console.info(`New swarm start: seed ${seed}, ${swarm.count} agents`);
  });
  new ResizeObserver(draw).observe(canvas);
  draw();
  console.info(`Three-zone swarm: seed ${seed}, ${swarm.count} agents, ${fps} fps`);
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) requestAnimationFrame(tick);
})();
