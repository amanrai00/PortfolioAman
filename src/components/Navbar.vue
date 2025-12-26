<template>
  <nav
    :class="[
      'fixed top-0 left-0 z-50 w-full bg-white p-5 transition-all duration-300',
      'lg:px-28 px-5',
      hasShadow ? 'shadow-md' : 'shadow-none',
      isReady ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
    ]"
  >
    <div class="container mx-auto flex items-center justify-between">
      <!-- Logo -->
      <img
        :src="logo"
        alt="Logo"
        class="h-9 cursor-pointer transition-transform duration-150 hover:scale-110 active:scale-95"
        @click="scrollToSection('home')"
      />

      <!-- Desktop nav -->
      <ul class="hidden items-center gap-x-7 font-semibold lg:flex">
        <li
          v-for="item in sections"
          :key="item.id"
          class="group transition-transform duration-150 hover:scale-110"
        >
          <button @click="scrollToSection(item.id)">
            {{ item.label }}
          </button>
          <span
            class="flex h-[2px] w-0 bg-black transition-all duration-300 group-hover:w-full"
          ></span>
        </li>
      </ul>

      <!-- Desktop resume button -->
      <a
        href=""
        class="group relative hidden px-4 py-2 font-medium lg:inline-block"
      >
        <span
          class="absolute inset-0 h-full w-full translate-x-1 translate-y-1 bg-black transition duration-200 ease-out group-hover:translate-x-0 group-hover:translate-y-0"
        ></span>
        <span
          class="absolute inset-0 h-full w-full border-2 border-black bg-white transition-colors duration-200 group-hover:bg-black"
        ></span>
        <span
          class="relative flex items-center gap-x-3 text-black transition-colors duration-200 group-hover:text-white"
        >
          Resume
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M12 3v12" />
            <path d="M8 11l4 4 4-4" />
            <path d="M4 19h16" />
          </svg>
        </span>
      </a>

      <!-- Mobile menu toggle -->
      <button
        class="text-2xl lg:hidden transition-transform duration-150 hover:scale-110"
        @click="isOpen = !isOpen"
      >
        <svg
          v-if="!isOpen"
          xmlns="http://www.w3.org/2000/svg"
          class="h-7 w-7"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
        >
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="h-7 w-7"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
        >
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>

    <!-- ========= MOBILE NAV LIKE SK-ILLUSTRATION ========= -->

    <!-- 1) Fullscreen white overlay (fades in) -->
    <div
      class="fixed inset-0 z-40 bg-white lg:hidden transition-opacity duration-300"
      :class="isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'"
    ></div>

    <!-- 2) Top bar that drops from the top -->
    <!-- 2) Top bar that drops from the top – WITHOUT LOGO -->
<div
  class="fixed top-0 left-0 z-50 flex w-full justify-end bg-white p-5 lg:hidden transition-transform duration-300"
  :class="isOpen ? 'translate-y-0' : '-translate-y-full'"
>
  <!-- Close icon -->
  <button
    class="text-2xl"
    @click="isOpen = false"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-7 w-7"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  </button>
</div>


    <!-- 3) Menu items (fade + small slide) -->
    <ul
      class="fixed left-0 top-24 z-50 ml-10 flex flex-col gap-y-6 font-semibold lg:hidden transition-all duration-300"
      :class="isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'"
    >
      <li
        v-for="item in sections"
        :key="item.id"
        class="border-b pb-2"
      >
        <button @click="scrollToSection(item.id)">
          {{ item.label }}
        </button>
      </li>

      <a
        href=""
        class="group relative inline-block px-4 py-2 font-semibold mt-4"
      >
        <span
          class="absolute inset-0 h-full w-full translate-x-1 translate-y-1 bg-black transition duration-200 ease-out group-hover:translate-x-0 group-hover:translate-y-0"
        ></span>
        <span
          class="absolute inset-0 h-full w-full border-2 border-black bg-white transition-colors duration-200 group-hover:bg-black"
        ></span>
        <span
          class="relative flex items-center gap-x-3 text-black transition-colors duration-200 group-hover:text-white"
        >
          Resume
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M12 3v12" />
            <path d="M8 11l4 4 4-4" />
            <path d="M4 19h16" />
          </svg>
        </span>
      </a>
    </ul>
  </nav>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import logo from '../assets/logo.png';

const hasShadow = ref(false);
const isOpen = ref(false);
const isReady = ref(false);

const sections = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' }
];

const handleScroll = () => {
  hasShadow.value = window.scrollY > 0;
};

const scrollToSection = (id) => {
  const section = document.getElementById(id);
  if (section) {
    const top = section.offsetTop - 110;
    window.scrollTo({
      top,
      behavior: 'smooth'
    });
  }
  isOpen.value = false;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
  requestAnimationFrame(() => {
    isReady.value = true;
  });
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
/* no custom animation CSS needed – handled by Tailwind classes */
</style>
