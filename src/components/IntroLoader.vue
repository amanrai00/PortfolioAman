<template>
  <div v-if="isVisible" class="intro-loader" aria-hidden="true">
    <div class="intro-tiles">
      <div ref="tile1" class="intro-tile"></div>
      <div ref="tile2" class="intro-tile"></div>
      <div ref="tile3" class="intro-tile"></div>
      <div ref="tile4" class="intro-tile"></div>
      <div ref="tile5" class="intro-tile"></div>
    </div>
    <div class="intro-title" ref="titleEl">
      <div class="title-row">
        <div class="title-charts-cont"><span ref="seg1">A</span></div>
        <div class="title-charts-cont"><span ref="seg2">MAN</span></div>
        <div class="title-space">&nbsp;</div>
        <div class="title-charts-cont"><span ref="seg3">R</span></div>
        <div class="title-charts-cont"><span ref="seg4">AI</span></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import gsap from "gsap";

const emit = defineEmits(["done"]);

const titleEl = ref(null);
const seg1 = ref(null);
const seg2 = ref(null);
const seg3 = ref(null);
const seg4 = ref(null);
const tile1 = ref(null);
const tile2 = ref(null);
const tile3 = ref(null);
const tile4 = ref(null);
const tile5 = ref(null);
const isVisible = ref(true);
const introTransitionBg =
  "linear-gradient(45deg, rgba(194, 233, 221, 1) 1%, rgba(104, 119, 132, 1) 100%), linear-gradient(-45deg, #494d71 0%, rgba(217, 230, 185, 1) 80%)";

let slideTimeline = null;
let exitTimeline = null;
let previousOverflow = "";

const finishIntro = () => {
  if (!isVisible.value) return;
  isVisible.value = false;
  document.body.style.overflow = previousOverflow;
  emit("done");
};

const runTileTransition = () => {
  const tiles = [tile1, tile2, tile3, tile4, tile5].map((t) => t.value);
  if (tiles.some((t) => !t)) return;

  window.dispatchEvent(new CustomEvent("intro:reveal"));

  exitTimeline = gsap.timeline({ onComplete: finishIntro });

  // Start tile transition first, then fade text while transition is in progress
  exitTimeline
    .to(tiles, {
      x: "-100%",
      backgroundImage: introTransitionBg,
      duration: 0.7,
      ease: "power3.inOut",
      stagger: 0.1,
    }, 0)
    .to(titleEl.value, { opacity: 0, duration: 0.25, ease: "power2.out" }, 0.18);
};

const runSlideAnimation = () => {
  if (!seg1.value || !seg2.value || !seg3.value || !seg4.value) return;

  const slideDuration = 1.5;
  const wave2Offset = 0.08;

  slideTimeline = gsap.timeline({
    onComplete: () => runTileTransition(),
  });

  // Wave 1 — outer segments
  slideTimeline
    .fromTo(
      seg1.value,
      { x: "2.5em" },
      { x: "0em", duration: slideDuration, ease: "power2.out" },
      0
    )
    .fromTo(
      seg4.value,
      { x: "-2em" },
      { x: "0em", duration: slideDuration, ease: "power2.out" },
      0
    )

    // Wave 2 — inner segments
    .fromTo(
      seg2.value,
      { x: "-3.5em" },
      { x: "0em", duration: slideDuration, ease: "power2.out" },
      wave2Offset
    )
    .fromTo(
      seg3.value,
      { x: "2em" },
      { x: "0em", duration: slideDuration, ease: "power2.out" },
      wave2Offset
    );
};

onMounted(() => {
  previousOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";

  requestAnimationFrame(() => runSlideAnimation());
});

onBeforeUnmount(() => {
  if (slideTimeline) {
    slideTimeline.kill();
    slideTimeline = null;
  }
  if (exitTimeline) {
    exitTimeline.kill();
    exitTimeline = null;
  }
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

.intro-tiles {
  position: absolute;
  inset: 0;
  z-index: 1;
  overflow: hidden;
}

.intro-tile {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(45deg, rgba(194, 233, 221, 1) 1%, rgba(104, 119, 132, 1) 100%), linear-gradient(-45deg, #494d71 0%, rgba(217, 230, 185, 1) 80%);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  backface-visibility: hidden;
  transform: translateZ(0);
  will-change: transform;
}

.intro-tile:nth-child(1) {
  clip-path: inset(0 0 79.6% 0);
  -webkit-clip-path: inset(0 0 79.6% 0);
}
.intro-tile:nth-child(2) {
  clip-path: inset(19.6% 0 59.6% 0);
  -webkit-clip-path: inset(19.6% 0 59.6% 0);
}
.intro-tile:nth-child(3) {
  clip-path: inset(39.6% 0 39.6% 0);
  -webkit-clip-path: inset(39.6% 0 39.6% 0);
}
.intro-tile:nth-child(4) {
  clip-path: inset(59.6% 0 19.6% 0);
  -webkit-clip-path: inset(59.6% 0 19.6% 0);
}
.intro-tile:nth-child(5) {
  clip-path: inset(79.6% 0 0 0);
  -webkit-clip-path: inset(79.6% 0 0 0);
}

.intro-title {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  pointer-events: none;
}

.title-row {
  display: flex;
}

.title-charts-cont {
  display: inline-flex;
  overflow: hidden;
}

.title-charts-cont span {
  display: inline-block;
  will-change: transform;
  font-family: "Caprasimo-Regular", "Oxanium", sans-serif;
  font-weight: 400;
  text-transform: uppercase;
  font-size: clamp(2.2rem, 5.5vw, 4rem);
  letter-spacing: -0.02em;
  line-height: 1;
  color: #fff;
  white-space: nowrap;
}

.title-space {
  font-size: clamp(2.2rem, 5.5vw, 4rem);
  width: 0.3em;
}

@media (max-width: 640px) {
  .title-charts-cont span {
    font-size: clamp(1.8rem, 10vw, 2.8rem);
  }
  .title-space {
    font-size: clamp(1.8rem, 10vw, 2.8rem);
  }
}
</style>
