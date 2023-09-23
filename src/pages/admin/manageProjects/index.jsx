import { isEven } from "../../../utils";
import Layout from "../../../layout";
import Heading from "../../../common/heading";
import { NavLink } from "react-router-dom";
import Button from "../../../common/button";
import Container from "../../../common/container";
import TaskCard, { VARIANTS } from "../../../components/taskCard";

function ManageProjects() {
  const isAdmin = sessionStorage.getItem("Role") === "admin";
  return (
    <Layout activePageName={"Projects"}>
      <Container showMoreButton={true}>
        <div className="flex justify-between mb-2">
          <Heading title={"Projects"} />
          {isAdmin && (
            <NavLink to="/new-project">
              <Button title={"Add New Projects"} />
            </NavLink>
          )}
        </div>

        <div className="mt-4 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array(50)
            .fill(0)
            .map((i, index) => (
              <div
                key={index}
                className="relative group bg-white rounded-lg shadow-sm hover:shadow-lg transform hover:scale-105 transition-transform duration-300"
              >
                <TaskCard
                  variant={isEven(index + 1) ? VARIANTS.PURPLE : VARIANTS.GREEN}
                />
              </div>
            ))}
        </div>
      </Container>
    </Layout>
  );
}

export default ManageProjects;
