import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';

function AddTaskModal({ isOpen, onRequestClose, tasks, onFullReset, setTaskAdding }) {
  const [buildingNumber, setBuildingNumber] = useState("");
  const [tasksToAdd, setTasksToAdd] = useState([])
  const [letter, setLetter] = useState("")
  const [message, setMessage] = useState("")
  const [from, setFrom] = useState()
  const [to, setTo] = useState()
  const [inputError, setInputError] = useState(false);
  const Confirm = () => {
    let add = true
    if (tasks) {
      console.log(tasks);
      tasksToAdd?.forEach(newTask => {
        tasks?.forEach(existingTask => {
          if (existingTask.taskData["building number"] === newTask) {
            // If there is a match, set add to false
            add = false;
          }
        });
      });
    }
    
    if(add){
      const hasBothParts = /^[A-Z]\d+$/.test(buildingNumber);

      if (tasksToAdd.length>1) {
        setTaskAdding(tasksToAdd);
        onRequestClose();
        setBuildingNumber("")
        setMessage("")
      } else {
        setMessage(`Building numbers should have both to from selected.`);
      }
      /* setTaskToAdd(buildingNumber);
      onRequestClose() */
    }
    if(!add){
      setMessage(`Tasks from ${tasksToAdd.length>0&& tasksToAdd[0]} to ${tasksToAdd.length>0&& tasksToAdd[tasksToAdd.length-1]} already exist in project or some part of them already exist, please reconsider your selection!`)
    }
    //
    //
  };

  const onClose = () => {
    onRequestClose();
    setBuildingNumber("")
    setMessage("")
  };

  useEffect(()=>{
    if(buildingNumber){
      setLetter(buildingNumber[0])
      setFrom(buildingNumber[0]+'1')
    }
  }, [buildingNumber])
  
  const generateTasksArray = () => {
    const [column, start] = from.match(/[A-Z]+|[0-9]+/g);
    const end = to.match(/[0-9]+/g)[0];
    
    const tasksArray = [];
  
    for (let i = parseInt(start); i <= parseInt(end); i++) {
      const task = `${column}${i}`;
      tasksArray.push(task);
    }
  
    setTasksToAdd(tasksArray);
  };
  useEffect(()=>{
    if(to&&letter&&from){
      generateTasksArray()
    }
  }, [to, letter, from])

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
        <p className='mb-2'>Selected: {tasksToAdd.length>0&& tasksToAdd[0]}-{tasksToAdd.length>0&& tasksToAdd[tasksToAdd.length-1]}</p>
        <p className='mb-2 text-red-600'>{message}</p>
        <div className="flex flex-col mb-2">
        <input
          className={`p-3 rounded bg-gray-200 w-full ${inputError ? 'border-red-500' : ''}`}
          type="text"
          placeholder='Write a building letter'
          value={buildingNumber}
          onChange={(e) => {
            const inputText = e.target.value.toUpperCase();
          
            // Check if the input contains only letters
            setInputError(!/^[A-Z]*$/.test(inputText));
          
            // Update buildingNumber only if it contains letters
            if (/^[A-Z]*$/.test(inputText)) {
              setBuildingNumber(inputText);
              setMessage("");
            }
          }}
          maxLength={4}
        />
        {inputError && <p className="text-red-500">Please enter only letters.</p>}
        </div>
        <div className="flex mb-4">
          {/* Select for A-Z letters */}
          <div className='flex flex-col w-1/2'>
          <label htmlFor="letter" className='text-gray-400'>From</label>
          <select className="w-full p-2 mr-2 border" onChange={(e) => setFrom(`${letter}${e.target.value}`)}>
            <option key={""} value={""}>
              {from}
            </option>
            {Array.from({ length: 1500 }, (_, index) => index + 1).map(number => (
              <option key={number} value={number}>
                {letter}{number}
              </option>
            ))}
          </select>

          </div>
          
            
                
              
          
         

          {/* Select for 1-100 numbers */}
          <div className='flex flex-col w-1/2'>
          <label htmlFor="letter" className='ml-3 text-gray-400'>To</label>
          <select className="w-full p-2 ml-2 border" onChange={(e) => setTo(`${letter}${e.target.value}`)}>
            <option key={""} value={""}>
              {""}
            </option>
            {Array.from({ length: 1500 }, (_, index) => index + 1).map(number => (
              <option key={number} value={number}>
                {letter}{number}
              </option>
            ))}
          </select>

          </div>
         
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
