"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, SignupData } from "../schema";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Lock,
  Phone,
  Calendar,
  ChevronDown,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { handleRegister } from "@/lib/actions/auth-action";

const CULTURES = ["Brahmin", "Chhetri", "Newar", "Rai", "Magar", "Gurung"];

export default function RegisterForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupData>({
    resolver: zodResolver(registerSchema),
  });

  const passwordValue = watch("password");

  const onSubmit = async (data: SignupData) => {
    const result = await handleRegister(data);
    if (result?.success) router.push("/login");
  };
  console.log(errors);
  return (
    <div className="w-full text-slate-900">
      {/* ---------- TITLE ---------- */}
      <h2 className="text-2xl font-bold text-center mb-6">
        Create your account
      </h2>

      {/* ---------- FORM ---------- */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <InputField
          placeholder="Full Name"
          icon={<User size={16} />}
          error={errors.fullName?.message}
          {...register("fullName")}
        />

        <InputField
          placeholder="Email"
          icon={<Mail size={16} />}
          error={errors.email?.message}
          {...register("email")}
        />

        {/* Password */}

        <div className="relative pt-1">
          <div
            className={`bg-white rounded-xl flex items-center px-4 h-48px border-2 transition-all ${
              errors.password
                ? "border-red-500"
                : "border-transparent focus-within:border-indigo-500"
            }`}
          >
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full bg-transparent text-slate-900 text-xs focus:outline-none font-semibold"
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
            />
            {(passwordValue || passwordFocused) && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="mr-2 text-slate-400 hover:text-indigo-600 focus:outline-none"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            )}
            <Lock size={16} className="text-slate-400" />
          </div>
          {errors.password && (
            <p className="text-[10px] text-red-500 font-bold absolute -bottom-4 left-2 uppercase italic">
              {errors.password.message}
            </p>
          )}
        </div>

        <InputField
          placeholder="Phone (optional)"
          icon={<Phone size={16} />}
          error={errors.phone?.message}
          {...register("phone")}
        />

        <SelectField error={errors.gender?.message} {...register("gender")}>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </SelectField>

        <InputField
          type="date"
          icon={<Calendar size={16} />}
          error={errors.dateOfBirth?.message}
          {...register("dateOfBirth")}
        />

        <SelectField error={errors.culture?.message} {...register("culture")}>
          <option value="">Your Culture</option>
          {CULTURES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </SelectField>

        <SelectField
          error={errors.interestedIn?.message}
          {...register("interestedIn")}
        >
          <option value="">Interested In</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Everyone">Everyone</option>
        </SelectField>

        {/* ---------- PREFERRED CULTURE ---------- */}
        <div className="pt-2 space-y-2">
          <p className="text-xs font-semibold text-slate-700">
            Preferred Culture(s)
          </p>

          <div className="grid grid-cols-2 gap-2">
            {CULTURES.map((c) => (
              <label key={c} className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  value={c}
                  {...register("preferredCulture")}
                />
                {c}
              </label>
            ))}
          </div>
        </div>

        {/* ---------- AGE RANGE ---------- */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <InputField
            type="number"
            placeholder="Min Age"
            {...register("minPreferredAge", { valueAsNumber: true })}
          />
          <InputField
            type="number"
            placeholder="Max Age"
            {...register("maxPreferredAge", { valueAsNumber: true })}
          />
        </div>

        {/* ---------- LOGIN LINK ---------- */}
        <p className="text-xs text-slate-600 text-center pt-2">
          Already have an account?{" "}
          <Link href="/login" className="text-[#C8344A] font-semibold">
            Login
          </Link>
        </p>

        {/* ---------- SUBMIT ---------- */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 rounded-xl bg-[#C8344A] text-white font-bold hover:bg-[#B52E42] transition"
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin mx-auto" size={18} />
          ) : (
            "Sign Up"
          )}
        </button>
      </form>
    </div>
  );
}

/* ---------- COMPONENTS ---------- */

function InputField({ icon, error, ...props }: any) {
  return (
    <div className="relative">
      <div className="input text-slate-900">
        <input {...props} className="text-slate-900 placeholder-slate-400" />
        {icon}
      </div>
      {error && <ErrorText msg={error} />}
    </div>
  );
}

function SelectField({ children, error, ...props }: any) {
  return (
    <div className="relative">
      <div className="input text-slate-900">
        <select {...props} className="text-slate-900">
          {children}
        </select>
        <ChevronDown size={16} />
      </div>
      {error && <ErrorText msg={error} />}
    </div>
  );
}

function ErrorText({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-[11px] text-red-500 mt-1 ml-2 italic">{msg}</p>;
}
