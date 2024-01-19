import { publicUrl } from "../utils";
import { useSSR, useTranslation } from "react-i18next";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { useEffect, useState } from "react";


TimeAgo.addDefaultLocale(en);

export const VARIANTS = {
  GREEN: "green",
  PURPLE: "purple",
};
function preLoadGradient (status) {
  let gradient = ''
  if(status==='Field Mapped'){
    //21DE00
    gradient = 'bg-gradient-to-b from-[#7C12CC] from-60% to-[#6310A3]'
  }else if(status==='Fully Mapped'){
    //
    gradient= 'bg-gradient-to-b from-[#21DE00] from-60% to-[#19A700]'
  }else if(status==='Pending'){
    gradient= 'bg-gradient-to-b from-[#00EFAE] from-60% to-[#009D72]'
  }else if(status==='Not Mapped'){
    gradient= 'bg-gradient-to-b from-[#FF5C39] from-60% to-[#D54D2E]'
  } else if(status==='Drawing Ready'){
    gradient= 'bg-gradient-to-b from-[#FFC300] from-60% to-[#D5A400]'
  }else if(status==='GIS Ready'){
    gradient= 'bg-gradient-to-b from-[#14BDFF] from-60% to-[#0E92C6]'
  }else if(status==='Missing Information'){
    //DC004E
    gradient= 'bg-gradient-to-b from-[#DC004E] from-60% to-[#950035]'
  }else if(status==='Unite Address'){
    gradient= 'bg-gradient-to-b from-[#292929] from-60% to-[#000000]'
  }else if(status==='Checked'){
    gradient= 'bg-gradient-to-b from-[#C214FF] from-60% to-[#A413D9]'
  }else if(status==='Submitted'){
    gradient= 'bg-gradient-to-b from-[#00FF64] from-60% to-[#00C24E]'
  }else {
    //#F660B3
    gradient= 'bg-gradient-to-b from-[#F660B3] from-60% to-[#CD4B92]'
  }
  return gradient;
}

function TaskCard({ variant, task }) {
  const project = task?.projectId;
  const { t } = useTranslation();
  const timeAgo = new TimeAgo("en-US");
  const arrayName = Object.entries(task.taskData)[0]?.[1];
  /* console.log(task?.taskData[arrayName]?.length, "SHOWING"); */
  const gradient= preLoadGradient(task?.status)
  useEffect(()=>{
    

  },[task?.status])
  return (
    <div
      className={`w-full p-4 sm:p-6 rounded-3xl text-white shadow-lg ${gradient}`}
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
            {project?.projectName ? <p className="text-sm"> TASK FROM </p> : <p className="text-sm"> {t("taskInfo.taskInfo")} </p>}
            {project?.projectName || (task?.taskData && Object.entries(task.taskData)[0]?.[1])}          
            </h2>
        </div>
      </div>
      <div className="mt-2 w-full">
        <p className="line-clamp-2 mb-2">{project?.projectDescription ?? ""}</p>
      </div>
      <div className="mt-3 text-sm">
        <p className="flex items-center gap-2">
          <span className="font-semibold">{t("taskInfo.timeElapsed")}</span>
          <span className={"line-clamp-1 flex-1 w-full"}>
          {task?.timeTaken
            ? task?.timeTaken > 60
              ? `${Math.floor(task?.timeTaken / 60)} minutes and ${task?.timeTaken % 60} seconds`
              : `${task?.timeTaken} seconds`
            : "Not yet started"}
          </span>
        </p>
        <p className="flex items-center gap-2">
          <span className="font-semibold">{t("taskInfo.status")}: </span>
          <span>{task?.status}</span>
        </p>
        <p className="flex items-center gap-2">
          <span className="font-semibold">{t("taskInfo.classification")}: </span>
          <span>{task?.classification}</span>
        </p>
        <p className="flex items-center gap-2">
          <span className="font-semibold">{t("taskInfo.propertyType")}: </span>
          <span>{task?.propertyType?.join(', ')}</span>
        </p>
        <p className="flex items-center gap-2">
          <span className="font-semibold">{t("taskInfo.stats")}: </span>
          <span>{task?.stats?.join(', ')}</span>
        </p>
        <p className="flex items-center gap-2">
          <span className="font-semibold">{t("taskInfo.manuallyEntered")}: </span>
          <span>{task?.manual ? "YES" : "NO"} </span>
        </p>
        
        <p className="flex items-center gap-2">
          <span className="font-semibold">{t("taskInfo.createdOn")}: </span>
          <span>{new Date(task?.createdAt).toLocaleString()} </span>
        </p>
        <p className="flex items-center gap-2">
          <span className="font-semibold">{t("taskInfo.lastUpdatedOn")}: </span>
          <span>{new Date(task?.updatedAt).toLocaleString()} </span>
        </p>
      </div>
    </div>
  );
}

export default TaskCard;
