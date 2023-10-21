import { useState } from "react";
import Sidebar from "../components/sidebar";
import Header from "../components/header";

function Layout({ children, activePageName, notifications }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  return (
    <div className="flex">
      <Sidebar isSidebarOpen={isSidebarOpen} onSidebarClose={toggleSidebar} />
      <div className="flex-1 w-screen lg:w-[calc(100vw-112px)]">
        <Header onSidebarOpen={toggleSidebar} activePageName={activePageName} notifications={notifications}/>
        {children}
      </div>
    </div>
  );
}

export default Layout;
