<template>
  <section id="about" class="px-5 lg:px-28 py-16 lg:py-24">
    <div class="flex justify-between items-center flex-col lg:flex-row gap-8 lg:gap-16">
      <!-- Image Section -->
      <div
        ref="imageSection"
        class="lg:w-1/2 w-full transition-all duration-700"
        :class="imageVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'"
      >
        <img 
          :src="aboutMeSvg" 
          alt="About Me Illustration"
          class="w-full h-auto"
        />
      </div>
      
      <!-- Text Section -->
      <div
        ref="textSection"
        class="lg:w-1/2 w-full transition-all duration-700 delay-200"
        :class="textVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'"
      >
        <h2 class="text-2xl lg:text-4xl font-bold mt-4 lg:mt-0">
          About <span class="font-extrabold text-primary">Me</span>
        </h2>
        
        <p class="text-gray-600 text-sm lg:text-base leading-relaxed mt-5 lg:mt-10">
          I'm a passionate full-stack developer specializing in <strong>React.js & Node.js</strong>. 
          I thrive on blending technical expertise with sleek UI/UX design to build high-performing, 
          user-friendly applications.
        </p>
        
        <p class="text-gray-600 text-sm lg:text-base leading-relaxed mt-3 lg:mt-5">
          My web development journey started in <strong>2015</strong>, and since then, I've 
          continuously evolved, taking on new challenges and keeping up with the latest technologies. 
          Today, I build <strong>cutting-edge web applications</strong> using 
          <strong>Next.js, TypeScript, NestJS, TailwindCSS, Supabase, and more</strong>.
        </p>
        
        <p class="text-gray-600 text-sm lg:text-base leading-relaxed mt-3 lg:mt-5">
          Beyond coding, I enjoy sharing insights on <strong>Twitter</strong>, engaging with 
          <strong>Indie Hackers</strong>, and following the journey of <strong>early-stage startups</strong>. 
          Feel free to follow me on <strong>Twitter</strong> or check out my projects on <strong>GitHub</strong>.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import aboutMeSvg from '@/assets/about-me.svg'

const imageSection = ref(null);
const textSection = ref(null);
const imageVisible = ref(false);
const textVisible = ref(false);

let observer = null;

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target === imageSection.value) {
            imageVisible.value = true;
          } else if (entry.target === textSection.value) {
            textVisible.value = true;
          }
        }
      });
    },
    { threshold: 0.1 }
  );

  if (imageSection.value) observer.observe(imageSection.value);
  if (textSection.value) observer.observe(textSection.value);
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});
</script>

<style scoped>
/* Spring-like easing for smooth animations */
.transition-all {
  transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Optional: Custom scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>