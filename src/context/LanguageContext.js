import React, { createContext, useContext, useState } from 'react';


const LanguageContext = createContext();


export function useLanguage() {
  return useContext(LanguageContext);
}


export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en'); // Default language is English

  const toggleLanguage = () => {
    
    setLanguage((prevLanguage) => (prevLanguage === 'en' ? 'he' : 'en'));
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
