<template>
  <div ref="marqueeSection" class="relative w-full overflow-hidden py-12 lg:py-16">
    <!-- Blur/Glow Masks - Left and Right -->
    <div class="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 lg:w-48 bg-gradient-to-r from-[var(--theme-bg)] via-[var(--theme-bg)] to-transparent"></div>
    <div class="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 lg:w-48 bg-gradient-to-l from-[var(--theme-bg)] via-[var(--theme-bg)] to-transparent"></div>

    <!-- Glow effect overlays -->
    <div class="pointer-events-none absolute inset-y-0 left-0 z-20 w-40 lg:w-56 marquee-glow-left"></div>
    <div class="pointer-events-none absolute inset-y-0 right-0 z-20 w-40 lg:w-56 marquee-glow-right"></div>

    <!-- Marquee Track -->
    <div ref="marqueeTrack" class="flex whitespace-nowrap">
      <div
        v-for="n in 2"
        :key="n"
        class="flex shrink-0 items-center gap-8 lg:gap-16 px-4 lg:px-8"
      >
        <span
          v-for="(word, index) in words"
          :key="`${n}-${index}`"
          class="text-4xl lg:text-6xl font-extrabold uppercase tracking-[0.12em] text-[var(--theme-text-strong)] opacity-80 select-none"
        >
          {{ word }}
        </span>
        <span class="text-2xl lg:text-4xl text-[var(--theme-line-strong)] opacity-40 select-none">✦</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';

const words = [
  'Engineer',
  'Designer',
  'Builder',
  'WebDev',
  'Creative',
  'Crafting',
  'Focused',
  'Commit'
];

const marqueeSection = ref(null);
const marqueeTrack = ref(null);
let marqueeAnimation = null;

onMounted(() => {
  if (!marqueeTrack.value) return;

  const trackWidth = marqueeTrack.value.scrollWidth / 2;

  marqueeAnimation = gsap.to(marqueeTrack.value, {
    x: -trackWidth,
    duration: 30,
    ease: 'none',
    repeat: -1,
    modifiers: {
      x: gsap.utils.unitize(x => parseFloat(x) % trackWidth)
    }
  });
});

onUnmounted(() => {
  if (marqueeAnimation) {
    marqueeAnimation.kill();
    marqueeAnimation = null;
  }
});
</script>

<style scoped>
/* Glow effect on edges */
.marquee-glow-left {
  background: radial-gradient(
    ellipse 80% 50% at 0% 50%,
    var(--marquee-glow-color) 0%,
    transparent 70%
  );
  opacity: 0.6;
}

.marquee-glow-right {
  background: radial-gradient(
    ellipse 80% 50% at 100% 50%,
    var(--marquee-glow-color) 0%,
    transparent 70%
  );
  opacity: 0.6;
}

/* Theme-specific glow colors */
:root {
  --marquee-glow-color: rgba(255, 255, 255, 0.15);
}

:global([data-theme="light"]) {
  --marquee-glow-color: rgba(0, 0, 0, 0.08);
}

:global([data-theme="dark"]) {
  --marquee-glow-color: rgba(255, 255, 255, 0.12);
}
</style>
