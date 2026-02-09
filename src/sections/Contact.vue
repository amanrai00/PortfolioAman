<template>
  <div id="contact" ref="contactWrapper" class="contact-wrapper">
    <section
      ref="contactSection"
      class="contact-section relative min-h-screen overflow-hidden is-offscreen"
      :class="isJa ? 'is-ja' : ''"
    >
      <div class="contact-bg absolute inset-0 z-0" aria-hidden="true">
        <img :src="contactBgImage" alt="" class="contact-bg-image" />
        <div class="contact-overlay"></div>
      </div>

      <div class="contact-split relative z-20">
        <div class="contact-left">
          <div class="contact-left-content">
            <h2 class="contact-title contact-title--stacked font-bold leading-tight tracking-tight">
              <span class="contact-title-text">{{ t('contact.title') }}</span>
            </h2>
            <p class="contact-subtitle mt-6 max-w-xl">
              {{ t('contact.subtitle') }}
            </p>
          </div>
        </div>

        <div class="contact-right" :class="{ 'is-success': formSubmitted }">
          <!-- Success State -->
          <div v-if="formSubmitted" class="contact-success-wrapper">
            <div ref="lottieContainer" class="contact-lottie"></div>
            <h3 class="contact-success-title">{{ t('contact.successTitle') }}</h3>
            <p v-if="isJa" class="contact-success-message">
              {{ t('contact.successMessageLine1') }}<br class="ja-mobile-break" />{{ t('contact.successMessageLine2') }}
            </p>
            <p v-else class="contact-success-message">
              {{ t('contact.successMessage') }}
            </p>
          </div>

          <!-- Form State -->
          <div v-else class="contact-form-wrapper">
            <h3 class="contact-form-title">{{ t('contact.formTitle') }}</h3>
            <form
              ref="formRef"
              class="contact-form"
              name="contact"
              method="POST"
              novalidate
              data-netlify="true"
              netlify-honeypot="bot-field"
              @submit.prevent="handleSubmit"
            >
              <input type="hidden" name="form-name" value="contact" />
              <!-- Honeypot fields for bot detection -->
              <p style="display: none;">
                <label>Don't fill this out: <input name="bot-field" /></label>
              </p>
              <input type="text" name="website" style="position: absolute; left: -9999px;" tabindex="-1" autocomplete="off" />
              <input type="hidden" name="_gotcha" />
              <label class="contact-field">
                <span class="contact-label">{{ t('contact.nameLabel') }}</span>
                <input
                  v-model.trim="formState.name"
                  class="contact-input"
                  :class="{ 'contact-input--error': Boolean(errors.name) }"
                  type="text"
                  name="name"
                  autocomplete="name"
                  maxlength="60"
                  :placeholder="t('contact.namePlaceholder')"
                  :aria-invalid="Boolean(errors.name)"
                  aria-describedby="contact-name-error"
                  @blur="handleBlur('name')"
                  @input="handleInput('name')"
                />
                <p v-if="errors.name" id="contact-name-error" class="contact-error" role="alert">
                  <span class="contact-error-icon" aria-hidden="true">!</span>
                  <span>{{ errors.name }}</span>
                </p>
              </label>
              <label class="contact-field">
                <span class="contact-label">{{ t('contact.emailLabel') }}</span>
                <input
                  ref="emailInputRef"
                  v-model.trim="formState.email"
                  class="contact-input"
                  :class="{ 'contact-input--error': Boolean(errors.email) }"
                  type="email"
                  name="email"
                  autocomplete="email"
                  inputmode="email"
                  maxlength="120"
                  :placeholder="t('contact.emailPlaceholder')"
                  :aria-invalid="Boolean(errors.email)"
                  aria-describedby="contact-email-error"
                  @blur="handleBlur('email')"
                  @input="handleInput('email')"
                  required
                />
                <p v-if="errors.email" id="contact-email-error" class="contact-error" role="alert">
                  <span class="contact-error-icon" aria-hidden="true">!</span>
                  <span>{{ errors.email }}</span>
                </p>
                <p
                  v-else-if="emailWarning"
                  id="contact-email-warning"
                  class="contact-warning"
                  role="status"
                  aria-live="polite"
                >
                  <span class="contact-warning-icon" aria-hidden="true">!</span>
                  <span>{{ emailWarning }}</span>
                </p>
              </label>
              <label class="contact-field">
                <span class="contact-label">{{ t('contact.messageLabel') }}</span>
                <textarea
                  v-model.trim="formState.message"
                  class="contact-input"
                  :class="{ 'contact-input--error': Boolean(errors.message) }"
                  rows="4"
                  name="message"
                  maxlength="2000"
                  :placeholder="t('contact.messagePlaceholder')"
                  :aria-invalid="Boolean(errors.message)"
                  aria-describedby="contact-message-error"
                  @blur="handleBlur('message')"
                  @input="handleInput('message')"
                ></textarea>
                <p v-if="errors.message" id="contact-message-error" class="contact-error" role="alert">
                  <span class="contact-error-icon" aria-hidden="true">!</span>
                  <span>{{ errors.message }}</span>
                </p>
              </label>
              <button class="contact-submit" type="submit" :disabled="isSubmitting">
                {{ isSubmitting ? t('contact.sendLoading') : t('contact.send') }}
              </button>
            </form>
          </div>
        </div>
      </div>
  </section>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onBeforeUnmount, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import contactBgImage from '@/assets/contact-bg.jpg';

