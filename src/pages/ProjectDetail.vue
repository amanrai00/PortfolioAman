<template>
  <main class="project-detail-page">
    <section class="project-detail-wrapper">
      <button class="project-back" type="button" @click="goBack">
        <span class="project-back-icon">←</span>
        <span>Back</span>
      </button>
    </section>
  </main>
</template>

<script setup>
import { inject } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const startPageTransition = inject("startPageTransition", null);

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
  position: fixed;
  top: 1.25rem;
  left: clamp(1.5rem, 5vw, 4rem);
  z-index: 101;
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

@media (max-width: 768px) {
  .project-detail-page {
    padding-top: 6rem;
  }

  .project-back {
    font-size: 0.8rem;
  }
}
</style>
