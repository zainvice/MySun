import { publicUrl } from "../utils"

function Worker() {
  return (
    <div className='shadow-md bg-gradient-to-b from-[#34F5C5] to-[#2CA587] h-16 w-full rounded-2xl px-4 py-2 grid grid-cols-12 text-white items-center'>
      <img className='col-span-2 h-10 w-10' src={`${publicUrl}/images/avatarFemale.png`} />
      <p className='col-span-5 text-ellipsis line-clamp-1'>Muhammad Faizan</p>
      <p className='col-span-5 text-ellipsis line-clamp-1'>muhammadfaizan027915@gmail.com</p>
    </div>
  )
}

export default Worker