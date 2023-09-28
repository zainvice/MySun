import { useSelector } from 'react-redux';
import { selectCurrentToken } from "../features/auth/authSlice";
import jwtDecode from 'jwt-decode';


const useAuth = () => {
  const token = useSelector(selectCurrentToken);
  let isAdmin = false;
  let isSupervisor = false;
  let status = "admin";

  if (token) {
    const decoded = jwtDecode(token);
    const { fullName, role } = decoded.UserInfo;
   
    if (role==="admin") {
      isAdmin = true;
    } else if (role==="supervisor") {
      isSupervisor = true;
    }

    if (isAdmin) status = "admin";
    if (isSupervisor) status = "supervisor";

    

    return { fullName, role, status, isAdmin, isSupervisor };
  }

  return { fullName: '', role: [], isAdmin, isSupervisor, status };
};

export default useAuth;
