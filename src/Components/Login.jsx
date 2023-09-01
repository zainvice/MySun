import React from "react";
import LoginImg from "../Images/LoginImg.jpeg";
import Logo1 from "../Images/logo1.png";
import { Link } from "react-router-dom"; // Use Link
import './Login.css'
const Login = () => {
  const formStyle = {
    width: "78%",
    height: "90%",
    fontFamily: "'Inria Sans', sans-serif",
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${LoginImg})` }}
    >
      <div
        className="absolute bg-black bg-opacity-90 p-4 rounded-3xl shadow-lg sm:w-96"
        style={formStyle}
      >
        <form className="flex flex-col items-center">
          <div>
            {/* Add the logo image and Login heading */}
            <div className="flex justify-center mb-4 mt-9">
              <img
                src={Logo1}
                alt="Logo"
                className="w-64 h-12 sm:w-24 sm:h-20 mr-2"
                style={{ width: "8rem" }}
              />
              <h2 className="text-lg sm:text-6xl font-semibold text-white">
                MySun
              </h2>
            </div>

            {/* Email/Username Input */}
            <div className="mb-2 mt-9">
              <label
                htmlFor="email"
                className="block text-gray-300 mt-2 mb-2 text-lg sm:text-base"
              >
                Email or Username
              </label>
              <input
                type="email"
                id="email"
                className="w-full h-10 py-1 px-6 rounded-full bg-gray-500 text-gray-100 placeholder-white border border-green-500 focus:outline-none text-lg sm:text-base lg:w-96"
                placeholder="Enter your Email or Username"
              />
            </div>

            {/* Password Input */}
            <div className="mb-5 mt-9">
              <label
                htmlFor="password"
                className="block text-gray-300 mb-2 text-lg sm:text-base"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full h-10 py-1 px-6 rounded-full bg-gray-500 text-gray-100 placeholder-white border border-green-500 focus:outline-none text-lg sm:text-base lg:w-96"
                placeholder="Enter your Password"
              />
              <div className="w-full sm:w-auto text-lg" style={{ color: "#21D0B2", textAlign: "right" }}>
                <Link to="/ForgotPassword">
                  Forgot your Password?
                </Link>
              </div>
            </div>

            {/* Login Button */}
            <div className="flex justify-center mt-2">
              <button
                type="submit"
                className="w-32 h-10 mt-2 bg-transparent border-custom text-custom border rounded-full focus:outline-none text-lg sm:text-base"
                style={{ borderColor: "#21D0B2", color: "#21D0B2" }}
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