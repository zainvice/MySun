import React from "react";
import { Navigate } from "react-router-dom";

function Authenticate({ Component }) {
  const isAuthenticated = localStorage.getItem("accessToken").length > 0;
  const isAdmin = localStorage.getItem("Role") === "admin";

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
