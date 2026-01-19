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
          <span class="statement-line-text statement-line-text-shift">PROJECTS</span>
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
    clipPath: 'inset(100% 0 0 0)',
    opacity: 1
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
      start: 'top 55%',
      toggleActions: 'play none none none'
    }
  });

  statementTimeline
    .to(dividerLines, {
      scaleX: 1,
      duration: 1,
      ease: 'power2.inOut',
      stagger: 0.05
    })
    .to(dividerText.value, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, 0.3)
    .to(lineTexts, {
      clipPath: 'inset(0% 0 0 0)',
      duration: 1.2,
      ease: 'power2.out',
      stagger: 0.15
    }, 0.5)
    .to(statementOutline.value, {
      opacity: 1,
      x: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, 0.9);
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
  flex: 2.2;
  height: 1px;
  background: var(--statement-line-color);
}

.statement-divider-text {
  font-size: clamp(1rem, 2vw, 1.5rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  line-height: 1.05;
  color: var(--theme-text-muted);
  text-align: center;
  white-space: nowrap;
  padding: 0 1.5rem;
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

.statement-line-text-shift {
  margin-left: clamp(4.5rem, 10vw, 10rem);
}

.statement-outline {
  position: relative;
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
  transition: color 0.3s ease, -webkit-text-stroke-color 0.3s ease;
}

/* 3D shadow layer behind text */
.statement-outline::before {
  content: 'SHOWCASE';
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  transform: translate(4px, 4px);
  color: transparent;
  -webkit-text-stroke: 2px var(--statement-shadow-color);
  text-stroke: 2px var(--statement-shadow-color);
  transition: -webkit-text-stroke-color 0.3s ease;
}

.statement-content:hover .statement-outline {
  color: var(--statement-showcase-hover-fill);
  -webkit-text-stroke: 2px var(--statement-showcase-hover-stroke);
  text-stroke: 2px var(--statement-showcase-hover-stroke);
}

.statement-content:hover .statement-outline::before {
  -webkit-text-stroke: 2px var(--statement-showcase-hover-shadow);
  text-stroke: 2px var(--statement-showcase-hover-shadow);
}

/* Dark theme */
:global([data-theme="dark"]) {
  --statement-text-color: var(--theme-text-strong);
  --statement-line-color: var(--theme-line-soft);
  --statement-outline-color: rgba(255, 255, 255, 0.25);
  --statement-shadow-color: rgba(255, 255, 255, 0.1);
  --statement-showcase-hover-fill: color-mix(in srgb, #a78bfa 85%, var(--theme-bg) 15%);
  --statement-showcase-hover-stroke: color-mix(in srgb, #6d28d9 75%, var(--theme-text-strong) 25%);
  --statement-showcase-hover-shadow: color-mix(in srgb, #4c1d95 80%, var(--theme-bg) 20%);
}

/* Light theme */
:global([data-theme="light"]) {
  --statement-text-color: var(--theme-text-strong);
  --statement-line-color: var(--theme-line-soft);
  --statement-outline-color: rgba(15, 23, 42, 0.3);
  --statement-shadow-color: rgba(15, 23, 42, 0.12);
  --statement-showcase-hover-fill: color-mix(in srgb, #ac84e8 70%, var(--theme-bg) 30%);
  --statement-showcase-hover-stroke: color-mix(in srgb, #7c3aed 65%, var(--theme-text-strong) 35%);
  --statement-showcase-hover-shadow: color-mix(in srgb, #5b21b6 70%, var(--theme-bg) 30%);
}

/* Default fallback */
:root {
  --statement-text-color: var(--theme-text-strong);
  --statement-line-color: var(--theme-line-soft);
  --statement-outline-color: var(--theme-line-soft);
  --statement-shadow-color: rgba(0, 0, 0, 0.08);
  --statement-showcase-hover-fill: #ac84e8;
  --statement-showcase-hover-stroke: #7c3aed;
  --statement-showcase-hover-shadow: #5b21b6;
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

  .statement-outline::before {
    transform: translate(3px, 3px);
    -webkit-text-stroke: 1.5px var(--statement-shadow-color);
    text-stroke: 1.5px var(--statement-shadow-color);
  }

  .statement-content:hover .statement-outline {
    -webkit-text-stroke: 1.5px var(--statement-showcase-hover-stroke);
    text-stroke: 1.5px var(--statement-showcase-hover-stroke);
  }

  .statement-content:hover .statement-outline::before {
    -webkit-text-stroke: 1.5px var(--statement-showcase-hover-shadow);
    text-stroke: 1.5px var(--statement-showcase-hover-shadow);
  }
}

@media (max-width: 480px) {
  .statement-outline {
    -webkit-text-stroke: 1px var(--statement-outline-color);
    text-stroke: 1px var(--statement-outline-color);
  }

  .statement-outline::before {
    transform: translate(2px, 2px);
    -webkit-text-stroke: 1px var(--statement-shadow-color);
    text-stroke: 1px var(--statement-shadow-color);
  }

  .statement-content:hover .statement-outline {
    -webkit-text-stroke: 1px var(--statement-showcase-hover-stroke);
    text-stroke: 1px var(--statement-showcase-hover-stroke);
  }

  .statement-content:hover .statement-outline::before {
    -webkit-text-stroke: 1px var(--statement-showcase-hover-shadow);
    text-stroke: 1px var(--statement-showcase-hover-shadow);
  }
}
</style>
