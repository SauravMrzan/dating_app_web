"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { type RegisterData, registerSchema } from "../schema";
import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const CULTURES = ["Brahmin", "Chhetri", "Newar", "Rai", "Magar", "Gurung"];
const GENDERS = ["Male", "Female", "Other"];
const INTERESTED_IN = ["Male", "Female", "Everyone"];

export default function RegisterForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger, // 👈 used for step-wise validation
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
    shouldUnregister: true,
  
  });

  const [pending, startTransition] = useTransition();

  const submit = async (values: RegisterData) => {
    startTransition(async () => {
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.message || "Registration failed");
          return;
        }

        router.push("/login");
      } catch (err) {
        alert("Something went wrong. Try again.");
      }
    });
  };

  const goNext = async () => {
    let fields: (keyof RegisterData)[] = [];

    if (step === 1) {
      fields = ["username", "email", "password", "confirmPassword"];
    }

    if (step === 2) {
      fields = ["fullName", "gender", "dateOfBirth", "culture"];
    }

    const valid = await trigger(fields);
    if (valid) setStep(step + 1);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6">
      {/* Logo */}
      <div className="flex justify-center -mb-2 -mt-2">
        <Image
          src="/images/logoright.png"
          alt="MannMilap Logo"
          width={140}
          height={140}
          className="block"
          priority
        />
      </div>

      {/* Title */}
      <div className="text-center leading-tight">
        <h1 className="text-xl font-bold text-gray-900">Create your account</h1>
        <p className="text-xs text-gray-600">Step {step} of 3</p>
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-900">
              Username
            </label>
            <input
              {...register("username")}
              placeholder="Choose a username"
              className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm text-blue-700"
            />
            {errors.username && (
              <p className="text-xs text-red-500">{errors.username.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-900">Email</label>
            <input
              {...register("email")}
              placeholder="you@example.com"
              className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm text-blue-700"
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-900">
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm text-blue-700"
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
              className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm text-blue-700"
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-900">
              Full name
            </label>
            <input
              {...register("fullName")}
              className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm text-blue-700"
            />
            {errors.fullName && (
              <p className="text-xs text-red-500">{errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-900">Gender</label>
            <select
              {...register("gender")}
              className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm text-blue-700"
            >
              <option value="">Select gender</option>
              {GENDERS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
            {errors.gender && (
              <p className="text-xs text-red-500">{errors.gender.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-900">
              Date of birth
            </label>
            <input
              type="date"
              {...register("dateOfBirth")}
              className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm text-blue-700"
            />
            {errors.dateOfBirth && (
              <p className="text-xs text-red-500">
                {errors.dateOfBirth.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-900">
              Your culture
            </label>
            <select
              {...register("culture")}
              className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm text-blue-700"
            >
              <option value="">Select culture</option>
              {CULTURES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.culture && (
              <p className="text-xs text-red-500">{errors.culture.message}</p>
            )}
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-900">
              Interested in
            </label>
            <select
              {...register("interestedIn")}
              className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm text-blue-700"
            >
              <option value="">Select preference</option>
              {INTERESTED_IN.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
            {errors.interestedIn && (
              <p className="text-xs text-red-500">
                {errors.interestedIn.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">
              Preferred cultures
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CULTURES.map((culture) => (
                <label key={culture} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={culture}
                    {...register("preferredCulture")}
                  />
                  <span className="text-sm text-blue-700">{culture}</span>
                </label>
              ))}
            </div>
            {errors.preferredCulture && (
              <p className="text-xs text-red-500">
                {errors.preferredCulture.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              {...register("minPreferredAge", { valueAsNumber: true })}
              placeholder="Min age"
              className="h-10 w-full rounded-lg border px-3 text-sm text-blue-700"
            />
            <input
              type="number"
              {...register("maxPreferredAge", { valueAsNumber: true })}
              placeholder="Max age"
              className="h-10 w-full rounded-lg border px-3 text-sm text-blue-700"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3 pt-4">
        {step > 1 && (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="flex-1 h-10 rounded-lg border bg-blue-500"
          >
            Back
          </button>
        )}

        {step < 3 ? (
          <button
            type="button"
            onClick={goNext}
            className="flex-1 h-10 rounded-lg bg-rose-500 "
          >
            Next
          </button>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting || pending}
            className="flex-1 h-10 rounded-lg bg-rose-500 text-white"
          >
            {isSubmitting || pending ? "Creating..." : "Create account"}
          </button>
        )}
      </div>

      <p className="text-center text-sm text-rose-300">
        Already have an account?{" "}
        <Link href="/login" className="text-rose-600 font-semibold" >
          Log in
        </Link>
      </p>
    </form>
  );
}
