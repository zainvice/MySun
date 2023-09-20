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
import Password from "./pages/password";
// import NewWorker from "./pages/admin/newWorker";
import NewTaskAssigned from "./pages/worker/newTaskAssigned";
import Auth from "./auth/authorize";
import Authenticate from "./auth/authenticate";

function App() {
  return (
    <div className="App">
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
    </div>
  );
}

export default App;
