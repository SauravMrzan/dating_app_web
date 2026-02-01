"use client";
import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/api/axios";
import { API } from "@/lib/api/endpoints";
import { Camera, ArrowLeft, Shield, User, Heart, Smartphone, Mail } from "lucide-react";

export default function EditUser({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [loading, setLoading] = useState(true);
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
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (file) data.append("profilePicture", file);

    try {
      await axiosInstance.put(`${API.ADMIN.USERS}/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      router.push("/admin/users");
      router.refresh();
    } catch (err) {
      alert("Failed to update user profile.");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-rose-500 font-bold animate-pulse tracking-[0.5em] text-sm uppercase">
        Loading Vibe Data...
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 pb-20 pt-10">
      {/* Header Navigation */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-500 hover:text-white transition-all group mb-4"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">User Registry</span>
          </button>
          <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter">
            Edit <span className="text-rose-500">Profile</span>
          </h1>
        </div>
        
        <div className="bg-rose-500/10 border border-rose-500/20 px-6 py-3 rounded-2xl backdrop-blur-md">
           <p className="text-[10px] text-rose-400 uppercase font-black tracking-widest mb-1">Moderation Mode</p>
           <p className="text-white text-xs font-mono font-bold">AUTH_TOKEN: ACTIVE</p>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Aesthetics */}
        <div className="lg:col-span-4 space-y-6">
          <div className="relative group aspect-[3/4] rounded-[40px] overflow-hidden border border-white/10 bg-neutral-900 shadow-2xl">
            {preview ? (
              <img src={preview} alt="Profile" className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User size={80} className="text-white/5" />
              </div>
            )}
            <label className="absolute inset-0 bg-rose-950/40 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center cursor-pointer backdrop-blur-sm">
              <div className="bg-white text-black p-4 rounded-full shadow-xl translate-y-4 group-hover:translate-y-0 transition-transform">
                <Camera size={24} />
              </div>
              <input type="file" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] space-y-4">
             <div className="flex items-center gap-3 text-rose-500 mb-2">
                <Shield size={18} />
                <span className="text-xs font-black uppercase tracking-widest">Authority Level</span>
             </div>
             <select 
                name="role" 
                value={formData.role} 
                onChange={handleInputChange}
                className="w-full bg-black border border-white/10 p-4 rounded-2xl text-white font-bold outline-none focus:border-rose-500 transition-all appearance-none cursor-pointer text-sm"
              >
                <option value="user">Standard Member</option>
                <option value="admin">Platform Admin</option>
              </select>
          </div>
        </div>

        {/* Right Column: Information */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-[#0A0A0A] border border-white/5 p-8 md:p-12 rounded-[48px] shadow-inner relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
                <Heart size={120} className="text-rose-500" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <EditField icon={User} label="Full Name" name="fullName" value={formData.fullName} onChange={handleInputChange} />
              <EditField icon={Heart} label="Gender" name="gender" value={formData.gender} onChange={handleInputChange} isSelect options={['male', 'female', 'other']} />
              <EditField icon={Mail} label="Email Address" name="email" value={formData.email} onChange={handleInputChange} />
              <EditField icon={Smartphone} label="Phone Line" name="phone" value={formData.phone} onChange={handleInputChange} />
            </div>

            <div className="mt-12 pt-12 border-t border-white/5 flex flex-col sm:flex-row gap-4">
              <button 
                type="submit" 
                className="flex-1 bg-white text-black font-black py-5 rounded-2xl uppercase italic hover:bg-rose-500 hover:text-white transition-all transform active:scale-[0.98] shadow-xl"
              >
                Save Profile Changes
              </button>
              <button 
                type="button"
                onClick={() => router.back()}
                className="px-8 py-5 border border-white/10 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/5 hover:text-white transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
          
          <p className="text-center text-[10px] text-gray-600 font-mono uppercase tracking-[0.3em]">
            Immutable Object ID: {id}
          </p>
        </div>
      </form>
    </div>
  );
}

// Helper Component for inputs
function EditField({ icon: Icon, label, name, value, onChange, isSelect = false, options = [] }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest ml-1 flex items-center gap-2">
        <Icon size={12} className="text-rose-500" /> {label}
      </label>
      {isSelect ? (
        <select 
          name={name} 
          value={value} 
          onChange={onChange}
          className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white font-bold outline-none focus:border-rose-500 transition-all"
        >
          {options.map((opt: string) => (
            <option key={opt} value={opt} className="bg-black">{opt.toUpperCase()}</option>
          ))}
        </select>
      ) : (
        <input 
          name={name} 
          value={value} 
          onChange={onChange}
          className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white font-bold outline-none focus:border-rose-500 transition-all placeholder:text-white/10" 
        />
      )}
    </div>
  );
}