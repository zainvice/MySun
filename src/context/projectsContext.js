import React, { createContext, useContext, useEffect, useState } from 'react';
import { getProjects } from '../api';

const ProjectsContext = createContext();


export function useProjects() {
  return useContext(ProjectsContext);
}


export function ProjectsProvider({ children }) {
  const projectslist = JSON.parse(localStorage.getItem('projects'))
  const [projects, setProjects] = useState(projectslist); 
  useEffect(()=>{
    if(!projectslist){
      getProjects()
      .then((data) => {
        setProjects(data);
      })
      .catch((error) => {
        console.log("Error occurred while fetching data", error);
      });
    }
  },[projectslist])
  return (
    <ProjectsContext.Provider value={{ projects, setProjects }}>
      {children}
    </ProjectsContext.Provider>
  );
}
