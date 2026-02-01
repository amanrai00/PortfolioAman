<template>
  <IntroLoader v-if="showLoader" title="Entity" @done="showLoader = false" />
  <ScrollIndicator v-if="showScrollIndicator" />
  <Background />
  <Navbar />
  <RouterView />

</template>

<script setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import Navbar from "./components/Navbar.vue";
import Background from "./components/Background.vue";
import ScrollIndicator from "./components/ScrollIndicator.vue";
import IntroLoader from "./components/IntroLoader.vue";

const showLoader = ref(true);
const route = useRoute();
const showScrollIndicator = computed(() => route.name === "home");
</script>

<style>
html {
  scroll-behavior: smooth;
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
