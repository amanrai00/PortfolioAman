<template>
  <IntroLoader v-if="showLoader" title="Entity" @done="showLoader = false" />
  <ScrollIndicator v-if="showScrollIndicator" />
  <Background />
  <Navbar />
  <div class="page-transition" :class="{ 'is-active': isPageTransitioning }" aria-hidden="true"></div>
  <RouterView />

</template>

<script setup>
import { computed, provide, ref } from "vue";
import { useRoute } from "vue-router";
import Navbar from "./components/Navbar.vue";
import Background from "./components/Background.vue";
import ScrollIndicator from "./components/ScrollIndicator.vue";
import IntroLoader from "./components/IntroLoader.vue";

const showLoader = ref(true);
const route = useRoute();
const showScrollIndicator = computed(() => route.name === "home");
const isPageTransitioning = ref(false);
let transitionTimers = [];

const startPageTransition = (onMidpoint) => {
  if (isPageTransitioning.value) return;
  isPageTransitioning.value = true;
  transitionTimers.forEach((timer) => window.clearTimeout(timer));
  transitionTimers = [];

  transitionTimers.push(
    window.setTimeout(() => {
      if (typeof onMidpoint === "function") onMidpoint();
    }, 900)
  );

  transitionTimers.push(
    window.setTimeout(() => {
      isPageTransitioning.value = false;
    }, 1800)
  );
};

provide("startPageTransition", startPageTransition);
</script>

<style>
html {
  scroll-behavior: smooth;
}

/* Full-page transition overlay (bottom-to-top wipe) */
.page-transition {
  position: fixed;
  inset: 0;
  z-index: 98;
  pointer-events: none;
}

.page-transition::before,
.page-transition::after {
  content: "";
  position: fixed;
  left: 0;
  width: 100%;
  height: 0;
  top: 100%;
  z-index: 98;
}

.page-transition::before {
  background: var(--theme-cta-bg);
}

.page-transition::after {
  background: color-mix(in srgb, var(--theme-cta-bg) 55%, #000);
}

.page-transition.is-active::before {
  animation: page-wipe-btt 1.8s ease forwards;
}

.page-transition.is-active::after {
  animation: page-wipe-btt 1s 0.6s ease forwards;
}

@keyframes page-wipe-btt {
  0% {
    top: 100%;
    height: 0;
  }
  65% {
    top: 0;
    height: 100%;
  }
  100% {
    top: 0;
    height: 0;
  }
}

/* Hide native scrollbars so the custom indicator is the only one visible */
html,
body {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

html::-webkit-scrollbar,
body::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>
