<template>
  <div ref="contactWrapper" class="contact-wrapper">
    <section
      id="contact"
      ref="contactSection"
      class="contact-section relative min-h-screen overflow-hidden"
    >
      <!-- Wavy lottie background -->
      <div class="contact-bg absolute inset-0 z-0" aria-hidden="true">
        <div ref="lottieEl" class="contact-lottie w-full h-full"></div>
        <div class="contact-overlay"></div>
      </div>

      <!-- Split layout -->
      <div class="contact-split relative z-20">
        <!-- Left: Background + text -->
        <div class="contact-left">
          <div class="contact-left-content">
            <h2 class="contact-title contact-title--stacked font-bold leading-tight tracking-tight">
              <span class="contact-title-text">Conversation comes first</span>
            </h2>
            <p class="contact-subtitle mt-6 max-w-xl">
              That’s often where good things begin.
            </p>
          </div>
        </div>

        <!-- Right: Form -->
        <div class="contact-right">
          <div class="contact-form-wrapper">
            <h3 class="contact-form-title">Open to opportunities</h3>
            <form class="contact-form" @submit.prevent>
              <label class="contact-field">
                <span class="contact-label">Name</span>
                <input
                  class="contact-input"
                  type="text"
                  placeholder="How should I call you?"
                />
              </label>
              <label class="contact-field">
                <span class="contact-label">Email</span>
                <input
                  class="contact-input"
                  type="email"
                  placeholder="Where can I reach you?"
                />
              </label>
              <label class="contact-field">
                <span class="contact-label">Message</span>
                <textarea
                  class="contact-input"
                  rows="4"
                  placeholder="Anything you'd like to discuss?"
                ></textarea>
              </label>
              <button class="contact-submit" type="submit">Send</button>
            </form>
          </div>
        </div>
      </div>
  </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import lottie from 'lottie-web';

const lottieEl = ref(null);
const contactWrapper = ref(null);
const contactSection = ref(null);

let lottieAnim = null;
let scrollTriggerInstance = null;
let clipPathSetter = null;
let lastClipValue = 100;
let isLottiePlaying = false;

onMounted(async () => {
  gsap.registerPlugin(ScrollTrigger);

  // Load wavy lottie animation
  const wavyModule = await import('@/assets/lottie/wavy.json');
  const wavyData = wavyModule?.default ?? wavyModule;

  lottieAnim = lottie.loadAnimation({
    container: lottieEl.value,
    renderer: 'canvas',
    loop: true,
    autoplay: false,
    animationData: wavyData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
      progressiveLoad: true,
    },
  });

  lottieAnim.setSpeed(0.5);

  // Set initial clip - hidden from top
  gsap.set(contactSection.value, {
    clipPath: 'inset(100% 0 0 0)',
  });

  // Use quickSetter for better performance
  clipPathSetter = gsap.quickSetter(contactSection.value, 'clipPath');

  // Reveal animation with contact section fixed at bottom
  scrollTriggerInstance = ScrollTrigger.create({
    trigger: contactWrapper.value,
    start: 'top bottom',
    end: 'bottom bottom',
    scrub: true,
    onUpdate: (self) => {
      const clipValue = Math.round(100 - (self.progress * 100));
      if (clipValue !== lastClipValue) {
        lastClipValue = clipValue;
        clipPathSetter(`inset(${clipValue}% 0 0 0)`);

        // Only play lottie when visible
        if (clipValue < 100 && !isLottiePlaying) {
          lottieAnim?.play();
          isLottiePlaying = true;
        } else if (clipValue >= 100 && isLottiePlaying) {
          lottieAnim?.pause();
          isLottiePlaying = false;
        }
      }
    },
  });
});

onUnmounted(() => {
  if (lottieAnim) {
    lottieAnim.destroy();
    lottieAnim = null;
  }

  if (scrollTriggerInstance) {
    scrollTriggerInstance.kill();
    scrollTriggerInstance = null;
  }
});
</script>

<style scoped>
.contact-wrapper {
  position: relative;
  height: 100vh;
}

.contact-section {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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

.contact-bg {
  pointer-events: none;
}

.contact-lottie {
  opacity: 0.4;
}

.contact-lottie :deep(svg) {
  width: 100%;
  height: 100%;
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

.contact-steps {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  justify-content: center;
}

.contact-step {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.2);
}

.contact-step--active {
  background: #ffffff;
  box-shadow: 0 0 10px rgba(186, 128, 255, 0.7);
}

.contact-title {
  font-size: clamp(2.5rem, 5vw, 5rem);
  letter-spacing: -0.02em;
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
  justify-self: end;
  margin-top: 0.5rem;
  padding: 0.7rem 1.6rem;
  border-radius: 999px;
  border: none;
  background: #ffffff;
  color: #0d0e14;
  font-weight: 600;
  letter-spacing: 0.02em;
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
    justify-self: stretch;
    text-align: center;
  }
}
</style>
