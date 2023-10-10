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
import { createTask } from "../../../../api";

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
    const buildingNumber = task.taskData["building number"];
    const letter = buildingNumber.charAt(0);
    const number = parseInt(buildingNumber.slice(1));

    if (!isNaN(number)) {
      if (!letterToMaxNumberMap.has(letter) || number > letterToMaxNumberMap.get(letter)) {
        letterToMaxNumberMap.set(letter, number);
      }
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
  const { isOpen, onOpen, onClose } = useModal();
  const dimension = useDimensions();
  const { id } = useParams();
  const { projects } = useProjects();
  const [isloading, setloading]= useState(false)
  const project = projects?.filter((project) => project.projectId === id)[0];
  let workersInProject
  let completedTasks= 0
  let remainingTasks= 0
  const [allWorkers, setWorkers]= useState()
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
  const workers = project?.workers
    ?.map((worker) => worker?.fullName)
    ?.join(", ");

  const [value, setValue]= useState()
  useEffect(()=>{
    handleExport()
  }, [value])
   const handleExport = async () => {
      if (!project) {
        // If there's no project, return early
        return;
      }
      console.log("project", project)
      // Create an array to hold the project data
      const taskDataArray = project.tasks.map((task) => task.taskData);
      let projectData
      if(value==="updated"){
          const buildingNumberCounts = {};
          const taske = project?.completeData;
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
      const tasks = project.tasks
      // Loop through the project object and add each key-value pair to the projectData array
      /* for (const key in project) {
        if (project.hasOwnProperty(key) && project[key]) {
          projectData.push({ [key]: project[key] });
        }
      } */
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
      // Create a download link and trigger the download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "project_data.xlsx";
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
  console.log(project)
  const nextBuildingNumber = getNextBuildingNumber(project?.tasks)

  const onCreateTask = async() =>{
    setloading(true)
    setMessage(`Please wait, creating task ${nextBuildingNumber} in ${project?.projectName}`)
    const supervisord = project?.workers.find((worker)=> worker.role==='supervisor')
  
    console.log("BUILDING NUMBER", nextBuildingNumber)
    try{
      const task = {

        projectId: project?._id,
        taskData:{
          "building number": nextBuildingNumber
        },
        supervisor: supervisord
      }
      setTimeout(4000)
      await createTask({task});
      setTimeout(4000)
      setMessage("Successfully created!")
      setTimeout(2000)
      setloading(false)
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
    {isloading?(
          <div className="flex flex-col h-full w-full bg-black bg-opacity-40 flex items-center justify-center absolute z-10">
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
               <div className="relative inline-block text-left">
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
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"

            >
              Show Tasks
            </button>
            </NavLink>
            <button
              type="button"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
              onClick={onOpen}
            >
              Add A New Worker
            </button>
            <button
              type="button"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
              onClick={onCreateTask}
              
            >
               Add A New Task
            </button>
            <button
              type="button"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
              onClick={()=>{setValue("original")}}
              
            >
               Download Original Data
            </button>
            <button
              type="button"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
              onClick={()=>{setValue("updated")}}
              
            >
               Download Updated Data
            </button>
          </div>
        </div>
      ):(
        <>
        </>
      )}
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

            <p className="">
              <span className="font-bold mr-3">Workers: </span>
              <span className="text-[#34F5C5]">{workers}</span>
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 sm:gap-4 items-center">
          <div>
            <p className="mb-2">
              <span className="inline-block w-10/12 md:w-60">
                Total Surveys Completed
              </span>
              <span className="text-[#00ABE0] before:content-[':'] before:mr-4">
                {project?.completeData?.length}
              </span>
            </p>
            <p className="mb-2">
              <span className="inline-block w-10/12 md:w-60">
                Total surveys remaining
              </span>
              <span className="text[#FF7258] before:content-[':'] before:mr-4">
                {remainingTasks}
              </span>
            </p>

            <p className="mb-2">
              <span className="inline-block w-10/12 md:w-60">
                Surverys in Progress
              </span>
              <span className="text-[#FFC94A] before:content-[':'] before:mr-4">
              {remainingTasks}
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
                    data: [project?.completeData?.length, remainingTasks, remainingTasks],
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
                <span className="before:content-[':'] before:mr-4">XXX</span>
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
            onClick={handleExport}
          />
        </div>
        
      </Container>
      
    </Layout>
    <Modal isOpen={isOpen} onClose={onClose}>
        <WorkerOverlay
          workers={allWorkers}
          addedWorkers={project?.workers}
          projectId={id}
        />
      </Modal>
      </>
  );
}

export default Project;
