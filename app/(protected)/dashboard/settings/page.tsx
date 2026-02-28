"use client";

import axios from "@/lib/api/axios";
import { clearAuthCookies } from "@/lib/cookie";
import { useState } from "react";

export default function SettingsPage() {
  const [isDeleting, setIsDeleting] = useState(false);

  const logout = async () => {
    await clearAuthCookies();
    window.location.href = "/login";
  };

  const deleteAccount = async () => {
    const confirmDelete = confirm(
      "Are you absolutely sure? This will permanently erase your profile, matches, and messages.",
    );

    if (!confirmDelete) return;

    try {
      setIsDeleting(true);
      await axios.delete("/api/user/delete");
      alert("Your account has been successfully deleted.");
      await clearAuthCookies();
      window.location.href = "/login";
    } catch (error: any) {
      alert(error.message || "Failed to delete account");
    } finally {
      setIsDeleting(false);
    }
  };

  const resetPassword = () => {
    window.location.href = "/forgot-password";
  };

  const sectionHeader =
    "text-[10px] font-black uppercase tracking-[2px] text-gray-400 mb-4 px-2";
  const itemStyle =
    "w-full flex items-center justify-between p-5 bg-white hover:bg-gray-50 rounded-[24px] transition-all border border-gray-100 group";

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-20">
      {/* Settings Header */}
      <div className="bg-white px-6 pt-12 pb-8 rounded-b-[40px] shadow-sm">
        <h2 className="text-4xl font-black italic tracking-tighter text-black">
          Settings
        </h2>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
          Manage your experience
        </p>
      </div>

      <div className="max-w-md mx-auto p-6 space-y-10 mt-4">
        {/* Security Section */}
        <section>
          <h3 className={sectionHeader}>Security & Privacy</h3>
          <div className="space-y-3">
            <button onClick={resetPassword} className={itemStyle}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <span className="font-black text-black text-sm">
                  Update Password
                </span>
              </div>
              <svg
                className="w-5 h-5 text-gray-300 group-hover:text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </section>

        {/* Account Section */}
        <section>
          <h3 className={sectionHeader}>Account Actions</h3>
          <div className="space-y-3">
            {/* Logout Button */}
            <button onClick={logout} className={itemStyle}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </div>
                <span className="font-black text-black text-sm">Sign Out</span>
              </div>
            </button>

            {/* Delete Account Button */}
            <button
              onClick={deleteAccount}
              disabled={isDeleting}
              className={`${itemStyle} border-rose-100 hover:bg-rose-50`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-rose-100 text-rose-500 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </div>
                <span className="font-black text-rose-500 text-sm">
                  {isDeleting ? "DELETING..." : "Delete Account"}
                </span>
              </div>
            </button>
          </div>
        </section>

        {/* Branding Footer */}
        <div className="text-center pt-10">
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-[4px]">
            Activity Learning Hub v1.0
          </p>
          <p className="text-[10px] font-bold text-gray-300 mt-2 italic">
            Built with ❤️ in Kathmandu
          </p>
        </div>
      </div>
    </div>
  );
}
