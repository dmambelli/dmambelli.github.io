(function () {
  "use strict";

  var canvas = document.querySelector("#swarm-canvas");
  var simulation = document.querySelector("[data-simulation]");

  if (!canvas || !simulation) return;

  var context = canvas.getContext("2d");
  var crosshair = simulation.querySelector(".canvas-crosshair");
  var stateLabel = simulation.querySelector("[data-state]");
  var agentsLabel = simulation.querySelector("[data-agents]");
  var alignmentLabel = simulation.querySelector("[data-alignment]");
  var pulseLabel = simulation.querySelector("[data-pulse]");
  var pauseButton = simulation.querySelector("[data-pause]");
  var resetButton = simulation.querySelector("[data-reset]");
  var agents = [];
  var width = 0;
  var height = 0;
  var density = 0;
  var lastTime = 0;
  var frame = 0;
  var paused = false;
  var pointer = { x: -100, y: -100, active: false };
  var twoPi = Math.PI * 2;

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function makeAgent(x, y) {
    return {
      x: x,
      y: y,
      phase: randomBetween(0, twoPi),
      speed: randomBetween(0.72, 1.08),
      enabled: true,
      flash: 0
    };
  }

  function createAgents() {
    var target = Math.round(Math.max(74, Math.min(168, width * height / 6500)));
    var columns = Math.ceil(Math.sqrt(target * (width / height)));
    var rows = Math.ceil(target / columns);
    var spacingX = width / columns;
    var spacingY = height / rows;
    var nextAgents = [];

    for (var row = 0; row < rows; row += 1) {
      for (var column = 0; column < columns; column += 1) {
        if (nextAgents.length >= target) break;
        var stagger = row % 2 ? spacingX * 0.5 : 0;
        var x = (column + 0.5) * spacingX + stagger;
        var y = (row + 0.5) * spacingY;
        if (x > width - 10) x -= spacingX;
        nextAgents.push(makeAgent(x, y));
      }
    }

    agents = nextAgents;
    density = Math.min(spacingX, spacingY) * 2.2;
    agentsLabel.textContent = agents.length;
  }

  function resizeCanvas() {
    var bounds = canvas.getBoundingClientRect();
    var oldWidth = width;
    var oldHeight = height;
    width = Math.max(1, bounds.width);
    height = Math.max(1, bounds.height);
    var pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    if (!agents.length) {
      createAgents();
      return;
    }

    agents.forEach(function (agent) {
      agent.x = agent.x / oldWidth * width;
      agent.y = agent.y / oldHeight * height;
    });
    density = Math.min(width, height) * 0.22;
  }

  function setPointer(event) {
    var bounds = canvas.getBoundingClientRect();
    pointer.x = event.clientX - bounds.left;
    pointer.y = event.clientY - bounds.top;
    pointer.active = true;
    crosshair.style.left = pointer.x + "px";
    crosshair.style.top = pointer.y + "px";
  }

  function perturb(x, y) {
    var nearest = null;
    var nearestDistance = Infinity;

    agents.forEach(function (agent) {
      var distance = Math.hypot(agent.x - x, agent.y - y);
      if (distance < nearestDistance) {
        nearest = agent;
        nearestDistance = distance;
      }
    });

    if (nearest && nearestDistance < 28) {
      nearest.enabled = !nearest.enabled;
      nearest.flash = 1;
      nearest.phase += nearest.enabled ? Math.PI * 0.5 : Math.PI;
    }

    var radius = Math.max(70, density * 1.8);
    agents.forEach(function (agent) {
      var distance = Math.hypot(agent.x - x, agent.y - y);
      if (distance < radius && agent.enabled) {
        var influence = 1 - distance / radius;
        agent.phase += influence * (nearest && nearestDistance < 28 ? 0.35 : 1.8);
        agent.flash = Math.max(agent.flash, influence);
      }
    });
  }

  function update(delta) {
    var coupling = 2.7;

    agents.forEach(function (agent, index) {
      if (!agent.enabled) {
        agent.flash = Math.max(0, agent.flash - delta * 2);
        return;
      }

      var pull = 0;
      var neighbors = 0;

      agents.forEach(function (neighbor, neighborIndex) {
        if (index === neighborIndex || !neighbor.enabled) return;
        var distance = Math.hypot(agent.x - neighbor.x, agent.y - neighbor.y);
        if (distance < density) {
          pull += Math.sin(neighbor.phase - agent.phase);
          neighbors += 1;
        }
      });

      if (neighbors) pull /= neighbors;
      agent.phase = (agent.phase + (agent.speed + coupling * pull) * delta) % twoPi;
      agent.flash = Math.max(0, agent.flash - delta * 1.8);
    });
  }

  function drawGrid() {
    context.strokeStyle = "rgba(255, 255, 255, 0.065)";
    context.lineWidth = 1;
    var step = 54;

    for (var x = step; x < width; x += step) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, height);
      context.stroke();
    }
    for (var y = step; y < height; y += step) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(width, y);
      context.stroke();
    }
  }

  function drawConnections() {
    context.lineWidth = 0.7;
    for (var i = 0; i < agents.length; i += 1) {
      var agent = agents[i];
      if (!agent.enabled) continue;
      for (var j = i + 1; j < agents.length; j += 1) {
        var neighbor = agents[j];
        if (!neighbor.enabled) continue;
        var distance = Math.hypot(agent.x - neighbor.x, agent.y - neighbor.y);
        if (distance < density) {
          var agreement = 1 - Math.abs(Math.sin((neighbor.phase - agent.phase) / 2));
          context.strokeStyle = "rgba(255, 255, 255, " + (0.035 + agreement * 0.13) + ")";
          context.beginPath();
          context.moveTo(agent.x, agent.y);
          context.lineTo(neighbor.x, neighbor.y);
          context.stroke();
        }
      }
    }
  }

  function drawAgents() {
    agents.forEach(function (agent) {
      var pulse = agent.enabled ? (Math.sin(agent.phase) + 1) / 2 : 0;
      var radius = agent.enabled ? 1.4 + pulse * 2.25 : 1.2;
      var opacity = agent.enabled ? 0.3 + pulse * 0.7 : 0.15;

      if (agent.enabled && (pulse > 0.82 || agent.flash > 0)) {
        var halo = context.createRadialGradient(agent.x, agent.y, 0, agent.x, agent.y, radius * 7 + agent.flash * 10);
        halo.addColorStop(0, "rgba(255, 255, 255, " + (opacity * 0.23 + agent.flash * 0.2) + ")");
        halo.addColorStop(1, "rgba(255, 255, 255, 0)");
        context.fillStyle = halo;
        context.beginPath();
        context.arc(agent.x, agent.y, radius * 7 + agent.flash * 10, 0, twoPi);
        context.fill();
      }

      context.fillStyle = "rgba(255, 255, 255, " + opacity + ")";
      context.beginPath();
      context.arc(agent.x, agent.y, radius, 0, twoPi);
      context.fill();
    });
  }

  function updateReadout() {
    var active = agents.filter(function (agent) { return agent.enabled; });
    if (!active.length) {
      alignmentLabel.textContent = "0";
      pulseLabel.textContent = "OFF";
      stateLabel.textContent = "SILENT";
      return;
    }

    var sumCosine = active.reduce(function (sum, agent) { return sum + Math.cos(agent.phase); }, 0);
    var sumSine = active.reduce(function (sum, agent) { return sum + Math.sin(agent.phase); }, 0);
    var alignment = Math.sqrt(sumCosine * sumCosine + sumSine * sumSine) / active.length;
    var pulse = active.reduce(function (sum, agent) { return sum + (Math.sin(agent.phase) > 0.76 ? 1 : 0); }, 0);

    alignmentLabel.textContent = Math.round(alignment * 100);
    pulseLabel.textContent = pulse ? Math.round(pulse / active.length * 100) + "%" : "-";
    stateLabel.textContent = alignment > 0.76 ? "SYNCHRONIZED" : alignment > 0.4 ? "COHERING" : "DRIFTING";
  }

  function draw() {
    context.fillStyle = "#111111";
    context.fillRect(0, 0, width, height);
    drawGrid();
    drawConnections();
    drawAgents();
    frame += 1;
    if (frame % 8 === 0) updateReadout();
  }

  function animate(time) {
    var delta = Math.min((time - lastTime) / 1000 || 0, 0.05);
    lastTime = time;
    if (!paused) update(delta);
    draw();
    window.requestAnimationFrame(animate);
  }

  canvas.addEventListener("pointermove", setPointer);
  canvas.addEventListener("pointerleave", function () {
    pointer.active = false;
    crosshair.style.left = "-100px";
    crosshair.style.top = "-100px";
  });
  canvas.addEventListener("pointerdown", function (event) {
    setPointer(event);
    perturb(pointer.x, pointer.y);
    updateReadout();
  });
  pauseButton.addEventListener("click", function () {
    paused = !paused;
    pauseButton.setAttribute("aria-pressed", String(paused));
    pauseButton.innerHTML = paused ? "Resume <span aria-hidden=\"true\">&gt;</span>" : "Pause <span aria-hidden=\"true\">||</span>";
    stateLabel.textContent = paused ? "PAUSED" : "COHERING";
  });
  resetButton.addEventListener("click", function () {
    agents.forEach(function (agent) {
      agent.phase = randomBetween(0, twoPi);
      agent.enabled = true;
      agent.flash = 0;
    });
    paused = false;
    pauseButton.setAttribute("aria-pressed", "false");
    pauseButton.innerHTML = "Pause <span aria-hidden=\"true\">||</span>";
    updateReadout();
  });

  if (window.ResizeObserver) {
    new ResizeObserver(resizeCanvas).observe(canvas);
  } else {
    window.addEventListener("resize", resizeCanvas);
  }
  resizeCanvas();
  window.requestAnimationFrame(animate);
}());
