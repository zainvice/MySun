import React, { createContext, useContext, useState } from 'react';


const ProjectsContext = createContext();


export function useProjects() {
  return useContext(ProjectsContext);
}


export function ProjectsProvider({ children }) {
  const projectslist = JSON.parse(localStorage.getItem('projects'))
  const [projects, setProjects] = useState(projectslist); 

  return (
    <ProjectsContext.Provider value={{ projects, setProjects }}>
      {children}
    </ProjectsContext.Provider>
  );
}
