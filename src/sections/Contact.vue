<template>
  <div id="contact" ref="contactWrapper" class="contact-wrapper">
    <section
      ref="contactSection"
      class="contact-section relative min-h-screen overflow-hidden is-offscreen"
      :class="isJa ? 'is-ja' : ''"
    >
      <div class="contact-bg absolute inset-0 z-0" aria-hidden="true">
        <img :src="contactBgImage" alt="" class="contact-bg-image" />
        <div class="contact-overlay"></div>
      </div>

      <div class="contact-split relative z-20">
        <div class="contact-left">
          <div class="contact-left-content">
            <h2 class="contact-title contact-title--stacked font-bold leading-tight tracking-tight">
              <span class="contact-title-text">{{ t('contact.title') }}</span>
            </h2>
            <p class="contact-subtitle mt-6 max-w-xl">
              {{ t('contact.subtitle') }}
            </p>
          </div>
        </div>

        <div class="contact-right">
          <div class="contact-form-wrapper">
            <h3 class="contact-form-title">{{ t('contact.formTitle') }}</h3>
            <form class="contact-form" @submit.prevent="handleSubmit">
              <label class="contact-field">
                <span class="contact-label">{{ t('contact.nameLabel') }}</span>
                <input
                  v-model.trim="formState.name"
                  class="contact-input"
                  type="text"
                  name="name"
                  autocomplete="name"
                  :placeholder="t('contact.namePlaceholder')"
                  required
                />
              </label>
              <label class="contact-field">
                <span class="contact-label">{{ t('contact.emailLabel') }}</span>
                <input
                  v-model.trim="formState.email"
                  class="contact-input"
                  type="email"
                  name="email"
                  autocomplete="email"
                  inputmode="email"
                  :placeholder="t('contact.emailPlaceholder')"
                  required
                />
              </label>
              <label class="contact-field">
                <span class="contact-label">{{ t('contact.messageLabel') }}</span>
                <textarea
                  v-model.trim="formState.message"
                  class="contact-input"
                  rows="4"
                  name="message"
                  :placeholder="t('contact.messagePlaceholder')"
                  required
                ></textarea>
              </label>
              <button class="contact-submit" type="submit">{{ t('contact.send') }}</button>
            </form>
          </div>
        </div>
      </div>
  </section>
  </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import contactBgImage from '@/assets/contact bg.jpg';

const contactWrapper = ref(null);
const contactSection = ref(null);
const { t, locale } = useI18n();
const isJa = computed(() => locale.value === 'ja');
const contactEmail = 'amanrai1630@gmail.com';

const formState = ref({
  name: '',
  email: '',
  message: '',
});

let revealTween = null;
let exitTween = null;
let mediaMatch = null;
let mountToken = 0;
let wrapperObserver = null;
let isWrapperVisible = false;
let wasWrapperVisible = false;

const resetForm = () => {
  formState.value = {
    name: '',
    email: '',
    message: '',
  };
};

const handleSubmit = () => {
  const { name, email, message } = formState.value;
  const subject = 'Portfolio inquiry';
  const body = [
    `${t('contact.nameLabel')}: ${name}`,
    `${t('contact.emailLabel')}: ${email}`,
    '',
    message,
  ].join('\n');

  const mailtoUrl = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoUrl;
  resetForm();
};

onMounted(async () => {
  const currentMount = ++mountToken;

  const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
  ]);
  if (currentMount !== mountToken) return;
  gsap.registerPlugin(ScrollTrigger);

  const wrapperEl = contactWrapper.value;
  const sectionEl = contactSection.value;
  if (!wrapperEl || !sectionEl) return;

  document.documentElement.style.scrollBehavior = 'auto';

  wrapperObserver = new IntersectionObserver(
    (entries) => {
      const isVisible = entries.some((entry) => entry.isIntersecting);
      isWrapperVisible = isVisible;
      sectionEl.classList.toggle('is-offscreen', !isVisible);
      wasWrapperVisible = isVisible;
    },
    { threshold: 0.1 }
  );
  wrapperObserver.observe(wrapperEl);

  const createScrollTrigger = (initialClip, triggerStart, triggerEnd = 'bottom bottom') => {
    revealTween = gsap.fromTo(sectionEl,
      { clipPath: `inset(${initialClip}% 0 0 0)` },
      {
        clipPath: 'inset(0% 0 0 0)',
        ease: 'none',
        scrollTrigger: {
          trigger: wrapperEl,
          start: triggerStart,
          end: triggerEnd,
          scrub: true,
          invalidateOnRefresh: true,
        },
      }
    );

    return () => {
      if (revealTween) {
        revealTween.kill();
        revealTween = null;
      }
    };
  };

  const createExitScroll = () => {
    const footerEl = document.querySelector('.footer-wrapper');
    if (!footerEl) return () => {};
    gsap.set(sectionEl, { yPercent: 0 });
    exitTween = gsap.to(sectionEl, {
      yPercent: -100,
      ease: 'none',
      scrollTrigger: {
        trigger: footerEl,
        start: 'top bottom',
        end: 'top top',
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      if (exitTween) {
        exitTween.kill();
        exitTween = null;
      }
      gsap.set(sectionEl, { yPercent: 0 });
    };
  };

  const isMobileLayout = window.matchMedia('(max-width: 768px)').matches;

  if (isMobileLayout) {
    createScrollTrigger(70, 'top 700%');
  } else {
    mediaMatch = ScrollTrigger.matchMedia();
    mediaMatch.add('(min-width: 769px)', () => {
      const killReveal = createScrollTrigger(100, 'top bottom', () => `top+=${window.innerHeight}px bottom`);
      const killExit = createExitScroll();

      return () => {
        killReveal?.();
        killExit?.();
      };
    });
  }

  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
  });
});

