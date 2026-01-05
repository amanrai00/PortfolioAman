<template>
  <nav
    :class="[
      'fixed top-0 left-0 z-50 w-full p-5 text-white transition-all duration-300',
      'lg:px-28 px-5',
      'bg-transparent backdrop-blur-md',
      hasShadow ? 'shadow-md' : 'shadow-none',
      isReady ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
    ]"
  >
    <div class="container mx-auto">
      <div class="relative flex items-center">
        <!-- Logo (desktop untouched, mobile hides on open like your code) -->
        <div
          ref="logoEl"
          :class="[
            'flex items-center gap-1 cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95',
            isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          ]"
          @click="scrollToSection('home')"
        >
          <img :src="logo" alt="Logo" class="h-10 lg:h-11 invert brightness-100" />
          <img :src="SecondLogo" alt="Second Logo" class="h-7 lg:h-8 invert brightness-50" />
        </div>

        <!-- Desktop nav (DO NOT TOUCH) -->
        <div class="hidden lg:block absolute left-1/2 -translate-x-1/2">
          <ul class="flex items-center gap-x-8 font-semibold text-[15px] lg:text-[16px]">
            <li
              v-for="item in sections"
              :key="item.id"
              class="group transition-transform duration-150 hover:scale-110"
            >
              <button
                class="text-[16.5px] lg:text-[17.5px] tracking-wide font-semibold hover:text-gray-300 transition-colors"
                @click="scrollToSection(item.id)"
              >
                {{ item.label }}
              </button>
              <span class="mt-1 block h-[2.5px] w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
            </li>
          </ul>
        </div>

        <!-- Desktop resume + Mobile toggle (desktop untouched) -->
        <div class="ml-auto flex items-center gap-3">
          <!-- Desktop Resume (DO NOT TOUCH) -->
          <a href="" class="group relative hidden px-4 py-2 font-medium lg:inline-block">
            <span
              class="absolute inset-0 h-full w-full translate-x-1 translate-y-1 bg-[#274156] transition duration-200 ease-out
                     group-hover:translate-x-0 group-hover:translate-y-0"
            ></span>
            <span
              class="absolute inset-0 h-full w-full border-2 border-[#274156] bg-white transition-colors duration-200
                     group-hover:bg-black"
            ></span>
            <span class="relative flex items-center gap-x-3 text-[#274156] transition-colors duration-200 group-hover:text-white">
              Resume
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 3v12" />
                <path d="M8 11l4 4 4-4" />
                <path d="M4 19h16" />
              </svg>
            </span>
          </a>

          <!-- ✅ NEW MOBILE HAMBURGER (same style/animation idea as your HTML/GSAP example) -->
          <div class="lg:hidden relative">
            <!-- Open trigger -->
            <button
              ref="openTriggerEl"
              class="menu-trigger"
              aria-label="Open menu"
              :aria-expanded="isOpen"
              @click="openMenu"
            >
              <span ref="openTopEl" class="menu-trigger-bar top"></span>
              <span ref="openMidEl" class="menu-trigger-bar middle"></span>
              <span ref="openBotEl" class="menu-trigger-bar bottom"></span>
            </button>

            <!-- Close trigger -->
            <button
              ref="closeTriggerEl"
              class="close-trigger"
              aria-label="Close menu"
              @click="closeMenu"
            >
              <span ref="closeLeftEl" class="close-trigger-bar left"></span>
              <span ref="closeRightEl" class="close-trigger-bar right"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <!-- ✅ FULL SCREEN MOBILE MENU OVERLAY (same style/animation idea) -->
  <div
    ref="overlayEl"
    class="mobile-overlay lg:hidden"
    aria-hidden="true"
  >
    <!-- the 3 background shapes -->
    <span ref="bgTopEl" class="menu-bg top"></span>
    <span ref="bgMidEl" class="menu-bg middle"></span>
    <span ref="bgBotEl" class="menu-bg bottom"></span>

    <!-- Menu content -->
    <div class="menu-container">
      <ul ref="menuEl" class="menu">
        <li v-for="item in sections" :key="item.id">
          <button class="menu-link" @click="scrollToSection(item.id)">
            {{ item.label }}
          </button>
        </li>

        <li class="mt-4">
          <a class="menu-link" href="">
            Resume
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { gsap } from "gsap";

