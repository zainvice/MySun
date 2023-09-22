import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook

function WorkersTable({ workers }) {
  const navigate = useNavigate(); // Initialize the navigate function

  // Function to navigate to worker detail page when a row is clicked
  const handleRowClick = () => {
    navigate(`/worker-detail`);
  };

  return (
    <div className="w-full overflow-auto">
      <table className="w-full border-separate border-spacing-y-3">
        <thead className="align-top">
          <tr>
            <th className="min-w-[160px]">Name</th>
            <th className="min-w-[160px]">Email</th>
            <th className="min-w-[160px]">Role</th>
            <th className="min-w-[200px]">
              Permissions
              <div className="grid grid-cols-3 mt-2">
                <span>Edit</span>
                <span>Download</span>
                <span>Share</span>
              </div>
            </th>
            </tr>
        </thead>
        <tbody className="mt-4">
          {workers?.length > 0 &&
            workers.map((worker, index) => (
              <tr
                key={index}
                className="bg-[#E7E7E7] overflow-hidden text-center cursor-pointer"
                onClick={() => handleRowClick()} // Handle row click
              >
                <td className="py-2 px-3 rounded-l-full">{worker.fullName}</td>
                <td>{worker.email}</td>
                <td>{worker.role}</td>
                <td className="rounded-r-full">
                  <div className="grid grid-cols-3">
                    <input type="checkbox" />
                    <input type="checkbox" />
                    <input type="checkbox" />
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default WorkersTable;