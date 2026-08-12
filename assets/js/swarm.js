(function () {
  "use strict";

  var canvas = document.querySelector("#firefly-matrix");
  if (!canvas) return;

  var context = canvas.getContext("2d");
  var nodes = [];
  var edges = [];
  var columns = 0;
  var rows = 0;
  var width = 0;
  var height = 0;
  var cellSize = 0;
  var resetButton = document.querySelector("[data-reset]");
  var tickLength = 300;
  var timeStep = tickLength / 1000;
  var twoPi = Math.PI * 2;
  var coupling = 1.35;
  var noise = 0.035;
  var timer;

  function randomInteger(max) {
    return Math.floor(Math.random() * max);
  }

  function shuffle(values) {
    for (var i = values.length - 1; i > 0; i -= 1) {
      var j = randomInteger(i + 1);
      var value = values[i];
      values[i] = values[j];
      values[j] = value;
    }
    return values;
  }

  function createNode(index, column, row) {
    return {
      index: index,
      column: column,
      row: row,
      phase: Math.random() * twoPi,
      naturalRate: 1.1 + Math.random() * 0.65,
      flash: Math.random() < 0.01 ? 2 : 0,
      refractory: 0,
      neighbors: [],
      x: 0,
      y: 0
    };
  }

  function connect(first, second) {
    if (first === second || nodes[first].neighbors.indexOf(second) !== -1) return;
    nodes[first].neighbors.push(second);
    nodes[second].neighbors.push(first);
    edges.push([first, second]);
  }

  function buildNetwork() {
    edges = [];
    nodes.forEach(function (node) {
      node.neighbors = [];
    });

    nodes.forEach(function (node) {
      var candidates = nodes.filter(function (candidate) {
        var columnDistance = Math.abs(candidate.column - node.column);
        var rowDistance = Math.abs(candidate.row - node.row);
        return candidate.index !== node.index && columnDistance <= 1 && rowDistance <= 1;
      });
      shuffle(candidates);

      var links = 1 + randomInteger(3);
      candidates.slice(0, links).forEach(function (candidate) {
        connect(node.index, candidate.index);
      });

    });

    nodes.forEach(function (node) {
      if (node.neighbors.length) return;
      var candidates = nodes.filter(function (candidate) {
        return Math.abs(candidate.column - node.column) <= 1 &&
          Math.abs(candidate.row - node.row) <= 1 &&
          candidate.index !== node.index;
      });
      var candidate = candidates[randomInteger(candidates.length)];
      connect(node.index, candidate.index);
    });
  }

  function setMatrixSize() {
    columns = Math.max(10, Math.min(25, Math.floor(width / 48)));
    rows = Math.max(7, Math.min(15, Math.floor(height / 46)));
    nodes = [];

    for (var row = 0; row < rows; row += 1) {
      for (var column = 0; column < columns; column += 1) {
        nodes.push(createNode(nodes.length, column, row));
      }
    }
    if (!nodes.some(function (node) { return node.flash > 0; })) {
      var startingNode = nodes[randomInteger(nodes.length)];
      startingNode.flash = 2;
      startingNode.phase = 0;
      startingNode.refractory = 3;
    }
    nodes.forEach(function (node) {
      if (node.flash > 0) node.refractory = 3;
    });
    buildNetwork();
  }

  function layoutMatrix() {
    var padding = Math.min(64, Math.max(28, Math.min(width, height) * 0.11));
    var spacingX = (width - padding * 2) / Math.max(1, columns - 1);
    var spacingY = (height - padding * 2) / Math.max(1, rows - 1);
    cellSize = Math.min(spacingX, spacingY) * 0.54;

    nodes.forEach(function (node) {
      node.x = padding + node.column * spacingX;
      node.y = padding + node.row * spacingY;
    });
  }

  function resize() {
    var bounds = canvas.getBoundingClientRect();
    var ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, bounds.width);
    height = Math.max(1, bounds.height);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    setMatrixSize();
    layoutMatrix();
    draw();
  }

  function step() {
    var nextFlash = nodes.map(function (node) {
      return Math.max(0, node.flash - 1);
    });
    var nextRefractory = nodes.map(function (node) {
      return Math.max(0, node.refractory - 1);
    });

    nodes.forEach(function (node) {
      var phasePull = node.neighbors.reduce(function (total, neighborIndex) {
        return total + Math.sin(nodes[neighborIndex].phase - node.phase);
      }, 0) / node.neighbors.length;
      var randomDrift = (Math.random() * 2 - 1) * noise;
      var phaseDelta = (node.naturalRate + coupling * phasePull) * timeStep + randomDrift;
      var nextPhase = node.phase + phaseDelta;

      if (nextPhase >= twoPi) {
        nextPhase -= twoPi;
        if (node.refractory === 0) {
          nextFlash[node.index] = 2;
          nextRefractory[node.index] = 3;
        }
      } else if (nextPhase < 0) {
        nextPhase += twoPi;
      }
      node.phase = nextPhase;
    });

    nodes.forEach(function (node) {
      node.flash = nextFlash[node.index];
      node.refractory = nextRefractory[node.index];
    });
    draw();
  }

  function drawConnections() {
    context.lineWidth = 1;
    context.strokeStyle = "#000000";
    context.globalAlpha = 0.13;

    edges.forEach(function (edge) {
      var first = nodes[edge[0]];
      var second = nodes[edge[1]];
      context.beginPath();
      context.moveTo(first.x, first.y);
      context.lineTo(second.x, second.y);
      context.stroke();
    });
    context.globalAlpha = 1;
  }

  function drawCell(node) {
    var half = cellSize * 0.5;
    var cut = cellSize * 0.16;
    var on = node.flash > 0;

    context.beginPath();
    context.moveTo(node.x - half + cut, node.y - half);
    context.lineTo(node.x + half, node.y - half);
    context.lineTo(node.x + half - cut, node.y + half);
    context.lineTo(node.x - half, node.y + half);
    context.closePath();
    context.fillStyle = on ? "#000000" : "#ffffff";
    context.strokeStyle = on ? "#000000" : "#d7d7d7";
    context.lineWidth = on ? 0 : 1;
    context.fill();
    if (!on) context.stroke();
  }

  function draw() {
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    drawConnections();
    nodes.forEach(drawCell);
  }

  function disturb(event) {
    var bounds = canvas.getBoundingClientRect();
    var x = event.clientX - bounds.left;
    var y = event.clientY - bounds.top;
    var nearest = nodes.reduce(function (best, node) {
      var distance = Math.hypot(node.x - x, node.y - y);
      return distance < best.distance ? { node: node, distance: distance } : best;
    }, { node: nodes[0], distance: Infinity });

    if (nearest.distance > cellSize * 1.4) return;
    nearest.node.flash = nearest.node.flash ? 0 : 3;
    nearest.node.refractory = nearest.node.flash ? 3 : 0;
    nearest.node.phase = nearest.node.flash ? 0 : Math.PI;
    nearest.node.neighbors.forEach(function (neighborIndex) {
      nodes[neighborIndex].phase = (nodes[neighborIndex].phase + 0.35) % twoPi;
    });
    draw();
  }

  canvas.addEventListener("pointerdown", disturb);
  resetButton.addEventListener("click", function () {
    setMatrixSize();
    layoutMatrix();
    draw();
  });
  window.addEventListener("resize", resize);
  if (window.ResizeObserver) new ResizeObserver(resize).observe(canvas);
  resize();
  timer = window.setInterval(step, tickLength);

  window.addEventListener("beforeunload", function () {
    window.clearInterval(timer);
  });
}());
