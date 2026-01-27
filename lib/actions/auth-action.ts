"use server";

import { register, login } from "../api/auth";
import { SignupData } from "../../app/(auth)/schema";
import { setAuthToken, setUserData, clearAuthCookies } from "../cookie";
import { redirect } from "next/navigation";

/**
 * Handles the Registration Logic
 */
export const handleRegister = async (data: SignupData) => {
  try {
    const result = await register(data);

    /**
     * Backend signup returns:
     * { message: string, user?: object }
     * Normalize response for UI
     */
    const createdUser = result?.user ?? result?.data ?? null;
    const isCreated = Boolean(createdUser) || Boolean(result?.id);

    if (isCreated) {
      return {
        success: true,
        message: result?.message || "Registration successful",
        data: createdUser ?? result,
      };
    }

    return {
      success: false,
      message: result?.message || "Registration failed",
    };
  } catch (error: any) {
    console.error("Registration Server Error:", error);
    return {
      success: false,
      message: error.message || "An unexpected error occurred",
    };
  }
};

/**
 * Handles the Login Logic
 */
export const handleLogin = async (data: {
  email: string;
  password: string;
}) => {
  try {
    const result = await login(data);

    /**
     * Backend login returns:
     * { token, user }
     */
    if (result && result.token) {
      // Save JWT token
      await setAuthToken(result.token);

      // Save user data
      await setUserData(result.data);

      return {
        success: true,
        message: "Login successful",
        data: result.user,
      };
    }

    return {
      success: false,
      message: result?.message || "Invalid email or password",
    };
  } catch (error: any) {
    console.error("Login Server Error:", error);
    return {
      success: false,
      message: error.message || "An unexpected error occurred",
    };
  }
};

/**
 * Handles Logout Logic
 */
export const handleLogout = async () => {
  try {
    await clearAuthCookies();
  } catch (error) {
    console.error("Logout Error:", error);
  }

  redirect("/login");
};
