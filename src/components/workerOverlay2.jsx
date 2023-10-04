import { useEffect, useState } from "react";
import Worker from "./worker";
import { editProject } from "../api";
export default function WorkerOverlay({
  workers,
  addedWorkers,
  projectId,
}) {
  const [selectedWorkers, setSelectedWorkers]= useState([])
  const [workersTodisplay, setWorkers] = useState(workers)
  const [log, setLog]= useState("ADD TO PROJECT")
  const onAddWorkers = async() =>{
    console.log("ADDING!")
    setLog("ADDING!")
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
        await editProject({projectId, workers: selectedWorkers})
        setLog("SUCCESSFULLY ADDED!")

      }catch(error){

      }

    }
  }
  const [email, setEmail]= useState()
  const [message, setMessage]= useState("Not Found")
  const onSearch = () =>{
    console.log("Searching")
    setMessage("Searching")
    const filtered = workers.filter(worker=>{
      if(worker.email.includes(email)){
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
      const filtered = workers.filter(worker=>{
        if(worker.email.includes(email)){
              return worker
        }
      })
    
    console.log("FOUND", filtered)
    if(filtered.length){
      setWorkers(filtered)
    }
    }else{
      setWorkers(workers)
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

      <div className="my-4 pb-2 overflow-y-auto h-[calc(100%-2.75rem-0.5rem)] flex flex-col gap-3 animate-fadeIn">
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
      </div>
      
    </div>
    
    </>
  );
}
