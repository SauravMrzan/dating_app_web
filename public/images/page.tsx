"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "@/lib/api/axios";
import socket from "@/lib/socket";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function MatchPage() {
  const { matchId } = useParams(); // dynamic route param
  const { user } = useAuth();
  const [matches, setMatches] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [text, setText] = useState("");

  useEffect(() => {
    // Fetch all matches
    axios.get("/api/match/matches").then(res => setMatches(res.data.data));

    // Fetch chat history
    axios.get(`/api/chat/${matchId}`).then(res => setMessages(res.data.data));

    // Fetch profile of selected match
    axios.get(`/api/admin/users/${matchId}`).then(res => setProfile(res.data.user));

    // Join room for real-time chat
    socket.emit("joinRoom", { roomId: matchId });

    socket.on("newMessage", msg => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.off("newMessage");
    };
  }, [matchId]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    await axios.post("/api/chat/send", { toUserId: matchId, message: text });
    setText("");
  };

  // Deduplicate matches
  const uniqueMatches = matches.reduce((acc: any[], m) => {
    const otherUser = user && m.fromUser._id === user.id ? m.toUser : m.fromUser;
    if (!otherUser) return acc;
    if (!acc.find(item => item._id === otherUser._id)) acc.push(otherUser);
    return acc;
  }, []);

  // Helper: time since matched
  const timeSinceMatch = (date: string) => {
    const diffMs = Date.now() - new Date(date).getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) return "Just now";
    if (diffHours === 1) return "1 hour ago";
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  return (
    <div className="flex h-screen">
      {/* Left: Matches list */}
      <aside className="w-1/4 border-r overflow-y-auto bg-gray-50">
        <h2 className="p-4 font-bold text-lg">Matches</h2>
        {uniqueMatches.map(otherUser => (
          <Link
            key={otherUser._id}
            href={`/matches/${otherUser._id}/chat`}
            className={`flex items-center gap-3 px-3 py-2 hover:bg-gray-200 transition ${
              otherUser._id === matchId ? "bg-gray-300 font-semibold" : ""
            }`}
          >
            <img
              src={
                otherUser.photos?.[0]
                  ? `${process.env.NEXT_PUBLIC_API_URL}/${otherUser.photos[0]}`
                  : "/default-avatar.png"
              }
              alt={otherUser.fullName}
              className="w-10 h-10 rounded-full"
            />
            <span>{otherUser.fullName}</span>
          </Link>
        ))}
      </aside>

      {/* Center: Chat */}
      <main className="w-2/4 flex flex-col">
        <div className="border-b p-4">
          {profile && (
            <p className="text-sm text-gray-500">
              You matched with {profile.fullName} on{" "}
              {new Date(profile.createdAt).toLocaleDateString()} (
              {timeSinceMatch(profile.createdAt)})
            </p>
          )}
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((msg, i) => (
            <div key={i} className="mb-2">
              <p>
                <strong>{msg.fromUser.fullName}</strong>: {msg.message}
              </p>
              {msg.createdAt && (
                <span className="text-xs text-gray-400">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="p-2 flex border-t">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            className="flex-1 border p-2"
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Send
          </button>
        </div>
      </main>

      {/* Right: Profile */}
      <aside className="w-1/4 border-l p-4 bg-gray-50">
        {profile && (
          <>
            <img
              src={
                profile.photos?.[0]
                  ? `${process.env.NEXT_PUBLIC_API_URL}/${profile.photos[0]}`
                  : "/default-avatar.png"
              }
              alt={profile.fullName}
              className="w-32 h-32 rounded-full mx-auto"
            />
            <h2 className="text-xl font-bold text-center mt-2">{profile.fullName}</h2>
            <p className="text-center text-gray-600">{profile.bio || "No bio yet"}</p>
          </>
        )}
      </aside>
    </div>
  );
}