const contactWrapper = ref(null);
const contactSection = ref(null);
const lottieContainer = ref(null);
const formRef = ref(null);
const emailInputRef = ref(null);
const { t, locale } = useI18n();
let successLottieAnim = null;
const isJa = computed(() => locale.value === 'ja');

const formState = ref({
  name: '',
  email: '',
  message: '',
});

const touched = ref({
  name: false,
  email: false,
  message: false,
});

const errors = ref({
  name: '',
  email: '',
  message: '',
});
const emailWarning = ref('');

const isSubmitting = ref(false);
const formSubmitted = ref(false);
const formLoadTime = ref(Date.now());
let lastSubmitTime = 0;

let revealTween = null;
let exitTween = null;
let mediaMatch = null;
let mountToken = 0;
let wrapperObserver = null;
let isWrapperVisible = false;
let wasWrapperVisible = false;

const resetForm = () => {
  formState.value = {
    name: '',
    email: '',
    message: '',
  };
  touched.value = {
    name: false,
    email: false,
    message: false,
  };
  errors.value = {
    name: '',
    email: '',
    message: '',
  };
  emailWarning.value = '';
};

const practicalEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u;
const trustedEmailDomains = [
  'gmail.com',
  'outlook.com',
  'hotmail.com',
  'yahoo.com',
  'icloud.com',
  'proton.me',
  'protonmail.com',
  'zoho.com',
  'mail.com',
  'fastmail.com',
  'yahoo.co.jp',
  'docomo.ne.jp',
  'ezweb.ne.jp',
  'au.com',
  'softbank.ne.jp',
  'i.softbank.jp',
  'ymobile.ne.jp',
  'ymobile.jp',
];
const domainTypoMap = {
  'gamil.com': 'gmail.com',
  'gnail.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gmial.com': 'gmail.com',
  'gmail.co': 'gmail.com',
  'gmail.con': 'gmail.com',
  'outlok.com': 'outlook.com',
  'outllok.com': 'outlook.com',
  'outlook.co': 'outlook.com',
  'hotnail.com': 'hotmail.com',
  'hotmial.com': 'hotmail.com',
  'yaho.com': 'yahoo.com',
  'yahho.com': 'yahoo.com',
  'yhoo.com': 'yahoo.com',
  'yahoo.coj.jp': 'yahoo.co.jp',
  'docomo.ne,jp': 'docomo.ne.jp',
  'ezweb.ne,jp': 'ezweb.ne.jp',
  'softbank.ne,jp': 'softbank.ne.jp',
  'ymobile.ne,jp': 'ymobile.ne.jp',
};

const getEmailParts = (email) => {
  const atIndex = email.lastIndexOf('@');
  if (atIndex <= 0 || atIndex >= email.length - 1) {
    return { localPart: '', domain: '' };
  }
  return {
    localPart: email.slice(0, atIndex),
    domain: email.slice(atIndex + 1).toLowerCase(),
  };
};

const levenshteinDistance = (a, b) => {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const prev = new Array(b.length + 1);
  const curr = new Array(b.length + 1);
  for (let j = 0; j <= b.length; j += 1) prev[j] = j;

  for (let i = 1; i <= a.length; i += 1) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        prev[j] + 1,
        curr[j - 1] + 1,
        prev[j - 1] + cost
      );
    }
    for (let j = 0; j <= b.length; j += 1) prev[j] = curr[j];
  }

  return prev[b.length];
};

