export class MagicalDust {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.size = 1;
    this.vy = 0;
    this.vx = 0;
    this.opacity = 0.3;
  }
  reset(width, height) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.size = Math.random() * 1.2 + 0.5;
    this.vy = Math.random() * 0.3 + 0.15;
    this.vx = (Math.random() * 0.2 + 0.1) * -1;
    this.opacity = Math.random() * 0.4 + 0.2;
  }
  update(width, height) {
    if (!this.x && !this.y) this.reset(width, height);

    this.y += this.vy;
    this.x += this.vx;
    if (this.y > height) {
      this.y = 0;
      this.x = Math.random() * width;
    }
    if (this.x < 0) {
      this.x = width;
      this.y = Math.random() * height;
    }
  }
  draw(ctx) {
    ctx.fillStyle = `rgba(255, 245, 210, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}
