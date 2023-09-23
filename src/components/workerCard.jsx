import { publicUrl } from "../utils";
import { useTranslation } from 'react-i18next';

function WorkerCard() {
  const { t } = useTranslation();
  
  return (
    <div className="w-full p-4 sm:p-6 rounded-3xl text-white shadow-lg bg-gradient-to-b from-[#00FFD3] from-60% to-[#37C19F]">
      <div className="flex items-center gap-4">
        <img src={`${publicUrl}/images/avatarMale.png`} />
        <div>
          <h2 className="font-semibold text-2xl line-clamp-1">
            WORKER NAME
          </h2>
          <p className="text-sm font-medium flex items-center gap-2">
            <span className="font-semibold">{t('workerCard.lastLoginLabel')}: </span>{" "}
            <span>TIMESTAMP</span>
          </p>
        </div>
      </div>
      <div>
        <p className="mt-2">75 {t('workerCard.projectsCompleted')}</p>
        <p className="mt-2 flex items-center gap-2 text-sm">
          <span className="font-semibold">{t('workerCard.startedOnLabel')}: </span>
          <span>TIMESTAMP</span>
        </p>
        <p className="mt-2 flex items-center gap-2 text-sm">
          <span className="font-semibold">{t('workerCard.latestProjectLabel')}: </span>
          <span>ASSIGNED PROJECT</span>
        </p>
      </div>
    </div>
  );
}

export default WorkerCard;
