import { useState } from "react";
import { resetPassword } from "../api";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { useModal } from "../hooks";
import Modal from "../common/modal";
import Message from "../common/message";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../context/LanguageSwitcher";

const Password = () => {
  const {t} = useTranslation()
  const { isOpen, onOpen, onClose } = useModal();
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('')
  const { resetToken, userId } = useParams();
  const [inputValues, setInputValues] = useState();
  const onResetPassword = (event) => {
    event.preventDefault();
    resetPassword({
      password: inputValues?.password,
      token: resetToken,
      userId,
    })
      .then(() => setSuccess(true))
      .catch((error) => {
        setMessage(error.response?.data?.message ?? error.message)
        onOpen()
      });
  };
  
  return (
    <>
     <LanguageSwitcher />
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
        style={{ backgroundImage: `url("/images/ForgotPasswordImg.jpg")` }}
      >
        <div className="absolute bg-gray-900 bg-opacity-80 p-4 rounded-lg shadow-lg h-[90%] w-[90%] sm:w-[70%]">
          <div className="w-full">
            {/* Added the logo image and Login heading */}
            <div className="flex justify-center items-center mb-2 mt-9">
              <img
                src={"/images/logo.png"} 
                alt="Logo"
                className="w-[100px] h-[100px]" 
              />
            </div>
            <form className="w-full mt-20" onSubmit={onResetPassword}>
              <div className="md:max-w-sm mx-auto">
                <label htmlFor="password" className="block text-gray-300 ">
                  {t('passwordPlaceholder')}
                </label>
                <input
                  type="text"
                  id="password"
                  name="password"
                  required
                  onChange={(e) =>
                    setInputValues((prev) => ({
                      ...prev,
                      [e?.target?.name]: e?.target?.value,
                    }))
                  }
                  className="w-full inline-block mx-auto  h-10 py-2 px-4 rounded-full bg-gray-500 text-gray-100 placeholder-white border border-[#2ce6bd] focus:outline-none text-base"
                  placeholder= {t('npassword')}
                />
              </div>

              <div className="flex justify-center mt-4">
                <button
                  type="submit"
                  className="w-28 h-8 mt-2 bg-transparent border-[#2ce6bd] text-[#2ce6bd] hover:scale-120 hover:bg-white border rounded-full focus:outline-none"
                >
                  {t("freset")}
                </button>
              </div>

              {success && (
                <p className="text-center text-gray-300">
                  Password Reset Successfully!{" "}
                  <Link
                    to={"/"}
                    className="text-green-500 underline italic font-semibold hover:text-white"
                    replace={true}
                  >
                    Go to Login
                  </Link>
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={onClose}>
        <Message
          heading={"Alert!"}
          message={message}
          onClose={onClose}
        />
      </Modal>
    </>
  );
};

export default Password;
