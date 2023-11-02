import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import { useTranslation } from "react-i18next";
import { removeWorkers } from "../api";

function WorkersTable({ workers }) {
  const {t}= useTranslation()
  const navigate = useNavigate(); // Initialize the navigate function

  // Function to navigate to worker detail page when a row is clicked
  const handleRowClick = (_id) => {
    console.log(_id)
    navigate(`/worker-detail/`+_id);
  };

  const remove = (_id, active) =>{
    
    removeWorkers({
      _id,
      active
    })
     
      .catch((error) => {
        const data = error?.response?.data;
       
      })
    window.location.reload()
  }

  return (
    <div className="w-full overflow-auto">
      <table className="w-full border-separate border-spacing-y-3">
        <thead className="align-top">
          <tr>
            <th className="min-w-[200px]">{t('workersTable.name')}</th>
            <th className="min-w-[160px]">{t('workersTable.email')}</th>
            <th className="min-w-[160px]">{t('workersTable.role')}</th>
            <th className="min-w-[160px]">
            {t('workersTable.permissions')}
              
            </th>
            <th className="min-w-[200px]">
            {t('workersTable.remove')}
              
            </th>
            </tr>
        </thead>
        <tbody className="mt-4">
          {workers?.length > 0 &&
            workers.map((worker, index) => (
              <tr
                key={index}
                className="bg-[#E7E7E7] overflow-hidden text-center cursor-pointer"
                
              >
                <td className="py-2 px-3 rounded-l-full" 
                  onClick={() => handleRowClick(worker._id)} // Handle row click
                >{worker.fullName}</td>
                <td>{worker.email}</td>
                <td>{worker.role.toUpperCase()}</td>
                <td>{worker.active ? 'Active' : 'Inactive'}</td>
                <td className="rounded-r-full">
                
                {worker.active? (
                  <>
                  <span class="material-symbols-outlined  hover:text-yellow-500 transition duration-300 ease-in-out"
                
                onClick={() => remove(worker._id, worker.active)}
                >
                  toggle_on
                 
                  </span>
                  
                  </>
                ):(
                  <>
                  <span class="material-symbols-outlined  hover:text-green-500 transition duration-300 ease-in-out"
                
                onClick={() => remove(worker._id, worker.active)}
                >
                  toggle_off
                 
                  </span>
                  </>
                )}
                  <span class="ml-4 material-symbols-outlined hover:text-red-500 transition duration-300 ease-in-out" 
                  onClick={() => remove(worker._id)}
                >
                    delete_sweep
                </span>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default WorkersTable;