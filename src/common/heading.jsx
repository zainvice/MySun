import React from "react";

function Heading({ title, additionalClases }) {
  return (
    <h1 className={`text-2xl font-semibold ${additionalClases}`}>
      {title}
    </h1>
  );
}

export default Heading;
