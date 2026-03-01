import { SignupData, LoginData } from "../../app/(auth)/schema";
import axios from "./axios";
import { API } from "./endpoints";

/**
 * REGISTER USER
 * POST /api/auth/register
 */
export const register = async (registerData: SignupData) => {
  try {
    const response = await axios.post(API.AUTH.REGISTER, registerData);
    return response.data;
  } catch (error: any) {
    console.error("REGISTER_API_ERROR:", error);
    throw new Error(error?.response?.data?.message || "Registration failed");
  }
};

/**
 * LOGIN USER
 * POST /api/auth/login
 */
export const login = async (loginData: LoginData) => {
  try {
    const response = await axios.post(API.AUTH.LOGIN, loginData);
    return response.data;
  } catch (error: any) {
    console.error("LOGIN_API_ERROR:", error);
    throw new Error(error?.response?.data?.message || "Login failed");
  }
};

/**
 * WHO AM I
 * GET /api/auth/whoami
 */
export const whoAmi = async () => {
  try {
    const response = await axios.get(API.AUTH.WHOAMI);
    return response.data;
  } catch (error: any) {
    console.error("WHOAMI_API_ERROR:", error);
    throw new Error(error?.response?.data?.message || "WhoAmI failed");
  }
};

/**
 * AUTH OPTIONS
 * GET /api/auth/options
 */
export const getAuthOptions = async () => {
  try {
    const response = await axios.get(API.AUTH.OPTIONS);
    return response.data;
  } catch (error: any) {
    console.error("AUTH_OPTIONS_API_ERROR:", error);
    throw new Error(error?.response?.data?.message || "Failed to fetch auth options");
  }
};

/**
 * UPDATE PROFILE
 * PUT /api/auth/update-profile
 * Supports Multer (profile picture upload)
 */
export const updateProfile = async (formData: FormData) => {
  try {
    const response = await axios.put(
      API.AUTH.UPDATEPROFILE,
      formData,
      // ❌ DO NOT set Content-Type
    );
    return response.data;
  } catch (error: any) {
    console.error("UPDATE_PROFILE_API_ERROR:", error);
    throw new Error(error?.response?.data?.message || "Update profile failed");
  }
};
