<template>
  <section
    id="skills"
    ref="skillsSection"
    class="relative px-5 lg:px-28 py-24 lg:py-32"
  >
    <div class="mx-auto w-full max-w-4xl text-center">
      <div class="relative mb-8">
        <span ref="skillsBg" class="skills-bg-text">{{ t('skills.bgText') }}</span>
        <h2 ref="skillsTitle" class="skills-title">{{ t('skills.title') }}</h2>
      </div>

      <div ref="skillsDivider" class="flex items-center justify-center mt-20 mb-6">
        <svg
          class="skills-divider-svg"
          viewBox="0 0 400 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M8 12L2 8V16L8 12Z" class="divider-fill divider-edge" />
          <path d="M8 12L20 8V16L8 12Z" class="divider-fill divider-edge" />

          <line x1="20" y1="12" x2="170" y2="12" class="divider-stroke divider-edge" stroke-width="1" />

          <line x1="170" y1="12" x2="185" y2="4" class="divider-stroke" stroke-width="1" />
          <line x1="170" y1="12" x2="185" y2="20" class="divider-stroke" stroke-width="1" />

          <line x1="185" y1="4" x2="215" y2="20" class="divider-stroke" stroke-width="1" />
          <line x1="185" y1="20" x2="215" y2="4" class="divider-stroke" stroke-width="1" />

          <line x1="215" y1="4" x2="230" y2="12" class="divider-stroke" stroke-width="1" />
          <line x1="215" y1="20" x2="230" y2="12" class="divider-stroke" stroke-width="1" />

          <line x1="230" y1="12" x2="380" y2="12" class="divider-stroke divider-edge" stroke-width="1" />

          <path d="M392 12L398 8V16L392 12Z" class="divider-fill divider-edge" />
          <path d="M392 12L380 8V16L392 12Z" class="divider-fill divider-edge" />
        </svg>
      </div>

      <div ref="skillsTagline" class="tagline-container mt-10 mb-16">
        <span class="tagline-static">{{ t('skills.taglineStatic') }}</span>
        <div class="flip-container">
          <div class="flip-content">
            <div v-for="word in flipWords" :key="word.key">
              <span class="flip-word" :class="word.className">{{ word.text }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-wrap justify-center gap-3 md:gap-4">
        <div
          v-for="skill in skills"
          :key="skill.name"
          class="skill-tag group"
        >
          <img
            :src="skill.icon"
            :alt="skill.name"
            class="w-5 h-5 md:w-6 md:h-6 object-contain"
          />
          <span class="skill-tag-name">{{ skill.name }}</span>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const { t, tm } = useI18n();

const flipClassMap = ['flip-improve', 'flip-learn', 'flip-adapt', 'flip-grow'];
const fallbackTaglineWords = ['Improve', 'Learn', 'Adapt', 'Grow'];

const normalizedTaglineWords = computed(() => {
  const words = tm('skills.taglineWords');
  if (Array.isArray(words) && words.length === 4) {
    return words;
  }
  return fallbackTaglineWords;
});

const flipWords = computed(() => {
  const baseWords = normalizedTaglineWords.value;
  const mapped = baseWords.map((text, index) => ({
    key: `word-${index}`,
    text,
    className: flipClassMap[index] || 'flip-improve'
  }));
  mapped.push({
    key: 'word-loop',
    text: baseWords[0],
    className: flipClassMap[0]
  });
  return mapped;
});

const skills = [
  { name: 'HTML', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
  { name: 'CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
  { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
  { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
  { name: 'Vue.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg' },
  { name: 'Nuxt.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nuxtjs/nuxtjs-original.svg' },
  { name: 'Tailwind CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg' },
  { name: 'Framer Motion', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/framermotion/framermotion-original.svg' },
  { name: 'Photoshop', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-original.svg' },
  { name: 'Illustrator', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-original.svg' },
  { name: 'Figma', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
  { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
  { name: 'GitHub', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' },
  { name: 'Vercel', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg' },
];

const skillsSection = ref(null);
const skillsTitle = ref(null);
const skillsBg = ref(null);
const skillsDivider = ref(null);
const skillsTagline = ref(null);

let skillsTimeline = null;
let skillsGridTimeline = null;

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger);

  const sectionEl = skillsSection.value;
  const titleEl = skillsTitle.value;
  const bgEl = skillsBg.value;
  const dividerEl = skillsDivider.value;
  const taglineEl = skillsTagline.value;

  if (!sectionEl || !titleEl || !bgEl || !dividerEl || !taglineEl) return;

  gsap.set([titleEl, bgEl], {
    opacity: 0,
    y: 28,
    filter: 'blur(6px)'
  });

  gsap.set([dividerEl, taglineEl], {
    opacity: 0,
    y: 18,
    filter: 'blur(4px)'
  });

  skillsTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: sectionEl,
      start: 'top 50%',
      toggleActions: 'play none none none'
    }
  });

  skillsTimeline
    .to(bgEl, {
      opacity: 0.08,
      y: 0,
      filter: 'blur(10px)',
      duration: 1.1,
      ease: 'power3.out'
    })
    .to(titleEl, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.9,
      ease: 'power3.out'
    }, 0.15)
    .add(() => {
      taglineEl.classList.add('is-visible');
    }, 0.35)
    .to(dividerEl, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.7,
      ease: 'power3.out'
    }, 0.35)
    .to(taglineEl, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.7,
      ease: 'power3.out'
    }, 0.45);

  const skillTags = sectionEl.querySelectorAll('.skill-tag');
  if (skillTags.length) {
    gsap.set(skillTags, { opacity: 0, scale: 0.1, y: 40 });
    skillsGridTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: sectionEl,
        start: 'top 70%',
        toggleActions: 'play none none none'
      }
    });
    skillsGridTimeline.to(skillTags, {
      duration: 1.4,
      opacity: 1,
      scale: 1,
      y: 0,
      ease: 'power3.out',
      stagger: {
        amount: 1.9,
        grid: 'auto',
        from: 'center'
      }
    });
  }
});

