import React from "react";
import ForgotPasswordImg from "../images/ForgotPasswordImg.jpeg";
import Logo1 from "../images/logo1.png";

const ForgotPassword = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${ForgotPasswordImg})` }}
    >
      <div className="absolute bg-gray-900 bg-opacity-80 p-4 rounded-lg shadow-lg h-[90%] w-[90%] sm:w-[70%]">
        <div className="w-full">
          {/* Added the logo image and Login heading */}
          <div className="flex justify-center items-center mb-2 mt-9">
            <img
              src={Logo1} // Used the imported logo image source
              alt="Logo"
              className="w-20 h-14 sm:w-32 sm:h-20 mr-2 " // Adjusted width and height as needed
            />
            <h2 className="text-4xl  font-semibold text-white">MySun</h2>
          </div>
          <form className="w-full mt-20">
            <div className="md:max-w-sm mx-auto">
              <label htmlFor="email" className="block text-gray-300 ">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full inline-block mx-auto  h-10 py-2 px-4 rounded-full bg-gray-500 text-gray-100 placeholder-white border border-green-500 focus:outline-none text-base"
                placeholder="Enter your Email"
              />
            </div>

            <div className="flex justify-center mt-4">
              <button
                type="submit"
                className="w-28 h-8 mt-2 bg-transparent border-green-500 text-green-500 border rounded-full focus:outline-none"
              >
                RESET
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
