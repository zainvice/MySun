import { isEven } from "../../utils";
import Layout from "../../layout";
import Heading from "../../common/heading";
import { Link, NavLink } from "react-router-dom";
import Button from "../../common/button";
import Container from "../../common/container";
import ProjectCard, { VARIANTS } from "../../components/projectCard";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { getProjects } from "../../api";
import Spinner from "../../common/spinner";
import { useProjects } from "../../context/projectsContext";
import { useSelector } from 'react-redux';
import { selectCurrentToken } from "../../features/auth/authSlice";
import jwtDecode from "jwt-decode";
function AssignedTasks() {
  const { t } = useTranslation();
  const [isloading, setloading] = useState(true);
  const { projects, setProjects } = useProjects();
  const token = useSelector(selectCurrentToken);
  const userInfo = jwtDecode(token);
  const {role}= userInfo.UserInfo

  useEffect(() => {     
    getProjects()
      .then((data) => {
        setProjects(data);
        localStorage.setItem("projects", JSON.stringify(data));
      })
      .catch(() => localStorage.removeItem("projects"))
      .finally(() => setloading(false));
  }, []);

  return (
    <Layout activePageName={t("dashboard.title")}>
      <Container showMoreButton={projects?.length > 0}>
        
        <div className="flex justify-between mb-2">
          <Heading title={t("projectsHeading")} />
          {role!=='admin'?(
            <>
            </>
          ): (
            <>
            <NavLink to="/new-project">
            <Button title={t("addnewProj")} />
          </NavLink>
            </>
          )}
          
        </div>
            <div>
            {role==='worker' ? (
            <p className="text-gray-600 font-bold">Welcome! These are the available projects to work on!</p>):
            (<></>)
            }
            </div>
        {isloading ? (
          <Spinner />
        ) : (
          
          <div className="relative mt-4 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {projects?.length > 0 ? (
              projects?.map((project, index) => (
                <Link
                  key={project?.projectId}
                  to={role === "worker" ? `/manage-projects/${project?.projectId}/tasks` : `/manage-projects/${project?.projectId}`}
                  className="relative transform hover:scale-105 transition-transform duration-300"
                >
                  <ProjectCard
                    project={project}
                    variant={
                      isEven(index + 1) ? VARIANTS.PURPLE : VARIANTS.GREEN
                    }
                  />
                </Link>
              ))
            ) : (
              <p className="absolute left-[50%] top-[50%] -translate-x-[50%]">
                No Projects found!
              </p>
            )}
          </div>
        )}
      </Container>
    </Layout>
  );
}

export default AssignedTasks;
