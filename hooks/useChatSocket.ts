import { useEffect, useMemo, useRef } from "react";
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";
import { BACKEND_URL } from "@/constants/env.config";
import { getAuthorizationHeader } from "@/store/api/_base/baseApi";

const getSocketUrl = () => BACKEND_URL.replace(/\/api\/v\d+\/?$/, "");

export function useChatSocket(token?: string | null) {
  const socketRef = useRef<Socket | null>(null);
  const socketUrl = useMemo(getSocketUrl, []);

  useEffect(() => {
    if (!token) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      return;
    }

    const rawToken = token.replace(/^Bearer\s+/i, "").trim();
    const socket = io(socketUrl, {
      auth: { token: rawToken },
      extraHeaders: {
        Authorization: getAuthorizationHeader(token) ?? "",
      },
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      if (socketRef.current === socket) {
        socketRef.current = null;
      }
    };
  }, [socketUrl, token]);

  return socketRef;
}
