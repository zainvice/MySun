import React, { useEffect, useState, lazy, Suspense } from "react";
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
import { useWorkers } from "../../context/workersContext";
import { exportToExcel } from "../../global";
import filterOverlay from "../../components/filterOverlay";
import Button from "../../common/button";
import FilterOverlay from "../../components/filterOverlay";
const LazyTaskCard = lazy(() => import("../../components/taskCard"));
function Tasks() {
  const { id } = useParams();
  const {workers} = useWorkers()
  const { projects } = useProjects();
  const [filter, setSelectedFilter]= useState([])
  const project = projects?.length
    ? projects?.filter((project) => project?.projectId === id)[0]
    : {};
  const { role }= useAuth()
  ////console.log(projects)
  const[tasks, setTask] = useState(project?.completeData||project?.buildingData?.tasks)
  const [tasksAS, setTasks] = useState(project?.tasks)
  const taskWithMostKeys = tasksAS?.reduce((prevTask, currentTask) => {
    const prevKeys = prevTask?.taskData ? Object.keys(prevTask.taskData).length : 0;
    const currentKeys = currentTask?.taskData ? Object.keys(currentTask.taskData).length : 0;
    
    return prevKeys > currentKeys ? prevTask : currentTask;
}, {});
  const [headings, setHeadings] = useState([]);
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);

  const toggleFilterPopup = () => {
    setIsFilterPopupOpen(!isFilterPopupOpen);
  };
  //console.log("TASK", tasksAS)
  useEffect(()=>{
    if(taskWithMostKeys!==undefined&&taskWithMostKeys!==null&&!isEmpty(taskWithMostKeys)){
           setHeadings(Object.keys(taskWithMostKeys?.taskData));
     }
  }, [taskWithMostKeys])
  tasksAS?.sort((a, b) => {
    const buildingNumberA = a.taskData["building number"];
    const buildingNumberB = b.taskData["building number"];

    
    const [letterA, numberA] = buildingNumberA.match(/[a-zA-Z]+|[0-9]+/g);
    const [letterB, numberB] = buildingNumberB.match(/[a-zA-Z]+|[0-9]+/g);

    
    if (letterA !== letterB) {
        return letterA.localeCompare(letterB);
    }

    
    return parseInt(numberA) - parseInt(numberB);
  });
  //console.log("headings", headings)
  const [Loading, setloading]= useState(true)
  const originalTasks = project?.tasks
  useEffect(()=>{
    ////console.log("Displaying",project?.tasks)
    if(projects!==null&&project?.tasks){
      setloading(false)
    }
    if(project?.tasks){
      setTasks(project?.tasks)
    }
  },[projects])
  const [viewAs, setView]= useState(true)
  const changeView = () =>{
    setVisibleRows(12)
    if(viewAs)
      setView(false)
    else  
      setView(true)
  }
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };





  //EXPORT MANAGMENT

  const handleExport = async (value) => {
    console.log("project", project)
      if (!project) {
        // If there's no project, return early
        return;
      }
      
      
      let projectData
      console.log(tasksAS)
     
      const buildingNumberCounts = {};
      const taske = tasksAS?.map((task) => {
       let history = "No History Found!";
       let historyDate = "No Change"
       let classificationHistory = "No History";
       let classificationHistoryDate = "No Change"
     
       if (task?.statusHistory?.length > 0) {
         const latestStatusHistory = task.statusHistory[task.statusHistory.length - 1];
         history = `Changed from ${latestStatusHistory?.changedFrom} to ${latestStatusHistory?.changedTo} on ${new Date(latestStatusHistory?.changedOn).toLocaleDateString()}`;
         historyDate = `${new Date(latestStatusHistory?.changedOn).toLocaleDateString()}`
       }
     
       if (task?.classificationHistory?.length > 0) {
         const latestClassificationHistory = task.classificationHistory[task.classificationHistory.length - 1];
         classificationHistory = `Changed from ${latestClassificationHistory?.changedFrom} to ${latestClassificationHistory?.changedTo} on ${new Date(latestClassificationHistory?.changedOn).toLocaleDateString()}`;
         classificationHistoryDate= `${new Date(latestClassificationHistory?.changedOn).toLocaleDateString()}`
        }
     
       
       return  {
            "Building Number": task.taskData["building number"],
            "Physical Number": task.taskData["phyiscal number"],
            "Payer Name": task.taskData["payer name"],
            "Payer Number": task.taskData["payer number"],
            "Address": task.taskData["payer address"],
            "Manually Entered": task.manual? "YES": "NO",
            "Current Status": task.status,
            "Status History": history,
            "Classification": task.classification,
            "Classification History": classificationHistory,
            "Coordinated": task.classification === "Coordinated" ? "YES":"NO",
            "Coordination Letter 1 Expired": task.classification === "Coordination Letter 1 Expired"? "YES":"NO",
            "Coordination Letter 2 Expired": task.classification === "Coordination Letter 2 Expired"? "YES":"NO",
            "Refused Survey": task.classification === "Refused Survey"? "YES":"NO",
            "Under Construction": task.stats.includes("Under Construction")? "YES":"NO",
            "Aerial Mapped": task.stats.includes("Aerial Mapped")? "YES":"NO",
            "Missing Information": task.stats.includes("Missing Information")? "YES":"NO",
            "Missing Physical Number": task.stats.includes("Missing Physical Number")? "YES":"NO",
            "Created By": workers.filter((worker)=> worker.email===task?.editedBy.email)[0]?.fullName||"System",
            "Date Created": new Date(task.createdAt).toLocaleString(),
            "Last edited date": new Date(task.updatedAt).toLocaleString(),
            "Floor": task?.floor?.join(","),    
           
         }
       
          
      });
      console.log("TASKS", taske);
      
      projectData = taske
       
     const tasks = project.tasks
      
     console.log("Exporting",projectData)
      // Check if any data to export
      if (projectData?.length === 0) {
        // No data to export, return early
        return;
      }
     
      // Create a blob with the project data
     if(projectData){
      const blob = await exportToExcel(projectData);
      console.log(blob)
      // Create a download link and trigger the download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      let fier = "filtered"

      for (const item of filter) {
        if (item.selectedValue) {
          fier = item.selectedValue;
          break; 
        }
      }
      a.href = url;
      a.download = `tasks_${fier}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
     }
    
      // Revoke the object URL to free up resources
      
  };
  //EXPORT MANAGMENT



  //ROWS MANAGEMENT
  const [loadMore, setLoadMore] = useState(false);

  const tableContainerRef = React.useRef(null);
  const [visibleRows, setVisibleRows] = useState(12); // Initial number of rows
  const [allRows, setAllRows] = useState(tasksAS); // All rows data

  // Function to load more rows
  const loadMoreRows = () => {
    const nextVisibleRows = visibleRows + 12; // Increase the number of visible rows
    setVisibleRows(nextVisibleRows);
  };
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadMoreRows()
          }
        });
      },
      { threshold: 0.1 }
    );

    if (tableContainerRef.current) {
      observer.observe(tableContainerRef.current);
    }

    return () => {
      if (tableContainerRef.current) {
        observer.unobserve(tableContainerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Update the visible rows when tasksAS or other data changes.
    setVisibleRows(12); // Reset to initial number of rows
    setAllRows(tasksAS)
  }, [tasksAS]);




  //ROWS MANAGEMENT


  useEffect(()=>{
    setloading(true);
    if(project?.tasks){
      const tasksCopy = [...project?.tasks];
    let sortedTasks = [];
    /* console.log(filter)
    if(filter==="assigned"){
      setTask(project?.completeData)
      setloading(false)
    }else if(filter==="unassigned"){
      setTask(project?.projectData?.tasks)
      setloading(false)
    }else if(filter==="original"){
      setTask(project?.originalData?.tasks)
      setloading(false)
    } */
    if (filter.length===0) {
      sortedTasks = tasksCopy.sort((taskA, taskB) => {
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
    
    }
    if (filter.some(item => item.selectedValue === "most recent")) {
      
      sortedTasks = tasksCopy.sort((taskA, taskB) => {
        const dateA = new Date(taskA.createdAt);
        const dateB = new Date(taskB.createdAt);
    
        // Compare tasks based on 'createdAt' date in descending order
        return dateB - dateA;
      });
    
      // Update the state with the sorted tasks
      setTasks(sortedTasks)
      
    }
    if (filter.some(item => item.selectedValue === "latest update")) {
      console.log("SORTING BY", filter)
      sortedTasks = tasksCopy.sort((taskA, taskB) => {
        const dateA = new Date(taskA.updatedAt);
        const dateB = new Date(taskB.updatedAt);
    
        // Compare tasks based on 'createdAt' date in descending order
        return dateB - dateA;
      });
    
      // Update the state with the sorted tasks
      setTasks(sortedTasks);
      
    }


    //status
    if (filter.some(item => item.selectedValue === "fully mapped")) {
     
       
        sortedTasks = tasksCopy.filter((task) => task?.status === "Fully Mapped");
      
    } else if (filter.some(item => item.selectedValue === "field mapped")) {
      
        sortedTasks = tasksCopy.filter((task) => task?.status === "Field Mapped");
     
    } else if (filter.some(item => item.selectedValue === "drawing ready")) {
      
      sortedTasks = tasksCopy.filter((task) => task?.status === "Drawing Ready");
   
    } else if (filter.some(item => item.selectedValue === "gis ready")) {
      
        sortedTasks = tasksCopy.filter((task) => task?.status === "GIS Ready");
     
    } else if (filter.some(item => item.selectedValue === "checked")) {
      
      sortedTasks = tasksCopy.filter((task) => task?.status === "Checked");
   
    } else if (filter.some(item => item.selectedValue === "submitted")) {
      
      sortedTasks = tasksCopy.filter((task) => task?.status === "Submitted");
 
    } else if (filter.some(item => item.selectedValue === "pending")&& filter.some(item => item.optgroup === "-Status-")) {
      console.log("DID PENDING FILTERATION")
      sortedTasks = tasksCopy.filter((task) => task?.status === "Pending");

    }
    

    //Classification

    if (filter.some(item => item.selectedValue === "coordination letter 1")) {
      
      if(sortedTasks.length>0){
        
        const newtasks = sortedTasks.filter((task) => task?.classification === "Coordination Letter 1");
        sortedTasks = newtasks
      }else{
        sortedTasks = tasksCopy.filter((task) => task?.classification === "Coordination Letter 1");
      }
      
    } else if (filter.some(item => item.selectedValue === "coordination letter 2")) {
      
      if(sortedTasks.length>0){
        
        const newtasks = sortedTasks.filter((task) => task?.classification === "Coordination Letter 2");
        sortedTasks = newtasks
      }else{
        sortedTasks = tasksCopy.filter((task) => task?.classification === "Coordination Letter 2");
      }
      
    } else if (filter.some(item => item.selectedValue === "coordination letter 1 expired")) {
      
      if(sortedTasks.length>0){
        
        const newtasks = sortedTasks.filter((task) => task?.classification === "Coordination Letter 1 Expired");
        sortedTasks = newtasks
      }else{
        sortedTasks = tasksCopy.filter((task) => task?.classification === "Coordination Letter 1 Expired");
      }
      
    } else if (filter.some(item => item.selectedValue === "coordination letter 2 expired")) {
      
      if(sortedTasks.length>0){
        
        const newtasks = sortedTasks.filter((task) => task?.classification === "Coordination Letter 2 Expired");
        sortedTasks = newtasks
      }else{
        sortedTasks = tasksCopy.filter((task) => task?.classification === "Coordination Letter 2 Expired");
      }
      
    } else if (filter.some(item => item.selectedValue === "refused survey")) {
      
      if(sortedTasks.length>0){
        
        const newtasks = sortedTasks.filter((task) => task?.classification === "Refused Survey");
        sortedTasks = newtasks
      }else{
        sortedTasks = tasksCopy.filter((task) => task?.classification === "Refused Survey");
      }
      
    } else if (filter.some(item => item.selectedValue === "pending")&& filter.some(item => item.optgroup === "-Classification-")) {
      
      if(sortedTasks.length>0){
        
        const newtasks = sortedTasks.filter((task) => task?.classification === "Pending");
        sortedTasks = newtasks
      }else{
        sortedTasks = tasksCopy.filter((task) => task?.classification === "Pending");
      }
      
    }
    
    //Property Type
    if (filter.some(item => item.selectedValue === "residential")) {
      
      if(sortedTasks.length>0){
        
        const newtasks = sortedTasks.filter((task) => task?.propertyType?.includes("Residential"));
        sortedTasks = newtasks
      }else{
        sortedTasks = tasksCopy.filter((task) => task?.propertyType?.includes("Residential"));
      }
      
    } else if (filter.some(item => item.selectedValue === "business")) {
      
      if(sortedTasks.length>0){
        
        const newtasks = sortedTasks.filter((task) => task?.propertyType?.includes("Business"));
        sortedTasks = newtasks
      }else{
        sortedTasks = tasksCopy.filter((task) => task?.propertyType?.includes("Business"));
      }
      
    } else if (filter.some(item => item.selectedValue === "industry")) {
      
      if(sortedTasks.length>0){
        
        const newtasks = sortedTasks.filter((task) => task?.propertyType?.includes("Industry"));
        sortedTasks = newtasks
      }else{
        sortedTasks = tasksCopy.filter((task) => task?.propertyType?.includes("Industry"));
      }
      
    } else if (filter.some(item => item.selectedValue === "agricultural")) {
      
      if(sortedTasks.length>0){
        
        const newtasks = sortedTasks.filter((task) => task?.propertyType?.includes("Agricultural"));
        sortedTasks = newtasks
      }else{
        sortedTasks = tasksCopy.filter((task) => task?.propertyType?.includes("Agricultural"));
      }
      
    } else if (filter.some(item => item.selectedValue === "government")&& filter.some(item => item.optgroup === "-Property Type-")) {
      
      if(sortedTasks.length>0){
        
        const newtasks = sortedTasks.filter((task) => task?.propertyType?.includes("Government"));
        sortedTasks = newtasks
      }else{
        sortedTasks = tasksCopy.filter((task) => task?.propertyType?.includes("Government"));
      }
      
    }

    //stats
    if (filter.some(item => item.selectedValue === "missing information")) {
      
      if(sortedTasks.length>0){
        
        const newtasks = sortedTasks.filter((task) => task?.stats?.includes("Missing Information"));
        sortedTasks = newtasks
      }else{
        sortedTasks = tasksCopy.filter((task) => task?.stats?.includes("Missing Information"));
      }
      
    } else if (filter.some(item => item.selectedValue === "under construction")) {
      
      if(sortedTasks.length>0){
        
        const newtasks = sortedTasks.filter((task) => task?.stats?.includes("Under Construction"));
        sortedTasks = newtasks
      }else{
        sortedTasks = tasksCopy.filter((task) => task?.stats?.includes("Under Construction"));
      }
      
    } else if (filter.some(item => item.selectedValue === "Aerial Mapped")) {
      
      if(sortedTasks.length>0){
        
        const newtasks = sortedTasks.filter((task) => task?.stats?.includes("Aerial Mapped"));
        sortedTasks = newtasks
      }else{
        sortedTasks = tasksCopy.filter((task) => task?.stats?.includes("Aerial Mapped"));
      }
      
    } else if (filter.some(item => item.selectedValue === "missing physical number")) {
      
      if(sortedTasks.length>0){
        
        const newtasks = sortedTasks.filter((task) => task?.stats?.includes("Missing Physical Number"));
        sortedTasks = newtasks
      }else{
        sortedTasks = tasksCopy.filter((task) => task?.stats?.includes("Missing Physical Number"));
      }
      
    } else if (filter.some(item => item.selectedValue === "pending")&& filter.some(item => item.optgroup === "-Stats-")) {
      
      if(sortedTasks.length>0){
        
        const newtasks = sortedTasks.filter((task) => task?.stats?.includes("Pending"));
        sortedTasks = newtasks
      }else{
        sortedTasks = tasksCopy.filter((task) => task?.stats?.includes("Pending"));
      }
      
    }

    //BUIDING NUMBER 
    if (filter.some(item => item.selectedValue === "a")) {
      
      if(sortedTasks.length>0){
        
        const newtasks = sortedTasks.filter((task) => task.taskData['building number'].includes("A"));
        sortedTasks = newtasks
      }else{
        sortedTasks = tasksCopy.filter((task) => task.taskData['building number'].includes("A"));
      }
      
    } else if (filter.some(item => item.selectedValue === "b")) {
      
      if(sortedTasks.length>0){
        
        const newtasks = sortedTasks.filter((task) => task.taskData['building number'].includes("B"));
        sortedTasks = newtasks
      }else{
        console.log(tasksCopy)
        sortedTasks = tasksCopy.filter((task) => task.taskData['building number'].includes("B"));
      }
      
    } else if (filter.some(item => item.selectedValue === "c")) {
      
      if(sortedTasks.length>0){
        
        const newtasks = sortedTasks.filter((task) => task.taskData['building number'].includes("C"));
        sortedTasks = newtasks
      }else{
        console.log(tasksCopy)
        sortedTasks = tasksCopy.filter((task) => task.taskData['building number'].includes("C"));
      }
      
    } else if (filter.some(item => item.selectedValue === "a-z")) {
      
      if(sortedTasks.length>0){
        
        const newtasks = sortedTasks
        sortedTasks = newtasks
      }else{
        console.log(tasksCopy)
        sortedTasks = tasksCopy
      }
      
    } else if (filter.some(item => item.selectedValue === "z-a")) {
      
      if(sortedTasks.length>0){
        
        const newtasks = sortedTasks.reverse()
        sortedTasks = newtasks
      }else{
        console.log(tasksCopy)
        sortedTasks = tasksCopy.reverse()
      }
      
    }
    if (filter.some(item => item.selectedValue === "manual")) {
      
      if(sortedTasks.length>0){
        
        const newtasks = sortedTasks.filter(task=> task?.manual===true)
        sortedTasks = newtasks
      }else{
        console.log(tasksCopy)
        sortedTasks = tasksCopy.filter(task=> task?.manual===true)
      }
      
    }





    setTasks(sortedTasks)
    setloading(false)
    if(sortedTasks.length>0)
        setloading(false)
    }
    
        
  },[filter])
  useEffect(()=>{
    ////console.log("Displaying",project?.tasks)
     // Filter the tasks based on the searchTerm
    const filteredTasks = project?.tasks?.filter((task) => {
    const buildingNumberr = task.taskData["building number"]|| task.taskData["buildingNumber"];
    // Convert buildingNumber to a string for comparison
    const buildingNumberString = buildingNumberr?.toString();
    return buildingNumberString?.includes(searchTerm.toUpperCase());
    });
    ////console.log("Filtered Tasks:", filteredTasks);
    setTasks(filteredTasks)
  },[searchTerm])

  const buildingNumberCounts = {};
  const tasksBN = tasksAS?.map((task) => {
  return task.taskData
});

tasksBN?.sort((a, b) => {
  const buildingNumberA = a["building number"]||a["buildingNumber"];
  const buildingNumberB = b["building number"]||b["buildingNumber"];
  
  return buildingNumberA.localeCompare(buildingNumberB);
});

  return (
    <>
      <Layout activePageName={`Projects / ${id} / Tasks`}>
        <Container>
          <div >
          <div className="flex justify-between mb-2">
            <Heading title={"Project Tasks"}></Heading>
             
              <div className="flex flex-row">
             
              

              

               {/* <>
               <span class="material-symbols-outlined">tune</span>
               </> */}
               <>
              
                {!viewAs? (
                  <button className=" bg-[#00FFD3] hover:bg-[#00C7A6] rounded-lg content-center w-5/2 h-10 hover:ease-in-out duration-300 shadow-md">
                  <span className="justify-center material-symbols-outlined text-4xl rounded text-white hover:cursor-pointer hover:text-white-200" 
                  onClick={changeView}
                  >
                  toc
                 </span>
                 </button>
                ): (
                  <>
                  
                
                  <button className=" bg-[#00FFD3] hover:bg-[#00C7A6] rounded-lg content-center w-[3.0rem] h-10 hover:ease-in-out duration-300 shadow-md">
                  <span className="justify-center material-symbols-outlined text-4xl text-white hover:cursor-pointer hover:text-white-200" 
                  onClick={changeView}
                  >
                 aod_tablet
                  </span>
                  </button>
                  </>
                )}
               </>
               <button
                onClick={toggleFilterPopup}
                className="ml-5 w-2/3 bg-[#00FFD3] hover:bg-[#00C7A6] rounded-lg content-center w-[3.0rem] h-10 hover:ease-in-out duration-300 shadow-md"
              ><span class="material-symbols-outlined text-3xl text-white hover:cursor-pointer hover:text-white-200 justify-center">
              tune
              </span></button>
             </div>
              </div>
            <div className={`my-4 ${isFilterPopupOpen ? 'opacity-100' : 'opacity-0 invisible'} transition-opacity duration-300 ease-in-out`}>
            {isFilterPopupOpen && (
                
               
                  
                <FilterOverlay setSelectedFilter={setSelectedFilter} filter={filter}  viewAs={viewAs} setloading={setloading}/>
              
            )}
            </div>
            {Loading?(
                <Spinner/>
            ):(
              <>
            
           
            <div className="my-4 ">
           
              <div className="flex items-center justify-center">
               {/*   <label className="mr-5 font-bold text-1xl">Search: </label> */}
              <div className="h-10 rounded-full bg-gray-200 text-black px-4 lg:w-1/4 sm:w-1/3 sm:mr-4">
               
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-gray-200 w-3/4 mr-8 mt-2"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              <Button additionalClasses={"text-sm"} title={filter.length>0 ? "Export Filtered Tasks": "Export Tasks"} onClick={() => { handleExport(); }} />
            </div>
            
              {!viewAs? (
                 <>
                 {tasksAS?.length>0?(
                <table className="w-full bg-white border-separate border-spacing-y-3" ref={tableContainerRef}>
                <thead>
                  <tr className="bg-white text-gray-800 text-sm font-thin">
                    <th className="px-3 text-lg">Status</th>
                    <th className="px-3 text-lg">Classification</th>
                    <th className="px-3 text-lg">Property Type</th>
                    <th className="px-3 text-lg">Stats</th>
                    {headings?.length > 0 &&
                      headings?.map((heading) => (
                        <th key={heading} className="px-3 text-lg">
                          {heading}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody className="rounded-full text-center text-sm font-thin">
                  {visibleRows > 0 ? (
                    allRows?.slice(0, visibleRows).map((task, index) => (
                      <tr className="bg-gray-200 w-[60%]" key={index}>
                        <td className="p4 pl-8 rounded-l-full ">
                          <NavLink to={`/task/${task._id}`}>{task?.status}</NavLink>
                        </td>
                        <td className="p3">
                          <NavLink to={`/task/${task._id}`}>{task?.classification}</NavLink>
                        </td>
                        <td className="p3">
                          <NavLink to={`/task/${task._id}`}>{task?.propertyType}</NavLink>
                        </td>
                        <td className="p3">
                          <NavLink to={`/task/${task._id}`}>{task?.stats}</NavLink>
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
                    <tr>
                      <td colSpan={headings?.length + 1}>
                        No Combinations Found, complete some tasks first!
                      </td>
                    </tr>
                  )}
                  {/* "Load More" button */}
                  {visibleRows < allRows?.length && (
                    <tr>
                      <td colSpan={headings?.length + 1}>
                        <button className="hover:font-bold hover:text-[#00FFD3]" onClick={loadMoreRows}>------------Load More---------------</button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              ):(
                <>
                <p className="absolute left-[50%] top-[50%] -translate-x-[50%]">
                  No task combinations found, try something different!
                </p>
                </>
              )}  
                 </>
              
              ): (
                <div className="mt-4 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                {tasksAS?.length>0?(
                  <>
                  {visibleRows > 0 ? (
                  allRows?.slice(0, visibleRows)?.map((task, index) => (
                    <NavLink
                      to={'/task/' + task?._id}
                      key={task?._id}
                      className="transform transition-transform hover:scale-105 inlne-block"
                    >
                      <TaskCard
                        variant={isEven(index + 1) ? VARIANTS.PURPLE : VARIANTS.GREEN}
                        task={task}
                      />
                    </NavLink>
                  ))
                ) : (
                  <p className="absolute left-[50%] top-[50%] -translate-x-[50%]">
                    No tasks found, try a different keyword!
                  </p>
                )}
                {/* "Load More" button */}
                {visibleRows < allRows?.length && (
                  <>
                  <div></div>
                  <div className="text-center mt-4 w-full">
                    <button className="hover:font-bold hover:text-[#00FFD3]" onClick={loadMoreRows}>------------Load More---------------</button>
                  </div>
                  </>
                )}
                  </>
                ):(
                  <>
                  <p className="absolute left-[50%] top-[50%] -translate-x-[50%]">
                    No task combinations found, try something different!
                  </p>
                  </>
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
