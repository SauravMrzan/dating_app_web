"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { handleCreateUser } from '@/lib/actions/admin/user-action';
import { 
  UserPlus, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Shield, 
  Camera,
  ArrowRight,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function CreateUserPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await handleCreateUser(formData);
      if (result.success) {
        toast.success("User created successfully!");
        router.push('/admin/users');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Create New User</h1>
        <p className="text-sm text-gray-500">Add a new member to the MannMilap platform.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture Upload Section (Multer Ready) */}
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col items-center">
          <div className="relative group cursor-pointer">
            <div className="w-32 h-32 rounded-3xl bg-gray-50 border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center transition-all group-hover:border-[#D32F2F]">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <Camera size={32} className="text-gray-300 group-hover:text-[#D32F2F]" />
              )}
            </div>
            <input 
              type="file" 
              name="profilePicture" 
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
          <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Upload Profile Photo</p>
        </div>

        {/* Form Fields */}
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-wider text-gray-700 ml-1">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-3.5 text-gray-400" size={18} />
                <input 
                  required
                  name="fullName"
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D32F2F]/20 focus:border-[#D32F2F] transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-wider text-gray-700 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-gray-400" size={18} />
                <input 
                  required
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D32F2F]/20 focus:border-[#D32F2F] transition-all"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-wider text-gray-700 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-gray-400" size={18} />
              <input 
                required
                type="password"
                name="password"
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D32F2F]/20 focus:border-[#D32F2F] transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-wider text-gray-700 ml-1">Assign Role</label>
            <div className="relative">
              <Shield className="absolute left-4 top-3.5 text-gray-400" size={18} />
              <select 
                name="role"
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D32F2F]/20 appearance-none cursor-pointer"
              >
                <option value="user">Standard User</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          </div>
        </div>

        <button 
          disabled={loading}
          type="submit"
          className="w-full py-4 bg-[#D32F2F] text-white rounded-2xl font-bold uppercase text-xs tracking-[0.2em] shadow-lg shadow-[#D32F2F]/20 hover:bg-[#B71C1C] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <>
              <CheckCircle size={18} />
              Complete Registration
            </>
          )}
        </button>
      </form>
    </div>
  );
}