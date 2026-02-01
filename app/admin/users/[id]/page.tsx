"use client";
import React, { useEffect, useState, use } from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, MapPin, Calendar, Mail, 
  Phone, Heart, ArrowLeft, BadgeCheck 
} from "lucide-react";
import Link from "next/link";

export default function ViewUser({ params }: { params: Promise<{ id: string }> }) {
    const unwrappedParams = use(params);
    const id = unwrappedParams.id;

    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // Using your environment variable and the token from local storage
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) setUser(data.user);
        })
        .catch(err => console.error("Fetch error:", err));
    }, [id]);

    if (!user) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="animate-pulse text-rose-500 font-bold uppercase tracking-[0.3em]">
                Retrieving Profile...
            </div>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Navigation Header */}
            <div className="flex items-center justify-between mb-8">
                <Link href="/admin/users" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-widest">Back to Registry</span>
                </Link>
                <div className="flex gap-3">
                    <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10 transition-all">
                        EDIT ACCOUNT
                    </button>
                    <button className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold hover:bg-rose-500 hover:text-white transition-all">
                        SUSPEND
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Visual Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-1 space-y-6"
                >
                    <div className="relative group">
                        <div className="aspect-[3/4] rounded-[32px] overflow-hidden bg-[#111] border border-white/5">
                            {user.profilePicture ? (
                                <img 
                                    src={`${process.env.NEXT_PUBLIC_API_URL}${user.profilePicture}`} 
                                    alt={user.fullName}
                                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-800 uppercase font-black text-6xl">
                                    {user.fullName.charAt(0)}
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                        </div>
                        <div className="absolute bottom-6 left-6">
                            <h2 className="text-2xl font-black text-white">{user.fullName}</h2>
                            <p className="text-rose-400 font-bold text-xs flex items-center gap-1 uppercase tracking-tighter">
                                <BadgeCheck size={14} /> Official Member
                            </p>
                        </div>
                    </div>

                    <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-[24px]">
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-4">Meta Information</p>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-400">Status</span>
                                <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold border border-green-500/20">ACTIVE</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-400">Member Since</span>
                                <span className="text-xs text-white font-mono">{new Date(user.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Details Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-2 space-y-6"
                >
                    <div className="bg-[#0A0A0A] border border-white/5 p-10 rounded-[40px] relative overflow-hidden">
                        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-rose-500/5 rounded-full blur-[100px]" />
                        
                        <h3 className="text-xs font-bold text-rose-500 uppercase tracking-[0.2em] mb-8">Personal Records</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                            <InfoBlock icon={Mail} label="Email Address" value={user.email} />
                            <InfoBlock icon={Phone} label="Contact Number" value={user.phone} />
                            <InfoBlock icon={Calendar} label="Date of Birth" value={new Date(user.dob).toDateString()} />
                            <InfoBlock icon={Heart} label="Gender Preference" value={user.gender} />
                        </div>

                        <div className="mt-12 pt-10 border-t border-white/5">
                            <p className="text-[10px] text-gray-600 font-mono mb-2 uppercase">Internal System UID</p>
                            <code className="text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-md">{id}</code>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

function InfoBlock({ icon: Icon, label, value }: any) {
    return (
        <div className="flex items-start gap-4">
            <div className="p-3 bg-white/5 rounded-2xl">
                <Icon size={20} className="text-rose-400" />
            </div>
            <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">{label}</p>
                <p className="text-lg font-medium text-white">{value}</p>
            </div>
        </div>
    );
}