import { useState } from "react";

function Container({ children, showMoreButton }) {
  const [showMore, setShowMore] = useState(showMoreButton);
  return (
    <div
      className={`w-full h-[calc(100vh-62px)] md:h-[calc(100vh-86px)] lg:h-[calc(100vh-68px)] p-2 sm:p-5 relative ${
        showMore ? "overflow-hidden" : "overflow-auto"
      }`}
    >
      {children}
      {showMore && (
        <div className="w-full h-60 bg-gradient-to-t from-white from-35% absolute bottom-0 left-0 p-4 z-10">
          <button className="w-full " onClick={() => setShowMore(false)}>
            <span className="material-symbols-outlined mt-16 text-6xl font-semibold text-[#848484] animate-bounce">
              stat_minus_1
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

export default Container;