import logo from "../assets/logo1.png";
import SecondLogo from "../assets/second-logo.png";

const hasShadow = ref(false);
const isOpen = ref(false);
const isReady = ref(false);

const sections = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

/* ====== refs for GSAP targets ====== */
const logoEl = ref(null);

const overlayEl = ref(null);
const menuEl = ref(null);

const bgTopEl = ref(null);
const bgMidEl = ref(null);
const bgBotEl = ref(null);

const openTriggerEl = ref(null);
const closeTriggerEl = ref(null);

const openTopEl = ref(null);
const openMidEl = ref(null);
const openBotEl = ref(null);

const closeLeftEl = ref(null);
const closeRightEl = ref(null);

/* ====== timelines ====== */
let tl = null;

const handleScroll = () => {
  hasShadow.value = window.scrollY > 0;
};

const handleResize = () => {
  // close mobile menu if switching to desktop
  if (window.innerWidth >= 1024) {
    forceCloseNoAnim();
  }
};

const forceCloseNoAnim = () => {
  isOpen.value = false;
  tl?.progress(0).pause();

  // keep overlay hidden, open trigger visible, close trigger behind
  gsap.set(overlayEl.value, { pointerEvents: "none" });
  gsap.set(openTriggerEl.value, { autoAlpha: 1 });
  gsap.set(closeTriggerEl.value, { autoAlpha: 1, zIndex: 5 });
};

const openMenu = () => {
  if (!tl) return;
  isOpen.value = true;
  tl.play(0);
};

const closeMenu = () => {
  if (!tl) return;
  isOpen.value = false;
  tl.reverse();
};

const scrollToSection = (id) => {
  const section = document.getElementById(id);
  if (!section) return;

  const top = section.offsetTop - 110;
  window.scrollTo({ top, behavior: "smooth" });

  // close menu after click (with animation)
  if (isOpen.value) closeMenu();
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", handleResize, { passive: true });

  handleScroll();
  handleResize();

  requestAnimationFrame(() => (isReady.value = true));

  // initial states (match the “HTML demo” feel)
  gsap.set(overlayEl.value, { autoAlpha: 0, pointerEvents: "none" });
  gsap.set(menuEl.value, { autoAlpha: 0, y: 30, visibility: "hidden" });

  // background panels start positions (off)
  gsap.set(bgTopEl.value, { yPercent: -152, rotate: -45, transformOrigin: "center" });
  gsap.set(bgMidEl.value, { scaleY: 0, rotate: -45, transformOrigin: "center" });
  gsap.set(bgBotEl.value, { yPercent: 25, rotate: -45, transformOrigin: "center" });

  // close icon bars start “far away”
  gsap.set(closeLeftEl.value, { x: 100, y: -100, rotate: -45 });
  gsap.set(closeRightEl.value, { x: -100, y: -100, rotate: 45 });

  // close trigger behind until opened
  gsap.set(closeTriggerEl.value, { zIndex: 5, autoAlpha: 1 });

  tl = gsap.timeline({
    paused: true,
    defaults: { ease: "power4.inOut" },
    onStart: () => {
      gsap.set(overlayEl.value, { autoAlpha: 1, pointerEvents: "auto" });
      gsap.set(closeTriggerEl.value, { zIndex: 30 });
    },
    onReverseComplete: () => {
      gsap.set(overlayEl.value, { autoAlpha: 0, pointerEvents: "none" });
      gsap.set(openTriggerEl.value, { visibility: "visible" });
      gsap.set(closeTriggerEl.value, { zIndex: 5 });
    },
  });

  // === OPEN sequence (same concept as your TimelineMax demo) ===
  tl.addLabel("preOpen")
    .to(logoEl.value, { duration: 0.4, scale: 0.8, autoAlpha: 0, ease: "power2.out" }, "preOpen")
    .to(openTopEl.value, { duration: 0.4, x: 80, y: -80 }, "preOpen+=0.1")
    .to(openMidEl.value, {
      duration: 0.4,
      x: 80,
      y: -80,
      onComplete: () => gsap.set(openTriggerEl.value, { visibility: "hidden" }),
    }, "preOpen")
    .to(openBotEl.value, { duration: 0.4, x: 80, y: -80 }, "preOpen+=0.2")

    .addLabel("open", "-=0.25")
    .to(bgTopEl.value, { duration: 0.8, yPercent: 13 }, "open")
    .to(bgMidEl.value, { duration: 0.8, scaleY: 1 }, "open")
    .to(bgBotEl.value, { duration: 0.8, yPercent: -114 }, "open")

    .fromTo(menuEl.value,
      { y: 30, autoAlpha: 0, visibility: "hidden" },
      { duration: 0.6, y: 0, autoAlpha: 1, visibility: "visible", ease: "power4.out" },
      "open+=0.35"
    )

    .addLabel("preClose", "-=0.55")
    .to(closeLeftEl.value, { duration: 0.8, x: 0, y: 0, ease: "power4.out" }, "preClose")
    .to(closeRightEl.value, { duration: 0.8, x: 0, y: 0, ease: "power4.out" }, "preClose+=0.2");

  // start closed
  forceCloseNoAnim();
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("resize", handleResize);
  tl?.kill();
  tl = null;
});
</script>

