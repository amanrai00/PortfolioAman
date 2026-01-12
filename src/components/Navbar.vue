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
              'opacity-100'
            ]"
            @click="scrollToSection('home')"
          >
            <img :src="logo" alt="Logo" class="h-11 lg:h-11 invert brightness-100" />
            <img :src="SecondLogo" alt="Second Logo" class="h-8 lg:h-8 invert brightness-50" />
          </div>

          <!-- Desktop nav -->
          <div class="hidden lg:block absolute left-1/2 -translate-x-1/2">
            <ul class="flex items-center gap-x-8 font-semibold text-[15px] lg:text-[16px]">
              <li
                v-for="item in sections"
                :key="item.id"
                class="group"
              >
                <button class="text-[16.5px] lg:text-[17.5px] tracking-wide font-semibold hover:text-gray-300 transition-colors cursor-pointer" @click="scrollToSection(item.id)">
                  {{ item.label }}
                </button>
                <span class="mt-1 block h-[2.5px] w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
              </li>
            </ul>
          </div>

          <!-- Desktop resume + mobile toggle -->
          <div class="ml-auto flex items-center gap-3">
            <!-- Desktop Resume -->
            <label class="ui-switch hidden lg:inline-flex mr-5">
              <input type="checkbox" aria-label="Toggle theme" checked />
              <div class="slider">
                <div class="circle"></div>
              </div>
            </label>

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
              class="lg:hidden relative z-[100] scale-110 cursor-pointer active:scale-100 transition-transform"
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
        'bg-gradient-to-b from-[#0f1112] via-[#141718] to-[#0f1112]'
      ]"
      :style="{
        top: 'calc(1.25rem + 20px)',
        right: 'calc(1.25rem + 20px)',
        width: isOpen ? '300vmax' : '0',
        height: isOpen ? '300vmax' : '0',
        transform: 'translate(50%, -50%)',
        transition: isOpen 
          ? 'width 0.45s cubic-bezier(0.19, 1, 0.22, 1), height 0.45s cubic-bezier(0.19, 1, 0.22, 1)' 
          : 'width 0.20s cubic-bezier(0.55, 0.085, 0.68, 0.53), height 0.20s cubic-bezier(0.55, 0.085, 0.68, 0.53)'
      }"
    ></div>

    <!-- Mobile Menu -->
    <div
      :class="[
        'fixed top-0 right-0 w-full h-screen z-[56] lg:hidden flex items-center justify-center text-slate-200/80',
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      ]"
    >
      <div
        :class="[
          'mobile-menu-bg transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0'
        ]"
        aria-hidden="true"
      >
        <div ref="menuBgEl" class="mobile-menu-lottie"></div>
        <div class="mobile-menu-overlay"></div>
      </div>

      <ul class="relative z-10 flex flex-col gap-8 text-center">
        <li
          v-for="(item, index) in sections"
          :key="item.id"
          :class="[
            'transition-all ease-out',
            isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          ]"
          :style="{ 
            transitionDelay: isOpen ? `${240 + (index * 75)}ms` : '0ms',
            transitionDuration: '220ms'
          }"
        >
          <button
            @click="scrollToSection(item.id)"
            class="text-[28px] font-light tracking-[0.18em] text-slate-200/80 hover:text-white transition-colors duration-200 transition-transform hover:scale-105 cursor-pointer"
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
            transitionDelay: isOpen ? `${160 + (sections.length * 45)}ms` : '0ms',
            transitionDuration: '310ms'
          }"
        >
          <a href="" class="group relative inline-block px-6 py-3 font-medium transition-transform duration-200 hover:scale-105">
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
import nightSky from "@/assets/lottie/night-sky.json";

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
const menuBgEl = ref(null);
let menuAnim = null;
let menuBgAnim = null;
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
  if (isOpen.value) {
    isOpen.value = false;
    playIcon(false);
  }
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

  menuBgAnim = lottie.loadAnimation({
    container: menuBgEl.value,
    renderer: "svg",
    loop: true,
    autoplay: true,
    animationData: nightSky,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
      progressiveLoad: true,
    },
  });

  menuBgAnim.setSpeed(0.8);

  menuAnim.setSpeed(2.4);

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

  menuBgAnim?.destroy();
  menuBgAnim = null;
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

