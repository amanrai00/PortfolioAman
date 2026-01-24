<template>
  <section id="projects" ref="projectsSection" class="projects-section">
    <!-- Shared image preview -->
    <div
      ref="imagePreview"
      class="project-image-preview"
      :class="{ 'is-visible': hoveredIndex !== null }"
    >
      <img
        v-for="(project, index) in projects"
        :key="project.id"
        :src="project.image"
        :alt="project.title"
        class="project-image"
        :class="{ 'is-active': hoveredIndex === index }"
      />
    </div>

    <div class="projects-list" @mousemove="handleListMouseMove" @mouseleave="handleListLeave">
      <article
        v-for="(project, index) in projects"
        :key="project.id"
        class="project-item"
        :class="{ 'project-item-first': index === 0, 'is-hovered': hoveredIndex === index }"
                ref="projectItems"
      >
        <div class="project-content">
          <h3 class="project-title">
            <span class="project-title-row">
              <span class="project-index">_{{ String(index + 1).padStart(2, '0') }}.</span>
              <span
                class="project-title-text"
              >
                <span class="project-title-base">{{ project.title }}</span>
                <span ref="titleAnimEls" class="project-title-anim" aria-hidden="true">{{ project.title }}</span>
              </span>
              <span ref="lottieEls" class="project-title-lottie" aria-hidden="true"></span>
            </span>
          </h3>
          <div class="project-tags">
            <span
              v-for="(tag, tagIndex) in project.tags"
              :key="tagIndex"
              class="project-tag"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </article>
    </div>
    <div class="projects-divider"></div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import lottie from 'lottie-web';
import threadLineDownRightAnim from '@/assets/lottie/Thread Line Down Right.json';
import progress1Img from '@/assets/progress1.jpg';
import progress2Img from '@/assets/progress2.jpg';
import progress3Img from '@/assets/progress3.jpg';

const projectsSection = ref(null);
const projectItems = ref([]);
const titleAnimEls = ref([]);
const lottieEls = ref([]);
const imagePreview = ref(null);
const hoveredIndex = ref(null);

const lottieAnims = [];
const lottieEndHandlers = [];
const lottieTimers = [];
const lottieStarted = [];
const lottieHoldFrames = [];
const resetTitleAnim = (index) => {
  const animEl = titleAnimEls.value[index];
  if (!animEl) return;
  animEl.classList.add('is-resetting');
  animEl.style.backgroundSize = '0% 100%';
  // Force reflow to apply the no-transition state immediately.
  void animEl.offsetHeight;
  animEl.classList.remove('is-resetting');
  animEl.style.removeProperty('background-size');
};

const projects = [
  {
    id: 1,
    title: 'Progress',
    tags: ['Next.js', 'Payload CMS', 'Tailwind CSS'],
    image: progress1Img
  },
  {
    id: 2,
    title: 'Progress',
    tags: ['React', 'Redux', 'React i18n'],
    image: progress2Img
  },
  {
    id: 3,
    title: 'Progress',
    tags: ['GPT-4', 'Next.js', 'PostgreSQL'],
    image: progress3Img
  }
];

let projectsTimeline = null;

const initLottie = async () => {
  await nextTick();
  lottieEls.value.forEach((el, index) => {
    if (!el) return;
    const anim = lottie.loadAnimation({
      container: el,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData: threadLineDownRightAnim
    });
    anim.setSpeed(1);
    const totalFrames = Math.max(anim.getDuration(true), 1);
    lottieHoldFrames[index] = Math.max(Math.floor(totalFrames * 0.85), 1);
    lottieAnims[index] = anim;
  });
};

