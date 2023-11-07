import React, { createContext, useContext, useEffect, useState } from 'react';
import { getWorkers } from '../api';

const WorkersContext = createContext();

export function useWorkers() {
  return useContext(WorkersContext);
}

export function WorkersProvider({ children }) {
  const [workers, setWorkers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refetch, setFetch] = useState(false)
  useEffect(() => {
    // Check if workers are already available in localStorage
    const workersList = JSON.parse(localStorage.getItem('workers'));
    if(refetch){
      localStorage.removeItem('workers')
      setFetch(false)
    }
    if (workersList) {
      setWorkers(workersList);
      setLoading(false);
    } else {
      // If not, fetch the data from the API
      getWorkers()
        .then((data) => {
          setWorkers(data);
          localStorage.setItem('workers', JSON.stringify(data));
          setFetch(false)
        })
        .catch((error) => {
          console.error("Error occurred while fetching data", error);
        })
        .finally(() => {
          setLoading(false);
          setFetch(false)
        });
    }
  }, []);

  /* if (loading) {
    // You can add a loading indicator here if needed
    return <div>Loading...</div>;
  } */

  return (
    <WorkersContext.Provider value={{ workers, setFetch }}>
      {children}
    </WorkersContext.Provider>
  );
}
