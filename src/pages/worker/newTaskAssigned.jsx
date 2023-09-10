import React, { useState, useEffect } from "react";
import Container from "../../common/container";
import Layout from "../../layout";

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
        <div className="grid grid-cols-3 items-center m-4">
          <span>
            <img
              src="./images/taskIcon-lg.png"
              alt="taskIcon"
              className="w-10 h-10 sm:w-14 sm:h-14"
            />
            <label className="text-lg sm:text-xl font-bold">New Task</label>
          </span>

          <div className="flex items-center mx-auto">
            <button onClick={handleStopClick}>
              <span className="material-symbols-outlined text-red-600 text-4xl">
                stop_circle
              </span>
            </button>
            <button onClick={handleStartClick}>
              <span className="material-symbols-outlined text-[#34F5C5] text-4xl">
                play_circle
              </span>
            </button>
          </div>

          <div className=" flex justify-end items-center">
            <span className="material-symbols-outlined text-[#34F5C5] text-4xl hidden sm:inline">
              schedule
            </span>
            <div className="ml-1">
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
        <div className="text-white grid grid-cols-1 sm:grid-cols-2  md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Building International Number"
            className="rounded-full bg-gray-200 text-black px-4 h-12 w-full"
          />
          <input
            type="text"
            placeholder="Worker Name"
            className="rounded-full bg-gray-200 text-black px-4 h-12 w-full"
          />
          <input
            type="text"
            placeholder="Address"
            className="rounded-full bg-gray-200 text-black px-4 h-12 w-full"
          />
          <input
            type="text"
            placeholder="Physical Number"
            className="rounded-full bg-gray-200 text-black px-4 h-12 w-full"
          />
          <input
            type="text"
            placeholder="Owner ID"
            className="rounded-full bg-gray-200 text-black px-4 h-12 w-full"
          />
          <input
            type="text"
            placeholder="Owner Name"
            className="rounded-full bg-gray-200 text-black px-4 h-12 w-full"
          />
          <input
            type="text"
            placeholder="Phone Number"
            className="rounded-full bg-gray-200 text-black px-4 h-12 w-full"
          />
          <input
            type="text"
            placeholder="Old Area"
            className="rounded-full bg-gray-200 text-black px-4 h-12 w-full"
          />
          <input
            type="text"
            placeholder="Property Type"
            className="rounded-full bg-gray-200 text-black px-4 h-12 w-full"
          />
          <input
            type="text"
            placeholder="GOSH"
            className="rounded-full bg-gray-200 text-black px-4 h-12 w-full"
          />
          <input
            type="text"
            placeholder="HELMA"
            className="rounded-full bg-gray-200 text-black px-4 h-12 w-full"
          />
          <input
            type="text"
            placeholder="FLOOR"
            className="rounded-full bg-gray-200 text-black px-4 h-12 w-full"
          />
        </div>
        <div className="mt-4 sm:mt-8 mx-2 grid grid-cols-2  md:grid-cols-3 lg:grid-cols-4 justify-center items-center">
          <label className="inline-flex items-center mb-2 sm:mb-5 ">
            <input type="checkbox" className="hidden peer" />
            <span className="w-5 h-5 border rounded-full border-gray-800 mr-1 peer-checked:bg-gray-800 flex justify-center items-center">
              <span class="material-symbols-outlined text-sm font-bold text-white peer-checked:inline-block">
                done
              </span>
            </span>
            <span className="text-gray-700 text-base sm:text-lg">
              Coordination Letter
            </span>
          </label>
          <label className="inline-flex items-center mb-2 sm:mb-5 ">
            <input type="checkbox" className="hidden peer" />
            <span className="w-5 h-5 border rounded-full border-gray-800 mr-1 peer-checked:bg-gray-800 flex justify-center items-center">
              <span class="material-symbols-outlined text-sm font-bold text-white peer-checked:inline-block">
                done
              </span>
            </span>
            <span className="text-gray-700 text-base sm:text-lg">
              Refused Survey
            </span>
          </label>
          <label className="inline-flex items-center mb-2 sm:mb-5 ">
            <input type="checkbox" className="hidden peer" />
            <span className="w-5 h-5 border rounded-full border-gray-800 mr-1 peer-checked:bg-gray-800 flex justify-center items-center">
              <span class="material-symbols-outlined text-sm font-bold text-white peer-checked:inline-block">
                done
              </span>
            </span>
            <span className="text-gray-700 text-base sm:text-lg">
              Aerial Mapping
            </span>
          </label>
          <label className="inline-flex items-center mb-2 sm:mb-5 ">
            <input type="checkbox" className="hidden peer" />
            <span className="w-5 h-5 border rounded-full border-gray-800 mr-1 peer-checked:bg-gray-800 flex justify-center items-center">
              <span class="material-symbols-outlined text-sm font-bold text-white peer-checked:inline-block">
                done
              </span>
            </span>
            <span className="text-gray-700 text-base sm:text-lg">
              Missing Information
            </span>
          </label>
          <label className="inline-flex items-center mb-2 sm:mb-5 ">
            <input type="checkbox" className="hidden peer" />
            <span className="w-5 h-5 border rounded-full border-gray-800 mr-1 peer-checked:bg-gray-800 flex justify-center items-center">
              <span class="material-symbols-outlined text-sm font-bold text-white peer-checked:inline-block">
                done
              </span>
            </span>
            <span className="text-gray-700 text-base sm:text-lg">
              Unite Address
            </span>
          </label>
          <label className="inline-flex items-center mb-2 sm:mb-5 ">
            <input type="checkbox" className="hidden peer" />
            <span className="w-5 h-5 border rounded-full border-gray-800 mr-1 peer-checked:bg-gray-800 flex justify-center items-center">
              <span class="material-symbols-outlined text-sm font-bold text-white peer-checked:inline-block">
                done
              </span>
            </span>
            <span className="text-gray-700 text-base sm:text-lg">
              Under Construction
            </span>
          </label>
        </div>
        <div>
          <textarea
            type="text"
            placeholder="Notes"
            className="h-32 p-4 items-start bg-gray-200 rounded-3xl w-full sm:w-2/3 lg:w-1/2"
          />
        </div>
      </Container>
    </Layout>
  );
}

export default NewTaskAssigned;
