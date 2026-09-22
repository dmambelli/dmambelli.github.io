// A two-dimensional repulsion / orientation / attraction model.
class ThreeZoneSwarm {
  static count = 144;
  static repulsionRadius = 0.015;
  static attractionRadius = 0.30;
  static minAlignmentRadius = 0.018;
  static maxAlignmentRadius = 0.19;
  static speed = 0.0027;
  static maxTurn = 0.045;
  static noise = 0.025;
  static initialRadius = 0.27; // Fixed area, so changing count changes density.

  constructor(seed = 7, alignmentRadius = 0.045, count = ThreeZoneSwarm.count) {
    if (!Number.isInteger(count) || count < 1) throw new RangeError('Agent count must be a positive integer');
    this.count = count;
    this.random = ThreeZoneSwarm.seededRandom(seed);
    this.x = new Float64Array(this.count);
    this.y = new Float64Array(this.count);
    this.vx = new Float64Array(this.count);
    this.vy = new Float64Array(this.count);
    this.nextVx = new Float64Array(this.count);
    this.nextVy = new Float64Array(this.count);
    this.setAlignmentRadius(alignmentRadius);
    for (let i = 0; i < this.count; i++) {
      const distance = ThreeZoneSwarm.initialRadius * Math.sqrt(this.random());
      const bearing = 2 * Math.PI * this.random();
      const heading = 2 * Math.PI * this.random();
      this.x[i] = distance * Math.cos(bearing);
      this.y[i] = distance * Math.sin(bearing);
      this.vx[i] = Math.cos(heading);
      this.vy[i] = Math.sin(heading);
    }
  }

  static seededRandom(seed) {
    let state = seed >>> 0;
    return () => {
      state = (1664525 * state + 1013904223) >>> 0;
      return state / 4294967296;
    };
  }

  setAlignmentRadius(radius) {
    this.alignmentRadius = Math.max(ThreeZoneSwarm.minAlignmentRadius,
      Math.min(ThreeZoneSwarm.maxAlignmentRadius, radius));
  }

  normalNoise() {
    const u = Math.max(this.random(), 1e-12);
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * this.random());
  }

  step() {
    const rr2 = ThreeZoneSwarm.repulsionRadius ** 2;
    const ro2 = this.alignmentRadius ** 2;
    const ra2 = ThreeZoneSwarm.attractionRadius ** 2;
    for (let i = 0; i < this.count; i++) {
      let awayX = 0, awayY = 0, orientX = 0, orientY = 0;
      let attractX = 0, attractY = 0, close = 0, oriented = 0, attracted = 0;
      for (let j = 0; j < this.count; j++) {
        if (i === j) continue;
        const dx = this.x[j] - this.x[i];
        const dy = this.y[j] - this.y[i];
        const distance2 = dx * dx + dy * dy;
        if (distance2 < 1e-12 || distance2 >= ra2) continue;
        if (distance2 < rr2) {
          const inverseDistance = 1 / Math.sqrt(distance2);
          awayX -= dx * inverseDistance;
          awayY -= dy * inverseDistance;
          close++;
        } else if (distance2 < ro2) {
          orientX += this.vx[j];
          orientY += this.vy[j];
          oriented++;
        } else {
          const inverseDistance = 1 / Math.sqrt(distance2);
          attractX += dx * inverseDistance;
          attractY += dy * inverseDistance;
          attracted++;
        }
      }
      let desiredX = this.vx[i], desiredY = this.vy[i];
      if (close) {
        desiredX = awayX;
        desiredY = awayY;
      } else if (oriented || attracted) {
        const orientationLength = Math.hypot(orientX, orientY);
        const attractionLength = Math.hypot(attractX, attractY);
        desiredX = orientationLength ? orientX / orientationLength : 0;
        desiredY = orientationLength ? orientY / orientationLength : 0;
        if (attractionLength) {
          desiredX += attractX / attractionLength;
          desiredY += attractY / attractionLength;
        }
      }
      if (Math.hypot(desiredX, desiredY) < 1e-12) {
        desiredX = this.vx[i];
        desiredY = this.vy[i];
      }
      const cross = this.vx[i] * desiredY - this.vy[i] * desiredX;
      const dot = this.vx[i] * desiredX + this.vy[i] * desiredY;
      const turn = Math.atan2(cross, dot);
      const limitedTurn = Math.max(-ThreeZoneSwarm.maxTurn,
        Math.min(ThreeZoneSwarm.maxTurn, turn));
      const heading = Math.atan2(this.vy[i], this.vx[i])
        + limitedTurn + ThreeZoneSwarm.noise * this.normalNoise();
      this.nextVx[i] = Math.cos(heading);
      this.nextVy[i] = Math.sin(heading);
    }
    for (let i = 0; i < this.count; i++) {
      this.vx[i] = this.nextVx[i];
      this.vy[i] = this.nextVy[i];
      this.x[i] += ThreeZoneSwarm.speed * this.vx[i];
      this.y[i] += ThreeZoneSwarm.speed * this.vy[i];
    }
  }

  measures() {
    let centerX = 0, centerY = 0, headingX = 0, headingY = 0;
    for (let i = 0; i < this.count; i++) {
      centerX += this.x[i];
      centerY += this.y[i];
      headingX += this.vx[i];
      headingY += this.vy[i];
    }
    centerX /= this.count;
    centerY /= this.count;
    let rotation = 0;
    for (let i = 0; i < this.count; i++) {
      const dx = this.x[i] - centerX;
      const dy = this.y[i] - centerY;
      const distance = Math.hypot(dx, dy);
      if (distance) rotation += (dx * this.vy[i] - dy * this.vx[i]) / distance;
    }
    return {
      centerX,
      centerY,
      alignment: Math.hypot(headingX, headingY) / this.count,
      rotation: Math.abs(rotation) / this.count
    };
  }
}

if (typeof window !== 'undefined') window.ThreeZoneSwarm = ThreeZoneSwarm;
if (typeof module !== 'undefined') module.exports = ThreeZoneSwarm;
