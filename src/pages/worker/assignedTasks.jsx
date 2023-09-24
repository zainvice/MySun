import React from "react";
import Container from "../../common/container";
import Layout from "../../layout";
import Heading from "../../common/heading";
import { NavLink } from "react-router-dom";
import TaskCard, { VARIANTS } from "../../components/taskCard";
import { isEven } from "../../utils";
import { useTranslation } from "react-i18next";

function AssignedTasks() {
  const { t } = useTranslation();

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
          {Array(2)
            .fill(0)
            .map((i, index) => (
              <NavLink to="/new-task-assigned" key={index}>
                <div className="transform transition-transform hover:scale-105 hover:shadow-lg">
                  <TaskCard
                    variant={
                      isEven(index + 1) ? VARIANTS.PURPLE : VARIANTS.GREEN
                    }
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