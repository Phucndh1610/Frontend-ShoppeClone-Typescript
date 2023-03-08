import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import { ProjectLanguage } from '@Locales/index'

// eslint-disable-next-line import/no-named-as-default-member
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: ProjectLanguage,
    fallbackLng: 'vi',
    debug: false,
    interpolation: {
      escapeValue: false
    }
  })

export default i18n
