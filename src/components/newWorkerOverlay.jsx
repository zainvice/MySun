import React, { useState } from "react";
import Heading from "../common/heading";
import { createWorker } from "../api";
import Spinner from "../common/spinner";

function NewWorkerOverlay({ onClose }) {
  const [message, setMessage] = useState(null);
  const [inputValues, setInputValues] = useState({});
  const [creating, isCreating]= useState(false)
  const onChange = (e) => {
    const target = e.target ?? {};
    setInputValues((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));
  };

  const generateRandomPassword = () => {
    const length = 8;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    setInputValues((prev) => ({
      ...prev,
      password,
    }));
  };

  const onSubmit = async (event) => {
    isCreating(true)
    event.preventDefault();
    const data = await createWorker({ ...inputValues });
    setMessage(data.message);
    setInputValues({})
    isCreating(false)
  };

  return (
    <div className="w-[95vw] lg:w-[50vw] max-w-[650px] bg-white rounded-3xl p-3 sm:p-6">
      <div className="flex items-center justify-between">
        <Heading title={"Adding new Worker"} className="items-center" />
        <button
          onClick={onClose}
          className="hover:text-[#21D0B2] transform hover:scale-105 transition-transform duration-300"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
      {!creating?(
       <>
       
      <div className="mt-6">
        <form className="flex flex-col" onSubmit={onSubmit}>
          {message && (
            <div>
              <p className="italic font-medium text-[#2ce6bd] ">{message}</p>
            </div>
          )}

          <label className="flex flex-col lg:flex-row gap-1 mb-4">
            <span className="md:w-1/4 text-lg font-medium">Full Name:</span>
            <input
              type="text"
              name="fullName"
              onChange={onChange}
              placeholder="Enter the name of the Worker"
              value={inputValues?.fullName ?? ''}
              className="h-10 flex-1 py-2 px-4 rounded-full border-[1px] border-[#8C8C8C] bg-white focus-within:outline-[#21D0B2]"
            />
          </label>

          <label className="flex flex-col lg:flex-row gap-1 mb-4">
            <span className="md:w-1/4 text-lg font-medium">Username:</span>
            <input
              type="text"
              name="username"
              onChange={onChange}
              placeholder="Enter the username of the Worker"
              value={inputValues?.username ?? ''}
              className="h-10 flex-1 py-2 px-4 rounded-full border-[1px] border-[#8C8C8C] bg-white focus-within:outline-[#21D0B2]"
            />
          </label>

          <label className="flex flex-col lg:flex-row gap-1 mb-4">
            <span className="md:w-1/4 text-lg font-medium">Phone:</span>
            <input
              type="tel"
              name="phone"
              onChange={onChange}
              placeholder="Enter the Phone of the Worker"
              value={inputValues?.phone ?? ''}
              className="h-10 flex-1 py-2 px-4 rounded-full border-[1px] border-[#8C8C8C] bg-white focus-within:outline-[#21D0B2]"
            />
          </label>

          <label className="flex flex-col lg:flex-row gap-1 mb-4">
            <span className="md:w-1/4 text-lg font-medium">Email:</span>
            <input
              type="email"
              name="email"
              onChange={onChange}
              placeholder="Enter the email of the Worker"
              value={inputValues?.email ?? '' }
              className="h-10 flex-1 py-2 px-4 rounded-full border-[1px] border-[#8C8C8C] bg-white focus-within:outline-[#21D0B2]"
            />
          </label>

          <label className="flex flex-col lg:flex-row gap-1 mb-4">
            <span className="md:w-1/4 text-lg font-medium">Password:</span>
            <input
              type="text"
              name="password"
              onChange={onChange}
              value={inputValues?.password ?? '' }
              placeholder="Enter the password of the Worker"
              className="h-10 flex-1 py-2 px-4 rounded-full border-[1px] border-[#8C8C8C] bg-white focus-within:outline-[#21D0B2]"
            />
          </label>
          <span
            className="ml-auto mt-[-16] text-[#00946f] font-medium hover:underline cursor-pointer transform hover:scale-105 transition-transform duration-300"
            onClick={generateRandomPassword}
          >
            Generate default
          </span>

          <div className="flex sm:items-center flex-col sm:flex-row">
            <span className="text-lg font-medium mr-4">Choose Role:</span>
            <div className="flex items-center flex-1 gap-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value={"admin"}
                  checked={inputValues?.role === 'admin'}
                  onChange={onChange}
                />
                <label className="text-lg ml-2">Admin</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value={"supervisor"}
                  checked={inputValues?.role === 'supervisor'}
                  onChange={onChange}
                />
                <label className="text-lg ml-2">Supervisor</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value={"worker"}
                  checked={inputValues?.role === 'worker'}
                  onChange={onChange}
                />
                <label className="text-lg ml-2">Worker</label>
              </div>
            </div>
          </div>

          <div className="mb-4 mt-4 lg:mt-0 md:mt-0 sm:mt-0 xsm:mt-0 text-center">
            <button
              type="submit"
              className="w-32 h-10 mt-2 xs:mt-auto bg-transparent border-[#2ce6bd] text-[#2ce6bd] border-2 rounded-full focus:outline-none transform hover:scale-105 transition-transform duration-300 hover:bg-[#2ce6bd] hover:text-white"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
       </> 
      ) : (
        <Spinner/>
      )}
    </div>
  );
}

export default NewWorkerOverlay;
