"use server";

import { cookies } from "next/headers";

export interface MannMilapUser {
  _id: string;
  fullName: string;
  username: string;
  email: string;
  gender?: string;
  dateOfBirth?: string;
  age?: number;
  profileImage?: string;
  role?: string;
  [key: string]: any;
}

export const setAuthToken = async (token: string) => {
  const cookieStore = await cookies();
  cookieStore.set({
    name: "auth_token",
    value: token,
    httpOnly: true,
    path: "/",
  });
};

export const getAuthToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value || null;
};

export const setUserData = async (user: MannMilapUser) => {
  const cookieStore = await cookies();
  cookieStore.set({
    name: "user_data",
    value: JSON.stringify(user),
    path: "/",
  });
};

export const getUserData = async (): Promise<MannMilapUser | null> => {
  const cookieStore = await cookies();
  const raw = cookieStore.get("user_data")?.value || null;
  return raw ? JSON.parse(raw) : null;
};

export const clearAuthCookies = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  cookieStore.delete("user_data");
};
