import { useContext } from 'react';
import { SocketContext, type SocketContextType } from '../contexts/socketContext';

/**
 * Custom hook to access socket instance
 * Throws error if used outside SocketProvider
 * 
 * @example
 * const { socket, isConnected } = useSocket();
 * 
 * useEffect(() => {
 *   if (!socket) return;
 *   
 *   const handler = (data) => console.log(data);
 *   socket.on('message', handler);
 *   
 *   return () => { socket.off('message', handler); };
 * }, [socket]);
 */
export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  
  return context;
};
