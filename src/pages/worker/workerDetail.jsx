import Layout from "../../layout";
import Heading from "../../common/heading";
import Container from "../../common/container";
import DateInput from "../../common/dateInput";
import { useProjects } from "../../context/projectsContext";
import { useDimensions } from "../../hooks";
import { useParams } from "react-router";
import { useWorkers } from "../../context/workersContext";
import Spinner from "../../common/spinner";
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
import { useState, useEffect } from "react";
import { getWorkers } from "../../api";
ChartJS.register(
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
);

const dateInputClasses = `!font-semibold !text-white !bg-[#2CDEB7] border-none focus-within:!outline-none white-placeholder h-10 !w-40`;

function WorkerDetail(worker) {
  const dimension = useDimensions();
  const {id}= useParams()
  const {projects} = useProjects()
  const {workers } = useWorkers();
  const [workerData, setData]= useState()
  const [surveyData, setSurveys]= useState()
  const [isloading, setloading] = useState(true);
  useEffect(() => {
    if (id) {
      
        if(workers){
          const worker = workers.filter((worker) => worker._id === id);
          setData(worker[0])
          setloading(false)
        }
       
    }
    
  }, [id, workers]);
  useEffect(() => {
    if(projects){
      let completed = 0;
      let inprogress = 0;
      let remaining = 0;
      projects.map(project => {
        
        project?.tasks.forEach(task => {
          console.log("tasks", task.status)
          if (task.status === "Fully Mapped") {
            
            const editBy = task.editedBy?.filter(edit => edit.email === workerData?.email);
            if (editBy?.length > 0) {
              completed++;
            }
          }
          if (task.status !== "Fully Mapped") {
            
            const editBy = task.editedBy?.filter(edit => edit.email === workerData?.email);
            if (editBy?.length > 0) {
              inprogress++;
            }
          }
        });
      });

      setSurveys({
        taskCompleted: completed,
        taskInProgress: inprogress,
        taskIncomplete: remaining,
      });

    }
    
    console.log('Worker Data', workerData)
    console.log("surverys", surveyData)
  }, [workerData])


  return (
    <Layout activePageName={workerData?.fullName+"'s Details"}>
      <Container>
        {isloading? (
          <Spinner/>
        ): (
          <>
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 justify-center">
          <div className="lg:w-1/3 flex justify-between">
            <Heading title={"Worker Details"} />
          </div>
          <div className="flex-1 w-full flex justify-between">
            <div className="flex-1 flex gap-4 justify-between sm:justify-start items-center">
              {/* <DateInput
                placeholder={"Select from"}
                additionalClasses={`${dateInputClasses} transition-transform transform hover:scale-105`}
              />
              <DateInput
                placeholder={"Select to"}
                additionalClasses={`${dateInputClasses} transition-transform transform hover:scale-105`}
              /> */}
             {/*  {dimension > 500 && (
                <div className="flex flex-col items-center mx-auto gap-2">
                  <img src="./images/avatarMale.png" className="w-28 h-28" />
                  <span className="text-sm text-black">{workerData?.fullName}</span>
                </div>
              )} */}
            </div>
          </div>
        </div>

        <div className="py-4">
          <div className="w-full grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <p className="">
              <span className="font-bold mr-3">Worker Name: </span>
              <span className="text-[#2CDEB7]">{workerData?.fullName}</span>
            </p>

            <p className="">
              <span className="font-bold mr-3">Start Date: </span>
              <span className="text-[#2CDEB7]">{new Date(workerData?.createdAt).toLocaleString()}</span>
            </p>

            <p className="">
              <span className="font-bold mr-3">Total Projects: </span>
              <span className="text-[#2CDEB7]">{workerData?.projects.length}</span>
            </p>

            <p className="">
              <span className="font-bold mr-3">Role: </span>
              <span className="text-[#2CDEB7]">{workerData?.role.toUpperCase()}</span>
            </p>
            
          </div>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-3 sm:gap-4 items-center">
          <div>
            <p className="mb-2">
              <span className="inline-block w-10/12 md:w-60">
                Total Surveys Completed
              </span>
              <span className="text-[#00ABE0] before:content-[':'] before:mr-4">
                {surveyData?.taskCompleted}
              </span>
            </p>
            <p className="mb-2">
              <span className="inline-block w-10/12 md:w-60">
                Surveys Remaining
              </span>
              <span className="text[#FF7258] before:content-[':'] before:mr-4">
                {surveyData?.taskIncomplete}
              </span>
            </p>

            <p className="mb-2">
              <span className="inline-block w-10/12 md:w-60">
                Surverys in Progress
              </span>
              <span className="text-[#FFC94A] before:content-[':'] before:mr-4">
              {surveyData?.taskInProgress}
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
                    data: [surveyData?.taskCompletedCount, surveyData?.taskIncomplete, surveyData?.taskIncomplete],
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
                  label: workerData?.fullName,
                  data: [0, 0, 0, 0, 0],
                  backgroundColor: "#23F08A",
                }
              ],
            }}
          />

          <div className="mx-auto sm:w-fit">
            <p className="flex items-center mb-2">
              <span className="w-9/12 md:w-96 line-clamp-1">
                To Date Hours Completed by{" "}
                <span className="text-[#2CDEB7]">{workerData?.fullName}</span>
              </span>
              <span className="before:content-[':'] before:mr-4">{(workerData?.workhours / 3600).toFixed(2)} hrs</span>
            </p>
          </div>
        </div>
          </>
        )}
      </Container>
    </Layout>
  );
}
export default WorkerDetail;
