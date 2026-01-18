"use client";

import LoginForm from "../_components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-gradient-to-br from-rose-50 via-pink-100 to-red-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <LoginForm />
      </div>
    </div>
  );
}
