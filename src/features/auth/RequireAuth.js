import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
  const location = useLocation();
  const { role } = useAuth();
  let content;
  console.log(role, allowedRoles)
  
  if (allowedRoles.includes(role)) {
    content = <Outlet />;
    console.log('Good to go!')
  } else {
    content = (
      <Navigate to="/login" state={{ from: location }} replace />
    );
  }

  return content;
};

export default RequireAuth;
