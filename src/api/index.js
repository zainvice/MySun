import jwtDecode from 'jwt-decode';
import axios from "axios";
import { async } from "q";


const BASE_URL = "http://localhost:3500/api/v1/";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const loginUser = async ({ email, password }) => {
  return await api.post("/auth", {
    email,
    password,
  });
};

export const logoutUser = async () => {
  return await api.post("/auth/logout");
};

export const resquestReset = async (email) => {
  return await api.post("/resetPassword/auth/requestResetPassword", { email });
};

export const resetPassword = async ({ userId, token, password }) => {
  return await api.post("/resetPassword/auth/resetPassword", {
    userId,
    token,
    password,
  });
};

export const createWorker = async ({
  email,
  fullName,
  phone,
  password,
  role,
}) => {
  try {
    const response = await api.post("/users", {
      email,
      fullName,
      phone,
      password,
      role,
    });

    return response?.data;
  } catch (error) {
    if (error?.status === 500) return error.message;
    return error?.response?.data;
  }
};

export const getWorkers = async () => {
  try {
    const response = await api.get("/users");
    return response.data;
  } catch (error) {
    if (error?.status === 500) return error.message;
    return error?.response?.data;
  }
};
export const removeWorkers = async ( values ) => {
  try {
    const {_id, active}= values
    console.log(values)
    console.log(_id, "ID")
    const response = await api.delete("/users",  { data: { _id ,active } });
    return response.data;
  } catch (error) {
    if (error?.status === 500) return error.message;
    return error?.response?.data;
  }
};
export const editTasks = async ({task}) => {
  try {
  console.log("I GOT THIS DATA", task)
  const{_id, taskData, status, timeTaken}= task
  console.log("Sending", _id, taskData, status, timeTaken)
  return await api.patch("/tasks", {
   _id, taskData, status, timeTaken}
  );}catch(error){
    if (error?.status === 500) return error.message;
    return error?.response?.data;
  }
};


export const createProject = async ({
  projectName,
  projectData,
  projectDescription,
  projectFile,
  startDate,
  endDate,
  admin,
  workers,
  status,
}) => {
  return await api.post("/projects", {
    projectName,
    projectData,
    projectDescription,
    projectFile,
    startDate,
    endDate,
    admin,
    workers,
    status,
  });
};
export const editNotes = async ({
  email, 
  notes
}) => {
  
  return await api.patch("/users", {
    email, 
    notes
  });
};

export const getProjects = async () => {
  try {
    const response = await api.get("/projects");
    return response?.data;
  } catch (error) {
    throw error?.response?.data;
  }
};

export const getTasks = async () => {
  try {
    const response = await api.get("/tasks");
    return response?.data;
  } catch (error) {
    throw error;
  }
};

