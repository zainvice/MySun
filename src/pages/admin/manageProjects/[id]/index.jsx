import Layout from "../../../../layout";
import Heading from "../../../../common/heading";
import Button from "../../../../common/button";
import Container from "../../../../common/container";
import DateInput from "../../../../common/dateInput";
import { useDimensions } from "../../../../hooks";
import { NavLink } from "react-router-dom";
import { exportToExcel } from "../../../../global";
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
  const handleExport = async () => {
    const projectData = [
      {
        'Classification': "Commercial",
        "Property number": "saddar",
        "Payment number": "123",
        "Classification explained": "nothing",
        "Property old area": "msjkj",
        "Owner Type": "Company",
        "Owner Id": "000",
        "Property Address": "Business Rd",
        "Owner name": "muskan",
        'Notes':
          "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      },
    ];

    const blob = await exportToExcel(projectData);

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "projects.xlsx";
    a.click();

    window.URL.revokeObjectURL(url);
  };

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
              <NavLink to="/assigned-tasks">
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 sm:gap-4 items-center">
          <div>
            <p className="mb-2">
              <span className="inline-block w-10/12 md:w-60">
                Total Surveys Completed
              </span>
              <span className="text-[#00ABE0] before:content-[':'] before:mr-4">
                35
              </span>
            </p>
            <p className="mb-2">
              <span className="inline-block w-10/12 md:w-60">
                Surveys Remaining
              </span>
              <span className="text[#FF7258] before:content-[':'] before:mr-4">
                12
              </span>
            </p>

            <p className="mb-2">
              <span className="inline-block w-10/12 md:w-60">
                Surverys in Progress
              </span>
              <span className="text-[#FFC94A] before:content-[':'] before:mr-4">
                35
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
                    data: [36, 12, 5],
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
            <p className="flex items-center mb-2">
              <span className="w-10/12 md:w-60 line-clamp-1">
                Surveys Completed by{" "}
                <span className="text-[#34F5C5]">Muhammad Faizan</span>
              </span>
              <span className="before:content-[':'] before:mr-4">35</span>
            </p>

            <p className="flex items-center mb-2">
              <span className="w-10/12 md:w-60 line-clamp-1">
                Surveys Completed by{" "}
                <span className="text-[#34F5C5]">Ali Abdullah</span>
              </span>
              <span className="before:content-[':'] before:mr-4">90</span>
            </p>

            <p className="flex items-center mb-2">
              <span className="w-10/12 md:w-60 line-clamp-1">
                Surveys Completed by{" "}
                <span className="text-[#34F5C5]">Ahmer Shahid</span>
              </span>
              <span className="before:content-[':'] before:mr-4">120</span>
            </p>
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
                  label: "Muhammad Faizan",
                  data: [3, 4, 6, 8, 2],
                  backgroundColor: "#23F08A",
                },
                {
                  label: "Ahmer Shahid",
                  data: [6, 2, 9, 1, 0],
                  backgroundColor: "#5D3E8E",
                },
                {
                  label: "Ali Abdullah",
                  data: [2, 8, 1, 9, 2],
                  backgroundColor: "#686D74",
                },
              ],
            }}
          />

          <div className="mx-auto sm:w-fit">
            <p className="flex items-center mb-2">
              <span className="w-9/12 md:w-96 line-clamp-1">
                Surveys Completed by{" "}
                <span className="text-[#34F5C5]">Muhammad Faizan</span>
              </span>
              <span className="before:content-[':'] before:mr-4">35 hrs</span>
            </p>

            <p className="flex items-center mb-2">
              <span className="w-9/12 md:w-96 line-clamp-1">
                Surveys Completed by{" "}
                <span className="text-[#34F5C5]">Ali Abdullah</span>
              </span>
              <span className="before:content-[':'] before:mr-4">90 hrs</span>
            </p>

            <p className="flex items-center mb-2">
              <span className="w-9/12 md:w-96 line-clamp-1">
                Surveys Completed by{" "}
                <span className="text-[#34F5C5]">Ahmer Shahid</span>
              </span>
              <span className="before:content-[':'] before:mr-4">120 hrs</span>
            </p>
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
