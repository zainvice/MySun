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
          <form className="w-full mt-20">
            <div className="xsm:max-w-sm xsm:mx-auto">
              <label htmlFor="otp" className="block text-gray-300 text-xl mx-40">
                Enter OTP
              </label>
              <div className="flex justify-center items-center gap-3 mt-2">
                <input
                  type="text"
                  id="otp1"
                  className="w-12 h-12 py-2 px-4 rounded-full bg-gray-500 text-[#2ce6bd] placeholder-white border border-[#2ce6bd] focus:outline-none text-2xl text-center "
                  maxLength="1"
                  onChange={() => handleInputFocus(otp1Ref.current, otp2Ref.current)}
                  ref={otp1Ref}
                />
                <input
                  type="text"
                  id="otp2"
                  className="w-12 h-12 py-2 px-4 rounded-full bg-gray-500 text-[#2ce6bd] placeholder-white border border-[#2ce6bd] focus:outline-none text-2xl text-center"
                  maxLength="1"
                  onChange={() => handleInputFocus(otp2Ref.current, otp3Ref.current)}
                  ref={otp2Ref}
                />
                <input
                  type="text"
                  id="otp3"
                  className="w-12 h-12 py-2 px-4 rounded-full bg-gray-500 text-[#2ce6bd] placeholder-white border border-[#2ce6bd] focus:outline-none text-2xl text-center"
                  maxLength="1"
                  onChange={() => handleInputFocus(otp3Ref.current, otp4Ref.current)}
                  ref={otp3Ref}
                />
                <input
                  type="text"
                  id="otp4"
                  className="w-12 h-12 py-2 px-4 rounded-full bg-gray-500 text-[#2ce6bd] placeholder-white border border-[#2ce6bd] focus:outline-none text-2xl text-center"
                  maxLength="1"
                  onChange={() => handleInputFocus(otp4Ref.current, otp5Ref.current)}
                  ref={otp4Ref}
                />
                <input
                  type="text"
                  id="otp5"
                  className="w-12 h-12 py-2 px-4 rounded-full bg-gray-500 text-[#2ce6bd] placeholder-white border border-[#2ce6bd] focus:outline-none text-2xl text-center"
                  maxLength="1"
                  onChange={() => handleInputFocus(otp5Ref.current, otp6Ref.current)}
                  ref={otp5Ref}
                />
                <input
                  type="text"
                  id="otp6"
                  className="w-12 h-12 py-2 px-4 rounded-full bg-gray-500 text-[#2ce6bd] placeholder-white border border-[#2ce6bd] focus:outline-none text-2xl text-center"
                  maxLength="1"
                  ref={otp6Ref}
                />
              </div>
            </div>
            <div className="flex justify-center items-center mt-5">
              <p className="text-gray-300 text-sm">
                Enter the 6-digit OTP you received in your mail. Not received?{" "}
                <label className="text-[#2ce6bd] hover:underline cursor-pointer">Resend!</label>
              </p>
            </div>

            <div className="flex justify-center mt-4">
              <button
                type="submit"
                className="w-28 h-10 mt-2 bg-transparent border-[#2ce6bd] text-[#2ce6bd] border rounded-full focus:outline-none"
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

export default OTP;