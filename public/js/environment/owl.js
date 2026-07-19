export class CuriousOwl {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.flap = 0;
    this.perchTime = 0;
    this.reset();
  }
  reset() {
    this.active = false;
    this.state = 'flying-in';
    this.delay = Math.random() * 4500 + 4000; 
    this.x = -50;
    this.y = 50;
    this.flap = 0;
    this.perchTime = 0;
  }
  trigger(width, height) {
    this.active = true;
    this.state = 'flying-in';
    this.x = Math.random() > 0.5 ? -40 : width + 40;
    this.y = Math.random() * 100 + 50;
    this.flap = Math.random() * 10;
    this.targetX = width * (300 / 800);
    this.targetY = height - (height * 0.15) + (40 / 400 * (height * 0.15)) - 10;
  }
  update(mx, my, width, height) {
    if (!this.active) {
      this.delay--;
      if (this.delay <= 0) this.trigger(width, height);
      return;
    }

    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const curDx = this.x - mx;
    const curDy = this.y - my;
    const curDist = Math.sqrt(curDx * curDx + curDy * curDy);
    if (curDist < 45 && this.state !== 'flying-away') {
      this.state = 'flying-away';
      this.vx = (this.x - mx > 0 ? 1 : -1) * (Math.random() * 2 + 2);
      this.vy = -(Math.random() * 1.5 + 1.5);
    }

    if (this.state === 'flying-in') {
      this.flap += 0.22;
      if (dist < 4) {
        this.x = this.targetX;
        this.y = this.targetY;
        this.state = 'perched';
        this.perchTime = Math.random() * 350 + 300;
      } else {
        this.x += dx * 0.04;
        this.y += dy * 0.04;
      }
    } else if (this.state === 'perched') {
      this.flap += 0.01;
      this.perchTime--;
      if (this.perchTime <= 0) {
        this.state = 'flying-away';
        this.vx = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 1.5 + 1.2);
        this.vy = -(Math.random() * 1.2 + 0.8);
      }
    } else if (this.state === 'flying-away') {
      this.flap += 0.28;
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < -60 || this.x > width + 60 || this.y < -60) {
        this.reset();
      }
    }
  }
  draw(ctx) {
    if (!this.active) return;
    ctx.save();
    ctx.fillStyle = '#1c2030';
    ctx.strokeStyle = 'rgba(28, 32, 48, 0.8)';
    ctx.lineWidth = 1.8;

    if (this.state === 'perched') {
      ctx.beginPath();
      ctx.ellipse(this.x, this.y, 4.5, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(this.x, this.y - 6, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffd54f';
      ctx.beginPath();
      ctx.arc(this.x - 1.2, this.y - 6.5, 0.6, 0, Math.PI * 2);
      ctx.arc(this.x + 1.2, this.y - 6.5, 0.6, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.ellipse(this.x, this.y, 4.5, 3.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      const wingY = Math.sin(this.flap) * 6.5;
      ctx.moveTo(this.x - 7, this.y - wingY);
      ctx.quadraticCurveTo(this.x - 3, this.y - 1.5, this.x, this.y);
      ctx.quadraticCurveTo(this.x + 3, this.y - 1.5, this.x + 7, this.y - wingY);
      ctx.stroke();
    }
    ctx.restore();
  }
}
