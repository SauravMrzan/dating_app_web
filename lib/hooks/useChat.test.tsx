import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";

const { getMock, postMock } = vi.hoisted(() => ({
  getMock: vi.fn(),
  postMock: vi.fn(),
}));

vi.mock("@/lib/api/axios", () => ({
  default: {
    get: getMock,
    post: postMock,
  },
}));

const { handlers, emitMock, disconnectMock, socketInstance, ioMock } = vi.hoisted(() => {
  const localHandlers: Record<string, (...args: any[]) => void> = {};
  const localEmitMock = vi.fn();
  const localDisconnectMock = vi.fn();

  const localSocketInstance = {
    id: "socket-1",
    connected: true,
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
    socketInstance: localSocketInstance,
    ioMock: vi.fn(() => localSocketInstance),
  };
});

vi.mock("socket.io-client", () => ({
  io: ioMock,
}));

import { useChat } from "./useChat";

describe("useChat", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.keys(handlers).forEach((k) => delete handlers[k]);
    getMock.mockResolvedValue({ data: { data: [] } });
    postMock.mockResolvedValue({ data: { data: { _id: "saved-1", message: "Hello" } } });
  });

  it("fetches existing messages on mount", async () => {
    getMock.mockResolvedValue({
      data: {
        data: [{ _id: "m1", message: "Hi" }],
      },
    });

    const { result } = renderHook(() => useChat("conv-1", "u1"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(getMock).toHaveBeenCalledWith("/api/chat/conv-1");
    expect(result.current.messages).toEqual([{ _id: "m1", message: "Hi" }]);
    expect(ioMock).toHaveBeenCalled();
  });

  it("appends non-duplicate socket messages", async () => {
    const { result } = renderHook(() => useChat("conv-1", "u1"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      handlers.newMessage?.({ _id: "m2", message: "Real-time" });
      handlers.newMessage?.({ _id: "m2", message: "Real-time" });
    });

    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0]._id).toBe("m2");
  });

  it("sendMessage performs optimistic update then replaces with saved", async () => {
    const { result } = renderHook(() => useChat("conv-1", "u1"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.sendMessage("Hello");
    });

    expect(postMock).toHaveBeenCalledWith("/api/chat/send", {
      conversationId: "conv-1",
      message: "Hello",
    });

    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0]._id).toBe("saved-1");
    expect(emitMock).toHaveBeenCalledWith("sendMessage", {
      conversationId: "conv-1",
      fromUser: "u1",
      message: "Hello",
    });
  });

  it("removes optimistic message if send fails", async () => {
    postMock.mockRejectedValue(new Error("send failed"));

    const { result } = renderHook(() => useChat("conv-1", "u1"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.sendMessage("Hello");
    });

    expect(result.current.messages).toEqual([]);
  });
});
