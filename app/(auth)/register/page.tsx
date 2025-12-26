"use client";

import RegisterForm from "../_components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-100 to-red-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white px-6 pb-6 pt-1 shadow-lg">
        <RegisterForm />
      </div>
    </div>
  );
}
