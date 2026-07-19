export class Feather {
  constructor() {
    this.x = 0;
    this.y = -50;
    this.size = 6;
    this.vy = 0.25;
    this.wobbleSpeed = 0.01;
    this.wobbleRange = 10;
    this.angle = 0;
    this.spinSpeed = 0;
    this.opacity = 0.15;
    this.xOffset = 0;
  }
  reset(width) {
    this.x = Math.random() * width;
    this.y = -50;
    this.size = Math.random() * 8 + 6;
    this.vy = Math.random() * 0.2 + 0.25;
    this.wobbleSpeed = Math.random() * 0.02 + 0.01;
    this.wobbleRange = Math.random() * 30 + 10;
    this.angle = Math.random() * Math.PI;
    this.spinSpeed = (Math.random() - 0.5) * 0.015;
    this.opacity = Math.random() * 0.22 + 0.1;
  }
  update(width, height) {
    if (!this.x) this.reset(width);

    this.y += this.vy;
    this.angle += this.spinSpeed;
    this.xOffset = Math.sin(this.y * this.wobbleSpeed) * this.wobbleRange;
    if (this.y > height + 50) {
      this.y = -50;
      this.x = Math.random() * width;
    }
  }
  draw(ctx) {
    const rx = this.x + this.xOffset;
    ctx.save();
    ctx.translate(rx, this.y);
    ctx.rotate(this.angle);
    ctx.fillStyle = `rgba(240, 240, 240, ${this.opacity})`;
    
    ctx.beginPath();
    ctx.ellipse(0, 0, this.size, this.size * 0.28, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity * 1.5})`;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(-this.size, 0);
    ctx.lineTo(this.size, 0);
    ctx.stroke();

    ctx.restore();
  }
}
