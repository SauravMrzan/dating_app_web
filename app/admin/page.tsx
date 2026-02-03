"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, Users, ShieldAlert, Sparkles, 
  History, CheckCircle2, Loader2, Flame, 
  PieChart, Search
} from "lucide-react";
import axiosInstance from "@/lib/api/axios";
import { API } from "@/lib/api/endpoints";

interface DashboardData {
  stats: {
    totalUsers: number;
    newToday: number;
    activeAdmins: number;
  };
  recentActivity: Array<{
    _id: string;
    fullName: string;
    updatedAt: string;
    role: string;
  }>;
}

export default function DatingAdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get(API.ADMIN.STATS);
        setData(res.data);
      } catch (err) {
        console.error("Dating Dashboard Sync Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#050505]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="text-rose-500" size={40} />
        </motion.div>
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500">
          Syncing Global Profiles...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      {/* Brand Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-rose-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-900/20 rounded-full blur-[120px]" />
      </div>

      {/* Header Section */}
      <motion.header
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10"
      >
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 bg-gradient-to-tr from-rose-600 to-orange-500 rounded-2xl shadow-lg shadow-rose-500/20">
            <PieChart size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
              Insights
            </h1>
            <p className="text-xs text-gray-500 font-medium flex items-center gap-2">
              <Sparkles size={12} className="text-orange-400" />
              Monitoring community growth and user interactions.
            </p>
          </div>
        </div>
      </motion.header>

      {/* Metric Cards - Updated with Dating App Context */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        <MetricCard
          icon={Users}
          label="Total Profiles"
          value={data?.stats.totalUsers.toLocaleString() || "0"}
          color="#ffffff"
          delay={0.1}
        />
        <MetricCard
          icon={Flame}
          label="New Matches Today"
          value={`+${data?.stats.newToday || 0}`}
          color="#fb7185" // Rose 400
          delay={0.2}
          highlight
        />
        <MetricCard
          icon={ShieldAlert}
          label="Moderation Team"
          value={data?.stats.activeAdmins?.toString() || "0"}
          color="#ffffff"
          delay={0.3}
        />
      </div>

      {/* Recent Activity Feed */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-[#0A0A0A] border border-white/5 rounded-[32px] p-8 backdrop-blur-md relative z-10 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
            <History size={14} className="text-rose-500" />
            Live Activity Stream
          </h3>
          <Search size={16} className="text-gray-700" />
        </div>

        <div className="space-y-6">
          <AnimatePresence>
            {data?.recentActivity?.map((user, index) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className="flex items-center justify-between group py-2"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/5 to-white/10 border border-white/10 flex items-center justify-center text-xs font-bold text-gray-400">
                    {user.fullName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-200 font-semibold group-hover:text-rose-400 transition-colors">
                      {user.fullName}
                    </p>
                    <p className="text-[10px] text-gray-600 font-mono tracking-tighter">
                      ID: {user._id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className="text-[10px] font-bold text-rose-500/80 flex items-center justify-end gap-1.5 mb-1 uppercase">
                    <CheckCircle2 size={12} />
                    Verified
                  </span>
                  <p className="text-[9px] text-gray-500">
                    Last seen {new Date(user.updatedAt).toLocaleTimeString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

// Sub-component for clean organization
function MetricCard({ icon: Icon, label, value, color, delay, highlight = false }: any) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -4 }}
      className={`p-7 bg-[#0A0A0A] border border-white/5 rounded-[28px] relative overflow-hidden group ${
        highlight ? 'bg-gradient-to-br from-rose-950/20 to-transparent border-rose-500/20' : ''
      }`}
    >
      <div className="relative z-10">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-6 ${
          highlight ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40' : 'bg-white/5 text-gray-400'
        }`}>
          <Icon size={20} />
        </div>
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{label}</p>
        <h2 className="text-4xl font-black tracking-tighter" style={{ color }}>{value}</h2>
      </div>
      
      {/* Decorative background element */}
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-3xl opacity-10 ${
        highlight ? 'bg-rose-500' : 'bg-white'
      }`} />
    </motion.div>
  );
}