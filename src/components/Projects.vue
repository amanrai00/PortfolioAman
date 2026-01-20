<template>
  <section id="projects" ref="projectsSection" class="projects-section">
    <div class="projects-list">
      <article
        v-for="(project, index) in projects"
        :key="project.id"
        class="project-item"
        :class="{ 'project-item-first': index === 0 }"
        ref="projectItems"
      >
        <span class="project-index">_{{ String(index + 1).padStart(2, '0') }}.</span>
        <div class="project-content">
          <h3 class="project-title">
            <span class="project-title-row">
              <span
                class="project-title-text"
                @mouseenter="handleTitleEnter(index)"
                @mouseleave="handleTitleLeave(index)"
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
import upArrowAnim from '@/assets/lottie/Up Arrow Animation.json';

const projectsSection = ref(null);
const projectItems = ref([]);
const titleAnimEls = ref([]);
const lottieEls = ref([]);

const lottieAnims = [];
const lottieEndHandlers = [];
const lottieTimers = [];
const lottieStarted = [];
const lottieHoldFrames = [];

const projects = [
  {
    id: 1,
    title: 'Progress',
    tags: ['Next.js', 'Payload CMS', 'Tailwind CSS']
  },
  {
    id: 2,
    title: 'Progress',
    tags: ['React', 'Redux', 'React i18n']
  },
  {
    id: 3,
    title: 'Progress',
    tags: ['GPT-4', 'Next.js', 'PostgreSQL']
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
      animationData: upArrowAnim
    });
    anim.setSpeed(1);
    const totalFrames = Math.max(anim.getDuration(true), 1);
    lottieHoldFrames[index] = Math.max(Math.floor(totalFrames * 0.85), 1);
    lottieAnims[index] = anim;
  });
};

const handleTitleEnter = (index) => {
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

const handleTitleLeave = (index) => {
  window.clearTimeout(lottieTimers[index]);
  const anim = lottieAnims[index];
  const el = lottieEls.value[index];
  const animEl = titleAnimEls.value[index];
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
}

.projects-list {
  display: flex;
  flex-direction: column;
}

.project-item {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  padding: 2rem 0;
  border-top: 1px solid var(--project-border-color);
}

.project-item-first {
  border-top: none;
}

.project-item:last-child {
  border-bottom: none;
}

.project-index {
  font-size: clamp(0.875rem, 1.5vw, 1rem);
  font-weight: 500;
  color: var(--theme-text-muted);
  min-width: 3rem;
  padding-top: 0.5rem;
}

.project-content {
  flex: 1;
}

.project-title {
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 700;
  margin: 0 0 0.75rem;
  line-height: 1.12;
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
  padding-bottom: 0.12em;
  color: var(--project-title-color);
}

.project-title-text:hover .project-title-anim {
  background-size: 100% 100%;
}

.project-title-base {
  display: inline-block;
}

.project-title-anim {
  position: absolute;
  top: 0;
  left: 0;
  line-height: inherit;
  padding-bottom: 0.12em;
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
}

.project-title-lottie {
  width: 1em;
  height: 1em;
  pointer-events: none;
  opacity: 0;
  transform: translateY(0.05em) scaleX(-1) rotate(-90deg);
  margin-left: -0.35em;
  transition: opacity 200ms ease, transform 200ms ease;
  will-change: opacity, transform;
}

.project-title-lottie.is-playing {
  opacity: 1;
  transform: translateY(0) scaleX(-1) rotate(-90deg);
}

.project-title-lottie.is-playing :deep(path) {
  stroke: #18969e !important;
  fill: #18969e !important;
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
  margin-top: 1.2rem;
  transform: translateY(-0.35rem);
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
  --project-hover-color: #18969e;
}

/* Light theme */
:global([data-theme="light"]) {
  --project-border-color: rgba(15, 23, 42, 0.15);
  --project-title-color: var(--theme-text-strong);
  --project-meta-color: var(--theme-text-muted);
  --project-dot-color: var(--theme-text-soft);
  --project-hover-color: #18969e;
}

/* Default fallback */
:root {
  --project-border-color: rgba(255, 255, 255, 0.15);
  --project-title-color: var(--theme-text-strong);
  --project-meta-color: var(--theme-text-muted);
  --project-dot-color: var(--theme-text-soft);
  --project-hover-color: #18969e;
}

/* Responsive */
@media (max-width: 768px) {
  .projects-section {
    padding: 1rem 1rem 3rem;
  }

  .project-item {
    gap: 1rem;
    padding: 1.5rem 0;
  }

  .project-index {
    min-width: 2.5rem;
    padding-top: 0.25rem;
  }

  .project-tags {
    gap: 0.75rem;
  }
}

@media (max-width: 480px) {
  .project-item {
    flex-direction: column;
    gap: 0.5rem;
  }

  .project-index {
    padding-top: 0;
  }
}
</style>
