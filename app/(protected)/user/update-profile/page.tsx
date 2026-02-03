"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, ChevronLeft, Save, Loader2, 
  User as UserIcon, Calendar, Heart, Sparkles, 
  Upload, MessageSquare, Flame, Target
} from 'lucide-react';
import { API } from '@/lib/api/endpoints';
import { setUserData } from '@/lib/cookie';
import { useAuth } from '@/context/AuthContext';

export default function UpdateDatingProfilePage() {
  const { user, checkAuth, loading: authLoading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [dob, setDob] = useState(""); 
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{type: 'error' | 'success', msg: string} | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setBio(user.bio || "");
      if (user.dob) {
        const date = new Date(user.dob).toISOString().split('T')[0];
        setDob(date);
      }
      setPreviewImage(user.profilePicture || null);
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setStatus({ type: 'error', msg: "Image too large. Max 5MB." });
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return null;
      };

      const token = getCookie('auth_token');
      if (!token) throw new Error("Session expired. Please log in again.");

      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('dob', dob);
      formData.append('bio', bio);
      if (selectedFile) formData.append('profilePicture', selectedFile);

      const response = await fetch(API.AUTH.UPDATEPROFILE, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Update failed");

      if (result.user) await setUserData(result.user);

      setStatus({ type: 'success', msg: "Profile Optimized for Matches" });
      await checkAuth(); 
      router.refresh();
      setTimeout(() => router.push('/user/profile'), 1500);
      
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted || authLoading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-[#0B0C10] text-white selection:bg-[#D4FF33] selection:text-black relative overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#5D44F8]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#D4FF33]/5 rounded-full blur-[120px]" />
      </div>

      <nav className="p-6 flex items-center justify-between border-b border-white/5 backdrop-blur-2xl sticky top-0 z-50">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-[#D4FF33] transition-colors">
          <ChevronLeft size={16} /> Back
        </button>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
          <Flame size={14} className="text-[#D4FF33]" />
          <span className="text-[9px] font-black tracking-widest text-white/70">MATCH_READY_V1</span>
        </div>
      </nav>

      <main className="max-w-xl mx-auto px-6 py-10 relative z-10">
        <header className="mb-10 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
            <h1 className="text-3xl font-black italic uppercase tracking-tighter">
              Level Up <span className="text-[#D4FF33]">Your Vibe</span>
            </h1>
          </div>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.4em]">Curate your digital presence</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* PHOTO SECTION */}
          <div className="relative group flex flex-col items-center">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative w-48 h-64 rounded-[2.5rem] overflow-hidden cursor-pointer border-2 border-white/10 group-hover:border-[#D4FF33]/50 transition-all duration-500 shadow-2xl"
            >
              {previewImage ? (
                <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-white/5 flex flex-col items-center justify-center gap-3">
                  <Camera size={32} className="text-gray-700" />
                  <span className="text-[9px] font-black text-gray-600">ADD MAIN PHOTO</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                <Upload size={24} className="text-[#D4FF33]" />
              </div>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
          </div>

          <div className="grid gap-6">
            <InputField label="Preferred Name" icon={UserIcon} value={fullName} onChange={(e: any) => setFullName(e.target.value)} />
            
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-4 flex items-center gap-2">
                <MessageSquare size={11} className="text-[#5D44F8]" /> About You
              </label>
              <textarea 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write a bio that sparks a conversation..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-[#D4FF33]/50 outline-none h-32 transition-all resize-none"
              />
            </div>

            <InputField label="Birthday" icon={Calendar} type="date" value={dob} onChange={(e: any) => setDob(e.target.value)} />
          </div>

          <AnimatePresence>
            {status && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className={`p-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest text-center ${status.type === 'success' ? 'bg-lime-500/10 border-lime-500/30 text-lime-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                {status.msg}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-5 bg-[#D4FF33] text-black rounded-2xl font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(212,255,51,0.3)] transition-all disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <><Sparkles size={18} /> Update Profile</>}
          </button>
        </form>
      </main>
    </div>
  );
}

function InputField({ label, icon: Icon, ...props }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-4 flex items-center gap-2">
        <Target size={11} className="text-[#5D44F8]" /> {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
        <input {...props} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-[#D4FF33]/50 outline-none transition-all" />
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="h-screen bg-[#0B0C10] flex flex-col items-center justify-center gap-4">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
        <Heart className="text-[#D4FF33]" size={40} fill="currentColor" />
      </motion.div>
      <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500">Finding your light...</span>
    </div>
  );
}