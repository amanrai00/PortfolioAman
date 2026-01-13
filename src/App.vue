<template>

  <Background />
  <Navbar />
  <Home />
  <Impact />
  <About />

  <section id="skills"></section>
  <section id="projects"></section>
  <section id="contact"></section>
  
</template>

<script setup>
import Navbar from "./components/Navbar.vue";
import Background from "./components/Background.vue";
import Home from "./components/Home.vue";
import Impact from "./components/Impact.vue";
import About from "./components/About.vue";
</script>

<style>
html {
  scroll-behavior: smooth;
}
</style>
