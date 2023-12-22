import { publicUrl } from "../utils";
import { useTranslation } from "react-i18next";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { useEffect, useState } from "react";

TimeAgo.addDefaultLocale(en);

export const VARIANTS = {
  GREEN: "green",
  PURPLE: "purple",
};

function ProjectCard({ variant, project }) {
  const { t } = useTranslation();
  const timeAgo = new TimeAgo("en-US");
  const startDate = new Date(project?.startDate);
  var timeTaken = startDate;

  const supervisor = project?.workers?.filter(
    (worker) => worker?.role === "supervisor"
  );

  if (startDate < new Date(project?.updatedAt)) {
    timeTaken = new Date(project?.updatedAt);
  }

  const [completionPercentage, setCompletion]= useState('0')
  const [totalTimeTaken, setTimeTaken]= useState()
  useEffect(()=>{
    let totalTimeTaken = 0
    if (project?.completeData) {
      const total = project?.tasks?.length;
  
      // Calculate the number of tasks completed with the status "Fully Mapped"
      const complete = project?.tasks?.filter(task => task.status === "Fully Mapped").length;
  
      if (!isNaN(complete) && !isNaN(total) && total > 0) {
          // Calculate the completion percentage
          const percent = (complete / total) * 100;
          setCompletion(percent.toFixed(2).toString()+"%");
          console.log("COMPLETION", completionPercentage, "From", complete, total);
      }
    }
    if(project?.tasks){
      project?.tasks.map((task)=>{
          if(task?.timeTaken){
            totalTimeTaken= totalTimeTaken+ task?.timeTaken
          }
      })
      setTimeTaken(totalTimeTaken)
    }
  
  }, [project, completionPercentage])
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
          src={`/images/${
            VARIANTS.GREEN === variant ? "taskIcon.png" : "taskIcon1.png"
          }`} 
        />
        <div>
         
          <h2 className="font-semibold text-3xl line-clamp-1">
            {project?.projectName}
          </h2>
          <p className="text-sm font-medium">
            {project?.createdAt && timeAgo.format(new Date(project?.createdAt))}
          </p>
        </div>
      </div>
      <div className="mt-2 w-full">
        <p className="line-clamp-2 mb-2">{project?.projectDescription ?? ""}</p>
        <div className="relative h-7 rounded-full flex justify-center items-center text-sm text-[#00FFD3] bg-[#505050]">
  <div
    className={`absolute top-0 -left-[2px] rounded-full border-white h-full w-[${completionPercentage}] bg-white`}
  />
  <span className="z-[1]">
    {completionPercentage} {t("taskCard.completedLabel")}
  </span>
</div>
      </div>
      <div className="mt-3 text-sm">
        <p className="flex items-center gap-2">
          <span className="font-semibold">{t("taskCard.startedOnLabel")} </span>
          <span>{!isNaN(startDate) && timeAgo.format(startDate)}</span>
        </p>

        <p className="flex items-center gap-2">
          <span className="font-semibold">Latest Change </span>
          <span>
            {startDate < Date.now()
              ? timeAgo.format(timeTaken).replace("ago", "ago")
              : "Not yet started"}
          </span>
        </p>
        <p className="flex items-center gap-2">
          <span className="font-semibold">Total Time Taken </span>
          <span>
            {totalTimeTaken
            ? totalTimeTaken > 60
              ? `${Math.floor(totalTimeTaken / 60)} minutes and ${totalTimeTaken % 60} seconds`
              : `${totalTimeTaken} seconds`
            : "Not yet started"}
          </span>
        </p>
        <p className="flex items-center gap-2">
          <span className="font-semibold">Tasks Completed </span>
          <span>
            {project?.tasks?.filter(task => task.status === "Fully Mapped").length}
          </span>
        </p>
      </div>
      <div className="mt-4 text-sm">
        <p className="flex items-center justify-end gap-2">
          <span className="font-semibold">
            {t("taskCard.assignedToLabel")}{" "}
          </span>
          <span>{supervisor && supervisor[0]?.fullName}</span>
        </p>
      </div>
    </div>
  );
}

export default ProjectCard;
