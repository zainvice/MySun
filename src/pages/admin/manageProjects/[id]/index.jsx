import Layout from "../../../../layout";
import Heading from "../../../../common/heading";
import Button from "../../../../common/button";
import Container from "../../../../common/container";
import DateInput from "../../../../common/dateInput";
import { useDimensions } from "../../../../hooks";
import { NavLink, useParams } from "react-router-dom";
import { useProjects } from "../../../../context/projectsContext";
import { exportToExcel, formatDate } from "../../../../global";
import Modal from "../../../../common/modal";
import WorkerOverlay from "../../../../components/workerOverlay2";
import { useModal } from "../../../../hooks";
import { getWorkers } from "../../../../api";
import { RingLoader } from "react-spinners";
import Spinner from "../../../../common/spinner";
import AddTaskModal from "../../../../components/AddTaskModal";
import ConfirmModal from "../../../../components/ConfirmModal";
import ConfirmRWorker from "../../../../components/ConfirmRWorker";
import { deleteProject } from "../../../../api";
import { useNavigate } from "react-router-dom";
import { editRWProject } from "../../../../api";
import {
  Chart as ChartJS, 
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { createWTask } from "../../../../api";

ChartJS.register(
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
);

const dateInputClasses = `!font-semibold !text-white !bg-[#34F5C5] border-none focus-within:!outline-none white-placeholder h-10 !w-40`;

function getNextBuildingNumber(tasks) {
  // Create a map to store the highest number for each letter
  const letterToMaxNumberMap = new Map();

  // Loop through existing tasks to find the maximum number for each letter
  tasks?.forEach((task) => {
    try {
      const buildingNumber = task.taskData["building number"];
      const letter = buildingNumber.charAt(0);
      const number = parseInt(buildingNumber.slice(1));

      if (!isNaN(number)) {
          if (!letterToMaxNumberMap.has(letter) || number > letterToMaxNumberMap.get(letter)) {
              letterToMaxNumberMap.set(letter, number);
          }
      }
  } catch (error) {
      console.error("Error occurred in taskData:", task.taskData);
      console.error("Error message:", error.message);
  }
  });

  // Find the next available building number
  let nextBuildingNumber;

  for (const letter of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
    const maxNumberForLetter = letterToMaxNumberMap.get(letter) || 0;
    if (maxNumberForLetter < 12) {
      nextBuildingNumber = `${letter}${maxNumberForLetter + 1}`;
      break;
    }
  }

  // If no available number was found, start with 'A1'
  if (!nextBuildingNumber) {
    nextBuildingNumber = 'A1';
  }

  return nextBuildingNumber;
}


function Project() {
  const navigate = useNavigate()
  const { isOpen, onOpen, onClose } = useModal();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isConfirmRModalOpen, setIsConfirmRModalOpen] = useState(false);
  const dimension = useDimensions();
  const { id } = useParams();
  const { projects, setFetch, reFetch } = useProjects();
  const [isloading, setloading]= useState(false)
  const [deleting, isDeleting] = useState(false)
  const project = projects?.filter((project) => project.projectId === id)[0];
  let workersInProject
  let completedTasks= 0
  let remainingTasks= 0
  
  const [allWorkers, setWorkers]= useState()
  const [workerToDelete, setWorkerToDelete] = useState(null);

  const handleDeleteWorker = (worker) => {
    setWorkerToDelete(worker);
    setIsConfirmRModalOpen(true);
  };
  const onDelete = async () =>{
    try{
      isDeleting(true)
      const response = await deleteProject({projectId: project?._id})
      console.log(response)
      reFetch()
      navigate('/dashboard')
      window.location.reload()
      
    }catch(error){
      console.error(error)
    }
  }
  const openConfirmModal = () => {
    setIsConfirmModalOpen(true);
  };
 

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };
  const closeConfirmRModal = () => {
    setWorkerToDelete(null);
    setIsConfirmRModalOpen(false);
  };
  const removeWorkerFromProject = async() =>{
    closeConfirmRModal()
    //setloading(true)
    setMessage(`Please wait, removing ${workerToDelete?.fullName} from ${project?.projectName}`)
    const workersToSend = project?.workers?.filter((worker)=> worker?.email!== workerToDelete.email)
    try{
      const response = await editRWProject({ projectId: project?.projectId, workers: workersToSend, removedWorker: workerToDelete })
      console.log(response)
      reFetch()
      //setloading(false)
      window.location.reload()
    }catch(error){
      //setloading(false)
      console.error(error)
    }
  }
  useEffect(() => {
    getWorkers().then((data) => {
      setWorkers(
        data?.filter((worker) => worker.role.toLowerCase() === "worker") ?? []
      );
    });
  }, []);
  useEffect(()=>{
  console.log(project)
 
  }, [project])
  if (project) {
    const completedTask = project.projectData.tasks.filter(task => task.completed);
    
    const workerInProject = project.workers.filter(worker => worker.role !== 'supervisor');
    
    workersInProject= workerInProject
    const workerTasksCount = {};
      
    completedTask.forEach(task => {
      const assignedWorkerId = task.worker; 
      const assignedWorker = workerInProject.find(worker => worker._id === assignedWorkerId);
      
      if (assignedWorker) {
        const workerName = assignedWorker.name;
        if (!workerTasksCount[workerName]) {
          workerTasksCount[workerName] = 1;
        } else {
          workerTasksCount[workerName]++;
        }
      }
    });




    project.projectData.tasks.forEach(task => {
      if (task.completed) {
        completedTasks++;
      } else {
        remainingTasks++;
      }
    });
  }
  const supervisor = project?.workers?.filter(
    (worker) => worker.role === "supervisor"
  )[0]?.fullName;
  

  //ADD TASK MODAL
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);  
  const [tasktoAdd, setTaskToAdd] = useState()
  const openAddTaskModal = () => {
    console.log("OPENED")
    setIsAddTaskModalOpen(true);
  };

  const closeAddTaskModal = () => {
    console.log("CLOSED")
    setIsAddTaskModalOpen(false);
    setValue("no")
  };




  const [value, setValue]= useState()




  useEffect(()=>{
    console.log("exporting")
    handleExport(value)
    console.log(value)
    if(value==="Add New"){
      
      openAddTaskModal()
    }
  }, [value])
   const handleExport = async (value) => {
    console.log("project", project)
      if (!project) {
        // If there's no project, return 
        return;
      }
      
      // Create an array to hold the project data
      const taskDataArray = project.tasks.map((task) => task.taskData);
      let projectData
      if(value==="updated"){
          const buildingNumberCounts = {};
          const taske = project?.tasks?.map((task) => {
            let history="No History Found!"
            if(task?.statusHistory?.length>0){
              const latestStatusHistory = task?.statusHistory[task?.statusHistory?.length - 1];
              history = `Changed from ${latestStatusHistory?.changedFrom} to ${latestStatusHistory?.changedTo} on ${new Date(latestStatusHistory?.changedOn).toLocaleDateString()}`
            }
              return { ...task.taskData };
          });
          console.log("TASKS", taske);
          const tasksBN = taske?.map((task, index) => {
            const buildingNumber = task["building number"];
            if (buildingNumberCounts[buildingNumber] === undefined) {
              buildingNumberCounts[buildingNumber] = 1;
            } else {
              buildingNumberCounts[buildingNumber]++;
            }
          
            const count = buildingNumberCounts[buildingNumber];
          
            if (count > 1) {
              return {
                ...task,
                "building number": `${buildingNumber}-${count}`
              };
            } else {
              return task;
            }
          });
          tasksBN?.sort((a, b) => {
            const buildingNumberA = a["building number"];
            const buildingNumberB = b["building number"];
            
            return buildingNumberA.localeCompare(buildingNumberB);
          });
          projectData = tasksBN
       }
      if(value==="original")
          projectData = project?.originalData?.tasks
      if(value==="original-buildings"){
          projectData = project?.tasks.map(task=>{
            return {"building number": task.taskData["building number"]}
          })
      }
      if(value==="unassigned"){
          projectData = project?.projectData?.tasks.map(task=>{
            return {...task}
          })
      }
      if(value==="building"){
        projectData =[{"building number": ""}]
          
     }
      const tasks = project.tasks
      
     //console.log(projectData)
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
      a.href = url;
      a.download = `${project?.projectName}_data_${value}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
     }
    
      // Revoke the object URL to free up resources
      
    };
    

  const onTasksClick = () => {};
  const [isOpen2, setIsOpen2] = useState(false);

  const toggleDropdown = () => {
    console.log("option", isOpen2)
    if(isOpen2===true)
      setIsOpen2(false);
    else
      setIsOpen2(true)
  };

  useEffect(()=>{
    console.log(tasktoAdd, "Adding Tasks")
    if(tasktoAdd){
      onCreateTask()
    }
  }, [tasktoAdd])
  const nextBuildingNumber = getNextBuildingNumber(project?.tasks)

  const onCreateTask = async() =>{
    setloading(true)
    setMessage(`Please wait, creating tasks ${tasktoAdd[0]} - ${tasktoAdd[tasktoAdd.length-1]} in ${project?.projectName}`)
    const supervisord = project?.workers.find((worker)=> worker.role==='supervisor')
  
    console.log("BUILDING NUMBER", tasktoAdd)
    try{
      const task = {

        projectId: project?._id,
        taskData:{
          "building number": tasktoAdd[0]
        },
        supervisor: supervisord
      }
      await createWTask({tasks: tasktoAdd, task});
      setMessage("Successfully created!")
      setloading(false)
      reFetch();
      window.location.reload()
    }catch(error){
      console.log("Error occured!", error)
      setloading(false)
    }
  }
  const [message, setMessage]= useState("")
  return (
    <>
    <Layout activePageName={`Projects / ${id}`}>
      {project ? (
        <>
        {isloading?(
          <div className="flex flex-col bg-black bg-opacity-40 w-full h-full flex items-center justify-center absolute z-10">
          <RingLoader color="#FFC94A" size={150}/>
          <p className="mt-3 text-[#FFC94A] text-4xl font-bold text-center">{message}</p>
        </div>

        ):(
          <></>
        )}
      <Container>
        
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="lg:w-full flex justify-between">
           
            <Heading title={"Project Details"} />
            <p className="text-[#FFC94A] font-bold text-base">{message}</p>
           
               {/*  <Button
                  title={`ADD A WORKER <span class='material-symbols-outlined'>add</span>`}
                  titleClasses={"flex items-center gap-2"}
                  onClick={onOpen}
                />
                <Button
                  title={`ADD A TASK <span class='material-symbols-outlined'>add</span>`}
                  titleClasses={"flex items-center gap-2"}
                  onClick={onOpen}
                />
              
            
              <NavLink to={`/manage-projects/${id}/tasks`}>
                <Button
                  title={`Show Tasks <span class='material-symbols-outlined'>chevron_right</span>`}
                  titleClasses={"flex items-center gap-2"}
                  onClick={onTasksClick}
                />
              </NavLink> */}
      <div className="flex ">
               <div className="relative inline-block text-left mr-3">
      <button
        type="button"
        className="inline-flex justify-center items-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={toggleDropdown}
      >
        Options <span class='material-symbols-outlined text-sm'>expand_more</span>
      </button>
      

      {isOpen2 ? (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1 " role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
          <NavLink to={`/manage-projects/${id}/tasks`}>
            <button
              type="button"
              className="block px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"

            >
              Show Tasks
            </button>
            </NavLink>
            <button
              type="button"
              className="block px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
              onClick={onOpen}
            >
              Add A New Worker
            </button>
            <button
              type="button"
              className="block px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
              onClick={()=>{setValue("Add New")}}
              
            >
               Add A New Task
            </button>
           
            <button
              type="button"
              className="block px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
              onClick={()=>{setValue("updated")}}
              
            >
               Download Updated Data
            </button>
            <button
              type="button"
              className="block px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
              onClick={()=>{setValue("original")}}
              
            >
               Download Original Properties Data
            </button>
            <button
              type="button"
              className="block px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
              onClick={()=>{setValue("original-buildings")}}
              
            >
               Download Original Buildings Data
            </button>
            <button
              type="button"
              className="block px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
              onClick={()=>{setValue("unassigned")}}
              
            >
               Download Unassigned Data
            </button>
            <button
              type="button"
              className="block px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
              onClick={()=>{setValue("building")}}
              
            >
               Download Empty Building Data
            </button>
          </div>
        </div>
      ):(
        <>
        </>
      )}
    </div>
    <div onClick={openConfirmModal}>
    <p
       
       className="inline-flex cursor-pointer justify-center items-center w-full px-4 py-2 text-[12px] font-medium hover:ease-in-out transition-300 text-black hover:text-white bg-white border border-gray-300 rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
       
     >
      
                 <span class="material-symbols-outlined">
                     delete
                     </span>
                
     </p>
    </div>
    </div>     
             
          </div>
          {/* <div className="flex-1 w-full flex justify-between">
            <div className="flex-1 flex gap-4 justify-between sm:justify-start">
             {/*  <DateInput
                placeholder={"Select from"}
                additionalClasses={`${dateInputClasses} transition-transform transform hover:scale-105`}
              />
              <DateInput
                placeholder={"Select to"}
                additionalClasses={`${dateInputClasses} transition-transform transform hover:scale-105`}
              /> */}
            {/* </div>

            {dimension >= 640 && (
              <NavLink to={`/manage-projects/${id}/tasks`}>
                <Button
                  title={`Show Tasks <span class='material-symbols-outlined'>chevron_right</span>`}
                  titleClasses={"flex items-center gap-2"}
                />
              </NavLink>
            )}
          </div> */} 
        </div>

        <div className="py-4">
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <p className="">
              <span className="font-bold mr-3">Project Name: </span>
              <span className="text-[#34F5C5]">{project?.projectName}</span>
            </p>

            <p className="">
              <span className="font-bold mr-3">Start Date: </span>
              <span className="text-[#34F5C5]">
                {formatDate(project?.startDate)}
              </span>
            </p>

            <p className="">
              <span className="font-bold mr-3">End Date: </span>
              <span className="text-[#34F5C5]">
                {formatDate(project?.endDate)}
              </span>
            </p>

            <p className="">
              <span className="font-bold mr-3">Assigned Workers: </span>
              <span className="text-[#34F5C5]">{project?.workers?.length}</span>
            </p>

            <p className="">
              <span className="font-bold mr-3">Supervisor: </span>
              <span className="text-[#34F5C5]">{supervisor}</span>
            </p>

            <p className="flex">
              <span className="font-bold mr-3">Workers: </span>
              <span className="text-[#34F5C5]  flex flex-row  justify-between">{project?.workers?.filter((worker) => worker.role !== 'supervisor').map((worker) => (
                <>
                  {'-'}
                  <div key={worker.id} className="flex ">
                    <span className="text-[#34F5C5]">{worker.fullName.split(" ")[0]}</span>
                    
                      <span className="text-[#34F5C5] material-symbols-outlined text-[14px] hover:text-red-600 transition-300 cursor-pointer" onClick={() => handleDeleteWorker(worker)}>delete</span>
                    
                  </div>
                  
                  </>
                ))}</span>
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 sm:gap-4 items-center">
          <div>
            <p className="mb-2">
              <span className="text-[#00ABE0] font-bold inline-block w-10/12 md:w-60">
                Total Surveys Completed
              </span>
              <span className="text-[#00ABE0] font-bold before:content-[':'] before:mr-4">
                {project?.tasks?.filter(task => task.status === "Fully Mapped").length}
              </span>
            </p>
            <p className="mb-2">
              <span className="text-[#FF7258] font-bold inline-block w-10/12 md:w-60">
                Total surveys remaining
              </span>
              <span className="text-[#FF7258] font-bold before:content-[':'] before:mr-4">
                {project?.tasks?.filter(task => task.status === "Pending").length}
              </span>
            </p>

            <p className="mb-2">
              <span className="text-[#FFC94B] font-bold inline-block w-10/12 md:w-60">
                Surverys in Progress
              </span>
              <span className="text-[#FFC94B] font-bold before:content-[':'] before:mr-4">
              {project?.tasks?.filter(task => task.status !== "Pending" && task.status !== "Fully Mapped").length}
              </span>
            </p>
          </div>
          <div className="w-40 h-40 md:w-60 md:h-60 mx-auto">
            <Doughnut
              title="Data"
              data={{
                datasets: [
                  {
                    label: "Number of tasks",
                    data: [project?.tasks?.filter(task => task.status === "Fully Mapped").length, project?.tasks?.filter(task => task.status === "Pending").length, project?.tasks?.filter(task => task.status !== "Pending" && task.status !== "Fully Mapped").length],
                    weight: 2,
                    clip: 4,
                    backgroundColor: ["#00ABE0", "#FF7258", "#FFC94A"],
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                cutout: "70%",
              }}
            />
          </div>

          <div>
            
          {Array.isArray(workersInProject) ? (
            workersInProject.map((worker) => (
              <p className="flex items-center mb-2" key={worker._id}>
                <span className="w-9/12 md:w-90 line-clamp-1">
                  Surveys Completed by{" "}
                  <span className="text-[#34F5C5]">{worker.fullName}</span>
                </span>
                <span className="before:content-[':'] before:mr-4">{project?.tasks.filter(task=> {
                  if(task.status==="Fully Mapped"){
                   
                    const editBy = task.editedBy?.filter(edit=> edit.email===worker.email)
                    if(editBy?.length>0){
                      return task
                    }
                  }})?.length}</span>
              </p>
            ))
          ) : (
            <p>No workers available</p>
          )}
          </div>
        </div>

        <div className="mt-8 md:w-8/12 max-w-[700px] mx-auto">
          <Bar
            options={{
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                title: { text: "Number of hours worked" },
              },
            }}
            data={{
              labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
              datasets: [
                {
                  label: "XXXXXXX",
                  data: [3, 4, 6, 8, 2],
                  backgroundColor: "#23F08A",
                },
                {
                  label: "XXXXXX",
                  data: [6, 2, 9, 1, 0],
                  backgroundColor: "#5D3E8E",
                },
                {
                  label: "XXXXXXX",
                  data: [2, 8, 1, 9, 2],
                  backgroundColor: "#686D74",
                },
              ],
            }}
          />

          <div className="mx-auto sm:w-fit">
          {Array.isArray(workersInProject) ? (
            workersInProject.map((worker) => (
              <p className="flex items-center mb-2" key={worker._id}>
                <span className="w-9/12 md:w-96 line-clamp-1">
                  Hours Completed by{" "}
                  <span className="text-[#34F5C5]">{worker.fullName}</span>
                </span>
                <span className="before:content-[':'] before:mr-0">XXX</span>
              </p>
            ))
          ) : (
            <p>No workers available</p>
          )}
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            title={
              'Export to Excel <span class="material-symbols-outlined">chevron_right</span>'
            }
            titleClasses={"flex items-center"}
            onClick={()=>{setValue("updated")}}
          />
        </div>
        <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onRequestClose={closeAddTaskModal}
        setTaskAdding={setTaskToAdd}
        tasks={project?.tasks}
       /> 
       <ConfirmModal
        isOpen={isConfirmModalOpen}
        onRequestClose={closeConfirmModal}
        onDelete={onDelete}
        deleting={deleting}
       />
       <ConfirmRWorker
        isOpen={isConfirmRModalOpen}
        onRequestClose={closeConfirmRModal}
        onRemove={removeWorkerFromProject}
        worker={workerToDelete}
       />
      </Container>
        </>
      ): (
       
        <Spinner />
        
      )}
      
    </Layout>
    <Modal isOpen={isOpen} onClose={onClose}>
        <WorkerOverlay
          
          addedWorkers={project?.workers}
          projectId={id}
        />
      </Modal>
      </>
  );
}

export default Project;
