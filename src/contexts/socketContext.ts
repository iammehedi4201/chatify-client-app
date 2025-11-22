import { createContext } from 'react';
import type { TypedClientSocket } from '../types/socket';

// Context type with socket and connection state
export interface SocketContextType {
  socket: TypedClientSocket | null;
  isConnected: boolean;
}

export const SocketContext = createContext<SocketContextType | null>(null);
