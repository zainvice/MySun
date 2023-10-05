import React, { useEffect, useState } from "react";
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
import Spinner from "../../common/spinner";

function Tasks() {
  const { id } = useParams();
  const { projects } = useProjects();
  const project = projects?.length
    ? projects?.filter((project) => project?.projectId === id)[0]
    : {};
  const {role}= useAuth()
  console.log(projects)
  const tasks = project?.completeData||project?.buildingData?.tasks;
  const [tasksAS, setTasks] = useState(project?.tasks)
  const headings = tasks?.length ? Object.keys(tasks[0]) : [];
  const [Loading, setloading]= useState(true)
  useEffect(()=>{
    console.log("Displaying",project?.tasks)
    if(projects!==null){
      setloading(false)
    }
    if(project?.tasks){
      setTasks(project?.tasks)
    }
  },[projects])
  const [viewAs, setView]= useState(true)
  const changeView = () =>{
    if(viewAs)
      setView(false)
    else  
      setView(true)
  }
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  useEffect(()=>{
    console.log("Displaying",project?.tasks)
     // Filter the tasks based on the searchTerm
    const filteredTasks = project?.tasks?.filter((task) => {
    const buildingNumber = task.taskData["building number"];
    // Convert buildingNumber to a string for comparison
    const buildingNumberString = buildingNumber.toString();
    return buildingNumberString.includes(searchTerm.toUpperCase());
    });
    console.log("Filtered Tasks:", filteredTasks);
    setTasks(filteredTasks)
  },[searchTerm])

  const buildingNumberCounts = {};
  const tasksBN = tasks?.map((task, index) => {
  const buildingNumber = task["building number"];
  if (buildingNumberCounts[buildingNumber] === undefined) {
    buildingNumberCounts[buildingNumber] = 1;
  } else {
    buildingNumberCounts[buildingNumber]++;
  }

  const count = buildingNumberCounts[buildingNumber];

  if (count > 1) {
    return {
      ...task,
      "building number": `${buildingNumber}-${count}`
    };
  } else {
    return task;
  }
});
tasksBN?.sort((a, b) => {
  const buildingNumberA = a["building number"];
  const buildingNumberB = b["building number"];
  
  return buildingNumberA.localeCompare(buildingNumberB);
});
  return (
    <>
      <Layout activePageName={`Projects / ${id} / Tasks`}>
        <Container>
          <div >
            {Loading?(
                <Spinner/>
            ):(
              <>
              <div className="flex justify-between mb-2">
            <Heading title={"Project Tasks"}></Heading>
               
               
               <>
              
                {viewAs? (
                  <button className="ml-5 bg-[#00FFD3] hover:bg-green-400 rounded-lg content-center w-5/2 h-10 hover:ease-in-out duration-300 shadow-md">
                  <span className="justify-center material-symbols-outlined text-4xl rounded text-white hover:cursor-pointer hover:text-white-200" 
                  onClick={changeView}
                  >
                  toc
                 </span>
                 </button>
                ): (
                  <>
                  <div className="h-10 rounded-full bg-gray-200 text-black px-4 h-10 text-center content-center lg:w-1/4 sm:w-1/3 sm:mr-4">
         
                  <input
                    type="text"
                    placeholder="Search..."
                    className="bg-gray-200 w-3/4 mr-8 mt-2"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                  
               
                </div>
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
                  {tasksBN?.length > 0 ? (
                    tasksBN.map((task, index) => (
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
                      No Combinations Found, complete some tasks first!
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
                  No tasks found, try a different keyword!
                </p>
              )}
              </div> 
              )}
              {/* */}
            </div>
              </>
            )}
            
          </div>
        </Container>
      </Layout>
    </>
  );
}

export default Tasks;
