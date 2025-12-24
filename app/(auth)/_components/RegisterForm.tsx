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

  const [pending, setTransition] = useTransition();

  const submit = async (values: RegisterData) => {
    setTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/login");
    });

    console.log("register", values);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5">
      {/* Logo */}
      <div className="flex justify-center">
        <Image
          src="/images/imglogo.png"
          alt="Dating App Logo"
          width={200}
          height={200}
          className="scale-75 -mb-6"
          priority
        />
      </div>

      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold text-gray-900">
          Create Your Profile
        </h1>
        <p className="text-sm text-gray-600">
          Find a partner who shares your values and culture
        </p>
      </div>

      {/* Full Name */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Full Name</label>
        <input
          {...register("name")}
          placeholder="Your full name"
          className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm
          placeholder:text-rose-200
          outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
        />
        {errors.name && (
          <p className="text-xs text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          {...register("email")}
          placeholder="example@email.com"
          className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm
          placeholder:text-rose-200
          outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
        />
        {errors.email && (
          <p className="text-xs text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">
          Create Password
        </label>
        <input
          {...register("password")}
          type="password"
          placeholder="Minimum 6 characters"
          className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm
          placeholder:text-rose-200
          outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
        />
        {errors.password && (
          <p className="text-xs text-red-600">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <input
          {...register("confirmPassword")}
          type="password"
          placeholder="Re-enter your password"
          className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm
          placeholder:text-rose-200
          outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-600">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting || pending}
        className="h-11 w-full rounded-lg bg-rose-600 text-white font-semibold
          placeholder:text-rose-200
        hover:bg-rose-700 transition disabled:opacity-60"
      >
        {isSubmitting || pending
          ? "Creating your profile..."
          : "Create Profile"}
      </button>

      {/* Login */}
      <p className="text-center text-sm text-gray-600">
        Already registered?{" "}
        <Link
          href="/login"
          className="font-semibold text-rose-600 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
