<template>
  <section ref="statementSection" class="statement-section">
    <div class="statement-container">
      <!-- Left decorative line -->
      <div class="statement-line"></div>

      <!-- Statement text -->
      <div ref="statementText" class="statement-content">
        <p class="statement-text">
          <slot>
            I believe in clean code,<br />
            thoughtful design, and one big idea:
          </slot>
        </p>
      </div>

      <!-- Right decorative line -->
      <div class="statement-line"></div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const statementSection = ref(null);
const statementText = ref(null);

let statementTimeline = null;

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger);

  if (!statementSection.value) return;

  gsap.set(statementText.value, {
    opacity: 0,
    y: 20,
    filter: 'blur(4px)'
  });

  gsap.set('.statement-line', {
    scaleX: 0
  });

  statementTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: statementSection.value,
      start: 'top 75%',
      toggleActions: 'play none none none'
    }
  });

  statementTimeline
    .to('.statement-line', {
      scaleX: 1,
      duration: 0.8,
      ease: 'power2.out',
      stagger: 0.1
    })
    .to(statementText.value, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.7,
      ease: 'power3.out'
    }, 0.2);
});

onUnmounted(() => {
  if (statementTimeline) {
    if (statementTimeline.scrollTrigger) statementTimeline.scrollTrigger.kill();
    statementTimeline.kill();
    statementTimeline = null;
  }
});
</script>

<style scoped>
.statement-section {
  position: relative;
  padding: 4rem 1.5rem;
  overflow: hidden;
}

.statement-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.statement-line {
  flex: 1;
  max-width: 200px;
  height: 1px;
  background: var(--statement-line-color);
  transform-origin: center;
}

.statement-content {
  flex-shrink: 0;
  text-align: center;
  padding: 0 1rem;
}

.statement-text {
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  line-height: 1.4;
  color: var(--statement-text-color);
  margin: 0;
}

/* Dark theme */
:global([data-theme="dark"]) {
  --statement-text-color: #f8fafc;
  --statement-line-color: rgba(255, 255, 255, 0.15);
}

/* Light theme */
:global([data-theme="light"]) {
  --statement-text-color: #0f4c4c;
  --statement-line-color: rgba(15, 76, 76, 0.2);
}

/* Default fallback */
:root {
  --statement-text-color: var(--theme-text-strong);
  --statement-line-color: var(--theme-line-soft);
}

/* Responsive */
@media (max-width: 768px) {
  .statement-section {
    padding: 3rem 1rem;
  }

  .statement-container {
    gap: 1rem;
  }

  .statement-line {
    max-width: 60px;
  }

  .statement-content {
    padding: 0 0.5rem;
  }
}

@media (max-width: 480px) {
  .statement-line {
    display: none;
  }
}
</style>