const getSuggestedDomain = (domain) => {
  if (!domain) return '';
  if (trustedEmailDomains.includes(domain)) return '';
  if (domainTypoMap[domain]) return domainTypoMap[domain];

  const domainLabels = domain.split('.').length;
  let bestDomain = '';
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const candidate of trustedEmailDomains) {
    const candidateLabels = candidate.split('.').length;
    if (Math.abs(candidateLabels - domainLabels) > 1) continue;

    const distance = levenshteinDistance(domain, candidate);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestDomain = candidate;
    }
  }

  if (!bestDomain) return '';

  const maxLength = Math.max(domain.length, bestDomain.length);
  const normalized = bestDistance / maxLength;
  if (bestDistance <= 2 && normalized <= 0.25) return bestDomain;

  return '';
};

const updateEmailWarning = () => {
  const email = formState.value.email;
  if (!email) {
    emailWarning.value = '';
    return;
  }

  const emailEl = emailInputRef.value;
  if (!emailEl || emailEl.validity.valueMissing || emailEl.validity.typeMismatch || !practicalEmailPattern.test(email)) {
    emailWarning.value = '';
    return;
  }

  const { domain } = getEmailParts(email);
  const suggestedDomain = getSuggestedDomain(domain);
  emailWarning.value = suggestedDomain
    ? t('contact.warnings.emailDomainTypo', { domain: suggestedDomain })
    : '';
};

const getFieldError = (field) => {
  const value = formState.value[field];

  if (field === 'name' && !value) {
    return t('contact.errors.nameRequired');
  }

  if (field === 'email') {
    const emailEl = emailInputRef.value;
    if (!emailEl) {
      return !value || !practicalEmailPattern.test(value) ? t('contact.errors.emailInvalid') : '';
    }

    // Level 1: HTML5 checks from `type="email"` + `required`.
    if (emailEl.validity.valueMissing || emailEl.validity.typeMismatch) {
      return t('contact.errors.emailInvalid');
    }

    // Level 2: practical JS check for obvious structural issues.
    if (!practicalEmailPattern.test(value)) {
      return t('contact.errors.emailInvalid');
    }
  }

  if (field === 'message' && !value) {
    return t('contact.errors.messageRequired');
  }

  return '';
};

const validateField = (field) => {
  errors.value[field] = getFieldError(field);
  if (field === 'email') {
    if (errors.value.email) {
      emailWarning.value = '';
    } else {
      updateEmailWarning();
    }
  }
  return !errors.value[field];
};

const validateForm = () => {
  const fields = ['name', 'email', 'message'];
  let isValid = true;
  for (const field of fields) {
    touched.value[field] = true;
    const fieldValid = validateField(field);
    if (!fieldValid && isValid) {
      const invalidEl = formRef.value?.querySelector(`[name="${field}"]`);
      invalidEl?.focus();
    }
    isValid = isValid && fieldValid;
  }
  return isValid;
};

const handleBlur = (field) => {
  touched.value[field] = true;
  validateField(field);
};

const handleInput = (field) => {
  if (field === 'email') {
    // Warning is non-blocking and should clear/update as the user types.
    updateEmailWarning();
  }
  if (touched.value[field] || errors.value[field]) {
    validateField(field);
  }
};

