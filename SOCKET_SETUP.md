# Socket.IO Setup Documentation

## Overview
This project implements Socket.IO using best practices with TypeScript type safety, proper lifecycle management, and clean architecture.

## Architecture

### Files Created/Modified
1. **`src/types/socket.ts`** - TypeScript event type definitions
2. **`src/contexts/SocketContext.tsx`** - Socket provider and hook
3. **`src/main.tsx`** - App wrapped with SocketProvider
4. **`src/App.tsx`** - Example usage demonstration
5. **`.env`** - Environment configuration

## Best Practices Implemented

### ✅ Single Connection (Singleton Pattern)
- Socket instance created once at app root
- Shared across all components via Context
- Prevents duplicate connections

### ✅ Type Safety
- Full TypeScript generics for Socket.IO events
- Compile-time type checking for event payloads
- IntelliSense support for all socket events

### ✅ Proper Lifecycle Management
- Connection opens when provider mounts
- Cleanup/disconnect when provider unmounts
- Event listeners properly registered and removed

### ✅ Connection State Tracking
- `isConnected` state for UI feedback
- Connection/error event handlers
- Console logging for debugging

### ✅ Reconnection Configuration
- Automatic reconnection enabled
- Exponential backoff strategy
- Configurable retry attempts and delays

### ✅ Clean Event Handler Pattern
- Handlers defined before registration
- Proper cleanup in effect return
- No memory leaks

## Usage

### 1. Using the Socket Hook

```tsx
import { useSocket } from './contexts/SocketContext';

function MyComponent() {
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket) return;

    // Define handler
    const handleEvent = (data) => {
      console.log('Event received:', data);
    };

    // Register listener
    socket.on('event_name', handleEvent);

    // Cleanup
    return () => {
      socket.off('event_name', handleEvent);
    };
  }, [socket]);

  return <div>Connected: {isConnected ? '✅' : '❌'}</div>;
}
```

### 2. Emitting Events

```tsx
const sendMessage = () => {
  if (!socket) return;
  
  socket.emit('send_message', {
    text: 'Hello!',
    roomId: 'general'
  });
};
```

### 3. Adding New Event Types

Edit `src/types/socket.ts`:

```typescript
export interface ServerToClientEvents {
  new_event: (payload: { data: string }) => void;
}

export interface ClientToServerEvents {
  my_event: (payload: { value: number }) => void;
}
```

## Configuration

### Environment Variables (`.env`)
```bash
VITE_SOCKET_URL=http://localhost:3000
```

### Socket Options
Edit `src/contexts/SocketContext.tsx` to customize:
- `transports`: ['websocket', 'polling']
- `reconnectionAttempts`: Infinity
- `reconnectionDelay`: 1000ms
- `reconnectionDelayMax`: 5000ms
- `auth`: Add authentication tokens

## Authentication

To add JWT authentication:

```typescript
// In SocketContext.tsx
const socketInstance = io(SOCKET_URL, {
  auth: {
    token: localStorage.getItem('authToken')
  }
});
```

Server-side validation:

```typescript
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (isValidToken(token)) {
    next();
  } else {
    next(new Error('Authentication error'));
  }
});
```

## Testing

### Start Dev Server
```bash
npm run dev
```

### Test Socket Connection
1. Open browser console
2. Look for "✅ Socket connected" message
3. Check connection status indicator in UI
4. Click "Send Test Message" button

## Common Patterns

### Pattern 1: Room Management
```typescript
// Join room
socket.emit('join_room', { roomId: 'room-123' });

// Listen for room events
socket.on('room_message', handleRoomMessage);

// Leave room
socket.emit('leave_room', { roomId: 'room-123' });
```

### Pattern 2: Typing Indicators
```typescript
const handleTyping = (isTyping: boolean) => {
  socket?.emit('typing', { isTyping, roomId });
};

// Debounce typing events
const debouncedTyping = debounce(handleTyping, 300);
```

### Pattern 3: Connection Status UI
```tsx
const ConnectionStatus = () => {
  const { isConnected } = useSocket();
  
  return (
    <div className={isConnected ? 'online' : 'offline'}>
      {isConnected ? '🟢 Online' : '🔴 Offline'}
    </div>
  );
};
```

## Troubleshooting

### Socket Not Connecting
1. Check `.env` has correct `VITE_SOCKET_URL`
2. Verify server is running on specified port
3. Check browser console for connection errors
4. Ensure CORS is configured on server

### Events Not Firing
1. Verify event names match between client/server
2. Check handler is registered before event fires
3. Ensure socket is connected (`isConnected === true`)
4. Add console.logs to handlers for debugging

### Memory Leaks
1. Always return cleanup function from useEffect
2. Use same function reference for on/off
3. Don't create new handlers on every render
4. Use useCallback for handler functions

## Performance Tips

1. **Batch Events**: Group multiple emits into single payload
2. **Throttle/Debounce**: Limit high-frequency events (typing, mouse move)
3. **Namespaces**: Use Socket.IO namespaces for isolation
4. **Rooms**: Use rooms for targeted broadcasts
5. **Binary Data**: Use binary mode for file transfers

## Security Checklist

- [ ] Use WSS (WebSocket Secure) in production
- [ ] Validate all incoming event data
- [ ] Implement authentication/authorization
- [ ] Rate limit socket connections
- [ ] Sanitize user input before broadcasting
- [ ] Use HTTPS for initial handshake
- [ ] Set proper CORS policies
- [ ] Don't expose sensitive data in events

## Next Steps

1. Implement authentication (JWT tokens)
2. Add error boundaries for socket errors
3. Create reusable socket hooks for common patterns
4. Add integration with state management (Zustand)
5. Implement reconnection UI feedback
6. Add socket event logging/monitoring
7. Write unit tests for socket interactions

## Resources

- [Socket.IO Client Docs](https://socket.io/docs/v4/client-api/)
- [TypeScript Support](https://socket.io/docs/v4/typescript/)
- [React Best Practices](https://socket.io/how-to/use-with-react)
