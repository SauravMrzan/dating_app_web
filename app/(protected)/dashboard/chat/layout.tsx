"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import axios from "@/lib/api/axios";
import { API } from "@/lib/api/endpoints";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { friendId } = useParams();
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [myUserId, setMyUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const whoami = await axios.get(API.AUTH.WHOAMI);
        setMyUserId(whoami.data.data?._id);

        const res = await axios.get(API.MATCH.MATCHES);
        setMatches(res.data.data || []);
      } catch (err) {
        console.error("❌ Failed to fetch matches:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  // Deduplicate matches
  const uniqueMatches = matches.reduce((acc: any[], m) => {
    const otherUser =
      myUserId && m.fromUser?._id === myUserId ? m.toUser : m.fromUser;
    if (!otherUser) return acc;
    if (!acc.find((item) => item.otherUser._id === otherUser._id)) {
      acc.push({ ...m, otherUser });
    }
    return acc;
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="hidden md:block w-64 bg-gray-100 border-r overflow-y-auto">
        <div className="p-4 font-bold text-lg border-b">Your Matches</div>
        {loading ? (
          <div className="p-4 text-gray-500 italic">Loading matches...</div>
        ) : uniqueMatches.length === 0 ? (
          <div className="p-4 text-gray-400 italic">No matches yet</div>
        ) : (
          <ul>
            {uniqueMatches.map((m) => (
              <li key={m._id}>
                <Link
                  href={`/dashboard/chat/${m.otherUser._id}`}
                  className={`flex items-center gap-3 p-3 hover:bg-gray-200 transition ${
                    friendId === m.otherUser._id ? "bg-gray-300 font-bold" : ""
                  }`}
                >
                  <img
                    src={
                      m.otherUser?.photos?.[0]
                        ? `${process.env.NEXT_PUBLIC_API_URL}/${m.otherUser.photos[0]}`
                        : "/default-avatar.png"
                    }
                    alt={m.otherUser?.fullName || "Match"}
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                  <span>{m.otherUser?.fullName || "Unknown"}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </aside>

      {/* Main chat content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
