import React, { useState, useEffect } from "react";
import Container from "../../common/container";
import Layout from "../../layout";
import Button from "../../common/button";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { getTasks } from "../../api";
import Spinner from "../../common/spinner";
import useAuth from "../../hooks/useAuth";
import { editTasks } from "../../api";


function NewTaskAssigned() {
  const {t}= useTranslation()
  const [inputValues, setInputValues] = useState({});
  const onChange = (event) => {
    const target = event.target ?? {};
    setInputValues((prev) => ({ ...prev, [target.name]: target.value }));
  };
  const [timerRunning, setTimerRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [offlineTasks, setOfflineTasks] = useState([]);
  const {id} = useParams()
  const [tasktoDisplay, setTasktoDisplay]= useState()
  const [isloading, setloading] = useState(true);
  const [timeTaken, setTimeTaken] = useState(0);
  const {role}= useAuth()
  useEffect(() => {
    async function fetchData() {
      let filteredTasks;
      try {
        console.log(id, "I'm here");
        console.log("getting response");
        const response = await getTasks();
        const tasks = response;
        console.log(response);
        if (tasks?.length > 0) {
          console.log("TASKS from above", tasks);
          filteredTasks = tasks?.filter((task) => task?._id === id);
          console.log("Filtered Tasks", filteredTasks[0]);
          setStatus(filteredTasks[0].status)
          localStorage.setItem("taskNo", JSON.stringify(filteredTasks));
  
          return filteredTasks; // Return filteredTasks here
        }
      } catch (error) {
        localStorage.removeItem("tasks");
        console.error("Error fetching tasks:", error);
      } finally {
        setloading(false);
      }
    }
  
    async function setTaskToDisplay() {
      const filteredTasks = await fetchData();
      console.log("TASK now", filteredTasks[0]);
      setTasktoDisplay(filteredTasks[0]);
      console.log("", tasktoDisplay)
    }
    if(!tasktoDisplay)
      setTaskToDisplay(); // Call the function to set tasktoDisplay
  }, [id, tasktoDisplay]);
  
  useEffect(() => {
    // Check if the app is online
    if (navigator.onLine) {
      // Try to send offline tasks to the database
      sendOfflineTasksToDatabase();
    }
  }, [navigator.onLine]);

  const addToOfflineTasks = () => {
    const taskData = {_id: tasktoDisplay._id, taskData: inputValues, timeTaken: timeTaken, status: status}
    const updatedTasks = [...offlineTasks, taskData ];
    setOfflineTasks(updatedTasks);
    localStorage.setItem("offlineTasks", JSON.stringify(updatedTasks));
    console.log("OFFLINE TASK SAVED!", offlineTasks)
  };

  const sendOfflineTasksToDatabase = async() => {
    const tasks = JSON.parse(localStorage.getItem("offlineTasks"));

    if (tasks && tasks.length > 0) {
      for(let task of tasks){
        console.log(task)
        await editTasks({
          task
        })
         localStorage.removeItem("offlineTasks")
          .catch((error) => {
            const data = error?.response?.data;
           
          })
      }
    }
  };

  useEffect(() => {
    let interval;

    if (timerRunning) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
      setTimeTaken((prevTimeTaken) => prevTimeTaken + seconds);
    } else {
      clearInterval(interval);
      setTimeTaken((prevTimeTaken) => prevTimeTaken + seconds);
    }

    return () => clearInterval(interval);
  }, [timerRunning]);

  const[isPlaying, setPlaying]= useState(false)
  const handleStartClick = () => {
    setTimerRunning(true);
    setPlaying(true)
  };

  const handleStopClick = () => {
    setTimerRunning(false);
    setPlaying(false)
  };

  // Calculate hours, minutes, and seconds
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const [status, setStatus] = useState(tasktoDisplay?.status); // Initialize the status state variable
  console.log("TASK STATUS", status)
  const handleStatusChange = (event) => {
    setStatus(event.target.value); // Update the status state with the selected value
  };


  

  return (
    <Layout activePageName={tasktoDisplay?.projectId?.projectName}>
      <Container>
        {isloading?(
          <Spinner/>
        ):(
          <>
          <div className="grid grid-cols-3 items-center m-4">
          <span>
            <img
              src="/images/taskIcon-lg.png"
              alt="taskIcon"
              className="w-10 h-10 sm:w-14 sm:h-14"
            />
            <label className="text-lg sm:text-xl font-bold">Task from {tasktoDisplay?.projectId?.projectName} </label>
          </span>

          <div className="flex items-center mx-auto">
          {isPlaying ? (
        <button
          onClick={handleStopClick}
          className="hover:bg-red-200 hover:text-red-800 p-2 rounded-full transition duration-300 ease-in-out"
        >
          <span className="material-symbols-outlined text-red-600 text-4xl">
            stop_circle
          </span>
        </button>
      ) : (
        <button
          onClick={handleStartClick}
          className="hover:bg-green-200  p-2 rounded-full transition duration-300 ease-in-out"
        >
          <span className="material-symbols-outlined text-[#34F5C5] text-4xl hover:text-green-600">
            play_circle
          </span>
        </button>
      )}
          </div>

          <div className=" flex justify-end items-center">
            <span className="material-symbols-outlined text-[#34F5C5] text-4xl hidden sm:inline">
              schedule
            </span>
            <div className="ml-1">
              <span className="text-[#34F5C5] font-bold text-xl">
                {hours.toString().padStart(2, "0")}:
              </span>
              <span className="text-blue-400 font-bold text-xl">
                {minutes.toString().padStart(2, "0")}:
              </span>
              <span className="text-green-500 font-bold text-xl">
                {remainingSeconds.toString().padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
        <div className="text-white grid grid-cols-1 sm:grid-cols-2  md:grid-cols-3 gap-4">
          {/* These inputs will be dynamic if they are already existing then user input will be disabled  */}
          <input
            type="text"
            value={
              tasktoDisplay?.worker?.fullName || t("newTaskAssigned.workerName")
            }
            disabled
            className="rounded-full bg-gray-200 text-black px-4 h-12 w-full"
            onChange={onChange}
            name="worker.fullName"
          />           
          <input
            type="text"
            name="buildingNumber"
            value={
              tasktoDisplay?.taskData?.buildingNumber
                ? tasktoDisplay?.taskData?.buildingNumber
                : ""
            }
            placeholder={
              !tasktoDisplay?.taskData?.buildingNumber
                ? t("newTaskAssigned.buildingNumber")
                : ""
            }
            disabled={!!tasktoDisplay?.taskData?.buildingNumber} // Set disabled if buildingNumber exists
            className="rounded-full bg-gray-200 text-black px-4 h-12 w-full"
            onChange={onChange}
          />
          

          <input
          type="text"
          name="address"
          placeholder={
            tasktoDisplay?.taskData?.address || t("newTaskAssigned.address")
          }
          /* value={tasktoDisplay?.taskData?.address || ""}
          disabled={!!tasktoDisplay?.taskData?.address} */
          className="rounded-full bg-gray-200 text-black px-4 h-12 w-full"
          onChange={onChange}
        />
        
        <input
          type="text"
          name="physicalNumber"
          placeholder={
            tasktoDisplay?.taskData?.physicalNumber || t("newTaskAssigned.physicalNumber")
          }
          //value={tasktoDisplay?.taskData?.physicalNumber || ""}
          //disabled={!!tasktoDisplay?.taskData?.physicalNumber}
          className="rounded-full bg-gray-200 text-black px-4 h-12 w-full"
          onChange={onChange}
        />
        
        <input
          type="text"
          name="ownerID"
          placeholder={
            tasktoDisplay?.taskData?.ownerID || t("newTaskAssigned.ownerID")
          }
          //value={tasktoDisplay?.taskData?.ownerID || ""}
          //disabled={!!tasktoDisplay?.taskData?.ownerID}
          className="rounded-full bg-gray-200 text-black px-4 h-12 w-full"
          onChange={onChange}
        />
        
        <input
          type="text"
          name="ownerName"
          placeholder={
            tasktoDisplay?.taskData?.ownerName || t("newTaskAssigned.ownerName")
          }
          //value={tasktoDisplay?.taskData?.ownerName || ""}
          //disabled={!!tasktoDisplay?.taskData?.ownerName}
          className="rounded-full bg-gray-200 text-black px-4 h-12 w-full"
          onChange={onChange}
        />
        
        <input
          type="text"
          name="phoneNumber"
          placeholder={
            tasktoDisplay?.taskData?.phoneNumber || t("newTaskAssigned.phoneNumber")
          }
          //value={tasktoDisplay?.taskData?.phoneNumber || ""}
          //disabled={!!tasktoDisplay?.taskData?.phoneNumber}
          className="rounded-full bg-gray-200 text-black px-4 h-12 w-full"
          onChange={onChange}
        />
        
        <input
          type="text"
          name="oldArea"
          placeholder={
            tasktoDisplay?.taskData?.oldArea || t("newTaskAssigned.oldArea")
          }
          //value={tasktoDisplay?.taskData?.oldArea || ""}
          //disabled={!!tasktoDisplay?.taskData?.oldArea}
          className="rounded-full bg-gray-200 text-black px-4 h-12 w-full"
          onChange={onChange}
        />
        
        <input
          type="text"
          name="propertyType"
          placeholder={
            tasktoDisplay?.taskData?.propertyType || t("newTaskAssigned.propertyType")
          }
          //value={tasktoDisplay?.taskData?.propertyType || ""}
          //disabled={!!tasktoDisplay?.taskData?.propertyType}
          className="rounded-full bg-gray-200 text-black px-4 h-12 w-full"
          onChange={onChange}
        />
        
        <input
          type="text"
          name="GOSH"
          placeholder={
            tasktoDisplay?.taskData?.GOSH || t("newTaskAssigned.GOSH")
          }
          //value={tasktoDisplay?.taskData?.GOSH || ""}
          //disabled={!!tasktoDisplay?.taskData?.GOSH}
          className="rounded-full bg-gray-200 text-black px-4 h-12 w-full"
          onChange={onChange}
        />
        
        <input
          type="text"
          name="HELMA"
          placeholder={
            tasktoDisplay?.taskData?.HELMA || t("newTaskAssigned.HELMA")
          }
          //value={tasktoDisplay?.taskData?.HELMA || ""}
          //disabled={!!tasktoDisplay?.taskData?.HELMA}
          className="rounded-full bg-gray-200 text-black px-4 h-12 w-full"
          onChange={onChange}
        />
        
        <input
          type="text"
          name="floor"
          placeholder={
            tasktoDisplay?.taskData?.floor || t("newTaskAssigned.floor")
          }
          //value={tasktoDisplay?.taskData?.floor || ""}
          //disabled={!!tasktoDisplay?.taskData?.floor}
          className="rounded-full bg-gray-200 text-black px-4 h-12 w-full"
          onChange={onChange}
        />


        </div>
        <p className="m-3 font-bold">Status</p>
        <div className="mt-0 sm:mt-8 mx-2 grid grid-cols-2  md:grid-cols-3 lg:grid-cols-4 justify-center items-center">
        
         {/* Radio button for "Coordination Letter" */}
        <label className="inline-flex items-center mb-2 sm:mb-5">
          <input
            name="status"
            type="radio"
            className="hidden peer"
            value="Coordination Letter"
            onChange={handleStatusChange} // Add onChange handler
            checked={status === "Coordination Letter"} // Check if this radio button is selected
          />
          <span className="w-5 h-5 border rounded-full border-gray-800 mr-1 peer-checked:bg-gray-800 flex justify-center items-center">
            <span className="material-symbols-outlined text-sm font-bold text-white peer-checked:inline-block">
              done
            </span>
          </span>
          <span className="text-gray-700 text-base sm:text-lg">
            Coordination Letter 
          </span>
        </label>

        {/* Radio button for "Refused Survey" */}
        <label className="inline-flex items-center mb-2 sm:mb-5">
          <input
            name="status"
            type="radio"
            className="hidden peer"
            value="Refused Survey"
            onChange={handleStatusChange} // Add onChange handler
            checked={status === "Refused Survey"} // Check if this radio button is selected
          />
          <span className="w-5 h-5 border rounded-full border-gray-800 mr-1 peer-checked:bg-gray-800 flex justify-center items-center">
            <span className="material-symbols-outlined text-sm font-bold text-white peer-checked:inline-block">
              done
            </span>
          </span>
          <span className="text-gray-700 text-base sm:text-lg">
            Refused Survey
          </span>
        </label>

        {/* Repeat similar code for other radio buttons */}
        
         {/* Radio button for "Aerial Mapping" */}
          <label className="inline-flex items-center mb-2 sm:mb-5">
          <input
            name="status"
            type="radio"
            className="hidden peer"
            value="Aerial Mapping"
            onChange={handleStatusChange} // Add onChange handler
            checked={status === "Aerial Mapping"} // Check if this radio button is selected
          />
          <span className="w-5 h-5 border rounded-full border-gray-800 mr-1 peer-checked:bg-gray-800 flex justify-center items-center">
            <span className="material-symbols-outlined text-sm font-bold text-white peer-checked:inline-block">
              done
            </span>
          </span>
          <span className="text-gray-700 text-base sm:text-lg">
            Aerial Mapping
          </span>
          </label>
          {/* Radio button for "Missing Information" */}
<label className="inline-flex items-center mb-2 sm:mb-5">
  <input
    name="status"
    type="radio"
    className="hidden peer"
    value="Missing Information"
    onChange={handleStatusChange} // Add onChange handler
    checked={status === "Missing Information"} // Check if this radio button is selected
  />
  <span className="w-5 h-5 border rounded-full border-gray-800 mr-1 peer-checked:bg-gray-800 flex justify-center items-center">
    <span className="material-symbols-outlined text-sm font-bold text-white peer-checked:inline-block">
      done
    </span>
  </span>
  <span className="text-gray-700 text-base sm:text-lg">
    Missing Information
  </span>
</label>

{/* Radio button for "Unite Address" */}
<label className="inline-flex items-center mb-2 sm:mb-5">
  <input
    name="status"
    type="radio"
    className="hidden peer"
    value="Unite Address"
    onChange={handleStatusChange} // Add onChange handler
    checked={status === "Unite Address"} // Check if this radio button is selected
  />
  <span className="w-5 h-5 border rounded-full border-gray-800 mr-1 peer-checked:bg-gray-800 flex justify-center items-center">
    <span className="material-symbols-outlined text-sm font-bold text-white peer-checked:inline-block">
      done
    </span>
  </span>
  <span className="text-gray-700 text-base sm:text-lg">
    Unite Address
  </span>
</label>

{/* Radio button for "Under Construction" */}
<label className="inline-flex items-center mb-2 sm:mb-5">
  <input
    name="status"
    type="radio"
    className="hidden peer"
    value="Under Construction"
    onChange={handleStatusChange} // Add onChange handler
    checked={status === "Under Construction"} // Check if this radio button is selected
  />
  <span className="w-5 h-5 border rounded-full border-gray-800 mr-1 peer-checked:bg-gray-800 flex justify-center items-center">
    <span className="material-symbols-outlined text-sm font-bold text-white peer-checked:inline-block">
      done
    </span>
  </span>
  <span className="text-gray-700 text-base sm:text-lg">
    Under Construction
  </span>
</label>

        </div>
        {role==="supervisor"?(
          <>
          <div className="flex flex-col">
          <textarea
            type="text"
            placeholder="Notes"
            className="h-32 p-4 items-start bg-gray-200 rounded-3xl w-full sm:w-2/3 lg:w-1/2"
          />
           <select
          className="ml-0 mt-3 rounded-full bg-gray-200 text-black px-4 h-12 w-full lg:w-1/2"
          value={status} // You should set the selected option value here
          onChange={(e) => setStatus(e.target.value)} // Handle selection change
        >
          <option value="Pending">Pending</option>
          <option value="Coordination Letter 1">Coordination Letter 1</option>
          <option value="Coordination Letter 2">Coordination Letter 2</option>
          <option value="Office Work">Office Work</option>
          <option value="Measurement in Assessment">Measurement in Assessment</option>
          <option value="Partly Measured">Partly Measured</option>
          <option value="Missing Information">Missing Information</option>
          <option value="United Address">United Address</option>
          <option value="Refused Survey">Refused Survey</option>
          <option value="Fixing Required">Fixing Required</option>
          <option value="Examination">Examination</option>
          <option value="Ready for Delivery">Ready for Delivery</option>
          <option value="Delivered">Delivered</option>
        </select>
        </div>
          </>
        ): (
          <></>
        )}
       
        <div className="mt-3 flex flex-row w-full">
        <Button  title={"Save Progress"} onClick={addToOfflineTasks} />
        <Button className="ml-4" title={"Sync Manually"} onClick={sendOfflineTasksToDatabase} />
        </div>
        
          </>
        )}
      </Container>
    </Layout>
  );
}

export default NewTaskAssigned;
