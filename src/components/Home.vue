<template>
  <section id="home" class="mt-20">
    <div class="flex justify-between py-10 items-center px-5 lg:px-28 lg:flex-row flex-col-reverse">
      <!-- Text Content Section -->
      <div
        ref="textSection"
        class="lg:w-[45%] transition-all duration-1000 ease-in-out"
        :class="textVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'"
      >
        <!-- Animated Heading -->
        <div class="text-2xl lg:text-5xl flex flex-col mt-8 lg:mt-0 gap-2 lg:gap-5 text-nowrap">
          <h2 
            class="transition-all duration-700 delay-100"
            :class="textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'"
          >
            Hello, 
            <span class="font-semibold">
              {{ displayedText }}<span class="animate-pulse">|</span>
            </span>
          </h2>
          
          <h2 
            class="transition-all duration-700 delay-300"
            :class="textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'"
          >
            <span class="font-extrabold">Fullstack</span>{" "}
            <span class="text-white font-extrabold outline-text">
              Developer
            </span>
          </h2>
          
          <h2 
            class="transition-all duration-700 delay-500"
            :class="textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'"
          >
            Based In <span class="font-extrabold">India.</span>
          </h2>
        </div>

        <!-- Description -->
        <p 
          class="text-[#71717A] text-sm lg:text-base mt-5 transition-all duration-700 delay-700"
          :class="textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'"
        >
          Passionate about technology, I specialize in Web Development and Web Designing. 
          I'm focused on building innovative solutions and continuously expanding my skills. 
          My goal is to grow as a developer and contribute to impactful projects in the tech industry.
        </p>

        <!-- Social Icons -->
        <div 
          class="flex items-center gap-x-5 mt-10 lg:mt-14 transition-all duration-700 delay-1000"
          :class="textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'"
        >
          <a
            v-for="(social, index) in socialLinks"
            :key="index"
            :href="social.url"
            class="bg-white p-2 lg:p-3 rounded border-2 border-black transition-all duration-300 hover:scale-110 hover:bg-black hover:text-white active:scale-95"
            :aria-label="social.label"
          >
            <component :is="social.icon" class="w-4 h-4 lg:w-5 lg:h-5" />
          </a>
        </div>
      </div>

      <!-- Hero Image Section -->
      <div
        ref="imageSection"
        class="lg:w-[55%] w-full transition-all duration-1000 ease-in-out"
        :class="imageVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'"
      >
        <img 
            :src="profileImg"
            alt="Profile picture"
            class="w-full h-auto rounded-2xl object-cover"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import profileImg from '@/assets/profile.jpg'

// Icons - Using Unicode/Emoji alternatives (you can replace with icon library)
const GmailIcon = {
  template: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>'
};

const LinkedInIcon = {
  template: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>'
};

const TwitterIcon = {
  template: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M22.46 6c-.85.38-1.78.64-2.75.76a4.8 4.8 0 0 0 2.1-2.66c-.93.55-1.95.95-3.04 1.17a4.78 4.78 0 0 0-8.14 4.36C7.69 9.43 4.07 7.5 1.64 4.46c-.4.68-.63 1.47-.63 2.31 0 1.66.84 3.12 2.12 3.97a4.78 4.78 0 0 1-2.16-.6v.06c0 2.32 1.64 4.25 3.82 4.69a4.8 4.8 0 0 1-2.16.08 4.78 4.78 0 0 0 4.46 3.32A9.58 9.58 0 0 1 1 19.54 13.5 13.5 0 0 0 8.29 22c8.75 0 13.54-7.25 13.54-13.54 0-.21 0-.41-.01-.61.93-.67 1.74-1.51 2.38-2.47z"/></svg>'
};

const GitHubIcon = {
  template: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>'
};

const socialLinks = [
  { icon: GmailIcon, url: '#', label: 'Email' },
  { icon: LinkedInIcon, url: '#', label: 'LinkedIn' },
  { icon: TwitterIcon, url: '#', label: 'Twitter' },
  { icon: GitHubIcon, url: '#', label: 'GitHub' }
];

const textSection = ref(null);
const imageSection = ref(null);
const textVisible = ref(false);
const imageVisible = ref(false);

// Typing animation
const displayedText = ref('');
const fullText = 'I am Sathish Kumar';
let typingIndex = 0;
let typingInterval = null;

const startTyping = () => {
  typingInterval = setInterval(() => {
    if (typingIndex < fullText.length) {
      displayedText.value += fullText[typingIndex];
      typingIndex++;
    } else {
      clearInterval(typingInterval);
    }
  }, 100);
};

let observer = null;

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target === textSection.value) {
            textVisible.value = true;
            setTimeout(startTyping, 500);
          } else if (entry.target === imageSection.value) {
            imageVisible.value = true;
          }
        }
      });
    },
    { threshold: 0.1 }
  );

  if (textSection.value) observer.observe(textSection.value);
  if (imageSection.value) observer.observe(imageSection.value);
});

onUnmounted(() => {
  if (observer) observer.disconnect();
  if (typingInterval) clearInterval(typingInterval);
});
</script>

<style scoped>
/* Outlined text effect */
.outline-text {
  -webkit-text-stroke: 1px black;
}

/* Smooth transitions with easing */
.transition-all {
  transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Pulse animation for cursor */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

.animate-pulse {
  animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>