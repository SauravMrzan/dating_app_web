"use server";
import { cookies } from "next/headers";

export const setAuthToken = async (token: string) => {
  const cookieStore = await cookies();
  cookieStore.set({ name: "auth_token", value: token });
};

export const getAuthToken = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  return token;
};

export const setUserData = async (userData: any) => {
  const cookieStore = await cookies();
  // Ensure we are saving a clean, encoded string
  const dataString = JSON.stringify(userData);
  cookieStore.set({
    name: "user_data",
    value: encodeURIComponent(dataString),
    path: "/", // Ensure it's available across the whole site
  });
};

export const getUserData = async () => {
  const cookieStore = await cookies();
  const userDataStr = cookieStore.get("user_data")?.value;

  // Check if it exists AND isn't literally the string "undefined"
  if (userDataStr && userDataStr !== "undefined") {
    try {
      const decodedData = decodeURIComponent(userDataStr);
      return JSON.parse(decodedData);
    } catch (error) {
      console.error("❌ Cookie Parse Error:", error);
      return null;
    }
  }
  return null;
};

export const clearAuthCookies = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  cookieStore.delete("user_data");
};
