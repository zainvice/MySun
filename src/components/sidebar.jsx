import { Link, NavLink } from "react-router-dom";

function Sidebar({isSidebarOpen, onSidebarClose}) {
  return (
    <div className={`w-64 lg:w-28 h-screen bg-[#2D3037] flex flex-col items-center justify-start px-4 py-4 z-[1000] lg:z-auto absolute lg:relative ${isSidebarOpen ? 'translate-x-0': '-translate-x-full'} lg:translate-x-0 transition-transform duration-500`}>
      
      <div className="lg:hidden absolute right-2 top-2 ">
        <button className="p-2" onClick={onSidebarClose}>
          <span className="material-symbols-outlined text-[#9DABA8]">close</span>
        </button>
      </div>

      {/* Logo */}
      <Link to={"/dashboard"}>
        <img
          src={"./images/logo1.png"}
          alt="logo"
          className="lg:w-20 lg:14 w-18 h-12"
        />
      </Link>

      <div className="mt-16 flex flex-col">
        <NavLink
          to={"new-project"}
          className={"flex items-center gap-2 text-[#9DABA8] mb-6 lg:mb-12"}
        >
          <span className="material-symbols-outlined  text-2xl border-2 border-[#9DABA8] w-[28px] h-[28px] flex justify-center items-center rounded-full">add</span>
          <span className="inline-block lg:hidden text-lg">Create New</span>
        </NavLink>
        <NavLink
          to={"new-project"}
          className={"flex items-center gap-2 text-[#9DABA8] mb-6"}
        >
          <span className="material-symbols-outlined  text-2xl sm:text-3xl">dashboard</span>
          <span className="inline-block lg:hidden text-lg">Dashboard</span>
        </NavLink>
        <NavLink
          to={"new-project"}
          className={"flex items-center gap-2 text-[#9DABA8] mb-6"}
        >
          <span className="material-symbols-outlined text-2xl sm:text-3xl">work</span>
          <span className="inline-block lg:hidden text-lg">Projects</span>
        </NavLink>
        <NavLink
          to={"new-project"}
          className={"flex items-center gap-2 text-[#9DABA8] mb-6"}
        >
          <span className="material-symbols-outlined text-2xl sm:text-3xl">person_pin</span>
          <span className="inline-block lg:hidden text-lg">Workers</span>
        </NavLink>
      </div>

      <div className="flex flex-col absolute bottom-0">
        <NavLink
          to={"new-project"}
          className={"flex items-center gap-2 text-[#9DABA8] mb-6"}
        >
          <span className="material-symbols-outlined text-2xl sm:text-3xl">account_circle</span>
          <span className="inline-block lg:hidden text-lg">Account</span>
        </NavLink>
        <a className={"flex items-center gap-2 text-[#9DABA8] mb-6"}>
          <span className="material-symbols-outlined text-2xl sm:text-3xl">logout</span>
          <span className="inline-block lg:hidden text-lg">Logout</span>
        </a>
      </div>
    </div>
  );
}

export default Sidebar;
