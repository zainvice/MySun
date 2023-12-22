import React, { useState, useEffect } from "react";
import Container from "../../common/container";
import Layout from "../../layout";
import Button from "../../common/button";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { createTask, getTasks } from "../../api";
import Spinner from "../../common/spinner";
import useAuth from "../../hooks/useAuth";
import { editTasks } from "../../api";
import { editProject } from "../../api";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getProjects } from "../../api";
import { getTaskById } from "../../api";
import ResetModal from "../../components/ResetModal";
import { exportToExcel } from "../../global";
import jwtDecode from "jwt-decode";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { selectCurrentToken } from "../../features/auth/authSlice";
import { useProjects } from "../../context/projectsContext";
import Select from 'react-select';

function NewTaskAssigned() {
  const {t}= useTranslation()
  const [status, setStatus] = useState(); // Initialize the status state variable
  const [floor, setFloor] = useState([]);

  const handleFloorChange = (e) => {
    const selectedValue = e.target.value;

    if (selectedValue === 'All') {
      setFloor(['All']);
    } else {
      if (floor.includes('All')) {
        setFloor([selectedValue]);
      } else {
        setFloor((prevFloors) => {
          if (!prevFloors.includes(selectedValue)) {
            return [...prevFloors, selectedValue];
          }
          return prevFloors;
        });
      }
    }
  };

  
  const token = useSelector(selectCurrentToken);
  const [userInfo, setUserInfo] = useState()
  const {setFetch} = useProjects
 
  useEffect(()=>{
    try{
      setUserInfo(jwtDecode(token))
    }catch(error){
      console.log("Error Occurred")
    }
  },[token])
  const [classification, setClassification]= useState()
  const handleClassificationChange = (e) => {
    console.log(e.target.value)
    console.log("C", classification)
    if (classification === e.target.value) {
     
      setClassification(undefined);
    } else {
      
      setClassification(e.target.value);
    }
  };
  
  const [propertyType, setPropertyType] = useState([]);
  // For Property Type
  const [resetType, setResetType] = useState(null);
  const handlePropertyTypeChange = (e) => {
    const value = e.target.value;
    if (propertyType?.includes(value)) {
      // If the value is already in the array, remove it
      setPropertyType(propertyType.filter(item => item !== value));
    } else {
      // If the value is not in the array, add it
      if(propertyType?.length>0)
        setPropertyType([...propertyType, value]);
      else
        setPropertyType([value])
    }
  };
  
  const [stats, setStats] = useState([]);
  const handleStatsChange = (e) => {
    const value = e.target.value;
    if (stats?.includes(value)) {
      // If the value is already in the array, remove it
      setStats(stats.filter(item => item !== value));
    } else {
      // If the value is not in the array, add it
      if(stats?.length>0)
        setStats([...stats, value]);
      else
        setStats([value]);
    }
  };
  
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const handlePartialReset = async() => {
    addToOfflineTasks()
    closeResetModal();
    const tasks = JSON.parse(localStorage.getItem("offlineTasks"));
    
    if (tasks && tasks.length > 0) {
      setloading(true)
      for(let task of tasks){
        //console.log(task)
        const resetType = "Partial";
        try {
          const {projectId}= task
          await editTasks({ task, manual, resetType });
          await editProject({ projectId, task, manual, resetType })
          localStorage.removeItem("offlineTasks");
          //console.log("MAKING IS LOADING FALSE")
          setloading(false);
          setMessage("Successfully saved to database!")
          setFetch(true)
          window.location.reload()
        } catch (error) {
          const data = error?.response?.data;
          //console.log("MAKING IS LOADING FALSE")
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
    
  };

  const handleFullReset = async() => {
    addToOfflineTasks()
    closeResetModal();
    const tasks = JSON.parse(localStorage.getItem("offlineTasks"));
    
    if (tasks && tasks.length > 0) {
      setloading(true)
      for(let task of tasks){
        //console.log(task)
        const resetType = "Full";
        try {
          const {projectId}= task
          await editTasks({ task, manual, resetType });
          await editProject({ projectId, task, manual, resetType })
          localStorage.removeItem("offlineTasks");
          //console.log("MAKING IS LOADING FALSE")
          setloading(false);
          setMessage("Successfully saved to database!")
          window.location.reload()
        } catch (error) {
          const data = error?.response?.data;
          //console.log("MAKING IS LOADING FALSE")
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
    
  };

  const openResetModal = () => {
    setIsResetModalOpen(true);
  };

  const closeResetModal = () => {
    setIsResetModalOpen(false);
  };
 
  const handleExport = async () => {
    console.log("project", display)
      if (!display) {
        // If there's no display, return early
        return;
      }
      
      
    let projectData
      
     const buildingNumberCounts = {};
     const task = display ? [display] : []; // Create an array with a single object or an empty arr 
     let taske = [];
     
     if (task.length > 0) {
       let history = "No History Found!";
       let classificationHistory = "No History";
     
       if (task[0]?.statusHistory?.length > 0) {
         const latestStatusHistory = task[0].statusHistory[task[0].statusHistory.length - 1];
         history = `Changed from ${latestStatusHistory?.changedFrom} to ${latestStatusHistory?.changedTo} on ${new Date(latestStatusHistory?.changedOn).toLocaleDateString()}`;
       }
     
       if (task[0]?.classificationHistory?.length > 0) {
         const latestClassificationHistory = task[0].classificationHistory[task[0].classificationHistory.length - 1];
         classificationHistory = `Changed from ${latestClassificationHistory?.changedFrom} to ${latestClassificationHistory?.changedTo} on ${new Date(latestClassificationHistory?.changedOn).toLocaleDateString()}`;
       }
     
       taske = [
         {
           ...task[0].taskData,
           "Status": task[0].status,
           "Classification": task[0].classification,
           "Lastest Update On": new Date(task[0].updatedAt).toLocaleString(),
           "Property Type": task[0].propertyType.join(', '),
           "Stats": task[0].stats.join(', '),
           "Latest Status Change": history,
           "Latest Classification Change": classificationHistory
           
         },
       ];
     }
     
     console.log("TASKS", taske);
     
     projectData = taske
       
      
     console.log(projectData)
      // Check if any data to export
      if (projectData?.length === 0) {
        // No data to export, return early
        return;
      }

      // Create a blob with the project data
     if(projectData){
      const blob = await exportToExcel(projectData);
      console.log(blob)
      const name = projectData[0]["building number"]
      // Create a download link and trigger the download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      
      a.href = url;
      a.download = `task_data_${name}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
     }
    
      // Revoke the object URL to free up resources
      
  };
  
  const [tasktoDisplay, setTasktoDisplay]= useState()
  const [inputValues, setInputValues] = useState(tasktoDisplay?.taskData || {});
  
  const [already_assigned, setAAssigned]= useState()
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
  const navigate = useNavigate()
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  const [warning, setWarning] = useState("")
  const onChange = (event) => {
    setWarning("")
    const target = event.target ?? {};
    if(target.name==="phyiscal number"){
      let found = false
      
      if(manual){
        projectToCompare.originalData?.tasks?.map((task)=>{
          if(task["phyiscal number"]===target.value){
            found= true;
            target.value= "";
            setWarning("Physical number already exists in project!")
          }
        })
      }
      if(found){
        console.log("Physical number already exists!")
      }
    }
    setInputValues((prev) => ({ ...prev, [target.name]: target.value }));
    //console.log("INPUT VALUES",inputValues)
    ///NEED ADDITION HERE
  };
  
  //console.log(projectToCompare)
  //console.log("DISPLAy", display)
  /* const filteredBuildings = projectToCompare?.buildingData?.tasks.filter((building) =>
    building["building number"||"כתובת"].toLowerCase().includes(searchTerm.toLowerCase())
  ); */
  const creatingNew=async(task )=>{
    setloading(true)
      try{
          const response = await createTask({task})
          //console.log(response)
          const {data} = response
          /* navigate(`/task/${data._id}`) */
          /* setloading(false) */
      }catch(error){
        //console.log(error)
        setloading(false)
      }
  }
  const [initial, setInital]= useState()
  useEffect(() => {
    async function fetchData() {
      
      //setloading(true)
      
      let filteredTasks;
      try {
       
        const response = await getTaskById(id);
        
        const tasks = response;
        //console.log(response);
        
  
        return response; // Return filtere dTasks here
       
      } catch (error) {
        localStorage.removeItem("tasks");
        console.error("Error fetching tasks:", error);
      } finally {
        setloading(false);
      }
    }
  
    async function setTaskToDisplay() {
      const filteredTasks = await fetchData();
     
      //console.log("TASK FOUND", filteredTasks)
      //setTasktoDisplay(filteredTasks);
      setDisplay(filteredTasks)
      const projectId = filteredTasks?.projectId
      setStatus(filteredTasks?.status)
      setPropertyType(filteredTasks?.propertyType)
      setClassification(filteredTasks?.classification)
      setStats(filteredTasks?.stats)
      setProject(projectId)
      if(filteredTasks?.floor)
        setFloor(filteredTasks?.floor)
      setManual(filteredTasks?.manual)
      handleStartClick()
      if (filteredTasks?.taskData) {
        const taskDataKeys = Object.keys(filteredTasks?.taskData);
        if (taskDataKeys.length > 2) {
          const assignedTask = filteredTasks.taskData;
          setAAssigned(assignedTask);
          //console.log("Already Assigned", assignedTask);
          const toAssign = { taskData: assignedTask };
          //console.log("Already Assigned", toAssign);
          setTasktoDisplay(toAssign);
          setInputValues(toAssign?.taskData);
        }
       
      }

      console.log("Displaying Task:", display)
      setSearchTerm(filteredTasks?.taskData?.["building number"]?filteredTasks?.taskData?.["building number"]:filteredTasks?.taskData?.["buildingNumber"])
      if(filteredTasks)
          setloading(false);
          setInital(id)
    }
    if(!tasktoDisplay)
      setTaskToDisplay(); // Call the function to set tasktoDisplay
  }, []);
  //console.log(id)
  //console.log("LOADING", isloading)
  useEffect(() => {
    // Check if the app is online
    if (navigator.onLine) {
      // Try to send offline tasks to the database
      sendOfflineTasksToDatabase();
    }
  }, [navigator.onLine]);

  const addToOfflineTasks = () => {
    
    
    /* if(timerRunning){
      setMessage("Please stop the timer first!")
    }else{ */
   
      setMessage("Saving...")
      const taskData = {_id: display?._id, taskData: inputValues, editedBy: userInfo?.UserInfo.email, timeTaken: timeTaken, status: status, classification: classification, propertyType: propertyType, stats: stats, floor: floor, projectId: projectToCompare?.projectId, buildingData: searchTerm}
      const updatedTasks = [...offlineTasks, taskData ];
      setOfflineTasks(updatedTasks);
      localStorage.setItem("offlineTasks", JSON.stringify(updatedTasks));
      //console.log("OFFLINE TASK SAVED!", offlineTasks)
      setMessage("Saved!")
   
    /* } */
    
  };
  const[message, setMessage]= useState("")
  const sendOfflineTasksToDatabase = async() => {
    const tasks = JSON.parse(localStorage.getItem("offlineTasks"));
    
    if (tasks && tasks.length > 0) {
      setloading(true)
      for(let task of tasks){
        //console.log(task)
        try {
          const {projectId}= task
          await editTasks({ task, manual });
          await editProject({ projectId, task, manual })
          localStorage.removeItem("offlineTasks");
          //console.log("MAKING IS LOADING FALSE")
          setloading(false);
          setMessage("Successfully saved to database!")
          navigate(`/manage-projects/${projectId}/tasks`)
          window.location.reload()
        } catch (error) {
          const data = error?.response?.data;
          console.log("MAKING IS LOADING FALSE", error)
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
  const [newn, setNew]= useState()
  const [key, setKey]= useState("")
  //console.log("TASK STATUS", status, classification, propertyType, stats)
  const [navLink, setLink]= useState()
  const [nextTask, setNextTask]= useState()
  const [isNextCreated, setNextCreated]= useState(false)
  useEffect(()=>{
    async function fetchData() {
      if(status==="Pending"){
        setStatus("Not Mapped")
      }
      if(display){
        if(display?.status!=='Pending'){
          if(projectToCompare){
            //console.log(display)
            let building = display?.taskData["building number"];

            if (building) {
              const regex = /^([A-Z]+)(\d+)(-(\d+))?$/; // Match alphabet(s) followed by a number and an optional hyphen and number
              const match = building.match(regex);
              //console.log("Inital", building)
              if (match) {
                const alphabetPart = match[1];
                const numberPart = parseInt(match[2]);
                const hyphen = match[3];
                let nextNumber=1;
                //console.log("APLHA", alphabetPart, "numberPard", numberPart, "hyphen", hyphen)
                if (hyphen) {
                  //console.log("I got one hyphen")
                  const secondNumber = parseInt(match[4]);
                  if (secondNumber < 12&& secondNumber!==undefined) {
                    nextNumber = secondNumber + 1;
                  } else {
                    // If the second number is 12, increment the alphabet part
                    const alphabetCharCode = alphabetPart.charCodeAt(0);
                    const nextAlphabet = String.fromCharCode(alphabetCharCode + 1);
                    nextNumber = 1;
                    //alphabetPart = nextAlphabet;
                  }
                } else {
                  if (numberPart < 12) {
                   /*  nextNumber = numberPart + 1; */
                  } else {
                    // If the number is 12, increment the alphabet part
                    const alphabetCharCode = alphabetPart.charCodeAt(0);
                    const nextAlphabet = String.fromCharCode(alphabetCharCode + 1);
                    nextNumber = 1;
                    //alphabetPart = nextAlphabet;
                  }
                }
              
                const newBuilding = hyphen ? `${alphabetPart}${numberPart}-${nextNumber}` : `${alphabetPart}${numberPart}-${nextNumber}`;
                //console.log(newBuilding);
                building = newBuilding
                setNew(building)
              } else {
                // Handle the case when the format is not as expected
                //console.log("Invalid format");
              }
            } else {
              // Handle the case when 'building' is undefined or null
              //console.log("No building information available");
            }


            const supervisord = projectToCompare?.workers.find((worker)=> worker.role==='supervisor')
            
              const task = {
        
                projectId: projectToCompare?._id,
                taskData:{
                  "building number": building
                },
                supervisor: supervisord
              }
              //console.log("task", task)
              
              setNextTask(task)
              
            /*  */
            
          }
        }
      }
    }
    fetchData();
  },[status])
  const onNavC =()=>{
    navigate(navLink)
    window.location.reload()
  }
  const onCreateNext = async() =>{
    try {
      setloading(true);
      const task = nextTask
      const response = await createTask({ task } );
      //console.log(response);
      const { data } = response;
      /* navigate(`/task/${data._id}`); */
      setLink(`/task/${data._id}`)
      setloading(false);
      setNextCreated(true)
    } catch (error) {
      //console.log(error);
      setloading(false);
    }
  }
  const handleStatusChange = (event) => {
    setStatus(event.target.value); // Update the status state with the selected value
  };
  const [dataToSearch, setSearchData]= useState()
  const [manual, setManual]= useState(false)
  const onManualClick = (e) => {
    if(manual===false){
      setManual(true)
      setSearchData('')
    }else{
      setManual(false)
      setSearchData('')
    }
  }
  const [timerDuration, setTimerDuration] = useState(7 * 24 * 60 * 60 * 1000); // 7 days in milliseconds
  const [remainingTime, setRemainingTime] = useState(null);
  console.log("remaining:", remainingTime)

  useEffect(() => {
    const coordinationLetter1History = display?.classificationHistory?.find(
      (history) => history.changedTo === 'Coordination Letter 1'
    );

    const coordinationLetter2History = display?.classificationHistory?.find(
      (history) => history.changedTo === 'Coordination Letter 2'
    );

    let latestCoordinationHistory;
     
    if (coordinationLetter1History && coordinationLetter2History) {
      latestCoordinationHistory =
        new Date(coordinationLetter1History.changedOn).getTime() > new Date(coordinationLetter2History.changedOn).getTime()
          ? coordinationLetter1History
          : coordinationLetter2History;
    } else {
      latestCoordinationHistory = coordinationLetter1History || coordinationLetter2History;
    }
    console.log(latestCoordinationHistory)

    if (latestCoordinationHistory) {
      const changedOnTimestamp = new Date(latestCoordinationHistory.changedOn).getTime();
      console.log(changedOnTimestamp)
      const targetTime = changedOnTimestamp + timerDuration;

      const updateRemainingTime = () => {
        const currentTime = Date.now();
        const timeDifference = targetTime - currentTime;

        if (timeDifference > 0) {
          const days = Math.floor(timeDifference / (24 * 60 * 60 * 1000));
          const hours = Math.floor((timeDifference % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
          const minutes = Math.floor((timeDifference % (60 * 60 * 1000)) / (60 * 1000));
          const seconds = Math.floor((timeDifference % (60 * 1000)) / 1000);

          setRemainingTime(`${days}d ${hours}h ${minutes}m ${seconds}s`);
          console.log("Remaining")
        } else {
          setRemainingTime('Coordination Letter has expired!');
          console.log("expired")
        }
      };

      const timerId = setInterval(updateRemainingTime, 1000);

      return () => {
        clearInterval(timerId);
        
      };
    }
  }, [display, timerDuration]);
  
  useEffect(()=>{
    const task = projectToCompare?.projectData?.tasks.find(task => {
      // Iterate through each property in the task object
      for (const key in task) {
        //console.log("Key", key)
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
    
    //console.log("Task Found", task)
    const taskto= {taskData: task}
    setTasktoDisplay(taskto)
    setInputValues(taskto?.taskData)
    if(manual){
      const inputValues = taskto?.taskData ? Object.keys(taskto.taskData).reduce((acc, key) => {
        acc[key] = "";
        return acc;
      }, {}) : {};
      const taska= {taskData: inputValues}
      setTasktoDisplay(taska)
      setInputValues(inputValues);
    }
    //console.log("input values",inputValues)
    if (searchRef.current) {
      searchRef.current.focus();
    }
    //setloading(false)
  },[dataToSearch])

  useEffect(()=>{
    if(manual&&inputValues["phyiscal number"]){
      projectToCompare.originalData?.tasks?.map((task)=>{
        if(task["phyiscal number"]===inputValues["phyiscal number"]){
          
          setWarning("Physical number already exists in project!")
        }
      })
    }
  }, [manual, inputValues])
  //console.log(inputValues)
  //console.log(manual,"MANUAL")

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
          <div className=" flex items-center mx-auto">
            
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
          {role?(
            <>
            

          
          <div className="flex justify-end items-center ">
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
           value={already_assigned ?  `Already Assigned to ${searchTerm} (Edit Mode)` : `Assigning to ${searchTerm}`}
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
         
         <div className="absolute lg:top-[20%] lg:right-6 md:right-0 right-4 top-2">
              
              {already_assigned?(
              
              
              <>
              {isNextCreated? (<Button className="m-4" title={`GO TO ${newn}` } onClick={onNavC} />):(<Button className="m-4" title={`CREATE ${newn}` } onClick={onCreateNext} />)}
              
              </>
              
              ):(<Button className="m-4" title={manual?"Re-Automate":"Enter Data Manually"} onClick={onManualClick} />)}
        </div>
     
    </div>
       {manual?(
        <></>
       ):(
        <div className="lg-w-1/2 sm:w-full md:w-full mt-6 ">
              { already_assigned?(
                <></>
              ):(
                <div className=" rounded-full bg-gray-200 text-black px-4 relative mt-10 mb-10 w-full" >
                <label className="text-gray-400 absolute top-0 left-3 -mt-6">
                  Search  (e.g phyisal number, address etc)
                </label>
                
                <input
                  type="text"
                  name="physical number"
                  defaultValue={dataToSearch}
                  value={dataToSearch}
                  /* disabled={!!tasktoDisplay?.taskData[key]} */
                  placeholder={
                    "Enter data (e.g phyisal number, address etc)"
                  }
                  ref={searchRef}
                  className="bg-gray-200 h-12 w-1/2"
                  onChange={(e)=>{
                    const data = {"physical number": e.target.value}
                    setSearchData(e.target.value)
                    setTasktoDisplay(undefined)
                  }}
                  disabled = {already_assigned? true: false}
                />
                <select className="bg-gray-200 text-black w-1/2" 
                  defaultValue={dataToSearch}
                  onChange={(e)=>{
                    const data = {"physical number": e.target.value}
                    setSearchData(e.target.value)
                    setTasktoDisplay(undefined)
                  }}
                  disabled = {already_assigned? true: false}
                >
                 {projectToCompare?.projectData?.tasks?.map((phyisal, index) => (
                  <option key={index} value={phyisal[key]}>
                    {phyisal[key]}
                  </option>
                ))}
               </select>
               <label className="text-gray-400 absolute -bottom-5 right-3 -mt-6">
                  {key?`Finding from ${key}`:""}
                </label>
              
              </div>
              )}
              
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
                {key === "property type" ? (
                    <>{"GOSH"}</>
                  ) : key === "general type" ? (
                    <>{"HELKA"}</>
                  ) : (
                    <>{key}</>
                  )}
                </label>
                <input
                  type="text"
                  name={key}
                  defaultValue={manual ? tasktoDisplay?.taskData[key] :  tasktoDisplay?.taskData[key]}
                  /* disabled={!!tasktoDisplay?.taskData[key]} */
                  placeholder={
                    !tasktoDisplay?.taskData[key]
                      ? t(`Enter data for .${key}`)
                      : ''
                  }
                  className="rounded-full bg-gray-200 text-black px-4 h-12 w-full"
                  onChange={onChange}
                  disabled={
                    (key === "phyiscal number" && tasktoDisplay?.taskData[key]!=='' && !manual) ||
                    (key === "building number" && !!tasktoDisplay?.taskData[key]) 
                    
                  }
                  required = {manual ? true : false}
                />
                {key === "phyiscal number"&& warning&& <p className="text-red-600 ml-3">{warning}</p>}
                {already_assigned && key === "phyiscal number" && manual && tasktoDisplay?.taskData["phyiscal number"]!==''?(<p className="text-red-600 ml-3">Warning! You might edit physical number.</p>): (<p className="color-red-600"></p>)}
              </div>
            ))}
          
          </>
          ):(
          <>
          <p></p>
          <>
         

                </>
          {dataToSearch&&(
            <Spinner message={"FINDING DATA!!"}/>
          )}
          <p></p>
          </>
          )}  
          
            
  
          </div>
          <div className="ml-3 mt-8 flex flex-row items-center text-left text-black ">
            <label className="mr-2 font-bold">Floor:</label>
            <select
              className="rounded-full bg-gray-200 text-black px-4 h-12 w-full lg:w-1/2"
              value={floor}
              onChange={handleFloorChange}
            >
              <option value={Array.isArray(floor) && floor.length>0? floor.join(","): floor}>{floor.length>0? floor.join(","): ""}</option>
              <option value="All">All</option>
              {Array.from({ length: 21 }, (_, index) => (
                <option key={index} value={index - 10}>
                  {index - 10}
                </option>
              ))}
            </select>
          </div>
          {display?.statusHistory?(<>
            <div className="m-6 ml-3 flex flex-col">
            <label htmlFor="statusHistory" className="font-bold">Status History</label>
            <ul className="ml-6">
              {display?.statusHistory?.map((history, index) => (
                <li key={index}>
                  Changed from <strong>{history.changedFrom}</strong> to <strong>{history.changedTo}</strong> on {new Date(history.changedOn).toLocaleString()}
                </li>
              ))}
            </ul>
          </div>
          </>):(<></>)}
          
          
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
              value="Not Mapped"
              onChange={handleStatusChange} // Add onChange handler
              checked={status === "Not Mapped"} // Check if this radio button is selected
              defaultChecked
              
            />
            <span className="w-5 h-5 border rounded-full border-gray-800 mr-1 peer-checked:bg-gray-800 flex justify-center items-center">
              <span className="material-symbols-outlined text-sm font-bold text-white peer-checked:inline-block">
                done
              </span>
            </span>
            <span className="text-gray-700 text-base sm:text-lg">
              Not Mapped 
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
              value="Drawing Ready"
              onChange={handleStatusChange} // Add onChange handler
              checked={status === "Drawing Ready"} // Check if this radio button is selected
            />
            <span className="w-5 h-5 border rounded-full border-gray-800 mr-1 peer-checked:bg-gray-800 flex justify-center items-center">
              <span className="material-symbols-outlined text-sm font-bold text-white peer-checked:inline-block">
                done
              </span>
            </span>
            <span className="text-gray-700 text-base sm:text-lg">
              Drawing Ready 
            </span>
          </label>
  
          {/* Radio button for "Refused Survey" */}
          <label className="inline-flex items-center mb-2 sm:mb-5">
            <input
              name="status"
              type="radio"
              className="hidden peer"
              value="Fully Mapped"
              onChange={handleStatusChange} // Add onChange handler
              checked={status === "Fully Mapped"} // Check if this radio button is selected
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
  
          {/* Repeat similar code for other radio buttons */}
          
           {/* Radio button for "Aerial Mapping" */}
            <label className="inline-flex items-center mb-2 sm:mb-5">
            <input
              name="status"
              type="radio"
              className="hidden peer"
              value="GIS Ready"
              onChange={handleStatusChange} // Add onChange handler
              checked={status === "GIS Ready"} // Check if this radio button is selected
            />
            <span className="w-5 h-5 border rounded-full border-gray-800 mr-1 peer-checked:bg-gray-800 flex justify-center items-center">
              <span className="material-symbols-outlined text-sm font-bold text-white peer-checked:inline-block">
                done
              </span>
            </span>
            <span className="text-gray-700 text-base sm:text-lg">
              GIS Ready
            </span>
            </label>
            {role!=="worker"?(
              <>
              {/* Radio button for "Checked" */}
              <label className="inline-flex items-center mb-2 sm:mb-5">
                 <input
                   name="status"
                   type="radio"
                   className="hidden peer"
                   value="Checked"
                   onChange={handleStatusChange} // Add onChange handler
                   checked={status === "Checked"} // Check if this radio button is selected
                 />
                 <span className="w-5 h-5 border rounded-full border-gray-800 mr-1 peer-checked:bg-gray-800 flex justify-center items-center">
                   <span className="material-symbols-outlined text-sm font-bold text-white peer-checked:inline-block">
                     done
                   </span>
                 </span>
                 <span className="text-gray-700 text-base sm:text-lg">
                   Checked
                 </span>
               </label>
                      
               {/* Radio button for "Submitted" */}
               <label className="inline-flex items-center mb-2 sm:mb-5">
                 <input
                   name="status"
                   type="radio"
                   className="hidden peer"
                   value="Submitted"
                   onChange={handleStatusChange} // Add onChange handler
                   checked={status === "Submitted"} // Check if this radio button is selected
                 />
                 <span className="w-5 h-5 border rounded-full border-gray-800 mr-1 peer-checked:bg-gray-800 flex justify-center items-center">
                   <span className="material-symbols-outlined text-sm font-bold text-white peer-checked:inline-block">
                     done
                   </span>
                 </span>
                 <span className="text-gray-700 text-base sm:text-lg">
                   Submitted
                 </span>
               </label>
                   
              </>
            ):(
              <>
              </>
            )
            }   
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
               </div>
              
               {display?.classificationHistory?(<>
            <div className="m-6 ml-3 flex flex-col">
            <label htmlFor="classificationHistory" className="font-bold">Classification History</label>
            <ul className="ml-6">
            {display?.classificationHistory?.map((history, index) => (
              <li key={index}>
                Changed from <strong>{history.changedFrom}</strong> to <strong>{history.changedTo}</strong> on {new Date(history.changedOn).toLocaleString()}
                {index === display.classificationHistory.length - 1 && ( 
                    history.changedTo === 'Coordination Letter 1' || history.changedTo === 'Coordination Letter 2' || history.changedTo === 'Coordination Letter 1 Expired' || history.changedTo === 'Coordination Letter 2 Expired' ? (
                      <span className="ml-2 text-red-600 font-bold">({remainingTime})</span>
                    ) : (
                      <></>
                    )
                  )}
              </li>
            ))}
            </ul>
          </div>
          </>):(<></>)}
           
            <p className="m-3 font-bold">Classfication</p>
          <div className="mt-0 sm:mt-8 mx-2 grid grid-cols-2  md:grid-cols-3 lg:grid-cols-4 justify-center items-center">
            {/* Radio button for "Coordination Letter 1" */}
            <label className="inline-flex items-center mb-2 sm:mb-5">
            <input
              name="classification"
              type="checkbox"
              className="hidden peer"
              value="Coordination Letter 1"
              onChange={handleClassificationChange} // Add onChange handler
              checked={classification === "Coordination Letter 1"} // Check if this checkbox button is selected
              defaultChecked
              
            />
            <span className="w-5 h-5 border rounded-full border-gray-800 mr-1 peer-checked:bg-gray-800 flex justify-center items-center">
              <span className="material-symbols-outlined text-sm font-bold text-white peer-checked:inline-block">
                done
              </span>
            </span>
            <span className="text-gray-700 text-base sm:text-lg">
              Coordination Letter 1 
            </span>
          </label>
          {/* Checkbox button for "Coordination Letter 2" */}
          <label className="inline-flex items-center mb-2 sm:mb-5">
            <input
              name="classification"
              type="checkbox"
              className="hidden peer"
              value="Coordination Letter 2"
              onChange={handleClassificationChange} // Add onChange handler
              checked={classification === "Coordination Letter 2"} // Check if this checkbox button is selected
              defaultChecked
              
            />
            <span className="w-5 h-5 border rounded-full border-gray-800 mr-1 peer-checked:bg-gray-800 flex justify-center items-center">
              <span className="material-symbols-outlined text-sm font-bold text-white peer-checked:inline-block">
                done
              </span>
            </span>
            <span className="text-gray-700 text-base sm:text-lg">
              Coordination Letter 2 
            </span>
          </label>
          
          {/* Checkbox button for "Refused Survey" */}
          <label className="inline-flex items-center mb-2 sm:mb-5">
            <input
              name="classification"
              type="checkbox"
              className="hidden peer"
              value="Refused Survey"
              onChange={handleClassificationChange} // Add onChange handler
              checked={classification === "Refused Survey"} // Check if this checkbox button is selected
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
          {/* Checkbox button for "Coordinated" */}
          <label className="inline-flex items-center mb-2 sm:mb-5">
            <input
              name="classification"
              type="checkbox"
              className="hidden peer"
              value="Coordinated"
              onChange={handleClassificationChange} // Add onChange handler
              checked={classification === "Coordinated"} // Check if this checkbox button is selected
            />
            <span className="w-5 h-5 border rounded-full border-gray-800 mr-1 peer-checked:bg-gray-800 flex justify-center items-center">
              <span className="material-symbols-outlined text-sm font-bold text-white peer-checked:inline-block">
                done
              </span>
            </span>
            <span className="text-gray-700 text-base sm:text-lg">
              Coordinated
            </span>
          </label>
  
          {/* Repeat similar code for other radio buttons */}
          
          
              
               </div>
              
            <p className="m-3 font-bold">Property Type</p>
          <div className="mt-0 sm:mt-8 mx-2 grid grid-cols-2  md:grid-cols-3 lg:grid-cols-4 justify-center items-center">
            {/* Checkbox button for "Residential" */}
            <label className="inline-flex items-center mb-2 sm:mb-5">
            <input
              name="propertyType"
              type="checkbox"
              className="hidden peer"
              value="Residential"
              onChange={handlePropertyTypeChange} // Add onChange handler
              checked={propertyType?.length>0 && propertyType?.includes("Residential")} // Check if this checkbox button is selected
              defaultChecked
              
            />
            <span className="w-5 h-5 border rounded-full border-gray-800 mr-1 peer-checked:bg-gray-800 flex justify-center items-center">
              <span className="material-symbols-outlined text-sm font-bold text-white peer-checked:inline-block">
                done
              </span>
            </span>
            <span className="text-gray-700 text-base sm:text-lg">
              Residential
            </span>
          </label>
            <label className="inline-flex items-center mb-2 sm:mb-5">
            <input
              name="propertyType"
              type="checkbox"
              className="hidden peer"
              value="Business"
              onChange={handlePropertyTypeChange} // Add onChange handler
              checked={propertyType?.length>0 && propertyType?.includes("Business")} // Check if this checkbox button is selected
              defaultChecked
              
            />
            <span className="w-5 h-5 border rounded-full border-gray-800 mr-1 peer-checked:bg-gray-800 flex justify-center items-center">
              <span className="material-symbols-outlined text-sm font-bold text-white peer-checked:inline-block">
                done
              </span>
            </span>
            <span className="text-gray-700 text-base sm:text-lg">
              Business
            </span>
          </label>
          {/* Checkbox button for "Field Mapped" */}
          <label className="inline-flex items-center mb-2 sm:mb-5">
            <input
              name="propertyType"
              type="checkbox"
              className="hidden peer"
              value="Industry"
              onChange={handlePropertyTypeChange} // Add onChange handler
              checked={propertyType?.length>0 && propertyType?.includes("Industry")} // Check if this checkbox button is selected
              defaultChecked
              
            />
            <span className="w-5 h-5 border rounded-full border-gray-800 mr-1 peer-checked:bg-gray-800 flex justify-center items-center">
              <span className="material-symbols-outlined text-sm font-bold text-white peer-checked:inline-block">
                done
              </span>
            </span>
            <span className="text-gray-700 text-base sm:text-lg">
              Industry 
            </span>
          </label>
           {/* Checkbox button for "Agricultural" */}
          <label className="inline-flex items-center mb-2 sm:mb-5">
            <input
              name="propertyType"
              type="checkbox"
              className="hidden peer"
              value="Agricultural"
              onChange={handlePropertyTypeChange} // Add onChange handler
              checked={propertyType?.length>0 && propertyType?.includes("Agricultural")} // Check if this checkbox button is selected
            />
            <span className="w-5 h-5 border rounded-full border-gray-800 mr-1 peer-checked:bg-gray-800 flex justify-center items-center">
              <span className="material-symbols-outlined text-sm font-bold text-white peer-checked:inline-block">
                done
              </span>
            </span>
            <span className="text-gray-700 text-base sm:text-lg">
              Agricultural 
            </span>
          </label>
  
          {/* Checkbox button for "Goverment" */}
          <label className="inline-flex items-center mb-2 sm:mb-5">
            <input
              name="propertyType"
              type="checkbox"
              className="hidden peer"
              value="Goverment"
              onChange={handlePropertyTypeChange} // Add onChange handler
              checked={propertyType?.length>0 && propertyType?.includes("Goverment")} // Check if this checkbox button is selected
            />
            <span className="w-5 h-5 border rounded-full border-gray-800 mr-1 peer-checked:bg-gray-800 flex justify-center items-center">
              <span className="material-symbols-outlined text-sm font-bold text-white peer-checked:inline-block">
                done
              </span>
            </span>
            <span className="text-gray-700 text-base sm:text-lg">
              Goverment
            </span>
          </label>
          
         
               </div>
               <p className="m-3 font-bold">Stats</p>
          <div className="mt-0 sm:mt-8 mx-2 grid grid-cols-2  md:grid-cols-3 lg:grid-cols-4 justify-center items-center">
            {/* Checkbox button for "Under Construction" */}
            <label className="inline-flex items-center mb-2 sm:mb-5">
            <input
              name="stats"
              type="checkbox"
              className="hidden peer"
              value="Under Construction"
              onChange={handleStatsChange} // Add onChange handler
              checked={stats?.length>0 && stats?.includes("Under Construction")} // Check if this checkbox button is selected
              defaultChecked
              
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
            <label className="inline-flex items-center mb-2 sm:mb-5">
            <input
              name="stats"
              type="checkbox"
              className="hidden peer"
              value="Aerial Mapped"
              onChange={handleStatsChange} // Add onChange handler
              checked={stats?.length>0 && stats?.includes("Aerial Mapped")} // Check if this checkbox button is selected
              defaultChecked
              
            />
            <span className="w-5 h-5 border rounded-full border-gray-800 mr-1 peer-checked:bg-gray-800 flex justify-center items-center">
              <span className="material-symbols-outlined text-sm font-bold text-white peer-checked:inline-block">
                done
              </span>
            </span>
            <span className="text-gray-700 text-base sm:text-lg">
              Aerial Mapped
            </span>
          </label>
          {/* Checkbox button for "Missing Information" */}
          <label className="inline-flex items-center mb-2 sm:mb-5">
            <input
              name="stats"
              type="checkbox"
              className="hidden peer"
              value="Missing Information"
              onChange={handleStatsChange} // Add onChange handler
              checked={stats?.length>0 && stats?.includes("Missing Information")} // Check if this checkbox button is selected
              defaultChecked
              
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
          {/* Checkbox button for "Missing Physical Number" */}
          <label className="inline-flex items-center mb-2 sm:mb-5">
            <input
              name="stats"
              type="checkbox"
              className="hidden peer"
              value="Missing Physical Number"
              onChange={handleStatsChange} // Add onChange handler
              checked={stats?.length>0 && stats?.includes("Missing Physical Number")} // Check if this checkbox button is selected
              defaultChecked
              
            />
            <span className="w-5 h-5 border rounded-full border-gray-800 mr-1 peer-checked:bg-gray-800 flex justify-center items-center">
              <span className="material-symbols-outlined text-sm font-bold text-white peer-checked:inline-block">
                done
              </span>
            </span>
            <span className="text-gray-700 text-base sm:text-lg">
              Missing Physical Number 
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
        
       
        {role==="suprvisor"?(
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
           <Button className="m-4" title={"Update Progress"} onClick={() => { handleStopClick(); addToOfflineTasks(); sendOfflineTasksToDatabase(); }} />
           </div>
        ):(
          <div className="mt-3 flex flex-row w-full">
        <Button  title={"Save Offline"} onClick={()=> {handleStopClick(); addToOfflineTasks();}} />
        <Button className="ml-4" title={"Save"} onClick={()=>{ handleStopClick(); addToOfflineTasks(); sendOfflineTasksToDatabase();}} />
        </div>
        )}
          {already_assigned?(
            <>
            <div className="mt-3 flex flex-row w-full justify-end space-x-4">
            <Button title={"Reset Task"} onClick={() => { openResetModal(); }} />
            <Button title={"Export Task"} onClick={() => { handleExport(); }} />
            </div>
          </>
          ):(
            <></>
          )}
          </>
        )}
        <ResetModal
        isOpen={isResetModalOpen}
        onRequestClose={closeResetModal}
        onPartialReset={handlePartialReset}
        onFullReset={handleFullReset}
       />
      </Container>
    </Layout>
  );
}

export default NewTaskAssigned;
