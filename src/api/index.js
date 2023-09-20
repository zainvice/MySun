import axios from "axios";

const BASE_URL = "http://localhost:3500/api/v1/";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

const loginUser = () => {};

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
    return error.response?.data;
  }
};

export const getWorkers = async () => {
  try {
    const response = await api.get("/users");
    return response.data;
  } catch (error) {
    return error.response?.data;
  }
};
