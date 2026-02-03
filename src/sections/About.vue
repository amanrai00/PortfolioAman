<template>
  <section
    id="about"
    ref="aboutSection"
    class="relative px-5 lg:px-28 pt-24 pb-16 lg:pt-32 lg:pb-24"
  >
    <div class="mx-auto w-full max-w-6xl">
      <div class="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-center">
        <div class="flex items-center justify-center self-center">
          <div
            class="relative w-[clamp(260px,32vw,360px)] h-[clamp(340px,42vw,480px)]"
            aria-hidden="true"
          >
            <div
              class="about-bg absolute inset-0 z-[1] rounded-[24px] bg-[linear-gradient(145deg,color-mix(in_srgb,var(--theme-bg)_78%,var(--theme-cta-bg)_22%),color-mix(in_srgb,var(--theme-bg)_48%,var(--theme-cta-bg)_52%))] shadow-[0_18px_50px_rgba(0,0,0,0.25),0_0_20px_color-mix(in_srgb,var(--theme-cta-bg)_30%,transparent)] blur-[2px]"
              :class="imageVisible ? 'is-visible' : ''"
            ></div>
            <div
              ref="imageFrame"
              class="about-image-frame absolute top-0 left-0 sm:top-[16px] sm:left-[18px] z-[2] h-full w-full overflow-hidden rounded-[24px] shadow-[0_22px_60px_rgba(0,0,0,0.35),0_0_24px_color-mix(in_srgb,var(--theme-cta-bg)_35%,transparent)]"
              :class="[imageVisible ? 'is-visible' : '', showEffects ? 'show-effects' : '']"
            >
              <img
                :src="profileImage"
                :srcset="`${profileImageSmall} 1280w, ${profileImage} 2555w`"
                sizes="(max-width: 1024px) 80vw, 360px"
                alt="Profile portrait"
                class="about-image block h-full w-full object-cover opacity-0"
                width="2555"
                height="3110"
                loading="lazy"
                decoding="async"
              />
              <div
                class="about-image-glow absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.28)_100%)] opacity-0"
              ></div>
            </div>
          </div>
        </div>
        <div ref="aboutText" class="relative overflow-hidden">
          <div
            ref="revealGrid"
            class="about-reveal-grid absolute -inset-2.5 z-[2] grid grid-cols-12 [grid-auto-rows:1fr] gap-2.5 pointer-events-none"
            aria-hidden="true"
          ></div>
          <h2 class="relative z-[1] text-[clamp(2rem,3vw,3.2rem)] font-extrabold uppercase tracking-[0.08em] text-[var(--theme-text-strong)]">
            {{ t('about.title') }}
          </h2>
          <p class="relative z-[1] mt-6 text-lg font-medium leading-[2.2] text-[var(--theme-text-muted)] md:text-xl">
            {{ t('about.paragraph1') }}
          </p>
          <p class="relative z-[1] mt-6 text-lg font-medium leading-[2.2] text-[var(--theme-text-muted)] md:text-xl">
            {{ t('about.paragraph2') }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import profileImage from '@/assets/profile.jpg';
import profileImageSmall from '@/assets/profile-1280.jpg';

const { t } = useI18n();

const aboutSection = ref(null);
const aboutText = ref(null);
const revealGrid = ref(null);
const imageFrame = ref(null);
const imageVisible = ref(false);
const showEffects = ref(false);

let observer = null;
let textRevealObserver = null;
let revealTimeline = null;
let imageRevealQueued = false;
let effectsTimerId = null;
let textRevealStarted = false;

const getRevealTargets = () => {
  if (!aboutText.value) return [];
  return Array.from(aboutText.value.querySelectorAll(':scope > :not(.about-reveal-grid)'));
};

onMounted(async () => {
  const { default: gsap } = await import('gsap');
  if (revealGrid.value) {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 200; i += 1) {
      const box = document.createElement('div');
      box.className = 'about-reveal-box';
      fragment.appendChild(box);
    }
    revealGrid.value.appendChild(fragment);
  }

  const revealTargets = getRevealTargets();
  if (revealTargets.length) {
    gsap.set(revealTargets, { opacity: 0, y: 14, filter: 'blur(6px)' });
  }

  if (aboutSection.value) {
    textRevealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || textRevealStarted) return;
          textRevealStarted = true;
          const boxes = revealGrid.value
            ? revealGrid.value.querySelectorAll('.about-reveal-box')
            : [];
          revealTimeline = gsap.timeline({
            onComplete: () => {
              if (revealGrid.value) {
                gsap.set(revealGrid.value, { opacity: 0, display: 'none' });
              }
            }
          });
          if (boxes.length) {
            revealTimeline.to(
              boxes,
              {
                opacity: 0,
                scale: 0.2,
                duration: 0.9,
                ease: 'power3.out',
                stagger: { amount: 1.2, from: 'random' }
              },
              0
            );
          }
          if (revealTargets.length) {
            revealTimeline.to(
              revealTargets,
              {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                duration: 0.8,
                ease: 'power3.out',
                stagger: 0.08
              },
              0.2
            );
          }
          if (textRevealObserver) {
            textRevealObserver.disconnect();
            textRevealObserver = null;
          }
        });
      },
      { threshold: 0.5 }
    );
    textRevealObserver.observe(aboutSection.value);
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        if (entry.target === imageFrame.value && !imageVisible.value && !imageRevealQueued) {
          imageRevealQueued = true;
          requestAnimationFrame(() => {
            imageVisible.value = true;
            if (effectsTimerId) clearTimeout(effectsTimerId);
            // Matches the image reveal animation duration before adding glow/shadow.
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

  if (imageFrame.value) observer.observe(imageFrame.value);
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
  if (textRevealObserver) {
    textRevealObserver.disconnect();
  }
  if (revealTimeline) {
    revealTimeline.kill();
  }
  if (effectsTimerId) {
    clearTimeout(effectsTimerId);
    effectsTimerId = null;
  }
});
</script>

<style scoped>
.about-reveal-box {
  background: color-mix(in srgb, var(--theme-text-strong) 72%, var(--theme-bg) 28%);
  clip-path: polygon(30% 0, 70% 0, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0 70%, 0 30%);
  transform: scale(1);
  opacity: 1;
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

:global([data-theme="dark"] .about-bg.is-visible) {
  filter: brightness(1.08) saturate(1.08);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3),
    0 0 34px color-mix(in srgb, var(--theme-cta-bg) 45%, transparent) !important;
}

.about-image-glow {
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

:global([data-theme="dark"] .about-image-frame::before) {
  background: #0f2b46;
}

:global([data-theme="dark"] .about-image-frame::after) {
  background: #1f6e8c;
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



