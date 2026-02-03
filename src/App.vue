<template>
  <IntroLoader v-if="showLoader" title="Entity" @done="showLoader = false" />
  <ScrollIndicator v-if="showScrollIndicator" />
  <Background />
  <Navbar />
  <div class="page-transition" :class="{ 'is-active': isPageTransitioning }" aria-hidden="true">
    <div class="wipe-panel panel-1"></div>
    <div class="wipe-panel panel-2"></div>
    <div class="wipe-panel panel-3"></div>
    <div class="wipe-panel panel-4"></div>
  </div>
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
      // Scroll to top while panels cover the screen
      window.scrollTo({ top: 0, behavior: "instant" });
      if (typeof onMidpoint === "function") onMidpoint();
    }, 580)
  );

  transitionTimers.push(
    window.setTimeout(() => {
      isPageTransitioning.value = false;
    }, 1350)
  );
};

provide("startPageTransition", startPageTransition);
</script>

<style>
html {
  scroll-behavior: smooth;
}

/* Multi-panel wipe transition */
.page-transition {
  position: fixed;
  inset: 0;
  z-index: 98;
  pointer-events: none;
}

.wipe-panel {
  position: fixed;
  inset: 0;
  transform: translateY(100%);
}

.panel-1 { background: #292524; }
.panel-2 { background: #57534e; }
.panel-3 { background: #a39e93; }
.panel-4 { background: #d6cfc4; }

:root[data-theme="dark"] .panel-1 { background: #1a1a1a; }
:root[data-theme="dark"] .panel-2 { background: #404040; }
:root[data-theme="dark"] .panel-3 { background: #6b6b6b; }
:root[data-theme="dark"] .panel-4 { background: #9a9a9a; }

.page-transition.is-active .wipe-panel {
  animation: panelWipe 1.1s ease-in-out forwards;
}

.page-transition.is-active .panel-1 { animation-delay: 0s; }
.page-transition.is-active .panel-2 { animation-delay: 0.08s; }
.page-transition.is-active .panel-3 { animation-delay: 0.16s; }
.page-transition.is-active .panel-4 { animation-delay: 0.24s; }

@keyframes panelWipe {
  0% {
    transform: translateY(100%);
  }
  45% {
    transform: translateY(0%);
  }
  55% {
    transform: translateY(0%);
  }
  100% {
    transform: translateY(-100%);
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
