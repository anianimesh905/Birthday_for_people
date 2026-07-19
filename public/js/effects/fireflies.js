export class Firefly {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.size = 2;
    this.angle = Math.random() * Math.PI * 2;
    this.speed = Math.random() * 0.4 + 0.2;
    this.wobbleSpeed = Math.random() * 0.05 + 0.02;
    this.opacity = Math.random() * 0.5 + 0.3;
    this.fadeDir = Math.random() > 0.5 ? 0.01 : -0.01;
  }
  reset(width, height) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.size = Math.random() * 2 + 1.2;
    this.angle = Math.random() * Math.PI * 2;
    this.speed = Math.random() * 0.4 + 0.2;
    this.wobbleSpeed = Math.random() * 0.05 + 0.02;
    this.opacity = Math.random() * 0.5 + 0.3;
    this.fadeDir = Math.random() > 0.5 ? 0.01 : -0.01;
  }
  update(mouseX, mouseY, avoidRect, width, height) {
    if (!this.x && !this.y) this.reset(width, height);

    const dx = this.x - mouseX;
    const dy = this.y - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 120) {
      const force = (120 - dist) / 120 * 1.5;
      this.x += (dx / dist) * force;
      this.y += (dy / dist) * force;
    }

    if (avoidRect) {
      const cx = avoidRect.left + avoidRect.width / 2;
      const cy = avoidRect.top + avoidRect.height / 2;
      if (this.x > avoidRect.left - 40 && this.x < avoidRect.right + 40 &&
          this.y > avoidRect.top - 40 && this.y < avoidRect.bottom + 40) {
        const ex = this.x - cx;
        const ey = this.y - cy;
        const edist = Math.sqrt(ex * ex + ey * ey) || 1;
        this.x += (ex / edist) * 1.2;
        this.y += (ey / edist) * 1.2;
      }
    }

    this.angle += (Math.random() - 0.5) * 0.15;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;

    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;

    this.opacity += this.fadeDir;
    if (this.opacity > 0.85 || this.opacity < 0.25) {
      this.fadeDir = -this.fadeDir;
    }
  }
  draw(ctx) {
    ctx.beginPath();
    const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
    grad.addColorStop(0, `rgba(180, 245, 100, ${this.opacity})`);
    grad.addColorStop(0.3, `rgba(180, 245, 100, ${this.opacity * 0.4})`);
    grad.addColorStop(1, 'rgba(180, 245, 100, 0)');
    ctx.fillStyle = grad;
    ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
    ctx.fill();
  }
}
