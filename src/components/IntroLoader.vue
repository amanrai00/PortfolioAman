<template>
  <div v-if="isVisible" class="intro-loader" aria-hidden="true">
    <div ref="leftBlockEl" class="block block-left"></div>
    <div ref="rightBlockEl" class="block block-right"></div>
    <div class="intro-title">
      <span ref="line1El" class="intro-title-line logo-line-1">{{ line1 }}</span>
      <span ref="line2El" class="intro-title-line logo-line-2">{{ line2 }}</span>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import gsap from "gsap";

const props = defineProps({
  line1: {
    type: String,
    default: "AMAN",
  },
  line2: {
    type: String,
    default: "RAI",
  },
  splitDuration: {
    type: Number,
    default: 1500,
  },
});

const emit = defineEmits(["done"]);

const leftBlockEl = ref(null);
const rightBlockEl = ref(null);
const line1El = ref(null);
const line2El = ref(null);
const isVisible = ref(true);
let titleTimeline = null;
let splitTimeline = null;
let timeouts = [];
let previousOverflow = "";

const scheduleTimeout = (handler, delay) => {
  const id = window.setTimeout(handler, delay);
  timeouts.push(id);
};

const finishIntro = () => {
  if (!isVisible.value) return;
  isVisible.value = false;
  if (titleTimeline) {
    titleTimeline.kill();
    titleTimeline = null;
  }
  if (splitTimeline) {
    splitTimeline.kill();
    splitTimeline = null;
  }
  document.body.style.overflow = previousOverflow;
  emit("done");
};

const runSplitReveal = () => {
  if (!leftBlockEl.value || !rightBlockEl.value || !line1El.value || !line2El.value) return;

  window.dispatchEvent(new CustomEvent("intro:reveal"));

  const dur = props.splitDuration / 1000;

  splitTimeline = gsap.timeline({
    onComplete: () => finishIntro(),
  });

  splitTimeline
    .to(leftBlockEl.value, {
      left: "-50%",
      duration: dur,
      ease: "power3.inOut",
    }, 0)
    .to(rightBlockEl.value, {
      right: "-50%",
      duration: dur,
      ease: "power3.inOut",
    }, 0)
    .to(line1El.value, {
      x: "-120vw",
      duration: dur,
      ease: "power3.inOut",
    }, 0)
    .to(line2El.value, {
      x: "120vw",
      duration: dur,
      ease: "power3.inOut",
    }, 0);
};

const runTitleReveal = () => {
  if (!line1El.value || !line2El.value) return;

  const revealTime = 0.6;
  const lineDelay = 0.08;

  titleTimeline = gsap.timeline({
    onComplete: () => {
      scheduleTimeout(() => runSplitReveal(), 400);
    },
  });

  titleTimeline
    .to(line1El.value, {
      backgroundPosition: "0% 0%",
      color: "#fff",
      duration: revealTime,
      ease: "none",
      delay: 0.3,
    })
    .to(
      line2El.value,
      {
        backgroundPosition: "0% 0%",
        color: "#fff",
        duration: revealTime,
        ease: "none",
      },
      `+=${lineDelay}`
    );
};

onMounted(() => {
  previousOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";

  requestAnimationFrame(() => {
    runTitleReveal();
  });
});

onBeforeUnmount(() => {
  if (titleTimeline) {
    titleTimeline.kill();
    titleTimeline = null;
  }
  if (splitTimeline) {
    splitTimeline.kill();
    splitTimeline = null;
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
  overflow: hidden;
}

.block {
  position: absolute;
  top: 0;
  width: 50%;
  height: 100%;
  background: #000;
  will-change: left, right;
}

.block-left {
  left: 0;
}

.block-right {
  right: 0;
}

.intro-title {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
  pointer-events: none;
}

.intro-title-line {
  display: block;
  font-family: "Oxanium", sans-serif;
  font-weight: 400;
  font-style: normal;
  text-transform: uppercase;
  text-shadow: 0 16px 34px rgba(0, 0, 0, 0.45);
  font-size: clamp(2.2rem, 5.5vw, 4rem);
  letter-spacing: -0.02em;
  line-height: 0.78;
  transform: skewX(-8deg);
  white-space: nowrap;
  will-change: transform;
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  background-image: linear-gradient(0deg, #3a3a3a, #3a3a3a 50%, #fff 0);
  background-size: 100% 200%;
  background-position: 0% 100%;
  color: #3a3a3a;
}

.logo-line-2 {
  margin-top: 0.02em;
}

@media (max-width: 640px) {
  .intro-title-line {
    font-size: clamp(1.8rem, 10vw, 2.8rem);
    letter-spacing: -0.02em;
  }
}
</style>
