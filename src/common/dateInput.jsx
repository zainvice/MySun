import { useState } from "react";

function DateInput({ placeholder, value, onChange, additonalProps, additionalClasses, }) {
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  const onDateChange = (e) => {
    setShowPlaceholder(e.target.value != '' ? false : true);
    onChange && onChange(e);
  }

  return (
    <input
      type="date"
      value={value}
      {...additonalProps}
      placeholder={placeholder}
      onChange={(onDateChange)}
      className={`h-10 w-full  py-2 px-4 rounded-full border-[1px] border-[#8C8C8C] bg-white focus-within:outline-[#21D0B2] ${showPlaceholder ? '' : 'has-value' } ${additionalClasses}`}
    />
  );
}

export default DateInput;
