
import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url("./images/LoginImg.jpeg")` }}
    >
      <div className="absolute bg-gray-900 bg-opacity-80 p-4 rounded-lg shadow-lg h-[90%] w-[90%] sm:w-[70%]">
        <div className="flex justify-center items-center mb-2 mt-9">
          <img
            src={"./images/logo.png"}
            alt="Logo"
            className="w-[100px] h-[100px]"
          />
        </div>
        <form className="w-full mt-20">
          <div className="md:max-w-sm mx-auto">
            <label htmlFor="email" className="block text-gray-300">
              Email or Username
            </label>
            <input
              type="email"
              id="email"
              className="w-full inline-block mx-auto  h-10 py-2 px-4 rounded-full bg-gray-500 text-gray-100 placeholder-white border border-green-500 focus:outline-none text-base"
              placeholder="Enter your Email or Username"
            />
          </div>
          <div className="md:max-w-sm mx-auto mt-4">
            <label htmlFor="password" className="block text-gray-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full inline-block mx-auto  h-10 py-2 px-4 rounded-full bg-gray-500 text-gray-100 placeholder-white border border-green-500 focus:outline-none text-base"
              placeholder="Enter your Password"
            />
            <Link
              to="/ForgotPassword"
              className="text-green-500 inline-block mt-2 "
            >
              Forgot your password ?
            </Link>
          </div>
          <div className="flex justify-center mt-2">
            <button
              type="submit"
              className="w-28 h-8 mt-2 bg-transparent border-green-500 text-green-500 border rounded-full focus:outline-none"
            >
              LOG IN
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
