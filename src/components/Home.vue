8<template>
  <section id="home" class="min-h-screen px-5 lg:px-28 py-16 flex items-center relative">
    <div class="mx-auto flex w-full max-w-6xl flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">
      <div class="flex-[1.2] min-w-0 flex flex-col lg:justify-center">
    <h1 class="mx-auto w-full text-center text-6xl font-extrabold uppercase leading-[0.9] text-white sm:text-6xl lg:text-7xl lg:mt-55">
          <span class="block min-h-[2.85rem] overflow-hidden sm:min-h-[3.8rem] lg:min-h-[4.275rem]">
            <span :key="currentWord" class="inline-block w-full text-center whitespace-nowrap word-rotator text-7xl bg-gradient-to-b from-white/90 via-white/80 to-white/70 text-transparent bg-clip-text sm:text-7xl lg:text-[6.5rem] tracking-[0.18em]">{{ currentWord }}</span>
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
        <div class="relative hidden h-[1.5px] w-20 opacity-75 bg-gradient-to-r from-transparent via-white/60 to-transparent shadow-[0_0_4px_rgba(255,255,255,0.18)] lg:block lg:h-48 lg:w-0.5 lg:bg-gradient-to-b lg:from-[#9BB7C7]/0 lg:via-[#9BB7C7]/95 lg:to-[#9BB7C7]/0 lg:rounded-full"></div>
        <div class="w-full text-base text-[#9BB7C7]/60 lg:text-lg lg:pl-20 lg:mt-[26px]">
          <div class="flex flex-col items-center justify-center gap-4 text-center lg:hidden">
            <p class="text-sm font-medium text-white/60 leading-relaxed tracking-wide">Turning ideas into thoughtful web experiences</p>
            <div class="mt-6 flex justify-center">
              <button
                class="group relative inline-flex items-center justify-center overflow-hidden rounded-md bg-gray-800 px-8 py-2.5 text-white tracking-tighter transition-transform duration-300 ease-out hover:-translate-y-0.5"
                type="button"
              >
                <span
                  class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
                >
                  <span class="absolute -left-1/2 top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent blur-md transition-transform duration-500 ease-out group-hover:translate-x-[220%]"></span>
                </span>
                <span class="absolute bottom-0 left-0 -ml-2 h-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-full w-auto opacity-100 object-stretch"
                    viewBox="0 0 487 487"
                  >
                    <path
                      fill-opacity=".1"
                      fill-rule="nonzero"
                      fill="#FFF"
                      d="M0 .3c67 2.1 134.1 4.3 186.3 37 52.2 32.7 89.6 95.8 112.8 150.6 23.2 54.8 32.3 101.4 61.2 149.9 28.9 48.4 77.7 98.8 126.4 149.2H0V.3z"
                    ></path>
                  </svg>
                </span>
                <span class="absolute right-0 top-0 -mr-3 h-full w-12">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-full w-full object-cover"
                    viewBox="0 0 487 487"
                  >
                    <path
                      fill-opacity=".1"
                      fill-rule="nonzero"
                      fill="#FFF"
                      d="M487 486.7c-66.1-3.6-132.3-7.3-186.3-37s-95.9-85.3-126.2-137.2c-30.4-51.8-49.3-99.9-76.5-151.4C70.9 109.6 35.6 54.8.3 0H487v486.7z"
                    ></path>
                  </svg>
                </span>
                <span
                  class="absolute inset-0 -mt-1 h-full w-full rounded-lg bg-gradient-to-b from-transparent via-transparent to-gray-200 opacity-20"
                ></span>
                <span class="relative text-base font-semibold">Let's Connect</span>
              </button>
            </div>
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
