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

      <!-- Content -->
    <div
      class="contact-content relative z-20 flex flex-col items-center justify-center min-h-screen px-[clamp(1rem,5vw,4rem)] py-16"
    >
      <h2
        class="contact-title text-center font-bold leading-tight tracking-tight mb-8"
      >
        <span class="contact-title-text">Get In Touch</span>
      </h2>

      <p
        class="contact-subtitle text-center max-w-2xl mb-12 text-(--theme-text-muted)"
      >
        Have a project in mind or just want to say hello? Feel free to reach out.
      </p>

      <div class="contact-links flex flex-wrap gap-8 justify-center">
        <a
          href="mailto:hello@example.com"
          class="contact-link group relative px-8 py-4 font-medium"
        >
          <span
            class="absolute inset-0 h-full w-full translate-x-1 translate-y-1 bg-(--contact-btn-shadow) transition duration-200 ease-out group-hover:translate-x-0 group-hover:translate-y-0"
          ></span>
          <span
            class="absolute inset-0 h-full w-full border-2 border-(--contact-btn-border) bg-(--contact-btn-bg) transition-colors duration-200 group-hover:bg-(--contact-btn-hover-bg)"
          ></span>
          <span
            class="relative flex items-center gap-x-3 text-(--contact-btn-text) transition-colors duration-200 group-hover:text-(--contact-btn-hover-text)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            Email Me
          </span>
        </a>

        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          class="contact-link group relative px-8 py-4 font-medium"
        >
          <span
            class="absolute inset-0 h-full w-full translate-x-1 translate-y-1 bg-(--contact-btn-shadow) transition duration-200 ease-out group-hover:translate-x-0 group-hover:translate-y-0"
          ></span>
          <span
            class="absolute inset-0 h-full w-full border-2 border-(--contact-btn-border) bg-(--contact-btn-bg) transition-colors duration-200 group-hover:bg-(--contact-btn-hover-bg)"
          ></span>
          <span
            class="relative flex items-center gap-x-3 text-(--contact-btn-text) transition-colors duration-200 group-hover:text-(--contact-btn-hover-text)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect width="4" height="12" x="2" y="9" />
              <circle cx="4" cy="4" r="2" />
            </svg>
            LinkedIn
          </span>
        </a>

        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          class="contact-link group relative px-8 py-4 font-medium"
        >
          <span
            class="absolute inset-0 h-full w-full translate-x-1 translate-y-1 bg-(--contact-btn-shadow) transition duration-200 ease-out group-hover:translate-x-0 group-hover:translate-y-0"
          ></span>
          <span
            class="absolute inset-0 h-full w-full border-2 border-(--contact-btn-border) bg-(--contact-btn-bg) transition-colors duration-200 group-hover:bg-(--contact-btn-hover-bg)"
          ></span>
          <span
            class="relative flex items-center gap-x-3 text-(--contact-btn-text) transition-colors duration-200 group-hover:text-(--contact-btn-hover-text)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
            GitHub
          </span>
        </a>
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

onMounted(async () => {
  gsap.registerPlugin(ScrollTrigger);

  // Load wavy lottie animation
  const wavyModule = await import('@/assets/lottie/wavy.json');
  const wavyData = wavyModule?.default ?? wavyModule;

  lottieAnim = lottie.loadAnimation({
    container: lottieEl.value,
    renderer: 'svg',
    loop: true,
    autoplay: true,
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

  // Reveal animation - clip path animates to show content
  scrollTriggerInstance = ScrollTrigger.create({
    trigger: contactWrapper.value,
    start: 'top top',
    end: 'bottom bottom',
    pin: contactSection.value,
    pinSpacing: false,
    scrub: true,
    onUpdate: (self) => {
      // Animate clip-path from 100% (hidden) to 0% (fully visible)
      const clipValue = 100 - (self.progress * 100);
      gsap.set(contactSection.value, {
        clipPath: `inset(${clipValue}% 0 0 0)`,
      });
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
  height: 200vh; /* Extra scroll space for the reveal */
}

.contact-section {
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  will-change: clip-path;
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
}

.contact-title {
  font-size: clamp(2.5rem, 8vw, 5rem);
  letter-spacing: -0.02em;
}

.contact-title-text {
  background: linear-gradient(
    to bottom,
    var(--theme-headline-from),
    var(--theme-headline-via),
    var(--theme-headline-to)
  );
  color: transparent;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
}

.contact-subtitle {
  font-size: clamp(1rem, 2vw, 1.25rem);
  line-height: 1.7;
}

/* Theme variables */
:global([data-theme="dark"]) {
  --contact-overlay: rgba(0, 0, 0, 0.6);
  --contact-btn-shadow: rgba(255, 255, 255, 0.15);
  --contact-btn-border: rgba(255, 255, 255, 0.3);
  --contact-btn-bg: rgba(0, 0, 0, 0.4);
  --contact-btn-hover-bg: rgba(255, 255, 255, 0.1);
  --contact-btn-text: #f2f0ea;
  --contact-btn-hover-text: #ffffff;
}

:global([data-theme="light"]) {
  --contact-overlay: rgba(255, 255, 255, 0.5);
  --contact-btn-shadow: rgba(0, 0, 0, 0.15);
  --contact-btn-border: rgba(15, 23, 42, 0.3);
  --contact-btn-bg: rgba(255, 255, 255, 0.8);
  --contact-btn-hover-bg: rgba(255, 255, 255, 0.95);
  --contact-btn-text: var(--theme-text-strong);
  --contact-btn-hover-text: var(--theme-text-strong);
}

:root {
  --contact-overlay: rgba(0, 0, 0, 0.6);
  --contact-btn-shadow: rgba(255, 255, 255, 0.15);
  --contact-btn-border: rgba(255, 255, 255, 0.3);
  --contact-btn-bg: rgba(0, 0, 0, 0.4);
  --contact-btn-hover-bg: rgba(255, 255, 255, 0.1);
  --contact-btn-text: #f2f0ea;
  --contact-btn-hover-text: #ffffff;
}

/* Responsive */
@media (max-width: 768px) {
  .contact-content {
    padding: 4rem 1rem;
  }

  .contact-links {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .contact-link {
    width: 100%;
    max-width: 280px;
  }
}
</style>
