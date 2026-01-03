<template>

  <Background />
  <Navbar />

 
  <section id="home"></section>
  <section id="about"></section>
  <section id="skills"></section>
  <section id="projects"></section>
  <section id="contact"></section>
  
</template>

<script setup>
import Navbar from "./components/Navbar.vue";
import Background from "./components/Background.vue";
</script>

<style>

body {
  color: white;
  margin: 0;
}

html {
  scroll-behavior: smooth;
}
</style>
