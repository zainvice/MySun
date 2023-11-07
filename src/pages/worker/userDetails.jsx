import Layout from "../../layout";
import Heading from "../../common/heading";
import Container from "../../common/container";
import { useDimensions } from "../../hooks";
import { useParams } from "react-router";
import Spinner from "../../common/spinner";
import { editNotes } from "../../api";
import { useState, useEffect } from "react";
import { getWorkers } from "../../api";
import { useWorkers } from "../../context/workersContext";
import Button from "../../common/button";

const dateInputClasses = `!font-semibold !text-white !bg-[#2CDEB7] border-none focus-within:!outline-none white-placeholder h-10 !w-40`;

function UserDetail(user) {
  const dimension = useDimensions();
  const {email}= useParams()
  const {workers}= useWorkers()
  const [userData, setData]= useState()
  const [surveyData, setSurveys]= useState()
  const [isloading, setloading] = useState(true);
  const [password, setPassword] = useState("")
  useEffect(() => {
    if (email) {
      if(workers){
          const user = workers.filter((user) => user.email === email);
          setData(user[0])
          setloading(false)
       }
    }
    
  }, [email, workers]);
  const [saved, isSaved] = useState(false)
  const [message, setMessage] = useState("")
  const changePassword = async() =>{
    if(password){
      try{
        const email= userData?.email
        const response = await editNotes( {email, password})
        console.log(response)
        setMessage("Password Changed successfully!")
        isSaved(true)
      }catch(error){
        console.log(error)
      }
    }else{
      setMessage("No password entered or detected!")
      isSaved(true)
    }
  }
  return (
    <Layout activePageName={userData?.fullName+"'s Details"}>
      <Container>
        {isloading? (
          <Spinner/>
        ): (
          <>
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 justify-center">
          <div className="lg:w-1/3 flex justify-between">
            <Heading title={"User Details"} />
          </div>
          <div className="flex-1 w-full flex justify-between">
            
          </div>
        </div>

        <div className="py-4">
          <div className="w-full grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
            <p className="">
              <span className="font-bold mr-3">Name: </span>
              <span className="text-[#2CDEB7]">{userData?.fullName}</span>
            </p>
            <p className="">
              <span className="font-bold mr-3">Email: </span>
              <span className="text-[#2CDEB7]">{userData?.email}</span>
            </p>

            <p className="">
              <span className="font-bold mr-3">Start Date: </span>
              <span className="text-[#2CDEB7]">{new Date(userData?.createdAt).toLocaleString()}</span>
            </p>

            <p className="">
              <span className="font-bold mr-3">Last Login: </span>
              <span className="text-[#2CDEB7]">{new Date(userData?.lastLogin).toLocaleString()}</span>
            </p>

            {/* <p className="">
              <span className="font-bold mr-3">Total Projects: </span>
              <span className="text-[#2CDEB7]">{userData?.projects.length}</span>
            </p> */}

            <p className="">
              <span className="font-bold mr-3">Role: </span>
              <span className="text-[#2CDEB7]">{userData?.role.toUpperCase()}</span>
            </p>
            
          </div>
        </div>
        {saved?(
          <p className="">
          <span className="font-bold mr-3">Status: </span>
          <span className="text-[#2CDEB7]">{message}</span>
          </p>
        ):(
          <></>
        )}
        <div className="grid md:grid-cols-3 lg:grid-cols-3 sm:gap-4 items-center">
        <div className="relative mt-10 flex flex-col" >
                <label className="text-gray-800 font-bold absolute top-0 -mt-6">
                  Change password
                </label>
                <input
                  type="password"
                  name="password"
                  defaultValue={""}
                  onClick={() => { isSaved(false); }}
                  placeholder={
                    "Enter new password"
                  }
                  className="rounded-full bg-gray-200 text-black px-4 h-12 w-full mb-3"
                  onChange={e=>setPassword(e.target.value)}
                  required
                />
                 <Button title={"Change Password"} onClick={() => { changePassword(); }} />
              </div>
             
        </div>
          </>
        )}
      </Container>
    </Layout>
  );
}
export default UserDetail;
