function drawHeart(ctx, x, y, size, color) {
  var x = x;
  var y = y;
  var width = size;
  var height = size;

  ctx.save();
  ctx.beginPath();
  var topCurveHeight = height * 0.3;
  ctx.moveTo(x, y + topCurveHeight);
  // top left curve
  ctx.bezierCurveTo(x, y, x - width / 2, y, x - width / 2, y + topCurveHeight);

  // bottom left curve
  ctx.bezierCurveTo(
    x - width / 2,
    y + (height + topCurveHeight) / 2,
    x,
    y + (height + topCurveHeight) / 2,
    x,
    y + height
  );

  // bottom right curve
  ctx.bezierCurveTo(
    x,
    y + (height + topCurveHeight) / 2,
    x + width / 2,
    y + (height + topCurveHeight) / 2,
    x + width / 2,
    y + topCurveHeight
  );

  // top right curve
  ctx.bezierCurveTo(x + width / 2, y, x, y, x, y + topCurveHeight);

  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}
window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  class Particle {
    constructor(effect, x, y, color) {
      this.effect = effect;
      this.x = Math.random() * this.effect.width;
      this.y = this.effect.height;
      this.originX = x;
      this.originY = y;
      // this.x = this.originX = x;
      // this.y = this.originY = y;
      this.size = effect.gap;
      this.color = color;
      this.dx = 0;
      this.dy = 0;
      this.vx = 0;
      this.vy = 0;
      this.force = 0;
      this.angle = 0;
      this.distance = 0;
      this.friction = Math.random() * 0.1;
      this.ease = Math.random() * 0.4 + 0.005;
    }

    update() {
      // this.dx = this.effect.mouse.x - this.x;
      // this.dy = this.effect.mouse.y - this.y;
      // this.distance = Math.sqrt(this.dx * this.dx + this.dy * this.dy);

      // this.force = -this.effect.mouse.radius / this.distance;

      let mDx = this.effect.mouse.x - this.x;
      let mDy = this.effect.mouse.y - this.y;

      let mDistance = mDx * mDx + mDy * mDy;
      let mForce = -this.effect.mouse.radius / mDistance;

      if (mDistance < this.effect.mouse.radius) {
        this.dx = this.effect.mouse.x - this.x;
        this.dy = this.effect.mouse.y - this.y;
        this.distance = Math.sqrt(this.dx * this.dx + this.dy * this.dy);

        this.force = -this.effect.mouse.radius / this.distance;

        this.angle = Math.atan2(this.dy, this.dx);
        this.vx += this.force * Math.cos(this.angle);
        this.vy += this.force * Math.sin(this.angle);
        this.x +=
          (this.vx *= this.friction) + (this.originX - this.x) * this.ease;
        this.y +=
          (this.vy *= this.friction) + (this.originY - this.y) * this.ease;
        return;
      }

      this.dx = this.effect.centerX - this.x;
      this.dy = this.effect.centerY - this.y;
      this.distance = Math.sqrt(this.dx * this.dx + this.dy * this.dy);

      this.force = -this.effect.beatRadius / this.distance;

      if (this.distance < this.effect.beatRadius) {
        this.size =
          Math.floor(Math.random() * 100) > 70
            ? effect.gap +
              (this.effect.beatRadius - this.effect.originBeatRadius) /
                (this.effect.beatStep * 2)
            : effect.gap;

        this.angle = Math.atan2(this.dy, this.dx);
        this.vx += this.force * Math.cos(this.angle);
        this.vy += this.force * Math.sin(this.angle);
        this.x +=
          (this.vx *= this.friction) + (this.originX - this.x) * this.ease;
        this.y +=
          (this.vy *= this.friction) + (this.originY - this.y) * this.ease;
      } else if (
        this.distance > this.effect.beatRadius &&
        (this.x !== this.originX || this.y !== this.originY)
      ) {
        this.x +=
          (this.vx *= this.friction) + (this.originX - this.x) * this.ease;
        this.y +=
          (this.vy *= this.friction) + (this.originY - this.y) * this.ease;
      }
      // if (this.distance < this.effect.mouse.radius) {
      //   this.angle = Math.atan2(this.dy, this.dx);
      //   this.vx += this.force * Math.cos(this.angle);
      //   this.vy += this.force * Math.sin(this.angle);
      // }
      //   this.x += this.friction + (this.originX - this.x) * this.ease;
      //   this.y += this.friction + (this.originY - this.y) * this.ease;
    }
  }

  class Effect {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.image = document.getElementById("image");
      this.centerX = this.width / 2;
      this.centerY = this.height / 2;
      this.x = this.centerX - this.image.width / 2;
      this.y = this.centerY - this.image.height / 2;
      this.particles = [];
      this.gap = 5;
      this.originBeatRadius = 30000;
      this.beatStep = 5000;
      this.beatRadius = this.originBeatRadius;
      this.mouse = {
        radius: 10000,
        x: this.centerX,
        y: this.centerY,
      };
      window.addEventListener("mousemove", (event) => {
        this.mouse.x = event.x;
        this.mouse.y = event.y;
      });

      window.addEventListener(
        "touchstart",
        (event) => {
          this.mouse.x = event.changedTouches[0].clientX;
          this.mouse.y = event.changedTouches[0].clientY;
        },
        false
      );

      window.addEventListener(
        "touchmove",
        (event) => {
          event.preventDefault();
          this.mouse.x = event.targetTouches[0].clientX;
          this.mouse.y = event.targetTouches[0].clientY;
        },
        false
      );

      window.addEventListener(
        "touchend",
        (event) => {
          event.preventDefault();
          this.mouse.x = 0;
          this.mouse.y = 0;
        },
        false
      );
    }
    init(context) {
      context.drawImage(this.image, this.x, this.y);
      var pixels = context.getImageData(0, 0, this.width, this.height).data;
      var index;
      for (var y = 0; y < this.height; y += this.gap) {
        for (var x = 0; x < this.width; x += this.gap) {
          index = (y * this.width + x) * 4;
          const red = pixels[index];
          const green = pixels[index + 1];
          const blue = pixels[index + 2];
          const color = "rgb(" + red + "," + green + "," + blue + ")";

          const alpha = pixels[index + 3];
          // if (alpha == 0 && Math.floor(Math.random() * 100) > 95) {
          //   this.particles.push(new Particle(this, x, y, 'white'));
          // }
          if (alpha > 0) {
            this.particles.push(new Particle(this, x, y, "#ea80b0"));
          }
        }
      }
      context.clearRect(0, 0, this.width, this.height);
    }
    update() {
      for (var i = 0; i < this.particles.length; i++) {
        this.particles[i].update();
      }
    }
    render(context) {
      context.clearRect(0, 0, this.width, this.height);
      for (
        var i = 0;
        i < this.particles.length;
        i += Math.floor(Math.random() * 3)
      ) {
        var p = this.particles[i];
        context.fillStyle =
          Math.floor(Math.random() * 100) > 50 ? "black" : p.color;
        // context.fillRect(p.x, p.y, p.size, p.size);
        drawHeart(context, p.x, p.y, p.size, p.color);
      }
    }
  }

  const effect = new Effect(canvas.width, canvas.height);
  effect.init(ctx);

  function animate() {
    effect.beatRadius += effect.beatStep;
    if (effect.beatRadius === effect.originBeatRadius * 3) {
      effect.beatRadius = effect.originBeatRadius;
    }
    effect.update();
    effect.render(ctx);
    requestAnimationFrame(animate);
  }
  animate();
});
