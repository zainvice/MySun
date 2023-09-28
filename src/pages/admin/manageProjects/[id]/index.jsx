import Layout from "../../../../layout";
import Heading from "../../../../common/heading";
import Button from "../../../../common/button";
import Container from "../../../../common/container";
import DateInput from "../../../../common/dateInput";
import { useDimensions } from "../../../../hooks";
import { NavLink, useParams } from "react-router-dom";
import { useProjects } from "../../../../context/projectsContext";
import { exportToExcel, formatDate } from "../../../../global";
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

function Project() {
  const dimension = useDimensions();
  const { id } = useParams();
  const { projects } = useProjects();
  const project = projects?.filter((project) => project.projectId === id)[0];
  let workersInProject
  let completedTasks= 0
  let remainingTasks= 0
  useEffect(()=>{

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

   const handleExport = async () => {
      if (!project) {
        // If there's no project, return early
        return;
      }
    
      // Create an array to hold the project data
      const projectData = [];
    
      // Loop through the project object and add each key-value pair to the projectData array
      for (const key in project) {
        if (project.hasOwnProperty(key) && project[key]) {
          projectData.push({ [key]: project[key] });
        }
      }
    
      // Check if any data to export
      if (projectData.length === 0) {
        // No data to export, return early
        return;
      }
    
      // Create a blob with the project data
      const blob = await exportToExcel(projectData);
    
      // Create a download link and trigger the download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "project_data.xlsx";
      a.click();
    
      // Revoke the object URL to free up resources
      window.URL.revokeObjectURL(url);
    };
    

  const onTasksClick = () => {};

  return (
    <Layout activePageName={`Projects / ${id}`}>
      <Container>
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="lg:w-1/3 flex justify-between">
            <Heading title={"Project Details"} />
            {dimension <= 640 && (
              <NavLink to={`/manage-projects/${id}/tasks`}>
                <Button
                  title={`Show Tasks <span class='material-symbols-outlined'>chevron_right</span>`}
                  titleClasses={"flex items-center gap-2"}
                  onClick={onTasksClick}
                />
              </NavLink>
            )}
          </div>
          <div className="flex-1 w-full flex justify-between">
            <div className="flex-1 flex gap-4 justify-between sm:justify-start">
             {/*  <DateInput
                placeholder={"Select from"}
                additionalClasses={`${dateInputClasses} transition-transform transform hover:scale-105`}
              />
              <DateInput
                placeholder={"Select to"}
                additionalClasses={`${dateInputClasses} transition-transform transform hover:scale-105`}
              /> */}
            </div>

            {dimension >= 640 && (
              <NavLink to={`/manage-projects/${id}/tasks`}>
                <Button
                  title={`Show Tasks <span class='material-symbols-outlined'>chevron_right</span>`}
                  titleClasses={"flex items-center gap-2"}
                />
              </NavLink>
            )}
          </div>
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
              <span className="text-[#34F5C5]">{workers?.length}</span>
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
                {completedTasks}
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
                    label: "# of tasks",
                    data: [completedTasks, remainingTasks, remainingTasks],
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
  );
}

export default Project;
