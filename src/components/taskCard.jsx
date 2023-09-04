import React from "react";

export const VARIANTS = {
  GREEN: "green",
  PURPLE: "purple",
};

function TaskCard({ variant }) {
  return (
    <div
      className={`w-full p-4 sm:p-6 rounded-3xl text-white shadow-lg ${
        VARIANTS.GREEN === variant
          ? "bg-gradient-to-b from-[#00FFD3] from-60% to-[#37C19F]"
          : "bg-gradient-to-b from-[#0070C0] from-60% to-[#E63950]"
      }`}
    >
      <div className="flex items-center gap-4">
        <img
          className="w-18"
          src={`./images/${
            VARIANTS.GREEN === variant ? "taskIcon.png" : "taskIcon1.png"
          }`}
        />
        <div>
          <h2 className="font-semibold text-3xl line-clamp-1">Repair Safe</h2>
          <p className="text-sm font-medium">3 days ago</p>
        </div>
      </div>
      <div className="mt-2 w-full">
        <p className="line-clamp-2 mb-2">Some description of project</p>
        <div className="relative h-7 rounded-full flex justify-center items-center text-sm text-[#00FFD3] bg-[#505050]">
          <div className="absolute top-0 -left-[2px] rounded-full border-white h-full w-[75%] bg-white" />
          <span className="z-[1]">75% Completed</span>
        </div>
      </div>
      <div className="mt-3 text-sm">
        <p className="flex items-center gap-2">
          <span className="font-semibold">Started On: </span>
          <span>23 May, 2023</span>
        </p>

        <p className="flex items-center gap-2">
          <span className="font-semibold">Time Taken: </span>
          <span>3 days, 12 hours</span>
        </p>
      </div>
      <div className="mt-4 text-sm">
        <p className="flex items-center justify-end gap-2">
          <span className="font-semibold">Assigned to: </span>
          <span>Muhammad Faizan</span>
        </p>
      </div>
    </div>
  );
}

export default TaskCard;
