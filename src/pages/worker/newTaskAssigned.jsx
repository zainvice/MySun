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
import { editProject } from "../../api";
import { useRef } from "react";

function NewTaskAssigned() {
  const {t}= useTranslation()
  const [tasktoDisplay, setTasktoDisplay]= useState()
  const [inputValues, setInputValues] = useState(tasktoDisplay?.taskData || {});
  const onChange = (event) => {
    const target = event.target ?? {};
    setInputValues((prev) => ({ ...prev, [target.name]: target.value }));
    console.log("INPUT VALUES",inputValues)
  };
  const [timerRunning, setTimerRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [offlineTasks, setOfflineTasks] = useState([]);
  const {id} = useParams()
  const [projects, setProjects]= useState()
  const [projectToCompare, setProject]= useState()
  const [isloading, setloading] = useState(true);
  const [timeTaken, setTimeTaken] = useState(0);
  const {role}= useAuth()
  const [searchTerm, setSearchTerm] = useState('');
  const [display, setDisplay]= useState()
  const searchRef = useRef(null)
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  
  const filteredBuildings = projectToCompare?.buildingData?.tasks.filter((building) =>
    building["building number"||"כתובת"].toLowerCase().includes(searchTerm.toLowerCase())
  );
  useEffect(() => {
    async function fetchData() {
      
      //setloading(true)
      
      let filteredTasks;
      try {
       
        const response = await getTasks();
        
        const tasks = response;
        console.log(response);
        if (tasks?.length > 0) {
          console.log("TASKS from above", tasks);
          filteredTasks = tasks?.filter((task) => task?._id === id);
          
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
     
      
      //setTasktoDisplay(filteredTasks[0]);
      setDisplay(filteredTasks[0])
      const projectId = filteredTasks[0].projectId
      setProject(projectId)
      setInputValues(filteredTasks[0]?.taskData)
      console.log("Displaying Task:", display)
      setSearchTerm(filteredTasks[0]?.taskData?.["building number"])
      if(filteredTasks[0])
          setloading(false);
    }
    if(!tasktoDisplay)
      setTaskToDisplay(); // Call the function to set tasktoDisplay
  }, []);
  console.log("LOADING", isloading)
  useEffect(() => {
    // Check if the app is online
    if (navigator.onLine) {
      // Try to send offline tasks to the database
      sendOfflineTasksToDatabase();
    }
  }, [navigator.onLine]);

  const addToOfflineTasks = () => {
    if(timerRunning){
      setMessage("Please stop the timer first!")
    }else{
      setMessage("Saving...")
      const taskData = {_id: display?._id, taskData: inputValues, timeTaken: timeTaken, status: status, projectId: projectToCompare?.projectId, buildingData: searchTerm}
      const updatedTasks = [...offlineTasks, taskData ];
      setOfflineTasks(updatedTasks);
      localStorage.setItem("offlineTasks", JSON.stringify(updatedTasks));
      console.log("OFFLINE TASK SAVED!", offlineTasks)
      setMessage("Saved!")
    }
    
  };
  const[message, setMessage]= useState("")
  const sendOfflineTasksToDatabase = async() => {
    const tasks = JSON.parse(localStorage.getItem("offlineTasks"));
    setloading(true)
    if (tasks && tasks.length > 0) {
      for(let task of tasks){
        console.log(task)
        try {
          const {projectId}= task
          await editTasks({ task, manual });
          await editProject({ projectId, task, manual })
          localStorage.removeItem("offlineTasks");
          console.log("MAKING IS LOADING FALSE")
          setloading(false);
          setMessage("Successfully saved to database!")
        } catch (error) {
          const data = error?.response?.data;
          console.log("MAKING IS LOADING FALSE")
          setloading(false);
          setMessage("Something went wrong, try again in a moment!")
        }
      }
    }else{
      if(message==="No Tasks found to be synced!")
        setMessage("")
      else
        setMessage("No Tasks found to be synced!")
    }
    //setloading(false)
  };

  useEffect(() => {
    let interval;
    
    if (timerRunning) {
      setMessage("Timer Started!")
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
      setTimeTaken((prevTimeTaken) => prevTimeTaken + seconds);
    } else {
      //setMessage("Timer Stopped!")
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
  const [key, setKey]= useState("")
  console.log("TASK STATUS", status)
  useEffect(()=>{
    
      if(status==="Pending"){
        setStatus("Fully Mapped")
      }

    
  },[status])
  const handleStatusChange = (event) => {
    setStatus(event.target.value); // Update the status state with the selected value
  };
  const [dataToSearch, setSearchData]= useState()
  const [manual, setManual]= useState(false)
  const onManualClick = (e) => {
    if(manual===false){
      setManual(true)
      setSearchData('1')
    }else{
      setManual(false)
      setSearchData('')
    }
  }
  useEffect(()=>{
    const task = projectToCompare?.projectData?.tasks.find(task => {
      // Iterate through each property in the task object
      for (const key in task) {
        console.log("Key", key)
        setKey(key)
        if (task.hasOwnProperty(key)) {
          // Check if the property value includes the dataToSearch
          if (task[key]?.toString().includes(dataToSearch?.toString())) {
            return task; // Found a match, return the task
          }
        }
      }
      return null; // No match found in any property, return null or handle it as needed
    });
    
    console.log("Task Found", task)
    const taskto= {taskData: task}
    setTasktoDisplay(taskto)
    setInputValues(taskto?.taskData)
    console.log("input values",inputValues)
    if (searchRef.current) {
      searchRef.current.focus();
    }
    //setloading(false)
  },[dataToSearch])
  
  
  return (
    <Layout activePageName={display?.projectId?.projectName+"'s task"}>
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
            <label className="text-lg sm:text-xl font-bold">Task from {display?.projectId?.projectName} </label>
          </span>

          {role==='worker'?(
            <>
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
            </>
          ):(
            <></>
          )}
        </div>
       <div className="w-full text-center">
       <p className="text-lg font-bold text-[#34F5C5]">{message}</p>
       </div>
       <div className="h-10 rounded-full bg-gray-200 text-black px-4 h-10 text-center content-center lg:w-1/4">
         
         <input
           type="text"
           placeholder="Search or Select for a building number"
           className="bg-gray-200 w-full text-center mr-8 mt-2"
           value={`Assigning to ${searchTerm}`}
           onChange={handleSearch}
           disabled
         />
         {/* <select className="bg-gray-200 " onChange={handleSearch}>
           {filteredBuildings?.map((building, index) => (
             <option key={index} value={building["building number"||"כתובת"]}>
               {building["building number"||"כתובת"]}
             </option>
           ))}
         </select> */}
         
         <div className="absolute lg:top-[11%] lg:right-6 md:right-0 right-4 top-2">
              
              <Button className="m-4" title={manual?"Re-Automate":"Enter Data Manually"} onClick={onManualClick} />
        </div>
     
    </div>
       {manual?(
        <></>
       ):(
        <div className="lg-w-1/2 sm:w-full md:w-full mt-6 ">
              <div className=" rounded-full bg-gray-200 text-black px-4 relative mt-10 w-full" >
                <label className="text-gray-400 absolute top-0 left-3 -mt-6">
                  Search  (e.g phyisal number, address etc)
                </label>
                <label className="text-gray-400 absolute top-0 right-3 -mt-6">
                  {key?`Finding from ${key}`:""}
                </label>
                <input
                  type="text"
                  name="physical number"
                  defaultValue={dataToSearch}
                  value={dataToSearch}
                  /* disabled={!!tasktoDisplay?.taskData[key]} */
                  placeholder={
                    "Search using any data (e.g phyisal number, address etc)"
                  }
                  ref={searchRef}
                  className="bg-gray-200 h-12 w-1/2"
                  onChange={(e)=>{
                    const data = {"physical number": e.target.value}
                    setSearchData(e.target.value)
                    setTasktoDisplay(undefined)
                  }}
                />
                <select className="bg-gray-200 text-black w-1/2" 
                  defaultValue={dataToSearch}
                  onChange={(e)=>{
                    const data = {"physical number": e.target.value}
                    setSearchData(e.target.value)
                    setTasktoDisplay(undefined)
                  }}
                >
                 {projectToCompare?.projectData?.tasks?.map((phyisal, index) => (
                  <option key={index} value={phyisal[key]}>
                    {phyisal[key]}
                  </option>
                ))}
               </select>
                
                
              </div>
              
             {/*  {!tasktoDisplay?.taskData&&(<div className="mt-3 flex flex-row w-full">
              <p className="ml-4 mr-4 mt-2 font-bold">OR</p>
              <Button className="m-4" title={"Enter Data Manually"} onClick={onManualClick} />
              </div>)} */}
          </div>
       )}
        {tasktoDisplay?(
          <>
          
          
          
          <div className="mt-6 text-white grid grid-cols-1 sm:grid-cols-2  md:grid-cols-3 gap-4">
          {tasktoDisplay?.taskData?(
          <>
          
          {Object.keys(tasktoDisplay?.taskData || {}).map((key) => (
              <div className="relative" key={key}>
                <label className="text-gray-400 absolute top-0 left-3 -mt-6">
                  {key}
                </label>
                <input
                  type="text"
                  name={key}
                  defaultValue={manual ? "" :  tasktoDisplay?.taskData[key]}
                  /* disabled={!!tasktoDisplay?.taskData[key]} */
                  placeholder={
                    !tasktoDisplay?.taskData[key]
                      ? t(`Enter data for .${key}`)
                      : ''
                  }
                  className="rounded-full bg-gray-200 text-black px-4 h-12 w-full"
                  onChange={onChange}
                  required = {manual ? true : false}
                />
              </div>
            ))}
          
          </>
          ):(
          <>
          <p></p>
          {dataToSearch&&(
            <Spinner message={"FINDING DATA!!"}/>
          )}
          <p></p>
          </>
          )}  
          
            
  
          </div>
          
          {role!=="supervisor"?(
            <>
            <p className="m-3 font-bold">Status</p>
          <div className="mt-0 sm:mt-8 mx-2 grid grid-cols-2  md:grid-cols-3 lg:grid-cols-4 justify-center items-center">
            {/* Radio button for "Fully Mapped" */}
            <label className="inline-flex items-center mb-2 sm:mb-5">
            <input
              name="status"
              type="radio"
              className="hidden peer"
              value="Fully Mapped"
              onChange={handleStatusChange} // Add onChange handler
              checked={status === "Fully Mapped"} // Check if this radio button is selected
              defaultChecked
              
            />
            <span className="w-5 h-5 border rounded-full border-gray-800 mr-1 peer-checked:bg-gray-800 flex justify-center items-center">
              <span className="material-symbols-outlined text-sm font-bold text-white peer-checked:inline-block">
                done
              </span>
            </span>
            <span className="text-gray-700 text-base sm:text-lg">
              Fully Mapped 
            </span>
          </label>
          {/* Radio button for "Field Mapped" */}
          <label className="inline-flex items-center mb-2 sm:mb-5">
            <input
              name="status"
              type="radio"
              className="hidden peer"
              value="Field Mapped"
              onChange={handleStatusChange} // Add onChange handler
              checked={status === "Field Mapped"} // Check if this radio button is selected
              defaultChecked
              
            />
            <span className="w-5 h-5 border rounded-full border-gray-800 mr-1 peer-checked:bg-gray-800 flex justify-center items-center">
              <span className="material-symbols-outlined text-sm font-bold text-white peer-checked:inline-block">
                done
              </span>
            </span>
            <span className="text-gray-700 text-base sm:text-lg">
              Field Mapped 
            </span>
          </label>
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
              
       
            </>
            
          ): (
            <></>
          )
          }
          </>
        ):(
          <Spinner message={"Loading from excel file!"}/>
        )}
        
       
        {role==="supervisor"?(
                <>
                <div className="mt-8 flex flex-col">
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
                <option value="Coordination Letter">Coordination Letter</option>
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
        {role!=="worker"?(
          <div className="mt-3 flex flex-row w-full">
           <Button className="m-4" title={"Update Progress"} onClick={() => { addToOfflineTasks(); sendOfflineTasksToDatabase(); }} />
           </div>
        ):(
          <div className="mt-3 flex flex-row w-full">
        <Button  title={"Save Progress"} onClick={addToOfflineTasks} />
        <Button className="ml-4" title={"Sync Manually"} onClick={()=>{addToOfflineTasks(); sendOfflineTasksToDatabase();}} />
        </div>
        )}
          
          </>
        )}
      </Container>
    </Layout>
  );
}

export default NewTaskAssigned;
