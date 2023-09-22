import { Link, NavLink, useNavigate } from "react-router-dom";
import { publicUrl } from "../utils";
import { logoutUser } from "../api";

function Sidebar({ isSidebarOpen, onSidebarClose }) {
  const navigate = useNavigate();
  const isAdmin = sessionStorage.getItem("Role") === "admin";

  const onLogout = () => {
    logoutUser().then(() => {
      ["accessToken", "Name", "Role"].map((key) => {
        sessionStorage.removeItem(key);
      });
      navigate("/", { replace: true });
    });
  };

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
      <Link to={isAdmin ? "/dashboard" : "/assigned-tasks"}>
        <img
          src={`${publicUrl}/images/logo1.png`}
          alt="logo"
          className="lg:w-20 lg:14 w-18 h-12"
        />
      </Link>

      <div className="mt-16 flex flex-col">
        {isAdmin && (
          <NavLink
          to={"/new-project"}
          className={
            "flex items-center gap-2 text-[#9DABA8] mb-6 lg:mb-12 hover:text-[#2ce6bd] focus:text-[#2ce6bd] active:text-[#2ce6bd]" 
          }
        
        >
          <span className="material-symbols-outlined text-2xl border-2 border-[#9DABA8] w-[28px] h-[28px] flex justify-center items-center rounded-full active:text-[#2ce6bd] focus:text-[#2ce6bd]">
            add
          </span>
          <span className="inline-block lg:hidden text-lg hover:text-[#2ce6bd] active:text-[#2ce6bd]">Create New</span>
        </NavLink>
        
        
        )}
        <NavLink
          to={isAdmin ? "/dashboard" : "/assigned-tasks"}
          className={"flex items-center gap-2 text-[#9DABA8] mb-6 active:text-[#2ce6bd] focus:text-[#2ce6bd]"}
        >
          <span className="material-symbols-outlined  text-2xl sm:text-3xl hover:text-[#2ce6bd] active:text-[#2ce6bd] focus:text-[#2ce6bd]">
            dashboard
          </span>
          <span className="inline-block lg:hidden text-lg hover:text-[#2ce6bd] active:text-[#2ce6bd]">Dashboard</span>
        </NavLink>
        <NavLink
          to={isAdmin ? "/manage-projects" : "/new-task-assigned"}
          className={"flex items-center gap-2 text-[#9DABA8] mb-6 active:text-[#2ce6bd] focus:text-[#2ce6bd]"}
        >
          <span className="material-symbols-outlined text-2xl sm:text-3xl hover:text-[#2ce6bd] active:text-[#2ce6bd]">
            work
          </span>
          <span className="inline-block lg:hidden text-lg hover:text-[#2ce6bd] active:text-[#2ce6bd]">Projects</span>
        </NavLink>
        {isAdmin && (
          <NavLink
            to={"/workers"}
            className={"flex items-center gap-2 text-[#9DABA8] mb-6 active:text-[#2ce6bd] focus:text-[#2ce6bd]"}
          >
            <span className="material-symbols-outlined text-2xl sm:text-3xl hover:text-[#2ce6bd] active:text-[#2ce6bd]">
              person_pin
            </span>
            <span className="inline-block lg:hidden text-lg hover:text-[#2ce6bd] active:text-[#2ce6bd]">Workers</span>
          </NavLink>
        )}
      </div>

      <div className="flex flex-col absolute bottom-0">
        <NavLink
          to={""}
          className={"flex items-center gap-2 text-[#9DABA8] mb-6 active:text-[#2ce6bd] focus:text-[#2ce6bd]"}
        >
          <span className="material-symbols-outlined text-2xl sm:text-3xl hover:text-[#2ce6bd] active:text-[#2ce6bd]">
            account_circle
          </span>
          <span className="inline-block lg:hidden text-lg hover:text-[#2ce6bd] active:text-[#2ce6bd]">Account</span>
        </NavLink>
        <button
          className={"flex items-center gap-2 text-[#9DABA8] mb-6 active:text-[#2ce6bd] focus:text-[#2ce6bd]"}
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
