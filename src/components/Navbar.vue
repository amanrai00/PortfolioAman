<template>
  <div>
    <nav
      :class="[
        'fixed top-0 left-0 z-[90] w-full p-5 text-white transition-all duration-300',
        'lg:px-28 px-5',
        'bg-transparent backdrop-blur-md',
        hasShadow ? 'shadow-md' : 'shadow-none',
        isReady ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
      ]"
    >
      <div class="container mx-auto">
        <div class="relative flex items-center">
          <!-- Logo -->
          <div
            :class="[
              'flex items-center gap-1 cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95',
              isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
            ]"
            @click="scrollToSection('home')"
          >
            <img :src="logo" alt="Logo" class="h-10 lg:h-11 invert brightness-100" />
            <img :src="SecondLogo" alt="Second Logo" class="h-7 lg:h-8 invert brightness-50" />
          </div>

          <!-- Desktop nav -->
          <div class="hidden lg:block absolute left-1/2 -translate-x-1/2">
            <ul class="flex items-center gap-x-8 font-semibold text-[15px] lg:text-[16px]">
              <li
                v-for="item in sections"
                :key="item.id"
                class="group transition-transform duration-150 hover:scale-110"
              >
                <button class="text-[16.5px] lg:text-[17.5px] tracking-wide font-semibold hover:text-gray-300 transition-colors" @click="scrollToSection(item.id)">
                  {{ item.label }}
                </button>
                <span class="mt-1 block h-[2.5px] w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
              </li>
            </ul>
          </div>

          <!-- Desktop resume + mobile toggle -->
          <div class="ml-auto flex items-center gap-3">
            <!-- Desktop Resume -->
            <a href="" class="group relative hidden px-4 py-2 font-medium lg:inline-block">
              <span
                class="absolute inset-0 h-full w-full translate-x-1 translate-y-1 bg-[#274156] transition duration-200 ease-out
                       group-hover:translate-x-0 group-hover:translate-y-0"
              ></span>
              <span
                class="absolute inset-0 h-full w-full border-2 border-[#274156] bg-white transition-colors duration-200
                       group-hover:bg-black"
              ></span>
              <span
                class="relative flex items-center gap-x-3 text-[#274156] transition-colors duration-200 group-hover:text-white"
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

            <!-- Mobile menu toggle - Lottie Hamburger -->
            <button
              class="lg:hidden relative z-[100] scale-110 active:scale-100 transition-transform"
              @click="toggleMenu"
              aria-label="Toggle menu"
              :aria-expanded="isOpen"
            >
              <div ref="menuIconEl" class="w-8 h-8 hamburger-icon"></div>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Expanding Circle Overlay - Dark Theme -->
    <div
      :class="[
        'fixed z-[55] rounded-full lg:hidden pointer-events-none',
        'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
      ]"
      :style="{
        top: 'calc(1.25rem + 20px)',
        right: 'calc(1.25rem + 20px)',
        width: isOpen ? '300vmax' : '0',
        height: isOpen ? '300vmax' : '0',
        transform: 'translate(50%, -50%)',
        transition: isOpen 
          ? 'width 0.52s cubic-bezier(0.19, 1, 0.22, 1), height 0.52s cubic-bezier(0.19, 1, 0.22, 1)' 
          : 'width 0.34s cubic-bezier(0.55, 0.085, 0.68, 0.53), height 0.34s cubic-bezier(0.55, 0.085, 0.68, 0.53)'
      }"
    ></div>

    <!-- Mobile Menu -->
    <div
      :class="[
        'fixed top-0 right-0 w-full h-screen z-[56] lg:hidden flex items-center justify-center',
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      ]"
    >
      <ul class="flex flex-col gap-9 text-center">
        <li
          v-for="(item, index) in sections"
          :key="item.id"
          :class="[
            'transition-all ease-out',
            isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          ]"
          :style="{ 
            transitionDelay: isOpen ? `${240 + (index * 75)}ms` : '0ms',
            transitionDuration: '310ms'
          }"
        >
          <button
            @click="scrollToSection(item.id)"
            class="text-white text-3xl font-bold uppercase tracking-[0.25em] hover:text-gray-300 transition-colors duration-200"
          >
            {{ item.label }}
          </button>
        </li>

        <!-- Mobile Resume in Menu -->
        <li
          :class="[
            'transition-all ease-out mt-6',
            isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          ]"
          :style="{ 
            transitionDelay: isOpen ? `${240 + (sections.length * 75)}ms` : '0ms',
            transitionDuration: '310ms'
          }"
        >
          <a href="" class="group relative inline-block px-6 py-3 font-medium">
            <span
              class="absolute inset-0 h-full w-full translate-x-1 translate-y-1 bg-[#274156] transition duration-200 ease-out
                     group-hover:translate-x-0 group-hover:translate-y-0"
            ></span>
            <span
              class="absolute inset-0 h-full w-full border-2 border-[#274156] bg-white transition-colors duration-200
                     group-hover:bg-black"
            ></span>
            <span
              class="relative flex items-center gap-x-3 text-[#274156] transition-colors duration-200 group-hover:text-white"
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
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import logo from "../assets/logo1.png";
import SecondLogo from "../assets/second-logo.png";
import lottie from "lottie-web";
import hamburgerAnim from "@/assets/lottie/hamburger.json";

const hasShadow = ref(false);
const isOpen = ref(false);
const isReady = ref(false);

const sections = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

const menuIconEl = ref(null);
let menuAnim = null;
let endFrame = 0;

// Play icon animation on button click
const playIcon = (open) => {
  if (!menuAnim) return;

  menuAnim.stop();

  if (open) {
    menuAnim.playSegments([0, endFrame], true);
  } else {
    menuAnim.playSegments([endFrame, 0], true);
  }
};

const handleScroll = () => {
  hasShadow.value = window.scrollY > 0;
};

const handleResize = () => {
  // close mobile menu if switching to desktop
  if (window.innerWidth >= 1024) {
    isOpen.value = false;
    if (menuAnim) {
      menuAnim.goToAndStop(0, true);
    }
  }
};

const toggleMenu = () => {
  const next = !isOpen.value;
  isOpen.value = next;

  // animate on click
  playIcon(next);
};

const scrollToSection = (id) => {
  const section = document.getElementById(id);
  if (!section) return;

  const top = section.offsetTop - 110;
  window.scrollTo({ top, behavior: "smooth" });

  // close with animation
  isOpen.value = false;
  playIcon(false);
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", handleResize, { passive: true });

  handleScroll();
  handleResize();

  requestAnimationFrame(() => {
    isReady.value = true;
  });

  menuAnim = lottie.loadAnimation({
    container: menuIconEl.value,
    renderer: "svg",
    loop: false,
    autoplay: false,
    animationData: hamburgerAnim,
  });

  menuAnim.setSpeed(2);

  menuAnim.addEventListener("DOMLoaded", () => {
    endFrame = Math.floor(menuAnim.getDuration(true));
    menuAnim.goToAndStop(0, true); // start closed
  });
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("resize", handleResize);

  menuAnim?.destroy();
  menuAnim = null;
});
</script>

<style scoped>
.hamburger-icon {
  filter: invert(1) brightness(2);
  position: relative;
  z-index: 100;
}

.hamburger-icon :deep(svg) {
  width: 100% !important;
  height: 100% !important;
  display: block !important;
}
</style>
