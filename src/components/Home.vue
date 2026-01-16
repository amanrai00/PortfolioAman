8<template>
  <section id="home" class="min-h-screen px-5 lg:px-28 pt-6 pb-16 lg:pt-6 flex items-center relative">
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
        <div
          class="steel-line relative hidden h-[1.5px] w-20 opacity-75 bg-gradient-to-r from-transparent via-[color:var(--theme-line-strong)] to-transparent shadow-[0_0_4px_var(--theme-line-shadow)] lg:block lg:h-48 lg:w-0.5 lg:bg-gradient-to-b lg:from-[color:var(--theme-line-soft)] lg:via-[color:var(--theme-line-strong)] lg:to-[color:var(--theme-line-soft)] lg:rounded-full"
          :class="{ 'steel-line-animate': heroVisible }"
        ></div>
        <div class="w-full text-base text-[color:var(--theme-text-soft)] lg:text-lg lg:pl-20 lg:mt-[26px]">
          <div class="flex flex-col items-center justify-center gap-4 text-center lg:hidden">
            <p class="text-sm font-medium text-[color:var(--theme-text-muted)] leading-relaxed tracking-wide">Turning ideas into thoughtful web experiences</p>
            <div class="mt-6 flex justify-center">
              <button class="hero-explore-btn" type="button">
                Let's connect
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

const sectionIds = ["home", "about", "projects", "contact"];
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
const heroVisible = ref(false);
const scrollSlide = ref(0);
let wordIndex = 0;
let timerId = null;
let scrollHandler = null;
let heroObserver = null;
let heroAnimating = false;
let heroTimerId = null;
let hasAnimated = false;

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
  if (!sectionEl) return;

  if (sectionId === "about") {
    const styles = window.getComputedStyle(sectionEl);
    const paddingTop = parseFloat(styles.paddingTop) || 0;
    window.scrollTo({
      top: sectionEl.offsetTop + paddingTop,
      behavior: "smooth",
    });
    return;
  }

  sectionEl.scrollIntoView({ behavior: "smooth" });
};

onMounted(() => {
  timerId = setInterval(() => {
    wordIndex = (wordIndex + 1) % words.length;
    currentWord.value = words[wordIndex];
  }, 900);

  scrollHandler = () => updateActiveIndex();
  updateActiveIndex();
  window.addEventListener("scroll", scrollHandler, { passive: true });

  const heroSection = document.getElementById("home");
  heroObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          if (heroAnimating) return;
          heroAnimating = true;
          hasAnimated = true;
          heroVisible.value = false;
          requestAnimationFrame(() => {
            heroVisible.value = true;
          });
          if (heroTimerId) clearTimeout(heroTimerId);
          heroTimerId = setTimeout(() => {
            heroAnimating = false;
          }, 1500);
        }
      });
    },
    { threshold: 1 }
  );

  if (heroSection) heroObserver.observe(heroSection);
});

onBeforeUnmount(() => {
  if (timerId) clearInterval(timerId);
  if (scrollHandler) window.removeEventListener("scroll", scrollHandler);
  if (heroObserver) heroObserver.disconnect();
  if (heroTimerId) clearTimeout(heroTimerId);
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
}

.steel-line-animate {
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

.hero-explore-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.38em;
  color: var(--theme-text-strong);
  background-color: color-mix(in srgb, var(--theme-bg) 85%, var(--theme-cta-bg) 15%);
  border: 2px solid color-mix(in srgb, var(--theme-text-strong) 15%, transparent);
  border-radius: 999px;
  padding: 14px 24px 14px 26px;
  transition: transform 0.2s ease, background-color 0.2s ease, color 0.2s ease,
    box-shadow 0.2s ease;
  box-shadow: -4px -2px 16px 0px rgba(255, 255, 255, 0.14),
    4px 2px 16px 0px rgba(0, 0, 0, 0.35);
}

.hero-explore-btn:hover {
  color: var(--theme-text-strong);
  background-color: color-mix(in srgb, var(--theme-bg) 78%, var(--theme-cta-bg) 22%);
  box-shadow: -2px -1px 8px 0px rgba(255, 255, 255, 0.12),
    2px 1px 8px 0px rgba(0, 0, 0, 0.35);
  transform: translateY(-2px);
}

.hero-explore-btn:active {
  transform: translateY(0);
  box-shadow: none;
}

:global([data-theme="dark"] .hero-explore-btn) {
  color: #e6eef7;
  background-color: rgba(16, 24, 36, 0.9);
  border-color: rgba(255, 255, 255, 0.12);
  box-shadow: -4px -2px 16px 0px rgba(255, 255, 255, 0.08),
    4px 2px 16px 0px rgba(0, 0, 0, 0.6);
}

:global([data-theme="dark"] .hero-explore-btn:hover) {
  color: #f3f7fb;
  background-color: rgba(24, 36, 52, 0.95);
  box-shadow: -2px -1px 8px 0px rgba(255, 255, 255, 0.08),
    2px 1px 8px 0px rgba(0, 0, 0, 0.6);
}

:global([data-theme="light"] .hero-explore-btn) {
  color: #516d91;
  background-color: #e0e8ef;
  border-color: rgba(255, 255, 255, 0.35);
  box-shadow: -4px -2px 16px 0px #ffffff, 4px 2px 16px 0px rgba(95, 157, 231, 0.45);
}

:global([data-theme="light"] .hero-explore-btn:hover) {
  color: #3c577a;
  background-color: #e5edf5;
  box-shadow: -2px -1px 8px 0px #ffffff, 2px 1px 8px 0px rgba(95, 157, 231, 0.45);
}
</style>
