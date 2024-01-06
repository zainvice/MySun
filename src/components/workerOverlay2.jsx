import { useEffect, useState } from "react";
import Worker from "./worker";
import { editAWProject } from "../api";
import { useProjects } from "../context/projectsContext";
import { useWorkers } from "../context/workersContext";
import Spinner from "../common/spinner";

export default function WorkerOverlay({
  
  addedWorkers,
  projectId,
}) {
  const {workers} = useWorkers()||{}
  const [selectedWorkers, setSelectedWorkers]= useState([])
  const {reFetch} = useProjects()
  const [workersTodisplay, setWorkers] = useState(workers?.filter((worker) => worker.role !== 'admin' && !addedWorkers.some(addedWorker => addedWorker.email === worker.email)))
  const [log, setLog]= useState("ADD TO PROJECT")
  const [isLoading, setLoading] = useState(false)
  console.log("Added Workers", addedWorkers)
  const onAddWorkers = async() =>{
    console.log("ADDING!")
    setLog("ADDING!")
    setLoading(true)
    console.log("Added Workers", addedWorkers)
    console.log("Selected Workerss", selectedWorkers)
    //const addedWorkerNames = addedWorkers.split(', ').filter(Boolean);

    // Create an empty array to store the matched workers
    const matchedWorkers = [];

    // Loop through the addedWorkerNames array
    for (const addedWorker of addedWorkers) {
        // Check if the addedWorkerName exists in selectedWorkers
        const isMatched = selectedWorkers.find(selectedWorker => selectedWorker.email === addedWorker.email);
        
        // If it's a match, add it to the matchedWorkers array
        if (isMatched) {
            matchedWorkers.push(isMatched);
        }
    }

    console.log("Matched Workers", matchedWorkers);
    if(matchedWorkers.length){
      setLog("Workers already added!")
    }else{
      console.log("Sending", projectId)
      try{
        await editAWProject({projectId, workers: selectedWorkers})
        setLog("SUCCESSFULLY ADDED!")
        setLoading(false)
        reFetch();
        window.location.reload()
      }catch(error){
        setLog("An error occured please try again later!")
        setLoading(false)
      }

    }
  }
  const [email, setEmail]= useState()
  console.log(workersTodisplay)
  const [message, setMessage]= useState("Not Found")
  const onSearch = () =>{
    console.log("Searching")
    setMessage("Searching")
    const shadowCopy = workers?.filter((worker) => worker.role !== 'admin' && !addedWorkers.some(addedWorker => addedWorker.email === worker.email))
    const filtered = shadowCopy.filter(worker=>{
      const searchItem = email.toLowerCase()
      if(worker.email.toLowerCase().includes(searchItem)){
            return worker
      }
      if(worker.fullName.toLowerCase().includes(searchItem)){
            return worker
      }
      if(worker.role.toLowerCase().includes(searchItem)){
        return worker
      }
    })
    setWorkers(filtered)
    console.log("FOUND", filtered)
    
  }
  useEffect(()=>{
    if(email){
      console.log("Searching")
      setMessage("Searching.....", email)
      const shadowCopy = workers?.filter((worker) => worker.role !== 'admin' && !addedWorkers.some(addedWorker => addedWorker.email === worker.email))
      const filtered = shadowCopy.filter(worker=>{
        const searchItem = email.toLowerCase()
        if(worker.email.toLowerCase().includes(searchItem)){
              return worker
        }
        if(worker.fullName.toLowerCase().includes(searchItem)){
              return worker
        }
        if(worker.role.toLowerCase().includes(searchItem)){
          return worker
       }
      })
    
    console.log("FOUND", filtered)
    if(filtered.length){
      setWorkers(filtered)
    }
    }else{
      setWorkers(workers?.filter((worker) => worker.role !== 'admin' && !addedWorkers.some(addedWorker => addedWorker.email === worker.email)))
    }
  }, [email])
  return (
    <>
    <div className="h-[90vh] w-[95vw] sm:w-[50vw] lg:w-[40vw] box-border bg-[#E9E9E9] rounded-[2rem] shadow-xl p-3 sm:p-6 overflow-hidden">
     
      <label className="flex items-center w-full h-11 mt-2 rounded-full bg-white px-3 shadow-sm overflow-hidden">
        <input
          placeholder="Search By Email"
          className="flex-1 h-full focus-within:outline-none"
          onChange={(e)=>setEmail(e.target.value)}
        />
        <span className="material-symbols-outlined text-3xl text-[#505050] cursor-pointer" onClick={onSearch}>
          person_search
        </span>
      </label>

      <div className="flex h-10 mt-2 w-full rounded-full bg-[#34F5C5] text-white items-center justify-center shadow-sm hover:bg-white hover:text-[#34F5C5] cursor-pointer hover:ease-in-out duration-300"
      onClick={onAddWorkers}
      >
        <span className="text-center text-bold">{log}</span>
      </div>

      <div className="my-4 pb-2 overflow-y-auto h-[calc(100%-3rem-2.5rem)] flex flex-col gap-3 animate-fadeIn">
        {isLoading ?(
            <Spinner/>
        ): (
          <>
          {workersTodisplay ?(
          <>
           {workersTodisplay &&
          workersTodisplay.map((worker) => (
            <Worker
              key={worker._id}
              worker={worker}
              selectedWorkers={selectedWorkers}
              onSelect={setSelectedWorkers}
            />
          ))}
          </>
        ):(
          <>
            <div className="text-center">
                <p>{message}</p>
            </div>
          </>
        )}
          </>
        )}
      </div>
      
    </div>
    
    </>
  );
}
