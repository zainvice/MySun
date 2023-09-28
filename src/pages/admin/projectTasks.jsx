import React, { useState } from "react";
import Layout from "../../layout";
import Container from "../../common/container";
import Heading from "../../common/heading";
import { useParams } from "react-router-dom";
import { isEven } from "../../utils";
import { VARIANTS } from "../../components/projectCard";
import { useProjects } from "../../context/projectsContext";
import { NavLink } from "react-router-dom";
import TaskCard from "../../components/taskCard";
import useAuth from "../../hooks/useAuth";
function Tasks() {
  const { id } = useParams();
  const { projects } = useProjects();
  const project = projects?.length
    ? projects?.filter((project) => project?.projectId === id)[0]
    : {};
  const {role}= useAuth()
  
  const tasks = project?.projectData?.tasks;
  const tasksAS = project?.tasks
  console.log("TASKS",tasks)
  console.log("TASKS TAB",tasksAS)
  console.log("role", role)
  const headings = tasks?.length ? Object.keys(tasks[0]) : [];

  const [viewAs, setView]= useState(true)
  const changeView = () =>{
    if(viewAs)
      setView(false)
    else  
      setView(true)
  }
  return (
    <>
      <Layout activePageName={`Projects / ${id} / Tasks`}>
        <Container>
          <div >
            <div className="flex justify-between mb-2">
            <Heading title={"Project Tasks"}></Heading>
              {role!=='admin' ? (
               <>
                {viewAs? (
                  <span className="ml-3 justify-end material-symbols-outlined text-4xl bg-[#00FFD3] rounded text-white hover:cursor-pointer hover:bg-green-400 hover:text-white-200" 
                  onClick={changeView}
                  >
                  toc
                 </span>
                ): (
                  <span className="ml-3 justify-end material-symbols-outlined text-4xl bg-[#00FFD3] rounded text-white hover:cursor-pointer hover:bg-green-400 hover:text-white-200" 
                  onClick={changeView}
                  >
                 tablet
                  </span>
                )}
               </>
              ): (
                <></>
              )}
              </div>
            <div className="my-4 ">
              {viewAs? (
                <table className="w-full bg-white border-separate border-spacing-y-3">
                <thead>
                  <tr className="bg-white text-gray-800 text-sm font-thin">
                    {headings?.length > 0 &&
                      headings?.map((heading) => (
                        <th key={heading} className="px-3 text-lg">{heading}</th>
                      ))}
                  </tr>
                </thead>
                <tbody className="rounded-full text-center text-sm font-thin">
                  {tasks?.length > 0 ? (
                    tasks.map((task, index) => (
                      <tr className="bg-gray-200" key={index}>
                        {headings?.map((heading, index) => (
                          <td
                            key={index}
                            className={`p-3 ${
                              index === 0
                                ? "rounded-l-full"
                                : index === headings?.length - 1
                                ? "rounded-r-full"
                                : ""
                            }`}
                          >     
                            {task[heading]}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <p className="absolute left-[50%] top-[50%] -translate-x-[50%]">
                      No Tasks found!
                    </p>
                  )}
                 
                </tbody>
              </table>
              ): (
                <div className="mt-4 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                   {tasksAS?.length > 0 ? (
                     tasksAS?.map((task, index) => (
                       <NavLink
                         to={"/task/"+task?._id}
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
              {/* */}
            </div>
          </div>
        </Container>
      </Layout>
    </>
  );
}

export default Tasks;
