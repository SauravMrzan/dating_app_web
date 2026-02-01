"use server";

import { register, login, whoAmi, updateProfile } from "../api/auth";
import { SignupData, LoginData } from "../../app/(auth)/schema";
import { setAuthToken, setUserData, clearAuthCookies } from "../cookie";
import { redirect } from "next/navigation";
import { success } from "zod";
import { revalidatePath } from "next/dist/server/web/spec-extension/revalidate";

/**
 * Handles the Registration Logic
 */
export const handleRegister = async (data: SignupData) => {
  try {
    const result = await register(data);
    if (result.success) {
      return {
        success: true,
        message: "Registration successful",
        data: result.data,
      };
    }
    return {
      success: false,
      message: result.message || "Registration failed",
    };
  } catch (error: Error | any) {
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
export const handleLogin = async (data: LoginData) => {
  let isSuccessful = false;
  try {
    const result = await login(data);

    /**
     * Backend login returns:
     * { token, user }
     */
    if (result.success) {
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
  if (isSuccessful) {
    redirect("/dashboard"); // Or "/dashboard"
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

  return redirect("/login");
};

export async function handleWhoAmI() {
  try {
    const result = await whoAmi();
    if (result.success) {
      return {
        success: true,
        message: "User data fetch successfully",
        data: result.data,
      };
    }
    return {
      success: false,
      message: result.message || "Failed to fetch user data",
    };
  } catch (error: Error | any) {
    return { success: false, message: error.message };
  }
}

export async function handleUpdateProfile(profileData: FormData) {
  try {
    const result = await updateProfile(profileData);
    if (result.success) {
      await setUserData(result.data); // update cookie
      revalidatePath("/user/profile"); // revalidate profile page/ refresh new data
      return {
        success: true,
        message: "Profile updated successfully",
        data: result.data,
      };
    }
    return {
      success: false,
      message: result.message || "Failed to update profile",
    };
  } catch (error: Error | any) {
    return { success: false, message: error.message };
  }
}
