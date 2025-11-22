import { useEffect, useRef, useState } from "react";
// import dayjs from "dayjs";
// import type { IMessage } from "./types/socket";
import { useSocket } from "./hooks/useSocket";

function App() {
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<string>("");
  const [text, setText] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!socket) return;

    // socket?.on("receive:message", (data) => {
    //   console.log("Data from receive:message", data?.text);
    //   setMessages(data?.text);
    // });

    // const handleNewMessage = (msg: IMessage) => {
    //   setMessages((prev) => [...prev, msg]);
    // };

    // socket.on("message:new", handleNewMessage);

    return () => {
      // socket.off("message:new", handleNewMessage);
      socket.off("receive:message");
    };
  }, [socket]);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = () => {
    // if (!socket || !text.trim()) return;

    // setMessages(text);

    setText("");

    // const payload: {
    //   conversationId: string;
    //   content: string;
    //   type?: "text" | "image" | "file";
    // } = {
    //   conversationId: "general",
    //   content: text.trim(),
    //   type: "text",
    // };

    // const optimistic: IMessage = {
    //   id: `local_${Date.now()}`,
    //   conversationId: "general",
    //   content: payload.content,
    //   senderId: socket.id ?? "me",
    //   type: "text",
    //   timestamp: Date.now(),
    // };
    // setMessages((m) => [...m, optimistic]);
    // setText("");

    // socket.emit("message:send", payload);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full bg-white shadow-2xl rounded-2xl overflow-hidden">
        <header className="bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-2xl">💬</span>
            </div>
            <h1 className="text-xl font-bold text-white">Chatify</h1>
          </div>
          <div className="text-sm text-white  flex items-center gap-2 mt-4 ml-4">
            {isConnected ? (
              <span className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full">
                <span className="h-2.5 w-2.5 rounded-full bg-green-400 animate-pulse" />
                <span className="font-medium">Connected</span>
                <span className="text-xs opacity-75">
                  ({socket?.id?.slice(0, 6)})
                </span>
              </span>
            ) : (
              <span className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="font-medium">Disconnected</span>
              </span>
            )}
          </div>
        </header>

        <main className="p-6 bg-gray-50">
          <div
            ref={listRef}
            className="min-h-[35vh] overflow-y-auto space-y-4 px-2 pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
          >
            {/* {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <div className="text-6xl mb-4">💬</div>
                <p className="text-lg font-medium">No messages yet</p>
                <p className="text-sm">Start a conversation!</p>
              </div>
            ) : (
              messages.map((m) => {
                const mine = m.senderId === socket?.id;
                return (
                  <div
                    key={m.id}
                    className={`flex ${
                      mine ? "justify-end" : "justify-start"
                    } animate-fade-in`}
                  >
                    <div
                      className={`max-w-[75%] ${
                        mine
                          ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl rounded-br-md"
                          : "bg-white text-gray-800 rounded-2xl rounded-bl-md shadow-md"
                      } px-4 py-3 transition-all hover:shadow-lg`}
                    >
                      <div className="text-[15px] leading-relaxed break-words">
                        {m.content}
                      </div>
                      <div
                        className={`text-xs mt-1.5 flex items-center gap-1 ${
                          mine ? "text-blue-100" : "text-gray-500"
                        }`}
                      >
                        <span className="font-medium">
                          {mine ? "You" : m.senderId.slice(0, 6)}
                        </span>
                        <span>•</span>
                        <span>{dayjs(m.timestamp).format("HH:mm")}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )} */}
            <div className="text-black">{messages}</div>
          </div>
        </main>

        <footer className="px-6 py-4 bg-white border-t border-gray-200 flex flex-col gap-3">
          <div className="flex gap-3">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={onKeyDown}
              className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all disabled:bg-gray-50 disabled:text-gray-400 text-black"
              placeholder="Type a message..."
              disabled={!isConnected}
            />
            <button
              onClick={sendMessage}
              disabled={!isConnected || !text.trim()}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
            >
              <span className="flex items-center gap-2">
                <span>Send</span>
                <span>📨</span>
              </span>
            </button>
          </div>
          {/* <div className="flex gap-3">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={onKeyDown}
              className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all disabled:bg-gray-50 disabled:text-gray-400 text-black"
              placeholder="Type a message..."
              disabled={!isConnected}
            />
            <button
              onClick={sendMessage}
              disabled={!isConnected || !text.trim()}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
            >
              <span className="flex items-center gap-2">
                <span>Join</span>
                <span>🔑</span>
              </span>
            </button>
          </div> */}
        </footer>
      </div>
    </div>
  );
}

export default App;
