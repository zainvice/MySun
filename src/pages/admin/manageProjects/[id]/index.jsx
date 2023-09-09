import Layout from "../../../../layout";
import Heading from "../../../../common/heading";
import Button from "../../../../common/button";
import Container from "../../../../common/container";
import DateInput from "../../../../common/dateInput";
import { useDimensions } from "../../../../hooks";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const dateInputClasses = `!font-semibold !text-white !bg-[#34F5C5] border-none focus-within:!outline-none white-placeholder h-10 w-[160px]`;

function Project() {
  const dimension = useDimensions();
  return (
    <Layout>
      <Container>
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="lg:w-1/3 flex justify-between">
            <Heading title={"Project Details"} />
            {dimension <= 640 && (
              <Button
                title={`Show Tasks <span class='material-symbols-outlined'>chevron_right</span>`}
                titleClasses={"flex items-center gap-2"}
              />
            )}
          </div>
          <div className="flex-1 w-full flex justify-between">
            <div className="flex-1 flex gap-4 justify-between sm:justify-start">
              <DateInput
                placeholder={"Select from"}
                additionalClasses={dateInputClasses}
              />
              <DateInput
                placeholder={"Select to"}
                additionalClasses={dateInputClasses}
              />
            </div>

            {dimension >= 640 && (
              <Button
                title={`Show Tasks <span class='material-symbols-outlined'>chevron_right</span>`}
                titleClasses={"flex items-center gap-2"}
              />
            )}
          </div>
        </div>

        <div className="py-4">
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <p className="">
              <span className="font-bold mr-3">Project Name: </span>
              <span className="text-[#34F5C5]">Develop Sun's prject</span>
            </p>

            <p className="">
              <span className="font-bold mr-3">Start Date: </span>
              <span className="text-[#34F5C5]">Mon, Jan 4, 2012</span>
            </p>

            <p className="">
              <span className="font-bold mr-3">End Date: </span>
              <span className="text-[#34F5C5]">Mon, Jan 4, 2012</span>
            </p>

            <p className="">
              <span className="font-bold mr-3">Assigned Workers: </span>
              <span className="text-[#34F5C5]">3</span>
            </p>

            <p className="">
              <span className="font-bold mr-3">Supervisor: </span>
              <span className="text-[#34F5C5]">Muhammad Faizan</span>
            </p>

            <p className="">
              <span className="font-bold mr-3">Workers: </span>
              <span className="text-[#34F5C5]">
                Muhammad Faizan, Sudais Malik, Ali Abdullah
              </span>
            </p>
          </div>
        </div>

        <div className="w-40 h-40">
          <Doughnut
            title="Data"
            data={{
              datasets: [
                {
                  label: "# of Numbers",
                  data: [36, 12, 5],
                  weight: 2,
                  backgroundColor: ["red", "yellow", "blue"],
                },
              ],
              labels: ["Completed", "Remaining", "Inprogres"],
            }}
          />
        </div>
      </Container>
    </Layout>
  );
}

export default Project;
