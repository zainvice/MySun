import i18n from 'i18next';

import enTranslation from './locales/en.json'; // Import English translations
import heTranslation from './locales/he.json'; // Import Hebrew translations

i18n
  .init({
    resources: {
      en: { translation: enTranslation },
      he: { translation: heTranslation },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
