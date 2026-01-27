"use client";
import SignupForm from "../_components/RegisterForm";
import Image from "next/image";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-rose-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-lg">

        {/* Logo */}
        <div className="text-center mb-6">
          <Image
            src="/images/logoright.png"
            alt="MannMilap"
            width={150}
            height={150}
            className="mx-auto"
          />
        
          <p className="text-slate-600 text-sm mt-1">
            Where hearts meet, traditions connect, and love feels like home
          </p>
        </div>

        <SignupForm />

      </div>
    </div>
  );
}
