"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

/**
 * Admin Users API Base
 * Uses BACKEND_URL to stay consistent across frontend
 */
const getAdminUsersApi = () => {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:5000";
  return `${base}/api/admin/users`;
};

/**
 * Fetch JWT from secure HTTP-only cookies
 */
async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value;
}

/**
 * CREATE USER
 * POST /api/admin/users
 * Supports Multer (FormData)
 */
export const handleCreateUser = async (rawFormData: FormData) => {
  const API_BASE = getAdminUsersApi();

  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    const cleanFormData = new FormData();

    // ✅ Ensure keys match backend DTO (remove Next.js prefixes)
    for (const [key, value] of rawFormData.entries()) {
      const cleanKey = key.replace(/^\d+_/, "");
      cleanFormData.append(cleanKey, value);
    }

    const response = await fetch(API_BASE, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // ⚠️ Do not set Content-Type manually for FormData
      },
      body: cleanFormData,
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "User creation failed",
      };
    }

    revalidatePath("/admin/users");

    return {
      success: true,
      message: "User created successfully",
      data: result.user,
    };
  } catch (error: any) {
    console.error("CREATE_USER_ERROR:", error);
    return {
      success: false,
      message: error.message || "Unexpected server error",
    };
  }
};

/**
 * UPDATE USER
 * PUT /api/admin/users/:id
 */
export const handleUpdateUser = async (id: string, formData: FormData) => {
  const API_BASE = getAdminUsersApi();

  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    const response = await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "User update failed",
      };
    }

    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${id}`);

    return {
      success: true,
      message: "User updated successfully",
      data: result.user,
    };
  } catch (error: any) {
    console.error("UPDATE_USER_ERROR:", error);
    return {
      success: false,
      message: error.message || "Unexpected error",
    };
  }
};

/**
 * DELETE USER
 * DELETE /api/admin/users/:id
 */
export const handleDeleteUser = async (id: string) => {
  const API_BASE = getAdminUsersApi();

  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    const response = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "User deletion failed",
      };
    }

    revalidatePath("/admin/users");

    return {
      success: true,
      message: "User deleted successfully",
    };
  } catch (error: any) {
    console.error("DELETE_USER_ERROR:", error);
    return {
      success: false,
      message: error.message || "Unexpected error",
    };
  }
};
