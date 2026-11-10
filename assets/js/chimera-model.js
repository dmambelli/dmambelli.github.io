// Identical phase oscillators on a grid with nonlocal Kuramoto coupling:
// d(theta_i)/dt = (1 / n_i) * sum over j within radius R of sin(theta_j - theta_i - lag).
// Started from random phases, the grid forms spiral waves whose cores never synchronize.
class ChimeraField {
  static columns = 160;
  static rows = 100;
  static radius = 8;
  static dt = 0.1;
  // Lags above pi mirror those below it (2 pi - x acts like x, with spirals turning the other way).
  static minLag = 0;
  static maxLag = Math.PI;
  static coherentAbove = 0.8;

  constructor(seed = 7, lag = 0.7, columns = ChimeraField.columns, rows = ChimeraField.rows,
    radius = ChimeraField.radius) {
    for (const [name, value] of [['columns', columns], ['rows', rows], ['radius', radius]]) {
      if (!Number.isInteger(value) || value < 1) throw new RangeError(`${name} must be a positive integer`);
    }
    this.columns = columns;
    this.rows = rows;
    this.radius = radius;
    this.count = columns * rows;
    this.steps = 0;
    this.setLag(lag);
    // Half-width of the disc on each row offset, so a disc sum is 2R + 1 row-segment sums.
    this.span = Array.from({ length: 2 * radius + 1 },
      (_, k) => Math.floor(Math.sqrt(radius * radius - (k - radius) ** 2)));
    this.phase = new Float64Array(this.count);
    this.cos = new Float64Array(this.count);
    this.sin = new Float64Array(this.count);
    this.prefixCos = new Float64Array(rows * (columns + 1));
    this.prefixSin = new Float64Array(rows * (columns + 1));
    // Open boundaries: sites near an edge have fewer neighbours and average over those only.
    this.neighbours = new Float64Array(this.count);
    this.cos.fill(1);
    this.buildPrefixSums();
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) this.neighbours[y * columns + x] = this.discSum(this.prefixCos, x, y);
    }
    const random = ChimeraField.seededRandom(seed);
    for (let i = 0; i < this.count; i++) this.setPhase(i, 2 * Math.PI * random());
  }

  static seededRandom(seed) {
    let state = seed >>> 0;
    return () => {
      state = (1664525 * state + 1013904223) >>> 0;
      return state / 4294967296;
    };
  }

  get time() {
    return this.steps * ChimeraField.dt;
  }

  setLag(lag) {
    this.lag = Math.max(ChimeraField.minLag, Math.min(ChimeraField.maxLag, lag));
  }

  setPhase(i, phase) {
    const wrapped = phase - 2 * Math.PI * Math.floor(phase / (2 * Math.PI));
    this.phase[i] = wrapped;
    this.cos[i] = Math.cos(wrapped);
    this.sin[i] = Math.sin(wrapped);
  }

  buildPrefixSums() {
    const width = this.columns + 1;
    for (let y = 0; y < this.rows; y++) {
      let sumCos = 0, sumSin = 0;
      for (let x = 0; x < this.columns; x++) {
        sumCos += this.cos[y * this.columns + x];
        sumSin += this.sin[y * this.columns + x];
        this.prefixCos[y * width + x + 1] = sumCos;
        this.prefixSin[y * width + x + 1] = sumSin;
      }
    }
  }

  discSum(prefix, x, y) {
    const width = this.columns + 1;
    let total = 0;
    for (let k = 0; k < this.span.length; k++) {
      const row = y + k - this.radius;
      if (row < 0 || row >= this.rows) continue;
      const from = Math.max(0, x - this.span[k]);
      const to = Math.min(this.columns, x + this.span[k] + 1);
      total += prefix[row * width + to] - prefix[row * width + from];
    }
    return total;
  }

  step() {
    this.buildPrefixSums();
    const lagCos = Math.cos(this.lag), lagSin = Math.sin(this.lag);
    // Prefix sums hold the old state, so phases can be advanced in place.
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.columns; x++) {
        const i = y * this.columns + x;
        const fieldCos = this.discSum(this.prefixCos, x, y) / this.neighbours[i];
        const fieldSin = this.discSum(this.prefixSin, x, y) / this.neighbours[i];
        const shiftedCos = this.cos[i] * lagCos - this.sin[i] * lagSin;
        const shiftedSin = this.sin[i] * lagCos + this.cos[i] * lagSin;
        this.phase[i] += ChimeraField.dt * (fieldSin * shiftedCos - fieldCos * shiftedSin);
      }
    }
    for (let i = 0; i < this.count; i++) this.setPhase(i, this.phase[i]);
    this.steps++;
  }

  // |mean of exp(i * theta)| over the 3 x 3 block around a site; 1 means locally in sync.
  coherence(x, y) {
    let sumCos = 0, sumSin = 0;
    for (let dy = -1; dy <= 1; dy++) {
      const row = Math.max(0, Math.min(this.rows - 1, y + dy));
      for (let dx = -1; dx <= 1; dx++) {
        const i = row * this.columns + Math.max(0, Math.min(this.columns - 1, x + dx));
        sumCos += this.cos[i];
        sumSin += this.sin[i];
      }
    }
    return Math.hypot(sumCos, sumSin) / 9;
  }

  measures() {
    let incoherent = 0;
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.columns; x++) {
        if (this.coherence(x, y) < ChimeraField.coherentAbove) incoherent++;
      }
    }
    return { incoherent: incoherent / this.count };
  }
}

if (typeof window !== 'undefined') window.ChimeraField = ChimeraField;
if (typeof module !== 'undefined') module.exports = ChimeraField;
