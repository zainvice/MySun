import React from "react";
import { useLanguageSwitcher } from "./useLanguageSwitcher"; // Import the custom hook

function LanguageSwitcher() {
  const { currentLanguage, changeLanguage } = useLanguageSwitcher();

  const handleLanguageChange = (language) => {
    changeLanguage(language);
  };

  return (
    <div className="absolute top-2 right-2 z-50">
      <div className="flex space-x-0  text-xs">
        <button
          onClick={() => handleLanguageChange("en")}
          disabled={currentLanguage === "en"}
          className={`flex-1 ${
            currentLanguage === "en"
              ? "bg-[#2ce6bd]"
              : "bg-gray-400 cursor-pointer"
          } text-white font-bold py-[6px] px-4 rounded-l focus:outline-none focus:ring focus:ring-blue-300`}
        >
          EN
        </button>
        <button
          onClick={() => handleLanguageChange("he")}
          disabled={currentLanguage === "he"}
          className={`flex-0.5 ${
            currentLanguage === "he"
              ? "bg-[#2ce6bd]"
              : "bg-gray-400 cursor-pointer"
          } text-white font-bold py-[6px] px-4 rounded-r focus:outline-none focus:ring focus:ring-green-300`}
        >
          HE
        </button>
      </div>
    </div>
  );
}

export default LanguageSwitcher;
