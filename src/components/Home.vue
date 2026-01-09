8<template>
  <section id="home" class="min-h-screen px-5 lg:px-28 py-16 flex items-center relative">
    <div class="mx-auto flex w-full max-w-6xl flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">
      <div class="flex-[1.2] min-w-0 flex flex-col lg:justify-center">
    <h1 class="mx-auto w-full text-center text-5xl font-extrabold uppercase leading-[0.95] text-white sm:text-6xl lg:text-7xl lg:mt-55">
          <span class="block min-h-[2.85rem] overflow-hidden sm:min-h-[3.8rem] lg:min-h-[4.275rem]">
            <span :key="currentWord" class="inline-block w-full text-center whitespace-nowrap word-rotator text-6xl bg-gradient-to-b from-white/90 via-white/80 to-white/70 text-transparent bg-clip-text sm:text-7xl lg:text-[6.5rem] tracking-[0.18em]">{{ currentWord }}</span>
          </span>
        </h1>

        <div class="mt-30 lg:mt-48 hidden w-fit items-center gap-4 text-white lg:flex">
          <button
            type="button"
            class="inline-flex h-11 w-11 items-center justify-center rounded-md border border-white/25 bg-white/10 backdrop-blur-sm shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition hover:border-white/60 hover:bg-white/15"
            aria-label="LinkedIn"
          >
            <i class="bi bi-linkedin text-xl"></i>
          </button>
          <button
            type="button"
            class="inline-flex h-11 w-11 items-center justify-center rounded-md border border-white/25 bg-white/10 backdrop-blur-sm shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition hover:border-white/60 hover:bg-white/15"
            aria-label="Email"
          >
            <i class="bi bi-envelope-at text-xl"></i>
          </button>
          <button
            type="button"
            class="inline-flex h-11 w-11 items-center justify-center rounded-md border border-white/25 bg-white/10 backdrop-blur-sm shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition hover:border-white/60 hover:bg-white/15"
            aria-label="GitHub"
          >
            <i class="bi bi-github text-xl"></i>
          </button>
        </div>
      </div>

      <div class="flex flex-[0.8] flex-col gap-6 text-slate-200 lg:flex-row lg:items-start ">
        <div class="relative hidden h-0.5 w-20 bg-gradient-to-r from-[#9BB7C7]/0 via-[#9BB7C7]/95 to-[#9BB7C7]/0 shadow-[0_0_22px_rgba(155,183,199,0.55)] lg:block lg:h-48 lg:w-0.5 lg:bg-gradient-to-b lg:from-[#9BB7C7]/0 lg:via-[#9BB7C7]/95 lg:to-[#9BB7C7]/0 lg:rounded-full"></div>
        <div class="w-full text-base text-[#9BB7C7]/60 lg:text-lg lg:pl-20 lg:mt-[26px]">
          <div class="flex flex-wrap items-center justify-center gap-3 text-center lg:hidden">
            <p class="font-semibold text-white">Turning ideas into thoughtful web experiences
</p>
          </div>
          <div class="hidden space-y-2 lg:block lg:text-left">
            <p class="font-semibold text-white">Front-End Engineer</p>
            <p>Building modern web interfaces</p>
            <p>Based in Japan</p>
          </div>
        </div>
      </div>
    </div>
    <div class="absolute bottom-6 left-1/2 -translate-x-1/2 hidden lg:block">
      <div ref="mouseEl" class="h-12 w-6 opacity-40"></div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import lottie from "lottie-web";
import mouseAnim from "@/assets/lottie/Mouse Scroll.json";

const words = [
  "Engineer",
  "Designer",
  "Builder",
  "WebDev",
  "Commit",
  "Creative",
  "Crafting",
  "Focused",
];
const currentWord = ref(words[0]);
const mouseEl = ref(null);
let wordIndex = 0;
let timerId = null;
let mouseAnimInstance = null;

onMounted(() => {
  timerId = setInterval(() => {
    wordIndex = (wordIndex + 1) % words.length;
    currentWord.value = words[wordIndex];
  }, 900);

  if (mouseEl.value) {
    mouseAnimInstance = lottie.loadAnimation({
      container: mouseEl.value,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: mouseAnim,
    });
  }
});

onBeforeUnmount(() => {
  if (timerId) clearInterval(timerId);
  mouseAnimInstance?.destroy();
  mouseAnimInstance = null;
y();
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Oxanium:wght@400;600;700;800&display=swap");

.word-rotator {
  font-family: "Oxanium", sans-serif;
}
</style>
