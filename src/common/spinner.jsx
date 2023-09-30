import React from "react";

function Spinner({message}) {
  return (
    <div className="h-96 w-full flex items-center justify-center">
      <div
        className="text-[#00FFD3] inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
        role="status"
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Loading...
        </span>
        
      </div>
      <p className="absolute mt-20 mr-0 text-gray-600 font-bold">{message ||"Please hold!"}</p>
    </div>
  );
}

export default Spinner;
