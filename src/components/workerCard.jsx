import { publicUrl } from "../utils";

function WorkerCard() {
  return (
    <div className="w-full p-4 sm:p-6 rounded-3xl text-white shadow-lg bg-gradient-to-b from-[#00FFD3] from-60% to-[#37C19F]">
      <div className="flex items-center gap-4">
        <img src={`${publicUrl}/images/avatarMale.png`} />
        <div>
          <h2 className="font-semibold text-2xl line-clamp-1">
            Muhammad Faizan
          </h2>
          <p className="text-sm font-medium flex items-center gap-2">
            <span className="font-semibold">Last Login: </span>{" "}
            <span>3 days ago</span>
          </p>
        </div>
      </div>
      <div>
        <p className="mt-2">75 Projects Completed</p>
        <p className="mt-2 flex items-center gap-2 text-sm">
          <span className="font-semibold">Started on: </span>
          <span>21 Jan, 2023</span>
        </p>
        <p className="mt-2 flex items-center gap-2 text-sm">
          <span className="font-semibold">Latest Project: </span>
          <span>My Sun Development</span>
        </p>
      </div>
    </div>
  );
}

export default WorkerCard;
