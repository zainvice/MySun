import { useState } from "react";
import { publicUrl } from "../utils";

function Worker({ worker, selectedWorkers, onSelect }) {
  const [isSelected, setSelected] = useState(
    selectedWorkers?.some((selected) => selected._id === worker._id)
  );

  const onClick = () => {
    if (isSelected) {
      onSelect((prev) =>
        prev?.filter((selected) => selected._id !== worker._id)
      );
      setSelected(false);
      return;
    }

    if (
      selectedWorkers?.some(
        (selected) =>
          selected?.role?.toLowerCase() === "supervisor" &&
          worker?.role?.toLowerCase() === "supervisor"
      )
    )
      return;

    onSelect((prev) => [
      ...prev,
      {
        _id: worker?._id,
        fullName: worker?.fullName ?? '',
        email: worker?.email,
        role: worker?.role,
      },
    ]);

    setSelected(true);
  };

  return (
    <button
      className={`shadow-md bg-gradient-to-b h-16 w-full rounded-2xl px-4 py-2 grid grid-cols-12 text-white items-center ${
        isSelected
          ? "from-[#0070C0] from-0% to-[#E63950]"
          : "from-[#34F5C5] to-[#2CA587]"
      }`}
      onClick={onClick}
    >
      <img
        className="col-span-2 h-10 w-10"
        src={`${publicUrl}/images/avatarMale.png`}
      />
      <p className="col-span-3 text-ellipsis line-clamp-1">{worker?.fullName}</p>
      <p className="col-span-3 text-ellipsis line-clamp-1">{worker?.email}</p>
      <p className="col-span-2 text-ellipsis line-clamp-1">{worker?.role}</p>
    </button>
  );
}

export default Worker;
