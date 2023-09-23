import React from 'react';
import { useLanguageSwitcher } from './useLanguageSwitcher'; // Import the custom hook

function LanguageSwitcher() {
  const { currentLanguage, changeLanguage } = useLanguageSwitcher();

  const handleLanguageChange = (language) => {
    changeLanguage(language);
  };

  return (
    <div className="absolute top-2 right-2 z-50">
  <div className="flex space-x-0  text-xs">
    <button
      onClick={() => handleLanguageChange('en')}
      disabled={currentLanguage === 'en'}
      className={`flex-1 ${
        currentLanguage === 'en'
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-[#2ce6bd] hover:bg-blue-600'
      } text-white font-bold py-2 px-4 rounded-l focus:outline-none focus:ring focus:ring-blue-300`}
    >
      EN
    </button>
    <button
      onClick={() => handleLanguageChange('he')}
      disabled={currentLanguage === 'he'}
      className={`flex-0.5 ${
        currentLanguage === 'he'
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-[#2ce6bd] hover:bg-green-600'
      } text-white font-bold py-2 px-4 rounded-r focus:outline-none focus:ring focus:ring-green-300`}
    >
      HE
    </button>
  </div>
</div>

  );
}

export default LanguageSwitcher;
