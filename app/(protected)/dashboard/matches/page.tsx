"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/api/axios";
import Link from "next/link";
import { API } from "@/lib/api/endpoints";
import {
  Search,
  MessageCircle,
  Heart,
  Sparkles,
  ChevronRight,
  User
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getImageUrl } from "@/lib/utils/image";

export default function MatchesPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const whoami = await axios.get(API.AUTH.WHOAMI);
        setCurrentUserId(whoami.data.data?._id);

        const res = await axios.get(API.MATCH.MATCHES);
        setMatches(res.data.data || []);
      } catch (error) {
        console.error("Error fetching matches:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500">
            <Heart className="w-8 h-8 fill-current" />
          </div>
          <p className="font-black text-rose-500 italic uppercase text-xs tracking-widest">Finding your sparks...</p>
        </motion.div>
      </div>
    );
  }

  const uniqueMatches = matches.reduce((acc: any[], m) => {
    const otherUser =
      currentUserId && m.fromUser?._id === currentUserId
        ? m.toUser
        : m.fromUser;

    if (!otherUser) return acc;

    if (!acc.find((item) => item.otherUser._id === otherUser._id)) {
      acc.push({ ...m, otherUser });
    }
    return acc;
  }, []);

  const filteredMatches = uniqueMatches.filter(m =>
    m.otherUser?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-2xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-4xl font-black text-gradient italic tracking-tighter">Your Matches</h2>
          <p className="text-[var(--text-secondary)] font-medium">Messages from your potential soulmates.</p>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] group-focus-within:text-rose-500 transition-colors" />
          <input
            type="text"
            placeholder="Search matches..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-modern pl-12 h-14"
          />
        </div>
      </div>

      {uniqueMatches.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-premium p-12 text-center flex flex-col items-center gap-6"
        >
          <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500">
            <Sparkles className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black">No Sparks Yet!</h3>
            <p className="text-sm text-[var(--text-secondary)] font-medium">Keep discovering new people. Your next big connection is just a swipe away.</p>
          </div>
          <Link href="/dashboard/discover" className="btn-primary w-full">
            Start Discovering
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-10">
          {/* New Matches Horizontal Scroll */}
          <section className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xs font-black uppercase text-[var(--text-secondary)] tracking-widest flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-rose-500" /> New Matches
              </h3>
              <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full">{uniqueMatches.length}</span>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar px-1">
              {uniqueMatches.map((m, idx) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  key={m._id}
                >
                  <Link
                    href={`/dashboard/chat/${m.otherUser._id}`}
                    className="shrink-0 flex flex-col items-center gap-2 group"
                  >
                    <div className="relative">
                      <div className="w-24 h-32 rounded-3xl overflow-hidden border-2 border-rose-500/30 group-hover:border-rose-500 transition-all shadow-lg group-hover:shadow-rose-500/20 group-hover:scale-105 duration-300">
                        <img
                          src={getImageUrl(m.otherUser?.photos?.[0])}
                          className="w-full h-full object-cover"
                          alt={m.otherUser?.fullName}
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center border-2 border-white text-white">
                        <Heart className="w-3 h-3 fill-current" />
                      </div>
                    </div>
                    <span className="text-xs font-black text-[var(--text-main)] group-hover:text-rose-500 transition-colors w-24 text-center truncate italic">
                      {m.otherUser?.fullName?.split(" ")[0]}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Conversations List */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 px-2">
              <h3 className="text-xs font-black uppercase text-[var(--text-secondary)] tracking-widest flex items-center gap-2">
                <MessageCircle className="w-3 h-3 text-rose-500" /> Recent Messages
              </h3>
            </div>

            <div className="space-y-3">
              <AnimatePresence>
                {filteredMatches.map((m, idx) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                    key={`chat-${m._id}`}
                  >
                    <Link
                      href={`/dashboard/chat/${m.otherUser._id}`}
                      className="flex items-center gap-4 p-4 card-premium hover:bg-rose-500/5 hover:-translate-y-1 transition-all group"
                    >
                      <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md">
                        <img
                          src={getImageUrl(m.otherUser?.photos?.[0])}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          alt={m.otherUser?.fullName}
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-[var(--text-main)] group-hover:text-rose-500 transition-colors">
                          {m.otherUser?.fullName}
                        </h4>
                        <p className="text-xs text-[var(--text-secondary)] group-hover:text-[var(--text-main)]/60 transition-colors font-medium">
                          Say something nice! Hand-picked for you...
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="w-2 h-2 bg-rose-500 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                        <ChevronRight className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-rose-500 group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
                {filteredMatches.length === 0 && searchQuery && (
                  <div className="text-center py-10">
                    <p className="text-[var(--text-secondary)] font-bold italic tracking-tighter">No matches found for &quot;{searchQuery}&quot;</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
