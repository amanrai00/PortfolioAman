<template>
  <div ref="trackRef" class="scroll-indicator" aria-hidden="true">
    <div ref="thumbRef" class="scroll-indicator__thumb"></div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { gsap } from "gsap";

const trackRef = ref(null);
const thumbRef = ref(null);

const MIN_FILL_HEIGHT = 0;
let trackHeight = 0;
let moveThumb = null;

function updateFill() {
  if (!moveThumb) return;

  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight;
  const viewportHeight = window.innerHeight;

  const maxScroll = Math.max(scrollHeight - viewportHeight, 1);
  const progress = scrollTop / maxScroll;

  const fillHeight = Math.max(progress * trackHeight, MIN_FILL_HEIGHT);
  moveThumb(fillHeight);
}

function recalcThumb() {
  if (!trackRef.value || !thumbRef.value) return;

  trackHeight = trackRef.value.clientHeight;
  updateFill();
}

function onScroll() {
  updateFill();
}

function onResize() {
  recalcThumb();
}

onMounted(() => {
  if (!thumbRef.value) return;

  moveThumb = gsap.quickTo(thumbRef.value, "height", {
    duration: 0.2,
    ease: "power2.out",
    overwrite: true,
  });

  recalcThumb();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", onResize);
});
</script>

<style scoped>
.scroll-indicator {
  position: fixed;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 100px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  z-index: 9999;
  pointer-events: none;
}

.scroll-indicator__thumb {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 6px;
  background: #01baef;
  border-radius: 999px;
  will-change: height;
}
</style>
