import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import ForgotPassword from "./pages/forgetPassword";
import Dashboard from "./pages/admin/dashboard";
import ManageProjects from "./pages/admin/manageProjects";
import NewProject from "./pages/admin/newProject";
import Workers from "./pages/admin/workers";
import AssignedTasks from "./pages/worker/assignedTasks";
import Project from "./pages/admin/manageProjects/[id]";
import OTP from "./pages/otp";
import ProjectTasks from "./pages/admin/projectTasks";
import WorkerDetail from "./pages/worker/workerDetail";
import Password from "./pages/password";

import { LanguageProvider } from "./context/LanguageContext";
import WorkerDetail from "./pages/worker/workerDetail";
import { LanguageProvider } from './context/LanguageContext';

// import NewWorker from "./pages/admin/newWorker";
import NewTaskAssigned from "./pages/worker/newTaskAssigned";
import Auth from "./auth/authorize";
import Authenticate from "./auth/authenticate";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    // Function to display a notification

    const showOfflineNotification = () => {
      if (!navigator.onLine) {
        if ("Notification" in window) {
          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              new Notification("No Internet Connection", {
                body: "You are currently offline. Proceed as you do till connection restores, do not reload!",
                icon: "/offline.png",
              });
            }
          });
        } else {
          alert(
            "You are currently offline. Proceed as you do till connection restores, do not reload!"
          );
        }
      }
    };

    window.addEventListener("offline", showOfflineNotification);
    window.addEventListener("online", () => {
      if ("Notification" in window) {
        /*  Notification.close(); */
      }
    });

    return () => {
      window.removeEventListener("offline", showOfflineNotification);
      window.removeEventListener("online", () => {
        if ("Notification" in window) {
          /*  Notification.close(); */
        }
      });
    };
  }, []);

  useEffect(() => {
    const showOnlineNotification = () => {
      if (navigator.onLine) {
        if ("Notification" in window) {
          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              new Notification("Connection restored!", {
                body: "You are back online. Syncing in progress!",
                icon: "/online.png",
              });
            }
          });
        }
      }
    };

    window.addEventListener("online", showOnlineNotification);

    return () => {
      window.removeEventListener("online", showOnlineNotification);
    };
  }, []);

  return (
    <div className="App">
      <LanguageProvider>

        <Router>
          <Routes>
            <Route path="/" element={<Authenticate Component={Login} />} />
            <Route
              path="/forgotpassword"
              element={<Authenticate Component={ForgotPassword} />}
            />
            <Route
              path="/dashboard"
              element={<Auth Component={Dashboard} isAdminPath />}
            />
            <Route
              path="/manage-projects"
              element={<Auth Component={ManageProjects} isAdminPath />}
            />
            <Route
              path="/manage-projects/:id"
              element={<Auth Component={Project} isAdminPath />}
            />
            <Route
              path="/new-project"
              element={<Auth Component={NewProject} isAdminPath />}
            />
            <Route
              path="/workers"
              element={<Auth Component={Workers} isAdminPath />}
            />
            <Route path="/project-tasks" element={<ProjectTasks />} />
            <Route path="/worker-detail" element={<WorkerDetail />} />
            <Route path="/otp" element={<OTP />} />
            <Route
              path="/password"
              element={<Authenticate Component={Password} />}
            />
            <Route
              path="/assigned-tasks"
              element={<Auth Component={AssignedTasks} />}
            />
            <Route
              path="/new-task-assigned"
              element={<Auth Component={NewTaskAssigned} />}
            />
          </Routes>
        </Router>
=======
      <Router>
        <Routes>
          <Route path="/" element={<Authenticate Component={Login} />} />
          <Route
            path="/forgotpassword"
            element={<Authenticate Component={ForgotPassword} />}
          />
          <Route
            path="/dashboard"
            element={<Auth Component={Dashboard} isAdminPath />}
          />
          <Route
            path="/manage-projects"
            element={<Auth Component={ManageProjects} isAdminPath />}
          />
          <Route
            path="/manage-projects/:id"
            element={<Auth Component={Project} isAdminPath />}
          />
          <Route
            path="/new-project"
            element={<Auth Component={NewProject} isAdminPath />}
          />
          <Route
            path="/workers"
            element={<Auth Component={Workers} isAdminPath />}
          />
          <Route path="/otp" element={<OTP />} />
          <Route path="/project-tasks" element={<ProjectTasks/>} />
          <Route path="/worker-detail" element={<WorkerDetail/>}/>
          <Route
            path="/password"
            element={<Authenticate Component={Password} />}
          />
          <Route
            path="/assigned-tasks"
            element={<Auth Component={AssignedTasks} />}
          />
          <Route
            path="/new-task-assigned"
            element={<Auth Component={NewTaskAssigned} />}
          />
        </Routes>
      </Router>
      </LanguageProvider>
    </div>
  );
}

export default App;
