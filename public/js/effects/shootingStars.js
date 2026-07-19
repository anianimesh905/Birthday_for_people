export class ShootingStar {
  constructor() {
    this.reset();
  }
  reset() {
    this.active = false;
    this.delay = Math.random() * 4500 + 2500;
  }
  trigger(width, height) {
    this.active = true;
    this.x = Math.random() * (width * 0.6) + width * 0.2;
    this.y = Math.random() * (height * 0.3);
    this.speed = Math.random() * 10 + 10;
    this.angle = Math.PI * 0.2 + Math.random() * 0.1;
    this.vx = -Math.cos(this.angle) * this.speed;
    this.vy = Math.sin(this.angle) * this.speed;
    this.life = Math.random() * 25 + 15;
    this.maxLife = this.life;
  }
  update(width, height) {
    if (!this.active) {
      this.delay--;
      if (this.delay <= 0) {
        this.trigger(width, height);
      }
      return;
    }
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
    if (this.life <= 0) {
      this.reset();
    }
  }
  draw(ctx) {
    if (!this.active) return;
    ctx.strokeStyle = `rgba(255, 255, 235, ${this.life / this.maxLife})`;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - this.vx * 1.5, this.y - this.vy * 1.5);
    ctx.stroke();
  }
}
