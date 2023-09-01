import React from "react";
import LoginImg from "../Images/LoginImg.jpeg";
import Logo1 from "../Images/logo1.png";
import { Link } from "react-router-dom"; // Use Link 

const Login = () => {
  const formStyle = {
    width: "75%",
    height: "90%",
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${LoginImg})` }}
    >
      <div
        className="absolute bg-gray-900 bg-opacity-80 p-4 rounded-lg shadow-lg sm:w-96"
        style={formStyle}
      >
        <form className="flex flex-col items-center">
          <div>
            {/* Add the logo image and Login heading */}
            <div className="flex justify-center mb-4">
              <img
                src={Logo1} // Use the imported logo image source
                alt="Logo"
                className="w-16 h-12 sm:w-24 sm:h-20 mr-2 " // Adjust width and height as needed
              />
              <h2 className="text-lg sm:text-5xl font-semibold text-white">
                MySun
              </h2>
            </div>
            <div className="mb-5 mt-9">
              <label htmlFor="email" className="block text-gray-300">
                Email or Username
              </label>
              <input
                type="email"
                id="email"
                className="w-full h-10 py-1 px-2 rounded-full bg-gray-500 text-gray-100 placeholder-white border border-green-500 focus:outline-none text-base"
                placeholder="Enter your Email or Username"
              />
            </div>
            <div className="mb-5 mt-5">
              <label htmlFor="password" className="block text-gray-300">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full h-10 py-1 px-2 rounded-full bg-gray-500 text-gray-100 placeholder-white border border-green-500 focus:outline-none text-base"
                placeholder="Enter your Password"
              />
              <Link to="/ForgotPassword" className="text-green-500 ml-auto">
                Forgot your Password?
              </Link>
               {/* <div className="text-green-500 ml-auto">
                  <Link to="/ForgotPassword" className="text-right block">
                    Forgot your Password?
                  </Link>
                </div> */}
            </div>
            <div className="flex justify-center mt-2">
              <button
                type="submit"
                className="w-28 h-8 mt-2 bg-transparent border-green-500 text-green-500 border rounded-full focus:outline-none"
              >
                LOG IN
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