onBeforeUnmount(() => {
  mountToken += 1;

  if (wrapperObserver) {
    wrapperObserver.disconnect();
    wrapperObserver = null;
  }

  if (revealTween) {
    revealTween.kill();
    revealTween = null;
  }
  if (exitTween) {
    exitTween.kill();
    exitTween = null;
  }
  if (mediaMatch) {
    mediaMatch.kill();
    mediaMatch = null;
  }

  isWrapperVisible = false;
  wasWrapperVisible = false;
  document.documentElement.style.scrollBehavior = '';
});
</script>

<style scoped>
.contact-wrapper {
  position: relative;
  height: 200vh;
}

.contact-section {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  will-change: transform;
  contain: layout paint;
  background: radial-gradient(
      120% 120% at 10% 0%,
      rgba(36, 38, 56, 0.6),
      rgba(12, 12, 16, 0.95)
    ),
    linear-gradient(140deg, #0d0e14, #141525 50%, #0b0c12);
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.contact-section.is-offscreen {
  visibility: hidden;
  opacity: 0;
}

.contact-bg {
  pointer-events: none;
}

.contact-bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.4;
}

.contact-overlay {
  position: absolute;
  inset: 0;
  background: var(--contact-overlay);
  mix-blend-mode: screen;
}

/* Split layout */
.contact-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
}

.contact-left {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.contact-left-content {
  max-width: 520px;
  padding: clamp(2rem, 4vw, 3.5rem);
  color: var(--contact-title-text);
  text-align: left;
}

.contact-right {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--contact-card-bg);
  border-left: 1px solid var(--contact-card-border);
  z-index: 1;
}

.contact-form-wrapper {
  width: 100%;
  max-width: 480px;
  padding: clamp(2rem, 4vw, 3.5rem);
}

.contact-title {
  font-size: clamp(2.5rem, 5vw, 5rem);
  letter-spacing: -0.02em;
  word-break: keep-all;
  overflow-wrap: normal;
  hyphens: none;
}

.contact-title--stacked {
  font-size: clamp(2.25rem, 4.2vw, 4.25rem);
}

.contact-title-text {
  color: var(--contact-title-text);
}

.contact-subtitle {
  font-size: clamp(1rem, 1.5vw, 1.25rem);
  line-height: 1.7;
  color: var(--contact-subtitle-text);
}

.contact-form-title {
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  color: var(--contact-title-text);
  margin-bottom: 1.5rem;
}

.contact-form {
  display: grid;
  gap: 1rem;
}

.contact-field {
  display: grid;
  gap: 0.5rem;
}

.contact-label {
  font-size: 0.9rem;
  color: var(--contact-subtitle-text);
}

.contact-input {
  width: 100%;
  border-radius: 12px;
  border: 1px solid var(--contact-input-border);
  background: var(--contact-input-bg);
  color: var(--contact-input-text);
  padding: 0.9rem 1rem;
  font-size: 0.95rem;
  outline: none;
}

.contact-input::placeholder {
  color: var(--contact-input-placeholder);
}

.contact-input:focus {
  border-color: var(--contact-input-focus);
  box-shadow: 0 0 0 3px rgba(186, 128, 255, 0.2);
}

