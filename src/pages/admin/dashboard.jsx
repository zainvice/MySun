//@ts-ignore
import Container from "../../common/container";
import Heading from "../../common/heading";
import ProjectCard, { VARIANTS } from "../../components/projectCard";
import WorkerCard from "../../components/workerCard";
import WorkerDetail from "../worker/workerDetail";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useWorkers } from "../../context/workersContext";
import Spinner from "../../common/spinner";
import { useProjects } from "../../context/projectsContext";
import jwtDecode from "jwt-decode";
import Layout from "../../layout";
import { getWorkers } from "../../api";
import { NavLink } from "react-router-dom";
import { editNotes } from "../../api";
import { useSelector } from 'react-redux';
import { selectCurrentToken } from "../../features/auth/authSlice";
import Notification from "../../components/taskNotification";
function findProjectByWorker(worker, projects) {
  if(worker){
    console.log("worker", worker)
    const lenght = worker?.projects.length - 1
    console.log("Projects", lenght)
    console.log(worker.projects[lenght], "project")
    const project = projects.find(project => project._id === worker.projects[lenght]);
    console.log(project, "project")
    return worker.projects[lenght];
}
  
  return {Project: "Not Found!"};
}


function Dashboard() {
  const { t } = useTranslation();
  const[notes, setNotes]= useState("No notes!")
  const { projects } = useProjects();
  const {workers } = useWorkers();
  const [isloading, setloading] = useState(true);
  const [project, toDisplay]= useState();
  const [workerNo1, setWorkerNo1] = useState(null);
  const [workerNo2, setWorkerNo2] = useState(null);
  const [tasksremaining, setRemaining]= useState()
  const token = useSelector(selectCurrentToken);
  const userInfo = jwtDecode(token);
  const [avarageTime, setAverge]= useState("")
  const [completed, setCompleted]= useState()
  const [isPLoading, setPLoading]= useState(true)
  const [iswLoading, setwLoading]= useState(true)
  const [selectedFilter, setSelectedFilter] = useState("0");
  const [filteredProjects, setFilteredProjects] = useState([]);
  const[taskTonotify, setTaskNote]= useState([]);
  const [averageTimeTaken, setAverageTimeTaken]= useState()
  useEffect(() => {
    setPLoading(true);
    console.log('IM here')
    if(projects){
      
      
      setTaskNote(
        projects
          .flatMap((project) => project?.tasks?.filter((task) => task.status === "Coordination Letter 1"))
      );
      const filteredData = projects.filter((project) => {
        const projectDate = new Date(project.startDate); 
        const currentDate = new Date();
        
        if (selectedFilter === "0") {
          
          return projectDate.toDateString() === currentDate.toDateString();
          
        } else if (selectedFilter === "7") {
          
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(currentDate.getDate() - 7);
          return projectDate >= sevenDaysAgo;
        } else if (selectedFilter === "15") {
          
          const fifteenDaysAgo = new Date();
          fifteenDaysAgo.setDate(currentDate.getDate() - 15);
          return projectDate >= fifteenDaysAgo;
        } else if (selectedFilter === "30") {
          

          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(currentDate.getDate() - 30);
          return projectDate >= thirtyDaysAgo;
        }
    
        return true; // If no filter is applied, return true for all projects
      });
      
       setFilteredProjects(filteredData); // Set the filtered data in state
        console.log('filered', filteredProjects)
        toDisplay(filteredData[0])
        setPLoading(false)
        setloading(false)
    }
    
  
    //setPLoading(false);
  }, [selectedFilter]);
  console.log("TASKS WITH NOTIFICATION", taskTonotify)
  
  useEffect(() => {
    if (projects) {
      
        if(workers){
          const workerList = workers.filter((worker) => worker.role === "worker");
        
         
          workerList?.forEach((worker) => {
            const completedTasks = worker.tasks.filter((task) => task.status==="Fully Mapped");
            worker.completedTasksCount = completedTasks.length;
            
          });
        
          
          const sortedWorkers = workerList?.sort(
            (a, b) => b.completedTasksCount - a.completedTasksCount
          );
          
          
          const topTwoWorkers = sortedWorkers.slice(0, 2);

          if (topTwoWorkers.length > 0) {
            setWorkerNo1(topTwoWorkers[0]);
          }
          if (topTwoWorkers.length > 1) {
            setWorkerNo2(topTwoWorkers[1]);
          }
          if (topTwoWorkers.length > 0) {
            setWorkerNo1(topTwoWorkers[0]);
            const assignedProject1 = findProjectByWorker(workerNo1, projects);
           
            setWorkerNo1(prevWorkerNo1 => ({ ...prevWorkerNo1, assignedProject: assignedProject1 }));
          }
          if (topTwoWorkers.length > 1) {
            setWorkerNo2(topTwoWorkers[1]);
            const assignedProject2 = findProjectByWorker(workerNo2, projects);
            
            setWorkerNo2(prevWorkerNo2 => ({ ...prevWorkerNo2, assignedProject: assignedProject2 }));
          }
          if(workerNo1){
          workerNo1.assignedProject = findProjectByWorker(workerNo1, projects)
          }
          if(workerNo2){

          }
          
          setloading(false);
          setwLoading(false)
          setPLoading(false)
        }
    }
    if(projects){
      let totalIncompleteTasks = 0;
      
      if(userInfo){
        setNotes(userInfo.UserInfo.notes)
      }
      let totalCompletedTasks = 0;
      let totalremainingTasks = 0;
      let totalCompletedTime = 0;
     
      let totalTasks= 0
      let timeofEachTask= 0
      projects.forEach(project => {
        //console.log('Project Data', project.projectData.tasks)
        totalTasks = totalTasks + project?.tasks?.length
        project.tasks.map((task)=>{
            if(task?.timeTaken){
              timeofEachTask = timeofEachTask + task.timeTaken
            }
        })
        totalCompletedTasks = totalCompletedTasks + project?.tasks?.filter(task => task.status === "Fully Mapped").length
        totalremainingTasks = totalremainingTasks + project?.tasks?.filter(task => task.status !== "Fully Mapped").length
      });
      console.log("Total Tasks", totalTasks, "Time Taken", timeofEachTask)
      setAverageTimeTaken(timeofEachTask/totalTasks);
      setCompleted(totalCompletedTasks)
      setRemaining(totalremainingTasks)
      // Calculate the average time
      const averageTime = totalCompletedTasks > 0 ? totalCompletedTime / totalCompletedTasks : 0;
    
      setAverge(avarageTime)
    }
    
    
  
  
    
  }, [projects]);
  const notificationMessages = taskTonotify?.map((task) => {
    const buildingNumber = task.taskData['building number'];
    const status = task.status;
    const timer = new Date(task.timer);
  
    const today = new Date();
    
  
    const daysRemaining = Math.ceil((timer - today) / (1000 * 60 * 60 * 24));
    const countdown = daysRemaining >= 1 ? `in ${daysRemaining} day${daysRemaining > 1 ? 's' : ''}` : 'today';
  
    const message = {
      taskId: task._id,
      message: `The task ${buildingNumber} was assigned status ${status} on ${new Date(task.updatedAt).toLocaleDateString()}. Please complete it ${countdown}.`
    };
  
    return message;
  });
  

  useEffect(() => {     
    
        
    if(projects){
          
        // Sort the projects by the 'updatedOn' field in descending order
        const sortedProjects = projects?.sort((a, b) => {
          const dateA = new Date(a.updatedOn);
          const dateB = new Date(b.updatedOn);
          return dateB - dateA;
        });
  
        // Get the latest updated project (first item in the sorted array)
        const latestUpdatedProject = sortedProjects[0];
        toDisplay(latestUpdatedProject)
        
      
    }
      
  }, [projects]);

  
  const [saved, isSaved]= useState(false)
  const SaveNotes = (e) =>{
   
    try{
      const email= userInfo.UserInfo.email
      editNotes( {email, notes})
      isSaved(true)
    }catch(error){
      console.log(error)
    }
  }
  
  
  return (
    <Layout activePageName={t("dashboard.title")} notifications={notificationMessages}>
      
      <Container>
      
        <div className="flex justify-between mb-2">
       
          
          <Heading title={t("dashboard.recentUpdates.title")} />

          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="border-2 border-[#00FFD3] text-[#00FFD3] p-2 rounded-full focus-within:outline-none transform transition-transform hover:scale-105 hover:bg-[#00FFD3] hover:text-white"
          >
            <option value="0">Today</option>
            <option value="7">7 Days</option>
            <option value="15">15 Days</option>
            <option value="30">Last Month</option>
          </select>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          {isPLoading? (
            <Spinner/>
          ): (
            <>
             {filteredProjects ? (
              <>
              <div className="sm:w-1/2 md:min-w-[340px] md:w-1/3 ">
            <NavLink to={"/manage-projects/"+project?.projectId} className={'block text-white transform transition-transform hover:scale-105'}>
              <ProjectCard
                    project={project}
                    variant={
                       VARIANTS.GREEN
                    }
                  />
            </NavLink>
          </div>
          <div className="flex-1 bg-gradient-to-b from-[#00FFD3] from-60% to-[#37C19F] rounded-3xl p-[3px] shadow-lg">
            <div className="p-4 sm:p- bg-white rounded-[20px] h-full">
              <ul className="font-semibold list-disc list-outside ml-1 sm:ml-4">
                <li className="line-clamp-1">
                  <p>
                  {completed}{" "}
                    <span className="text-[#00FFD3]">
                      {t("dashboard.statistics.surveysCompleted")}
                    </span>{" "}
                     {new Date(new Date().setDate(new Date().getDate() - parseInt(selectedFilter))).toLocaleDateString()}
                  </p>
                </li>
                <li className="mt-1 sm:mt-2 line-clamp-1">
                  <p>
                  {tasksremaining}{" "}
                    <span className="text-[#00FFD3]">
                      {t("dashboard.statistics.surveysRemaining")}
                    </span>{" "}
                    {new Date(new Date().setDate(new Date().getDate() - parseInt(selectedFilter))).toLocaleDateString()}
                  </p>
                </li>
                <li className="mt-1 sm:mt-2 line-clamp-1">
                  <p>
                    {averageTimeTaken}{" "}
                    <span className="text-[#00FFD3]">
                      {t("dashboard.statistics.averageTimeSpent")}{avarageTime}
                    </span>{" "}
                    {new Date(new Date().setDate(new Date().getDate() - parseInt(selectedFilter))).toLocaleDateString()}
                  </p>
                </li>
              </ul>
              <div className="mt-4 flex items-center">
                <img src="./images/stickyNotes.png" />
                <p className="font-semibold" contentEditable suppressContentEditableWarning={false} onBlur={(e)=>setNotes(e.target.textContent)}>
                  {notes}
                </p>
                
                  <><span class="material-symbols-outlined hover:cursor-pointer hover:color-green-600 transition-300" onClick={SaveNotes}>
                  done
              </span></>
                
                
                
              </div>
            </div>
          </div>
              </>
             ) : (
              <></>
             )}
            </>
          )}
        </div>
        <Heading
          title={t("dashboard.topWorkers.title")}
          additionalClases={"mb-2 mt-2 sm:mt-4"}
        />
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          <div className="lg:w-3/5 grid sm:grid-cols-2 gap-4">
            {iswLoading?(
              <Spinner/>
            ): (
              <>
              {workerNo1?(
                <>
                
                <NavLink
                  to={"/worker-detail/"+workerNo1?._id}                 
                  className="block transform hover:scale-105 transition-transform duration-300"
                >
                  <WorkerCard worker= {workerNo1} />
                </NavLink>
                </>
              ):(
                <p className="text-center font-bold">No top workers found</p>
              )

              }
              {workerNo2?(
                <>
                
                <NavLink
                 to={"/worker-detail/"+workerNo2?._id}                 
                  
                  className="block transform hover:scale-105 transition-transform duration-300"
                >
                  <WorkerCard worker= {workerNo2} />
                </NavLink>
                </>
              ):(
                <></>
              )

              }
               
            
              </>
            )}
          </div>
          <div className="flex-1"></div>
        </div>
      </Container>
    </Layout>
  );
}

export default Dashboard;
