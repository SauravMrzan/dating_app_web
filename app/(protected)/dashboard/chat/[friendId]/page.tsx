"use client";

import { useParams } from "next/navigation";
import { useChat } from "@/lib/hooks/useChat";
import { useState, useEffect, useRef } from "react";
import axios from "@/lib/api/axios";
import { API } from "@/lib/api/endpoints";
import Link from "next/link";

export default function ChatPage() {
  const params = useParams();
  const friendId = params.friendId as string;

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [friendUser, setFriendUser] = useState<any>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ Get current user
        const res = await axios.get(API.AUTH.WHOAMI);
        const myId = res.data.data?._id;
        setCurrentUserId(myId);

        // ✅ Get matches
        const matchesRes = await axios.get(API.MATCH.MATCHES);
        const matches = matchesRes.data.data || [];

        // ✅ Find the match with this friend
        const match = matches.find(
          (m: any) =>
            m.fromUser?._id === friendId || m.toUser?._id === friendId,
        );

        if (match) {
          const otherUser =
            match.fromUser?._id === myId ? match.toUser : match.fromUser;
          setFriendUser(otherUser);
          setConversationId(match._id); // ✅ shared conversation ID
        }
      } catch (err) {
        console.error("❌ Failed to fetch user/match info:", err);
      }
    };
    fetchData();
  }, [friendId]);

  // ✅ Always call useChat with conversationId
  const { messages, loading, sendMessage } = useChat(
    conversationId || "",
    currentUserId || "",
  );

  const [text, setText] = useState("");

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(text);
    setText("");
  };

  if (!conversationId) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 text-slate-400 animate-pulse">
        Loading chat...
      </div>
    );
  }

  if (!currentUserId || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 text-slate-400 animate-pulse">
        Syncing chat...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="px-6 py-4 bg-white border-b flex items-center gap-3 shadow-sm sticky top-0 z-10">
        <img
          src={
            friendUser?.photos?.[0]
              ? `${process.env.NEXT_PUBLIC_API_URL}/${friendUser.photos[0]}`
              : "/default-avatar.png"
          }
          alt={friendUser?.fullName || "Match"}
          className="w-10 h-10 rounded-full object-cover border"
        />
        <h2 className="font-semibold text-slate-800 tracking-tight">
          {friendUser?.fullName || "Direct Message"}
        </h2>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-linear-to-b from-gray-100 to-gray-50"
      >
        {messages.map((msg, i) => {
          const isMe = msg.fromUser?._id === currentUserId;
          const sender = msg.fromUser;

          return (
            <div
              key={i}
              className={`flex ${isMe ? "justify-end" : "justify-start"} items-start gap-2`}
            >
              {!isMe && (
                <img
                  src="/default-avatar.png"
                  alt={sender?.fullName || "User"}
                  className="w-8 h-8 rounded-full object-cover border"
                />
              )}
              <div className="max-w-[70%]">
                {!isMe && (
                  <div className="text-xs text-slate-500 mb-1">
                    {sender?.fullName || "Unknown"}
                  </div>
                )}
                <div
                  className={`px-4 py-2 rounded-2xl text-sm shadow-sm ${
                    isMe
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white text-slate-700 border rounded-bl-none"
                  }`}
                >
                  {msg.message}
                </div>
                <div className="text-[10px] text-gray-400 mt-1">
                  {msg.createdAt
                    ? new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t sticky bottom-0">
        <div className="flex gap-2 items-center bg-slate-100 rounded-full px-4 py-2 border border-slate-200 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-black placeholder-gray-400"
          />
          <button
            onClick={handleSend}
            className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
