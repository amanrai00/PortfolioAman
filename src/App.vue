<template>

  <ScrollIndicator />
  <Background />
  <Navbar />
  <Home />
  <Impact />
  <About />
  <Skills />
  <Statement />
  <Projects />
  <Contact />
  <Footer />

</template>

<script setup>
import Navbar from "./components/Navbar.vue";
import Background from "./components/Background.vue";
import ScrollIndicator from "./components/ScrollIndicator.vue";
import Home from "./sections/Home.vue";
import Impact from "./sections/Impact.vue";
import About from "./sections/About.vue";
import Skills from "./sections/Skills.vue";
import Statement from "./sections/Statement.vue";
import Projects from "./sections/Projects.vue";
import Contact from "./sections/Contact.vue";
import Footer from "./components/Footer.vue";
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
