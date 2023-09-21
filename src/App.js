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
import Password from "./pages/password";
import { LanguageProvider } from './context/LanguageContext';
// import NewWorker from "./pages/admin/newWorker";
import NewTaskAssigned from "./pages/worker/newTaskAssigned";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    // Function to display a notification

    const showOfflineNotification = () => {
      if (!navigator.onLine) {
        
        if ('Notification' in window) {
         
          Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
              
              new Notification('No Internet Connection', {
                body: 'You are currently offline. Proceed as you do till connection restores, do not reload!',
                icon: '/offline.png',
              });
            }
          });
        } else {
          
          alert('You are currently offline. Proceed as you do till connection restores, do not reload!');
        }
      }
    };

   
    window.addEventListener('offline', showOfflineNotification);
    window.addEventListener('online', () => {
     
      if ('Notification' in window) {
       /*  Notification.close(); */
      }
    });

    
    return () => {
      window.removeEventListener('offline', showOfflineNotification);
      window.removeEventListener('online', () => {
        if ('Notification' in window) {
         /*  Notification.close(); */
        }
      });
    };
  }, []);


    useEffect(() => {
     
      const showOnlineNotification = () => {
        if (navigator.onLine) {
        
          if ('Notification' in window) {
            
            Notification.requestPermission().then((permission) => {
              if (permission === 'granted') {
                
                new Notification('Connection restored!', {
                  body: 'You are back online. Syncing in progress!',
                  icon: '/online.png', 
                });
              }
            });
          }
        }
      };
  
      
      window.addEventListener('online', showOnlineNotification);
  
     
      return () => {
        window.removeEventListener('online', showOnlineNotification);
      };
    }, []);
  
    
  

  
  return (
    <div className="App">
      <LanguageProvider>
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
          <Route path="/project-tasks" element={<ProjectTasks/>} />
          <Route path="/password" element={<Password />} />
          <Route path="/assigned-tasks" element={<AssignedTasks />} />
          <Route path="/new-task-assigned" element={<NewTaskAssigned/>} />

        </Routes>
      </Router>
      </LanguageProvider>
    </div>
  );
}

export default App;
