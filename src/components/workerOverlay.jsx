import { useState, useEffect } from "react";
import Worker from "./worker";
export default function WorkerOverlay({
  workers,
  selectedWorkers,
  setSelectedWorkers,
}) {
  const [workersToDisplay, setWorkers]= useState(workers)
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
    <div className="h-[90vh] w-[95vw] sm:w-[50vw] lg:w-[40vw] box-border bg-[#E9E9E9] rounded-[2rem] shadow-xl p-3 sm:p-6 overflow-hidden">
      <label className="flex items-center w-full h-11 rounded-full bg-white px-3 shadow-sm overflow-hidden">
        <input
          placeholder="Search"
          className="flex-1 h-full focus-within:outline-none"
          onChange={(e)=>setEmail(e.target.value)}
        />
        <span className="material-symbols-outlined text-3xl text-[#505050] cursor-pointer" onClick={onSearch}>
          person_search
        </span>
      </label>
      <div className="my-4 pb-2 overflow-y-auto h-[calc(100%-2.75rem-0.5rem)] flex flex-col gap-3">
        {workersToDisplay? (
          <>
          {workersToDisplay &&
          workersToDisplay.map((worker) => (
            <Worker
              key={worker._id}
              worker={worker}
              selectedWorkers={selectedWorkers}
              onSelect={setSelectedWorkers}
            />
          ))}
          </>
        ):(
          <></>
        )}
      </div>
    </div>
  );
}
