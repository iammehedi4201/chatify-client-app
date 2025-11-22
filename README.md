
# Socket Events Cheat Sheet (chat system)

This file explains the socket events used in the project (client ↔ server) in simple words with examples.

Each event lists: Direction, Payload (shape), What it's for, and a tiny example (TypeScript).

---

## connected (Server → Client)

- Payload: `{ userId: string; socketId: string }`

- What: Server tells the client "you're connected and authenticated".

- Example (client):

```ts
socket.on('connected', ({ userId, socketId }) => {
  console.log('Connected as', userId, 'socket', socketId);
});
```

---

## message:new (Server → Client)

- Payload: `IMessage` (id, conversationId, senderId, content, type, timestamp, status?)

- What: A new message for this client (sent by someone in the conversation).

- Example (client):

```ts
socket.on('message:new', (msg) => {
  // add msg to UI
});
```

## message:delivered (Server → Client)

- Payload: `{ messageId: string }`

- What: The server confirms a message was delivered to recipient(s).

- Example (client—sender):

```ts
socket.on('message:delivered', ({ messageId }) => {
  // update message status to 'delivered'
});
```

## message:read (Server → Client)

- Payload: `{ messageId: string }`

- What: The server notifies that the message was read by recipient(s).

## typing:start (Server → Client)

- Payload: `{ userId: string; conversationId: string }`

- What: Someone started typing in the conversation.

- Example (client—others):

```ts
socket.on('typing:start', ({ userId, conversationId }) => {
  showTypingIndicator(userId, conversationId);
});
```

## typing:stop (Server → Client)

- Payload: `{ userId: string; conversationId: string }`

- What: Someone stopped typing; hide indicator.

## user:online (Server → Client)

- Payload: `{ userId: string; status?: string }`

- What: A contact became available (or changed status).

## user:offline (Server → Client)

- Payload: `{ userId: string }`

- What: A contact went offline.

## conversation:updated (Server → Client)

- Payload: `IConversation` (id, participants, lastMessage, updatedAt)

- What: Conversation metadata changed (new participant, last message updated, etc.).

## conversation:deleted (Server → Client)

- Payload: `{ conversationId: string }`

- What: Server tells clients to remove that conversation.

## notification:new (Server → Client)

- Payload: `INotification`

- What: Show a toast/notification (mentions, invites, system messages).

## receive:message (Server → Client)

- Payload: `{ text: string }`

- What: A simple or legacy incoming text notification — treat as `message:new` if needed.

## error (Server → Client)

- Payload: `{ message: string; code?: string }`

- What: Server reports an error (show to user or handle programmatically).

---

Client → Server (what the client emits)

## authenticate

- Payload: `token: string`

- What: Prove identity after connecting. Server should validate and then emit `connected`.

- Example (client):

```ts
socket.emit('authenticate', authToken);
```

## message:send

- Payload: `{ conversationId, content, type? }`

- What: Send a new message to server; server persists and broadcasts `message:new`.

- Example (client):

```ts
socket.emit('message:send', {
  conversationId: 'abc',
  content: 'Hello!',
  type: 'text'
});
```

## message:read

- Payload: `{ messageId }`

- What: Tell server that this message was read; server broadcasts `message:read`.

## typing:start / typing:stop

- Payloads: `{ conversationId }`

- What: Indicate typing state. Client should debounce `typing:start` and send `typing:stop` after inactivity.

## conversation:join / conversation:leave

- Payload: `conversationId`

- What: Join or leave a room so the socket only gets events for active conversations.

## user:status

- Payload: `\"online\"|\"away\"|\"busy\"|\"offline\"`

- What: Set a finer presence state.

## custom:event

- Payload: `unknown` — app-specific use.

---

Common example flows (very short)

## Send message

  1. Client: `emit('message:send', {...})`

  2. Server: persist, `emit('message:new', message)` to recipients, `emit('message:delivered', { messageId })` to sender.

  3. Recipient reads: client emits `message:read` → server persists and emits `message:read` to sender.

## Typing indicator

  1. User types → client debounces and `emit('typing:start', { conversationId })`.

  2. Server broadcasts `typing:start` to other participants.

  3. When stopped/timeout → `typing:stop` emitted and forwarded.

## Presence

  1. Client connects and `emit('authenticate', token)`.

  2. Server validates and emits `connected` and `user:online` to contacts.

  3. On disconnect server emits `user:offline`.

Recommendations

-- Use rooms per `conversationId` for `message:new`, `typing:*`, and `conversation:updated` to minimize fanout.

-- Debounce `typing:start` (e.g., 400ms) and send `typing:stop` after inactivity.

-- Use server ACKs or `message:delivered` to update UI reliably (spinner → delivered → read).

-- Require `authenticate` before other sensitive emits.

Missing / common extras to consider

-- `message:update` and `message:delete` (for edit/delete features).

-- `presence:list` or initial sync events to fetch online statuses and conversations on app start.

---

If you want, I can:

-- add inline JSDoc comments to `src/types/socket.ts`, or

-- create ready-to-use client and server handler files showing these flows.

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

<<<<<<< HEAD
- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

=======
- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

>>>>>>> bb99821 (chore: initial commit from workspace)
## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
<<<<<<< HEAD
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
=======
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
>>>>>>> bb99821 (chore: initial commit from workspace)
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

<<<<<<< HEAD
export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
=======
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
>>>>>>> bb99821 (chore: initial commit from workspace)
```
