import { isEven } from "../../utils";
import Layout from "../../layout";
import Heading from "../../common/heading";
import Button from "../../common/button";
import Container from "../../common/container";
import TaskCard, { VARIANTS } from "../../components/taskCard";

function ManageProjects() {
  return (
    <Layout>
      <Container showMoreButton={true} >
        <div className="flex justify-between mb-2">
          <Heading title={"Projects"} />
          <Button title={"Add New Projects"} />
        </div>

        <div className="mt-4 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array(50)
            .fill(0)
            .map((i, index) => (
              <TaskCard
                key={index}
                variant={isEven(index + 1) ? VARIANTS.PURPLE : VARIANTS.GREEN}
              />
            ))}
        </div>
      </Container>
    </Layout>
  );
}

export default ManageProjects;
