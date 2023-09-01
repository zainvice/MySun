import React from "react";
import Logo from "../images/logo1.png";
import { Link, NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <div className="w-28 h-screen bg-[#2D3037] flex flex-col items-center justify-start px-4 py-4 relative">
      {/* Logo */}
      <Link to={"/dashboard"}>
        <img src={Logo} alt="logo" className="lg:w-20 lg:14 w-18 h-12" />
      </Link>

      <div className="mt-16 flex flex-col">
        <NavLink to={"new-project"}>
          <span className="material-symbols-outlined text-3xl text-[#9DABA8] mb-12">
            add_circle
          </span>
        </NavLink>
        <NavLink to={"new-project"}>
          <span className="material-symbols-outlined text-3xl text-[#9DABA8] mb-6">
            dashboard
          </span>
        </NavLink>
        <NavLink to={"new-project"}>
          <span className="material-symbols-outlined text-3xl text-[#9DABA8] mb-6">
            work
          </span>
        </NavLink>
        <NavLink to={"new-project"}>
          <span className="material-symbols-outlined text-3xl text-[#9DABA8] mb-6">
            person_pin
          </span>
        </NavLink>
      </div>

      <div className="flex flex-col absolute bottom-0">
      <NavLink to={"new-project"}>
          <span className="material-symbols-outlined text-3xl text-[#9DABA8] mb-6">
            account_circle
          </span>
        </NavLink>
        <a>
          <span className="material-symbols-outlined text-3xl text-[#9DABA8] mb-6">
            logout
          </span>
        </a>
      </div>
    </div>
  );
}

export default Sidebar;
