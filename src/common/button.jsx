import React from 'react'

function Button({title, onClick, additionalClasses}) {
  return (
    <button onClick={onClick} className={`py-2 px-4 rounded-full font-semibold text-white bg-[#34F5C5] hover:shadow-md transition-shadow duration-300 ${additionalClasses}`}>{title}</button>
  )
}

export default Button