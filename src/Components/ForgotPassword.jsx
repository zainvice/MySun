import React from "react";
import ForgotPasswordImg from "../Images/ForgotPasswordImg.jpeg";
import Logo1 from "../Images/logo1.png";

const ForgotPassword = () => {
  const formStyle = {
    width: "75%",
    height: "90%",
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${ForgotPasswordImg})` }}
    >
      <div
        className="absolute bg-gray-900 bg-opacity-80 p-4 rounded-lg shadow-lg sm:w-96"
        style={formStyle}
      >
        <form className="flex flex-col items-center">
          <div>
            {/* Added the logo image and Login heading */}
            <div className="flex justify-center mb-2 mt-9">
              <img
                src={Logo1} // Used the imported logo image source
                alt="Logo"
                className="w-16 h-12 sm:w-24 sm:h-20 mr-2 " // Adjusted width and height as needed
              />
              <h2 className="text-lg sm:text-5xl font-semibold text-white mb-9">
                MySun
              </h2>
            </div>
            <div className="mt-9">
              <label htmlFor="email" className="block text-gray-300 mt-20">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full h-10 py-1 px-2 rounded-full bg-gray-500 text-gray-100 placeholder-white border border-green-500 focus:outline-none text-base"
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
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
