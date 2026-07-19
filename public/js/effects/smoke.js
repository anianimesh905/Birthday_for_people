export class SmokeParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 0.2;
    this.vy = -(Math.random() * 0.4 + 0.3);
    this.size = Math.random() * 4 + 2;
    this.maxLife = Math.random() * 120 + 80;
    this.life = this.maxLife;
    this.opacity = Math.random() * 0.25 + 0.1;
  }
  update() {
    this.x += this.vx + Math.sin(this.y * 0.015) * 0.1;
    this.y += this.vy;
    this.size += 0.08;
    this.life--;
  }
  draw(ctx) {
    const alpha = (this.life / this.maxLife) * this.opacity;
    ctx.fillStyle = `rgba(220, 220, 220, ${alpha})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}
