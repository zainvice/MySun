import { useState } from "react";
import { resquestReset } from "../api";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from "../context/LanguageSwitcher";

const ForgotPassword = () => {
  const {t}= useTranslation()
  let email=""
  const [response, setResponse] = useState()
  const [isSent, setSent]= useState(false)
  const [inputValues, setInputValues] = useState();
  const onSent = (emails) => {
    setSent(true)
    email= emails
  }
  const onRequestReset = (event) => {
    event.preventDefault();
    resquestReset(inputValues?.email)
    .then(() => {
      onSent(inputValues.email)
      setInputValues(null);
    })
    .catch((error) => {
      setResponse(error.data)
      console.error("An error occurred:", error);
    });
  };
  return (
    <>
    <LanguageSwitcher/>
    {!isSent ? (
      <>

       <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
        style={{ backgroundImage: `url("./images/ForgotPasswordImg.jpg")` }}
      >
        {response && (
              <div>
                <p className="italic font-medium text-[#2ce6bd] ">{response}</p>
              </div>
        )}
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
            <form className="w-full mt-20 text-white text-center" onSubmit={onRequestReset}>
              <div className="md:max-w-sm mx-auto">
                <label htmlFor="email" className="text-left block text-gray-300 ">
                  {t("femail")}
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
                  placeholder= {t("feplaceholder")}
                />
              </div>

              <div className="flex justify-center mt-4">
                <button
                  type="submit"
                  className="w-28 h-8 mt-2 bg-transparent border-green-500 text-green-500 border hover:text-white rounded-full focus:outline-none transform transition-300 hover:font-bold hover:bg-[#2ce6bd]"
                >
                   {t("freset")}
                </button>
                
              </div>
              <br/>
              {t("fOr")}
                <br/>
                <Link
  to="/"
  className="text-green-500 inline-block mt-2 transition-colors hover:text-[#2ce6bd] hover:scale-100"
>
{t("loginButton")}?
</Link>
            </form>
          </div>
        </div>
      </div>
      </>
    ): (
      <>
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
        style={{ backgroundImage: `url("./images/ForgotPasswordImg.jpg")` }}
      >
        <div className="absolute bg-gray-900 bg-opacity-80 p-4 rounded-lg shadow-lg h-[90%] w-[90%] sm:w-[70%] ">
          <div className="w-full content-center items-center">
            {/* Added the logo image and Login heading */}
            <div className="flex justify-center items-center mb-2 mt-9">
              <img
                src={"./images/logo.png"} // Used the imported logo image source
                alt="Logo"
                className="w-[100px] h-[100px]" // Adjusted width and height as needed
              />
            </div>
            <form className="w-full mt-20 text-center items-center justify-center text-white text-lg"  onSubmit={onRequestReset}>
            
            <p>We've sent a link to your email {email}, click the link to reset</p>
              <br/>
              <p>your password.</p>
              <br/>
              {t("fOr")}
                <br/>
                <Link
  to="/"
  className="text-green-500 inline-block mt-2 transition-colors hover:text-[#2ce6bd] hover:scale-100"
>
{t("loginButton")}?
</Link>
              
            </form>
          </div>
        </div>
      </div>
      </>
    )}
     
    </>
  );
};

export default ForgotPassword;
