<template>
  <div v-if="isVisible" ref="loaderEl" class="intro-loader" aria-hidden="true">
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

const loaderEl = ref(null);
const titleEl = ref(null);
const seg1 = ref(null);
const seg2 = ref(null);
const seg3 = ref(null);
const seg4 = ref(null);
const isVisible = ref(true);

let slideTimeline = null;
let exitTimeline = null;
let previousOverflow = "";

const finishIntro = () => {
  if (!isVisible.value) return;
  isVisible.value = false;
  document.body.style.overflow = previousOverflow;
  emit("done");
};

const runExitAnimation = () => {
  window.dispatchEvent(new CustomEvent("intro:reveal"));

  exitTimeline = gsap.timeline({ onComplete: finishIntro });

  exitTimeline
    .to(titleEl.value, {
      opacity: 0,
      y: -20,
      duration: 0.5,
      ease: "power2.inOut",
      delay: 0.35,
    })
    .to(
      loaderEl.value,
      {
        opacity: 0,
        duration: 0.7,
        ease: "power2.inOut",
      },
      "-=0.2"
    );
};

const runSlideAnimation = () => {
  if (!seg1.value || !seg2.value || !seg3.value || !seg4.value) return;

  const slideDuration = 1.5;
  const wave2Offset = 0.08;

  slideTimeline = gsap.timeline({ onComplete: runExitAnimation });

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
  background: #000;
}

.intro-title {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
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
  font-family: "Reforma 2018 Negra", "Oxanium", sans-serif;
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
