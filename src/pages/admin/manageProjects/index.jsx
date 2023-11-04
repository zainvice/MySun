import { isEven } from "../../../utils";
import Layout from "../../../layout";
import Heading from "../../../common/heading";
import { Link, NavLink } from "react-router-dom";
import Button from "../../../common/button";
import Container from "../../../common/container";
import ProjectCard, { VARIANTS } from "../../../components/projectCard";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { getProjects } from "../../../api";
import Spinner from "../../../common/spinner";
import { useProjects } from "../../../context/projectsContext";
import { useSelector } from 'react-redux';
import { selectCurrentToken } from "../../../features/auth/authSlice";
import jwtDecode from "jwt-decode";
function ManageProjects() {
  const { t } = useTranslation();
  const [isloading, setloading] = useState(true);
  const { projects, setProjects } = useProjects();
  const token = useSelector(selectCurrentToken);
  const userInfo = jwtDecode(token);
  const {role}= userInfo.UserInfo
  const [viewAs, setView]= useState(true)
  const changeView = () =>{
    
    if(viewAs)
      setView(false)
    else  
      setView(true)
  }
  useEffect(() => {     
    getProjects()
      .then((data) => {
        setProjects(data);
        localStorage.setItem("projects", JSON.stringify(data));
        setloading(false)
      })
      .catch(() => localStorage.removeItem("projects"))
      .finally(() => setloading(false));
  }, []);

  return (
    <Layout activePageName={t("projectsHeading")}>
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
          {!viewAs? (
                  <button className="ml-5 bg-[#00FFD3] hover:bg-green-400 rounded-lg content-center w-5/2 h-10 hover:ease-in-out duration-300 shadow-md">
                  <span className="justify-center material-symbols-outlined text-4xl rounded text-white hover:cursor-pointer hover:text-white-200" 
                  onClick={changeView}
                  >
                  toc
                 </span>
                 </button>
                ): (
                  <>
                  
                
                  <button className="ml-5 bg-[#00FFD3] hover:bg-green-400 rounded-lg content-center w-[3.0rem] h-10 hover:ease-in-out duration-300 shadow-md">
                  <span className="justify-center material-symbols-outlined text-4xl text-white hover:cursor-pointer hover:text-white-200" 
                  onClick={changeView}
                  >
                 aod_tablet
                  </span>
                  </button>
                  </>
                )}
            </>
          )}
          
        </div>

        {isloading ? (
          <Spinner />
        ) : (
          <>          
          {!viewAs ?(
            <>
            <table className="w-full bg-white border-separate border-spacing-y-3">
                <thead>
                  <tr className="bg-white text-gray-800 text-sm font-thin">
                    <th className="px-3 text-lg">Project Name</th>
                    <th className="px-3 text-lg">Start Date</th>
                    <th className="px-3 text-lg">End Date</th>
                    <th className="px-3 text-lg">Description</th>
                    <th className="px-3 text-lg">Tasks</th>
                    <th className="px-3 text-lg">Completed Tasks</th>
                   
                  </tr>
                </thead>
                <tbody className="rounded-full text-center text-sm font-thin">
                {projects?.length > 0 ? (
                    projects?.map((project, index) => (
                      <tr className="bg-gray-200 w-[60%]" key={index}>
                        <td className="p-4 pl-8 rounded-l-full ">
                          <NavLink to={`/manage-projects/${project.projectId}`}>{project?.projectName}</NavLink>
                        </td>
                        <td className="p-4 pl-8">
                          <NavLink to={`/manage-projects/${project.projectId}`}>{new Date(project?.startDate).toLocaleDateString()}</NavLink>
                        </td>
                        <td className="p-4 pl-8">
                          <NavLink to={`/manage-projects/${project.projectId}`}>{new Date(project?.endDate).toLocaleDateString()}</NavLink>
                        </td>
                        <td className="p-4 pl-8">
                          <NavLink to={`/manage-projects/${project.projectId}`}>{project?.projectDescription}</NavLink>
                        </td>
                        <td className="p-4 pl-8">
                          <NavLink to={`/manage-projects/${project.projectId}`}>{project?.tasks?.length}</NavLink>
                        </td>
                        <td className="p-4 pl-8 rounded-r-full">
                          <NavLink to={`/manage-projects/${project.projectId}`}>{project?.tasks?.filter(task=>task.status==="Fully Mapped").length}</NavLink>
                        </td>
                       
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={projects?.length + 1}>
                        NO PROJECTS FOUND
                      </td>
                    </tr>
                  )}
                 
                </tbody>
              </table>
            </>
          ):(
            <>
            <div className="relative mt-4 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            {projects?.length > 0 ? (
              projects?.map((project, index) => (
                <Link
                  key={project?.projectId}
                  to={`/manage-projects/${project?.projectId}`}
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
            </>
          )}
          
          </>
        )}
      </Container>
    </Layout>
  );
}

export default ManageProjects;
