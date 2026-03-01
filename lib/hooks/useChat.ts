"use client";

import { useEffect, useState, useRef } from "react";
import axios from "@/lib/api/axios";
import { API } from "@/lib/api/endpoints";
import { io, Socket } from "socket.io-client";

export interface ChatMessage {
  _id?: string;
  fromUser?: {
    _id?: string;
    fullName?: string;
  };
  toUser?: {
    _id?: string;
    fullName?: string;
  };
  message: string;
  createdAt?: string;
}

export function useChat(conversationId: string, currentUserId?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef<Socket | null>(null);

  // 1. Fetch existing messages via REST
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (!conversationId || conversationId === "whoami") return;

        const res = await axios.get(`${API.CHAT.BASE}/${conversationId}`);
        setMessages(res.data.data || []);
      } catch (err) {
        console.error("❌ Failed to fetch messages:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [conversationId]);

  // 2. Connect to socket.io
  useEffect(() => {
    if (!conversationId || !currentUserId) return;

    // Use consistent backend URL
    const socketUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:5000";

    console.log("🔌 Connecting to socket at:", socketUrl);

    const socket = io(socketUrl, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
      withCredentials: true, // Crucial for session-based auth
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      // Join shared conversation room
      socket.emit("joinRoom", { roomId: conversationId });
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err);
    });

    socket.on("newMessage", (msg: ChatMessage) => {
      console.log("📩 Received new message via socket:", msg);

      setMessages((prev) => {
        // Prevent duplicate messages
        const exists = prev.some(m =>
          (m._id && msg._id && m._id === msg._id) ||
          (m.message === msg.message &&
            m.fromUser?._id === msg.fromUser?._id &&
            Math.abs(new Date(m.createdAt || 0).getTime() - new Date(msg.createdAt || 0).getTime()) < 2000)
        );

        if (exists) {
          console.log("♻️ Duplicate message ignored");
          return prev;
        }
        return [...prev, msg];
      });
    });

    socket.on("error", (errMsg: string) => {
      console.error("❌ Socket error:", errMsg);
    });

    return () => {
      console.log("🔌 Disconnecting socket...");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [conversationId, currentUserId]);

  // 3. Send message via REST + socket
  const sendMessage = async (text: string) => {
    if (!text.trim() || !currentUserId || !conversationId) return;

    // Optimistic update
    const tempId = `temp-${Date.now()}`;
    const optimisticMsg: ChatMessage = {
      _id: tempId,
      fromUser: { _id: currentUserId, fullName: "You" },
      message: text,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      // ✅ REST call to save message (Server will broadcast newMessage to everyone in room)
      const res = await axios.post(`${API.CHAT.BASE}/send`, {
        conversationId,
        message: text,
      });

      const savedMsg = res.data.data;

      // Replace optimistic message with saved message from server
      if (savedMsg) {
        setMessages((prev) => prev.map(m => m._id === tempId ? savedMsg : m));
      }

      // ✅ We don't necessarily need to emit sendMessage if the server's /send endpoint already broadcasts it.
      // But let's check if the socketRef is connected and emit just in case the server expects it for live updates.
      if (socketRef.current?.connected) {
        console.log("📤 Emitting sendMessage via socket");
        socketRef.current.emit("sendMessage", {
          conversationId,
          fromUser: currentUserId,
          message: text,
        });
      }
    } catch (err) {
      console.error("❌ Failed to send message:", err);
      // Remove optimistic message on failure
      setMessages((prev) => prev.filter(m => m._id !== tempId));
    }
  };

  return { messages, loading, sendMessage };
}
