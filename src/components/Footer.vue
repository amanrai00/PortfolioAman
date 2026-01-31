<template>
  <div class="footer-wrapper">
    <footer ref="footerSectionEl" class="footer-section">
      <div class="footer-wave" aria-hidden="true">
        <div ref="waveLottieEl" class="footer-wave-lottie"></div>
      </div>

      <div class="footer-socials">
        <a
          href="https://github.com/amanrai00"
          target="_blank"
          rel="noopener noreferrer"
          class="footer-social-link footer-social-link--roll"
        >
          <span class="oh oh--social">
            <span>
              <span class="footer-bracket footer-bracket-left">[</span>
              <span class="footer-roll-word" :aria-label="t('footer.github')">
                <span class="footer-roll-word-track">
                  <span class="footer-roll-word-item">{{ t('footer.github') }}</span>
                  <span class="footer-roll-word-item">{{ t('footer.github') }}</span>
                </span>
              </span>
              <span class="footer-bracket footer-bracket-right">]</span>
            </span>
          </span>
        </a>
        <a
          href="https://www.linkedin.com/in/amanrai00/"
          target="_blank"
          rel="noopener noreferrer"
          class="footer-social-link footer-social-link--roll"
        >
          <span class="oh oh--social">
            <span>
              <span class="footer-bracket footer-bracket-left">[</span>
              <span class="footer-roll-word" :aria-label="t('footer.linkedin')">
                <span class="footer-roll-word-track">
                  <span class="footer-roll-word-item">{{ t('footer.linkedin') }}</span>
                  <span class="footer-roll-word-item">{{ t('footer.linkedin') }}</span>
                </span>
              </span>
              <span class="footer-bracket footer-bracket-right">]</span>
            </span>
          </span>
        </a>
        <a
          href="mailto:amanrai1630@gmail.com"
          class="footer-social-link footer-social-link--roll"
        >
          <span class="oh oh--social">
            <span>
              <span class="footer-bracket footer-bracket-left">[</span>
              <span class="footer-roll-word" :aria-label="t('footer.inquiry')">
                <span class="footer-roll-word-track">
                  <span class="footer-roll-word-item">{{ t('footer.inquiry') }}</span>
                  <span class="footer-roll-word-item">{{ t('footer.inquiry') }}</span>
                </span>
              </span>
              <span class="footer-bracket footer-bracket-right">]</span>
            </span>
          </span>
        </a>
      </div>

      <div class="footer-name">
        <h2 ref="footerNameEl" id="chasing-gold" class="footer-name-text">
          <span class="items__hold">{{ t('footer.name') }}</span>
        </h2>
      </div>

      <div class="footer-bottom">
        <div class="footer-bottom-left">
          <span class="oh"><span>{{ t('footer.location') }} {{ currentTime }}</span></span>
        </div>
        <div class="footer-bottom-center">
          <span class="oh"><span>{{ t('footer.tagline') }}</span></span>
        </div>
        <div class="footer-bottom-right">
          <span class="oh"><span>&copy; {{ t('footer.rights') }}</span></span>
          <span class="oh"><span>{{ currentYear }} Aman Rai</span></span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import lottie from 'lottie-web';
import { onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const waveLottieEl = ref(null);
const footerSectionEl = ref(null);
const currentTime = ref('');
const currentYear = new Date().getFullYear();
const footerNameEl = ref(null);
const { t } = useI18n();

let waveLottieAnim = null;
let timeInterval = null;
let pinTrigger = null;
let nameTl = null;
let nameTrigger = null;
let revealTrigger = null;

function updateTime() {
  const now = new Date();
  const timeValue = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Tokyo',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(now);
  currentTime.value = timeValue;
}

onMounted(async () => {
  updateTime();
  timeInterval = setInterval(updateTime, 60000);

  const sectionEl = footerSectionEl.value;
  const lottieContainer = waveLottieEl.value;
  if (!sectionEl || !lottieContainer) return;

  const waveModule = await import('@/assets/lottie/wave shaped line graphic.json');
  const waveData = waveModule?.default ?? waveModule;
  waveLottieAnim = lottie.loadAnimation({
    container: lottieContainer,
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
      trigger: sectionEl,
      start: 'top top',
      end: 'bottom bottom',
      pin: true,
      pinSpacing: false,
    });
    return () => st.kill();
  });

  revealTrigger = ScrollTrigger.create({
    trigger: sectionEl,
    start: 'top 60%',
    onEnter: () => sectionEl.classList.add('reveal'),
    onEnterBack: () => sectionEl.classList.add('reveal'),
    onLeave: () => sectionEl.classList.remove('reveal'),
    onLeaveBack: () => sectionEl.classList.remove('reveal'),
  });

  // Animate the footer name once it enters the viewport (desktop only)
  if (!footerNameEl.value) return;
  const mm = ScrollTrigger.matchMedia();
  mm.add('(min-width: 769px)', () => {
    nameTl = gsap.from(footerNameEl.value, {
      opacity: 0,
      scale: 4,
      transformOrigin: '50% 50%',
      force3D: true,
      duration: 1,
      ease: 'sine.inOut',
    });

    nameTrigger = ScrollTrigger.create({
      trigger: sectionEl,
      start: 'top 50%',
      onEnter: () => nameTl && nameTl.restart(),
      onEnterBack: () => nameTl && nameTl.restart(),
      onLeave: () => nameTl && nameTl.pause(0),
      onLeaveBack: () => nameTl && nameTl.pause(0),
    });

    return () => {
      if (nameTl) nameTl.kill();
      if (nameTrigger) nameTrigger.kill();
    };
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
  if (revealTrigger) {
    revealTrigger.kill();
    revealTrigger = null;
  }
  if (nameTl) {
    nameTl.kill();
    nameTl = null;
  }
  if (nameTrigger) {
    nameTrigger.kill();
    nameTrigger = null;
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
}

.footer-social-link--roll {
  display: inline-flex;
  align-items: center;
  gap: 0.35em;
  perspective: 700px;
}

.footer-bracket {
  display: inline-block;
  transition: transform 0.35s ease;
  font-size: 1.15em;
  line-height: 1;
  vertical-align: middle;
}

.footer-social-link--roll:hover .footer-bracket-left,
.footer-social-link--roll:focus-visible .footer-bracket-left {
  transform: translateX(-0.25em) scaleX(1.06);
}

.footer-social-link--roll:hover .footer-bracket-right,
.footer-social-link--roll:focus-visible .footer-bracket-right {
  transform: translateX(0.25em) scaleX(1.06);
}

.footer-roll-word {
  display: inline-flex;
  height: 1em;
  line-height: 1em;
  overflow: hidden;
  transform: translateY(0.12em);
}

.footer-roll-word-track {
  display: flex;
  flex-direction: column;
  transform: translateY(0);
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}

.footer-roll-word-item {
  display: block;
  min-height: 1em;
  line-height: 1em;
}

.footer-social-link--roll:hover .footer-roll-word-track,
.footer-social-link--roll:focus-visible .footer-roll-word-track {
  transform: translateY(-1em);
}

.oh {
  display: inline-block;
  overflow: hidden;
}

.oh--social {
  overflow: visible;
}

.oh--social > span {
  display: inline-flex;
  align-items: center;
}

.oh > span {
  display: inline-block;
  transform: translateY(140%);
  opacity: 0;
  transition: transform 0.6s cubic-bezier(0.77, 0, 0.175, 1), opacity 0.2s ease;
}

.reveal .oh > span {
  transform: translateY(0);
  opacity: 1;
}

.reveal .oh:nth-of-type(2) > span {
  transition-delay: 0.2s;
}

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

@media (max-width: 768px) {
  .footer-section {
    padding: 2rem 1.5rem;
    min-height: auto;
    gap: 3rem;
  }

  .footer-socials {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.5rem 1.5rem;
    justify-content: center;
  }

  .footer-name {
    padding: 2rem 0;
  }

  .footer-name-text {
    font-size: clamp(2.5rem, 14vw, 5rem);
  }

  .footer-bottom {
    flex-direction: column;
    gap: 1.5rem;
    align-items: center;
    text-align: center;
  }

  .footer-bottom-center {
    display: none;
  }

  .footer-bottom-right {
    align-items: center;
    order: -1;
  }

  .footer-bottom-left {
    order: 1;
  }

  .oh > span {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