.contact-submit {
  height: 50px;
  margin: 5px;
  width: 120px;
  background: #333;
  justify-self: center;
  margin-top: 0.5rem;
  cursor: pointer;
  align-items: center;
  font-family: Consolas, "Courier New", monospace;
  border: solid #404c5d 1px;
  font-size: 16px;
  color: rgb(161, 161, 161);
  transition: 500ms;
  border-radius: 5px;
  background: linear-gradient(145deg, #2e2d2d, #212121);
  box-shadow: -1px -5px 15px #41465b, 5px 5px 15px #41465b,
    inset 5px 5px 10px #212121, inset -5px -5px 10px #212121;
  display: inline-flex;
  justify-content: center;
}

.contact-submit:hover {
  box-shadow: 1px 1px 13px #20232e, -1px -1px 13px #545b78;
  color: #d6d6d6;
  transition: 500ms;
}

.contact-submit:active {
  box-shadow: 1px 1px 13px #20232e, -1px -1px 33px #545b78;
  color: #d6d6d6;
  transition: 100ms;
}

/* Light theme button styling */
:global([data-theme="light"] .contact-submit) {
  color: #1f2a37;
  border-color: rgba(31, 42, 55, 0.22);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(236, 242, 250, 0.92));
  box-shadow: -2px -2px 12px rgba(255, 255, 255, 0.85),
    3px 3px 12px rgba(24, 150, 158, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

:global([data-theme="light"] .contact-submit:hover) {
  color: #13202c;
  box-shadow: -1px -1px 8px rgba(255, 255, 255, 0.9),
    2px 2px 10px rgba(24, 150, 158, 0.22),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
}

:global([data-theme="light"] .contact-submit:active) {
  color: #0f172a;
  border-color: rgba(15, 23, 42, 0.35);
  background: linear-gradient(135deg, rgba(226, 244, 246, 0.95), rgba(210, 232, 236, 0.95));
  box-shadow: -1px -1px 6px rgba(255, 255, 255, 0.75),
    1px 1px 8px rgba(24, 150, 158, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.85),
    inset 2px 2px 6px rgba(12, 74, 110, 0.18);
}

/* Theme variables */
:global([data-theme="dark"]) {
  --contact-overlay: linear-gradient(
    140deg,
    rgba(18, 18, 24, 0.65),
    rgba(12, 12, 16, 0.85)
  );
  --contact-title-text: #f7f7fb;
  --contact-subtitle-text: #b9bbca;
  --contact-card-bg: linear-gradient(
    150deg,
    rgba(30, 31, 43, 0.96),
    rgba(20, 21, 32, 0.92)
  );
  --contact-card-border: rgba(255, 255, 255, 0.08);
  --contact-input-bg: rgba(36, 37, 48, 0.9);
  --contact-input-border: rgba(255, 255, 255, 0.08);
  --contact-input-text: #f7f7fb;
  --contact-input-placeholder: rgba(255, 255, 255, 0.35);
  --contact-input-focus: rgba(186, 128, 255, 0.8);
}

:global([data-theme="light"]) {
  --contact-overlay: linear-gradient(
    140deg,
    rgba(255, 255, 255, 0.6),
    rgba(220, 224, 235, 0.7)
  );
  --contact-title-text: #111827;
  --contact-subtitle-text: #4b5563;
  --contact-card-bg: linear-gradient(
    160deg,
    rgba(255, 255, 255, 0.96),
    rgba(236, 238, 245, 0.9)
  );
  --contact-card-border: rgba(15, 23, 42, 0.08);
  --contact-input-bg: rgba(255, 255, 255, 0.9);
  --contact-input-border: rgba(15, 23, 42, 0.12);
  --contact-input-text: #0f172a;
  --contact-input-placeholder: rgba(15, 23, 42, 0.4);
  --contact-input-focus: rgba(80, 70, 229, 0.5);
}

:root {
  --contact-overlay: linear-gradient(
    140deg,
    rgba(18, 18, 24, 0.65),
    rgba(12, 12, 16, 0.85)
  );
  --contact-title-text: #f7f7fb;
  --contact-subtitle-text: #b9bbca;
  --contact-card-bg: linear-gradient(
    150deg,
    rgba(30, 31, 43, 0.96),
    rgba(20, 21, 32, 0.92)
  );
  --contact-card-border: rgba(255, 255, 255, 0.08);
  --contact-input-bg: rgba(36, 37, 48, 0.9);
  --contact-input-border: rgba(255, 255, 255, 0.08);
  --contact-input-text: #f7f7fb;
  --contact-input-placeholder: rgba(255, 255, 255, 0.35);
  --contact-input-focus: rgba(186, 128, 255, 0.8);
}

/* Responsive */
@media (max-width: 768px) {
  .contact-wrapper {
    height: auto;
  }

  .contact-section {
    position: relative;
    min-height: 100vh;
  }

  .contact-split {
    grid-template-columns: 1fr;
  }

  .contact-left {
    padding: 2rem 1rem;
  }

  .contact-right {
    border-left: none;
    border-top: 1px solid var(--contact-card-border);
    padding: 2rem 1rem;
  }

  .contact-submit {
    justify-self: center;
  }

  .contact-section.is-ja .contact-left {
    padding: 1.5rem 1rem 1rem;
  }

  .contact-section.is-ja .contact-left-content {
    padding: 1.5rem 0.5rem 1rem;
  }

  .contact-section.is-ja .contact-right {
    padding: 1.5rem 1rem 2rem;
  }

  .contact-section.is-ja .contact-form-wrapper {
    padding: 1.5rem 0.5rem 2rem;
    margin: 0 auto;
  }

  .contact-section.is-ja .contact-title--stacked {
    font-size: clamp(2rem, 7.5vw, 3rem);
  }

  .contact-section.is-ja .contact-subtitle {
    font-size: 0.95rem;
  }
}
</style>
