<template>
  <Navbar />
  <!-- sections must have these IDs -->
  <section id="home"></section>
  <section id="about"></section>
  <section id="skills"></section>
  <section id="projects"></section>
  <section id="contact"></section>
</template>

<script setup>
import Navbar from './components/Navbar.vue';
</script>

<style>
body {
  background: #404040;
  color: white;
}
</style>