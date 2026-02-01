"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UserPlus, Shield, Mail, Phone, Lock, 
  User, Camera, ArrowLeft, CheckCircle2, Loader2,
  AlertCircle, Eye, EyeOff, Sparkles, Users,
  ChevronDown, Calendar, Heart
} from "lucide-react";
import axiosInstance from "@/lib/api/axios";
import { API } from "@/lib/api/endpoints";

export default function CreateUser() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    gender: "",
    dob: "",
    role: "user"
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const submitData = new FormData();
    Object.entries(formData).forEach(([key, value]) => submitData.append(key, value));
    if (file) submitData.append("profilePicture", file);

    try {
      await axiosInstance.post(API.ADMIN.USERS, submitData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      router.push("/admin/users");
      router.refresh();
    } catch (err) {
      console.error("Onboarding failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return <div className="min-h-screen bg-black" />;

  return (
    <div className="max-w-6xl mx-auto pb-20 px-4 pt-6 relative">
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 relative z-10">
        <div className="space-y-4">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-500 hover:text-white transition-all group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Back to Registry</span>
          </button>
          <div className="flex items-center gap-4">
             <div className="p-3 bg-rose-500/20 border border-rose-500/30 rounded-2xl">
                <UserPlus size={28} className="text-rose-500" />
             </div>
             <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter">
                Onboard <span className="text-rose-500 text-glow">Member</span>
             </h1>
          </div>
          <p className="text-gray-500 text-[10px] font-mono uppercase tracking-[0.2em] flex items-center gap-2">
            <Sparkles size={12} className="text-rose-400" />
            Initializing Premium Profile
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-[24px] backdrop-blur-xl">
           <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">System Health</p>
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-white text-xs font-bold font-mono">ENCRYPTED_UPLINK_STABLE</p>
           </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
        
        {/* Left: Visual Identity */}
        <div className="lg:col-span-4 space-y-6">
          <div className="relative group aspect-[3/4] bg-[#0A0A0A] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
             {preview ? (
               <img src={preview} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
             ) : (
               <div className="w-full h-full flex flex-col items-center justify-center text-gray-800">
                  <Heart size={60} strokeWidth={1} className="mb-4 text-white/5" />
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-20">Awaiting Visuals</span>
               </div>
             )}
             <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center cursor-pointer backdrop-blur-sm">
                <Camera size={32} className="text-rose-500 mb-2" />
                <span className="text-[10px] font-bold text-white uppercase">Upload Profile Picture</span>
                <input type="file" name="profilePicture" onChange={handleFileChange} className="hidden" accept="image/*" />
             </label>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] space-y-4">
             <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest flex items-center gap-2">
                <Shield size={14} className="text-rose-500" /> Account Type
             </label>
             <select 
               name="role"
               value={formData.role}
               onChange={handleInputChange}
               className="w-full bg-black border border-white/10 p-4 rounded-2xl text-white font-bold outline-none focus:border-rose-500 transition-all appearance-none cursor-pointer"
             >
               <option value="user">Standard Member</option>
               <option value="admin">Platform Moderator</option>
             </select>
          </div>
        </div>

        {/* Right: Data Entry */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-[#0A0A0A] border border-white/5 p-8 md:p-12 rounded-[48px] shadow-inner">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormInput icon={User} label="Full Name" name="fullName" placeholder="Ex: Alex Rivera" value={formData.fullName} onChange={handleInputChange} />
              <FormInput icon={Mail} label="Email Address" name="email" type="email" placeholder="alex@datesync.com" value={formData.email} onChange={handleInputChange} />
              
              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest ml-1 flex items-center gap-2">
                  <Users size={12} className="text-rose-500" /> Gender
                </label>
                <div className="relative">
                  <select 
                    name="gender" 
                    required 
                    value={formData.gender} 
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white font-bold outline-none focus:border-rose-500 transition-all appearance-none"
                  >
                    <option value="" disabled className="bg-black">Select...</option>
                    <option value="male" className="bg-black">Male</option>
                    <option value="female" className="bg-black">Female</option>
                    <option value="other" className="bg-black">Other</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
              </div>

              <FormInput icon={Calendar} label="Birth Date" name="dob" type="date" value={formData.dob} onChange={handleInputChange} />
              <FormInput icon={Phone} label="Phone Number" name="phone" placeholder="+1..." value={formData.phone} onChange={handleInputChange} />
              
              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest ml-1 flex items-center gap-2">
                  <Lock size={12} className="text-rose-500" /> Password
                </label>
                <div className="relative">
                  <input 
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white font-bold outline-none focus:border-rose-500 transition-all"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-12 border-t border-white/5">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-white text-black font-black py-6 rounded-[24px] uppercase italic hover:bg-rose-500 hover:text-white transition-all shadow-xl flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : <Shield size={20} />}
                {isSubmitting ? "Processing..." : "Authorize & Create Account"}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center text-gray-600">
             <AlertCircle size={14} />
             <p className="text-[10px] font-bold uppercase tracking-widest">Double check information before database commit</p>
          </div>
        </div>
      </form>
    </div>
  );
}

function FormInput({ icon: Icon, label, name, type = "text", placeholder, value, onChange }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest ml-1 flex items-center gap-2">
        <Icon size={12} className="text-rose-500" /> {label}
      </label>
      <input 
        name={name} 
        type={type} 
        placeholder={placeholder} 
        value={value} 
        onChange={onChange}
        className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white font-bold outline-none focus:border-rose-500 transition-all placeholder:text-white/5 [color-scheme:dark]" 
      />
    </div>
  );
}