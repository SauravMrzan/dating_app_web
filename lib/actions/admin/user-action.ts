"use server";

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

/**
 * We derive the URL inside the functions or use a fallback to prevent 
 * "undefined/api/..." errors if the env variable isn't loaded correctly.
 */
const getApiBase = () => {
    const base = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";
    return `${base}/api/admin/users`;
};

/**
 * Helper to fetch token from secure cookies
 */
async function getAuthToken() {
    const cookieStore = await cookies();
    return cookieStore.get('auth_token')?.value;
}

/**
 * CREATE USER (POST /api/admin/users)
 * Supports Multer via FormData
 */
export const handleCreateUser = async (rawFormData: FormData) => {
    const API_BASE = getApiBase();
    try {
        const token = await getAuthToken();
        const cleanFormData = new FormData();

        // Iterate through the mangled FormData and extract clean keys
        for (const [key, value] of rawFormData.entries()) {
            // This regex removes the Next.js action prefix (like "1_")
            const cleanKey = key.replace(/^\d+_/, ""); 
            cleanFormData.append(cleanKey, value);
        }

        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}` 
                // DO NOT set Content-Type here
            },
            body: cleanFormData,
        });

        // Robust check: If server returns 404 or 500 HTML instead of JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const errorText = await response.text();
            console.error("Non-JSON Response received:", errorText);
            return { 
                success: false, 
                message: `Server Error (${response.status}): Ensure backend route exists.` 
            };
        }

        const result = await response.json();

        if (result.success) {
            revalidatePath('/admin/users');
            return { 
                success: true, 
                message: 'User created successfully', 
                data: result.user 
            };
        }

        return { success: false, message: result.message || 'Failed to create user' };

    } catch (error: any) {
        console.error("CREATE_USER_ERROR:", error);
        return { 
            success: false, 
            message: error.message || 'An unexpected network error occurred' 
        };
    }
};

/**
 * UPDATE USER (PUT /api/admin/users/:id)
 */
export const handleUpdateUser = async (id: string, formData: FormData) => {
    const API_BASE = getApiBase();
    try {
        const token = await getAuthToken();
        const response = await fetch(`${API_BASE}/${id}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData,
        });

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            return { success: false, message: "Update failed: Server did not return JSON." };
        }

        const result = await response.json();
        if (result.success) {
            revalidatePath('/admin/users');
            revalidatePath(`/admin/users/${id}`);
            return { success: true, message: 'User updated successfully' };
        }
        return { success: false, message: result.message || 'Update failed' };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
};

/**
 * DELETE USER (DELETE /api/admin/users/:id)
 */
export const handleDeleteUser = async (id: string) => {
    const API_BASE = getApiBase();
    try {
        const token = await getAuthToken();
        const response = await fetch(`${API_BASE}/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });

        const result = await response.json();
        if (result.success) {
            revalidatePath('/admin/users');
            return { success: true, message: 'User deleted successfully' };
        }
        return { success: false, message: result.message || 'Deletion failed' };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
};