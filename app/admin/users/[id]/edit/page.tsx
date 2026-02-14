"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/api/axios";
import { API } from "@/lib/api/endpoints";
import { 
  Camera, ArrowLeft, Shield, User, 
  Smartphone, Mail, Save, X, Loader2, Info 
} from "lucide-react";
import toast from "react-hot-toast";

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "male",
    role: "user",
  });

  useEffect(() => {
    if (!id || id === "undefined") return;

    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get(`${API.ADMIN.USERS}/${id}`);
        const fetchedUser = res.data.user || res.data.data;

        if (fetchedUser) {
          setFormData({
            fullName: fetchedUser.fullName || "",
            email: fetchedUser.email || "",
            phone: fetchedUser.phone || "",
            gender: fetchedUser.gender || "male",
            role: fetchedUser.role || "user",
          });

          if (fetchedUser.profilePicture) {
            const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000').replace(/\/$/, '');
            setPreview(`${baseUrl}${fetchedUser.profilePicture}`);
          }
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        toast.error("Could not load user data");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (file) data.append("image", file); // Changed to "image" to match your Multer requirement

    try {
      await axiosInstance.put(`${API.ADMIN.USERS}/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast.success("Account updated successfully");
      router.push("/admin/users");
      router.refresh();
    } catch (err) {
      toast.error("Failed to update user profile");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-100 gap-4">
      <Loader2 className="animate-spin text-[#D32F2F]" size={32} />
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading Registry...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-[#D32F2F] transition-colors mb-2"
          >
            <ArrowLeft size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Cancel Editing</span>
          </button>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Modify User <span className="text-[#D32F2F]">Record</span></h1>
        </div>
        
        <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
          <Info size={16} />
          <span className="text-[10px] font-bold uppercase tracking-wide">Editing ID: {id?.toString().slice(-6)}</span>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Media Side */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm text-center">
            <div className="relative group mx-auto w-48 h-48 mb-4">
              <div className="w-full h-full rounded-[2.5rem] bg-gray-50 border-4 border-white shadow-md overflow-hidden">
                {preview ? (
                  <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User size={48} className="text-gray-200" />
                  </div>
                )}
              </div>
              <label className="absolute bottom-2 right-2 p-3 bg-white border border-gray-100 rounded-2xl shadow-lg text-[#D32F2F] cursor-pointer hover:scale-110 transition-transform">
                <Camera size={20} />
                <input type="file" onChange={handleFileChange} className="hidden" />
              </label>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Update Portrait</p>
          </div>

          <div className="bg-white p-6 rounded-4xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 text-gray-900 mb-4">
              <Shield size={18} className="text-[#D32F2F]" />
              <span className="text-xs font-black uppercase tracking-widest">Access Control</span>
            </div>
            <select 
              name="role" 
              value={formData.role} 
              onChange={handleInputChange}
              className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl text-gray-800 font-bold outline-none focus:ring-2 focus:ring-[#D32F2F]/10 focus:border-[#D32F2F] transition-all text-sm appearance-none"
            >
              <option value="user">Standard User</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
        </div>

        {/* Form Fields Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AdminInputField icon={User} label="Full Name" name="fullName" value={formData.fullName} onChange={handleInputChange} />
              <AdminInputField icon={Shield} label="Gender" name="gender" value={formData.gender} onChange={handleInputChange} isSelect options={['male', 'female', 'other']} />
              <AdminInputField icon={Mail} label="Email Address" name="email" value={formData.email} onChange={handleInputChange} />
              <AdminInputField icon={Smartphone} label="Contact Number" name="phone" value={formData.phone} onChange={handleInputChange} />
            </div>

            <div className="mt-10 pt-8 border-t border-gray-50 flex gap-4">
              <button 
                disabled={submitting}
                type="submit" 
                className="flex-1 bg-[#D32F2F] text-white font-bold py-4 rounded-xl uppercase text-xs tracking-[0.15em] hover:bg-[#B71C1C] transition-all flex items-center justify-center gap-3 shadow-lg shadow-[#D32F2F]/20"
              >
                {submitting ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Update Record</>}
              </button>
              <button 
                type="button"
                onClick={() => router.back()}
                className="px-8 py-4 bg-gray-100 text-gray-500 font-bold rounded-xl uppercase text-xs tracking-[0.15em] hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

function AdminInputField({ icon: Icon, label, name, value, onChange, isSelect = false, options = [] }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] text-gray-400 uppercase font-black tracking-widest ml-1 flex items-center gap-2">
        <Icon size={14} className="text-[#D32F2F]" /> {label}
      </label>
      {isSelect ? (
        <select 
          name={name} 
          value={value} 
          onChange={onChange}
          className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl text-gray-800 font-bold outline-none focus:ring-2 focus:ring-[#D32F2F]/10 focus:border-[#D32F2F] transition-all text-sm"
        >
          {options.map((opt: string) => (
            <option key={opt} value={opt}>{opt.toUpperCase()}</option>
          ))}
        </select>
      ) : (
        <input 
          name={name} 
          value={value} 
          onChange={onChange}
          className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl text-gray-800 font-bold outline-none focus:ring-2 focus:ring-[#D32F2F]/10 focus:border-[#D32F2F] transition-all text-sm" 
        />
      )}
    </div>
  );
}