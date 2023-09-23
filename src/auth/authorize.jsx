import React from "react";
import { Navigate } from "react-router-dom";

function Auth({ Component, isAdminPath = false, isSupervisorPath = false }) {
  const isAuthenticated = sessionStorage.getItem("accessToken")?.length > 0;
  const isAdmin = sessionStorage.getItem("Role") === "admin";
  const isSupervisor = sessionStorage.getItem("Role") === "supervisor";
  return (
    <>
      {isAuthenticated ? (
        isAdmin ? (
          <AdminPath Component={Component} isAdmin={isAdmin && isAdminPath} />
        ) : isSupervisor ? (
          <SupervisorPath
            Component={Component}
            isSupervisor={isSupervisor && isSupervisorPath}
          />
        ) : (
          <WorkerPath
            Component={Component}
            isWorker={!isAdmin && !isAdminPath}
          />
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

const SupervisorPath = ({ Component, isSupervisor }) => {
  return isSupervisor ? <Component /> : <Navigate to={"/dashboard"} />;
};

const WorkerPath = ({ Component, isWorker }) => {
  return isWorker ? (
    <Component />
  ) : (
    <Navigate to={"/dashboard"} replace={true} />
  );
};
