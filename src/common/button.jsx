import React from "react";

function Button({ title, onClick, additionalClasses, titleClasses }) {
  return (
    <button
  onClick={onClick}
  className={`px-4 h-10 rounded-full border-white font-semibold text-white bg-[#34F5C5] hover:shadow-md hover:bg-white hover:text-[#34F5C5] hover:ease-in-out duration-300 focus:outline-none ${additionalClasses}`}
  >
  <span dangerouslySetInnerHTML={{ __html: title }} className={titleClasses} />
</button>

  );
}

export default Button;
