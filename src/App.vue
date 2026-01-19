<template>

  <Background />
  <Navbar />
  <Home />
  <Impact />
  <About />
  <Skills />
  <Statement />

  <section id="projects"></section>
  <section id="contact"></section>

</template>

<script setup>
import Navbar from "./components/Navbar.vue";
import Background from "./components/Background.vue";
import Home from "./components/Home.vue";
import Impact from "./components/Impact.vue";
import About from "./components/About.vue";
import Skills from "./components/Skills.vue";
import Statement from "./components/Statement.vue";
</script>

<style>
html {
  scroll-behavior: smooth;
}
</style>
