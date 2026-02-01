<template>
  <div
    v-if="isVisible"
    class="intro-loader"
    :class="{ 'intro-loader--fade': isFading }"
    aria-hidden="true"
  >
    <canvas ref="canvasEl" class="intro-canvas"></canvas>
    <div class="intro-title" :class="{ 'intro-title--animate': isReady }">
      {{ title }}
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";

const props = defineProps({
  title: {
    type: String,
    default: "Entity",
  },
  duration: {
    type: Number,
    default: 3800,
  },
  fadeDuration: {
    type: Number,
    default: 700,
  },
});

const emit = defineEmits(["done"]);

const canvasEl = ref(null);
const isVisible = ref(true);
const isFading = ref(false);
const isReady = ref(false);

let rafId = 0;
let resizeHandler = null;
let animationCleanup = null;
let timeouts = [];
let previousOverflow = "";

const scheduleTimeout = (handler, delay) => {
  const id = window.setTimeout(handler, delay);
  timeouts.push(id);
};

const finishIntro = () => {
  if (!isVisible.value) return;
  isVisible.value = false;
  if (animationCleanup) {
    animationCleanup();
    animationCleanup = null;
  }
  if (resizeHandler) {
    window.removeEventListener("resize", resizeHandler);
    resizeHandler = null;
  }
  document.body.style.overflow = previousOverflow;
  emit("done");
};

const createCanvasAnimation = (canvas) => {
  const ctx = canvas.getContext("2d");
  let width = document.documentElement.clientWidth;
  let height = document.documentElement.clientHeight;
  let dots = [];
  let currentDotCount = 0;

  const startDotCount = width > 640 ? 280 : 200;
  const amplitude = 380;
  const frequency = 0.075;
  const maxSpeedBase = width > 640 ? 3 : 4;

  const updateCanvasSize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    if (window.devicePixelRatio > 1) {
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      canvas.width = canvasWidth * window.devicePixelRatio;
      canvas.height = canvasHeight * window.devicePixelRatio;
      canvas.style.width = `${canvasWidth}px`;
      canvas.style.height = `${canvasHeight}px`;
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    } else {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
  };

  class Dot {
    constructor(opts) {
      this.ctx = opts.ctx;
      this.startTime = opts.startTime;
      this.frequency = opts.frequency || 5;
      this.amplitude = opts.amplitude || 400;
      this.fill = opts.fill;
      this.color = opts.color || [255, 255, 255];
      this.size = 1;
      this.speed = 0;
      this.section = opts.section;
      this.opacity = 0;
      this.maxSize = opts.maxSize || 16;
      this.maxSpeed = opts.maxSpeed || 1;
      this.x = opts.x || Math.random() * width + (Math.random() * 8 - 8);
      this.direction = opts.direction;
      this.endFunc = typeof opts.endFunc !== "undefined" ? opts.endFunc.bind(this) : undefined;
      this.draw = this.draw.bind(this);
    }

    draw() {
      const x = this.x;
      const y = this._getYPos();
      const pos = this.x * 2 * this.section;
      const isOffScreenX = x >= width + this.size / 2;
      const hasEndFunc = typeof this.endFunc !== "undefined";

      if (isOffScreenX && hasEndFunc) {
        this.endFunc.call();
      }

      if (this.speed < this.maxSpeed) {
        this.speed += 0.01;
      }
      if (this.opacity < 1) {
        this.opacity += 0.02;
      }

      if (this.size < this.maxSize / 3) {
        const start = this.startTime + 800;
        const time = window.performance.now() - start;
        const duration = 2000;
        this.size = (this.maxSize / 3) * easeInOutCubic(Math.max(0, time), 0, 1, duration) + 1;
      }

      this.x += this.speed;

      this.ctx.fillStyle = `rgba(${this.color.join(",")}, ${this.opacity})`;
      this.ctx.beginPath();
      this.ctx.arc(pos, y, this.size, 0, 2 * Math.PI);
      this.ctx.closePath();
      if (this.fill) {
        this.ctx.fill();
      } else {
        this.ctx.stroke();
      }
    }

    _getYPos() {
      return this.amplitude * (Math.tan(Math.PI * (this.x / width) * this.frequency - this.x / 10)) + height / 2;
    }
  }

  const createDots = () => {
    for (let i = 0; i <= startDotCount; i += 1) {
      const dot = new Dot({
        ctx,
        color: Math.floor(Math.random() * 5) ? [255, 255, 255] : [255, 200, 90],
        startTime: window.performance.now(),
        frequency,
        amplitude,
        maxSize: Math.random() * 24 + 6,
        maxSpeed: Math.random() * 0.45 / maxSpeedBase,
        section: Math.random() * 2.5 + 1,
        fill: true,
        endFunc: function () {
          this.x = Math.random() * this.size - this.size * 2;
        },
      });

      dots.push(dot);
      currentDotCount += 1;
    }
  };

  const draw = () => {
    rafId = window.requestAnimationFrame(draw);
    ctx.clearRect(0, 0, width, height);

    let i = currentDotCount;
    while (--i) {
      dots[i].draw();
    }
  };

  const easeInOutCubic = (t, b, c, d) => {
    if ((t /= d / 2) < 1) return (c / 2) * t * t * t + b;
    return (c / 2) * ((t -= 2) * t * t + 2) + b;
  };

  updateCanvasSize();
  createDots();
  draw();

  return () => {
    if (rafId) {
      window.cancelAnimationFrame(rafId);
    }
  };
};