<style scoped>
/* ===== FULL SCREEN OVERLAY ===== */
.mobile-overlay {
  position: fixed;
  inset: 0;
  z-index: 40; /* under navbar (navbar is z-50) */
}

/* background strips (same “rotated blocks” look) */
.menu-bg {
  position: absolute;
  display: block;
  width: 200%;
  height: 40%;
  left: -53%;
  top: -25%;
  background: rgba(255, 255, 255, 1);
}

.menu-bg.middle {
  top: 29%;
  left: -53%;
}

.menu-bg.top {
  left: -34%;
  top: 0;
}

.menu-bg.bottom {
  top: 105%;
  left: -20%;
}

/* menu container/content */
.menu-container {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
}

.menu {
  width: 100%;
  padding: 22%;
  list-style: none;
  margin: 0;
}

.menu li {
  text-align: left;
  padding: 14px 0;
}

.menu-link {
  appearance: none;
  border: none;
  background: transparent;
  padding: 8px 0;
  font-weight: 700;
  font-size: 22px;
  color: #222222;
  cursor: pointer;
  position: relative;
}

.menu-link::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 2px;
  width: 22px;
  height: 3px;
  opacity: 0;
  transform: translateX(80px);
  transition: transform 0.3s cubic-bezier(.55,0,.1,1), opacity 0.3s cubic-bezier(.55,0,.1,1);
  background: #222222;
}

.menu-link:hover::after {
  opacity: 1;
  transform: translateX(0);
}

/* ===== HAMBURGER + CLOSE TRIGGERS ===== */
.menu-trigger,
.close-trigger {
  position: relative;
  width: 42px;
  height: 42px;
  cursor: pointer;
  display: block;
  border: none;
  background: transparent;
  padding: 0;
}

.menu-trigger {
  z-index: 60; /* above overlay */
}

.close-trigger {
  z-index: 5;
  position: absolute;
  top: 0;
  right: 0;
}

/* open bars */
.menu-trigger-bar {
  display: block;
  width: 100%;
  height: 4px;
  background: rgba(255,255,255,1);
  margin-bottom: 6px;
  transform: rotate(-45deg);
  position: relative;
}

.menu-trigger-bar.top { width: 50%; }
.menu-trigger-bar.bottom { width: 50%; margin-left: 50%; }

/* close bars (X) */
.close-trigger-bar {
  display: block;
  width: 100%;
  height: 4px;
  background: #222222;
  position: relative;
}

.close-trigger-bar.right { margin-top: -3px; }
</style>
