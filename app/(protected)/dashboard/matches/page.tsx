"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/api/axios";
import Link from "next/link";
import { API } from "@/lib/api/endpoints"; // centralized endpoints

export default function MatchesPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user
        const whoami = await axios.get(API.AUTH.WHOAMI);
        setCurrentUserId(whoami.data.data?._id);

        // Get matches
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
      <div className="flex h-screen items-center justify-center bg-white font-black text-rose-500 italic">
        LOADING YOUR MATCHES...
      </div>
    );
  }

  // Deduplicate matches
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

  return (
    <div className="min-h-screen bg-white">
      <div className="px-6 pt-10 pb-6">
        <h1 className="text-4xl font-black italic tracking-tighter text-black">
          Matches
        </h1>
        <div className="h-1 w-12 bg-rose-500 mt-2 rounded-full"></div>
      </div>

      {uniqueMatches.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 px-10 text-center">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-4xl mb-6 shadow-inner">
            ✨
          </div>
          <h3 className="text-black font-black text-xl">No Sparks Yet!</h3>
          <p className="text-gray-400 text-sm mt-2">
            Keep discovering new people. Your next big connection is just a
            swipe away.
          </p>
          <Link
            href="/dashboard/discover"
            className="mt-8 bg-black text-white px-8 py-3 rounded-2xl font-black text-xs tracking-widest uppercase hover:scale-105 transition-all"
          >
            Start Discovering
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          <section>
            <div className="px-6 mb-4">
              <h3 className="text-[10px] font-black uppercase tracking-[2px] text-gray-400">
                New Matches
              </h3>
            </div>
            <div className="flex gap-4 overflow-x-auto px-6 no-scrollbar">
              {uniqueMatches.map((m) => (
                <Link
                  key={m._id}
                  href={`/dashboard/chat/${m.otherUser._id}`} // ✅ updated route
                  className="shrink-0 group"
                >
                  <div className="relative">
                    <img
                      src={
                        m.otherUser?.photos?.[0]
                          ? `${process.env.NEXT_PUBLIC_API_URL}/${m.otherUser.photos[0]}`
                          : "/default-avatar.png"
                      }
                      className="w-20 h-28 object-cover rounded-[20px] border-2 border-rose-500 p-0.5 group-hover:scale-105 transition-all shadow-lg"
                      alt={m.otherUser?.fullName || "Match"}
                    />
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white px-2 py-0.5 rounded-md shadow-md">
                      <p className="text-[10px] font-black text-black truncate w-14 text-center">
                        {m.otherUser?.fullName
                          ? m.otherUser.fullName.split(" ")[0]
                          : "Unknown"}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
