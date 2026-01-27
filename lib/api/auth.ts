import axios from "./axios";
import { API } from "./endpoints";

export const register = async (registerData: any) => {
  try {
    const response = await axios.post(
      API.AUTH.REGISTER, // path
      registerData // body data
    );
    return response.data; // what controller from backend sends
  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message ||
      err.message ||
      "Registration failed"
    );
  }
};

export const login = async (loginData: any) => {
  try {
    const response = await axios.post(
      API.AUTH.LOGIN, // path
      loginData // body data
    );
    return response.data; // what controller from backend sends
  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message ||
      err.message ||
      "Login failed"
    );
  }
};
