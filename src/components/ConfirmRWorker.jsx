
import Modal from 'react-modal';

function ConfirmRWorker({ isOpen, onRequestClose, onRemove, worker }) {
  
  const onClose = () =>{
   
    onRequestClose()
  }
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Reset Modal"
      className="w-64 m-auto p-4 bg-white rounded-lg shadow-lg"
      overlayClassName="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50"
    >
     
       
        <>
        <h2 className="text-2xl font-bold mb-4">Remove Worker</h2>
      <p className="text-gray-700 mb-4">Are you sure you want to remove <span className='font-bold text-red-600'>{worker?.fullName}</span>  with email <span className='font-bold text-red-600'>{worker?.email}</span> from this project? </p>
     
      <button
        onClick={onRemove}
        className="w-full mt-2 py-2 hover:bg-red-600 text-white rounded hover:shadow-md bg-[#34F5C5] hover:text-white transition duration-300 ease-in-out"
      >
        Remove {worker?.fullName}
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

export default ConfirmRWorker;
