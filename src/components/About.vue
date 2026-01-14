<template>
  <section id="about" class="relative px-5 lg:px-28 pt-24 pb-16 lg:pt-32 lg:pb-24">
    <div class="mx-auto w-full max-w-6xl">
      <div class="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-center">
        <div class="about-left">
          <div
            class="relative w-[clamp(220px,28vw,320px)] h-[clamp(340px,42vw,480px)]"
            aria-hidden="true"
          >
            <div
              class="absolute inset-0 rounded-[24px] z-[1] bg-[linear-gradient(135deg,rgba(60,60,60,0.8),rgba(30,30,30,0.9))] shadow-[-20px_20px_60px_rgba(0,0,0,0.8),inset_0_0_0_1px_rgba(255,255,255,0.05)]"
            ></div>
            <div
              class="absolute top-[16px] left-[18px] w-full h-full rounded-[24px] overflow-hidden z-[2] shadow-[20px_30px_80px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.2)]"
            >
              <img
                :src="profileImage"
                alt="Profile portrait"
                class="w-full h-full object-cover block"
              />
              <div
                class="absolute inset-0 z-[1] bg-[linear-gradient(to_bottom,rgba(0,0,0,0.3)_0%,rgba(0,0,0,0)_40%,rgba(0,0,0,0)_60%,rgba(0,0,0,0.7)_100%)]"
              ></div>
              <div
                class="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[120%] h-[70%] z-[2] pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.12)_0%,transparent_70%)]"
              ></div>
              <div
                class="absolute top-0 right-0 w-[40%] h-full z-[3] pointer-events-none bg-[linear-gradient(to_left,rgba(255,255,255,0.08)_0%,transparent_100%)]"
              ></div>
            </div>
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
