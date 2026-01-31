8<template>
  <!-- Hero Section -->
  <section id="home" class="min-h-screen px-5 lg:px-28 pt-6 pb-16 lg:pt-6 flex items-center relative overflow-hidden">

    <!-- Navigation Dots (Desktop) -->
    <nav ref="heroNavEl" class="hidden lg:flex fixed left-6 top-1/2 -translate-y-1/2 z-30 flex-col items-start gap-3" :class="{ 'hero-nav-dim': isHomeNavDimmed }" aria-label="Section navigation">
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
    </nav>

    <!-- Scroll Indicator (Desktop) -->
    <div
      ref="heroScrollEl"
      class="hidden lg:flex fixed left-8 bottom-12 z-30 flex-col items-center gap-3 text-[color:var(--theme-text-muted)] transition-transform duration-200 ease-out transition-opacity duration-200 ease-out cursor-default"
      :style="{
        transform: `translateY(${scrollSlide}px)`,
        opacity: Math.max(0, 1 - scrollSlide / 80)
      }"
      aria-hidden="true"
    >
      <span class="scroll-text">{{ isJa ? 'SCROLL DOWN' : t('home.scrollDown') }}</span>
      <span class="scroll-line"></span>
    </div>

    <!-- Main Content -->
    <div ref="heroTextEl" class="mx-auto flex w-full max-w-6xl flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">

      <!-- Rotating Headline -->
      <div class="flex-[1.2] min-w-0 flex flex-col lg:justify-center">
        <h1 class="mx-auto w-full text-center text-6xl font-extrabold uppercase leading-[0.9] text-[color:var(--theme-text-strong)] sm:text-6xl lg:text-7xl lg:mt-0">
          <span class="block min-h-[2.85rem] overflow-hidden sm:min-h-[3.8rem] lg:min-h-[4.275rem]">
            <span
              :key="currentWord"
              class="inline-block w-full text-center whitespace-nowrap word-rotator text-7xl bg-gradient-to-b from-[color:var(--theme-headline-from)] via-[color:var(--theme-headline-via)] to-[color:var(--theme-headline-to)] text-transparent bg-clip-text sm:text-7xl lg:text-[6.5rem] tracking-[0.18em]"
            >
              {{ currentWord }}
            </span>
          </span>
        </h1>
      </div>

      <!-- Description & CTA -->
      <div class="flex flex-[0.8] flex-col gap-6 text-[color:var(--theme-text-muted)] lg:flex-row lg:items-start lg:mt-5">

        <!-- Decorative Line (Desktop) -->
        <div
          class="steel-line relative hidden h-[1.5px] w-20 bg-gradient-to-r from-transparent via-[color:var(--theme-line-strong)] to-transparent shadow-[0_0_4px_var(--theme-line-shadow)] lg:block lg:h-48 lg:w-0.5 lg:bg-gradient-to-b lg:from-[color:var(--theme-line-soft)] lg:via-[color:var(--theme-line-strong)] lg:to-[color:var(--theme-line-soft)] lg:rounded-full"
          :class="{ 'steel-line-animate': heroVisible, 'steel-line-hidden': !heroEffectsStarted }"
          aria-hidden="true"
        ></div>

        <!-- Text Content -->
        <div class="hero-right w-full text-base text-[color:var(--theme-text-soft)] lg:text-lg lg:pl-20 lg:mt-[26px]" :class="isJa ? 'is-ja' : ''">

          <!-- Mobile View -->
          <div class="flex flex-col items-center justify-center gap-4 text-center lg:hidden">
            <p class="text-sm font-medium text-[color:var(--theme-text-muted)] leading-relaxed tracking-wide">
              {{ t('home.tagline') }}
            </p>
            <div class="mt-6 flex justify-center">
              <button
                class="hero-explore-btn"
                type="button"
                @click="scrollToSection('about')"
                aria-label="Scroll to about section"
              >
                自己紹介を見る
              </button>
            </div>
          </div>

          <!-- Desktop View -->
          <div class="hidden space-y-2 lg:block lg:text-left">
            <p class="font-semibold text-[color:var(--theme-text-strong)]">{{ t('home.role') }}</p>
            <p class="hero-subtitle text-[color:var(--theme-text-muted)]" :class="isJa ? 'is-ja' : ''">{{ t('home.subtitle') }}</p>
            <p>{{ t('home.location') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Social Links (Desktop) -->
    <aside
      class="hidden lg:flex fixed right-6 bottom-12 z-30 flex-col items-end gap-4 text-[color:var(--theme-text-strong)]"
      :class="{ 'social-links-hidden': isContactFading }"
      aria-label="Social links"
    >
      <a
        class="social-item group"
        href="mailto:amanrai1630@gmail.com"
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
    </aside>
  </section>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from "vue";
import gsap from "gsap";
import { useI18n } from "vue-i18n";

// ============================================================
// Configuration
// ============================================================

const sectionIds = ["home", "about", "statement", "contact"];
const WORD_ROTATE_MS = 900;
const HERO_REVEAL_LOCK_MS = 1500;
const CONTACT_FADE_MOBILE_MULTIPLIER = 7;
const DESKTOP_BREAKPOINT = 1024;
const TABLET_MAX = 768;
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

const { t, locale } = useI18n();
const isJa = computed(() => locale.value === "ja");

// ============================================================
// State Management
// ============================================================

const currentWord = ref(words[0]);
const activeIndex = ref(-1);
const heroVisible = ref(false);
const scrollSlide = ref(0);
const isContactFading = ref(false);
const isHomeNavDimmed = ref(true);
const heroEffectsStarted = ref(false);
const heroTextEl = ref(null);
const heroNavEl = ref(null);
const heroScrollEl = ref(null);

let wordIndex = 0;
let timerId = null;
let scrollHandler = null;
let heroObserver = null;
let heroAnimating = false;
let heroTimerId = null;
let hasAnimated = false;

// ============================================================
// Navigation & Scroll Logic
// ============================================================

/**
 * Updates active navigation dot and scroll indicator position
 */
const updateActiveIndex = () => {
  const scrollY = window.scrollY || window.pageYOffset || 0;
  const midPoint = scrollY + window.innerHeight * 0.5;
  let newIndex = -1;

  for (let i = 0; i < sectionIds.length; i += 1) {
    const sectionEl = document.getElementById(sectionIds[i]);
    if (sectionEl && midPoint >= sectionEl.offsetTop) {
      newIndex = i;
    }
  }

  activeIndex.value = newIndex;
  scrollSlide.value = Math.min(scrollY * 0.55, 220);
  isHomeNavDimmed.value = newIndex === 0;

  const contactEl = document.getElementById("contact");
  if (contactEl) {
    const triggerOffset =
      window.innerWidth <= TABLET_MAX
        ? window.innerHeight * CONTACT_FADE_MOBILE_MULTIPLIER
        : window.innerHeight;
    isContactFading.value = scrollY + triggerOffset >= contactEl.offsetTop;
  }
};

/**
 * Smoothly scrolls to a specific section
 * Special handling for 'about' section to center in view
 */
const scrollToSection = (sectionId) => {
  const sectionEl = document.getElementById(sectionId);
  if (!sectionEl) return;

  // Special handling for about section
  if (sectionId === "about") {
    if (window.innerWidth < DESKTOP_BREAKPOINT) {
      sectionEl.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    sectionEl.scrollIntoView({ behavior: "auto", block: "center" });
    return;
  }

  sectionEl.scrollIntoView({ behavior: "auto" });
};

const triggerHeroReveal = () => {
  heroVisible.value = false;
  requestAnimationFrame(() => {
    heroVisible.value = true;
  });
};

// ============================================================
// Lifecycle Hooks
// ============================================================

onMounted(() => {
  updateActiveIndex();
  const startHeroEffects = () => {
    if (heroEffectsStarted.value) return;
    heroEffectsStarted.value = true;

    // Start word rotation animation
    timerId = setInterval(() => {
      wordIndex = (wordIndex + 1) % words.length;
      currentWord.value = words[wordIndex];
    }, WORD_ROTATE_MS);

    // Setup scroll tracking
    scrollHandler = () => updateActiveIndex();
    updateActiveIndex();
    window.addEventListener("scroll", scrollHandler, { passive: true });

    // Setup intersection observer for hero animation
    const heroSection = document.getElementById("home");
    heroObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            if (heroAnimating) return;
            heroAnimating = true;
            hasAnimated = true;
            triggerHeroReveal();
            if (heroTimerId) clearTimeout(heroTimerId);
            heroTimerId = setTimeout(() => {
              heroAnimating = false;
            }, HERO_REVEAL_LOCK_MS);
          }
        });
      },
      { threshold: 1 }
    );

    if (heroSection) heroObserver.observe(heroSection);
    if (heroSection) {
      const rect = heroSection.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight && rect.bottom > 0;
      if (isInView && !hasAnimated) {
        triggerHeroReveal();
        hasAnimated = true;
      }
    }
  };

  if (heroTextEl.value) {
    const fadeTargets = [heroNavEl.value, heroScrollEl.value].filter(Boolean);
    if (fadeTargets.length) {
      gsap.set(fadeTargets, { opacity: 0 });
    }

    const introTl = gsap.timeline({
      onComplete: startHeroEffects,
    });
    introTl.fromTo(
      heroTextEl.value,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1,
        ease: "sine.inOut",
      }
    );
    if (fadeTargets.length) {
      introTl.to(
        fadeTargets,
        { opacity: 1, duration: 0.8, ease: "sine.out" },
        0.8
      );
    }
    introTl.call(() => {
      // Keep reveal synced to the intro timeline before the observer takes over.
      triggerHeroReveal();
      hasAnimated = true;
    }, null, 1);
  } else {
    startHeroEffects();
  }
});

