import React, { useState } from "react";
import Heading from "../common/heading";

function NewWorkerOverlay({ onClose, onSubmit }) {
  const [inputValues, setInputValues] = useState({});
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

  return (
    <div className="w-[95vw] lg:w-[50vw] max-w-[650px] bg-white rounded-3xl p-3 sm:p-6">
      <div className="flex items-center justify-between">
        <Heading title={"Adding new Worker"} className="items-center" />
        <button onClick={onClose}>
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <div className="mt-6">
        <form className="flex flex-col" onSubmit={onSubmit}>
          <label className="flex flex-col lg:flex-row gap-1 mb-4">
            <span className="md:w-1/4 text-lg font-medium">Full Name:</span>
            <input
              type="text"
              name="workerName"
              value={inputValues?.workerName}
              onChange={onChange}
              placeholder="Enter the name of the Worker"
              className="h-10 flex-1 py-2 px-4 rounded-full border-[1px] border-[#8C8C8C] bg-white focus-within:outline-[#21D0B2]"
            />
          </label>

          <label className="flex flex-col lg:flex-row gap-1 mb-4">
            <span className="md:w-1/4 text-lg font-medium">Email:</span>
            <input
              type="text"
              placeholder="Enter the email of the Worker"
              className="h-10 flex-1 py-2 px-4 rounded-full border-[1px] border-[#8C8C8C] bg-white focus-within:outline-[#21D0B2]"
            />
          </label>

          <label className="flex flex-col lg:flex-row gap-1 mb-4">
            <span className="md:w-1/4 text-lg font-medium">Password:</span>
            <input
              type="text"
              name="password"
              value={inputValues?.password}
              placeholder="Enter the password of the Worker"
              className="h-10 flex-1 py-2 px-4 rounded-full border-[1px] border-[#8C8C8C] bg-white focus-within:outline-[#21D0B2]"
            />
          </label>
          <span
            className="ml-auto mt-[-16] text-[#00946f] font-medium hover:underline cursor-pointer"
            onClick={generateRandomPassword}
          >
            Generate default
          </span>

          <div className="flex sm:items-center flex-col sm:flex-row">
              <span className="text-lg font-medium mr-4">Choose Role:</span>
              <div className="flex items-center flex-1 gap-4">
              <div className="flex items-center">
                <label className="text-lg mr-2">Admin</label>
                <input type="checkbox" />
              </div>
              <div className="flex items-center">
                <label className="text-lg mr-2">Supervisor</label>
                <input type="checkbox" />
              </div>
              <div className="flex items-center">
                <label className="text-lg mr-2">Worker</label>
                <input type="checkbox" />
              </div>
              </div>
          </div>

          <div className="mb-4 mt-4 lg:mt-0 md:mt-0 sm:mt-0 xsm:mt-0 text-center">
            <button
              type="submit"
              className="w-32 h-10 mt-2 xs:mt-auto bg-transparent border-[#2ce6bd] text-[#2ce6bd] border-2 rounded-full focus:outline-none"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewWorkerOverlay;
