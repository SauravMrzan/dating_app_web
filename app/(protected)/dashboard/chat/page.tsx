"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/api/axios";
import { API } from "@/lib/api/endpoints";

export default function ChatHubRedirect() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axios.get(API.MATCH.MATCHES);
        const matches = res.data.data || [];

        if (matches.length > 0) {
          const firstMatch = matches[0];
          const friendId = firstMatch.fromUser?._id || firstMatch.toUser?._id;

          router.replace(`/dashboard/chat/${friendId}`);
        } else {
          router.replace("/dashboard/matches");
        }
      } catch (err) {
        console.error("❌ Failed to fetch matches:", err);
        router.replace("/dashboard/matches");
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center text-gray-500 italic">
      {loading ? "Loading chat hub..." : "Redirecting..."}
    </div>
  );
}

