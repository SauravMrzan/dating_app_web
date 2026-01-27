"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginData } from "../schema";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Heart,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useState, useTransition } from "react";
import { handleLogin } from "@/lib/actions/auth-action";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const [pending, setTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const passwordValue = watch("password");

  const onSubmit = async (data: LoginData) => {
    setErrorMsg("");
    setTransition(async () => {
      try {
        const result = await handleLogin(data);
        if (!result.success) {
          throw new Error(result.message);
        }
        if (result?.success) {
          if (result.data?.role == "admin") {
            return router.replace("/admin");
          }
          if (result.data?.role === "user") {
            return router.replace("/user/dashboard");
          }
          return router.replace("/");
        } else {
          setError(result?.message || "Invalid email or password");
        }
      } catch (err: Error | any) {
        setError(err.message || "Login Failed");
      }
    });
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl px-8 py-10 text-slate-900">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email */}
        <div>
          <label className="text-xs font-semibold text-slate-600">
            Email Address
          </label>
          <div className="mt-1 flex items-center gap-2 bg-slate-100 px-4 h-46px rounded-xl focus-within:ring-2 focus-within:ring-rose-400">
            <Mail size={16} className="text-slate-400" />
            <input
              {...register("email")}
              placeholder="you@example.com"
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
          {errors.email && (
            <p className="text-[11px] text-red-500 mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="text-xs font-semibold text-slate-600">
            Password
          </label>
          <div className="mt-1 flex items-center gap-2 bg-slate-100 px-4 h-46px rounded-xl focus-within:ring-2 focus-within:ring-rose-400">
            <Lock size={16} className="text-slate-400" />
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full bg-transparent text-sm outline-none"
            />
            {passwordValue && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-rose-500"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            )}
          </div>
          {errors.password && (
            <p className="text-[11px] text-red-500 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Forgot password */}
        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-[11px] text-slate-500 hover:text-rose-600"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-48px rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition flex items-center justify-center"
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            "Log In"
          )}
        </button>
      </form>

      {/* Error Message */}
      {errorMsg && (
        <div className="flex items-center gap-2 text-xs bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg mb-5">
          <AlertCircle size={14} />
          {errorMsg}
        </div>
      )}

      {/* Footer */}
      <p className="text-center text-xs text-slate-500 mt-8">
        Don’t have an account?{" "}
        <Link href="/register" className="text-rose-600 font-semibold">
          Create one
        </Link>
      </p>
    </div>
  );
}
