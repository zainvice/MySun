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
import { exportToExcel } from "../../global";
import Button from "../../common/button";
const LazyTaskCard = lazy(() => import("../../components/taskCard"));
function Tasks() {
  const { id } = useParams();
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
  //console.log("TASK", tasksAS)
  useEffect(()=>{
    if(taskWithMostKeys!==undefined&&taskWithMostKeys!==null&&!isEmpty(taskWithMostKeys)){
           setHeadings(Object.keys(taskWithMostKeys?.taskData));
     }
  }, [taskWithMostKeys])
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
           ...task.taskData,
           "Status": task.status,
           "Classification": task.classification,
           "Lastest Update On": new Date(task.updatedAt).toLocaleString(),
           "Property Type": task.propertyType?.join(', '),
           "Stats": task.stats?.join(', '),
           "Latest Status Change": history,
           "Status Change Date": historyDate,
           "Latest Classification Change": classificationHistory,
           "Classification Change Date": classificationHistoryDate
           
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
 
    } else if (filter.some(item => item.selectedValue === "pending")&& filter.some(item => item.optgroup === "Status")) {
      
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
      
    } else if (filter.some(item => item.selectedValue === "pending")&& filter.some(item => item.optgroup === "Classification")) {
      
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
      
    } else if (filter.some(item => item.selectedValue === "government")&& filter.some(item => item.optgroup === "Property Type")) {
      
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
      
    } else if (filter.some(item => item.selectedValue === "ariel mapped")) {
      
      if(sortedTasks.length>0){
        
        const newtasks = sortedTasks.filter((task) => task?.stats?.includes("Ariel Mapped"));
        sortedTasks = newtasks
      }else{
        sortedTasks = tasksCopy.filter((task) => task?.stats?.includes("Ariel Mapped"));
      }
      
    } else if (filter.some(item => item.selectedValue === "missing physical number")) {
      
      if(sortedTasks.length>0){
        
        const newtasks = sortedTasks.filter((task) => task?.stats?.includes("Missing Physical Number"));
        sortedTasks = newtasks
      }else{
        sortedTasks = tasksCopy.filter((task) => task?.stats?.includes("Missing Physical Number"));
      }
      
    } else if (filter.some(item => item.selectedValue === "pending")&& filter.some(item => item.optgroup === "Stats")) {
      
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
              <select
              value={"Default"} // Assuming filter is a state variable
              onChange={(e) => {
                const selectedValue = e.target.value;
                if (selectedValue === "assignment") {
                  setSelectedFilter([]);
                
                } else {
                  const optgroup = e.target.options[e.target.selectedIndex].closest('optgroup')?.label;
                  
                  //console.log(optgroup)
                  setSelectedFilter((prevSelectedOptions) => {
                    // Create a copy of the previous selected options
                    let updatedOptions = [...prevSelectedOptions];
              
                    
                    
                    const isOptionSelected = prevSelectedOptions.some(item => item.optgroup === optgroup && item.selectedValue === selectedValue);

                    // Create a copy of the previous selected options
                    updatedOptions = prevSelectedOptions.filter(item => !(item.optgroup === optgroup && item.selectedValue === selectedValue));
                    updatedOptions = updatedOptions.filter((option) => option.optgroup !== optgroup);            
                    // If the option wasn't selected, add it to the list
                    if (!isOptionSelected) {
                      updatedOptions.push({ optgroup, selectedValue });
                    }
                    // Add the newly selected option
                    //updatedOptions.push({optgroup: optgroup, selectedValue: selectedValue});
                    console.log('update:', updatedOptions)
                    return updatedOptions;
                  });
                 
                }
                setloading(true);
              }}
                className="w-2/3 h-[65%] lg:h-[100%] border-2 border-[#00FFD3] text-[#00FFD3] p-2 rounded-full focus-within:outline-none transform transition-transform hover:bg-[#00FFD3] hover:text-white"
              >
                <option value={filter.map(item => item.selectedValue).join(', ')} selected={""}>{filter.length>0? filter.map(item => item.selectedValue.toUpperCase()).join(', ').toUpperCase(): "Default".toUpperCase()}</option>
                <option value={"assignment"} selected={filter?.includes('assignment')}>{"Default"}</option>
                <optgroup label={"Status"}>
                  <option value="fully mapped" selected={filter.some(item => item.selectedValue === 'fully mapped')}>
                    Fully Mapped {filter.some(item => item.selectedValue === 'fully mapped') && '✓'}
                  </option>
                  <option value="field mapped" selected={filter.some(item => item.selectedValue === 'field mapped')}>
                    Field Mapped {filter.some(item => item.selectedValue === 'field mapped') && '✓'}
                  </option>
                  <option value="drawing ready" selected={filter.some(item => item.selectedValue === 'drawing ready')}>
                    Drawing Ready {filter.some(item => item.selectedValue === 'drawing ready') && '✓'}
                  </option>
                  <option value="gis ready" selected={filter.some(item => item.selectedValue === 'gis ready')}>
                    GIS Ready {filter.some(item => item.selectedValue === 'gis ready') && '✓'}
                  </option>
                  <option value="checked" selected={filter.some(item => item.selectedValue === 'checked')}>
                    Checked {filter.some(item => item.selectedValue === 'checked') && '✓'}
                  </option>
                  <option value="submitted" selected={filter.some(item => item.selectedValue === 'submitted')}>
                    Submitted {filter.some(item => item.selectedValue === 'submitted') && '✓'}
                  </option>
                  <option value="pending" selected={filter.some(item => item.selectedValue === 'pending')}>
                    Pending {filter.some(item => item.selectedValue === 'pending') && '✓'}
                  </option>
                </optgroup>
                <optgroup label={"Property Type"}>
                  <option value="residential" selected={filter.some(item => item.selectedValue === 'residential')}>
                    Residential {filter.some(item => item.selectedValue === 'residential') && '✓'}
                  </option>
                  <option value="business" selected={filter.some(item => item.selectedValue === 'business')}>
                    Business {filter.some(item => item.selectedValue === 'business') && '✓'}
                  </option>
                  <option value="industry" selected={filter.some(item => item.selectedValue === 'industry')}>
                    Industry {filter.some(item => item.selectedValue === 'industry') && '✓'}
                  </option>
                  <option value="agricultural" selected={filter.some(item => item.selectedValue === 'agricultural')}>
                    Agricultural {filter.some(item => item.selectedValue === 'agricultural') && '✓'}
                  </option>
                  <option value="government" selected={filter.some(item => item.selectedValue === 'government')}>
                    Government{filter.some(item => item.selectedValue === 'government') && '✓'}
                  </option>
                </optgroup>
                <optgroup label={"Classification"}>
                  <option value="coordination letter 1" selected={filter.some(item => item.selectedValue === 'coordination letter 1')}>
                    Coordination Letter 1 {filter.some(item => item.selectedValue === 'coordination letter 1') && '✓'}
                  </option>
                  <option value="coordination letter 2" selected={filter.some(item => item.selectedValue === 'coordination letter 2')}>
                    Coordination Letter 2 {filter.some(item => item.selectedValue === 'coordination letter 2') && '✓'}
                  </option>
                  <option value="coordination letter 1 expired" selected={filter.some(item => item.selectedValue === 'coordination letter 1 expired')}>
                    Coordination Letter 1 Expired {filter.some(item => item.selectedValue === 'coordination letter 1 expired') && '✓'}
                  </option>
                  <option value="coordination letter 2 expired" selected={filter.some(item => item.selectedValue === 'coordination letter 2 expired')}>
                    Coordination Letter 2 Expired {filter.some(item => item.selectedValue === 'coordination letter 2 expired') && '✓'}
                  </option>
                  <option value="refused survey" selected={filter.some(item => item.selectedValue === 'refused survey')}>
                    Refused Survey {filter.some(item => item.selectedValue === 'refused survey') && '✓'}
                  </option>
                  <option value="pending" selected={filter.some(item => item.selectedValue === 'pending')}>
                    Pending {filter.some(item => item.selectedValue === 'pending') && '✓'}
                  </option>
                </optgroup>
                <optgroup label={"Stats"}>
                  <option value="under construction" selected={filter.some(item => item.selectedValue === 'under construction')}>
                    Under Construction {filter.some(item => item.selectedValue === 'under construction') && '✓'}
                  </option>
                  <option value="ariel mapped" selected={filter.some(item => item.selectedValue === 'ariel mapped')}>
                    Ariel Mapped {filter.some(item => item.selectedValue === 'ariel mapped') && '✓'}
                  </option>
                  <option value="missing information" selected={filter.some(item => item.selectedValue === 'missing information')}>
                    Missing Information {filter.some(item => item.selectedValue === 'missing information') && '✓'}
                  </option>
                  <option value="missing physical number" selected={filter.some(item => item.selectedValue === 'missing physical number')}>
                    Missing Physical Number {filter.some(item => item.selectedValue === 'missing physical number') && '✓'}
                  </option>
                  <option value="pending" selected={filter.some(item => item.selectedValue === 'pending')}>
                    Pending {filter.some(item => item.selectedValue === 'pending') && '✓'}
                  </option>
                </optgroup>
                <optgroup label={!viewAs ? "Building Number" : "Building Number"}>
                  <option value="a" selected={filter.some(item => item.selectedValue === 'a')}>
                    A1-AX {filter.some(item => item.selectedValue === 'a') && '✓'}
                  </option>
                  <option value="b" selected={filter.some(item => item.selectedValue === 'b')}>
                    B1-BX {filter.some(item => item.selectedValue === 'b') && '✓'}
                  </option>
                  <option value="c" selected={filter.some(item => item.selectedValue === 'c')}>
                    C1-CX {filter.some(item => item.selectedValue === 'c') && '✓'}
                  </option>
                  <option value="a-z" selected={filter.some(item => item.selectedValue === 'a-z')}>
                    All from A-Z {filter.some(item => item.selectedValue === 'a-z') && '✓'}
                  </option>
                  <option value="z-a" selected={filter.some(item => item.selectedValue === 'z-a')}>
                    All from Z-A {filter.some(item => item.selectedValue === 'z-a') && '✓'}
                  </option>
                </optgroup>
                <option value={!viewAs ? "most recent" : "most recent"}>
                  {!viewAs ? "Most Recent" : "Most Recent"}
                </option>
                <option value={!viewAs ? "latest update" : "latest update"}>
                  {!viewAs ? "Latest Update" : "Latest Update"}
                </option>
                <option value={!viewAs ? "manual" : "manual"}>
                  {!viewAs ? "Manually Entered" : "Manually Entered"}
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
            {Loading?(
                <Spinner/>
            ):(
              <>
            
            <div className="my-4 ">
            {!viewAs?(<></>):(
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
             )}
              {!viewAs? (
                <table className="w-full bg-white border-separate border-spacing-y-3" ref={tableContainerRef}>
                <thead>
                  <tr className="bg-white text-gray-800 text-sm font-thin">
                    <th className="px-3 text-lg">Status</th>
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
