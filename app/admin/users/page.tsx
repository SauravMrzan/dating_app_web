"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, Filter, Search, Loader2, 
  User, Sparkles, MapPin, Cake, 
  MessageCircle, ChevronDown, X
} from "lucide-react";
import axiosInstance from "@/lib/api/axios";
import { API } from "@/lib/api/endpoints";
import Link from "next/link";

export default function DatingDiscovery() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchProfiles = async () => {
    try {
      // Assuming this endpoint returns the list of potential matches
      const res = await axiosInstance.get(API.ADMIN.USERS); 
      setProfiles(res.data.users || []);
    } catch (err) {
      console.error("Discovery Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  // Helper to calculate age from DOB string in your schema
  const calculateAge = (dobString: string) => {
    const birthDate = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const getFilteredProfiles = () => {
    let filtered = [...profiles];

    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (genderFilter !== "all") {
      filtered = filtered.filter(p => p.gender === genderFilter);
    }

    filtered.sort((a, b) => {
      if (sortBy === "age-asc") return calculateAge(a.dob) - calculateAge(b.dob);
      if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0;
    });

    return filtered;
  };

  const filtered = getFilteredProfiles();

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#0a0a0a]">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}>
          <Heart className="text-[#ff4757]" size={40} fill="#ff4757" />
        </motion.div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Finding your spark...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase flex items-center gap-3">
            Discovery <Sparkles className="text-[#D4FF33]" />
          </h1>
          <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">
            {filtered.length} Potential Matches in your area
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:border-[#ff4757]/50 outline-none transition-all"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-3 rounded-2xl border transition-all ${showFilters ? 'bg-[#ff4757] border-[#ff4757] text-white' : 'bg-white/5 border-white/10 text-gray-400'}`}
          >
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: "auto", opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl">
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-500 mb-2 block">Interested In</label>
                <select 
                  value={genderFilter} 
                  onChange={(e) => setGenderFilter(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white outline-none"
                >
                  <option value="all">Everyone</option>
                  <option value="female">Women</option>
                  <option value="male">Men</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-500 mb-2 block">Sort By</label>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white outline-none"
                >
                  <option value="newest">Newest Members</option>
                  <option value="age-asc">Younger First</option>
                </select>
              </div>
              <div className="flex items-end">
                <button 
                  onClick={() => {setGenderFilter("all"); setSearchQuery("");}}
                  className="w-full p-3 text-xs font-bold uppercase text-gray-400 hover:text-white transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Discovery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map((profile, idx) => (
            <motion.div
              key={profile._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.05 }}
              className="group relative bg-gradient-to-b from-white/10 to-white/5 border border-white/10 rounded-[2rem] overflow-hidden hover:border-[#ff4757]/50 transition-all duration-500"
            >
              {/* Profile Image Section */}
              <div className="relative h-80 overflow-hidden">
                {profile.profilePicture ? (
                  <img 
                    src={profile.profilePicture} 
                    alt={profile.fullName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#5D44F8] to-[#ff4757] flex items-center justify-center">
                    <User size={60} className="text-white/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                
                {/* Overlay Info */}
                <div className="absolute bottom-4 left-5 right-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        {profile.fullName}, {calculateAge(profile.dob)}
                      </h3>
                      <p className="text-gray-300 text-xs flex items-center gap-1 mt-1 uppercase tracking-tighter">
                        <MapPin size={12} className="text-[#ff4757]" /> 2 miles away
                      </p>
                    </div>
                    <motion.button 
                      whileTap={{ scale: 0.8 }}
                      className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-[#ff4757] hover:border-[#ff4757] transition-all"
                    >
                      <Heart size={20} fill="currentColor" />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 flex gap-2">
                <Link 
                  href={`/user/profile/${profile._id}`}
                  className="flex-1 py-3 rounded-2xl bg-white/5 text-white text-[10px] font-black uppercase tracking-widest text-center hover:bg-white/10 transition-colors"
                >
                  View Profile
                </Link>
                <button className="p-3 rounded-2xl bg-[#ff4757]/10 text-[#ff4757] hover:bg-[#ff4757] hover:text-white transition-all">
                  <MessageCircle size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="py-20 text-center">
          <div className="inline-flex p-6 rounded-full bg-white/5 mb-4">
            <X size={40} className="text-gray-700" />
          </div>
          <p className="text-gray-500 uppercase italic tracking-widest">No one new in your area. Try adjusting filters!</p>
        </div>
      )}
    </div>
  );
}