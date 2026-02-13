"use server";

import { cookies } from "next/headers";

/**
 * Save JWT token securely
 */
export const setAuthToken = async (token: string) => {
  const cookieStore = cookies();

  (await cookieStore).set({
    name: "auth_token",
    value: token,
    httpOnly: true, // 🔒 VERY IMPORTANT
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
};

/**
 * Get JWT token (server-side only)
 */
export const getAuthToken = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    return token;
}

/**
 * Save user data (non-sensitive)
 */
export const setUserData = async (userData: any) => {
  const cookieStore = cookies();

  (await cookieStore).set({
    name: "user_data",
    value: encodeURIComponent(JSON.stringify(userData)),
    httpOnly: false, // frontend CAN read this
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
};

/**
 * Read user data safely
 */
export const getUserData = async () => {
  const cookieStore = cookies();
  const userDataStr = (await cookieStore).get("user_data")?.value;

  if (!userDataStr || userDataStr === "undefined") return null;

  try {
    return JSON.parse(decodeURIComponent(userDataStr));
  } catch (error) {
    console.error("❌ Cookie parse error:", error);
    return null;
  }
};

/**
 * Clear cookies on logout
 */
export const clearAuthCookies = async () => {
  const cookieStore = cookies();
  (await cookieStore).delete("auth_token");
  (await cookieStore).delete("user_data");
};
