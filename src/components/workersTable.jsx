import React from "react";

const WorkersTable = () => {
  return (
    <div className="p-8">
      <table className="w-full">
        <thead>
          <tr>
            <th className="p-2 text-xl">Name</th>
            <th className="p-2 text-xl">Email</th>
            <th className="p-2 text-xl">Role</th>
            <th className="p-2 text-xl">
              Permissions
              <div className="space-x-4 text-sm sm:space-x-16 xs:space-x-1">
                <span>
                  <label> Edit</label>
                </span>
                <span>
                  <label>Download</label>
                </span>
                <span>
                  <label>Share</label>
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody className=" bg-gray-200 rounded-3xl">
          {/* Here, you can map through your data and render rows */}
          {/* For each data row, create a single row for the entire data */}
          <tr className="text-center h-auto p-2 text-lg">
            <td className="rounded-l-3xl">Muskan</td>
            <td>Muskan@gmail.com</td>
            <td>Admin</td>
            <td className="p-2 text-center rounded-r-3xl sm:space-x-24 xs:space-x-8">
              <input type="checkbox" className="ml-2" />
              <input type="checkbox" className="ml-2" />
              <input type="checkbox" className="ml-2 " />
            </td>
          </tr>
          {/* Repeat the above row structure for other data */}
        </tbody>
      </table>
    </div>
  );
};

export default WorkersTable;