// Spam pattern detection
const containsSpamPatterns = (text) => {
  const spamPatterns = [
    /\[url=/i,
    /https?:\/\/[^\s]{50,}/i,
    /(.)\1{10,}/,
    /<\s*script/i,
    /<\s*a\s+href/i,
  ];
  return spamPatterns.some((pattern) => pattern.test(text));
};

const handleSubmit = async () => {
  const { name, email, message } = formState.value;
  const now = Date.now();

  if (!validateForm()) return;

  // Prevent double submission
  if (isSubmitting.value) return;

  // Rate limiting - minimum 10 seconds between submissions
  if (now - lastSubmitTime < 10000 && lastSubmitTime > 0) {
    alert('Please wait before submitting again.');
    return;
  }

  // Timing check - reject if submitted too fast (< 3 seconds)
  if (now - formLoadTime.value < 3000) {
    alert('Please take your time filling out the form.');
    formLoadTime.value = Date.now();
    return;
  }

  // Spam pattern detection
  if (containsSpamPatterns(name) || containsSpamPatterns(message)) {
    alert('Your message could not be sent. Please remove any suspicious content.');
    return;
  }

  // Check honeypot fields (should be empty)
  const formEl = formRef.value;
  const websiteField = formEl?.querySelector('input[name="website"]');
  const gotchaField = formEl?.querySelector('input[name="_gotcha"]');
  if (websiteField?.value || gotchaField?.value) {
    // Silent fail for bots
    resetForm();
    alert('Thank you for your message!');
    return;
  }

  isSubmitting.value = true;

  const formData = new URLSearchParams();
  formData.append('form-name', 'contact');
  formData.append('name', name);
  formData.append('email', email);
  formData.append('message', message);

  try {
    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    });

    if (!response.ok) {
      console.error('Form submission failed:', response.status, response.statusText);
      throw new Error('Submission failed');
    }

    lastSubmitTime = Date.now();
    resetForm();
    formLoadTime.value = Date.now();

    // Preload Lottie animation before showing success state
    const [{ default: lottie }, workAnimModule] = await Promise.all([
      import('lottie-web'),
      import('@/assets/lottie/work.json'),
    ]);
    const workAnimData = workAnimModule.default ?? workAnimModule;

    // Show success state after Lottie is preloaded
    formSubmitted.value = true;

    await nextTick();

    if (lottieContainer.value) {
      successLottieAnim = lottie.loadAnimation({
        container: lottieContainer.value,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: workAnimData,
      });
    }
  } catch (error) {
    console.error('Form error:', error);
    alert('There was an error sending your message. Please try again.');
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  const currentMount = ++mountToken;

  const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
  ]);
  if (currentMount !== mountToken) return;
  gsap.registerPlugin(ScrollTrigger);

  const wrapperEl = contactWrapper.value;
  const sectionEl = contactSection.value;
  if (!wrapperEl || !sectionEl) return;

  document.documentElement.style.scrollBehavior = 'auto';
  const isMobileLayout = window.matchMedia('(max-width: 768px)').matches;

  if (isMobileLayout) {
    // On small screens locale/menu toggles can leave this class stale until scroll.
    // Keep the section visible and skip the desktop offscreen observer behavior.
    sectionEl.classList.remove('is-offscreen');
    isWrapperVisible = true;
    wasWrapperVisible = true;
  } else {
    wrapperObserver = new IntersectionObserver(
      (entries) => {
        const isVisible = entries.some((entry) => entry.isIntersecting);
        isWrapperVisible = isVisible;
        sectionEl.classList.toggle('is-offscreen', !isVisible);
        wasWrapperVisible = isVisible;
      },
      { threshold: 0.1 }
    );
    wrapperObserver.observe(wrapperEl);
  }

  const createScrollTrigger = (initialClip, triggerStart, triggerEnd = 'bottom bottom') => {
    revealTween = gsap.fromTo(sectionEl,
      { clipPath: `inset(${initialClip}% 0 0 0)` },
      {
        clipPath: 'inset(0% 0 0 0)',
        ease: 'none',
        scrollTrigger: {
          trigger: wrapperEl,
          start: triggerStart,
          end: triggerEnd,
          scrub: true,
          invalidateOnRefresh: true,
        },
      }
    );

    return () => {
      if (revealTween) {
        revealTween.kill();
        revealTween = null;
      }
    };
  };

  const createExitScroll = () => {
    const footerEl = document.querySelector('.footer-wrapper');
    if (!footerEl) return () => {};
    gsap.set(sectionEl, { yPercent: 0 });
    exitTween = gsap.to(sectionEl, {
      yPercent: -100,
      ease: 'none',
      scrollTrigger: {
        trigger: footerEl,
        start: 'top bottom',
        end: 'top top',
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      if (exitTween) {
        exitTween.kill();
        exitTween = null;
      }
      gsap.set(sectionEl, { yPercent: 0 });
    };
  };

  if (isMobileLayout) {
    // Keep mobile stable: avoid clip-path scrub that can stick after locale toggle.
    gsap.set(sectionEl, { clipPath: 'inset(0% 0 0 0)' });
  } else {
    mediaMatch = ScrollTrigger.matchMedia();
    mediaMatch.add('(min-width: 769px)', () => {
      const killReveal = createScrollTrigger(100, 'top bottom', () => `top+=${window.innerHeight}px bottom`);
      const killExit = createExitScroll();

      return () => {
        killReveal?.();
        killExit?.();
      };
    });
  }

  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
  });
});

