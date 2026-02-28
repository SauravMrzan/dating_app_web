"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/api/axios";
import { API } from "@/lib/api/endpoints";
import { io, Socket } from "socket.io-client";

export interface ChatMessage {
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

let socket: Socket | null = null;

export function useChat(conversationId: string, currentUserId?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch existing messages via REST
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // ✅ Guard against invalid values
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

    socket = io(process.env.NEXT_PUBLIC_API_URL!, {
      transports: ["websocket"],
    });

    // ✅ Join shared conversation room
    socket.emit("joinRoom", { roomId: conversationId });

    socket.on("newMessage", (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("error", (errMsg: string) => {
      console.error("❌ Socket error:", errMsg);
    });

    return () => {
      socket?.disconnect();
    };
  }, [conversationId, currentUserId]);

  // 3. Send message via REST + socket
  const sendMessage = async (text: string) => {
    if (!text.trim() || !currentUserId || !conversationId) return;

    try {
      // ✅ REST call to save message
      await axios.post(`${API.CHAT.BASE}/send`, {
        conversationId,
        message: text,
      });

      // ✅ Socket emit for live update
      socket?.emit("sendMessage", {
        conversationId,
        fromUser: currentUserId,
        message: text,
      });

      // Optimistic update
      setMessages((prev) => [
        ...prev,
        {
          fromUser: { _id: currentUserId, fullName: "You" },
          message: text,
          createdAt: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      console.error("❌ Failed to send message:", err);
    }
  };

  return { messages, loading, sendMessage };
}
