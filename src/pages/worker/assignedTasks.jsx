import React from "react";
import Container from "../../common/container";
import Layout from "../../layout";
import Heading from "../../common/heading";
import TaskCard, { VARIANTS } from "../../components/taskCard";
import { isEven } from "../../utils";

function AssignedTasks() {
  return (
    <Layout>
      <Container>
        <Heading title={"Assigned Tasks"} />
        <div className="mt-4 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array(2)
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

export default AssignedTasks;
