import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { dataService } from "../../services/dataService";
import { EmptyState } from "../common/EmptyState";
import { Button } from "../common/Button";

const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
  autoConnect: false,
});

export function ChatWindow({ conversations = [] }) {
  const { user } = useAuth();
  const [activeUser, setActiveUser] = useState(conversations[0]?.user || null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const getParticipantId = (value) => (typeof value === "string" ? value : value?._id);

  useEffect(() => {
    if (!activeUser && conversations.length) {
      setActiveUser(conversations[0].user);
    }
  }, [activeUser, conversations]);

  useEffect(() => {
    if (user?._id) {
      socket.connect();
      socket.emit("join", user._id);
    }

    const handleIncomingMessage = (message) => {
      const senderId = getParticipantId(message.senderId);
      const receiverId = getParticipantId(message.receiverId);

      if (
        senderId === activeUser?._id ||
        receiverId === activeUser?._id
      ) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on("private:message", handleIncomingMessage);

    return () => {
      socket.off("private:message", handleIncomingMessage);
      socket.disconnect();
    };
  }, [user, activeUser]);

  useEffect(() => {
    if (!activeUser?._id) return;
    dataService
      .getMessages(activeUser._id)
      .then((response) => setMessages(response.data.data))
      .catch(() => toast.error("Unable to load messages"));
  }, [activeUser]);

  const partnerName = useMemo(() => activeUser?.name || "Select a conversation", [activeUser]);

  const handleSend = async () => {
    if (!text.trim() || !activeUser?._id) return;

    const response = await dataService.sendMessage({ receiverId: activeUser._id, text });
    socket.emit("private:message", response.data.data);
    setMessages((prev) => [...prev, response.data.data]);
    setText("");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
      <div className="card overflow-hidden">
        <div className="border-b border-slate-100 p-4 font-semibold">Chats</div>
        {conversations.length ? (
          <div className="divide-y divide-slate-100">
            {conversations.map((conversation) => (
              <button
                key={conversation.user._id}
                onClick={() => setActiveUser(conversation.user)}
                className="w-full px-4 py-4 text-left hover:bg-slate-50"
              >
                <p className="font-semibold text-slate-900">{conversation.user.name}</p>
                <p className="truncate text-sm text-slate-500">
                  {conversation.latestMessage.text}
                </p>
              </button>
            ))}
          </div>
        ) : (
          <div className="p-4">
            <EmptyState
              title="No conversations yet"
              description="Accepted mentor-mentee relationships can start chatting here."
            />
          </div>
        )}
      </div>
      <div className="card flex min-h-[540px] flex-col overflow-hidden">
        <div className="border-b border-slate-100 p-5">
          <h3 className="text-lg font-bold text-slate-950">{partnerName}</h3>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-5">
          {messages.length ? (
            messages.map((message) => {
              const senderId = getParticipantId(message.senderId);

              return (
                <div
                  key={message._id || `${senderId}-${message.text}-${message.createdAt}`}
                  className={`max-w-xl rounded-2xl px-4 py-3 text-sm ${
                    senderId === user._id
                      ? "ml-auto bg-primary-500 text-white"
                      : "bg-white text-slate-700"
                  }`}
                >
                  {message.text}
                </div>
              );
            })
          ) : (
            <EmptyState
              title="No messages yet"
              description="Start the conversation when you're ready."
            />
          )}
        </div>
        <div className="border-t border-slate-100 p-4">
          <div className="flex gap-3">
            <input
              className="input"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Type your message"
              disabled={!activeUser?._id}
            />
            <Button onClick={handleSend} disabled={!activeUser?._id}>
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
