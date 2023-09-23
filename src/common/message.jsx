import React from "react";

function Message({ heading, message, onClose }) {
  return (
    <div className="w-80 sm:w-[400px] min-h-[150px] p-4 bg-white rounded-2xl shadow-lg relative">
      <button
        className="bg-none border-none outline-none absolute top-2 right-4"
        onClick={onClose}
      >
        <span className="material-symbols-outlined">close</span>
      </button>
      <div className="text-center">
        <p className="font-semibold italic mb-4">{heading}</p>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default Message;
