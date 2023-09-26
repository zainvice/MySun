import React, { useEffect, useState } from "react";
import Container from "../../common/container";
import Layout from "../../layout";
import Heading from "../../common/heading";
import { NavLink } from "react-router-dom";
import ProjectCard, { VARIANTS } from "../../components/projectCard";
import { isEven } from "../../utils";
import { useTranslation } from "react-i18next";
import { getTasks } from "../../api";
import jwtDecode from "jwt-decode";
import TaskCard from "../../components/taskCard";
import Spinner from "../../common/spinner";
import _ from "lodash";

function AssignedTasks() {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState([]);
  const [isloading, setloading] = useState(true);

  useEffect(() => {
    const { UserInfo } = jwtDecode(sessionStorage.getItem("accessToken")) ?? {};
    const userTasks = UserInfo?.tasks ?? [];
    (async () => {
      try {
        const response = await getTasks();
        const tasks = response?.data ?? [];
        if (userTasks?.length > 0) {
          const filteredTasks = tasks?.filter((task) =>
            userTasks.includes(task?._id)
          );
          localStorage.setItem("tasks", JSON.stringify(filteredTasks));
          setTasks(filteredTasks);
        }
      } catch (error) {
        localStorage.removeItem("tasks");
        console.error("Error fetching tasks:", error);
      } finally {
        setloading(false);
      }
    })();
  }, []);

  const onSortTasks = (event) => {
    const sortBy = event?.target?.value;
    const localTasks = JSON.parse(localStorage.getItem("tasks")) ?? [];
    let sortedTasks = [];
    if (sortBy?.toLowerCase() === "more recent") {
      sortedTasks = _.sortBy(localTasks, (data) => data?.projectId?.createdAt);
    } else if (sortBy?.toLowerCase() === "progress") {
      sortedTasks = _.sortBy(
        localTasks,
        (data) => data?.projectId?.projectData?.completionPercentage
      );
    }
    setTasks(sortedTasks);
  };

  return (
    <Layout activePageName={t("assignedTasks.pageTitle")}>
      <Container>
        <div className="flex justify-between mb-2">
          <Heading title={t("assignedTasks.pageTitle")} />
          <select
            onChange={onSortTasks}
            className="border-2 border-[#00FFD3] text-[#00FFD3] p-2 rounded-full focus-within:outline-none transform transition-transform hover:scale-105 hover:bg-[#00FFD3] hover:text-white"
          >
            <option selected>Sort By</option>
            <option value={"more recent"}>
              {t("assignedTasks.sortByOptions.mostRecent")}
            </option>
            <option value={"status"}>
              {t("assignedTasks.sortByOptions.status")}
            </option>
            <option value={"progress"}>
              {t("assignedTasks.sortByOptions.progress")}
            </option>
          </select>
        </div>

        <>
          {isloading ? (
            <Spinner />
          ) : (
            <div className="mt-4 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {tasks?.length > 0 ? (
                tasks?.map((task, index) => (
                  <NavLink
                    to="/new-task-assigned"
                    key={task?._id}
                    className={
                      "transform transition-transform hover:scale-105 inlne-block"
                    }
                  >
                    <TaskCard
                      variant={
                        isEven(index + 1) ? VARIANTS.PURPLE : VARIANTS.GREEN
                      }
                      task={task}
                    />
                  </NavLink>
                ))
              ) : (
                <p className="absolute left-[50%] top-[50%] -translate-x-[50%]">
                  No task found!
                </p>
              )}
            </div>
          )}
        </>
      </Container>
    </Layout>
  );
}

export default AssignedTasks;
