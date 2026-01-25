<template>

  <Background />
  <Navbar />
  <Home />
  <Impact />
  <About />
  <Skills />
  <Statement />
  <Projects />
  <Contact />

</template>

<script setup>
import Navbar from "./components/Navbar.vue";
import Background from "./components/Background.vue";
import Home from "./components/Home.vue";
import Impact from "./components/Impact.vue";
import About from "./components/About.vue";
import Skills from "./components/Skills.vue";
import Statement from "./components/Statement.vue";
import Projects from "./components/Projects.vue";
import Contact from "./components/Contact.vue";
</script>

<style>
html {
  scroll-behavior: smooth;
}
</style>
