import React, { useState } from 'react';
import Modal from 'react-modal';

function AddTaskModal({ isOpen, onRequestClose, tasks, onFullReset, setTaskToAdd }) {
  const [buildingNumber, setBuildingNumber] = useState("");
  const [message, setMessage] = useState("")
  const Confirm = () => {
    let add = true
    if(tasks){
      console.log(tasks)
      tasks?.map(task=>{
        
        if(task.taskData["building number"]===buildingNumber){
          add = false;
        }
      })
    }
    if(add){
      const hasBothParts = /^[A-Z]\d+$/.test(buildingNumber);

      if (hasBothParts) {
        setTaskToAdd(buildingNumber);
        onRequestClose();
        setBuildingNumber("")
        setMessage("")
      } else {
        setMessage(`Building number should have both alphabetical and numerical parts.`);
      }
      /* setTaskToAdd(buildingNumber);
      onRequestClose() */
    }
    if(!add){
      setMessage(`Task: ${buildingNumber} already exists in project!`)
    }
    //
    //
  };

  const onClose = () => {
    onRequestClose();
    setBuildingNumber("")
    setMessage("")
  };

  const handleLetterSelect = (e) => {
    setBuildingNumber(e.target.value + (buildingNumber[1] || ""));
    console.log(buildingNumber)
    setMessage("")
  };

  const handleNumberSelect = (e) => {
    setBuildingNumber((buildingNumber[0] || "") + e.target.value);
    console.log(buildingNumber)
    setMessage("")
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Reset Modal"
      className="w-64 m-auto p-4 bg-white rounded-lg shadow-lg"
      overlayClassName="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50"
    >
      <>
        <h2 className="text-2xl font-bold mb-4">Add New Task</h2>
        <p className="text-gray-700 mb-4">Choose the building number to add a task</p>
        <p className='mb-2'>Selected: {buildingNumber}</p>
        <p className='mb-2 text-red-600'>{message}</p>
        <div className="flex mb-2">
            <input className='p-3 rounded bg-gray-200 w-full' type="text" placeholder='Write or select building number' value={buildingNumber} onChange={(e)=>{setBuildingNumber(e.target.value.toUpperCase()); setMessage("")}} maxLength={4}/>
        </div>
        <div className="flex mb-4">
          {/* Select for A-Z letters */}
          <select className="w-1/2 p-2 mr-2 border" onChange={handleLetterSelect}>
            <option key={""} value={""}>
                {""}
              </option>
            {Array.from({ length: 26 }, (_, index) => String.fromCharCode('A'.charCodeAt(0) + index)).map(letter => (
              <option key={letter} value={letter}>
                {letter}
              </option>
            ))}
          </select>

          {/* Select for 1-100 numbers */}
          <select className="w-1/2 p-2 ml-2 border" onChange={handleNumberSelect}>
          <option key={""} value={""}>
                {""}
              </option>
            {Array.from({ length: 100 }, (_, index) => index + 1).map(number => (
              
              <option key={number} value={number}>
                {number}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={Confirm}
          className="w-full py-2 bg-[#34F5C5] text-white rounded hover:shadow-md hover:bg-white hover:text-[#34F5C5] transition duration-300 ease-in-out"
        >
          Add
        </button>

        <button
          onClick={onClose}
          className="w-full mt-2 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 hover:shadow-md hover:text-white transition duration-300 ease-in-out"
        >
          Cancel
        </button>
      </>
    </Modal>
  );
}

export default AddTaskModal;