onMounted(() => {
  previousOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";

  if (canvasEl.value) {
    animationCleanup = createCanvasAnimation(canvasEl.value);
  }

  requestAnimationFrame(() => {
    isReady.value = true;
  });

  const fadeStart = Math.max(0, props.duration - props.fadeDuration);
  scheduleTimeout(() => {
    isFading.value = true;
  }, fadeStart);

  scheduleTimeout(() => {
    finishIntro();
  }, props.duration);

  resizeHandler = () => {
    if (!canvasEl.value) return;
    const ctx = canvasEl.value.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasEl.value.width, canvasEl.value.height);
  };

  window.addEventListener("resize", resizeHandler, { passive: true });
});

onBeforeUnmount(() => {
  if (resizeHandler) {
    window.removeEventListener("resize", resizeHandler);
  }

  if (animationCleanup) {
    animationCleanup();
  }

  timeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
  timeouts = [];

  document.body.style.overflow = previousOverflow;
});
</script>

<style scoped>
.intro-loader {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: opacity 520ms ease, transform 520ms cubic-bezier(0.22, 1, 0.36, 1);
  transform: scale(1);
  transform-origin: center;
}

.intro-loader--fade {
  opacity: 0;
  transform: scale(1.12);
  pointer-events: none;
}

.intro-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.intro-title {
  position: relative;
  font-family: "Oxanium", "Trebuchet MS", sans-serif;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  font-size: clamp(1.4rem, 3vw, 3rem);
  color: #f8fafc;
  opacity: 0;
  transform: translateY(40px);
  text-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
}

.intro-title--animate {
  animation: intro-pop 900ms cubic-bezier(0.16, 1, 0.3, 1) forwards,
    intro-fade 700ms ease forwards 2200ms,
    intro-zoom-out 520ms cubic-bezier(0.22, 1, 0.36, 1) forwards 3000ms;
}

@keyframes intro-pop {
  0% {
    opacity: 0;
    transform: translateY(52px);
  }
  60% {
    opacity: 1;
    transform: translateY(-6px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes intro-fade {
  to {
    opacity: 0;
    transform: translateY(-10px);
  }
}

@keyframes intro-zoom-out {
  to {
    transform: translateY(-10px) scale(1.25);
    opacity: 0;
  }
}
</style>
