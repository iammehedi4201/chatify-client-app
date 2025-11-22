import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import type { TypedClientSocket } from "../types/socket";
import { SocketContext, type SocketContextType } from "./socketContext";

// Singleton socket instance (created once, shared across re-renders)
let socketInstance: TypedClientSocket | null = null;

interface SocketProviderProps {
  children: React.ReactNode;
}

/**
 * SocketProvider manages the Socket.IO connection lifecycle
 * Best practices:
 * - Single connection instance shared across app (singleton pattern)
 * - Proper connect/disconnect lifecycle
 * - Connection state tracking for UI feedback
 * - Type-safe event handlers
 */
export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Only create socket once (singleton pattern)
    if (!socketInstance) {
      const SOCKET_URL =
        import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

      socketInstance = io(SOCKET_URL, {
        // Use WebSocket transport for better performance
        transports: ["websocket", "polling"],

        // Reconnection configuration
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,

        // Authentication (add token if needed)
        // auth: {
        // token: localStorage.getItem('authToken'), // Uncomment and implement auth
        // },

        // Auto-connect on creation
        autoConnect: true,
      });
    }

    // Connection event handlers
    const onConnect = () => {
      console.log("✅ Socket connected:", socketInstance?.id);
      setIsConnected(true);
    };

    const onDisconnect = (reason: string) => {
      console.log("❌ Socket disconnected:", reason);
      setIsConnected(false);
    };

    const onConnectError = (error: Error) => {
      console.error("🔴 Socket connection error:", error.message);
      setIsConnected(false);
    };

    // Register connection listeners
    socketInstance.on("connect", onConnect);
    socketInstance.on("disconnect", onDisconnect);
    socketInstance.on("connect_error", onConnectError);

    // Cleanup on unmount
    return () => {
      if (socketInstance) {
        console.log("🧹 Cleaning up socket connection");
        socketInstance.off("connect", onConnect);
        socketInstance.off("disconnect", onDisconnect);
        socketInstance.off("connect_error", onConnectError);
        socketInstance.disconnect();
        socketInstance = null;
      }
    };
  }, []); // Empty deps - only run once on mount

  const value: SocketContextType = {
    socket: socketInstance,
    isConnected,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
