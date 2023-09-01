import React from "react";

function Header() {
  return (
    <div className="flex items-center justify-between w-full shadow-md p-5">
      <div>
        <p className="flex items-center gap-2 text-[#505050]">
          <span className="material-symbols-outlined">dashboard</span>
          Dashboard
        </p>
      </div>
      <div>
        <h1 className="font-bold text-lg">
          Welcome, <span className="text-[#00C191] font-medium">Muhammad!</span>
        </h1>
      </div>
    </div>
  );
}

export default Header;
