<template>
  <!-- Lottie background -->
  <div class="bg-wrap" aria-hidden="true">
    <div ref="el" class="bg-lottie"></div>

    <!-- Optional dark overlay for readability -->
    <div class="bg-overlay"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import lottie from "lottie-web";
import nightSky from "@/assets/lottie/night-sky.json";

const el = ref(null);
let anim = null;

onMounted(() => {
  anim = lottie.loadAnimation({
    container: el.value,
    renderer: "svg", // change to "canvas" if you want lighter CPU
    loop: true,
    autoplay: true,
    animationData: nightSky,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice", // fills screen nicely
      progressiveLoad: true,
    },
  });

  anim.setSpeed(0.8); // slower / smoother
});

onBeforeUnmount(() => {
  if (anim) anim.destroy();
  anim = null;
});
</script>

<style scoped>
.bg-wrap {
  position: fixed;
  inset: 0;
  z-index: -50;          /* behind everything */
  pointer-events: none;  /* clicks go through */
  overflow: hidden;
}

/* Lottie container */
.bg-lottie {
  width: 100vw;
  height: 100vh;
  filter: var(--theme-bg-filter);
  mix-blend-mode: var(--theme-bg-blend);
}

/* Force SVG to cover */
.bg-lottie :deep(svg) {
  width: 100%;
  height: 100%;
}

/* Optional overlay (adjust strength) */
.bg-overlay {
  position: absolute;
  inset: 0;
  background: var(--theme-bg-overlay);
}

</style>
