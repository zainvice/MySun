import { useState } from "react";
import { resquestReset } from "../api";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../context/LanguageSwitcher";

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [emailAddress, setEmailAddress] = useState("");
  const [message, setMessage] = useState("");
  const [isSent, setSent] = useState(false);
  const [inputValues, setInputValues] = useState();

  const onRequestReset = (event) => {
    event.preventDefault();
    resquestReset(inputValues?.email)
      .then(() => {
        setSent(true);
        setInputValues(null);
        setEmailAddress(inputValues.email);
      })
      .catch((error) => {
        setMessage(error?.response?.data?.message);
        console.error("An error occurred:", error);
      });
    debugger;
  };
  return (
    <>
      <LanguageSwitcher />

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

            {isSent ? (
              <p className="mt-20 sm:max-w-[50%] mx-auto text-lg text-center text-white">
                {t('frqdone')} {emailAddress}, {t('frqdone1')} 
              </p>
            ) : (
              <form
                className="w-full mt-20 text-white text-center"
                onSubmit={onRequestReset}
              >
                {message && (
                  <p className="italic font-medium text-[#2ce6bd]">{message}</p>
                )}
                <div className="md:max-w-sm mx-auto">
                  <label
                    htmlFor="email"
                    className="text-left block text-gray-300 "
                  >
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
                    className="w-full inline-block mx-auto  h-10 py-2 px-4 rounded-full bg-gray-500 text-gray-100 placeholder-white border border-[#2ce6bd] focus:outline-none text-base"
                    placeholder={t("feplaceholder")}
                  />
                </div>

                <div className="flex justify-center mt-4">
                  <button
                    type="submit"
                    className="w-28 h-8 mt-2 bg-transparent border-[#2ce6bd] text-[#2ce6bd] border hover:text-white rounded-full focus:outline-none transform transition-300 hover:font-bold hover:bg-[#2ce6bd]"
                  >
                    {t("freset")}
                  </button>
                </div>
              </form>
            )}

            <p className="text-center flex flex-col mt-6">
              <span className="text-white">{t("fOr")}</span>
              <Link
                to="/"
                className="text-[#2ce6bd] mt-2 transition-colors hover:text-[#2ce6bd] hover:scale-100"
              >
                {t("loginButton")}?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
