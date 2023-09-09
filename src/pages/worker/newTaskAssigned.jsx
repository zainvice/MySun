import React, { useState, useEffect } from "react";
import Container from "../../common/container";
import Layout from "../../layout";
import './checkboxCustom.css';
// import startImage from "./start.png"; // Replace with the path to your image

function NewTaskAssigned() {
  const [timerRunning, setTimerRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval;

    if (timerRunning) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [timerRunning]);

  const handleStartClick = () => {
    setTimerRunning(true);
  };

  const handleStopClick = () => {
    setTimerRunning(false);
  };

  // Calculate hours, minutes, and seconds
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return (
    <Layout>
      <Container>
        <div className="grid grid-cols-3 justify-center items-center mt-4 mx-4">
          <span>
            <img
              src="./images/taskIcon-lg.png"
              alt="taskIcon"
              className="w-14 h-14"
            />
            <label className="text-xl font-bold">New Task</label>
          </span>

          <div className="flex items-center px:10 sm:px-20 md:px-20 lg:px-20 xl:px-20">
            <button onClick={handleStopClick} className=" ">
              <img
                src="./images/stop.png"
                alt="start"
                className="w-8 h-8 sm:w-8 sm:h-8 md:w-8 md:h-8 lg:w-8 lg:h-8 xl:w-8 xl:h-8"
              />
            </button>
            <button onClick={handleStartClick} className="">
              <img
                src="./images/start.png"
                alt="stop"
                className="w-8 h-8 sm:w-8 sm:h-8 md:w-8 md:h-8 lg:w-8 lg:h-8 xl:w-8 xl:h-8"
              />
            </button>
          </div>
          <div className="flex-grow text-right items-center sm:pl-32 md:pl-40 lg:pl-40 xl:pl-40 pt-4">
            <div className="flex items-center">
              <img src="./images/clock.png" alt="clock" className="h-8 w-8" />
              <span className="text-blue-600">
                {hours.toString().padStart(2, "0")}:
              </span>
              <span className="text-blue-300">
                {minutes.toString().padStart(2, "0")}:
              </span>
              <span className="text-green-500">
                {remainingSeconds.toString().padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
        <div className="text-white mt-6 mx-10 grid grid-cols-1 justify-center items-center sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
          <span className="py-2 px-4">
            <input
              type="text"
              placeholder="Building International Number"
              className="rounded-full border-2 bg-gray-200 text-black px-4 h-12 w-full sm:w-[68] md:w-[68] lg:w-[70] xl:w-80"
            />
          </span>
          <span className="py-2 px-4">
            <input
              type="text"
              placeholder="Worker Name"
              className="rounded-full border-2 bg-gray-200 text-black px-4 h-12 w-full sm:w-[68] md:w-[68] lg:w-[70] xl:w-80"
            />
          </span>
          <span className="py-2 px-4">
            <input
              type="text"
              placeholder="Address"
              className="rounded-full border-2 bg-gray-200 text-black px-4 h-12 w-full sm:w-[68] md:w-[68] lg:w-[70] xl:w-80"
            />
          </span>
          <span className="py-2 px-4">
            <input
              type="text"
              placeholder="Physical Number"
              className="rounded-full border-2 bg-gray-200 text-black px-4 h-12 w-full sm:w-[68] md:w-[68] lg:w-[70] xl:w-80"
            />
          </span>
          <span className="py-2 px-4">
            <input
              type="text"
              placeholder="Owner ID"
              className="rounded-full border-2 bg-gray-200 text-black px-4 h-12 w-full sm:w-[68] md:w-[68] lg:w-[70] xl:w-80"
            />
          </span>
          <span className="py-2 px-4">
            <input
              type="text"
              placeholder="Owner Name"
              className="rounded-full border-2 bg-gray-200 text-black px-4 h-12 w-full sm:w-[68] md:w-[68] lg:w-[70] xl:w-80"
            />
          </span>
          <span className="py-2 px-4">
            <input
              type="text"
              placeholder="Phone Number"
              className="rounded-full border-2 bg-gray-200 text-black px-4 h-12 w-full sm:w-[68] md:w-[68] lg:w-[70] xl:w-80"
            />
          </span>
          <span className="py-2 px-4">
            <input
              type="text"
              placeholder="Old Area"
              className="rounded-full border-2 bg-gray-200 text-black px-4 h-12 w-full sm:w-[68] md:w-[68] lg:w-[70] xl:w-80"
            />
          </span>
          <span className="py-2 px-4">
            <input
              type="text"
              placeholder="Property Type"
              className="rounded-full border-2 bg-gray-200 text-black px-4 h-12 w-full sm:w-[68] md:w-[68] lg:w-[70] xl:w-80"
            />
          </span>
          <span className="py-2 px-4">
            <input
              type="text"
              placeholder="GOSH"
              className="rounded-full border-2 bg-gray-200 text-black px-4 h-12 w-full sm:w-[68] md:w-[68] lg:w-[70] xl:w-80"
            />
          </span>
          <span className="py-2 px-4">
            <input
              type="text"
              placeholder="HELMA"
              className="rounded-full border-2 bg-gray-200 text-black px-4 h-12 w-full sm:w-[68] md:w-[68] lg:w-[70] xl:w-80"
            />
          </span>
          <span className="py-2 px-4">
            <input
              type="text"
              placeholder="FLOOR"
              className="rounded-full border-2 bg-gray-200 text-black px-4 h-12 w-full sm:w-[68] md:w-[68] lg:w-[70] xl:w-80"
            />
          </span>
        </div>
        <div className="mt-8 mx-16 grid grid-cols-2 justify-center items-center sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
        <label className="inline-flex items-center space-x-2 mb-5">
            <input type="checkbox" className="hidden" />
            <div className="w-8 h-8 border-2 border-black rounded-full relative">
              <img
                src="./images/check.png"
                alt="White Tickmark"
                className="w-4 h-4 absolute inset-0 m-auto"
              />
            </div>
            <span className="text-gray-700 text-sm sm:text-xl md:text-xl lg:text-xl xl:text-xl">
            Coordination Letter
            </span>
          </label>
          <label className="inline-flex items-center space-x-2 mb-5">
            <input type="checkbox" className="hidden" />
            <div className="w-8 h-8 border-2 border-black rounded-full relative">
              <img
                src="./images/check.png"
                alt="White Tickmark"
                className="w-4 h-4 absolute inset-0 m-auto"
              />
            </div>
            <span className="text-gray-700 text-sm sm:text-xl md:text-xl lg:text-xl xl:text-xl">
            Refused Survey
            </span>
          </label>
          <label className="inline-flex items-center space-x-2 mb-5">
            <input type="checkbox" className="hidden" />
            <div className="w-8 h-8 border-2 border-black rounded-full relative">
              <img
                src="./images/check.png"
                alt="White Tickmark"
                className="w-4 h-4 absolute inset-0 m-auto"
              />
            </div>
            <span className="text-gray-700 text-sm sm:text-xl md:text-xl lg:text-xl xl:text-xl">
              Aerial Mapping
            </span>
          </label>
          <label className="inline-flex items-center space-x-2 mb-5">
            <input type="checkbox" className="hidden" />
            <div className="w-8 h-8 border-2 border-black rounded-full relative">
              <img
                src="./images/check.png"
                alt="White Tickmark"
                className="w-4 h-4 absolute inset-0 m-auto"
              />
            </div>
            <span className="text-gray-700 text-sm sm:text-xl md:text-xl lg:text-xl xl:text-xl">
            Missing Information
            </span>
          </label>
          <label className="inline-flex items-center space-x-2 mb-5">
            <input type="checkbox" className="hidden" />
            <div className="w-8 h-8 border-2 border-black rounded-full relative">
              <img
                src="./images/check.png"
                alt="White Tickmark"
                className="w-4 h-4 absolute inset-0 m-auto"
              />
            </div>
            <span className="text-gray-700 text-sm sm:text-xl md:text-xl lg:text-xl xl:text-xl">
            Unite Address
            </span>
          </label>
          <label className="inline-flex items-center space-x-2 mb-5">
            <input type="checkbox" className="hidden" />
            <div className="w-8 h-8 border-2 border-black rounded-full relative">
              <img
                src="./images/check.png"
                alt="White Tickmark"
                className="w-4 h-4 absolute inset-0 m-auto"
              />
            </div>
            <span className="text-gray-700 text-sm sm:text-xl md:text-xl lg:text-xl xl:text-xl">
            Under Construction
            </span>
          </label>
         
        </div>
        <div className="mx-16 mt-4 mb-32">
          <input
            type="text"
            placeholder="Notes"
            className="h-32 p-4 items-start border-2 bg-gray-200 border-gray-400 rounded-3xl w-1/2"
          />
        </div>
      </Container>
    </Layout>
  );
}

export default NewTaskAssigned;