watch(locale, async () => {
  if (!window.matchMedia('(max-width: 768px)').matches) return;
  const sectionEl = contactSection.value;
  if (!sectionEl) return;

  await nextTick();
  sectionEl.classList.remove('is-offscreen');
  sectionEl.style.removeProperty('clip-path');
  sectionEl.style.removeProperty('-webkit-clip-path');
  sectionEl.style.removeProperty('transform');
});

onBeforeUnmount(() => {
  mountToken += 1;

  if (wrapperObserver) {
    wrapperObserver.disconnect();
    wrapperObserver = null;
  }

  if (revealTween) {
    revealTween.kill();
    revealTween = null;
  }
  if (exitTween) {
    exitTween.kill();
    exitTween = null;
  }
  if (mediaMatch) {
    mediaMatch.kill();
    mediaMatch = null;
  }
  if (successLottieAnim) {
    successLottieAnim.destroy();
    successLottieAnim = null;
  }

  isWrapperVisible = false;
  wasWrapperVisible = false;
  document.documentElement.style.scrollBehavior = '';
});
</script>

<style scoped>
.contact-wrapper {
  position: relative;
  height: 200vh;
}

.contact-section {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  will-change: transform;
  contain: layout paint;
  background: radial-gradient(
      120% 120% at 10% 0%,
      rgba(36, 38, 56, 0.6),
      rgba(12, 12, 16, 0.95)
    ),
    linear-gradient(140deg, #0d0e14, #141525 50%, #0b0c12);
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.contact-section.is-offscreen {
  visibility: hidden;
  opacity: 0;
}

.contact-bg {
  pointer-events: none;
}

.contact-bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.4;
}

.contact-overlay {
  position: absolute;
  inset: 0;
  background: var(--contact-overlay);
  mix-blend-mode: screen;
}

/* Split layout */
.contact-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
}

.contact-left {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

:global([data-theme="light"] .contact-left) {
  background-image: url("../assets/white-wall.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: left center;
}

.contact-left-content {
  max-width: 520px;
  padding: clamp(2rem, 4vw, 3.5rem);
  color: var(--contact-title-text);
  text-align: left;
}

.contact-right {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--contact-card-bg);
  border-left: 1px solid var(--contact-card-border);
  z-index: 1;
}

.contact-form-wrapper {
  width: 100%;
  max-width: 480px;
  padding: clamp(2rem, 4vw, 3.5rem);
}

.contact-success-wrapper {
  width: 100%;
  max-width: 480px;
  padding: clamp(2rem, 4vw, 3.5rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.contact-lottie {
  width: 320px;
  height: 320px;
  margin-bottom: 1.5rem;
}

.contact-success-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--contact-title-text);
  margin-bottom: 1rem;
  word-break: keep-all;
  overflow-wrap: normal;
}

.contact-success-message {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--contact-subtitle-text);
  max-width: 380px;
  word-break: keep-all;
  overflow-wrap: normal;
}

.ja-mobile-break {
  display: none;
}

.contact-title {
  font-size: clamp(2.5rem, 5vw, 5rem);
  letter-spacing: -0.02em;
  word-break: keep-all;
  overflow-wrap: normal;
  hyphens: none;
}

.contact-title--stacked {
  font-size: clamp(2.25rem, 4.2vw, 4.25rem);
}

.contact-title-text {
  color: var(--contact-title-text);
}

.contact-subtitle {
  font-size: clamp(1rem, 1.5vw, 1.25rem);
  line-height: 1.7;
  color: var(--contact-subtitle-text);
}

.contact-form-title {
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  color: var(--contact-title-text);
  margin-bottom: 1.5rem;
}

.contact-form {
  display: grid;
  gap: 1rem;
}

.contact-field {
  display: grid;
  gap: 0.5rem;
}

.contact-label {
  font-size: 0.9rem;
  color: var(--contact-subtitle-text);
}

.contact-input {
  width: 100%;
  border-radius: 12px;
  border: 1px solid var(--contact-input-border);
  background: var(--contact-input-bg);
  color: var(--contact-input-text);
  padding: 0.9rem 1rem;
  font-size: 0.95rem;
  outline: none;
}

.contact-input::placeholder {
  color: var(--contact-input-placeholder);
}

