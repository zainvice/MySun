import React from "react";

function WorkersTable() {
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
          <tr className="bg-[#E7E7E7]  overflow-hidden text-center">
            <td className="py-2 px-3 rounded-l-full">Muhammad Faizan</td>
            <td>muhammadfaizan027915@gmail.com</td>
            <td>Software Engineer</td>
            <td className="rounded-r-full">
              <div className="grid grid-cols-3">
                <input type="checkbox" />
                <input type="checkbox" />
                <input type="checkbox" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default WorkersTable;
