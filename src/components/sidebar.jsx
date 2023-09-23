import { Link, NavLink, useNavigate } from "react-router-dom";
import { publicUrl } from "../utils";
import { logoutUser } from "../api";

import { useLanguageSwitcher } from '../context/useLanguageSwitcher';

function Sidebar({ isSidebarOpen, onSidebarClose }) {
  const navigate = useNavigate();
  const isAdmin = sessionStorage.getItem("Role") === "admin";
  const isSupervisor = sessionStorage.getItem("Role") === "supervisor";

  const onLogout = () => {
    logoutUser().then(() => {
      ["accessToken", "Name", "Role"].map((key) => {
        sessionStorage.removeItem(key);
      });
      navigate("/", { replace: true });
    });
  };
  const { currentLanguage, changeLanguage } = useLanguageSwitcher();

  const handleLanguageChange = (language) => {
    changeLanguage(language);
  };

  const isActive = ({ isActive }) =>
    isActive
      ? "flex items-center gap-2 text-[#00FFD3] mb-6"
      : "flex items-center gap-2 text-[#9DABA8] mb-6";

  return (
    <div
      className={`w-64 lg:w-28 h-screen bg-[#2D3037] flex flex-col items-center justify-start px-4 py-4 z-[1000] lg:z-auto absolute lg:relative ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 transition-transform duration-500`}
    >
  <div className="lg:hidden absolute right-2 top-2">
  <button
    className="p-2 "
    onClick={onSidebarClose}
  >
    <span className="material-symbols-outlined text-[#9DABA8] ">close</span>
  </button>
</div>


      {/* Logo */}
      <Link to={isAdmin || isSupervisor ? "/dashboard" : "/assigned-tasks"}>
        <img
          src={`${publicUrl}/images/logo1.png`}
          alt="logo"
          className="lg:w-20 lg:14 w-18 h-12"
        />
      </Link>
      <div className=" mt-10 flex space-x-0  text-xs">
          <button
            onClick={() => handleLanguageChange('en')}
            disabled={currentLanguage === 'en'}
            className={`flex-1 ${
              currentLanguage === 'en'
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#2ce6bd] hover:bg-blue-600'
            } text-white font-bold py-2 px-4 rounded-l focus:outline-none focus:ring focus:ring-blue-300`}
          >
            EN
          </button>
          <button
            onClick={() => handleLanguageChange('he')}
            disabled={currentLanguage === 'he'}
            className={`flex-0.5 ${
              currentLanguage === 'he'
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#2ce6bd] hover:bg-green-600'
            } text-white font-bold py-2 px-4 rounded-r focus:outline-none focus:ring focus:ring-green-300`}
          >
            HE
          </button>
        </div>

      <div className="mt-16 flex flex-col">
        {isAdmin && (
          <NavLink
            to={"/new-project"}
            className={({ isActive }) =>
              isActive
                ? "text-[#00FFD3] flex items-center gap-2 mb-6 lg:mb-12 border-2 border-[#00FFD3] w-[28px] h-[28px] rounded-full"
                : "text-[#9DABA8] flex items-center gap-2 mb-6 lg:mb-12 border-2 border-[#9DABA8] w-[28px] h-[28px] rounded-full"
            }
          >
            <span className="material-symbols-outlined  text-2xl">add</span>
            <span className="inline-block lg:hidden text-lg">Create New</span>
          </NavLink>
        )}
        <NavLink
          to={isAdmin || isSupervisor ? "/dashboard" : "/assigned-tasks"}
          className={isActive}
        >
          <span className="material-symbols-outlined  text-2xl sm:text-3xl hover:text-[#2ce6bd] active:text-[#2ce6bd] focus:text-[#2ce6bd]">
            dashboard
          </span>
          <span className="inline-block lg:hidden text-lg hover:text-[#2ce6bd] active:text-[#2ce6bd]">Dashboard</span>
        </NavLink>
        <NavLink
          to={
            isAdmin || isSupervisor ? "/manage-projects" : "/new-task-assigned"
          }
          className={isActive}
        >
          <span className="material-symbols-outlined text-2xl sm:text-3xl hover:text-[#2ce6bd] active:text-[#2ce6bd]">
            work
          </span>
          <span className="inline-block lg:hidden text-lg hover:text-[#2ce6bd] active:text-[#2ce6bd]">Projects</span>
        </NavLink>
        {isAdmin && (
          <NavLink
            to={"/workers"}
            className={isActive}
          >
            <span className="material-symbols-outlined text-2xl sm:text-3xl hover:text-[#2ce6bd] active:text-[#2ce6bd]">
              person_pin
            </span>
            <span className="inline-block lg:hidden text-lg hover:text-[#2ce6bd] active:text-[#2ce6bd]">Workers</span>
          </NavLink>
        )}
      </div>
      

      <div className="flex flex-col absolute bottom-0">
        <p
          className={`relative flex items-center gap-2 text-[#9DABA8] mb-6 cursor-pointer hover:text-[#34F5C5]`}
        >
          <span className="material-symbols-outlined text-2xl sm:text-3xl peer">
            account_circle
          </span>
          <span className="inline-block lg:hidden text-lg">Account</span>
          <span className="z-[100000] hidden absolute -top-[70%] -left-[100%] px-1 rounded bg-[#34F5C5] w-24  h-6 text-ellipsis line-clamp-1 text-black peer-hover:block">
            {sessionStorage.getItem("Name").split(' ')[0]}
          </span>
        </p>
        <button
          className={"flex items-center gap-2 text-[#9DABA8] mb-6 hover:text-[#34F5C5]"}
          onClick={onLogout}
        >
          <span className="material-symbols-outlined text-2xl sm:text-3xl hover:text-[#2ce6bd] active:text-[#2ce6bd]">
            logout
          </span>
          <span className="inline-block lg:hidden text-lg hover:text-[#2ce6bd] active:text-[#2ce6bd]">Logout</span>
        </button>
        
        
      </div>
    </div>
  );
}

export default Sidebar;
