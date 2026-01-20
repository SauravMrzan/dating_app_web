"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { registerSchema, RegisterData } from "../schema";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axiosInstance from "../../../lib/api/axios";
import { API } from "@/lib/api/endpoints";
import z from "zod";

const CULTURES = ["Brahmin", "Chhetri", "Newar", "Rai", "Magar", "Gurung"];
const GENDERS = ["Male", "Female", "Other"];
const INTERESTED_IN = ["Male", "Female", "Everyone"];

export default function RegisterForm() {
  const router = useRouter();

  const {
  register,
  handleSubmit,
  formState: { errors, isSubmitting },
  setError,
} = useForm<z.input<typeof registerSchema>>({
  resolver: zodResolver(registerSchema),
  mode: "onBlur",
});

  const [pending, startTransition] = useTransition();

  const submit = async (values: z.input<typeof registerSchema>) => {
  startTransition(async () => {
    try {
      // Zod already removes confirmPassword via .transform()
      const parsed = registerSchema.parse(values);

      const payload = Object.fromEntries(
        Object.entries(parsed).filter(
          ([, v]) => v !== "" && v !== null && v !== undefined,
        ),
      );

      const res = await axiosInstance.post(API.AUTH.REGISTER, payload);

      if (res.data?.success || res.data?.user) {
        router.push("/login");
      } else {
        setError("root", {
          message: res.data?.message || "Registration failed",
        });
      }
    } catch (err: any) {
      setError("root", {
        message:
          err?.response?.data?.message ||
          "Unable to register. Please try again.",
      });
    }
  });
};

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5">
      {/* Logo */}
      <div className="flex justify-center -mb-2 -mt-2">
        <Image
          src="/images/logoright.png"
          alt="MannMilap Logo"
          width={120}
          height={120}
          className="block"
          priority
        />
      </div>

      {/* Title */}
      <div className="text-center leading-tight">
        <h1 className="text-lg font-bold text-gray-900">Create your account</h1>
        <p className="text-xs text-gray-600">
          Find meaningful connections based on culture
        </p>
      </div>

      {/* Global Error */}
      {errors.root && (
        <p className="text-center text-sm text-red-600">
          {errors.root.message}
        </p>
      )}

      {/* Account Details */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-900">Account Details</h2>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-900">Username</label>
          <input
            {...register("username")}
            className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm text-gray-900 placeholder:text-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none"
          />
          {errors.username && (
            <p className="text-xs text-red-500">{errors.username.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-900">Email</label>
          <input
            {...register("email")}
            className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm text-gray-900 placeholder:text-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none"
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-900">Password</label>
          <input
            type="password"
            {...register("password")}
            className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm text-gray-900 placeholder:text-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none"
          />
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-900">
            Confirm password
          </label>
          <input
            type="password"
            {...register("confirmPassword")}
            className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm text-gray-900 placeholder:text-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none"
          />
          {errors.confirmPassword && (
            <p className="text-xs text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </div>

      {/* Personal Info */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-900">
          Personal Information
        </h2>

        <input
          {...register("fullName")}
          placeholder="Full name"
          className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm"
        />
        <input
          {...register("phone")}
          placeholder="Phone (optional)"
          className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm"
        />

        <div className="grid grid-cols-2 gap-3">
          <select
            {...register("gender")}
            className="h-10 w-full rounded-lg border px-3 text-sm"
          >
            <option value="">Gender</option>
            {GENDERS.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>

          <input
            type="date"
            {...register("dateOfBirth")}
            className="h-10 w-full rounded-lg border px-3 text-sm"
          />
        </div>

        <select
          {...register("culture")}
          className="h-10 w-full rounded-lg border px-3 text-sm"
        >
          <option value="">Culture</option>
          {CULTURES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Preferences */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-900">Preferences</h2>

        <select
          {...register("interestedIn")}
          className="h-10 w-full rounded-lg border px-3 text-sm"
        >
          <option value="">Interested in</option>
          {INTERESTED_IN.map((i) => (
            <option key={i}>{i}</option>
          ))}
        </select>

        <div className="grid grid-cols-2 gap-2">
          {CULTURES.map((c) => (
            <label key={c} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={c}
                {...register("preferredCulture")}
              />
              {c}
            </label>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            {...register("minPreferredAge", { valueAsNumber: true })}
            placeholder="Min age"
            className="h-10 w-full rounded-lg border px-3 text-sm"
          />
          <input
            type="number"
            {...register("maxPreferredAge", { valueAsNumber: true })}
            placeholder="Max age"
            className="h-10 w-full rounded-lg border px-3 text-sm"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || pending}
        className="w-full h-10 rounded-lg bg-rose-500 text-white font-semibold"
      >
        {isSubmitting || pending ? "Creating account..." : "Create account"}
      </button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-rose-600">
          Log in
        </Link>
      </p>
    </form>
  );
}
