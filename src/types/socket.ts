// ...existing code...
// Data models (match backend)
export interface IMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: "text" | "image" | "file";
  timestamp: string | number | Date;
  status?: "sent" | "delivered" | "read";
}

export interface IConversation {
  id: string;
  participants: string[];
  lastMessage?: IMessage;
  updatedAt: string | number | Date;
}

export interface INotification {
  id: string;
  userId: string;
  type: string;
  message: string;
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: string | number | Date;
}

// Server -> Client events (match backend names)
export interface ServerToClientEvents {
  // connection
  connected: (data: { userId: string; socketId: string }) => void;

  // messages
  "message:new": (message: IMessage) => void;
  "message:delivered": (data: { messageId: string }) => void;
  "message:read": (data: { messageId: string }) => void;

  // typing
  "typing:start": (data: { userId: string; conversationId: string }) => void;
  "typing:stop": (data: { userId: string; conversationId: string }) => void;

  // presence
  "user:online": (data: { userId: string; status?: string }) => void;
  "user:offline": (data: { userId: string }) => void;

  // conversations
  "conversation:updated": (conversation: IConversation) => void;
  "conversation:deleted": (data: { conversationId: string }) => void;

  // notifications & errors
  "notification:new": (notification: INotification) => void;
  "receive:message": (data: { text: string }) => void;
  error: (error: { message: string; code?: string }) => void;
}

// Client -> Server events (match backend names)
export interface ClientToServerEvents {
  authenticate: (token: string) => void;

  "message:send": (data: {
    conversationId: string;
    content: string;
    type?: "text" | "image" | "file";
  }) => void;

  "message:read": (data: { messageId: string }) => void;

  "typing:start": (data: { conversationId: string }) => void;
  "typing:stop": (data: { conversationId: string }) => void;

  "conversation:join": (conversationId: string) => void;
  "conversation:leave": (conversationId: string) => void;

  "user:status": (status: "online" | "away" | "busy" | "offline") => void;

  "custom:event": (data: unknown) => void;
}

// Inter-server events (optional)
export interface InterServerEvents {
  ping: () => void;
}

// socket.data shape
export interface SocketData {
  userId?: string;
  email?: string;
  role?: string;
}

// Typed socket for client side
import type { Socket as ClientSocket } from "socket.io-client";
export type TypedClientSocket = ClientSocket<
  ServerToClientEvents,
  ClientToServerEvents
>;
