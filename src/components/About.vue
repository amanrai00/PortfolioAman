<template>
  <section id="about" class="relative px-5 lg:px-28 pt-24 pb-16 lg:pt-32 lg:pb-24">
    <div class="mx-auto w-full max-w-6xl">
      <div class="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-center">
        <div class="about-left">
          <div
            class="relative w-[clamp(260px,32vw,360px)] h-[clamp(340px,42vw,480px)]"
            aria-hidden="true"
          >
            <div
              class="about-bg absolute inset-0 rounded-[24px] z-[1] bg-[linear-gradient(145deg,color-mix(in_srgb,var(--theme-bg)_78%,var(--theme-cta-bg)_22%),color-mix(in_srgb,var(--theme-bg)_48%,var(--theme-cta-bg)_52%))] shadow-[0_18px_50px_rgba(0,0,0,0.25),0_0_20px_color-mix(in_srgb,var(--theme-cta-bg)_30%,transparent)] blur-[2px]"
              :class="imageVisible ? 'is-visible' : ''"
            ></div>
            <div
              ref="imageFrame"
              class="about-image-frame absolute top-[16px] left-[18px] w-full h-full rounded-[24px] overflow-hidden z-[2] shadow-[0_22px_60px_rgba(0,0,0,0.35),0_0_24px_color-mix(in_srgb,var(--theme-cta-bg)_35%,transparent)]"
              :class="[imageVisible ? 'is-visible' : '', showEffects ? 'show-effects' : '']"
            >
              <img
                :src="profileImage"
                alt="Profile portrait"
                class="about-image w-full h-full object-cover block"
              />
              <div
                class="about-image-glow absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.28)_100%)]"
              ></div>
            </div>
          </div>
        </div>
        <div
          ref="textSection"
          class="transition-all duration-700 delay-200"
          :class="textVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'"
        >
          <span
            class="inline-block w-16 h-1 rounded-full bg-[var(--theme-line-strong)] shadow-[0_0_12px_var(--theme-line-shadow)] mb-5"
          ></span>
          <h2
            class="text-[clamp(2rem,3vw,3.2rem)] font-extrabold tracking-[0.08em] uppercase text-[var(--theme-text-strong)]"
          >
            About me
          </h2>
          <p class="mt-6 text-base leading-[1.85] text-[var(--theme-text-muted)]">
            I’m Aman, a web developer focused on crafting clear, modern interfaces that balance design and functionality.
          </p>
          <p class="mt-6 text-base leading-[1.85] text-[var(--theme-text-muted)]">
            I build web experiences using <strong>Vue.js, Nuxt.js, JavaScript, and Tailwind CSS</strong>, with a strong emphasis on structure, usability, and long-term maintainability. <strong>I don’t just build interfaces. I design systems that are meant to scale, adapt, and last</strong>.
          </p>
          <p class="mt-6 text-base leading-[1.85] text-[var(--theme-text-muted)]">
            With a background in creative work, I approach development with both logical structure and visual intention, aiming to create digital experiences that feel thoughtful and reliable.
          </p>
          <div class="mt-8">
            <a
              class="inline-flex items-center justify-center rounded-full px-[2.2rem] py-[0.85rem] border border-[var(--theme-line-strong)] text-[var(--theme-text-strong)] font-semibold tracking-[0.04em] transition-[transform,background-color,color,border-color] duration-200 hover:-translate-y-0.5 hover:bg-[var(--theme-cta-bg)] hover:border-[var(--theme-cta-bg)] hover:text-[var(--theme-cta-text)]"
              href="#contact"
            >
              Contact me
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import profileImage from '@/assets/profile.jpg';

const textSection = ref(null);
const imageFrame = ref(null);
const textVisible = ref(false);
const imageVisible = ref(false);
const showEffects = ref(false);

