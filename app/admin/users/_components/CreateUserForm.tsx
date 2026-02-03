"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  UserPlus,
  Camera,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  ChevronDown,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

const CULTURES = ["Brahmin", "Chhetri", "Newar", "Rai", "Magar", "Gurung"];

export default function CreateUser() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    culture: "",
    role: "user",
    interestedIn: "Everyone",
    minPreferredAge: 18,
    maxPreferredAge: 99,
    preferredCulture: [] as string[],
  });

  // Handle Standard Text/Select Inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Checkbox for Array values
  const handleCheckboxChange = (culture: string) => {
    setFormData((prev) => {
      const current = prev.preferredCulture;
      const updated = current.includes(culture)
        ? current.filter((c) => c !== culture)
        : [...current, culture];
      return { ...prev, preferredCulture: updated };
    });
  };

  // Handle File/Image Change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Basic validation for students: check file size (e.g., 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("File is too large. Max 5MB.");
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      toast.success("Image selected!");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();

    // Loop through state and append to FormData
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "preferredCulture" && Array.isArray(value)) {
        // Append each item individually so Multer/Zod treats it as an array
        value.forEach((item) => data.append("preferredCulture", item));
      } else {
        data.append(key, String(value));
      }
    });

    // if (file) {
    //   data.append("profilePicture", file);
    // }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/users",
        data,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      if (response.data.success) {
        toast.success("Identity Authorized Successfully!");
        router.push("/admin/users");
        router.refresh(); // Ensure the user list updates
      }
    } catch (err: any) {
      console.error("Upload Error:", err);
      const errorMessage =
        err.response?.data?.message || "Auth Failed: Check server logs.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 px-4 text-slate-900">
      {/* ... (Your existing Navigation Header) ... */}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
      >
        {/* Left: Profile & Access */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-xl flex flex-col items-center">
            <div className="relative group w-full aspect-square max-w-[240px]">
              <div className="w-full h-full rounded-[2.5rem] bg-slate-50 border-2 border-dashed border-slate-200 overflow-hidden flex items-center justify-center">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera size={48} className="text-slate-300" />
                )}
              </div>
              <input
                type="file"
                name="profilePicture"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept="image/*"
              />
            </div>
            <p className="mt-4 text-[11px] font-black uppercase text-black">
              Upload Biometrics
            </p>
          </div>

          <AdminSelect
            label="Access Level"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
          >
            <option value="user">USER (Level 1)</option>
            <option value="admin">ADMIN (Root)</option>
          </AdminSelect>
        </div>

        {/* Right: Detailed Identity Information */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: Credentials */}
          <div className="bg-white p-8 rounded-3xl border-2 border-slate-100 shadow-xl space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#D32F2F] border-b pb-2">
              Step 1: Credentials
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AdminInput
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
              <AdminInput
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
              <AdminInput
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <AdminInput
                label="Access Key"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Section 2: Bio-Metrics */}
          <div className="bg-white p-8 rounded-3xl border-2 border-slate-100 shadow-xl space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#D32F2F] border-b pb-2">
              Step 2: Bio-Metrics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <AdminSelect
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </AdminSelect>
              <AdminInput
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                required
              />
              <AdminSelect
                label="Native Culture"
                name="culture"
                value={formData.culture}
                onChange={handleInputChange}
                required
              >
                <option value="">Select</option>
                {CULTURES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </AdminSelect>
            </div>
          </div>

          {/* ... (Section 3: Network Preferences - Checkboxes use handleCheckboxChange) ... */}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-5 bg-black text-[#D4FF33] rounded-[2rem] font-black uppercase italic tracking-[0.2em] shadow-2xl hover:bg-[#D32F2F] hover:text-white transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <CheckCircle2 size={20} /> Authorize New Identity
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

// Re-usable High-Contrast Components
const AdminInput = ({ label, ...props }: any) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black uppercase text-slate-500 ml-1">
      {label}
    </label>
    <div className="bg-slate-50 rounded-xl flex items-center px-4 h-[52px] border-2 border-transparent focus-within:border-[#D32F2F] transition-all">
      <input
        {...props}
        className="w-full bg-transparent text-black text-xs font-black focus:outline-none"
      />
    </div>
  </div>
);

const AdminSelect = ({ label, children, ...props }: any) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black uppercase text-slate-500 ml-1">
      {label}
    </label>
    <div className="relative">
      <select
        {...props}
        className="w-full bg-slate-50 border-2 border-transparent focus:border-[#D32F2F] p-4 rounded-xl text-black text-xs font-black outline-none appearance-none cursor-pointer"
      >
        {children}
      </select>
      <ChevronDown
        size={14}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
      />
    </div>
  </div>
);
