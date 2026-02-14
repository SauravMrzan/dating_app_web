"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const res = await fetch(`/api/reset-password/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newPassword }),
    });

    const data = await res.json();
    if (data.success) {
      setMessage("Password reset successful. Redirecting...");
      setTimeout(() => router.push("/login"), 2000);
    } else {
      setMessage(data.message || "Reset failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-rose-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-6 text-slate-800 text-center">
          Reset Password
        </h2>
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-rose-400
                     bg-slate-50 text-slate-900 placeholder-slate-400"
        />
        <button
          type="submit"
          className="w-full h-11 mt-4 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold transition"
        >
          Reset Password
        </button>
        {message && (
          <p className="mt-4 text-sm text-center text-slate-700">{message}</p>
        )}
        <Link
          href="/login"
          className="block mt-6 text-sm text-rose-600 hover:underline text-center"
        >
          ← Back to Login
        </Link>
      </form>
    </div>
  );
}
