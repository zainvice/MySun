import Worker from "./worker";

export default function WorkerOverlay() {
  return (
    <div className="h-[90vh] w-[95vw] sm:w-[50vw] lg:w-[40vw] box-border bg-[#E9E9E9] rounded-[2rem] shadow-xl p-3 sm:p-6">
      <label className="flex items-center w-full h-11 rounded-full bg-white px-3 shadow-sm overflow-hidden">
        <input placeholder="Search" className="flex-1 h-full focus-within:outline-none" />
        <span className="material-symbols-outlined text-3xl text-[#505050]">
          person_search
        </span>
      </label>

      <div className="pt-4 overflow-y-auto h-full flex flex-col gap-3">
        {Array(5)
          .fill(0)
          .map((i, index) => (
            <Worker key={index} />
          ))}
      </div>
    </div>
  );
}
