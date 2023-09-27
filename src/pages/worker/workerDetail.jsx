import Layout from "../../layout";
import Heading from "../../common/heading";
import Container from "../../common/container";
import DateInput from "../../common/dateInput";
import { useDimensions } from "../../hooks";
import { useParams } from "react-router";
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

const dateInputClasses = `!font-semibold !text-white !bg-[#34F5C5] border-none focus-within:!outline-none white-placeholder h-10 !w-40`;

function WorkerDetail(worker) {
  const dimension = useDimensions();
  const {id}= useParams()
  const [workerData, setData]= useState()
  const [surveyData, setSurveys]= useState()
  const [isloading, setloading] = useState(true);
  useEffect(() => {
    if (id) {
      getWorkers()
        .then((data) => {
          const worker = data.filter((worker) => worker._id === id);
          setData(worker[0])
          setloading(false)
        })
    }
    
  }, [id]);
  useEffect(() => {
    if (workerData) {
      const taskCompleted = workerData.tasks.filter((task) => task.completed);
      const taskIncomplete = workerData.tasks.filter((task) => !task.completed);
      const taskCompletedCount = taskCompleted.length;
      const taskIncompleteCount = taskIncomplete.length;
      setSurveys({
        taskCompleted: taskCompleted, // Corrected this line
        taskCompletedCount: taskCompletedCount,
        taskIncomplete: taskIncompleteCount,
      });
    }
    console.log('Worker Data', workerData)
    console.log("surverys", surveyData)
  }, [workerData])


  return (
    <Layout>
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
              {dimension > 500 && (
                <div className="flex flex-col items-center mx-auto gap-2">
                  <img src="./images/avatarMale.png" className="w-28 h-28" />
                  <span className="text-sm text-black">{workerData?.fullName}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="py-4">
          <div className="w-full grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <p className="">
              <span className="font-bold mr-3">Worker Name: </span>
              <span className="text-[#34F5C5]">{workerData?.fullName}</span>
            </p>

            <p className="">
              <span className="font-bold mr-3">Start Date: </span>
              <span className="text-[#34F5C5]">{new Date(workerData?.createdAt).toLocaleString()}</span>
            </p>

            <p className="">
              <span className="font-bold mr-3">Total Projects: </span>
              <span className="text-[#34F5C5]">{workerData?.projects.length}</span>
            </p>

            <p className="">
              <span className="font-bold mr-3">Role: </span>
              <span className="text-[#34F5C5]">{workerData?.role}</span>
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
                {surveyData?.taskCompletedCount}
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
              {surveyData?.taskIncomplete}
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
                  data: [3, 4, 6, 8, 2],
                  backgroundColor: "#23F08A",
                }
              ],
            }}
          />

          <div className="mx-auto sm:w-fit">
            <p className="flex items-center mb-2">
              <span className="w-9/12 md:w-96 line-clamp-1">
                Hours Completed by{" "}
                <span className="text-[#34F5C5]">{workerData?.fullName}</span>
              </span>
              <span className="before:content-[':'] before:mr-4">Hours HHHH</span>
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
