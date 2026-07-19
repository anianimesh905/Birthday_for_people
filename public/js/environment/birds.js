export class Bird {
  constructor(isOwl = false) {
    this.isOwl = isOwl;
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.size = 4;
    this.wingCycle = 0;
    this.active = false;
    this.wingSpeed = 0.2;
  }
  reset(width, height) {
    const hour = new Date().getHours();
    this.isOwl = (hour >= 20 || hour < 5);
    
    this.x = this.isOwl ? width + 50 : -50;
    this.wingCycle = 0;
    this.active = Math.random() > 0.45;
    this.wingSpeed = this.isOwl ? 0.075 : 0.22;
    this.size = this.isOwl ? 8 : 4.2;

    if (this.isOwl) {
      this.y = Math.random() * (height * 0.35) + 40;
      this.vx = -(Math.random() * 0.45 + 0.35);
      this.vy = (Math.random() - 0.5) * 0.05;
    } else if (hour >= 5 && hour < 8) {
      this.y = Math.random() * (height * 0.45) + 60;
      this.vx = (Math.random() * 0.85 + 0.65);
      this.vy = (Math.random() - 0.5) * 0.35;
    } else if (hour >= 17 && hour < 20) {
      this.y = Math.random() * (height * 0.4) + 50;
      this.vx = (Math.random() * 0.55 + 0.45);
      this.vy = -0.06;
    } else {
      this.y = Math.random() * (height * 0.22) + 25;
      this.vx = (Math.random() * 0.38 + 0.28);
      this.vy = (Math.random() - 0.5) * 0.06;
    }
  }
  update(width, height) {
    if (!this.active) {
      if (Math.random() < 0.002) this.active = true;
      return;
    }
    this.x += this.vx;
    this.y += this.vy + Math.sin(this.x * 0.02) * 0.1;
    this.wingCycle += this.wingSpeed;

    if ((this.isOwl && this.x < -50) || (!this.isOwl && this.x > width + 50)) {
      this.reset(width, height);
      this.active = false;
    }
  }
  draw(ctx) {
    if (!this.active) return;
    ctx.strokeStyle = this.isOwl ? 'rgba(10, 15, 30, 0.42)' : 'rgba(80, 90, 100, 0.35)';
    ctx.lineWidth = this.isOwl ? 2 : 1.2;
    ctx.beginPath();

    const wingY = Math.sin(this.wingCycle) * this.size;
    ctx.moveTo(this.x - this.size, this.y - wingY);
    ctx.quadraticCurveTo(this.x - this.size / 2, this.y - this.size / 2, this.x, this.y);
    ctx.quadraticCurveTo(this.x + this.size / 2, this.y - this.size / 2, this.x + this.size, this.y - wingY);
    ctx.stroke();

    if (this.isOwl) {
      ctx.fillStyle = 'rgba(10, 15, 30, 0.2)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
