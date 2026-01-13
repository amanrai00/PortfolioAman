8<template>
  <section id="home" class="min-h-screen px-5 lg:px-28 pt-1 pb-16 lg:pt-1 flex items-center relative">
    <div class="hidden lg:flex fixed left-6 top-1/2 -translate-y-1/2 z-30 flex-col items-start gap-3">
      <button
        v-for="(sectionId, index) in sectionIds"
        :key="sectionId"
        type="button"
        class="group flex h-4 w-12 items-center cursor-pointer"
        @click="scrollToSection(sectionId)"
        :aria-label="`Go to ${sectionId} section`"
      >
        <span
          class="nav-line"
          :class="{ 'is-active': activeIndex === index }"
        ></span>
      </button>
    </div>

    <div
      class="hidden lg:flex fixed left-8 bottom-12 z-30 flex-col items-center gap-3 text-[color:var(--theme-text-muted)] transition-transform duration-200 ease-out transition-opacity duration-200 ease-out cursor-default"
      :style="{
        transform: `translateY(${scrollSlide}px)`,
        opacity: Math.max(0, 1 - scrollSlide / 80)
      }"
    >
      <span class="scroll-text">SCROLL DOWN</span>
      <span class="scroll-line"></span>
    </div>
    <div class="mx-auto flex w-full max-w-6xl flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">
      <div class="flex-[1.2] min-w-0 flex flex-col lg:justify-center">
    <h1 class="mx-auto w-full text-center text-6xl font-extrabold uppercase leading-[0.9] text-[color:var(--theme-text-strong)] sm:text-6xl lg:text-7xl lg:mt-0">
          <span class="block min-h-[2.85rem] overflow-hidden sm:min-h-[3.8rem] lg:min-h-[4.275rem]">
            <span :key="currentWord" class="inline-block w-full text-center whitespace-nowrap word-rotator text-7xl bg-gradient-to-b from-[color:var(--theme-headline-from)] via-[color:var(--theme-headline-via)] to-[color:var(--theme-headline-to)] text-transparent bg-clip-text sm:text-7xl lg:text-[6.5rem] tracking-[0.18em]">{{ currentWord }}</span>
          </span>
        </h1>

      </div>

      <div class="flex flex-[0.8] flex-col gap-6 text-[color:var(--theme-text-muted)] lg:flex-row lg:items-start lg:mt-5">
        <div class="steel-line relative hidden h-[1.5px] w-20 opacity-75 bg-gradient-to-r from-transparent via-[color:var(--theme-line-strong)] to-transparent shadow-[0_0_4px_var(--theme-line-shadow)] lg:block lg:h-48 lg:w-0.5 lg:bg-gradient-to-b lg:from-[color:var(--theme-line-soft)] lg:via-[color:var(--theme-line-strong)] lg:to-[color:var(--theme-line-soft)] lg:rounded-full"></div>
        <div class="w-full text-base text-[color:var(--theme-text-soft)] lg:text-lg lg:pl-20 lg:mt-[26px]">
          <div class="flex flex-col items-center justify-center gap-4 text-center lg:hidden">
            <p class="text-sm font-medium text-[color:var(--theme-text-muted)] leading-relaxed tracking-wide">Turning ideas into thoughtful web experiences</p>
            <div class="mt-6 flex justify-center">
              <button
                class="group relative inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-md bg-[color:var(--theme-cta-bg)] px-8 py-2.5 text-[color:var(--theme-cta-text)] tracking-tighter transition-transform duration-300 ease-out hover:-translate-y-0.5"
                type="button"
              >
                <span
                  class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
                >
                  <span class="absolute -left-1/2 top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent blur-md transition-transform duration-500 ease-out group-hover:translate-x-[220%]"></span>
                </span>
                <span class="absolute bottom-0 left-0 -ml-2 h-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-full w-auto opacity-100 object-stretch"
                    viewBox="0 0 487 487"
                  >
                    <path
                      fill-opacity=".1"
                      fill-rule="nonzero"
                      fill="#FFF"
                      d="M0 .3c67 2.1 134.1 4.3 186.3 37 52.2 32.7 89.6 95.8 112.8 150.6 23.2 54.8 32.3 101.4 61.2 149.9 28.9 48.4 77.7 98.8 126.4 149.2H0V.3z"
                    ></path>
                  </svg>
                </span>
                <span class="absolute right-0 top-0 -mr-3 h-full w-12">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-full w-full object-cover"
                    viewBox="0 0 487 487"
                  >
                    <path
                      fill-opacity=".1"
                      fill-rule="nonzero"
                      fill="#FFF"
                      d="M487 486.7c-66.1-3.6-132.3-7.3-186.3-37s-95.9-85.3-126.2-137.2c-30.4-51.8-49.3-99.9-76.5-151.4C70.9 109.6 35.6 54.8.3 0H487v486.7z"
                    ></path>
                  </svg>
                </span>
                <span
                  class="absolute inset-0 -mt-1 h-full w-full rounded-lg bg-gradient-to-b from-transparent via-transparent to-gray-200 opacity-20"
                ></span>
                <span class="relative text-base font-semibold">Let's Connect</span>
              </button>
            </div>
          </div>
          <div class="hidden space-y-2 lg:block lg:text-left">
            <p class="font-semibold text-[color:var(--theme-text-strong)]">Front-End Engineer</p>
            <p class="text-[color:var(--theme-text-muted)]">Crafting fast, accessible web interfaces</p>
            <p>Based in Japan · Vue · Tailwind</p>
          </div>
        </div>
      </div>
    </div>

    <div class="hidden lg:flex fixed right-6 bottom-12 z-30 flex-col items-end gap-4 text-[color:var(--theme-text-strong)]">
      <a
        class="social-item group"
        href="mailto:hey@jolienhoop.com"
        aria-label="Email"
      >
        <span class="social-circle">
          <i class="bi bi-envelope-at text-lg"></i>
        </span>
        <span class="social-label">amanrai1630@gmail.com</span>
      </a>
      <a
        class="social-item group"
        href="#"
        aria-label="LinkedIn"
      >
        <span class="social-circle">
          <i class="bi bi-linkedin text-lg"></i>
        </span>
        <span class="social-label">aman</span>
      </a>
      <a
        class="social-item group"
        href="#"
        aria-label="GitHub"
      >
        <span class="social-circle">
          <i class="bi bi-github text-lg"></i>
        </span>
        <span class="social-label">amanrai</span>
      </a>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const sectionIds = ["home", "skills", "projects", "contact"];
