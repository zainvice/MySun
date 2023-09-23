import { useState } from "react";
import { resquestReset } from "../api";
import Message from "../common/message";
import Modal from "../common/modal";
import { useModal } from "../hooks";

const ForgotPassword = () => {
  const { isOpen, onOpen, onClose } = useModal();
  const [inputValues, setInputValues] = useState();
  const onRequestReset = (event) => {
    event.preventDefault();
    resquestReset(inputValues?.email).then(() => onOpen());
    setInputValues(null)
  };
  return (
    <>
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
        style={{ backgroundImage: `url("./images/ForgotPasswordImg.jpg")` }}
      >
        <div className="absolute bg-gray-900 bg-opacity-80 p-4 rounded-lg shadow-lg h-[90%] w-[90%] sm:w-[70%]">
          <div className="w-full">
            {/* Added the logo image and Login heading */}
            <div className="flex justify-center items-center mb-2 mt-9">
              <img
                src={"./images/logo.png"} // Used the imported logo image source
                alt="Logo"
                className="w-[100px] h-[100px]" // Adjusted width and height as needed
              />
            </div>
            <form className="w-full mt-20" onSubmit={onRequestReset}>
              <div className="md:max-w-sm mx-auto">
                <label htmlFor="email" className="block text-gray-300 ">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  onChange={(e) =>
                    setInputValues((prev) => ({
                      ...prev,
                      [e?.target?.name]: e?.target?.value,
                    }))
                  }
                  className="w-full inline-block mx-auto  h-10 py-2 px-4 rounded-full bg-gray-500 text-gray-100 placeholder-white border border-green-500 focus:outline-none text-base"
                  placeholder="Enter your Email"
                />
              </div>

              <div className="flex justify-center mt-4">
                <button
                  type="submit"
                  className="w-28 h-8 mt-2 bg-transparent border-green-500 text-green-500 transition-transform transform hover:bg-white border rounded-full focus:outline-none hover:scale-105"
                >
                  RESET
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={onClose}>
        <Message
          heading={"Alert!"}
          message={`We've sent a reset link to your email, use link to rest password.`}
          onClose={onClose}
        />
      </Modal>
    </>
  );
};

export default ForgotPassword;
