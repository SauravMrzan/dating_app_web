"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginData } from "../schema";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { useState, useTransition } from "react";
import { handleLogin } from "@/lib/actions/auth-action";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation"; // Added for navigation

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { checkAuth } = useAuth();
  const router = useRouter(); // Initialize the router

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const [pending, startTransition] = useTransition();
  const passwordValue = watch("password");

  const onSubmit = async (data: LoginData) => {
    setErrorMsg("");

    startTransition(async () => {
      try {
        const result = await handleLogin(data);

        if (!result.success) {
          setErrorMsg(result.message || "Invalid email or password");
          return;
        }

        // 1. Sync the AuthContext state
        await checkAuth();

        // 2. Get Role from result
        const role = result.data?.role;

        // 3. Navigation Logic
        // router.refresh() is critical here: it forces Next.js to re-run
        // the Middleware (proxy.ts) so it recognizes the new cookie.
        if (role === "admin") {
          router.push("/admin/users");
        } else if (role === "user") {
          router.push("/dashboard");
        } else {
          router.push("/");
        }

        router.refresh();
      } catch (err: any) {
        setErrorMsg(err.message || "Login Failed");
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
          <div className="mt-1 flex items-center gap-2 bg-slate-100 px-4 h-11.5 rounded-xl focus-within:ring-2 focus-within:ring-rose-400">
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
          <div className="mt-1 flex items-center gap-2 bg-slate-100 px-4 h-11.5 rounded-xl focus-within:ring-2 focus-within:ring-rose-400">
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

        {/* Error Message Display */}
        {errorMsg && (
          <div className="flex items-center gap-2 text-xs bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg">
            <AlertCircle size={14} />
            {errorMsg}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting || pending}
          className="w-full h-12 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition flex items-center justify-center"
        >
          {isSubmitting || pending ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            "Log In"
          )}
        </button>
      </form>

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
