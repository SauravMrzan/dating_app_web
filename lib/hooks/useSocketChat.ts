"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket;

export function useSocketChat(conversationId: string, currentUserId: string) {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    if (!conversationId || !currentUserId) return;

    socket = io(process.env.NEXT_PUBLIC_API_URL!, {
      transports: ["websocket"],
    });

    // ✅ Join shared conversation room
    socket.emit("joinRoom", { roomId: conversationId });

    socket.on("newMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("error", (errMsg: string) => {
      console.error("❌ Socket error:", errMsg);
    });

    return () => {
      socket.disconnect();
    };
  }, [conversationId, currentUserId]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    socket.emit("sendMessage", {
      conversationId, // ✅ shared ID
      fromUser: currentUserId,
      message: text,
    });
  };

  return { messages, sendMessage };
}
