export class WhiteStag {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.reset();
  }
  reset() {
    this.active = false;
    this.x = -60;
    this.y = 0;
    this.delay = Math.random() * 6500 + 5500; 
    this.step = 0;
  }
  trigger(width, height) {
    this.active = true;
    this.x = -50;
    this.y = height - 38;
    this.step = 0;
  }
  update(width, height) {
    if (!this.active) {
      this.delay--;
      if (this.delay <= 0) this.trigger(width, height);
      return;
    }
    this.x += 0.45;
    this.step += 0.08;
    if (Math.random() < 0.12 && window.spawnSparkCluster) {
      window.spawnSparkCluster(this.x, this.y + 4, 1, false);
    }
    if (this.x > width + 60) {
      this.reset();
    }
  }
  draw(ctx) {
    if (!this.active) return;
    ctx.save();
    ctx.fillStyle = 'rgba(240, 248, 255, 0.72)';
    ctx.shadowColor = '#e0f7fa';
    ctx.shadowBlur = 10;
    const bx = this.x;
    const by = this.y + Math.sin(this.step) * 0.8;
    ctx.beginPath();
    ctx.ellipse(bx, by, 7, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(bx + 5, by - 6, 2.5, 5, 0.5, 0, Math.PI * 2);
    ctx.ellipse(bx + 7, by - 10, 3, 1.8, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = 'rgba(240, 248, 255, 0.72)';
    const legOffset1 = Math.sin(this.step) * 3;
    const legOffset2 = Math.cos(this.step) * 3;
    ctx.beginPath();
    ctx.moveTo(bx - 4, by);
    ctx.lineTo(bx - 5 + legOffset1 * 0.4, by + 8);
    ctx.moveTo(bx - 2, by);
    ctx.lineTo(bx - 1 - legOffset1 * 0.4, by + 8);
    ctx.moveTo(bx + 3, by);
    ctx.lineTo(bx + 2 + legOffset2 * 0.4, by + 8);
    ctx.moveTo(bx + 5, by);
    ctx.lineTo(bx + 6 - legOffset2 * 0.4, by + 8);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(bx + 6, by - 11);
    ctx.quadraticCurveTo(bx + 4, by - 16, bx + 2, by - 18);
    ctx.moveTo(bx + 6, by - 11);
    ctx.quadraticCurveTo(bx + 9, by - 17, bx + 11, by - 20);
    ctx.moveTo(bx + 4, by - 14);
    ctx.lineTo(bx + 1, by - 15);
    ctx.moveTo(bx + 8, by - 15);
    ctx.lineTo(bx + 11, by - 16);
    ctx.stroke();
    ctx.restore();
  }
}
