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

function TaskCard({ variant, task }) {
  const project = task?.projectId;
  const timeAgo = new TimeAgo("en-US");
  const arrayName = Object.entries(task.taskData)[0]?.[1];
  /* console.log(task?.taskData[arrayName]?.length, "SHOWING"); */
  const [gradient, setGradient]= useState()
  useEffect(()=>{
    console.log(task?.status)
    if(task?.status==='Field Mapped'){
      //21DE00
      setGradient('bg-gradient-to-b from-[#00B1FF] from-60% to-[#0085BF]')
    }else if(task?.status==='Fully Mapped'){
      //
      setGradient('bg-gradient-to-b from-[#21DE00] from-60% to-[#19A700]')
    }else if(task?.status==='Pending'){
      setGradient('bg-gradient-to-b from-[#00EFAE] from-60% to-[#009D72]')
    }else if(task?.status==='Coordination Letter'){
      setGradient('bg-gradient-to-b from-[#F59000] from-60% to-[#BD7000]')
    } else if(task?.status==='Refused Survey'){
      setGradient('bg-gradient-to-b from-[#F10004] from-60% to-[#AB0003]')
    }else if(task?.status==='Aerial Mapping'){
      setGradient('bg-gradient-to-b from-[#E3E000] from-60% to-[#9D9B00]')
    }else if(task?.status==='Missing Information'){
      //DC004E
      setGradient('bg-gradient-to-b from-[#DC004E] from-60% to-[#950035]')
    }else if(task?.status==='Unite Address'){
      setGradient('bg-gradient-to-b from-[#292929] from-60% to-[#000000]')
    }else if(task?.status==='Under Construction'){
      setGradient('bg-gradient-to-b from-[#7C7C7C] from-60% to-[#525252]')
    }

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
            {project?.projectName ? <p className="text-sm"> TASK FROM </p> : <p className="text-sm"> TASK INFO </p>}
            {project?.projectName || (task?.taskData && Object.entries(task.taskData)[0]?.[1])}          
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
            {task?.timeTaken
              ? timeAgo.format(task?.timeTaken)?.replace("ago", "")
              : "Not yet started"}
          </span>
        </p>
        <p className="flex items-center gap-2">
          <span className="font-semibold">Status: </span>
          <span>{task?.status}</span>
        </p>
        <p className="flex items-center gap-2">
          <span className="font-semibold">Assigned Yet: </span>
          <span>{task?.taskData[arrayName]?.length ? "YES" : "NO"} </span>
        </p>
        <p className="flex items-center gap-2">
          <span className="font-semibold">Assigned Data: </span>
          <span>{task?.taskData[arrayName]?.length || 0} </span>
        </p>
        <p className="flex items-center gap-2">
          <span className="font-semibold">Created On: </span>
          <span>{new Date(task?.createdAt).toLocaleString()} </span>
        </p>
        <p className="flex items-center gap-2">
          <span className="font-semibold">Last Updated On: </span>
          <span>{new Date(task?.updatedAt).toLocaleString()} </span>
        </p>
      </div>
    </div>
  );
}

export default TaskCard;