onUnmounted(() => {
  if (skillsTimeline) {
    if (skillsTimeline.scrollTrigger) skillsTimeline.scrollTrigger.kill();
    skillsTimeline.kill();
    skillsTimeline = null;
  }
  if (skillsGridTimeline) {
    if (skillsGridTimeline.scrollTrigger) skillsGridTimeline.scrollTrigger.kill();
    skillsGridTimeline.kill();
    skillsGridTimeline = null;
  }
});
</script>

<style scoped>
.skills-bg-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: clamp(4rem, 15vw, 10rem);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--theme-text-strong);
  opacity: 0.02;
  pointer-events: none;
  white-space: nowrap;
  user-select: none;
  filter: blur(10px);
}

.skills-title {
  position: relative;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  color: var(--theme-text-strong);
  z-index: 1;
}

.skills-divider-svg {
  width: clamp(280px, 50vw, 400px);
  height: 24px;
}

.divider-stroke {
  stroke: var(--theme-line-strong);
}

.divider-fill {
  fill: var(--theme-line-strong);
}

.divider-edge {
  opacity: 0.08;
}

.tagline-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 0;
  font-size: clamp(1rem, 1.6vw, 1.25rem);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0;
  color: var(--theme-text-muted);
  text-align: center;
  padding-left: 1.5rem;
}

.tagline-static {
  color: var(--theme-text-muted);
  letter-spacing: 0.18em;
}

.flip-container {
  height: 1.6em;
  overflow: hidden;
}

.flip-content {
  transform: translateY(0);
  animation: flip-words 8s linear infinite;
  animation-fill-mode: both;
  animation-play-state: paused;
}

.flip-content > div {
  height: 1.6em;
  display: flex;
  align-items: center;
  justify-content: center;
}

.flip-word {
  padding: 0.15em 0.5em;
  border-radius: 4px;
  color: var(--theme-text-strong);
  font-weight: 600;
  letter-spacing: 0.12em;
}

.flip-improve {
  background: var(--skills-flip-bg-1);
}

.flip-learn {
  background: var(--skills-flip-bg-2);
}

.flip-adapt {
  background: var(--skills-flip-bg-3);
}

.flip-grow {
  background: var(--skills-flip-bg-4);
}

@keyframes flip-words {
  0% { transform: translateY(0); }
  20% { transform: translateY(0); }
  25% { transform: translateY(-1.6em); }
  40% { transform: translateY(-1.6em); }
  45% { transform: translateY(-3.2em); }
  60% { transform: translateY(-3.2em); }
  65% { transform: translateY(-4.8em); }
  80% { transform: translateY(-4.8em); }
  85% { transform: translateY(-6.4em); }
  100% { transform: translateY(-6.4em); }
}

.tagline-container.is-visible .flip-content {
  animation-play-state: running;
}

:deep([data-theme]) {
  --skills-flip-bg-1: color-mix(in srgb, var(--theme-cta-bg) 45%, var(--theme-bg) 55%);
  --skills-flip-bg-2: color-mix(in srgb, var(--theme-cta-bg) 40%, var(--theme-bg) 60%);
  --skills-flip-bg-3: color-mix(in srgb, var(--theme-cta-bg) 35%, var(--theme-bg) 65%);
  --skills-flip-bg-4: color-mix(in srgb, var(--theme-cta-bg) 30%, var(--theme-bg) 70%);
}

.skill-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border-radius: 9999px;
  background: var(--theme-pill-bg);
  border: 1px solid var(--theme-pill-border);
  transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
  cursor: default;
}

.skill-tag:hover {
  transform: translateY(-2px);
}

.skill-tag-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--theme-text-strong);
  white-space: nowrap;
}

:deep([data-theme="dark"]) .skill-tag {
  background: rgba(30, 35, 45, 0.8);
  border-color: rgba(255, 255, 255, 0.1);
}

:deep([data-theme="dark"]) .skill-tag:hover {
  background: rgba(40, 45, 55, 0.9);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

:deep([data-theme="dark"]) .skills-bg-text {
  opacity: 0.04;
}

:deep([data-theme="light"]) .skill-tag {
  background: rgba(255, 255, 255, 0.65);
  border-color: rgba(0, 0, 0, 0.08);
}

:deep([data-theme="light"]) .skill-tag:hover {
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

:deep([data-theme="light"]) .skills-bg-text {
  opacity: 0.05;
}

:deep([data-theme="light"]) .skill-tag img[alt="GitHub"],
:deep([data-theme="light"]) .skill-tag img[alt="Vercel"],
:deep([data-theme="light"]) .skill-tag img[alt="NextJS"],
:deep([data-theme="light"]) .skill-tag img[alt="ExpressJS"] {
  filter: invert(1);
}
</style>