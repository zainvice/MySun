import React, { createContext, useContext, useEffect, useState } from 'react';
import { getProjects } from '../api';

const ProjectsContext = createContext();

export function useProjects() {
  return useContext(ProjectsContext);
}

export function ProjectsProvider({ children }) {
  const [projects, setProjects] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refetch, setFetch] = useState(false)
  useEffect(()=>{
    localStorage.removeItem('projects')
  },[])
  useEffect(() => {
    // Check if projects are already available in localStorage
    const projectsList = JSON?.parse(localStorage?.getItem('projects'));
    if(refetch){
      console.log("REMOVING PROJECTS FROM LOCAL STORAGE")
      localStorage.removeItem('projects')
      setFetch(false)
      
    }
    if (projectsList) {
      setProjects(projectsList);
      setLoading(false);
    } else {
      // If not, fetch the data from the API
      getProjects()
        .then((data) => {
          setProjects(data);
          localStorage.setItem('projects', JSON.stringify(data));
        })
        .catch((error) => {
          console.error("Error occurred while fetching data", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [refetch]);
  const reFetch = () =>{
    setFetch(true)
  }
  /* if (loading) {
    // You can add a loading indicator here if needed
    return <div>Loading...</div>;
  } */

  return (
    <ProjectsContext.Provider value={{ projects, setFetch, reFetch }}>
      {children}
    </ProjectsContext.Provider>
  );
}
