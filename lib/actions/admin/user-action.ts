"use server";

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

// Ensure this matches your Express app.use('/api/admin', ...)
const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`;

async function getAuthToken() {
    const cookieStore = await cookies();
    return cookieStore.get('auth_token')?.value;
}

export const handleCreateUser = async (formData: FormData) => {
    try {
        const token = await getAuthToken();
        
        // Debugging: Log the URL being hit to your console
        console.log("Hitting URL:", API_BASE);

        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}` 
                // Do NOT set Content-Type; fetch sets it for FormData automatically
            },
            body: formData,
        });

        // If the server returns 404, .json() might fail if it returns HTML
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            return { success: false, message: `Server Error: Received ${response.status} ${response.statusText}` };
        }

        const result = await response.json();

        if (result.success) {
            revalidatePath('/admin/users');
            return { success: true, message: 'User created successfully', data: result.user };
        }

        return { success: false, message: result.message || 'Failed to create user' };

    } catch (error: any) {
        console.error("CREATE_USER_ERROR:", error);
        return { success: false, message: error.message || 'An unexpected error occurred' };
    }
};
/**
 * UPDATE USER (PUT /api/admin/users/:id)
 */
export const handleUpdateUser = async (id: string, formData: FormData) => {
    try {
        const token = await getAuthToken();
        const response = await fetch(`${API_BASE}/${id}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData,
        });

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
    try {
        const token = await getAuthToken();
        const response = await fetch(`${API_BASE}/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });

        const result = await response.json();
        if (result.success) {
            revalidatePath('/admin/users');
            return { success: true, message: 'User deleted' };
        }
        return { success: false, message: result.message };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
};