let observer = null;
let imageRevealQueued = false;
let effectsTimerId = null;

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        if (entry.target === textSection.value) {
          textVisible.value = true;
        }

        if (entry.target === imageFrame.value && !imageVisible.value && !imageRevealQueued) {
          imageRevealQueued = true;
          requestAnimationFrame(() => {
            imageVisible.value = true;
            if (effectsTimerId) clearTimeout(effectsTimerId);
            effectsTimerId = setTimeout(() => {
              showEffects.value = true;
            }, 1800);
            imageRevealQueued = false;

            if (observer) {
              observer.disconnect();
              observer = null;
            }
          });
        }
      });
    },
    { threshold: 0.1 }
  );

  if (textSection.value) observer.observe(textSection.value);
  if (imageFrame.value) observer.observe(imageFrame.value);
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
  if (effectsTimerId) {
    clearTimeout(effectsTimerId);
    effectsTimerId = null;
  }
});
</script>

<style scoped>
.transition-all {
  transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}

.about-left {
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
}

.about-image-frame {
  position: absolute;
  overflow: hidden;
}

.about-bg {
  opacity: 0;
  transition: opacity 0.6s ease;
  box-shadow: none !important;
}

.about-bg.is-visible {
  opacity: 0.985;
  transition: opacity 0.6s ease 1.8s, box-shadow 0s linear 1.8s;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.25),
    0 0 20px color-mix(in srgb, var(--theme-cta-bg) 30%, transparent) !important;
}

.about-image {
  opacity: 0;
}

.about-image-glow {
  opacity: 0;
  transition: opacity 0.2s ease 1.1s;
}

.about-image-frame::before,
.about-image-frame::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  z-index: 3;
  width: 0;
}

.about-image-frame::before {
  background: var(--theme-cta-bg);
}

.about-image-frame::after {
  background: color-mix(in srgb, var(--theme-cta-bg) 55%, #000);
}

.about-image-frame.is-visible::before {
  animation: about-image-reveal-ltr 1.8s ease forwards;
}

.about-image-frame.is-visible::after {
  animation: about-image-reveal-ltr 1s 0.6s ease forwards;
}

.about-image-frame {
  box-shadow: none !important;
}

.about-image-frame.show-effects {
  transition: box-shadow 0s linear 0s;
  box-shadow: 0 22px 60px rgba(0, 0, 0, 0.35),
    0 0 24px color-mix(in srgb, var(--theme-cta-bg) 35%, transparent) !important;
}

:global([data-theme="light"] .about-image-frame.show-effects) {
  box-shadow: 0 3px 10px rgba(20, 18, 12, 0.06) !important;
  transition: box-shadow 0s linear 0s !important;
}

:global([data-theme="light"] .about-bg) {
  box-shadow: none !important;
  background: var(--theme-bg) !important;
  background-image: none !important;
  filter: none !important;
  opacity: 0 !important;
}

:global([data-theme="light"] .about-bg.is-visible) {
  box-shadow: none !important;
  background: var(--theme-bg) !important;
  background-image: none !important;
  filter: none !important;
  opacity: 0.985 !important;
}

:global([data-theme="light"] .about-image-glow) {
  display: none !important;
  opacity: 0 !important;
  animation: none !important;
}

:global([data-theme="light"] .about-image-frame::before) {
  background: #dcc3ae;
}

:global([data-theme="light"] .about-image-frame::after) {
  background: #c9ad94;
}

:global(:root.theme-switching[data-theme="light"] .about-bg.is-visible) {
  transition: opacity 0.6s ease 1.8s !important;
}

:global(:root.theme-switching[data-theme="light"] .about-image-frame.show-effects) {
  transition: none !important;
}

:global(:root.theme-switching[data-theme="light"] .about-image-glow) {
  transition: none !important;
  animation: none !important;
}

.about-image-frame.is-visible .about-image {
  animation: about-image-fadein 0.1s 1.1s forwards;
}

:global([data-theme="dark"] .about-image-frame.is-visible .about-image-glow) {
  opacity: 1;
}

@keyframes about-image-reveal-ltr {
  0% {
    width: 0;
    left: 0;
    right: auto;
  }
  65% {
    width: 100%;
    left: 0;
    right: auto;
  }
  100% {
    width: 0;
    left: 100%;
    right: auto;
  }
}

@keyframes about-image-fadein {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}


</style>
