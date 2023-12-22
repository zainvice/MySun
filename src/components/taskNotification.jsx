import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Notification = ({ messages }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(messages)

  const handleClose = (event) => {
     setNotifications([])
  };
  
  return (
    <div className="absolute w-[35%] lg:right-12 right-[22%] md:right=[30%] sm-right-15 top-4 lg:top-6 items-center text-left lg:text-center content-center">
       <span
        className={`material-symbols-outlined notification-icon cursor-pointer lg:text-right hover:text-[#34F5C5] hover:ease-in-out duration-300 focus:outline-none ${
          notifications && notifications.length > 0 ? 'has-notifications' : ''
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        notifications
        {notifications && notifications.length > 0 && <div className="red-dot absolute -top-4 text-red-500 text-[40px] font-bold">.</div>}
      </span>

      {isOpen && (
        <div className="absolute top-11 lg:w-[100%] w-[150%] z-10 h-60 overflow-y-auto bg-white border-2 border-gray-300 rounded">
            <h2 className="text-left text-sm font-bold text-gray-600 ml-4">Task Notifications</h2>
            <button
          onClick={handleClose}
          className="absolute hover:font-bold top-0 right-2 text-gray-400 hover:text-black hover:ease-in-out duration-300 focus:outline-none text-sm"
        >
          Clear All
        </button>
          {notifications? (
            <>
            {notifications?.map((message, index) => (
              <NotificationItem key={index} message={message} index={index} />
            ))}
            </>
          ):(
            <h2 className="text-sm font-bold text-gray-600 ml-4">No New Notifications</h2>
          )}
        </div>
      )}
    </div>
  );
};

const NotificationItem = ({ message, index }) => {
  const [showNotification, setShowNotification] = useState(true);

  const handleClose = (event) => {
    event.stopPropagation();
    setShowNotification(false);
  };

  return (
    showNotification && (
      <div
        className="p-4 text-gray-800 bg-white lg:left-[45%] sm:left-[0%] hover:bg-green-400 hover:ease-in-out duration-300 cursor-pointer md:left-[0%] lg:left-[0%] border-2 border-gray-400"
        style={{ top: `${5 + index * 10}rem`, right: '5rem', transition: '0.2s' }}
      >
        
        <NavLink to={`/task/${message.taskId}`}>
          
          <ul>
            <li className="mb-2 ">{message.message}</li>
          </ul>
        </NavLink>
      </div>
    )
  );
};

export default Notification;
