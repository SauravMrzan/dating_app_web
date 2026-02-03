    "use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  User as UserIcon, Mail, Heart, MapPin, 
  Edit3, Camera, ChevronLeft, Sparkles, Flame, 
  CheckCircle2, Loader2, Zap, Fingerprint, 
  TrendingUp, Users, Target, MessageSquare
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function DatingProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || loading) {
    return (
      <div className="h-screen w-full bg-[#0B0C10] flex flex-col items-center justify-center gap-4">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Heart className="text-[#D4FF33]" size={40} fill="currentColor" />
        </motion.div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Loading Vibe...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0C10] text-white selection:bg-[#D4FF33] selection:text-black pb-20 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#5D44F8]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#D4FF33]/5 rounded-full blur-[120px]" />
      </div>

      {/* --- TOP NAVIGATION --- */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="p-6 flex items-center justify-between max-w-7xl mx-auto relative z-10"
      >
        <motion.button 
          onClick={() => router.push('/dashboard')}
          whileHover={{ x: -4 }}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-[#D4FF33] transition-colors"
        >
          <ChevronLeft size={16} /> 
          <span>Explore Matches</span>
        </motion.button>
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-2xl border border-white/10 shadow-lg">
          <Flame size={14} className="text-[#D4FF33]" />
          <span className="text-[10px] font-black uppercase tracking-widest">
            Level {user?.level || '1'} Member
          </span>
        </div>
      </motion.nav>

      <main className="max-w-7xl mx-auto px-6 mt-4 relative z-10">
        
        {/* --- PROFILE HERO CARD --- */}
        <motion.section 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative mb-12"
        >
          <div className="relative bg-gradient-to-br from-[#111218] to-[#0B0C10] border border-white/10 rounded-[3rem] p-8 md:p-16 overflow-hidden">
            
            <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
              
              {/* Profile Photo (3:4 Aspect Ratio for Dating) */}
              <div className="relative group/avatar">
                <div className="relative w-48 h-64 sm:w-56 sm:h-72 bg-[#161920] border-2 border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl transition-transform duration-500 group-hover/avatar:scale-[1.02]">
                  {user?.profilePicture ? (
                    <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <UserIcon size={60} className="text-gray-800" />
                    </div>
                  )}
                  
                  <Link 
                    href="/user/update-profile" 
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-all flex flex-col items-center justify-center gap-2 backdrop-blur-sm"
                  >
                    <Camera size={24} className="text-[#D4FF33]" />
                    <span className="text-[9px] font-black uppercase">Refresh Vibe</span>
                  </Link>
                </div>
                {/* Active Status Badge */}
                <div className="absolute -bottom-2 -right-2 bg-[#D4FF33] text-black p-3 rounded-2xl shadow-xl">
                  <Zap size={16} fill="black" />
                </div>
              </div>

              {/* Identity & Bio */}
              <div className="flex-1 text-center lg:text-left">
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-6">
                  <span className="px-4 py-1.5 bg-[#D4FF33] text-black text-[9px] font-black uppercase tracking-widest rounded-full">
                    Most Popular
                  </span>
                  <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-gray-400 text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Heart size={12} className="text-red-500 fill-red-500" />
                    94% Match Rate
                  </span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-4 leading-none">
                  {user?.fullName || "New Member"}
                  <span className="text-[#D4FF33]">.</span>
                </h1>
                
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-gray-400 mb-8">
                  <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                    <MapPin size={16} className="text-[#5D44F8]" />
                    <span className="text-[12px] font-bold uppercase tracking-wider">San Francisco, CA</span>
                  </div>
                </div>

                <Link 
                  href="/user/update-profile"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-[#D4FF33] transition-all active:scale-95 shadow-xl"
                >
                  <Edit3 size={18} /> 
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
        </motion.section>

        {/* --- STATS & BIO GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            {/* Dating Stats */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-[#111218] border border-white/10 rounded-[3rem] p-10 shadow-xl"
            >
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-500 mb-8 flex items-center gap-3">
                <Target size={18} className="text-[#D4FF33]" />
                Profile Performance
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <StatItem label="Total Likes" value="842" />
                <StatItem label="Matches" value="24" />
                <StatItem label="Vibe Score" value="9.8" />
                <StatItem label="Spark" value="High" />
              </div>
            </motion.div>

            {/* About Section */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-[#111218] border border-white/10 rounded-[3rem] p-10 shadow-xl"
            >
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-500 mb-6 flex items-center gap-3">
                <MessageSquare size={18} className="text-[#5D44F8]" />
                The Story
              </h3>
              <p className="text-gray-400 leading-relaxed text-[16px] font-medium">
                {user?.bio || "No bio added yet. Add a bio to tell potential matches more about yourself and what you're looking for!"}
              </p>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-[#5D44F8] to-[#3a28b3] rounded-[3rem] p-10 text-center shadow-2xl relative overflow-hidden"
            >
              <Sparkles size={40} className="text-[#D4FF33] mx-auto mb-6" />
              <h4 className="text-xl font-black uppercase italic tracking-widest mb-2">Power User</h4>
              <p className="text-[10px] text-white/60 uppercase font-bold tracking-[0.2em]">
                Your profile is in the top 5% of your area
              </p>
            </motion.div>

            <div className="bg-[#111218] border border-white/10 rounded-[3rem] p-8">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#D4FF33]" /> Trust Score
              </h4>
              <div className="space-y-4">
                <VerificationRow label="Identity Verified" active={true} />
                <VerificationRow label="Phone Linked" active={true} />
                <VerificationRow label="Social Connect" active={false} />
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

function StatItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
      <p className="text-[9px] font-black uppercase tracking-widest text-gray-600 mb-1">{label}</p>
      <p className="text-2xl font-black italic text-white tracking-tighter">{value}</p>
    </div>
  );
}

function VerificationRow({ label, active }: { label: string, active: boolean }) {
  return (
    <div className={`flex items-center justify-between p-4 rounded-2xl ${active ? 'bg-white/5' : 'opacity-30'}`}>
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      {active && <CheckCircle2 size={14} className="text-[#D4FF33]" />}
    </div>
  );
}