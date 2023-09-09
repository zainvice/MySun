

const Password = () => {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
        style={{ backgroundImage: `url("./images/ForgotPasswordImg.jpeg")` }}
      >
        <div className="absolute bg-gray-900 bg-opacity-80 p-4 rounded-lg shadow-lg h-[90%] w-[90%] sm:w-[70%]">
          <div className="w-full">
            {/* Added the logo image and Login heading */}
            <div className="flex justify-center items-center mb-2 mt-9">
              <img
                src={'./images/logo.png'} // Used the imported logo image source
                alt="Logo"
                className="w-[100px] h-[100px]" // Adjusted width and height as needed
              />
            </div>
            <form className="w-full mt-20">
              <div className="md:max-w-sm mx-auto">
                <label htmlFor="email" className="block text-gray-300 ">
                  Enter your Password
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full inline-block mx-auto  h-10 py-2 px-4 rounded-full bg-gray-500 text-gray-100 placeholder-white border border-green-500 focus:outline-none text-base"
                  placeholder="Use a new password for your account"
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
  
  export default Password;
  