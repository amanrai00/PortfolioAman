<template>
  <nav
    :class="[
      'fixed top-0 left-0 z-50 w-full bg-[#404040] p-5 transition-all duration-300',
      'lg:px-28 px-5',
      'text-white',
      hasShadow ? 'shadow-md' : 'shadow-none',
      isReady ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
    ]"
  >
    <div class="container mx-auto">
      <!-- TOP ROW: logo + desktop nav + buttons + mobile toggle -->
      <div class="flex items-center justify-between">
        <!-- Logo -->
         <div class="flex items-center gap-1 cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-95"
         @click="scrollToSection('home')"
         >
            <img
              :src="logo"
              alt="Logo"
              class="h-10 invert brightness-100"
              @click="scrollToSection('home')"
            />

            <!-- Second Logo -->
          <img
              :src="SecondLogo"   
              alt="Second Logo"
              class="h-7 invert brightness-50"
            />
        </div>

        <!-- Desktop nav -->
        <ul class="hidden items-center gap-x-7 font-semibold lg:flex">
          <li
            v-for="item in sections"
            :key="item.id"
            class="group transition-transform duration-150 hover:scale-110"
          >
            <button class="hover:text-gray-300" @click="scrollToSection(item.id)">
              {{ item.label }}
            </button>
            <span
              class="flex h-[2px] w-0 bg-white transition-all duration-300 group-hover:w-full"
            ></span>
          </li>
        </ul>

        <!-- Desktop resume button -->
        <a
          href=""
          class="group relative hidden px-4 py-2 font-medium lg:inline-block"
        >
          <span
            class="absolute inset-0 h-full w-full translate-x-1 translate-y-1 bg-[#284B63] transition duration-200 ease-out group-hover:translate-x-0 group-hover:translate-y-0"
          ></span>
          <span
            class="absolute inset-0 h-full w-full border-2 border-white bg-transparent transition-colors duration-200 group-hover:bg-white"
          ></span>
          <span
            class="relative flex items-center gap-x-3 text-white transition-colors duration-200 group-hover:text-gray-900"
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
            stroke="white"
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
            stroke="white"
            stroke-width="1.8"
            stroke-linecap="round"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      <!-- ========== MOBILE NAV (Bootstrap-style collapse) ========== -->
      <Transition name="mobile-collapse">
        <div
          v-if="isOpen"
          class="mt-4 flex flex-col gap-4 font-semibold lg:hidden bg-[#404040] text-white"
        >
          <ul class="flex flex-col gap-4">
            <li
              v-for="item in sections"
              :key="item.id"
              class="border-b border-white pb-2"
            >
              <button @click="scrollToSection(item.id)">
                {{ item.label }}
              </button>
            </li>
          </ul>
asdasdasd
          <a
            href=""
            class="group relative inline-block w-max px-4 py-2 font-semibold"
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
        </div>
      </Transition>
    </div>
  </nav>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import logo from '../assets/logo1.png';
import SecondLogo from '../assets/second-logo.png';

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
/* Bootstrap-like collapse animation for mobile nav */
.mobile-collapse-enter-active,
.mobile-collapse-leave-active {
  transition: max-height 0.3s ease, opacity 0.3s ease;
}

.mobile-collapse-enter-from,
.mobile-collapse-leave-to {
  max-height: 0;
  opacity: 0;
}

.mobile-collapse-enter-to,
.mobile-collapse-leave-from {
  max-height: 400px; /* big enough to show all items */
  opacity: 1;
}
</style>
