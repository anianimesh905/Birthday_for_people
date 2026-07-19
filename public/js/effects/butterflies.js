export class GlowingButterfly {
  constructor(season) {
    this.x = 0;
    this.y = 0;
    this.size = 2;
    this.angle = Math.random() * Math.PI * 2;
    this.speed = Math.random() * 0.4 + 0.35;
    this.flap = Math.random() * 10;
    this.active = false;
    this.season = season || 'summer';
  }
  reset(width, height) {
    this.x = Math.random() > 0.5 ? -10 : width + 10;
    this.y = height - Math.random() * 70 - 25;
    this.size = Math.random() * 2.5 + 2.0;
    this.angle = Math.random() * Math.PI * 2;
    this.speed = Math.random() * 0.4 + 0.35;
    this.flap = Math.random() * 10;
    this.active = (this.season === 'spring' || this.season === 'summer') && Math.random() > 0.3;
  }
  update(mx, my, width, height) {
    if (!this.x && !this.y) this.reset(width, height);
    if (!this.active) return;

    const dx = this.x - mx;
    const dy = this.y - my;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 65) {
      const force = (65 - dist) / 65 * 2.2;
      this.x += (dx / dist) * force;
      this.y += (dy / dist) * force;
      this.flap += 0.45;
    } else {
      this.flap += 0.22;
      this.angle += (Math.random() - 0.5) * 0.3;
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed * 0.6;
    }
    if (this.x < -15 || this.x > width + 15 || this.y > height || this.y < height - 120) {
      this.reset(width, height);
    }
  }
  draw(ctx) {
    if (!this.active) return;
    ctx.save();
    const alpha = 0.55 + Math.sin(this.flap * 0.5) * 0.25;
    ctx.fillStyle = `rgba(180, 245, 100, ${alpha})`;
    ctx.shadowColor = '#adff2f';
    ctx.shadowBlur = 6;
    const rx = this.x;
    const ry = this.y;
    const wingW = Math.abs(Math.sin(this.flap)) * this.size;
    ctx.beginPath();
    ctx.ellipse(rx - wingW * 0.6, ry - 1, wingW, this.size * 0.8, -0.2, 0, Math.PI * 2);
    ctx.ellipse(rx + wingW * 0.6, ry - 1, wingW, this.size * 0.8, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
