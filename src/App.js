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
import { useEffect } from "react";

function App() {
  useEffect(() => {
    // Function to display a notification

    const showOfflineNotification = () => {
      if (!navigator.onLine) {
        // Check if the browser supports notifications
        if ('Notification' in window) {
          // Request permission to show notifications (required in modern browsers)
          Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
              // Create and display the notification
              new Notification('No Internet Connection', {
                body: 'You are currently offline. Proceed as you do till connection restores, do not reload!',
                icon: '/offline.png', // Replace with your own icon path
              });
            }
          });
        } else {
          // Fallback for browsers that don't support notifications
          alert('You are currently offline. Proceed as you do till connection restores, do not reload!');
        }
      }
    };

    // Add an event listener to detect online/offline status changes
    window.addEventListener('offline', showOfflineNotification);
    window.addEventListener('online', () => {
      // When the connection is restored, close any existing notifications
      if ('Notification' in window) {
       /*  Notification.close(); */
      }
    });

    // Clean up event listeners when the component unmounts
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
      // Function to display a notification when online
      const showOnlineNotification = () => {
        if (navigator.onLine) {
          // Check if the browser supports notifications
          if ('Notification' in window) {
            // Request permission to show notifications (required in modern browsers)
            Notification.requestPermission().then((permission) => {
              if (permission === 'granted') {
                // Create and display the online notification
                new Notification('Connection restored!', {
                  body: 'You are back online. Syncing in progress!',
                  icon: '/online.png', // Replace with your own icon path
                });
              }
            });
          }
        }
      };
  
      // Add an event listener to detect online/offline status changes
      window.addEventListener('online', showOnlineNotification);
  
      // Clean up event listeners when the component unmounts
      return () => {
        window.removeEventListener('online', showOnlineNotification);
      };
    }, []);
  
    
  

  
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
