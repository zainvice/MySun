//@ts-ignore
import Container from "../../common/container";
import Heading from "../../common/heading";
import ProjectCard, { VARIANTS } from "../../components/projectCard";
import WorkerCard from "../../components/workerCard";
import WorkerDetail from "../worker/workerDetail";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { getProjects } from "../../api";
import Spinner from "../../common/spinner";
import { useProjects } from "../../context/projectsContext";
import Layout from "../../layout";
import { getWorkers } from "../../api";
import { NavLink } from "react-router-dom";
function findProjectByWorker(worker, projects) {
  
  const project = projects.find(project => project._id === worker.projects[0]);
  
  return project;
}

function Dashboard() {
  const { t } = useTranslation();
  const { projects, setProjects } = useProjects();
  const [workers, setWorkers] = useState([]);
  const [isloading, setloading] = useState(true);
  const [project, toDisplay]= useState();
  const [workerNo1, setWorkerNo1] = useState(null);
  const [workerNo2, setWorkerNo2] = useState(null);
  
  useEffect(() => {
    if (projects) {
      getWorkers()
        .then((data) => {
   
          const workerList = data.filter((worker) => worker.role === "worker");
        
         
          workerList.forEach((worker) => {
            const completedTasks = worker.tasks.filter((task) => {
              // I'll define completed crieteria here
              //tasksCompleted++
            });
            worker.completedTasksCount = completedTasks.length;
          });
        
          
          const sortedWorkers = workerList.sort(
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
          
          workerNo1.assignedProject = findProjectByWorker(workerNo1, projects)
          setWorkers(data);
          setloading(false);
        })
        .catch((error) => {
          console.error("Error fetching workers:", error);
        });
    }
  }, [projects]);


  useEffect(() => {     
    getProjects()
      .then((data) => {
        setProjects(data);
        
  
        // Sort the projects by the 'updatedOn' field in descending order
        const sortedProjects = data.sort((a, b) => {
          const dateA = new Date(a.updatedOn);
          const dateB = new Date(b.updatedOn);
          return dateB - dateA;
        });
  
        // Get the latest updated project (first item in the sorted array)
        const latestUpdatedProject = sortedProjects[0];
        toDisplay(latestUpdatedProject)
        // Display the latest updated project
        console.log("Latest Updated Project:", latestUpdatedProject);
      })
      .catch(() => localStorage.removeItem("projects"))
      .finally(() => setloading(false));
  }, []);

  return (
    <Layout activePageName={t("dashboard.title")}>
      <Container>
        <div className="flex justify-between mb-2">
          <Heading title={t("dashboard.recentUpdates.title")} />

          <select className="border-2 border-[#00FFD3] text-[#00FFD3] p-2 rounded-full focus-within:outline-none transform transition-transform hover:scale-105 hover:bg-[#00FFD3] hover:text-white">
            Showing for
            <option
              value={1}
              className="border-2 border-[#00FFD3] text-[#00FFD3] p-2 rounded-full focus-within:outline-none transform transition-transform hover:scale-105 hover:bg-[#00FFD3] hover:text-white"
            >
              {"Today"}
            </option>
            <option
              value={7}
              className="border-2 border-[#00FFD3] text-[#00FFD3] p-2 rounded-full focus-within:outline-none transform transition-transform hover:scale-105 hover:bg-[#00FFD3] hover:text-white"
            >
              {"7 Days"}
            </option>
            <option
              value={15}
              className="border-2 border-[#00FFD3] text-[#00FFD3] p-2 rounded-full focus-within:outline-none transform transition-transform hover:scale-105 hover:bg-[#00FFD3] hover:text-white"
            >
              {"15 Days"}
            </option>
            <option
              value={30}
              className="border-2 border-[#00FFD3] text-[#00FFD3] p-2 rounded-full focus-within:outline-none transform transition-transform hover:scale-105 hover:bg-[#00FFD3] hover:text-white"
            >
              {"Last Month"}
            </option>
          </select>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <div className="sm:w-1/2 md:min-w-[340px] md:w-1/3 ">
            <NavLink to="/manage-projects/:id" className={'block text-white transform transition-transform hover:scale-105'}>
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
                    34{" "}
                    <span className="text-[#00FFD3]">
                      {t("dashboard.statistics.surveysCompleted")}
                    </span>{" "}
                    on DATE
                  </p>
                </li>
                <li className="mt-1 sm:mt-2 line-clamp-1">
                  <p>
                    12{" "}
                    <span className="text-[#00FFD3]">
                      {t("dashboard.statistics.surveysRemaining")}
                    </span>{" "}
                    on DATE
                  </p>
                </li>
                <li className="mt-1 sm:mt-2 line-clamp-1">
                  <p>
                    <span className="text-[#00FFD3]">
                      {t("dashboard.statistics.averageTimeSpent")}
                    </span>{" "}
                    on DATE
                  </p>
                </li>
              </ul>
              <div className="mt-4 flex items-center">
                <img src="./images/stickyNotes.png" />
                <p className="font-semibold">
                  {t("dashboard.workerDetail.clarityMessage")}
                </p>
              </div>
            </div>
          </div>
        </div>
        <Heading
          title={t("dashboard.topWorkers.title")}
          additionalClases={"mb-2 mt-2 sm:mt-4"}
        />
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          <div className="lg:w-3/5 grid sm:grid-cols-2 gap-4">
            
                <NavLink
                  to="/worker-detail"
                  
                  className="block transform hover:scale-105 transition-transform duration-300"
                >
                  <WorkerCard worker= {workerNo1} />
                </NavLink>
                <NavLink
                  to="/worker-detail"
                  
                  className="block transform hover:scale-105 transition-transform duration-300"
                >
                  <WorkerCard worker= {workerNo2} />
                </NavLink>
            
          </div>
          <div className="flex-1"></div>
        </div>
      </Container>
    </Layout>
  );
}

export default Dashboard;
