import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";

const { handlers, emitMock, disconnectMock, ioMock } = vi.hoisted(() => {
  const localHandlers: Record<string, (...args: any[]) => void> = {};
  const localEmitMock = vi.fn();
  const localDisconnectMock = vi.fn();
  const localSocketInstance = {
    emit: localEmitMock,
    on: vi.fn((event: string, cb: (...args: any[]) => void) => {
      localHandlers[event] = cb;
    }),
    disconnect: localDisconnectMock,
  };

  return {
    handlers: localHandlers,
    emitMock: localEmitMock,
    disconnectMock: localDisconnectMock,
    ioMock: vi.fn(() => localSocketInstance),
  };
});

vi.mock("socket.io-client", () => ({
  io: ioMock,
}));

import { useSocketChat } from "./useSocketChat";

describe("useSocketChat", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.keys(handlers).forEach((k) => delete handlers[k]);
    process.env.NEXT_PUBLIC_API_URL = "http://127.0.0.1:5000";
  });

  it("connects and joins room", () => {
    renderHook(() => useSocketChat("conv-1", "u1"));

    expect(ioMock).toHaveBeenCalledWith("http://127.0.0.1:5000", {
      transports: ["websocket"],
    });
    expect(emitMock).toHaveBeenCalledWith("joinRoom", { roomId: "conv-1" });
  });

  it("receives new messages and appends to state", () => {
    const { result } = renderHook(() => useSocketChat("conv-1", "u1"));

    act(() => {
      handlers.newMessage?.({ id: "m1", message: "Hi" });
      handlers.newMessage?.({ id: "m2", message: "Hello" });
    });

    expect(result.current.messages).toHaveLength(2);
  });

  it("sendMessage emits payload when text is not empty", () => {
    const { result } = renderHook(() => useSocketChat("conv-1", "u1"));

    act(() => {
      result.current.sendMessage("hello there");
    });

    expect(emitMock).toHaveBeenCalledWith("sendMessage", {
      conversationId: "conv-1",
      fromUser: "u1",
      message: "hello there",
    });
  });

  it("does not send empty text", () => {
    const { result } = renderHook(() => useSocketChat("conv-1", "u1"));

    act(() => {
      result.current.sendMessage("   ");
    });

    expect(emitMock).not.toHaveBeenCalledWith(
      "sendMessage",
      expect.objectContaining({ message: "   " }),
    );
  });
});
