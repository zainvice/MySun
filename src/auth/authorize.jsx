import React from "react";
import { Navigate } from "react-router-dom";

function Auth({ Component, isAdminPath = false }) {
  const isAuthenticated = sessionStorage.getItem("accessToken")?.length > 0;
  const isAdmin = sessionStorage.getItem('Role') === 'admin' 
  return (
    <>
      {isAuthenticated ? (
        isAdminPath ? (
          <AdminPath Component={Component} isAdmin={isAdmin && isAdminPath } />
        ) : (
          <WorkerPath Component={Component} isWorker={!isAdmin && !isAdminPath} />
        )
      ) : (
        <Navigate to={"/"} replace={true} />
      )}
    </>
  );
}

export default Auth;

const AdminPath = ({ Component, isAdmin }) => {
  return isAdmin ? (
    <Component />
  ) : (
    <Navigate to={"/assigned-tasks"} replace={true} />
  );
};

const WorkerPath = ({ Component, isWorker }) => {
    console.log(isWorker)
  return isWorker ? (
    <Component />
  ) : (
    <Navigate to={"/dashboard"} replace={true} />
  );
};
