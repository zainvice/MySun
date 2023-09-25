import React, { useEffect, useState } from "react";
import Container from "../../common/container";
import Layout from "../../layout";
import Heading from "../../common/heading";
import { NavLink } from "react-router-dom";
import ProjectCard, { VARIANTS } from "../../components/projectCard";
import { isEven } from "../../utils";
import { useTranslation } from "react-i18next";
import { getTasks } from "../../api";

function AssignedTasks() {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Fetch tasks when the component mounts
    const fetchTasks = async () => {
      try {
        const taskData = await getTasks();
        setTasks(taskData); // Set the fetched tasks in state
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <Layout activePageName={t("assignedTasks.pageTitle")}>
      <Container>
        <div className="flex justify-between mb-2">
          <Heading title={t("assignedTasks.pageTitle")} />
          <select className="border-2 border-[#00FFD3] text-[#00FFD3] p-2 rounded-full focus-within:outline-none transform transition-transform hover:scale-105 hover:bg-[#00FFD3] hover:text-white">
            <option>{t("assignedTasks.sortByOptions.mostRecent")}</option>
            <option>{t("assignedTasks.sortByOptions.status")}</option>
            <option>{t("assignedTasks.sortByOptions.progress")}</option>
          </select>
        </div>
        <div className="mt-4 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tasks.map((task, index) => (
              <NavLink to="/new-task-assigned" key={task}>
               <div className="transform transition-transform hover:scale-105 hover:shadow-lg">
                <ProjectCard
                  variant={isEven(index + 1) ? VARIANTS.PURPLE : VARIANTS.GREEN}
                  title={task.title} // Assuming task has a title property
                  // You can add other task-related properties here
                />
              </div>
            </NavLink>
          ))}
        </div>
      </Container>
    </Layout>
  );
}

export default AssignedTasks;