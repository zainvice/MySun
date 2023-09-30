import { publicUrl } from "../utils";
import { useTranslation } from "react-i18next";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

TimeAgo.addDefaultLocale(en);

export const VARIANTS = {
  GREEN: "green",
  PURPLE: "purple",
};

function TaskCard({ variant, task }) {
  const project = task?.projectId;
  const timeAgo = new TimeAgo("en-US");

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
          src={`${publicUrl}/images/${
            VARIANTS.GREEN === variant ? "taskIcon.png" : "taskIcon1.png"
          }`}
        />
        <div>
          <h2 className="font-semibold text-3xl line-clamp-0">
            {project?.projectName ? <p className="text-sm"> TASK FROM </p> : <p className="text-sm"> PHYSICAL INFO </p>}
            {project?.projectName || (task?.taskData && Object.entries(task.taskData)[0]?.join(': '))}          
            </h2>
        </div>
      </div>
      <div className="mt-2 w-full">
        <p className="line-clamp-2 mb-2">{project?.projectDescription ?? ""}</p>
      </div>
      <div className="mt-3 text-sm">
        <p className="flex items-center gap-2">
          <span className="font-semibold">Time Elapsed</span>
          <span className={"line-clamp-1 flex-1 w-full"}>
            {task?.timeElapsed
              ? timeAgo.format(task?.timeElapsed)?.replace("ago", "")
              : "Not yet started"}
          </span>
        </p>
        <p className="flex items-center gap-2">
          <span className="font-semibold">Status: </span>
          <span>{task?.status}</span>
        </p>
      </div>
    </div>
  );
}

export default TaskCard;
