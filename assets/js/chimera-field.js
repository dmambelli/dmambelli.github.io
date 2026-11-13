(() => {
  const canvas = document.getElementById('field-canvas');
  const error = document.getElementById('field-error');
  const context = window.ChimeraField && canvas.getContext('2d');
  if (!context) {
    error.hidden = false;
    error.textContent = 'The simulation could not start. Reload this page.';
    return;
  }

  const slider = document.getElementById('lag');
  const value = document.getElementById('lag-value');
  const regimeLabel = document.getElementById('lag-regime');
  const scale = document.getElementById('lag-scale');
  const restart = document.getElementById('restart');
  const incoherent = document.getElementById('incoherent');
  const time = document.getElementById('time');
  const fps = 30, frameMs = 1000 / fps, stepsPerFrame = 3, ink = 21;
  let seed = 7;
  let field = new ChimeraField(seed, Number(slider.value));
  // One canvas pixel per oscillator; CSS scales it up without smoothing.
  canvas.width = field.columns;
  canvas.height = field.rows;
  const image = context.createImageData(field.columns, field.rows);
  let lastFrame = 0;

  // Rough boundaries from lag scans of a 120 x 120 grid with radius 8; only the quarter cycle is exact.
  const quarterCycle = Math.PI / 2;
  const regimes = [
    { from: 0, name: 'point-like cores' },
    { from: 0.2, name: 'stable spiral chimeras' },
    { from: 1.025, name: 'cores wander and break up' },
    { from: 1.175, name: 'patchy turbulence' },
    { from: quarterCycle, name: 'disorder fading into stripes' },
  ];

  function regime(lag) {
    if (Math.abs(lag - quarterCycle) < 0.005) return 'coupling flips to repelling';
    return regimes.findLast(({ from }) => lag >= from).name;
  }

  function showLag() {
    const lag = Number(slider.value);
    const name = regime(lag);
    value.textContent = lag.toFixed(2);
    regimeLabel.textContent = name;
    slider.setAttribute('aria-valuetext', `${lag.toFixed(2)}, ${name}`);
  }

  const min = Number(slider.min), max = Number(slider.max);
  for (const { from } of regimes.slice(1)) {
    const mark = document.createElement('span');
    mark.className = from === quarterCycle ? 'lag-mark exact' : 'lag-mark';
    mark.style.setProperty('--at', (from - min) / (max - min));
    scale.append(mark);
  }

  function draw() {
    // Wave crests (phase near zero) are dark; the random phases of a spiral core read as speckle.
    for (let i = 0; i < field.count; i++) {
      const crest = ((1 + field.cos[i]) / 2) ** 3;
      const shade = Math.round(255 - (255 - ink) * crest);
      image.data[4 * i] = shade;
      image.data[4 * i + 1] = shade;
      image.data[4 * i + 2] = shade;
      image.data[4 * i + 3] = 255;
    }
    context.putImageData(image, 0, 0);
    incoherent.textContent = `${(100 * field.measures().incoherent).toFixed(1)}%`;
    time.textContent = field.time.toFixed(0);
  }

  function tick(now) {
    if (!lastFrame) lastFrame = now;
    const elapsed = now - lastFrame;
    if (elapsed >= frameMs) {
      for (let i = 0; i < stepsPerFrame; i++) field.step();
      draw();
      lastFrame = elapsed > 2 * frameMs ? now : lastFrame + frameMs;
    }
    requestAnimationFrame(tick);
  }

  slider.addEventListener('input', () => {
    showLag();
    field.setLag(Number(slider.value));
  });
  restart.addEventListener('click', () => {
    seed++;
    field = new ChimeraField(seed, Number(slider.value));
    draw();
    console.info(`New chimera start: seed ${seed}`);
  });
  // The field flickers at high contrast, so nothing moves until the visitor accepts the warning.
  document.getElementById('field-start').addEventListener('click', () => {
    document.getElementById('field-warning').hidden = true;
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) requestAnimationFrame(tick);
  }, { once: true });
  showLag();
  draw();
  console.info(`Chimera field: seed ${seed}, ${field.columns} x ${field.rows} oscillators, ${fps} fps`);
})();
