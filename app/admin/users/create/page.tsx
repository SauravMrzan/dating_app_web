"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { handleCreateUser } from "@/lib/actions/admin/user-action";
import {
  Mail,
  Lock,
  User as UserIcon,
  Shield,
  Camera,
  Loader2,
  CheckCircle,
  ChevronLeft,
  Heart,
  Globe,
  Zap,
  Calendar,
  Phone,
} from "lucide-react";
import { toast } from "react-hot-toast";

const CULTURES = ["Brahmin", "Chhetri", "Newar", "Rai", "Magar", "Gurung"];

export default function CreateUserPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      const result = await handleCreateUser(formData as any);
      if (result.success) {
        toast.success("User Profile Created Successfully");
        router.push("/admin/users");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to create user");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 px-4">
      {/* Header */}
      <div className="mb-10 pt-6">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-xs font-black text-slate-900 hover:text-[#D32F2F] mb-4 uppercase tracking-widest transition-colors"
        >
          <ChevronLeft size={14} /> Back to Database
        </button>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#D32F2F] rounded-2xl shadow-lg">
            <UserIcon className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-black tracking-tight uppercase italic">
              Register New Peer
            </h1>
            <p className="text-sm text-slate-700 font-bold">
              Initialize a new account for the activity-based learning track.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Photo & Role */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center">
            <div className="relative group cursor-pointer">
              <div className="w-40 h-40 rounded-[2.5rem] bg-slate-50 border-2 border-dashed border-slate-300 overflow-hidden flex items-center justify-center transition-all group-hover:border-[#D32F2F]">
                {imagePreview ? (
                  <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <Camera size={40} className="text-slate-400" />
                )}
              </div>
              <input 
                type="file" 
                name="image" 
                accept="image/*" 
                onChange={(e) => e.target.files?.[0] && setImagePreview(URL.createObjectURL(e.target.files[0]))} 
                className="absolute inset-0 opacity-0 cursor-pointer" 
              />
            </div>
            <p className="mt-4 text-[11px] font-black uppercase tracking-[0.2em] text-slate-900 text-center">
              Upload Profile Avatar
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <SelectField label="Role" name="role" icon={Shield}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </SelectField>
          </div>
        </div>

        {/* Right Column: Information Sections */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Section 1: Identity */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
              <Zap size={16} className="text-[#D32F2F]" />
              <h3 className="text-xs font-black uppercase tracking-widest text-black">Core Account Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Full Name" name="fullName" icon={UserIcon} placeholder="John Doe" />
              <InputField label="Email Address" name="email" type="email" icon={Mail} placeholder="john@example.com" />
              <InputField label="Access Password" name="password" type="password" icon={Lock} placeholder="••••••••" />
            </div>
          </div>

          {/* Section 2: Bio-Metrics */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
              <Globe size={16} className="text-[#D32F2F]" />
              <h3 className="text-xs font-black uppercase tracking-widest text-black">Personal Characteristics</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SelectField label="Gender" name="gender" icon={UserIcon}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </SelectField>
              <InputField label="Date of Birth" name="dateOfBirth" type="date" icon={Calendar} />
              <SelectField label="Native Culture" name="culture" icon={Globe}>
                <option value="">Select Culture</option>
                {CULTURES.map(c => <option key={c} value={c}>{c}</option>)}
              </SelectField>
            </div>
            <InputField label="Phone Number" name="phone" icon={Phone} placeholder="+977 ..." />
          </div>

          {/* Section 3: Preferences */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
              <Heart size={16} className="text-[#D32F2F]" />
              <h3 className="text-xs font-black uppercase tracking-widest text-black">Discovery Preferences</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SelectField label="Interested In" name="interestedIn" icon={Heart}>
                <option value="Everyone">Everyone</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </SelectField>
              <InputField label="Min Age" name="minPreferredAge" type="number" icon={Shield} defaultValue="18" />
              <InputField label="Max Age" name="maxPreferredAge" type="number" icon={Shield} defaultValue="99" />
            </div>
            
            <div className="space-y-3 pt-2">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-900 ml-1">Preferred Peer Cultures</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-5 bg-slate-50 rounded-2xl border border-slate-200">
                {CULTURES.map((c) => (
                  <label key={c} className="flex items-center gap-3 text-xs font-black text-black cursor-pointer hover:text-[#D32F2F] transition-colors">
                    <input 
                      type="checkbox" 
                      name="preferredCulture" 
                      value={c} 
                      className="w-4 h-4 rounded border-slate-300 text-[#D32F2F] focus:ring-[#D32F2F]" 
                    />
                    {c}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <button 
            disabled={loading} 
            type="submit" 
            className="w-full py-5 bg-[#D32F2F] text-white rounded-[2.5rem] font-black uppercase text-xs tracking-[0.4em] shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <><CheckCircle size={20} /> Create</>}
          </button>
        </div>
      </form>
    </div>
  );
}

function InputField({ label, icon: Icon, ...props }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-black uppercase tracking-wider text-slate-900 ml-1">{label}</label>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
        <input 
          required 
          {...props} 
          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-[#D32F2F]/10 focus:border-[#D32F2F] text-black font-black placeholder:text-slate-400 transition-all outline-none" 
        />
      </div>
    </div>
  );
}

function SelectField({ label, icon: Icon, children, ...props }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-black uppercase tracking-wider text-slate-900 ml-1">{label}</label>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
        <select 
          required 
          {...props} 
          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-[#D32F2F]/10 text-black font-black appearance-none outline-none cursor-pointer"
        >
          {children}
        </select>
      </div>
    </div>
  );
}