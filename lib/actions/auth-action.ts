"use server";

import { register, login } from "@/lib/api/auth";
import { LoginData, RegisterData } from "@/app/(auth)/schema";
import { setAuthToken, setUserData, clearAuthCookies } from "@/lib/cookie";
import { redirect } from "next/navigation";

export const handleRegister = async (data: RegisterData) => {
  try {
    // Remove confirmPassword before sending to backend
    const { ...payload } = data;

    const result = await register(payload as RegisterData);

    // Your backend returns response.data
    const createdUser = result?.user || result?.data || null;

    if (createdUser) {
      return {
        success: true,
        message: result?.message || "Registration successful",
        data: createdUser,
      };
    }

    return {
      success: false,
      message: result?.message || "Registration failed",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Registration action failed",
    };
  }
};

export const handleLogin = async (data: LoginData) => {
  try {
    const result = await login(data);

    // Most MERN backends return: { token, user }
    if (result?.token) {
      await setAuthToken(result.token);
      await setUserData(result.user || result.data);

      return {
        success: true,
        message: "Login successful",
        data: result.user || result.data,
      };
    }

    return {
      success: false,
      message: result?.message || "Login failed",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Login action failed",
    };
  }
};

export const handleLogout = async () => {
  await clearAuthCookies();
  redirect("/login");
};
