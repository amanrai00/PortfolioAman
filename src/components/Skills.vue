<template>
  <!-- Skills Section -->
  <section
    id="skills"
    class="relative px-5 lg:px-28 py-24 lg:py-32"
  >
    <div class="mx-auto w-full max-w-4xl text-center">
      <!-- Section Title with Background Text -->
      <div class="relative mb-8">
        <span class="skills-bg-text">SKILLS</span>
        <h2 class="skills-title">Skills</h2>
      </div>

      <!-- Decorative Dots -->
      <div class="flex items-center justify-center gap-3 mb-6">
        <span class="w-8 h-1 rounded-full bg-[var(--theme-line-strong)] opacity-60"></span>
        <span class="w-2 h-2 rounded-full bg-[var(--theme-cta-bg)]"></span>
        <span class="w-8 h-1 rounded-full bg-[var(--theme-line-strong)] opacity-60"></span>
      </div>

      <!-- Tagline -->
      <p class="text-sm md:text-base tracking-[0.25em] uppercase text-[var(--theme-text-muted)] mb-16">
        I constantly try to improve
      </p>

      <!-- Skills Tags -->
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
// Skills Data with CDN icons
const skills = [
  { name: 'HTML', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
  { name: 'CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
  { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
  { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
  { name: 'ReactJS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  { name: 'NextJS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
  { name: 'Tailwind CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg' },
  { name: 'Framer Motion', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/framermotion/framermotion-original.svg' },
  { name: 'Shadcn', icon: 'https://avatars.githubusercontent.com/u/139895814?s=200&v=4' },
  { name: 'NodeJS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
  { name: 'ExpressJS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg' },
  { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
  { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
  { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
  { name: 'Prisma', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg' },
  { name: 'Redux', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg' },
  { name: 'Zustand', icon: 'https://repository-images.githubusercontent.com/180328715/fca49300-e7f1-11ea-9f51-cfd949b31560' },
  { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
  { name: 'GitHub', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' },
  { name: 'Vercel', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg' },
  { name: 'Postman', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg' },
  { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
  { name: 'AWS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg' },
  { name: 'Kubernetes', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg' }
];
</script>

<style scoped>
/* ============================================================
   Background Text (Large "SKILLS" behind title)
   ============================================================ */
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
  opacity: 0.03;
  pointer-events: none;
  white-space: nowrap;
  user-select: none;
}

/* ============================================================
   Section Title
   ============================================================ */
.skills-title {
  position: relative;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  color: var(--theme-text-strong);
  z-index: 1;
}

/* ============================================================
   Skill Tag (Pill Style)
   ============================================================ */
.skill-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border-radius: 9999px;
  background: color-mix(in srgb, var(--theme-bg) 80%, var(--theme-text-strong) 20%);
  border: 1px solid color-mix(in srgb, var(--theme-text-strong) 15%, transparent);
  transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
  cursor: default;
}

.skill-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.skill-tag-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--theme-text-strong);
  white-space: nowrap;
}

/* ============================================================
   Dark Theme Adjustments
   ============================================================ */
:global([data-theme="dark"] .skill-tag) {
  background: rgba(30, 35, 45, 0.8);
  border-color: rgba(255, 255, 255, 0.1);
}

:global([data-theme="dark"] .skill-tag:hover) {
  background: rgba(40, 45, 55, 0.9);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

:global([data-theme="dark"] .skills-bg-text) {
  opacity: 0.04;
}

/* ============================================================
   Light Theme Adjustments
   ============================================================ */
:global([data-theme="light"] .skill-tag) {
  background: rgba(255, 255, 255, 0.85);
  border-color: rgba(0, 0, 0, 0.1);
}

:global([data-theme="light"] .skill-tag:hover) {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

:global([data-theme="light"] .skills-bg-text) {
  opacity: 0.06;
}

/* Invert icons that need it in light mode */
:global([data-theme="light"]) .skill-tag img[alt="GitHub"],
:global([data-theme="light"]) .skill-tag img[alt="Vercel"],
:global([data-theme="light"]) .skill-tag img[alt="NextJS"],
:global([data-theme="light"]) .skill-tag img[alt="ExpressJS"] {
  filter: invert(1);
}
</style>
