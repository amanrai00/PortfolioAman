<template>
  <section ref="statementSection" class="statement-section">
    <!-- Divider with lines and text -->
    <div class="statement-divider">
      <div class="statement-line statement-line-left"></div>
      <span ref="dividerText" class="statement-divider-text">Each project shaped how I work today.</span>
      <div class="statement-line statement-line-right"></div>
    </div>

    <!-- Main content -->
    <div class="statement-container">
      <div ref="statementText" class="statement-content">
        <h2 class="statement-main">
          <span class="statement-line-text">SELECTED</span>
          <span class="statement-line-text">PROJECTS</span>
        </h2>
        <!-- Outlined subtitle -->
        <p ref="statementOutline" class="statement-outline">SHOWCASE</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const statementSection = ref(null);
const statementText = ref(null);
const statementOutline = ref(null);
const dividerText = ref(null);

let statementTimeline = null;

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger);

  if (!statementSection.value) return;

  const lineTexts = statementSection.value.querySelectorAll('.statement-line-text');

  gsap.set(lineTexts, {
    opacity: 0,
    y: 60,
    filter: 'blur(8px)'
  });

  gsap.set(statementOutline.value, {
    opacity: 0,
    x: -30
  });

  gsap.set(dividerText.value, {
    opacity: 0,
    y: 10
  });

  const dividerLines = statementSection.value.querySelectorAll('.statement-line');

  gsap.set(dividerLines[0], { scaleX: 0, transformOrigin: 'right center' });
  gsap.set(dividerLines[1], { scaleX: 0, transformOrigin: 'left center' });

  statementTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: statementSection.value,
      start: 'top 75%',
      toggleActions: 'play none none none'
    }
  });

  statementTimeline
    .to(dividerText.value, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out'
    })
    .to(dividerLines, {
      scaleX: 1,
      duration: 0.8,
      ease: 'power2.out',
      stagger: 0.1
    }, 0.1)
    .to(lineTexts, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.15
    }, 0.2)
    .to(statementOutline.value, {
      opacity: 1,
      x: 0,
      duration: 0.7,
      ease: 'power3.out'
    }, 0.5);
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
  padding: 6rem 1.5rem;
  overflow: hidden;
}

/* Divider lines at top */
.statement-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 4rem;
  padding: 0 clamp(1rem, 5vw, 4rem);
}

.statement-line {
  flex: 1;
  height: 1px;
  background: var(--statement-line-color);
}

.statement-divider-text {
  font-size: clamp(0.875rem, 1.5vw, 1.125rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--statement-text-muted);
  white-space: nowrap;
  padding: 0 1rem;
}

.statement-container {
  max-width: 1200px;
  margin: 0 auto;
  padding-left: clamp(1rem, 5vw, 4rem);
}

.statement-content {
  text-align: left;
}

.statement-main {
  display: flex;
  flex-direction: column;
  margin: 0;
  line-height: 0.95;
}

.statement-line-text {
  font-size: clamp(3rem, 12vw, 9rem);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  color: var(--statement-text-color);
}

.statement-outline {
  font-size: clamp(2rem, 8vw, 6rem);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  margin: 0;
  margin-top: -0.1em;
  margin-left: auto;
  width: fit-content;
  padding-right: clamp(1rem, 5vw, 4rem);
  color: transparent;
  -webkit-text-stroke: 2px var(--statement-outline-color);
  text-stroke: 2px var(--statement-outline-color);
}

/* Dark theme */
:global([data-theme="dark"]) {
  --statement-text-color: #f8fafc;
  --statement-text-muted: rgba(248, 250, 252, 0.6);
  --statement-outline-color: rgba(248, 250, 252, 0.25);
  --statement-line-color: rgba(255, 255, 255, 0.15);
}

/* Light theme */
:global([data-theme="light"]) {
  --statement-text-color: #0f4c4c;
  --statement-text-muted: rgba(15, 76, 76, 0.7);
  --statement-outline-color: rgba(15, 76, 76, 0.3);
  --statement-line-color: rgba(15, 76, 76, 0.2);
}

/* Default fallback */
:root {
  --statement-text-color: var(--theme-text-strong);
  --statement-text-muted: var(--theme-text-muted);
  --statement-outline-color: var(--theme-line-soft);
  --statement-line-color: var(--theme-line-soft);
}

/* Responsive */
@media (max-width: 768px) {
  .statement-section {
    padding: 4rem 1rem;
  }

  .statement-container {
    padding-left: 1rem;
  }

  .statement-outline {
    -webkit-text-stroke: 1.5px var(--statement-outline-color);
    text-stroke: 1.5px var(--statement-outline-color);
    padding-right: 1rem;
  }
}

@media (max-width: 480px) {
  .statement-outline {
    -webkit-text-stroke: 1px var(--statement-outline-color);
    text-stroke: 1px var(--statement-outline-color);
  }
}
</style>
