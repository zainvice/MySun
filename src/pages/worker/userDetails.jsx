import Layout from "../../layout";
import Heading from "../../common/heading";
import Container from "../../common/container";
import { useDimensions } from "../../hooks";
import { useParams } from "react-router";
import Spinner from "../../common/spinner";

import { useState, useEffect } from "react";
import { getWorkers } from "../../api";
import Button from "../../common/button";

const dateInputClasses = `!font-semibold !text-white !bg-[#2CDEB7] border-none focus-within:!outline-none white-placeholder h-10 !w-40`;

function UserDetail(user) {
  const dimension = useDimensions();
  const {email}= useParams()
  const [userData, setData]= useState()
  const [surveyData, setSurveys]= useState()
  const [isloading, setloading] = useState(true);
  useEffect(() => {
    if (email) {
      getWorkers()
        .then((data) => {
          const user = data.filter((user) => user.email === email);
          setData(user[0])
          setloading(false)
        })
    }
    
  }, [email]);
  
  const changePassword = (e) =>{

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

        <div className="grid md:grid-cols-3 lg:grid-cols-3 sm:gap-4 items-center">
        <div className="relative mt-10 flex flex-col" >
                <label className="text-gray-800 font-bold absolute top-0 -mt-6">
                  Change password
                </label>
                <input
                  type="password"
                  name="password"
                  defaultValue={""}
                  
                  placeholder={
                    "Enter new password"
                  }
                  className="rounded-full bg-gray-200 text-black px-4 h-12 w-full mb-3"
                 /*  onChange={onChange}
                  disabled={
                    (key === "phyiscal number" && tasktoDisplay?.taskData[key]!=='') ||
                    (key === "building number" && !!tasktoDisplay?.taskData[key])
                  } */
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
