<template>
  <main class="home-page">
    <Home />
    <Impact />
    <About />
    <Skills />
    <Statement />
    <div id="projects-anchor" class="projects-anchor" aria-hidden="true"></div>
    <Projects />
    <Contact />
    <Footer />
  </main>
</template>

<script setup>
import { nextTick, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Home from "@/sections/Home.vue";
import Impact from "@/sections/Impact.vue";
import About from "@/sections/About.vue";
import Skills from "@/sections/Skills.vue";
import Statement from "@/sections/Statement.vue";
import Projects from "@/sections/Projects.vue";
import Contact from "@/sections/Contact.vue";
import Footer from "@/components/Footer.vue";

const route = useRoute();
const router = useRouter();

const scrollToRouteTarget = () => {
  const hashTarget = route.hash && route.hash.length > 1 ? route.hash : null;
  const section =
    Array.isArray(route.query.section) ? route.query.section[0] : route.query.section;
  const target = hashTarget || (section ? `#${section}` : null);
  if (!target) return;

  let attempts = 0;
  const maxAttempts = 60;
  const tryScroll = () => {
    const el = document.querySelector(target);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      if (route.hash || route.query.section) {
        const cleanUrl = router.resolve({ name: "home" }).href;
        window.history.replaceState({}, "", cleanUrl);
      }
      return;
    }
    attempts += 1;
    if (attempts < maxAttempts) {
      window.setTimeout(tryScroll, 50);
    }
  };

  tryScroll();
};

onMounted(() => {
  nextTick(scrollToRouteTarget);
});

watch(
  () => [route.hash, route.query.section],
  () => {
    nextTick(scrollToRouteTarget);
  }
);
</script>

<style scoped>
.projects-anchor {
  height: 1px;
  scroll-margin-top: clamp(16vh, 22vh, 28vh);
}
</style>