.contact-input:focus {
  border-color: var(--contact-input-focus);
  box-shadow: 0 0 0 3px rgba(186, 128, 255, 0.2);
}

.contact-input--error,
.contact-input--error:focus {
  border-color: #cc0c39;
  box-shadow: 0 0 0 2px rgba(204, 12, 57, 0.15);
}

.contact-error {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: #cc0c39;
  font-size: 0.88rem;
  line-height: 1.3;
}

.contact-error-icon {
  display: inline-grid;
  place-items: center;
  width: 1.1rem;
  height: 1.1rem;
  border-radius: 9999px;
  background: #cc0c39;
  color: #fff;
  font-size: 0.8rem;
  font-weight: 700;
  flex-shrink: 0;
}

.contact-warning {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: #8a6d1f;
  font-size: 0.88rem;
  line-height: 1.3;
  border: 1px solid #f2df9f;
  background: rgba(255, 245, 204, 0.5);
  border-radius: 8px;
  padding: 0.45rem 0.6rem;
}

.contact-warning-icon {
  display: inline-grid;
  place-items: center;
  width: 1.1rem;
  height: 1.1rem;
  border-radius: 9999px;
  background: #f6c343;
  color: #4f3b00;
  font-size: 0.8rem;
  font-weight: 700;
  flex-shrink: 0;
}

.contact-submit {
  height: 50px;
  margin: 5px;
  width: 120px;
  background: #333;
  justify-self: center;
  margin-top: 0.5rem;
  cursor: pointer;
  align-items: center;
  font-family: Consolas, "Courier New", monospace;
  border: solid #404c5d 1px;
  font-size: 16px;
  color: rgb(161, 161, 161);
  transition: 500ms;
  border-radius: 5px;
  background: linear-gradient(145deg, #2e2d2d, #212121);
  box-shadow: -1px -5px 15px #41465b, 5px 5px 15px #41465b,
    inset 5px 5px 10px #212121, inset -5px -5px 10px #212121;
  display: inline-flex;
  justify-content: center;
}

.contact-submit:hover {
  box-shadow: 1px 1px 13px #20232e, -1px -1px 13px #545b78;
  color: #d6d6d6;
  transition: 500ms;
}

.contact-submit:active {
  box-shadow: 1px 1px 13px #20232e, -1px -1px 33px #545b78;
  color: #d6d6d6;
  transition: 100ms;
}

.contact-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}