onBeforeUnmount(() => {
  // Cleanup all event listeners and timers
  if (timerId) clearInterval(timerId);
  if (scrollHandler) window.removeEventListener("scroll", scrollHandler);
  if (heroObserver) heroObserver.disconnect();
  if (heroTimerId) clearTimeout(heroTimerId);
});
</script>

<style scoped>
/* ============================================================
   Fonts
   ============================================================ */
@import url("https://fonts.googleapis.com/css2?family=Oxanium:wght@400;600;700;800&display=swap");

.word-rotator {
  font-family: "Oxanium", sans-serif;
}

/* ============================================================
   Navigation Dots
   ============================================================ */
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

.hero-nav-dim .nav-line {
  opacity: 0.3;
  transition: opacity 0.25s ease;
}

/* ============================================================
   Decorative Steel Line Animation
   ============================================================ */
.steel-line {
  transform-origin: top center;
  opacity: 0;
  will-change: transform, opacity;
}

.steel-line-hidden {
  opacity: 0;
  visibility: hidden;
}

.steel-line-animate {
  animation: steel-line-reveal 1.2s ease-out 0s both;
  visibility: visible;
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

/* ============================================================
   Scroll Indicator
   ============================================================ */
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

/* ============================================================
   Social Links
   ============================================================ */
.social-item {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.social-links-hidden {
  opacity: 0;
  pointer-events: none;
  transform: translateY(12px);
  transition: opacity 0.25s ease, transform 0.25s ease;
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

.hero-subtitle.is-ja {
  white-space: nowrap;
  font-size: 0.95em;
  letter-spacing: 0.01em;
}

.hero-right.is-ja {
  font-size: 0.95em;
}

@media (min-width: 1024px) {
  .hero-right.is-ja {
    margin-top: 34px;
  }
}


/* ============================================================
   Hero CTA Button - Base Styles
   ============================================================ */
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
  transition: transform 0.2s ease, background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
  box-shadow: -4px -2px 16px 0px rgba(255, 255, 255, 0.14), 4px 2px 16px 0px rgba(0, 0, 0, 0.35);
}

.hero-explore-btn:hover {
  color: var(--theme-text-strong);
  background-color: color-mix(in srgb, var(--theme-bg) 78%, var(--theme-cta-bg) 22%);
  box-shadow: -2px -1px 8px 0px rgba(255, 255, 255, 0.12), 2px 1px 8px 0px rgba(0, 0, 0, 0.35);
  transform: translateY(-2px);
}

.hero-explore-btn:active {
  transform: translateY(0);
  box-shadow: none;
}

/* ============================================================
   Hero CTA Button - Dark Theme
   ============================================================ */
:global([data-theme="dark"] .hero-explore-btn) {
  color: #e6eef7;
  background-color: rgba(16, 24, 36, 0.9);
  border-color: rgba(255, 255, 255, 0.12);
  box-shadow: -4px -2px 16px 0px rgba(255, 255, 255, 0.08), 4px 2px 16px 0px rgba(0, 0, 0, 0.6);
}

:global([data-theme="dark"] .hero-explore-btn:hover) {
  color: #f3f7fb;
  background-color: rgba(24, 36, 52, 0.95);
  box-shadow: -2px -1px 8px 0px rgba(255, 255, 255, 0.08), 2px 1px 8px 0px rgba(0, 0, 0, 0.6);
}

/* ============================================================
   Hero CTA Button - Light Theme
   ============================================================ */
:global([data-theme="light"] .hero-explore-btn) {
  color: #2c3e50;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(240, 248, 255, 0.9));
  border-color: rgba(44, 62, 80, 0.25);
  box-shadow: -2px -2px 12px 0px rgba(255, 255, 255, 0.8), 3px 3px 12px 0px rgba(26, 127, 142, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

:global([data-theme="light"] .hero-explore-btn:hover) {
  color: #1a2633;
  background: linear-gradient(135deg, rgba(26, 127, 142, 0.08), rgba(240, 248, 255, 0.95));
  box-shadow: -1px -1px 8px 0px rgba(255, 255, 255, 0.9), 2px 2px 10px 0px rgba(26, 127, 142, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.9);
}
</style>
