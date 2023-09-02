import React from "react";

function Header({onSidebarOpen}) {
  return (
    <div className="flex items-center w-full shadow-md p-2 sm:p-5">
      <div className="lg:hidden">
        <button className="p-2" onClick={onSidebarOpen}>
          <span className="material-symbols-outlined text-[#505050]">menu</span>
        </button>
      </div>
      <div className="flex items-center justify-end sm:justify-between flex-1">
        <div className="hidden sm:block">
          <p className="flex items-center gap-2 text-[#505050] font-semibold">
            <span className="material-symbols-outlined">dashboard</span>
            Dashboard
          </p>
        </div>
        <div>
          <h1 className="font-bold sm:text-lg">
            Welcome,{" "}
            <span className="text-[#00C191] font-medium">Muhammad!</span>
          </h1>
        </div>
      </div>
    </div>
  );
}

export default Header;
