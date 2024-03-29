import React, { useState } from 'react';
import Modal from 'react-modal';
import Spinner from '../common/spinner';
import { useTranslation } from "react-i18next";
function ConfirmModal({ isOpen, onRequestClose, onDelete, deleting }) {
  const {t}= useTranslation()
  const onClose = () =>{
   
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
     
       {deleting?(
        <Spinner message={"Deleting Project Please hold!"}/>
       ):(
        <>
        <h2 className="text-2xl font-bold mb-4">{t("deleteProject.deleteProject")}</h2>
      <p className="text-gray-700 mb-4">{t("deleteProject.confirmation")}? </p>
     
      <button
        onClick={onDelete}
        className="w-full mt-2 py-2 hover:bg-red-600 text-white rounded hover:shadow-md bg-[#34F5C5] hover:text-white transition duration-300 ease-in-out"
      >
        {t("deleteProject.deleteProject")}
      </button>
      <button
        onClick={onClose}
        className="w-full mt-2 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 hover:shadow-md hover:text-white transition duration-300 ease-in-out"
      >
       {t("deleteProject.cancel")}
      </button>
        </>
       )}
    

     
    </Modal>
  );
}

export default ConfirmModal;
