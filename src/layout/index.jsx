import { useState } from "react";
import Sidebar from "../components/sidebar";
import Header from "../components/header";

function Layout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  return (
    <div className="flex">
      <Sidebar isSidebarOpen={isSidebarOpen} onSidebarClose={toggleSidebar} />
      <div className="flex-1">
        <Header onSidebarOpen={toggleSidebar} />
        <div className="h-[calc(100vh-62px)] md:h-[calc(100vh-86px)] sm:h-[calc(100vh-68px)] overflow-auto p-2 sm:p-5">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;
