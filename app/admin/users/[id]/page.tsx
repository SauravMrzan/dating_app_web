"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, Shield, Calendar, Mail, 
  Hash, User as UserIcon, Edit, Trash2, 
  BadgeCheck, Clock, Loader2
} from "lucide-react";
import axiosInstance from "@/lib/api/axios";
import { API } from "@/lib/api/endpoints";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function UserDetailPage() {
  const params = useParams();
  const id = params?.id as string; // Ensure id is cast to string
  const router = useRouter();
  
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Use the API base URL for images
  const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get(`${API.ADMIN.USERS}/${id}`);
        // Handle both possible response structures
        setUser(res.data.user || res.data);
      } catch (err) {
        console.error("Detail Fetch Error:", err);
        toast.error("Could not load user details");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchUser();
  }, [id]);

  // Use the shared handleDelete from your actions if possible, 
  // or define locally for quick feedback:
  const onDelete = async () => {
    if (!confirm("Are you sure? This action cannot be undone.")) return;
    try {
      await axiosInstance.delete(`${API.ADMIN.USERS}/${id}`);
      toast.success("User deleted successfully");
      router.push("/admin/users");
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <Loader2 className="animate-spin text-[#D32F2F]" size={32} />
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Syncing Data...</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <button 
          onClick={() => router.push("/admin/users")}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-[#D32F2F] transition-colors"
        >
          <ArrowLeft size={16} /> Back to Directory
        </button>
        <div className="flex gap-2">
          <Link 
            href={`/admin/users/${id}/edit`}
            className="p-2.5 bg-gray-50 text-gray-600 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all border border-gray-100"
          >
            <Edit size={18} />
          </Link>
          <button 
            onClick={onDelete}
            className="p-2.5 bg-gray-50 text-gray-600 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all border border-gray-100"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: Identity Card */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden h-fit">
          <div className="h-24 bg-[#D32F2F]/5" />
          <div className="px-8 pb-8 -mt-12 text-center">
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-2xl border-4 border-white bg-gray-100 overflow-hidden shadow-lg mx-auto">
                {user?.profilePicture ? (
                  <img 
                    src={user.profilePicture.startsWith('http') ? user.profilePicture : `${IMAGE_BASE_URL}${user.profilePicture}`} 
                    alt={user.fullName} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50">
                    <UserIcon size={40} className="text-gray-300" />
                  </div>
                )}
              </div>
              <div className="absolute bottom-1 right-1 bg-green-500 border-2 border-white w-5 h-5 rounded-full" />
            </div>
            
            <h2 className="mt-4 text-2xl font-black text-gray-900 tracking-tight">{user?.fullName}</h2>
            <p className="text-xs font-bold text-[#D32F2F] uppercase tracking-[0.2em] mb-4">
              System ID: {id?.toString().slice(-6).toUpperCase()}
            </p>

            <div className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
              <Shield size={14} className="text-gray-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">
                {user?.role || 'User'} Level Access
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Technical Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
               <Hash size={16} className="text-[#D32F2F]" /> Account Metadata
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <DetailItem label="Full Legal Name" value={user?.fullName} icon={<UserIcon size={16}/>} />
              <DetailItem label="Verified Email" value={user?.email} icon={<Mail size={16}/>} />
              <DetailItem label="Date of Birth" value={user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not Provided'} icon={<Calendar size={16}/>} />
              <DetailItem label="Database ID" value={id} icon={<Hash size={16}/>} isCode />
              <DetailItem label="Registration Date" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'} icon={<Clock size={16}/>} />
              <DetailItem label="Account Status" value="Active / Verified" icon={<BadgeCheck size={16}/>} />
            </div>
          </div>

          {/* Safety & Logs Section */}
          <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40 mb-4">Safety & Logs</h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Account created via Admin Dashboard. No security flags detected. Current status: <strong>Clear</strong>.
            </p>
            <div className="mt-6 flex gap-4">
              <button className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                Download Logs
              </button>
              <button className="px-6 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                Restrict User
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-component remains the same, but ensuring value is treated as string
function DetailItem({ label, value, icon, isCode = false }: { label: string, value: any, icon: React.ReactNode, isCode?: boolean }) {
  return (
    <div className="space-y-1.5">
      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
        {icon} {label}
      </p>
      <div className={`text-sm font-bold text-gray-800 ${isCode ? 'font-mono text-[10px] bg-gray-50 px-2 py-1 rounded border border-gray-100 break-all' : ''}`}>
        {value || "—"}
      </div>
    </div>
  );
}