"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoginData, loginSchema } from "../schema";
import { useTransition } from "react";
import Image from "next/image";
import axiosInstance from "../../../lib/api/axios"; // adjust path if needed
import { API } from "../../../lib/api/endpoints"; // adjust path if needed

export default function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
  });

  const [pending, startTransition] = useTransition();

  const submit = async (values: LoginData) => {
    startTransition(async () => {
      try {
        const res = await axiosInstance.post(API.AUTH.LOGIN, values);

        // example expected response:
        // { success: true, token: "...", user: {...} }

        if (res.data?.success) {
          router.push("/home");
        } else {
          setError("root", {
            message: res.data?.message || "Login failed",
          });
        }
      } catch (err: any) {
        setError("root", {
          message:
            err?.response?.data?.message ||
            "Unable to login. Please try again.",
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5">
      {/* Logo */}
      <Link href="/" className="flex justify-center -mb-1">
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
      </Link>

      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
        <p className="text-sm text-gray-600">
          Sign in to continue your journey
        </p>
      </div>

      {/* Global Error */}
      {errors.root && (
        <p className="text-center text-sm text-red-600">
          {errors.root.message}
        </p>
      )}

      {/* Email */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          {...register("email")}
          type="email"
          autoComplete="email"
          placeholder="example@email.com"
          className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm
          text-gray-900 placeholder:text-rose-500
          outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
        />
        {errors.email && (
          <p className="text-xs text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Password</label>
        <input
          {...register("password")}
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm
          text-gray-900 placeholder:text-rose-500
          outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
        />
        {errors.password && (
          <p className="text-xs text-red-600">{errors.password.message}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting || pending}
        className="h-11 w-full rounded-lg bg-rose-600 text-white font-semibold
        hover:bg-rose-700 transition disabled:opacity-60"
      >
        {isSubmitting || pending ? "Signing in..." : "Sign In"}
      </button>

      {/* Register Link */}
      <p className="text-center text-sm text-gray-600">
        New here?{" "}
        <Link
          href="/register"
          className="font-semibold text-rose-600 hover:underline"
        >
          Create a profile
        </Link>
      </p>
    </form>
  );
}
