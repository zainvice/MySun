import { publicUrl } from "../utils";
import { useTranslation } from 'react-i18next';
import { useProjects } from "../context/projectsContext";
function formatTimeDifference(lastLogin) {
  const now = new Date();
  const timeDifference = now - lastLogin;

  const minutesDifference = Math.floor(timeDifference / (1000 * 60));

  if (minutesDifference < 1) {
    return "Just now";
  } else if (minutesDifference === 1) {
    return "a minute ago";
  } else if (minutesDifference < 60) {
    return `${minutesDifference} minutes ago`;
  } else {
    
    const hoursDifference = Math.floor(minutesDifference / 60);
    
    if (hoursDifference === 1) {
      return "an hour ago";
    } else {
      return `${hoursDifference} hours ago`;
    }
  }
}

function WorkerCard(workers) {
 
  const worker= workers?.worker
  const { t } = useTranslation();
  const lastLogin = new Date(worker?.lastLogin)
  const formattedTimeDifference = formatTimeDifference(lastLogin);
  const {projects } = useProjects()
  const tasksDone = projects.map(project=> {
    return project?.tasks.filter(task=> {
      if(task.status==="Fully Mapped"){
       
        const editBy = task.editedBy?.filter(edit=> edit.email===worker.email)
        if(editBy?.length>0){
          return task
        }
      }})?.length
  })
  //const startedOn = new Date(worker?.createdAt)
  
  return (
    <>
    {worker ? (
      <>
       <div className="w-full p-4 sm:p-6 rounded-3xl text-white shadow-lg bg-gradient-to-b from-[#00FFD3] from-60% to-[#37C19F]">
      <div className="flex items-center gap-4">
        <img src={`${publicUrl}/images/avatarMale.png`} />
        <div>
          <h2 className="font-semibold text-2xl line-clamp-1">
            {worker?.fullName}
          </h2>
          <p className="text-sm font-medium flex items-center gap-2">
            <span className="font-semibold">{t('workerCard.lastLoginLabel')}: </span>{" "}
            <span>{formattedTimeDifference}</span>
          </p>
        </div>
      </div>
      <div>
     
      <p className="mt-2">{tasksDone.length>0 ? tasksDone[0]: "0"} {t('workerCard.projectsCompleted')}</p>

        <p className="mt-2 flex items-center gap-2 text-sm">
          <span className="font-semibold">{t('workerCard.startedOnLabel')}: </span>
          <span>{worker?.createdAt && new Date(worker.createdAt).toLocaleString()}</span>

        </p>
        <p className="mt-2 flex items-center gap-2 text-sm">
          <span className="font-semibold">{t('workerCard.latestProjectLabel')}: </span>
          <span>{worker?.projects[worker?.projects?.length-1]?.projectName}</span>
        </p>
      </div>
    </div>
      </>
    ): (
      <></>
    )
    }
   
    </>
  );
}

export default WorkerCard;
