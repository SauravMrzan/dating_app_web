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
  message: string;
  createdAt?: string;
}

let socket: Socket | null = null;

export function useChat(conversationId: string, currentUserId?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  // 0. Check if conversationId is valid (mutual match)
  useEffect(() => {
    const checkAllowed = async () => {
      try {
        if (!conversationId) return;
        const res = await axios.get(API.MATCH.MATCHES);
        const matches = res.data.data || [];

        const match = matches.find((m: any) => m._id === conversationId);
        setIsAllowed(!!match);
      } catch (err) {
        console.error("❌ Failed to check matches:", err);
        setIsAllowed(false);
      }
    };
    checkAllowed();
  }, [conversationId]);

  // 1. Fetch existing messages via REST only if allowed
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (!conversationId || !isAllowed) return;
        const res = await axios.get(API.CHAT.MESSAGES(conversationId));
        setMessages(res.data.data || []);
      } catch (err) {
        console.error("❌ Failed to fetch messages:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [conversationId, isAllowed]);

  // 2. Connect to socket.io only if allowed
  useEffect(() => {
    if (!conversationId || !currentUserId || !isAllowed) return;

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
  }, [conversationId, currentUserId, isAllowed]);

  // 3. Send message via socket only if allowed
  const sendMessage = (text: string) => {
    if (!text.trim() || !currentUserId || !isAllowed) return;

    socket?.emit("sendMessage", {
      conversationId, // ✅ shared ID
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
  };

  return { messages, loading, sendMessage, isAllowed };
}
