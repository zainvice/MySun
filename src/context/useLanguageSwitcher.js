import { useState } from 'react';
import i18n from './i18n';

export function useLanguageSwitcher() {
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    setCurrentLanguage(language);
  };

  return { currentLanguage, changeLanguage };
}