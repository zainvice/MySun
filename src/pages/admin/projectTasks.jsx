import React from "react";
import Layout from "../../layout";
import Container from "../../common/container";
import Heading from "../../common/heading";
import { useParams } from "react-router-dom";
import { useProjects } from "../../context/projectsContext";

function Tasks() {
  const { id } = useParams();
  const { projects } = useProjects();
  const project = projects.length
    ? projects?.filter((project) => project.projectId === id)[0]
    : {};

  const tasks = project?.projectData?.tasks;
  const headings = tasks?.length ? Object.keys(tasks[0]) : [];

  return (
    <>
      <Layout activePageName={`Projects / ${id} / Tasks`}>
        <Container>
          <div>
            <Heading title={"Project Tasks"}></Heading>
            <div className="my-4 ">
              <table className="w-full bg-white border-separate border-spacing-y-3">
                <thead>
                  <tr className="bg-white text-gray-800 text-sm font-thin">
                    {headings?.length > 0 &&
                      headings.map((heading) => (
                        <th key={heading} className="px-3 text-lg">{heading}</th>
                      ))}
                  </tr>
                </thead>
                <tbody className="rounded-full text-center text-sm font-thin">
                  {tasks.length > 0 ? (
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
            </div>
          </div>
        </Container>
      </Layout>
    </>
  );
}

export default Tasks;