const words = [
  "Engineer",
  "Designer",
  "Builder",
  "WebDev",
  "Commit",
  "Creative",
  "Crafting",
  "Focused",
];
const currentWord = ref(words[0]);
const activeIndex = ref(0);
const scrollSlide = ref(0);
let wordIndex = 0;
let timerId = null;
let scrollHandler = null;

const updateActiveIndex = () => {
  const scrollY = window.scrollY || window.pageYOffset || 0;
  const midPoint = scrollY + window.innerHeight * 0.5;
  let newIndex = 0;

  for (let i = 0; i < sectionIds.length; i += 1) {
    const sectionEl = document.getElementById(sectionIds[i]);
    if (sectionEl && midPoint >= sectionEl.offsetTop) {
      newIndex = i;
    }
  }

  activeIndex.value = newIndex;
  scrollSlide.value = Math.min(scrollY * 0.55, 220);
};

const scrollToSection = (sectionId) => {
  const sectionEl = document.getElementById(sectionId);
  if (sectionEl) {
    sectionEl.scrollIntoView({ behavior: "smooth" });
  }
};

onMounted(() => {
  timerId = setInterval(() => {
    wordIndex = (wordIndex + 1) % words.length;
    currentWord.value = words[wordIndex];
  }, 900);

  scrollHandler = () => updateActiveIndex();
  updateActiveIndex();
  window.addEventListener("scroll", scrollHandler, { passive: true });
});

onBeforeUnmount(() => {
  if (timerId) clearInterval(timerId);
  if (scrollHandler) window.removeEventListener("scroll", scrollHandler);
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Oxanium:wght@400;600;700;800&display=swap");

.word-rotator {
  font-family: "Oxanium", sans-serif;
}

.nav-line {
  height: 2px;
  width: 28px;
  background: var(--theme-line-soft);
  transform-origin: left center;
  transition: transform 0.3s ease, opacity 0.3s ease, background 0.3s ease, width 0.3s ease;
}

.nav-line.is-active {
  background: var(--theme-line-strong);
  transform: scaleX(1.15);
  width: 36px;
}

.nav-line:hover,
.group:hover .nav-line {
  background: var(--theme-line-strong);
  transform: scaleX(1.1);
}

.steel-line {
  transform-origin: top center;
  animation: steel-line-reveal 1.2s ease-out 0.2s both;
}

@keyframes steel-line-reveal {
  0% {
    opacity: 0;
    transform: scaleY(0);
  }
  100% {
    opacity: 0.85;
    transform: scaleY(1);
  }
}

.scroll-text {
  font-size: 11px;
  letter-spacing: 0.32em;
  writing-mode: vertical-rl;
  text-transform: uppercase;
}

.scroll-line {
  width: 1px;
  height: 64px;
  background: linear-gradient(to bottom, var(--theme-line-strong), transparent);
}

.about-scroll-text {
  font-size: 16px;
  letter-spacing: 0.4em;
  text-transform: uppercase;
}

.about-scroll-line {
  width: 2px;
  height: 32px;
  background: linear-gradient(to bottom, var(--theme-line-strong), transparent);
}

.social-item {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.social-label {
  position: absolute;
  right: 100%;
  margin-right: 0.6rem;
  padding: 0.35rem 0.75rem;
  border-radius: 0.6rem;
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: lowercase;
  pointer-events: none;
  background: linear-gradient(135deg, rgba(24, 150, 158, 0.95), rgba(26, 163, 173, 0.85));
  color: #f8fbff;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 18px rgba(0, 0, 0, 0.26);
  opacity: 0;
  transform: translateX(8px) scale(0.98);
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.social-circle:hover + .social-label {
  opacity: 1;
  transform: translateX(0) scale(1);
}

.social-circle {
  width: 2.6rem;
  height: 2.6rem;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--theme-pill-bg);
  border: 1px solid var(--theme-pill-border);
  box-shadow: none;
  transition: transform 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
}

.social-circle:hover {
  transform: translateX(-2px);
  background: linear-gradient(135deg, rgba(24, 150, 158, 0.95), rgba(26, 163, 173, 0.85));
  box-shadow: none;
}
</style>
