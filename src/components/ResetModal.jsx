import React, { useState } from 'react';
import Modal from 'react-modal';
import { useTranslation } from "react-i18next";

function ResetModal({ isOpen, onRequestClose, onPartialReset, onFullReset }) {
  const [resetExcel, setExcel] = useState(false)
  const [resetAll, setAll] = useState(false)
  const {t}= useTranslation()

  const resetExcelClicked = () =>{
    setExcel(true)
  }
  const resetAllClicked = () =>{
    setAll(true)
  }
  const onClose = () =>{
    setExcel(false);
    setAll(false);
    onRequestClose()
  }
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Reset Modal"
      className="w-64 m-auto p-4 bg-white rounded-lg shadow-lg"
      overlayClassName="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50"
    >
      {!resetAll && !resetExcel ? (
        <>
        <h2 className="text-2xl font-bold mb-4">{t("resetTaskOptions.resetOptions")}</h2>
      <p className="text-gray-700 mb-4">{t("resetTaskOptions.chooseOptionForReset")}:</p>
      <button
        onClick={resetExcelClicked}
        className="w-full py-2 bg-[#34F5C5] text-white rounded hover:shadow-md hover:bg-white hover:text-[#34F5C5] transition duration-300 ease-in-out"
      >
        {t("resetTaskOptions.resetExcelData")}
      </button>
      <button
        onClick={resetAllClicked}
        className="w-full mt-2 py-2 bg-[#34F5C5] text-white rounded hover:shadow-md hover:bg-white hover:text-[#34F5C5] transition duration-300 ease-in-out"
      >
        
        {t("resetTaskOptions.resetAllFeatures")}
      </button>
      <button
        onClick={onClose}
        className="w-full mt-2 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 hover:shadow-md hover:text-white transition duration-300 ease-in-out"
      >
        
        {t("resetTaskOptions.cancel")}
      </button>
        </>
      ):(<></>)

      }  
      {resetExcel?(
        <>
        <h2 className="text-2xl font-bold mb-4">
        {t("resetTaskOptions.resetOptions")}</h2>
      <p className="text-gray-700 mb-4">
        {t("resetTaskOptions.confirmation")}</p>
      <button
        onClick={onPartialReset}
        className="w-full py-2 bg-[#34F5C5] text-white rounded hover:shadow-md hover:bg-white hover:text-[#34F5C5] transition duration-300 ease-in-out"
      >
         {t("resetTaskOptions.confirm")}
      </button>
      
      <button
        onClick={onClose}
        className="w-full mt-2 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 hover:shadow-md hover:text-white transition duration-300 ease-in-out"
      >
         {t("resetTaskOptions.cancel")}
      </button>
        </>
      ):(
        <></>
      )
      }
      {resetAll?(
        <>
        <h2 className="text-2xl font-bold mb-4"> {t("resetTaskOptions.resetOptions")}</h2>
      <p className="text-gray-700 mb-4"> {t("resetTaskOptions.resetEverythingConfirmation")}</p>
      <button
        onClick={onFullReset}
        className="w-full py-2 bg-[#34F5C5] text-white rounded hover:shadow-md hover:bg-white hover:text-[#34F5C5] transition duration-300 ease-in-out"
      >
         {t("resetTaskOptions.confirm")}
      </button>
      
      <button
        onClick={onClose}
        className="w-full mt-2 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 hover:shadow-md hover:text-white transition duration-300 ease-in-out"
      >
         {t("resetTaskOptions.cancel")}
      </button>
        </>
      ):(
        <></>
      )
      }
    </Modal>
  );
}

export default ResetModal;
