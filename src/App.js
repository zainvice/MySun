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
import { I18nextProvider } from "react-i18next";
import i18n from "./context/i18n";
import PersistLogin from './features/auth/PresistLogin'
import RequireAuth from './features/auth/RequireAuth'
import { ROLES } from './config/roles'
import { LanguageProvider } from "./context/LanguageContext";

// import NewWorker from "./pages/admin/newWorker";
import NewTaskAssigned from "./pages/worker/newTaskAssigned";
import Auth from "./auth/authorize";
import Authenticate from "./auth/authenticate";
import { useEffect } from "react";
import { ProjectsProvider } from "./context/projectsContext";

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
      <I18nextProvider i18n={i18n}>
        <ProjectsProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/forgotpassword"
                element={<ForgotPassword/>}
              />
              <Route element={<PersistLogin/>}>
                <Route element= {<RequireAuth allowedRoles={[ROLES.Admin, ROLES.Supervisor]}/>}>
                         <Route
                         path="/dashboard"
                         element={
                           <Dashboard/>
                         }
                       />
                       <Route
                         path="/manage-projects"
                         element={
                           <ManageProjects
                           />
                         }
                       />
                       <Route
                         path="/manage-projects/:id"
                         element={<Project/>}
                       />
                       <Route
                         path="/manage-projects/:id/tasks"
                         element={<ProjectTasks />}
                       />
                       <Route
                         path="/new-project"
                         element={<NewProject/>}
                       />
                       <Route
                         path="/workers"
                         element={<Auth Component={Workers} isAdminPath />}
                       />
                       <Route path="/otp" element={<OTP />} />
                       <Route path="/worker-detail/:id" element={<WorkerDetail />} />
                </Route>

              </Route>
              <Route
                path="/resetPassword/:resetToken/:userId"
                element={<Password/>}
              />
              <Route
                path="/resetPassword/:email"
                element={<Password/>}
              />
              <Route element={<PersistLogin/>}>
                <Route element= {<RequireAuth allowedRoles={[ROLES.Worker, ROLES.Supervisor]}/>}>
                
              <Route
                path="/assigned-tasks"
                element={<AssignedTasks/>}
              />
              <Route
                path="/task/:id"
                element={<NewTaskAssigned/>}
              />
                  </Route>
                  
              </Route>
              
            </Routes>
          </Router>
        </ProjectsProvider>
      </I18nextProvider>
    </div>
  );
}

export default App;
