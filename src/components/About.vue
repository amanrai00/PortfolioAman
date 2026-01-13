<template>
  <section id="about" class="relative px-5 lg:px-28 pt-24 pb-16 lg:pt-32 lg:pb-24">
    <div class="mx-auto w-full max-w-6xl">
      <div class="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-center">
        <div class="about-left">
          <div class="card" aria-hidden="true">
            <img
              :src="profileImage"
              alt="Profile portrait"
              class="card-image"
            />
          </div>
        </div>
        <div
          ref="textSection"
          class="transition-all duration-700 delay-200"
          :class="textVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'"
        >
          <span class="about-line"></span>
          <h2 class="about-title">About me</h2>
          <p class="about-text">
            I'm a passionate full-stack developer specializing in <strong>React.js & Node.js</strong>.
            I thrive on blending technical expertise with sleek UI/UX design to build high-performing,
            user-friendly applications.
          </p>
          <p class="about-text">
            My web development journey started in <strong>2015</strong>, and since then, I've
            continuously evolved, taking on new challenges and keeping up with the latest technologies.
            Today, I build <strong>cutting-edge web applications</strong> using
            <strong>Next.js, TypeScript, NestJS, TailwindCSS, Supabase, and more</strong>.
          </p>
          <p class="about-text">
            Beyond coding, I enjoy sharing insights on <strong>Twitter</strong>, engaging with
            <strong>Indie Hackers</strong>, and following the journey of <strong>early-stage startups</strong>.
            Feel free to follow me on <strong>Twitter</strong> or check out my projects on <strong>GitHub</strong>.
          </p>
          <div class="about-actions">
            <a class="about-button" href="#contact">Contact me</a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import profileImage from '@/assets/profile.jpg';

const textSection = ref(null);
const textVisible = ref(false);

let observer = null;

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target === textSection.value) {
            textVisible.value = true;
          }
        }
      });
    },
    { threshold: 0.1 }
  );

  if (textSection.value) observer.observe(textSection.value);
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});
</script>

<style scoped>
.transition-all {
  transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}

.about-left {
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
}

.card {
  width: clamp(220px, 28vw, 320px);
  height: clamp(300px, 38vw, 420px);
  border-radius: 1rem;
  background-color: #4158d0;
  background-image: linear-gradient(
    43deg,
    #4158d0 0%,
    #1888b4 46%,
    #0f31ca 100%
  );
  box-shadow: rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset,
    rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset,
    rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px,
    rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px,
    rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-image {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.about-line {
  display: inline-block;
  width: 64px;
  height: 4px;
  border-radius: 999px;
  background: var(--theme-line-strong);
  box-shadow: 0 0 12px var(--theme-line-shadow);
  margin-bottom: 1.2rem;
}

.about-title {
  font-size: clamp(2rem, 3vw, 3.2rem);
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--theme-text-strong);
}

.about-text {
  margin-top: 1.4rem;
  font-size: 1rem;
  line-height: 1.85;
  color: var(--theme-text-muted);
}

.about-actions {
  margin-top: 2rem;
}

.about-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 0.85rem 2.2rem;
  border: 1px solid var(--theme-line-strong);
  color: var(--theme-text-strong);
  font-weight: 600;
  letter-spacing: 0.04em;
  transition: transform 0.2s ease, background-color 0.2s ease, color 0.2s ease,
    border-color 0.2s ease;
}

.about-button:hover {
  transform: translateY(-2px);
  background: var(--theme-cta-bg);
  border-color: var(--theme-cta-bg);
  color: var(--theme-cta-text);
}
</style>
