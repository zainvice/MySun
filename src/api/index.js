import jwtDecode from 'jwt-decode';
import axios from "axios";
import { async } from "q";


const BASE_URL = 'https://mysunapi.onrender.com/api/v1/';

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
export const firstResetPassword = async ({ email, password }) => {
  return await api.patch("/users", {
    email,
    password,
  });
};

export const createWorker = async ({
  email,
  fullName,
  username,
  phone,
  password,
  role,
}) => {
  try {
    const response = await api.post("/users", {
      email,
      fullName,
      username,
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
export const editTasks = async ({task, manual}) => {
  try {
  console.log("I GOT THIS DATA", task)
  const{_id, taskData, status, classification, propertyType, stats, floor,  timeTaken}= task
  console.log("Sending", _id, taskData, status,classification, propertyType, stats, timeTaken, floor, manual)
  return await api.patch("/tasks", {
    taskData, status, timeTaken, _id, manual,classification, propertyType, stats, floor}
  );}catch(error){
    if (error?.status === 500) return error.message;
    return error?.response?.data;
  }
};
export const createTask = async ({task}) => {
  try {
  console.log("I GOT THIS DATA", task)
  const{projectId, taskData, supervisor}= task
  console.log("Sending", taskData, projectId, supervisor)
  return await api.post("/tasks", {
    taskData, projectId, supervisor}
  );}catch(error){
    if (error?.status === 500) return error.message;
    return error?.response?.data;
  }
};


export const createProject = async ({
  projectName,
  projectData,
  buildingData,
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
    buildingData,
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
export const editProject = async ({
  projectId,
  task,
  workers,
  manual
}) => {
  console.log("I GOT THIS DATA", task)
  const{_id, taskData, status, timeTaken, buildingData}= task
  console.log("Sending", _id, taskData, status, timeTaken, buildingData, projectId, manual)

  return await api.patch("/projects", {
    projectId, 
    workers,
    buildingData,
    taskData,
    timeTaken,
    manual
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

export const getTaskById = async (_id) => {
  try {
    console.log("SENDING POST TO GET TASK", _id)
    const response = await api.post(`/tasks/byId`,{
      _id
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