/* Light theme button styling */
:global([data-theme="light"] .contact-submit) {
  color: #1f2a37;
  border-color: rgba(31, 42, 55, 0.22);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(236, 242, 250, 0.92));
  box-shadow: -2px -2px 12px rgba(255, 255, 255, 0.85),
    3px 3px 12px rgba(24, 150, 158, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

:global([data-theme="light"] .contact-submit:hover) {
  color: #13202c;
  box-shadow: -1px -1px 8px rgba(255, 255, 255, 0.9),
    2px 2px 10px rgba(24, 150, 158, 0.22),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
}

:global([data-theme="light"] .contact-submit:active) {
  color: #0f172a;
  border-color: rgba(15, 23, 42, 0.35);
  background: linear-gradient(135deg, rgba(226, 244, 246, 0.95), rgba(210, 232, 236, 0.95));
  box-shadow: -1px -1px 6px rgba(255, 255, 255, 0.75),
    1px 1px 8px rgba(24, 150, 158, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.85),
    inset 2px 2px 6px rgba(12, 74, 110, 0.18);
}

/* Theme variables */
:global([data-theme="dark"]) {
  --contact-overlay: linear-gradient(
    140deg,
    rgba(18, 18, 24, 0.65),
    rgba(12, 12, 16, 0.85)
  );
  --contact-title-text: #f7f7fb;
  --contact-subtitle-text: #b9bbca;
  --contact-card-bg: linear-gradient(
    150deg,
    rgba(30, 31, 43, 0.96),
    rgba(20, 21, 32, 0.92)
  );
  --contact-card-border: rgba(255, 255, 255, 0.08);
  --contact-input-bg: rgba(36, 37, 48, 0.9);
  --contact-input-border: rgba(255, 255, 255, 0.08);
  --contact-input-text: #f7f7fb;
  --contact-input-placeholder: rgba(255, 255, 255, 0.35);
  --contact-input-focus: rgba(186, 128, 255, 0.8);
}

:global([data-theme="light"]) {
  --contact-overlay: linear-gradient(
    140deg,
    rgba(255, 255, 255, 0.6),
    rgba(220, 224, 235, 0.7)
  );
  --contact-title-text: #111827;
  --contact-subtitle-text: #4b5563;
  --contact-card-bg: linear-gradient(
    160deg,
    rgba(255, 255, 255, 0.96),
    rgba(236, 238, 245, 0.9)
  );
  --contact-card-border: rgba(15, 23, 42, 0.08);
  --contact-input-bg: rgba(255, 255, 255, 0.9);
  --contact-input-border: rgba(15, 23, 42, 0.12);
  --contact-input-text: #0f172a;
  --contact-input-placeholder: rgba(15, 23, 42, 0.4);
  --contact-input-focus: rgba(80, 70, 229, 0.5);
}

:root {
  --contact-overlay: linear-gradient(
    140deg,
    rgba(18, 18, 24, 0.65),
    rgba(12, 12, 16, 0.85)
  );
  --contact-title-text: #f7f7fb;
  --contact-subtitle-text: #b9bbca;
  --contact-card-bg: linear-gradient(
    150deg,
    rgba(30, 31, 43, 0.96),
    rgba(20, 21, 32, 0.92)
  );
  --contact-card-border: rgba(255, 255, 255, 0.08);
  --contact-input-bg: rgba(36, 37, 48, 0.9);
  --contact-input-border: rgba(255, 255, 255, 0.08);
  --contact-input-text: #f7f7fb;
  --contact-input-placeholder: rgba(255, 255, 255, 0.35);
  --contact-input-focus: rgba(186, 128, 255, 0.8);
}

/* Responsive */
@media (max-width: 768px) {
  .contact-wrapper {
    height: auto;
  }

  .contact-section {
    position: relative;
    min-height: 100vh;
  }

  .contact-split {
    grid-template-columns: 1fr;
  }

  .contact-left {
    padding: 2rem 1rem;
  }

  .contact-right {
    border-left: none;
    border-top: 1px solid var(--contact-card-border);
    padding: 2rem 1rem;
  }

  .contact-right.is-success {
    min-height: 60vh;
    display: grid;
    place-items: center;
    padding: 1.5rem 1rem 2rem;
  }

  .contact-success-wrapper {
    width: min(100%, 30rem);
    margin: 0 auto;
    padding: 0;
    display: grid;
    justify-items: center;
    align-content: center;
    gap: 0.75rem;
  }

  .contact-success-title,
  .contact-success-message {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
  }

  .contact-success-title {
    max-width: 22ch;
  }

  .contact-success-message {
    max-width: 36ch;
  }

  .contact-lottie {
    width: clamp(170px, 58vw, 260px);
    height: clamp(170px, 58vw, 260px);
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 0.5rem;
  }

  .contact-section:not(.is-ja) .contact-success-title {
    max-width: none;
    white-space: nowrap;
    font-size: clamp(1.05rem, 4.8vw, 1.5rem);
  }

  .contact-submit {
    justify-self: center;
  }

  .contact-section.is-ja .contact-left {
    padding: 1.5rem 1rem 1rem;
  }

  .contact-section.is-ja .contact-left-content {
    padding: 1.5rem 0.5rem 1rem;
  }

  .contact-section.is-ja .contact-right {
    padding: 1.5rem 1rem 2rem;
  }

  .contact-section.is-ja .contact-form-wrapper {
    padding: 1.5rem 0.5rem 2rem;
    margin: 0 auto;
  }

  .contact-section.is-ja .contact-success-wrapper {
    padding: 0;
    margin: 0 auto;
    justify-items: center;
    text-align: center;
  }

  .contact-section.is-ja .contact-success-title {
    font-size: clamp(1.05rem, 4.7vw, 1.35rem);
    line-height: 1.3;
    white-space: nowrap;
    width: fit-content;
    max-width: 100%;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
  }

  .contact-section.is-ja .contact-success-message {
    white-space: normal;
    word-break: keep-all;
    overflow-wrap: normal;
    width: fit-content;
    max-width: 100%;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
  }

  .contact-section.is-ja .ja-mobile-break {
    display: block;
  }

  .contact-section.is-ja .contact-title--stacked {
    font-size: clamp(2rem, 7.5vw, 3rem);
  }

  .contact-section.is-ja .contact-subtitle {
    font-size: 0.95rem;
  }
}
</style>
