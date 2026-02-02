"use server";

import { register, login, whoAmi, updateProfile } from "../api/auth";
import { SignupData, LoginData } from "../../app/(auth)/schema";
import { setAuthToken, setUserData, clearAuthCookies } from "../cookie";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

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
export const handleLogin = async (data: LoginData) => {
  try {
    const result = await login(data);

    if (result.success) {
      // Extract the user object. Your backend returns it in 'user' or 'data'.
      // We prioritize 'result.user' then 'result.data'.
      const userObject = result.user || result.data || result;

      // Ensure the role exists before saving to cookie
      if (!userObject.role) {
        console.warn(
          "⚠️ Warning: Role missing in backend response",
          userObject,
        );
      }

      await setAuthToken(result.token);

      // Save the user object to the 'user_data' cookie for the proxy/middleware
      await setUserData({ ...userObject });

      return {
        success: true,
        data: userObject,
      };
    }
    return { success: false, message: result.message || "Login failed" };
  } catch (error: any) {
    console.error("Login Action Error:", error);
    return { success: false, message: error.message };
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

/**
 * Fetch current user data from backend
 */
export async function handleWhoAmI() {
  try {
    const result = await whoAmi();
    if (result.success) {
      return {
        success: true,
        message: "User data fetched successfully",
        data: result.data,
      };
    }
    return {
      success: false,
      message: result.message || "Failed to fetch user data",
    };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

/**
 * Updates user profile including profile picture (FormData)
 */
export async function handleUpdateProfile(profileData: FormData) {
  try {
    const result = await updateProfile(profileData);
    if (result.success) {
      // Re-save the updated user object (including new role or profile pic) to cookies
      await setUserData(result.data);

      // Revalidate to show new data on the UI
      revalidatePath("/user/profile");
      revalidatePath("/admin/dashboard");

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
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
