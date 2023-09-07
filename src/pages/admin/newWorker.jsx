import React, { useState } from "react";
import Heading from "../../common/heading";
import Container from "../../common/container";

function NewWorker() {
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
    // <Container>
    // <div className="h-screen lg:min-h-screen xs:min-h-screen xs:min-w-full xsm:w-full xsm:h-full xs:justify-center flex-col items-center justify-center mt-20 md:mt-0 text-[#505050]">
    <div className="w-full xs:h-auto xs:min-h-0 xsm:h-auto xsm:min-h-0 xs:w-80% bg-white rounded-3xl mt-40 p-6">
        <div className="flex justify-end">
          <img
            src="./images/close.png"
            alt="close"
            className="w-5 h-5 cursor-pointer"
          />
        </div>

        <Heading title={"Adding new Worker"} className="items-center" />

        <div className="col-span-12 md:col-span-8 md:mt-4 mt-10">
          <form className="flex flex-col gap-4 lg:gap-6 lg:ml-14">
            <label className="flex flex-col lg:flex-row gap-1">
              <span className="md:w-1/4 text-lg font-bold">Full Name:</span>
              <input
                type="text"
                name="workerName"
                value={inputValues?.workerName}
                onChange={onChange}
                placeholder="Enter the name of the Worker"
                className="h-10 xs:w-full  md:w-[40rem] py-2 px-4 rounded-full border-[1px] border-[#8C8C8C] bg-white focus-within:outline-[#21D0B2]"
              />
            </label>

            <label className="flex flex-col lg:flex-row gap-1">
              <span className="md:w-1/4 text-lg font-bold">Email:</span>
              <input
                type="text"
                placeholder="Enter the email of the Worker"
                className="h-10 xs:w-full md:w-[40rem] py-2 px-4 rounded-full border-[1px] border-[#8C8C8C] bg-white focus-within:outline-[#21D0B2]"
              />
            </label>

            <label className="flex flex-col lg:flex-row gap-1">
              <span className="md:w-1/4 text-lg font-bold">Password:</span>
              <input
                type="text"
                name="password"
                value={inputValues?.password}
                placeholder="Enter the password of the Worker"
                className="h-10 xs:w-full md:w-[40rem] py-2 px-4 rounded-full border-[1px] border-[#8C8C8C] bg-white focus-within:outline-[#21D0B2]"
              />
            </label>
            <span
              className="ml-auto mt-[-16] text-[#00946f] font-bold hover:underline cursor-pointer"
              onClick={generateRandomPassword}
            >
              Generate default
            </span>

            <div>
              <label className="flex flex-col lg:flex-row gap-1">
                <span className="md:w-1/4 text-lg font-bold">Choose Role:</span>
                <div className="flex mx-1">
                  <label className="font-bold text-lg mb-1">Admin</label>
                  <input
                    type="checkbox"
                    className="h-5 w-[5rem] py-2 px-4 border-[1px] border-[#8C8C8C] bg-black focus-within:outline-[#21D0B2] checked:bg-black"
                  />
                </div>
                <div className="flex mx-1">
                  <label className="font-bold text-lg mb-1">Supervisor</label>
                  <input
                    type="checkbox"
                    className="h-5 w-[5rem] py-2 px-4 border-[1px] border-[#8C8C8C] bg-black focus-within:outline-[#21D0B2] checked:bg-black"
                  />
                </div>
                <div className="flex mx-1">
                  <label className="font-bold text-lg mb-1">Worker</label>
                  <input
                    type="checkbox"
                    className="h-5 w-[5rem] py-2 px-4 border-[1px] border-[black] bg-black checked:bg-black"
                  />
                </div>
              </label>
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
    // </div>
    // </Container>
  );
}

export default NewWorker;