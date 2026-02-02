<template>
  <main class="project-detail-page">
    <button class="project-back" type="button" @click="goBack">
      <span class="project-back-icon">←</span>
      <span>{{ t("projectDetail.back") }}</span>
    </button>

    <section class="project-detail-wrapper">
      <header class="project-header">
        <span class="project-status">{{ t("projectDetail.status") }}</span>
        <h1 class="project-title">{{ t("projectDetail.title") }}</h1>
      </header>

      <div class="project-content">
        <article class="project-section">
          <h2>{{ t("projectDetail.sections.overview.title") }}</h2>
          <p>{{ t("projectDetail.sections.overview.p1") }}</p>
          <p>{{ t("projectDetail.sections.overview.p2") }}</p>
          <p>{{ t("projectDetail.sections.overview.p3") }}</p>
          <p>{{ t("projectDetail.sections.overview.p4") }}</p>
        </article>

        <article class="project-section">
          <h2>{{ t("projectDetail.sections.coreIdea.title") }}</h2>
          <p>{{ t("projectDetail.sections.coreIdea.p1") }}</p>
          <p>{{ t("projectDetail.sections.coreIdea.p2") }}</p>
        </article>

        <article class="project-section">
          <h2>{{ t("projectDetail.sections.userFriendly.title") }}</h2>
          <p>{{ t("projectDetail.sections.userFriendly.p1") }}</p>
          <p>{{ t("projectDetail.sections.userFriendly.p2") }}</p>
        </article>

        <article class="project-section">
          <h2>{{ t("projectDetail.sections.status.title") }}</h2>
          <p>{{ t("projectDetail.sections.status.p1") }}</p>
          <p>{{ t("projectDetail.sections.status.p2") }}</p>
        </article>

        <article class="project-section">
          <h2>{{ t("projectDetail.sections.purpose.title") }}</h2>
          <p>{{ t("projectDetail.sections.purpose.p1") }}</p>
        </article>
      </div>
    </section>
  </main>
</template>

<script setup>
import { inject } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
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
  padding: clamp(6rem, 10vw, 8rem) clamp(1.25rem, 5vw, 4.5rem) clamp(3rem, 8vw, 6rem);
  color: var(--theme-text-strong);
}

.project-detail-wrapper {
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

/* Header */
.project-header {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.project-status {
  display: inline-block;
  width: fit-content;
  padding: 0.35rem 0.9rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--theme-cta-text);
  background: var(--theme-cta-bg);
  border-radius: 2rem;
}

.project-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin: 0;
}

/* Content sections */
.project-content {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.project-section h2 {
  font-size: 1.35rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: var(--theme-text-strong);
}

.project-section p {
  margin: 0 0 0.75rem 0;
  font-size: 1.05rem;
  line-height: 1.7;
  color: var(--theme-text-muted);
}

.project-section p:last-child {
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .project-detail-page {
    padding-top: 5rem;
  }

  .project-back {
    font-size: 0.8rem;
  }

  .project-section p {
    font-size: 1rem;
  }
}
</style>
