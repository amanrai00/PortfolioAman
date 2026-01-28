<template>
  <div class="footer-wrapper">
  <footer ref="footerSectionEl" class="footer-section">
    <!-- Wave lottie background -->
    <div class="footer-wave" aria-hidden="true">
      <div ref="waveLottieEl" class="footer-wave-lottie"></div>
    </div>

    <!-- Social links row -->
    <div class="footer-socials">
      <a href="https://github.com/amanrai00" target="_blank" rel="noopener noreferrer" class="footer-social-link">
        [ GITHUB ]
      </a>
      <a href="https://www.linkedin.com/in/amanrai00/" target="_blank" rel="noopener noreferrer" class="footer-social-link">
        [ LINKEDIN ]
      </a>
      <a href="mailto:amanrai1630@gmail.com" class="footer-social-link">
        [ INQUIRY ]
      </a>
    </div>

    <!-- Big name -->
    <div class="footer-name">
      <h2 class="footer-name-text">AMAN</h2>
    </div>

    <!-- Bottom info row -->
    <div class="footer-bottom">
      <div class="footer-bottom-left">
        TOKYO, JAPAN: (GMT+9) {{ currentTime }}
      </div>
      <div class="footer-bottom-center">
        DEVELOPMENT &nbsp;&mdash;&nbsp; CREATIVE
      </div>
      <div class="footer-bottom-right">
        <span>&copy; All Rights Reserved.</span>
        <span>{{ currentYear }} Aman Rai</span>
      </div>
    </div>
  </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import lottie from 'lottie-web';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const waveLottieEl = ref(null);
const footerSectionEl = ref(null);
const currentTime = ref('');
const currentYear = new Date().getFullYear();

let waveLottieAnim = null;
let timeInterval = null;
let pinTrigger = null;

function updateTime() {
  const now = new Date();
  const lagosTime = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Tokyo',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(now);
  currentTime.value = lagosTime;
}

onMounted(async () => {
  updateTime();
  timeInterval = setInterval(updateTime, 60000);

  const waveModule = await import('@/assets/lottie/wave shaped line graphic.json');
  const waveData = waveModule?.default ?? waveModule;
  waveLottieAnim = lottie.loadAnimation({
    container: waveLottieEl.value,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    animationData: waveData,
    rendererSettings: {
      preserveAspectRatio: 'none',
    },
  });

  waveLottieAnim.setSpeed(0.4);

  // Pin footer for scroll delay effect (desktop only)
  gsap.registerPlugin(ScrollTrigger);
  pinTrigger = ScrollTrigger.matchMedia();
  pinTrigger.add('(min-width: 769px)', () => {
    const st = ScrollTrigger.create({
      trigger: footerSectionEl.value,
      start: 'top top',
      end: 'bottom bottom',
      pin: true,
      pinSpacing: false,
    });
    return () => st.kill();
  });
});

onUnmounted(() => {
  if (waveLottieAnim) {
    waveLottieAnim.destroy();
    waveLottieAnim = null;
  }
  if (timeInterval) {
    clearInterval(timeInterval);
    timeInterval = null;
  }
  if (pinTrigger) {
    pinTrigger.kill();
    pinTrigger = null;
  }
});
</script>

<style scoped>
.footer-wrapper {
  position: relative;
}

.footer-section {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
  padding: clamp(2rem, 4vw, 4rem) clamp(2rem, 5vw, 6rem);
  background: var(--theme-bg);
  overflow: hidden;
}

/* Wave lottie - positioned behind the big name text */
.footer-wave {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 40%;
  pointer-events: none;
  opacity: 0.5;
}

.footer-wave-lottie {
  width: 100%;
  height: 100%;
}

.footer-wave-lottie :deep(svg) {
  width: 100% !important;
  height: 100% !important;
}

.footer-wave-lottie :deep(path) {
  stroke: var(--theme-headline-from) !important;
}

/* Social links */
.footer-socials {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.footer-social-link {
  font-size: clamp(0.7rem, 1vw, 0.85rem);
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--theme-headline-from);
  text-decoration: none;
  transition: opacity 0.3s ease;
}

.footer-social-link:hover {
  opacity: 0.6;
}

/* Big name */
.footer-name {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.footer-name-text {
  font-size: clamp(4rem, 14vw, 16rem);
  font-weight: 900;
  letter-spacing: -0.02em;
  line-height: 1;
  color: var(--theme-headline-from);
  text-align: center;
  user-select: none;
}

/* Bottom info row */
.footer-bottom {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
  gap: 1rem;
}

.footer-bottom-left,
.footer-bottom-center,
.footer-bottom-right {
  font-size: clamp(0.65rem, 0.9vw, 0.8rem);
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--theme-headline-from);
}

.footer-bottom-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.15rem;
}

/* Responsive */
@media (max-width: 768px) {
  .footer-section {
    padding: 2rem 1.5rem;
    min-height: 80vh;
  }

  .footer-socials {
    flex-direction: column;
    gap: 0.75rem;
    align-items: flex-start;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .footer-bottom-right {
    align-items: flex-start;
  }

  .footer-name-text {
    font-size: clamp(3rem, 12vw, 8rem);
  }
}
</style>