.mobile-menu-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.mobile-menu-lottie {
  width: 100%;
  height: 100%;
  opacity: 0.7;
}

.mobile-menu-lottie :deep(svg) {
  width: 100%;
  height: 100%;
}

.mobile-menu-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.41);
}

.ui-switch {
  --switch-bg: rgb(135, 150, 165);
  --switch-width: 42px;
  --switch-height: 18px;
  --circle-diameter: 28px;
  --circle-bg: rgb(0, 56, 146);
  --circle-inset: calc((var(--circle-diameter) - var(--switch-height)) / 2);
}

.ui-switch input {
  display: none;
}

.slider {
  width: var(--switch-width);
  height: var(--switch-height);
  background: var(--switch-bg);
  border-radius: 999px;
  position: relative;
  cursor: pointer;
}

.slider .circle {
  top: calc(var(--circle-inset) * -1);
  left: 0;
  width: var(--circle-diameter);
  height: var(--circle-diameter);
  position: absolute;
  border-radius: inherit;
  background-color: var(--circle-bg);
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjAiIHdpZHRoPSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj4KICAgIDxwYXRoIGZpbGw9IiNmZmYiCiAgICAgICAgZD0iTTkuMzA1IDEuNjY3VjMuNzVoMS4zODlWMS42NjdoLTEuMzl6bS00LjcwNyAxLjk1bC0uOTgyLjk4Mkw1LjA5IDYuMDcybC45ODItLjk4Mi0xLjQ3My0xLjQ3M3ptMTAuODAyIDBMMTMuOTI3IDUuMDlsLjk4Mi45ODIgMS40NzMtMS40NzMtLjk4Mi0uOTgyek0xMCA1LjEzOWE0Ljg3MiA0Ljg3MiAwIDAwLTQuODYyIDQuODZBNC44NzIgNC44NzIgMCAwMDEwIDE0Ljg2MiA0Ljg3MiA0Ljg3MiAwIDAwMTQuODYgMTAgNC44NzIgNC44NzIgMCAwMDEwIDUuMTM5em0wIDEuMzg5QTMuNDYyIDMuNDYyIDAgMDExMy40NzEgMTBhMy40NjIgMy40NjIgMCAwMS0zLjQ3MyAzLjQ3MkEzLjQ2MiAzLjQ2MiAwIDAxNi41MjcgMTAgMy40NjIgMy40NjIgMCAwMTEwIDYuNTI4ek0xLjY2NSA5LjMwNXYxLjM5aDIuMDgzdi0xLjM5SDEuNjY2em0xNC41ODMgMHYxLjM5aDIuMDg0di0xLjM5aC0yLjA4NHpNNS4wOSAxMy45MjhMMy42MTYgMTUuNGwuOTgyLjk4MiAxLjQ3My0xLjQ3My0uOTgyLS45ODJ6bTkuODIgMGwtLjk4Mi45ODIgMS40NzMgMS40NzMuOTgyLS45ODItMS40NzMtMS40NzN6TTkuMzA1IDE2LjI1djIuMDgzaDEuMzg5VjE2LjI1aC0xLjM5eiIgLz4KPC9zdmc+");
  background-repeat: no-repeat;
  background-position: center center;
  transition: left 150ms cubic-bezier(0.4, 0, 0.2, 1),
    transform 150ms cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2),
    0px 1px 1px 0px rgba(0, 0, 0, 0.14),
    0px 1px 3px 0px rgba(0, 0, 0, 0.12);
}

.slider .circle::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.75);
  border-radius: inherit;
  transition: all 500ms;
  opacity: 0;
}

.ui-switch input:checked + .slider .circle {
  left: calc(100% - var(--circle-diameter));
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjAiIHdpZHRoPSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj4KICAgIDxwYXRoIGZpbGw9IiNmZmYiCiAgICAgICAgZD0iTTQuMiAyLjVsLS43IDEuOC0xLjguNyAxLjguNy43IDEuOC42LTEuOEw2LjcgNWwtMS45LS43LS42LTEuOHptMTUgOC4zYTYuNyA2LjcgMCAxMS02LjYtNi42IDUuOCA1LjggMCAwMDYuNiA2LjZ6IiAvPgo8L3N2Zz4=");
}

.ui-switch input:active + .slider .circle::before {
  transition: 0s;
  opacity: 1;
  width: 0;
  height: 0;
}
</style>
