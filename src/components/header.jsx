import React from "react";
import { useTranslation } from 'react-i18next';

function Header({ onSidebarOpen, activePageName }) {
  const { t } = useTranslation();
  const username = sessionStorage.getItem("Name");
  return (
    <div className="flex items-center w-full shadow-md p-2 sm:p-5">
      <div className="lg:hidden">
        <button className="p-2 flex items-center" onClick={onSidebarOpen}>
          <span className="material-symbols-outlined text-[#505050]">menu</span>
        </button>
      </div>
      <div className="flex items-center justify-end sm:justify-between flex-1">
        <div className="hidden sm:block">
          <p className="flex items-center gap-2 text-[#505050] font-semibold">
            {activePageName}
          </p>
        </div>
        <div>
          <h1 className="font-bold sm:text-lg">
           {t('greeting')},{" "}
            <span className="text-[#00C191] font-medium">{username}</span>
          </h1>
        </div>
      </div>
    </div>
  );
}

export default Header;
