"use server";

import { register, login, whoAmi, updateProfile } from "../api/auth";
import { SignupData, LoginData } from "../../app/(auth)/schema";
import { setAuthToken, setUserData, clearAuthCookies } from "../cookie";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

/**
 * REGISTER
 */
export const handleRegister = async (data: SignupData) => {
  try {
    const result = await register(data);

    if (!result?.success) {
      return {
        success: false,
        message: result?.message ?? "Registration failed",
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error: any) {
    console.error("REGISTER_ACTION_ERROR:", error);
    return {
      success: false,
      message: error.message ?? "Unexpected server error",
    };
  }
};

/**
 * LOGIN
 */
export const handleLogin = async (data: LoginData) => {
  try {
    const result = await login(data);

    if (!result?.success || !result?.token) {
      return {
        success: false,
        message: result?.message ?? "Invalid credentials",
      };
    }

    // 🔒 Normalize user payload (IMPORTANT)
    const user = {
      id: result.user?.id ?? result.data?.id,
      email: result.user?.email ?? result.data?.email,
      role: result.user?.role ?? result.data?.role,
      ...result.user,
    };

    await setAuthToken(result.token);
    await setUserData(user);

    // Optional UI revalidation
    revalidatePath("/admin");
    revalidatePath("/user");

    return {
      success: true,
      data: user,
    };
  } catch (error: any) {
    console.error("LOGIN_ACTION_ERROR:", error);
    return {
      success: false,
      message: error.message ?? "Unexpected login error",
    };
  }
};

/**
 * LOGOUT
 */
export const handleLogout = async () => {
  try {
    await clearAuthCookies();

    // 🔥 Invalidate protected UI
    revalidatePath("/admin");
    revalidatePath("/user");
  } catch (error) {
    console.error("LOGOUT_ACTION_ERROR:", error);
  }

  redirect("/login");
};

/**
 * WHO AM I
 */
export const handleWhoAmI = async () => {
  try {
    const result = await whoAmi();

    if (!result?.success) {
      return {
        success: false,
        message: result?.message ?? "Not authenticated",
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error: any) {
    console.error("WHOAMI_ACTION_ERROR:", error);
    return {
      success: false,
      message: error.message ?? "Unexpected error",
    };
  }
};

/**
 * UPDATE PROFILE
 */
export const handleUpdateProfile = async (profileData: FormData) => {
  try {
    const result = await updateProfile(profileData);

    if (!result?.success) {
      return {
        success: false,
        message: result?.message ?? "Profile update failed",
      };
    }

    await setUserData(result.data);

    revalidatePath("/user/profile");
    revalidatePath("/admin/dashboard");

    return {
      success: true,
      data: result.data,
    };
  } catch (error: any) {
    console.error("UPDATE_PROFILE_ACTION_ERROR:", error);
    return {
      success: false,
      message: error.message ?? "Unexpected error",
    };
  }
};