const handleListMouseMove = (event) => {
  if (!projectItems.value.length) return;

  const mouseY = event.clientY;
  let targetIndex = null;

  // Find which item the mouse is over based on divider positions
  for (let i = 0; i < projectItems.value.length; i++) {
    const item = projectItems.value[i];
    if (!item) continue;
    const rect = item.getBoundingClientRect();
    // Use the border-bottom position as the divider
    const dividerY = rect.bottom;

    if (i === 0) {
      // First item: from top of item to its divider
      if (mouseY >= rect.top && mouseY < dividerY) {
        targetIndex = 0;
        break;
      }
    } else {
      // For subsequent items, trigger when mouse is past the previous divider
      const prevItem = projectItems.value[i - 1];
      const prevDividerY = prevItem.getBoundingClientRect().bottom;

      if (mouseY >= prevDividerY && (i === projectItems.value.length - 1 || mouseY < dividerY)) {
        targetIndex = i;
        break;
      }
    }
  }

  if (targetIndex !== null && targetIndex !== hoveredIndex.value) {
    handleTitleEnter(targetIndex);
  }
};

const handleTitleEnter = (index) => {
  // Update hovered index for image preview
  const prevIndex = hoveredIndex.value;
  hoveredIndex.value = index;

  // Update image preview position based on hovered item
  if (imagePreview.value && projectItems.value[index]) {
    const item = projectItems.value[index];
    const itemRect = item.getBoundingClientRect();
    const sectionRect = projectsSection.value.getBoundingClientRect();
    const topOffset = itemRect.top - sectionRect.top + itemRect.height / 2;
    imagePreview.value.style.top = `${topOffset}px`;
  }

  // Stop previous lottie animation if switching items
  if (prevIndex !== null && prevIndex !== index) {
    resetTitleAnim(prevIndex);
    const prevAnim = lottieAnims[prevIndex];
    const prevEl = lottieEls.value[prevIndex];
    if (prevEl) prevEl.classList.remove('is-playing');
    if (prevAnim) {
      prevAnim.stop();
      prevAnim.goToAndStop(0, true);
    }
  }

  const anim = lottieAnims[index];
  const el = lottieEls.value[index];
  const animEl = titleAnimEls.value[index];
  if (!anim || !animEl) return;
  lottieStarted[index] = false;
  if (el) el.classList.add('is-playing');

  if (lottieEndHandlers[index]) {
    animEl.removeEventListener('transitionend', lottieEndHandlers[index]);
  }

  const startAnim = () => {
    if (lottieStarted[index]) return;
    lottieStarted[index] = true;
    const holdFrame = lottieHoldFrames[index] || Math.max(anim.getDuration(true) - 1, 0);
    anim.playSegments([0, holdFrame], true);
  };

  const styles = window.getComputedStyle(animEl);
  const toMs = (value) => {
    const parsed = parseFloat(value);
    if (Number.isNaN(parsed)) return 0;
    return value.includes('ms') ? parsed : parsed * 1000;
  };
  const totalDelay = toMs(styles.transitionDuration) + toMs(styles.transitionDelay);
  const startDelay = totalDelay * 0.35;

  window.clearTimeout(lottieTimers[index]);
  lottieTimers[index] = window.setTimeout(startAnim, startDelay);

  lottieEndHandlers[index] = (event) => {
    if (event.propertyName !== 'background-size') return;
    startAnim();
  };

  animEl.addEventListener('transitionend', lottieEndHandlers[index], { once: true });
};

