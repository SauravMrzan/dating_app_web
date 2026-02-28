"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/api/axios";
import Link from "next/link";
import { API } from "@/lib/api/endpoints"; // centralized endpoints

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ matches: 0, messages: 0, views: 0 });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(API.AUTH.WHOAMI);
        setUser(res.data.data);

        // Placeholder stats - in a real app, fetch from backend
        setStats({ matches: 12, messages: 5, views: 124 });
      } catch (err) {
        console.error("Failed to load user", err);
      }
    };
    fetchUser();
  }, []);

  const cards = [
    {
      title: "Discover",
      desc: "Find new sparks nearby",
      icon: "🔥",
      link: "/dashboard/discover",
      color: "bg-rose-500",
    },
    {
      title: "Chat Hub",
      desc: "Jump back into conversations",
      icon: "💬",
      link: "/dashboard/chat", // ✅ UI route only
      color: "bg-orange-500",
    },
    {
      title: "Matches",
      desc: "View your mutual connections",
      icon: "✨",
      link: "/dashboard/matches",
      color: "bg-blue-500",
    },
    {
      title: "Settings",
      desc: "Update your vibe & security",
      icon: "⚙️",
      link: "/dashboard/settings",
      color: "bg-gray-800",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6 lg:p-10">
      {/* Welcome Header */}
      <header className="mb-10">
        <p className="text-[10px] font-black uppercase tracking-[3px] text-rose-500 mb-2">
          Dashboard Overview
        </p>
        <h1 className="text-5xl font-black italic tracking-tighter text-black uppercase">
          Yo, {user?.fullName?.split(" ")[0] || "Explorer"}!
        </h1>
        <p className="text-gray-400 font-medium mt-2">
          Ready for some activity-based learning today?
        </p>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { label: "Matches", val: stats.matches },
          { label: "Messages", val: stats.messages },
          { label: "Profile Views", val: stats.views },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-4xl shadow-sm border border-gray-100"
          >
            <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">
              {stat.label}
            </p>
            <p className="text-2xl font-black text-black mt-1">{stat.val}</p>
          </div>
        ))}
      </div>

      {/* Action Grid */}
      <h3 className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 mb-6 px-2">
        Quick Actions
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card, i) => (
          <Link key={i} href={card.link}>
            <div className="group relative bg-white p-8 rounded-[40px] shadow-xl shadow-gray-200/50 border border-transparent hover:border-rose-100 transition-all hover:-translate-y-1 overflow-hidden">
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <div
                    className={`w-12 h-12 ${card.color} text-white rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-lg shadow-inherit`}
                  >
                    {card.icon}
                  </div>
                  <h2 className="text-2xl font-black text-black mb-1">
                    {card.title}
                  </h2>
                  <p className="text-gray-400 text-sm font-medium">
                    {card.desc}
                  </p>
                </div>
                <div className="text-gray-200 group-hover:text-rose-500 transition-colors">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </div>

              {/* Subtle decorative background circle */}
              <div
                className={`absolute -right-10 -bottom-10 w-40 h-40 ${card.color} opacity-[0.03] rounded-full`}
              />
            </div>
          </Link>
        ))}
      </div>

      {/* Course Progress / Tip Section */}
      <div className="mt-12 p-8 bg-black rounded-[40px] text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h4 className="text-xl font-black italic uppercase">
            Project Progress
          </h4>
          <p className="text-gray-400 text-sm font-medium mt-1">
            Complete at least 3 projects to graduate the course.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex -space-x-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full border-4 border-black bg-rose-500 flex items-center justify-center font-black text-xs"
              >
                {i}
              </div>
            ))}
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-rose-500">
            0/3 Done
          </p>
        </div>
      </div>
    </div>
  );
}
