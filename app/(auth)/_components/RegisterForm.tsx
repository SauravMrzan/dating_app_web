"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { RegisterData, registerSchema } from "../schema";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function RegisterForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
  });

  const [pending, startTransition] = useTransition();

  const submit = async (values: RegisterData) => {
    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/login");
    });

    console.log("register", values);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      {/* Logo */}
      <div className="flex justify-center -mb-1">
        <div className="flex justify-center -mb-6 -mt-4">
          <Image
            src="/images/imglogo.png"
            alt="Mannmilap Logo"
            width={160}
            height={160}
            className="block"
            priority
          />
        </div>
      </div>

      {/* Title */}
      <div className="text-center leading-tight">
        <h1 className="text-xl font-bold text-gray-900">Create your account</h1>
        <p className="text-sm text-rose-500">Find a meaningful connection 💖</p>
      </div>

      {/* Name */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Full name</label>
        <input
          {...register("name")}
          placeholder="Your full name"
          className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm
          placeholder:text-rose-300
          focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none"
        />
        {errors.name && (
          <p className="text-xs text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Email</label>
        <input
          {...register("email")}
          placeholder="you@example.com"
          className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm
          placeholder:text-rose-300
          focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none"
        />
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          {...register("password")}
          placeholder="Minimum 6 characters"
          className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm
          placeholder:text-rose-300
          focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none"
        />
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">
          Confirm password
        </label>
        <input
          type="password"
          {...register("confirmPassword")}
          placeholder="Re-enter password"
          className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm
          placeholder:text-rose-300
          focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none"
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-500">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting || pending}
        className="h-11 w-full rounded-lg bg-rose-500 text-white font-semibold
        hover:bg-rose-600 transition disabled:opacity-60"
      >
        {isSubmitting || pending
          ? "Creating your profile..."
          : "Create account"}
      </button>

      {/* Login link */}
      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-rose-600 hover:underline"
        >
          Log in
        </Link>
      </p>
    </form>
  );
}
