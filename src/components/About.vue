<template>
  <section id="about" class="relative px-5 lg:px-28 pt-24 pb-16 lg:pt-32 lg:pb-24">
    <div class="mx-auto w-full max-w-6xl">
      <div class="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-center">
        <div class="about-left">
          <div
            class="relative w-[clamp(260px,32vw,360px)] h-[clamp(340px,42vw,480px)]"
            aria-hidden="true"
          >
            <div
              class="absolute inset-0 rounded-[24px] z-[1] bg-[linear-gradient(145deg,color-mix(in_srgb,var(--theme-bg)_78%,var(--theme-cta-bg)_22%),color-mix(in_srgb,var(--theme-bg)_48%,var(--theme-cta-bg)_52%))] shadow-[0_18px_50px_rgba(0,0,0,0.25),0_0_20px_color-mix(in_srgb,var(--theme-cta-bg)_30%,transparent)] opacity-[0.985] blur-[2px]"
            ></div>
            <div
              ref="imageFrame"
              class="about-image-frame absolute top-[16px] left-[18px] w-full h-full rounded-[24px] overflow-hidden z-[2] shadow-[0_22px_60px_rgba(0,0,0,0.35),0_0_24px_color-mix(in_srgb,var(--theme-cta-bg)_35%,transparent)]"
              :class="imageVisible ? 'is-visible' : ''"
            >
              <img
                :src="profileImage"
                alt="Profile portrait"
                class="about-image w-full h-full object-cover block"
              />
              <div
                class="about-image-glow absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.28)_100%)]"
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
const imageFrame = ref(null);
const textVisible = ref(false);
const imageVisible = ref(false);

let observer = null;

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target === textSection.value) textVisible.value = true;
          if (entry.target === imageFrame.value) imageVisible.value = true;
        }
      });
    },
    { threshold: 0.1 }
  );

  if (textSection.value) observer.observe(textSection.value);
  if (imageFrame.value) observer.observe(imageFrame.value);
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

.about-image-frame {
  position: absolute;
  overflow: hidden;
}

.about-image {
  opacity: 0;
}

.about-image-glow {
  opacity: 0;
}

.about-image-frame::before,
.about-image-frame::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  z-index: 3;
  width: 0;
}

.about-image-frame::before {
  background: var(--theme-cta-bg);
}

.about-image-frame::after {
  background: color-mix(in srgb, var(--theme-cta-bg) 55%, #000);
}

.about-image-frame.is-visible::before {
  animation: about-image-reveal-ltr 1.8s ease forwards;
}

.about-image-frame.is-visible::after {
  animation: about-image-reveal-ltr 1s 0.6s ease forwards;
}

.about-image-frame.is-visible .about-image,
.about-image-frame.is-visible .about-image-glow {
  animation: about-image-fadein 0.1s 1.1s forwards;
}

@keyframes about-image-reveal-ltr {
  0% {
    width: 0;
    left: 0;
    right: auto;
  }
  65% {
    width: 100%;
    left: 0;
    right: auto;
  }
  100% {
    width: 0;
    left: 100%;
    right: auto;
  }
}

@keyframes about-image-fadein {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
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
