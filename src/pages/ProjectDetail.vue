<template>
  <main class="project-detail-page">
    <section class="project-detail-wrapper">
      <button class="project-back" type="button" @click="goBack">
        <span class="project-back-icon">←</span>
        <span>Back</span>
      </button>

      <div class="project-detail-grid">
        <div class="project-detail-text">
          <p class="project-detail-eyebrow">Featured Project</p>
          <h1 class="project-detail-title">Progress</h1>
          <p class="project-detail-description">
            A focused build exploring modern UI motion, smooth reveal sequences, and a calm, space-inspired atmosphere.
          </p>
          <div class="project-detail-tags">
            <span v-for="(tag, index) in tags" :key="index" class="project-detail-tag">
              {{ tag }}
            </span>
          </div>
        </div>

        <div
          class="project-reveal-frame"
          :class="[revealVisible ? 'is-visible' : '', showEffects ? 'show-effects' : '']"
        >
          <img
            :src="progressImage"
            :srcset="`${progressImageSmall} 1280w, ${progressImage} 4500w`"
            sizes="(max-width: 1024px) 90vw, 620px"
            alt="Progress project preview"
            class="project-detail-image"
            width="4500"
            height="4500"
            loading="lazy"
            decoding="async"
          />
          <div class="project-image-glow" aria-hidden="true"></div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { inject, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import progressImage from "@/assets/progress1.jpg";
import progressImageSmall from "@/assets/progress1-1280.jpg";

const router = useRouter();
const startPageTransition = inject("startPageTransition", null);
const revealVisible = ref(false);
const showEffects = ref(false);
const tags = ["Next.js", "Payload CMS", "Tailwind CSS"];

const goBack = () => {
  const navigate = () => {
    router.push({ name: "home", hash: "#projects-anchor" });
  };
  if (startPageTransition) {
    startPageTransition(navigate);
  } else {
    navigate();
  }
};

onMounted(() => {
  requestAnimationFrame(() => {
    revealVisible.value = true;
    window.setTimeout(() => {
      showEffects.value = true;
    }, 1800);
  });
});
</script>

<style scoped>
.project-detail-page {
  min-height: 100vh;
  padding: clamp(2rem, 6vw, 4.5rem) clamp(1.25rem, 5vw, 4.5rem) clamp(3rem, 8vw, 6rem);
  color: var(--theme-text-strong);
}

.project-detail-wrapper {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: clamp(2rem, 4vw, 3rem);
}

.project-back {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--theme-text-muted);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease, transform 0.2s ease;
}

.project-back:hover {
  color: var(--theme-text-strong);
  transform: translateX(-4px);
}

.project-back-icon {
  font-size: 1.1rem;
}

.project-detail-grid {
  display: grid;
  gap: clamp(2rem, 6vw, 4rem);
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  align-items: center;
}

.project-detail-text {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.project-detail-eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.32em;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--theme-text-muted);
}

.project-detail-title {
  font-size: clamp(2.6rem, 7vw, 4.5rem);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.project-detail-description {
  font-size: clamp(1rem, 2.4vw, 1.25rem);
  line-height: 1.8;
  color: var(--theme-text-muted);
}

.project-detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.project-detail-tag {
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--theme-text-muted) 35%, transparent);
  color: var(--theme-text-muted);
  font-size: 0.85rem;
  letter-spacing: 0.04em;
}

.project-reveal-frame {
  position: relative;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: none;
  background: color-mix(in srgb, var(--theme-bg) 65%, #04070b 35%);
}

.project-reveal-frame::before,
.project-reveal-frame::after {
  content: "";
  position: absolute;
  left: 0;
  width: 100%;
  height: 0;
  top: 100%;
  z-index: 2;
}

.project-reveal-frame::before {
  background: var(--theme-cta-bg);
}

.project-reveal-frame::after {
  background: color-mix(in srgb, var(--theme-cta-bg) 55%, #000);
}

.project-reveal-frame.is-visible::before {
  animation: project-image-reveal-btt 1.8s ease forwards;
}

.project-reveal-frame.is-visible::after {
  animation: project-image-reveal-btt 1s 0.6s ease forwards;
}

.project-reveal-frame.show-effects {
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4),
    0 0 28px color-mix(in srgb, var(--theme-cta-bg) 35%, transparent);
}

.project-detail-image {
  display: block;
  width: 100%;
  height: auto;
  opacity: 0;
  transform: translateZ(0);
}

.project-reveal-frame.is-visible .project-detail-image {
  animation: project-image-fadein 0.1s 1.1s forwards;
}

.project-image-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, transparent 55%, rgba(0, 0, 0, 0.28) 100%);
  opacity: 0;
  transition: opacity 0.2s ease 1.1s;
}

.project-reveal-frame.is-visible .project-image-glow {
  opacity: 1;
}

@keyframes project-image-reveal-btt {
  0% {
    top: 100%;
    height: 0;
  }
  65% {
    top: 0;
    height: 100%;
  }
  100% {
    top: 0;
    height: 0;
  }
}

@keyframes project-image-fadein {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .project-detail-page {
    padding-top: 6rem;
  }

  .project-back {
    font-size: 0.8rem;
  }
}
</style>
