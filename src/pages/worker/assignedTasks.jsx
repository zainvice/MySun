import React from "react";
import Container from "../../common/container";
import Layout from "../../layout";
import Heading from "../../common/heading";
import { NavLink } from "react-router-dom";
import TaskCard, { VARIANTS } from "../../components/taskCard";
import { isEven } from "../../utils";

function AssignedTasks() {
  return (
    <Layout>
      <Container>
        <div className="flex justify-between mb-2">
          <Heading title={"Assigned Tasks"} />
          <select className="border-2 border-[#00FFD3] text-[#00FFD3] p-2 rounded-full focus-within:outline-none">
            <option>Most Recent</option>
            <option>Status</option>
            <option>Progress</option>
          </select>
        </div>
        <div className="mt-4 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array(2)
            .fill(0)
            .map((i, index) => (
              <NavLink to="/new-task-assigned">
              <TaskCard
                key={index}
                variant={isEven(index + 1) ? VARIANTS.PURPLE : VARIANTS.GREEN}
              />
            </NavLink>
            
            ))}
        </div>
      </Container>
    </Layout>
  );
}

export default AssignedTasks;
