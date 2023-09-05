import React from "react";

function Modal({ children, isOpen, onClose }) {
  // document.body.style.overflow = 'hidden'
  return (
    <>
      {isOpen && (
        <div className="w-screen h-screen absolute top-0 left-0 z-[998] flex items-center justify-center">
          <div
            className="absolute top-0 left-0 w-full h-full bg-gray-950 opacity-40"
            onClick={onClose}
          />
          <div className="z-[1000]">{children}</div>
        </div>
      )}
    </>
  );
}

export default Modal;
