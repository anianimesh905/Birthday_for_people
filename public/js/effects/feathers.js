const featherImg = new Image();
featherImg.src = 'public/assets/creatures/feather.png';

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
    ctx.globalAlpha = this.opacity;
    
    // Draw the image centered
    const w = this.size * 2.8;
    const h = w * 0.32; // aspect ratio approximation
    ctx.drawImage(featherImg, -w / 2, -h / 2, w, h);
    
    ctx.restore();
  }
}
