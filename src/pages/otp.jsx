import { useRef } from "react"; // Import useRef

const OTP = () => {
  // Create refs for each input element
  const otp1Ref = useRef(null);
  const otp2Ref = useRef(null);
  const otp3Ref = useRef(null);
  const otp4Ref = useRef(null);
  const otp5Ref = useRef(null);
  const otp6Ref = useRef(null);

  // Function to handle input focus on change
  const handleInputFocus = (currentInput, nextInput) => {
    if (currentInput.value.length === 1) {
      nextInput.focus();
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url("./images/ForgotPasswordImg.jpeg")` }}
    >
      <div className="absolute bg-gray-900 bg-opacity-80 p-4 rounded-lg shadow-lg h-[96%] w-[90%] sm:w-[70%]">
        <div className="w-full">
          {/* Added the logo image and Login heading */}
          <div className="flex justify-center items-center mb-2 mt-9">
            <img
              src={"./images/logo.png"} // Used the imported logo image source
              alt="Logo"
              className="w-[100px] h-[100px]" // Adjusted width and height as needed
            />
          </div>
          <form className="w-full mt-20 flex flex-col justify-center">
              <label htmlFor="otp" className="block text-gray-300 text-xl text-center mb-4">
                Enter OTP
              </label>
              <div className="flex justify-center items-center gap-3 mt-2">
                <input
                  type="text"
                  id="otp1"
                  className="w-10 h-10 sm:w-12 sm:h-12 text-center rounded-full bg-gray-500 text-[#2ce6bd] border border-[#2ce6bd] focus:outline-none text-lg "
                  maxLength="1"
                  onChange={() => handleInputFocus(otp1Ref.current, otp2Ref.current)}
                  ref={otp1Ref}
                />
                <input
                  type="text"
                  id="otp2"
                  className="w-10 h-10 sm:w-12 sm:h-12 text-center rounded-full bg-gray-500 text-[#2ce6bd] border border-[#2ce6bd] focus:outline-none text-lg "
                  maxLength="1"
                  onChange={() => handleInputFocus(otp2Ref.current, otp3Ref.current)}
                  ref={otp2Ref}
                />
                <input
                  type="text"
                  id="otp3"
                  className="w-10 h-10 sm:w-12 sm:h-12 text-center rounded-full bg-gray-500 text-[#2ce6bd] border border-[#2ce6bd] focus:outline-none text-lg "
                  maxLength="1"
                  onChange={() => handleInputFocus(otp3Ref.current, otp4Ref.current)}
                  ref={otp3Ref}
                />
                <input
                  type="text"
                  id="otp4"
                  className="w-10 h-10 sm:w-12 sm:h-12 text-center rounded-full bg-gray-500 text-[#2ce6bd] border border-[#2ce6bd] focus:outline-none text-lg "
                  maxLength="1"
                  onChange={() => handleInputFocus(otp4Ref.current, otp5Ref.current)}
                  ref={otp4Ref}
                />
                <input
                  type="text"
                  id="otp5"
                  className="w-10 h-10 sm:w-12 sm:h-12 text-center rounded-full bg-gray-500 text-[#2ce6bd] border border-[#2ce6bd] focus:outline-none text-lg "
                  maxLength="1"
                  onChange={() => handleInputFocus(otp5Ref.current, otp6Ref.current)}
                  ref={otp5Ref}
                />
                <input
                  type="text"
                  id="otp6"
                  className="w-10 h-10 sm:w-12 sm:h-12 text-center rounded-full bg-gray-500 text-[#2ce6bd] border border-[#2ce6bd] focus:outline-none text-lg "
                  maxLength="1"
                  ref={otp6Ref}
                />
              </div>
              <p className="text-gray-300 text-sm text-center mt-4">
                Enter the 6-digit OTP you received in your mail. Not received?{" "}
                <label className="text-[#2ce6bd] hover:underline cursor-pointer">Resend!</label>
              </p>
              <button
                type="submit"
                className="w-28 h-10 inline-block mt-2 mx-auto bg-transparent border-[#2ce6bd] text-[#2ce6bd] border rounded-full focus:outline-none"
              >
                RESET
              </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OTP;