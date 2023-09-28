import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api";
import { useTranslation } from "react-i18next";
import { useModal } from "../hooks";
import LanguageSwitcher from "../context/LanguageSwitcher";
import Modal from "../common/modal";
import Spinner from "../common/spinner";
import { useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../features/auth/authApiSlice';
import { setCredentials } from '../features/auth/authSlice';

const LoginPage = () => {
  const navigate = useNavigate();
  const [inputValues, setInputValues] = useState({});
  const [login]= useLoginMutation()
  const {isOpen, onOpen, onClose, } = useModal()
  const [error, setError] = useState("");
  const { t } = useTranslation();
  const [errMsg, setErrMsg] = useState('')
  const dispatch = useDispatch()
  const errRef = useRef()
  const onChange = (event) => {
    const target = event.target ?? {};
    setInputValues((prev) => ({ ...prev, [target.name]: target.value }));
  };
  const handleSubmit = async (e)=>{
    e.preventDefault()
    onOpen()
    try{
       const {email, password} = inputValues
       const response = await login({ email, password}).unwrap()
       console.log(response)
       const {accessToken, Role, lastLogin} = response
      
       dispatch(setCredentials({ accessToken }))
       const data = response;
       console.log('DATA', data)
       for (const key in data) {
          sessionStorage.setItem(key, data[key]);
       }
       onClose()
       if(Role==='admin')
         navigate('/dashboard')
       if(Role==='supervisor')
         navigate('/dashboard')
       if(Role==='worker'){
          if(!lastLogin){
            navigate('/resetPassword/'+email)
          }else{
            navigate('/assigned-tasks')
          }
        }

    }catch(error) {
      console.log("error", error)
      if (error?.response) setError(error?.data.message);
      else setError(error?.data.message);
      onClose()
    }
  }
  const onSubmit = async (event) => {
    event.preventDefault();
    onOpen()
    try {
      const response = await loginUser(inputValues);
      const data = response.data;
      for (const key in data) {
        sessionStorage.setItem(key, data[key]);
      }

      const role = data.Role.toLowerCase();

      if (role === "admin" || role === "supervisor")
        return navigate("/dashboard", { replace: true });
      navigate("/assigned-tasks", { replace: true });
    } catch (error) {
      if (error?.response) setError(error?.response.data.message);
      else setError(error?.message);
    } finally {
      onClose()
    }
  };

  return (
    <>
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
        style={{ backgroundImage: `url("./images/LoginImg.jpg")` }}
      >
        <LanguageSwitcher />
        <div className="absolute bg-gray-900 bg-opacity-80 p-4 rounded-lg shadow-lg h-[90%] w-[90%] sm:w-[70%]">
          <div className="flex justify-center items-center mb-2 mt-9">
            <img
              src={"./images/logo.png"}
              alt="Logo"
              className="w-[100px] h-[100px]"
            />
          </div>
          <form className="w-full mt-20" onSubmit={handleSubmit}>
            <div className="md:max-w-sm mx-auto">
              {error && (
                <div>
                  <p className="italic font-medium text-[#2ce6bd] ">{error}</p>
                </div>
              )}
              <label htmlFor="email" className="block text-gray-300">
                {t("emailLabel")}
              </label>
              <input
                type="text"
                id="email"
                name="email"
                onChange={onChange}
                className="w-full inline-block mx-auto  h-10 py-2 px-4 rounded-full bg-gray-500 text-gray-100 placeholder-white border border-[#2ce6bd] focus:outline-none text-base"
                placeholder={t("emailPlaceholder")}
              />
            </div>
            <div className="md:max-w-sm mx-auto mt-4">
              <label htmlFor="password" className="block text-gray-300">
                {t("passwordLabel")}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                onChange={onChange}
                className="w-full inline-block mx-auto  h-10 py-2 px-4 rounded-full bg-gray-500 text-gray-100 placeholder-white border border-[#2ce6bd] focus:outline-none text-base"
                placeholder={t("passwordPlaceholder")}
              />
              <Link
                to="/ForgotPassword"
                className="text-[#2ce6bd] inline-block mt-2"
              >
                {t("forgotPasswordLink")}
              </Link>
            </div>
            <div className="flex justify-center mt-2">
              <button
                type="submit"
                className="w-28 h-8 mt-2 bg-transparent border-[#2ce6bd] text-[#2ce6bd] border hover:text-white rounded-full focus:outline-none transform transition-300 hover:font-bold hover:bg-[#2ce6bd]"
              >
                {t("loginButton")}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Modal isOpen={isOpen}>
        <Spinner />
      </Modal>
    </>
  );
};

export default LoginPage;
