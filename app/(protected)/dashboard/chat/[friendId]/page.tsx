"use client";

import { useParams, useRouter } from "next/navigation";
import { useChat } from "@/lib/hooks/useChat";
import { useState, useEffect, useRef } from "react";
import axios from "@/lib/api/axios";
import { API } from "@/lib/api/endpoints";
import Link from "next/link";
import {
  ChevronLeft,
  Send,
  MoreVertical,
  Phone,
  Video,
  Info,
  Heart
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getImageUrl } from "@/lib/utils/image";

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const friendId = params.friendId as string;

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [friendUser, setFriendUser] = useState<any>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(API.AUTH.WHOAMI);
        const myId = res.data.data?._id;
        setCurrentUserId(myId);

        const matchesRes = await axios.get(API.MATCH.MATCHES);
        const matches = matchesRes.data.data || [];

        const match = matches.find(
          (m: any) =>
            m.fromUser?._id === friendId || m.toUser?._id === friendId,
        );

        if (match) {
          const otherUser =
            match.fromUser?._id === myId ? match.toUser : match.fromUser;
          setFriendUser(otherUser);
          setConversationId(match._id);
        }
      } catch (err) {
        console.error("❌ Failed to fetch user/match info:", err);
      }
    };
    fetchData();
  }, [friendId]);

  const { messages, loading, sendMessage } = useChat(
    conversationId || "",
    currentUserId || "",
  );

  const [text, setText] = useState("");

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages]);

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(text);
    setText("");
  };

  if (!conversationId || !currentUserId || loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500"
        >
          <Send className="w-8 h-8 animate-pulse" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto bg-[var(--bg-main)]">
      {/* Header */}
      <div className="glass sticky top-0 z-20 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-xl hover:bg-[var(--bg-secondary)] flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <Link href={`/dashboard/profile/${friendId}`} className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl overflow-hidden border-2 border-rose-500/20 group-hover:border-rose-500/50 transition-colors shadow-sm">
                <img
                  src={getImageUrl(friendUser?.photos?.[0])}
                  alt={friendUser?.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
            </div>
            <div>
              <h2 className="font-black text-lg text-[var(--text-main)] leading-none italic tracking-tight group-hover:text-rose-500 transition-colors">
                {friendUser?.fullName?.split(" ")[0]}
              </h2>
              <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest mt-1">Online</p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-1">
          <button className="w-10 h-10 rounded-xl hover:bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-secondary)]">
            <Phone className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-xl hover:bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-secondary)]">
            <Video className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar pb-24"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-4 opacity-50">
            <div className="w-16 h-16 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-[var(--text-secondary)]" />
            </div>
            <p className="text-sm font-bold italic tracking-tighter">It&apos;s a match! Say something cute...</p>
          </div>
        )}

        {messages.map((msg, i) => {
          const isMe = msg.fromUser?._id === currentUserId;
          const showAvatar = !isMe && (i === 0 || messages[i - 1].fromUser?._id !== msg.fromUser?._id);

          return (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              key={i}
              className={`flex ${isMe ? "justify-end" : "justify-start"} items-end gap-2`}
            >
              {!isMe && (
                <div className="w-8 h-8 flex-shrink-0">
                  {showAvatar ? (
                    <img
                      src={getImageUrl(friendUser?.photos?.[0])}
                      className="w-8 h-8 rounded-full object-cover border border-[var(--border-color)] shadow-sm"
                      alt="avatar"
                    />
                  ) : null}
                </div>
              )}

              <div className={`max-w-[75%] flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                <div
                  className={`px-4 py-2.5 rounded-[20px] text-sm font-medium shadow-sm transition-all hover:shadow-md ${isMe
                    ? "bg-gradient-primary text-white rounded-br-none"
                    : "bg-[var(--bg-secondary)] text-[var(--text-main)] rounded-bl-none border border-[var(--border-color)]"
                    }`}
                >
                  {msg.message}
                </div>
                {msg.createdAt && (
                  <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase mt-1 px-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Input */}
      <div className="fixed bottom-2 left-4 right-4 md:relative md:bottom-auto md:left-auto md:right-auto p-4 z-30">
        <div className="max-w-2xl mx-auto flex items-center gap-2 p-2 glass rounded-[28px] shadow-2xl border-2 border-white dark:border-white/5">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-4 py-2 font-medium"
          />
          <button
            onClick={handleSend}
            disabled={!text.trim()}
            className="w-11 h-11 bg-gradient-primary text-white rounded-[20px] flex items-center justify-center shadow-lg shadow-rose-500/30 active:scale-90 disabled:opacity-50 disabled:grayscale transition-all"
          >
            <Send className="w-5 h-5 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