const handleListLeave = () => {
  // Clear hovered state when leaving the entire list
  const index = hoveredIndex.value;
  hoveredIndex.value = null;

  if (index === null) return;

  window.clearTimeout(lottieTimers[index]);
  const anim = lottieAnims[index];
  const el = lottieEls.value[index];
  const animEl = titleAnimEls.value[index];
  resetTitleAnim(index);
  if (animEl && lottieEndHandlers[index]) {
    animEl.removeEventListener('transitionend', lottieEndHandlers[index]);
  }
  lottieStarted[index] = false;
  if (el) el.classList.remove('is-playing');
  if (!anim) return;
  anim.stop();
  anim.goToAndStop(0, true);
};

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger);

  if (!projectsSection.value) return;

  const items = projectsSection.value.querySelectorAll('.project-item');
  const divider = projectsSection.value.querySelector('.projects-divider');

  const [firstItem, ...restItems] = Array.from(items);

  gsap.set(firstItem, {
    opacity: 0,
    y: 60
  });

  gsap.set(restItems, {
    opacity: 0,
    y: 30
  });

  gsap.set(divider, {
    scaleX: 0,
    transformOrigin: 'left center'
  });

  projectsTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: projectsSection.value,
      start: 'top 60%',
      toggleActions: 'play none none none'
    }
  });

  projectsTimeline
    .to(firstItem, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out'
    })
    .to(restItems, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.15
    }, '-=0.2')
    .to(divider, {
      scaleX: 1,
      duration: 0.8,
      ease: 'power2.inOut'
    }, '-=0.3');

  initLottie();
});

onUnmounted(() => {
  if (projectsTimeline) {
    if (projectsTimeline.scrollTrigger) projectsTimeline.scrollTrigger.kill();
    projectsTimeline.kill();
    projectsTimeline = null;
  }

  lottieTimers.forEach((timer) => window.clearTimeout(timer));
  lottieAnims.forEach((anim) => anim?.destroy());
});
</script>

<style scoped>
.projects-section {
  position: relative;
  padding: 2rem 0 4rem;
  max-width: 1200px;
  margin: 0 auto;
  padding-left: clamp(1rem, 5vw, 4rem);
  padding-right: clamp(1rem, 5vw, 4rem);
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.projects-list {
  display: flex;
  flex-direction: column;
}

.project-item {
  display: flex;
  align-items: flex-start;
  gap: 0.2rem;
  padding: 0 0 0.2em;
  margin-top: -2.2rem;
  margin-bottom: -0.2em;
  border-bottom: 1px solid var(--project-border-color);
  position: relative;
  overflow: visible;
  --project-index-width: 4ch;
  --project-index-gap: 1.2em;
}

/* Ensure earlier items stack on top of later ones in the overlap zone */
.project-item:nth-child(1) { z-index: 3; }
.project-item:nth-child(2) { z-index: 2; }
.project-item:nth-child(3) { z-index: 1; }

.project-item.is-hovered {
  z-index: 20;
}

/* Shared image preview container */
.project-image-preview {
  position: absolute;
  right: clamp(1rem, 5vw, 4rem);
  width: 320px;
  height: 260px;
  transform: translateY(-50%) skewX(-8deg) scale(0.85);
  transform-origin: right center;
  border-radius: 8px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
              top 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100;
}

.project-image-preview.is-visible {
  opacity: 1;
  transform: translateY(-50%) skewX(-8deg) scale(1);
}

.project-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.project-image.is-active {
  opacity: 1;
}

.project-item-first {
  margin-top: 0;
  border-bottom: 1px solid var(--project-border-color);
}

.project-item:last-child {
  border-bottom: none;
}

.project-index {
  font-size: clamp(0.875rem, 1.5vw, 1rem);
  font-weight: 500;
  color: var(--theme-text-muted);
  width: var(--project-index-width);
  padding-top: 0;
  line-height: 1;
  margin-right: var(--project-index-gap);
  transform: translateY(-1.40em);
}

.project-content {
  flex: 1;
  margin-top: 0;
}

.project-title {
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 700;
  margin: 0;
  line-height: 1.05;
  color: var(--project-title-color);
  letter-spacing: -0.02em;
  cursor: pointer;
  display: inline-block;
}

.project-title-row {
  display: inline-flex;
  align-items: center;
  gap: 0;
}

.project-title-text {
  display: inline-block;
  flex: 0 0 auto;
  width: fit-content;
  position: relative;
  padding-bottom: 0.22em;
  color: var(--project-title-color);
  backface-visibility: hidden;
  transform: translateZ(0);
  isolation: isolate;
}

.project-item:hover .project-title-anim {
  background-size: 100% 100%;
}

.project-title-text,
.project-title-base,
.project-title-anim {
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-stroke: 0.45px transparent;
  paint-order: stroke fill;
}

.project-title-base {
  display: inline-block;
  padding-bottom: 0.15em;
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
  backface-visibility: hidden;
  transform: translateZ(0);
}

.project-title-anim {
  position: absolute;
  top: 0;
  left: 0;
  line-height: inherit;
  padding-bottom: 0.22em;
  display: inline-block;
  width: 100%;
  pointer-events: none;
  background-image: linear-gradient(
    90deg,
    var(--project-hover-color),
    var(--project-hover-color)
  );
  background-size: 0% 100%;
  background-repeat: no-repeat;
  background-position: left center;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  transition: background-size 0.7s ease;
  pointer-events: none;
  backface-visibility: hidden;
  will-change: background-size;
}

.project-title-anim.is-resetting {
  transition: none;
}

.project-title-lottie {
  width: 3em;
  height: 3em;
  pointer-events: none;
  opacity: 0;
  transform: translateY(0.28em);
  margin-left: -0.7em;
  transition: opacity 200ms ease, transform 200ms ease;
  will-change: opacity, transform;
}

.project-title-lottie.is-playing {
  opacity: 1;
  transform: translateY(0.28em);
}

.project-title-lottie.is-playing :deep(path) {
  stroke: var(--project-hover-color) !important;
  fill: var(--project-hover-color) !important;
}

.project-title-lottie :deep(svg) {
  width: 100%;
  height: 100%;
  display: block;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  margin-top: -4rem;
  padding-bottom: 1rem;
  padding-left: calc(var(--project-index-width) + var(--project-index-gap) + 0.3em);
}

.project-tag {
  font-size: clamp(0.75rem, 1.2vw, 0.875rem);
  color: var(--project-meta-color);
  position: relative;
}

.project-tag:not(:last-child)::after {
  content: '';
  position: absolute;
  right: -0.55rem;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--project-dot-color);
}

