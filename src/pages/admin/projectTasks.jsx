import React, { useEffect, useState } from "react";
import Layout from "../../layout";
import Container from "../../common/container";
import Heading from "../../common/heading";
import { useParams } from "react-router-dom";
import { isEven } from "../../utils";
import { VARIANTS } from "../../components/projectCard";
import { useProjects } from "../../context/projectsContext";
import { NavLink } from "react-router-dom";
import TaskCard from "../../components/taskCard";
import useAuth from "../../hooks/useAuth";
import Spinner from "../../common/spinner";
import { isEmpty } from "lodash";

function Tasks() {
  const { id } = useParams();
  const { projects } = useProjects();
  const [filter, setSelectedFilter]= useState()
  const project = projects?.length
    ? projects?.filter((project) => project?.projectId === id)[0]
    : {};
  const { role }= useAuth()
  //console.log(projects)
  const[tasks, setTask] = useState(project?.completeData||project?.buildingData?.tasks)
  const [tasksAS, setTasks] = useState(project?.tasks)
  const taskWithMostKeys = tasksAS?.reduce((prevTask, currentTask) => {
    const prevKeys = prevTask?.taskData ? Object.keys(prevTask.taskData).length : 0;
    const currentKeys = currentTask?.taskData ? Object.keys(currentTask.taskData).length : 0;
    
    return prevKeys > currentKeys ? prevTask : currentTask;
}, {});
  const [headings, setHeadings] = useState([]);
  console.log("TASK", tasksAS)
  useEffect(()=>{
    if(taskWithMostKeys!==undefined&&taskWithMostKeys!==null&&!isEmpty(taskWithMostKeys)){
           setHeadings(Object.keys(taskWithMostKeys?.taskData));
     }
  }, [taskWithMostKeys])
  console.log("headings", headings)
  const [Loading, setloading]= useState(true)
  const originalTasks = project?.tasks
  useEffect(()=>{
    //console.log("Displaying",project?.tasks)
    if(projects!==null){
      setloading(false)
    }
    if(project?.tasks){
      setTasks(project?.tasks)
    }
  },[projects])
  const [viewAs, setView]= useState(true)
  const changeView = () =>{
    if(viewAs)
      setView(false)
    else  
      setView(true)
  }
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  useEffect(()=>{
    if(filter==="assigned"){
      setTask(project?.completeData)
    }else if(filter==="unassigned"){
      setTask(project?.projectData?.tasks)
    }else if(filter==="original"){
      setTask(project?.originalData?.tasks)
    }
    if (filter === "assignment") {
      console.log("UPDATING BY ", filter);
    
      // Create a shallow copy of the tasks array
      const tasksCopy = [...project?.tasks];
    
      const sortedTasks = tasksCopy.sort((taskA, taskB) => {
        // Check if taskA has an array in taskData
        const hasArrayA = Array.isArray(taskA.taskData[taskA['building number']]);
    
        // Check if taskB has an array in taskData
        const hasArrayB = Array.isArray(taskB.taskData[taskB['building number']]);
    
        // Compare tasks based on the presence of an array in taskData
        if (hasArrayA && !hasArrayB) {
          return -1; // taskA has an array, so it comes first
        } else if (!hasArrayA && hasArrayB) {
          return 1; // taskB has an array, so it comes first
        } else {
          return 0; // Both tasks have or don't have arrays, maintain the order
        }
      });
    
      // Update the state with the sorted tasks
      setTasks(sortedTasks);
    } else if (filter === "status") {
      console.log("UPDATING BY ", filter);
    
      // Create a shallow copy of the tasks array
      const tasksCopy = [...project?.tasks];
    
      const sortedTasks = tasksCopy.sort((task1, task2) => {
        const statusOrder = {
          'Pending': 1,
          'Field Mapped':2,
          'Fully Mapped':2,
          'Coordination Letter': 2,
          'Coordination Letter 1': 2,
          'Coordination Letter 2': 3,
          'Office Work': 4,
          'Measurement in Assessment': 5,
          'Partly Measured': 6,
          'Missing Information': 7,
          'United Address': 8,
          'Refused Survey': 9,
          'Fixing Required': 10,
          'Examination': 11,
          'Ready for Delivery': 12,
          'Delivered': 13,
        };
    
        const status1 = task1.status;
        const status2 = task2.status;
    
        return statusOrder[status1] - statusOrder[status2];
      });
    
      setTasks(sortedTasks);
    } else if (filter === "most recent") {
      console.log("UPDATING BY ", filter);
    
      // Create a shallow copy of the tasks array
      const tasksCopy = [...project?.tasks];
    
      const sortedTasks = tasksCopy.sort((taskA, taskB) => {
        const dateA = new Date(taskA.createdAt);
        const dateB = new Date(taskB.createdAt);
    
        // Compare tasks based on 'createdAt' date in descending order
        return dateB - dateA;
      });
    
      // Update the state with the sorted tasks
      setTasks(sortedTasks);
    }else if (filter === "fully_mapped") {
      console.log("UPDATING BY ", filter);
    
      // Create a shallow copy of the tasks array
      const tasksCopy = [...project?.tasks];
    
      const sortedTasks = tasksCopy.filter((task)=> task.status==="Fully Mapped")
    
      // Update the state with the sorted tasks
      setTasks(sortedTasks);
    }else if (filter === "field_mapped") {
      console.log("UPDATING BY ", filter);
    
      // Create a shallow copy of the tasks array
      const tasksCopy = [...project?.tasks];
    
      const sortedTasks = tasksCopy.filter((task)=> task.status==="Field Mapped")
    
      // Update the state with the sorted tasks
      setTasks(sortedTasks);
    }else if (filter === "missing_information") {
      console.log("UPDATING BY ", filter);
    
      // Create a shallow copy of the tasks array
      const tasksCopy = [...project?.tasks];
    
      const sortedTasks = tasksCopy.filter((task)=> task.status==="Missing Information")
    
      // Update the state with the sorted tasks
      setTasks(sortedTasks);
    }else if (filter === "coordination_letter") {
      console.log("UPDATING BY ", filter);
    
      // Create a shallow copy of the tasks array
      const tasksCopy = [...project?.tasks];
    
      const sortedTasks = tasksCopy.filter((task)=> task.status==="Coordination Letter")
    
      // Update the state with the sorted tasks
      setTasks(sortedTasks);
    }else if (filter === "refused_survey") {
      console.log("UPDATING BY ", filter);
    
      // Create a shallow copy of the tasks array
      const tasksCopy = [...project?.tasks];
    
      const sortedTasks = tasksCopy.filter((task)=> task.status==="Refused Survey")
    
      // Update the state with the sorted tasks
      setTasks(sortedTasks);
    }else if (filter === "aerial_mapping") {
      console.log("UPDATING BY ", filter);
    
      // Create a shallow copy of the tasks array
      const tasksCopy = [...project?.tasks];
    
      const sortedTasks = tasksCopy.filter((task)=> task.status==="Aerial Mapping")
    
      // Update the state with the sorted tasks
      setTasks(sortedTasks);
    }else if (filter === "unite_address") {
      console.log("UPDATING BY ", filter);
    
      // Create a shallow copy of the tasks array
      const tasksCopy = [...project?.tasks];
    
      const sortedTasks = tasksCopy.filter((task)=> task.status==="Unite Address")
    
      // Update the state with the sorted tasks
      setTasks(sortedTasks);
    }else if (filter === "under_construction") {
      console.log("UPDATING BY ", filter);
    
      // Create a shallow copy of the tasks array
      const tasksCopy = [...project?.tasks];
    
      const sortedTasks = tasksCopy.filter((task)=> task.status==="Under Construction")
    
      // Update the state with the sorted tasks
      setTasks(sortedTasks);
    }
    

  },[filter])
  useEffect(()=>{
    //console.log("Displaying",project?.tasks)
     // Filter the tasks based on the searchTerm
    const filteredTasks = project?.tasks?.filter((task) => {
    const buildingNumber = task.taskData["building number"];
    // Convert buildingNumber to a string for comparison
    const buildingNumberString = buildingNumber.toString();
    return buildingNumberString.includes(searchTerm.toUpperCase());
    });
    //console.log("Filtered Tasks:", filteredTasks);
    setTasks(filteredTasks)
  },[searchTerm])

  const buildingNumberCounts = {};
  const tasksBN = tasksAS?.map((task) => {
  return task.taskData
});
console.log(tasksBN)
console.log(tasksAS)
tasksBN?.sort((a, b) => {
  const buildingNumberA = a["building number"];
  const buildingNumberB = b["building number"];
  
  return buildingNumberA.localeCompare(buildingNumberB);
});
  return (
    <>
      <Layout activePageName={`Projects / ${id} / Tasks`}>
        <Container>
          <div >
            {Loading?(
                <Spinner/>
            ):(
              <>
              <div className="flex justify-between mb-2">
            <Heading title={"Project Tasks"}></Heading>
             
              <div className="flex flex-row">
              <select
                value={filter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="h-[65%] lg:h-[100%] border-2 border-[#00FFD3] text-[#00FFD3] p-2 rounded-full focus-within:outline-none transform transition-transform hover:bg-[#00FFD3] hover:text-white"
              >
                <option value={!viewAs ? "assignment" : "assignment"}>
                  {!viewAs ? "Assignment" : "Assignment"}
                </option>
                <optgroup label={!viewAs ? "Status" : "Status"}>
                  <option value="fully_mapped">Fully Mapped</option>
                  <option value="field_mapped">Field Mapped</option>
                  <option value="coordination_letter">Coordination Letter</option>
                  <option value="refused_survey">Refused Survey</option>
                  <option value="aerial_mapping">Aerial Mapping</option>
                  <option value="missing_information">Missing Information</option>
                  <option value="unite_address">Unite Address</option>
                  <option value="under_construction">Under Construction</option>
                </optgroup>
                <option value={!viewAs ? "most recent" : "most recent"}>
                  {!viewAs ? "Most Recent" : "Most Recent"}
                </option>
              </select>

               {/* <>
               <span class="material-symbols-outlined">tune</span>
               </> */}
               <>
              
                {!viewAs? (
                  <button className="ml-5 bg-[#00FFD3] hover:bg-green-400 rounded-lg content-center w-5/2 h-10 hover:ease-in-out duration-300 shadow-md">
                  <span className="justify-center material-symbols-outlined text-4xl rounded text-white hover:cursor-pointer hover:text-white-200" 
                  onClick={changeView}
                  >
                  toc
                 </span>
                 </button>
                ): (
                  <>
                  
                
                  <button className="ml-5 bg-[#00FFD3] hover:bg-green-400 rounded-lg content-center w-[3.0rem] h-10 hover:ease-in-out duration-300 shadow-md">
                  <span className="justify-center material-symbols-outlined text-4xl text-white hover:cursor-pointer hover:text-white-200" 
                  onClick={changeView}
                  >
                 aod_tablet
                  </span>
                  </button>
                  </>
                )}
               </>
             </div>
              </div>
            <div className="my-4 ">
            {!viewAs?(<></>):(
              <div className="flex items-center justify-center">
                 <label className="mr-5 font-bold text-1xl">Search: </label>
              <div className="h-10 rounded-full bg-gray-200 text-black px-4 lg:w-1/4 sm:w-1/3 sm:mr-4">
               
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-gray-200 w-3/4 mr-8 mt-2"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>
             )}
              {!viewAs? (
                <table className="w-full bg-white border-separate border-spacing-y-3">
                <thead>
                  <tr className="bg-white text-gray-800 text-sm font-thin">
                    <th className="px-3 text-lg">Status</th>
                    {headings?.length > 0 &&
                      headings?.map((heading) => (
                        <th key={heading} className="px-3 text-lg">{heading}</th>
                      ))}
                  </tr>
                </thead>
                <tbody className="rounded-full text-center text-sm font-thin">
                {tasksAS?.length > 0 ? (
                  tasksAS?.map((task, index) => (
                    <tr className="bg-gray-200 w-[60%]" key={index}>
                      <td className="p4 pl-8 rounded-l-full ">
                        <NavLink to={`/task/${task._id}`}> {task?.status}</NavLink>
                      </td>
                      {headings?.map((heading, index) => (
                        <td
                          key={index}
                          className={`p-3 ${
                            index === headings?.length - 1 ? "rounded-r-full" : ""
                          }`}
                        >
                          <div>
                            <NavLink to={`/task/${task._id}`}>
                              {task?.taskData[heading]}
                            </NavLink>
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <p className="absolute left-[50%] top-[50%] -translate-x-[50%]">
                    No Combinations Found, complete some tasks first!
                  </p>
                )}
              </tbody>
              </table>
              ): (
                <div className="mt-4 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                   {tasksAS?.length > 0 ? (
                     tasksAS?.map((task, index) => (
                       <NavLink
                         to={"/task/"+task?._id}
                         key={task?._id}
                         className={
                           "transform transition-transform hover:scale-105 inlne-block"
                         }
                       >
                         <TaskCard
                           variant={
                             isEven(index + 1) ? VARIANTS.PURPLE : VARIANTS.GREEN
                           }
                           task={task}
                         />
                       </NavLink>
                     ))
                   ) : (
                <p className="absolute left-[50%] top-[50%] -translate-x-[50%]">
                  No tasks found, try a different keyword!
                </p>
              )}
              </div> 
              )}
              {/* */}
            </div>
              </>
            )}
            
          </div>
        </Container>
      </Layout>
    </>
  );
}

export default Tasks;
