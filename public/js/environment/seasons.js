export function getSeason() {
  const month = new Date().getMonth();
  return (month >= 2 && month <= 4) ? 'spring' :
         (month >= 5 && month <= 7) ? 'summer' :
         (month >= 8 && month <= 10) ? 'autumn' : 'winter';
}

const leafImg = new Image();
leafImg.src = 'public/assets/particles/leaf.png';

export class Petal {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.size = 3;
    this.vy = 0.4;
    this.vx = 0;
    this.wobble = 0;
    this.wobbleSpeed = 0.01;
    this.angle = 0;
    this.spinSpeed = 0;
  }
  reset(width, height) {
    this.x = Math.random() * width;
    this.y = -20;
    this.size = Math.random() * 4 + 3;
    this.vy = Math.random() * 0.4 + 0.35;
    this.vx = Math.random() * 0.3 - 0.15;
    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleSpeed = Math.random() * 0.015 + 0.01;
    this.angle = Math.random() * Math.PI;
    this.spinSpeed = (Math.random() - 0.5) * 0.015;
  }
  update(mouseX, mouseY, avoidRect, width, height) {
    if (!this.x && !this.y) {
      this.reset(width, height);
      this.y = Math.random() * height;
    }

    this.y += this.vy;
    this.x += this.vx + Math.sin(this.wobble) * 0.2;
    this.wobble += this.wobbleSpeed;
    this.angle += this.spinSpeed;
    
    if (this.y > height + 20) this.reset(width, height);
    if (this.x < -20) this.x = width + 20;
    if (this.x > width + 20) this.x = -20;
  }
  draw(ctx) {
    ctx.fillStyle = 'rgba(255, 185, 196, 0.72)'; // soft pink petal
    ctx.beginPath();
    ctx.ellipse(this.x, this.y, this.size, this.size * 0.48, this.angle, 0, Math.PI * 2);
    ctx.fill();
  }
}

export class Leaf {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.size = 4;
    this.vy = 0.5;
    this.vx = 0;
    this.wobble = 0;
    this.wobbleSpeed = 0.01;
    this.angle = 0;
    this.spinSpeed = 0;
    this.color = 'rgba(230, 81, 0, 0.68)';
  }
  reset(width, height) {
    this.x = Math.random() * width;
    this.y = -20;
    this.size = Math.random() * 6 + 4;
    this.vy = Math.random() * 0.5 + 0.4;
    this.vx = Math.random() * 0.4 - 0.2;
    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleSpeed = Math.random() * 0.02 + 0.01;
    this.angle = Math.random() * Math.PI;
    this.spinSpeed = (Math.random() - 0.5) * 0.025;
    const colors = ['rgba(230, 81, 0, 0.68)', 'rgba(216, 67, 21, 0.65)', 'rgba(245, 124, 0, 0.68)', 'rgba(120, 80, 20, 0.6)'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }
  update(mouseX, mouseY, avoidRect, width, height) {
    if (!this.x && !this.y) {
      this.reset(width, height);
      this.y = Math.random() * height;
    }

    this.y += this.vy;
    this.x += this.vx + Math.sin(this.wobble) * 0.35;
    this.wobble += this.wobbleSpeed;
    this.angle += this.spinSpeed;
    
    if (this.y > height + 20) this.reset(width, height);
    if (this.x < -20) this.x = width + 20;
    if (this.x > width + 20) this.x = -20;
  }
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.globalAlpha = 0.72;
    ctx.drawImage(leafImg, -this.size, -this.size, this.size * 2, this.size * 2);
    ctx.restore();
  }
}

export class Snowflake {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.size = 1;
    this.vy = 0.35;
    this.vx = 0;
    this.wobble = 0;
    this.wobbleSpeed = 0.005;
  }
  reset(width, height) {
    this.x = Math.random() * width;
    this.y = -10;
    this.size = Math.random() * 2.2 + 0.8;
    this.vy = Math.random() * 0.45 + 0.25;
    this.vx = Math.random() * 0.15 - 0.08;
    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleSpeed = Math.random() * 0.01 + 0.005;
  }
  update(mouseX, mouseY, avoidRect, width, height) {
    if (!this.x && !this.y) {
      this.reset(width, height);
      this.y = Math.random() * height;
    }

    this.y += this.vy;
    this.x += this.vx + Math.sin(this.wobble) * 0.15;
    this.wobble += this.wobbleSpeed;
    
    if (this.y > height + 10) this.reset(width, height);
  }
  draw(ctx) {
    ctx.fillStyle = 'rgba(245, 245, 255, 0.85)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }
}
