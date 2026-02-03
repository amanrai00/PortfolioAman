import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import ja from './locales/ja.json'

const getInitialLocale = () => {
  // Check localStorage first (user's manual selection)
  const saved = localStorage.getItem('locale')
  if (saved) return saved

  // Detect browser/system language
  const browserLangs = navigator.languages || [navigator.language]
  for (const lang of browserLangs) {
    if (lang && lang.toLowerCase().startsWith('ja')) {
      return 'ja'
    }
  }

  return 'en'
}

const i18n = createI18n({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: 'en',
  messages: {
    en,
    ja
  }
})

export default i18n
