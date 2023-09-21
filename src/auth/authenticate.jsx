import React from "react";
import { Navigate } from "react-router-dom";

function Authenticate({ Component }) {
  const isAuthenticated = sessionStorage.getItem("accessToken")?.length > 0;
  const isAdmin = sessionStorage.getItem("Role") === "admin";

  return isAuthenticated ? (
    isAdmin ? (
      <Navigate to={"/dashboard"} />
    ) : (
      <Navigate to={"/assigned-tasks"} />
    )
  ) : (
    <Component />
  );
}

export default Authenticate;
