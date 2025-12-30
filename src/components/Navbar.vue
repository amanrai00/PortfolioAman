<template>
  <nav
    :class="[
      'fixed top-0 left-0 z-50 w-full bg-[#404040] p-5 transition-all duration-300',
      'lg:px-28 px-5',
      'text-white',
      'relative',
      hasShadow ? 'shadow-md' : 'shadow-none',
      isReady ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
    ]"
  >
    <div class="container mx-auto">
      <!-- TOP ROW: logo + desktop nav + buttons + mobile toggle -->
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <div
          :class="[
            'flex items-center gap-1 cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-95',
            'lg:opacity-100 lg:pointer-events-auto',
            isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          ]"
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

      <!-- ========== MOBILE NAV (slides from top, under navbar) ========== -->
      <Transition name="mobile-slide">
        <div
          v-if="isOpen"
          class="absolute left-0 top-full w-full bg-[#404040] text-white lg:hidden font-semibold overflow-hidden origin-top px-10"
        >
          <div class="flex flex-col gap-4 px-5 pb-5 pt-4">
            <ul class="flex flex-col gap-4">
              <li
                v-for="item in sections"
                :key="item.id"
              >
                <button @click="scrollToSection(item.id)"
                class="group relative inline-flex flex-col items-start font-semibold transition-transform duration-150 hover:scale-[1.08]"
                >
                <span>{{ item.label }}</span>

                <span class="mt-1 block w-full bg-white/30 transition-transform duration-300 group-hover:scale-x-110 group-hover:scale-y-[1.3]"
                style="height: 0.5px"
                ></span>
                </button>
              </li>
            </ul>

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
  window.addEventListener('resize', handleResize);
  handleScroll();
  requestAnimationFrame(() => {
    isReady.value = true;
  });
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', handleResize);
});

const handleResize = () => {
  // lg breakpoint ≈ 1024px
  if (window.innerWidth >= 1024 && isOpen.value) {
    isOpen.value = false;
  }
};
</script>

<style scoped>
/* Slide from top like Framer Motion y: "-100%" -> 0 */
.mobile-slide-enter-active,
.mobile-slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.mobile-slide-enter-from,
.mobile-slide-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.mobile-slide-enter-to,
.mobile-slide-leave-from {
  transform: translateY(0);
  opacity: 1;
}

</style>
