//@ts-ignore
import Container from "../../common/container";
import Heading from "../../common/heading";
import TaskCard, { VARIANTS } from "../../components/taskCard";
import WorkerCard from "../../components/workerCard";
import WorkerDetail from "../worker/workerDetail";
import Layout from "../../layout";
import { NavLink } from "react-router-dom";
function Dashboard() {
  return (
    <Layout activePageName={"Dashboard"}>
      <Container>
        <div className="flex justify-between mb-2">
          <Heading title={"Recent Updates"} />

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
          <div className="sm:w-1/2 md:min-w-[340px] md:w-1/3 transform transition-transform hover:scale-105 hover:shadow-lg">
            <NavLink to="/manage-projects/:id">
              <TaskCard variant={VARIANTS.GREEN} />
            </NavLink>
          </div>
          <div className="flex-1 bg-gradient-to-b from-[#00FFD3] from-60% to-[#37C19F] rounded-3xl p-[3px] shadow-lg">
            <div className="p-4 sm:p- bg-white rounded-[20px] h-full">
              <ul className="font-semibold list-disc list-outside ml-1 sm:ml-4">
                <li className="line-clamp-1">
                  <p>
                    34 <span className="text-[#00FFD3]">Surveys</span> completed
                    today on{" "}
                    <span className="text-[#00FFD3]">12 May, 2023</span>
                  </p>
                </li>

                <li className="mt-1 sm:mt-2 line-clamp-1">
                  <p>
                    12 <span className="text-[#00FFD3]">Surveys</span> remaning
                    for today on{" "}
                    <span className="text-[#00FFD3]">12 May, 2023</span>
                  </p>
                </li>

                <li className="mt-1 sm:mt-2 line-clamp-1">
                  <p>
                    <span className="text-[#00FFD3]">Average 1 hour</span> spent
                    on servays today on{" "}
                    <span className="text-[#00FFD3]">12 May, 2023</span>
                  </p>
                </li>
              </ul>
              <div className="mt-4 flex items-center">
                <img src="./images/stickyNotes.png" />
                <p className="font-semibold">
                  Provide some workers with more clarity for the upcoming
                  projects
                </p>
              </div>
            </div>
          </div>
        </div>
        <Heading title={"Top Workers"} additionalClases={"mb-2 mt-2 sm:mt-4"} />
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          <div className="lg:w-3/5 grid sm:grid-cols-2 gap-4">
            {Array(2)
              .fill(0)
              .map((_, index) => (
                <NavLink
                  to="/worker-detail"
                  key={index}
                  className="hover:transform hover:scale-105 hover:shadow-lg transition-transform duration-300"
                >
                  <WorkerCard />
                </NavLink>
              ))}
          </div>
          <div className="flex-1"></div>
        </div>
      </Container>
    </Layout>
  );
}

export default Dashboard;
