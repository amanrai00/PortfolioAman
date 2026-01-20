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
          <h3 class="project-title" :data-title="project.title">{{ project.title }}</h3>
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
import { ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const projectsSection = ref(null);
const projectItems = ref([]);

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

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger);

  if (!projectsSection.value) return;

  const items = projectsSection.value.querySelectorAll('.project-item');
  const divider = projectsSection.value.querySelector('.projects-divider');

  gsap.set(items, {
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
    .to(items, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.15
    })
    .to(divider, {
      scaleX: 1,
      duration: 0.8,
      ease: 'power2.inOut'
    }, '-=0.3');
});

onUnmounted(() => {
  if (projectsTimeline) {
    if (projectsTimeline.scrollTrigger) projectsTimeline.scrollTrigger.kill();
    projectsTimeline.kill();
    projectsTimeline = null;
  }
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
  padding-bottom: 0.12em;
  position: relative;
}

.project-title::after {
  content: attr(data-title);
  position: absolute;
  top: 0;
  left: 0;
  line-height: inherit;
  padding-bottom: 0.12em;
  display: inline-block;
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

.project-title:hover::after {
  background-size: 100% 100%;
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
  --project-hover-color: #79d98b;
}

/* Light theme */
:global([data-theme="light"]) {
  --project-border-color: rgba(15, 23, 42, 0.15);
  --project-title-color: var(--theme-text-strong);
  --project-meta-color: var(--theme-text-muted);
  --project-dot-color: var(--theme-text-soft);
  --project-hover-color: #1b7f3d;
}

/* Default fallback */
:root {
  --project-border-color: rgba(255, 255, 255, 0.15);
  --project-title-color: var(--theme-text-strong);
  --project-meta-color: var(--theme-text-muted);
  --project-dot-color: var(--theme-text-soft);
  --project-hover-color: #1b7f3d;
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
