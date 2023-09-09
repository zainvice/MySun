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

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/manage-projects" element={<ManageProjects />} />
          <Route path="/manage-projects/:id" element={<Project />} />
          <Route path="/new-project" element={<NewProject />} />
          <Route path="/workers" element={<Workers />} />
          <Route path="/otp" element={<OTP />} />
          <Route path="/password" element={<Password />} />
          <Route path="/assigned-tasks" element={<AssignedTasks />} />
          <Route path="/new-task-assigned" element={<NewTaskAssigned/>} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
