<template>
  <div class="bg-wrap" aria-hidden="true">
    <div ref="el" class="bg-lottie"></div>
    <div class="bg-overlay"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import nightSky from "@/assets/lottie/night-sky.json";

const LOTTIE_SPEED = 0.8;
const LOTTIE_RENDERER = "svg";
const LOTTIE_RENDERER_SETTINGS = {
  preserveAspectRatio: "xMidYMid slice",
  progressiveLoad: true,
};

const el = ref(null);
let anim = null;

onMounted(async () => {
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const { default: lottie } = await import("lottie-web");
  anim = lottie.loadAnimation({
    container: el.value,
    renderer: LOTTIE_RENDERER,
    loop: true,
    autoplay: true,
    animationData: nightSky,
    rendererSettings: LOTTIE_RENDERER_SETTINGS,
  });

  // Slightly slower playback keeps the background calm and unobtrusive.
  anim.setSpeed(isMobile ? 0.5 : LOTTIE_SPEED);
});

onBeforeUnmount(() => {
  anim?.destroy();
  anim = null;
});
</script>

<style scoped>
.bg-wrap {
  position: fixed;
  inset: 0;
  z-index: -50;
  pointer-events: none;
  overflow: hidden;
}

.bg-lottie {
  width: 100vw;
  height: 100vh;
  filter: var(--theme-bg-filter) var(--theme-bg-shadow);
  mix-blend-mode: var(--theme-bg-blend);
  transform: scale(var(--theme-bg-scale));
  transform-origin: center;
}

.bg-lottie :deep(svg) {
  width: 100%;
  height: 100%;
}

.bg-overlay {
  position: absolute;
  inset: 0;
  background: var(--theme-bg-overlay);
}
</style>