.projects-divider {
  height: 1px;
  background: var(--project-border-color);
  margin-top: 0;
}

/* Dark theme */
:global([data-theme="dark"]) {
  --project-border-color: rgba(255, 255, 255, 0.15);
  --project-title-color: #f2f0ea;
  --project-meta-color: rgba(242, 240, 234, 0.7);
  --project-dot-color: rgba(242, 240, 234, 0.5);
  --project-hover-color: #354F52;
  --project-image-overlay: rgba(0, 0, 0, 0.15);
}

/* Light theme */
:global([data-theme="light"]) {
  --project-border-color: rgba(15, 23, 42, 0.15);
  --project-title-color: var(--theme-text-strong);
  --project-meta-color: var(--theme-text-muted);
  --project-dot-color: var(--theme-text-soft);
  --project-hover-color: #9c6a4b;
  --project-image-overlay: rgba(255, 255, 255, 0.1);
}

/* Default fallback */
:root {
  --project-border-color: rgba(255, 255, 255, 0.15);
  --project-title-color: var(--theme-text-strong);
  --project-meta-color: var(--theme-text-muted);
  --project-dot-color: var(--theme-text-soft);
  --project-hover-color: #9c6a4b;
}

/* Responsive */
@media (max-width: 1024px) {
  .project-image-preview {
    width: 260px;
    height: 210px;
  }
}

@media (max-width: 768px) {
  .projects-section {
    padding: 1rem 1rem 3rem;
  }

  .project-item {
    gap: 1rem;
    padding: 0.5rem 0;
    --project-index-width: 2.5rem;
  }

  .project-image-preview {
    display: none;
  }

  .project-index {
    padding-top: 0.25rem;
  }

  .project-tags {
    gap: 0.75rem;
  }
}

@media (max-width: 480px) {
  .project-item {
    gap: 0.5rem;
  }

  .project-index {
    padding-top: 0;
  }
}
</style>
