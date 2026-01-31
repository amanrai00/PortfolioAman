<template>
  <section id="impact" class="relative px-5 lg:px-28 py-8 lg:py-1">
    <div class="mx-auto w-full max-w-6xl">
      <div class="flex flex-col gap-10">
        <div class="w-full">
          <div
            ref="quoteSection"
            class="impact-quote mt-6 flex items-start gap-6 transition-all duration-700"
            :class="quoteVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'"
          >
            <p class="impact-text">
              {{ t('impact.quote') }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const quoteSection = ref(null);
const quoteVisible = ref(false);
let observer = null;

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        quoteVisible.value = entry.isIntersecting;
      });
    },
    { threshold: 0.05, rootMargin: "0px 0px -10% 0px" }
  );

  if (quoteSection.value) observer.observe(quoteSection.value);
});

onUnmounted(() => {
  if (observer) observer.disconnect();
});
</script>

<style scoped>
.impact-quote {
  align-items: center;
}

.impact-text {
  font-size: clamp(1.35rem, 2.4vw, 2.4rem);
  line-height: 1.7;
  color: var(--theme-text-muted);
  font-family: "Oxanium", sans-serif;
  max-width: 100%;
}

.impact-card {
  border-radius: 1.5rem;
  padding: 1.75rem;
  background: var(--theme-pill-bg);
  border: 1px solid var(--theme-pill-border);
  display: grid;
  gap: 1rem;
}

.impact-image {
  border-radius: 1.2rem;
  min-height: 220px;
  background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.06),
      rgba(255, 255, 255, 0.02)
    ),
    radial-gradient(
      circle at 20% 20%,
      rgba(255, 255, 255, 0.18),
      transparent 60%
    );
  border: 1px dashed var(--theme-line-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--theme-text-soft);
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.impact-caption {
  font-size: 0.85rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--theme-text-soft);
}

@media (max-width: 1023px) {
  .impact-quote {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}
</style>
