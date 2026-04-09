import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { dataService } from "../../services/dataService";
import { EmptyState } from "../common/EmptyState";
import { Button } from "../common/Button";
import { Loader } from "../common/Loader";

const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
  autoConnect: false,
});

const getId = (value) => (typeof value === "string" ? value : value?._id || "");

const sortConversations = (items) =>
  [...items].sort((left, right) => {
    const leftDate = left.lastMessageAt || left.updatedAt || left.createdAt || "";
    const rightDate = right.lastMessageAt || right.updatedAt || right.createdAt || "";
    return new Date(rightDate).getTime() - new Date(leftDate).getTime();
  });

const upsertConversation = (items, nextConversation) => {
  const nextId = nextConversation._id || `placeholder-${getId(nextConversation.otherUser)}`;
  const filteredItems = items.filter((item) => {
    const itemId = item._id || `placeholder-${getId(item.otherUser)}`;
    const samePartner = getId(item.otherUser) === getId(nextConversation.otherUser);
    return itemId !== nextId && !samePartner;
  });

  return sortConversations([nextConversation, ...filteredItems]);
};

export function ChatWindow({ initialUserId = "" }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [acceptedConnections, setAcceptedConnections] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!user?._id) return undefined;

    socket.connect();
    socket.emit("join", user._id);

    const handleIncomingMessage = (message) => {
      const incomingConversationId = getId(message.conversationId);
      const activeConversationId = getId(activeConversation?._id);

      if (incomingConversationId && incomingConversationId === activeConversationId) {
        setMessages((prev) =>
          prev.some((item) => item._id === message._id) ? prev : [...prev, message],
        );
      }

      setConversations((prev) => {
        const existingConversation =
          prev.find((conversation) => conversation._id === incomingConversationId) || activeConversation;

        if (!existingConversation) return prev;

        return upsertConversation(prev, {
          ...existingConversation,
          lastMessage: message.text,
          lastMessageAt: message.createdAt,
        });
      });
    };

    socket.on("private:message", handleIncomingMessage);

    return () => {
      socket.off("private:message", handleIncomingMessage);
      socket.disconnect();
    };
  }, [user?._id, activeConversation]);

  useEffect(() => {
    if (!user?._id) return;

    const loadChatData = async () => {
      try {
        setLoading(true);

        const [conversationsResponse, requestsResponse] = await Promise.all([
          dataService.getConversations(user._id),
          dataService.getRequests(),
        ]);

        const acceptedUsers = (requestsResponse.data.data || [])
          .filter((request) => request.status === "accepted")
          .map((request) => {
            const mentorId = getId(request.mentorId);
            return mentorId === user._id ? request.menteeId : request.mentorId;
          })
          .filter(Boolean)
          .filter(
            (value, index, array) => index === array.findIndex((item) => getId(item) === getId(value)),
          );

        const fetchedConversations = sortConversations(conversationsResponse.data.data || []);

        setAcceptedConnections(acceptedUsers);
        setConversations(fetchedConversations);

        if (initialUserId) {
          const matchedConversation = fetchedConversations.find(
            (conversation) => getId(conversation.otherUser) === initialUserId,
          );

          if (matchedConversation) {
            setActiveConversation(matchedConversation);
            return;
          }

          const matchedUser = acceptedUsers.find((acceptedUser) => getId(acceptedUser) === initialUserId);
          if (matchedUser) {
            const response = await dataService.createConversation({
              senderId: user._id,
              receiverId: initialUserId,
            });

            const nextConversation = response.data.data;
            setConversations((prev) => upsertConversation(prev, nextConversation));
            setActiveConversation(nextConversation);
            return;
          }
        }

        if (fetchedConversations.length) {
          setActiveConversation(fetchedConversations[0]);
        } else {
          setActiveConversation(null);
        }
      } catch (error) {
        toast.error(error.message || "Unable to load conversations");
      } finally {
        setLoading(false);
      }
    };

    loadChatData();
  }, [user?._id, initialUserId]);

  useEffect(() => {
    if (!activeConversation?._id) {
      setMessages([]);
      return;
    }

    const loadMessages = async () => {
      try {
        setMessagesLoading(true);
        const response = await dataService.getMessages(activeConversation._id);
        setMessages(response.data.data || []);
      } catch (error) {
        toast.error(error.message || "Unable to load messages");
      } finally {
        setMessagesLoading(false);
      }
    };

    loadMessages();
  }, [activeConversation?._id]);

  const placeholderConversations = useMemo(
    () =>
      acceptedConnections
        .filter(
          (connection) =>
            !conversations.some(
              (conversation) => getId(conversation.otherUser) === getId(connection),
            ),
        )
        .map((connection) => ({
          _id: "",
          otherUser: connection,
          lastMessage: "",
          lastMessageAt: null,
          isPlaceholder: true,
        })),
    [acceptedConnections, conversations],
  );

  const conversationItems = useMemo(
    () => [...conversations, ...placeholderConversations],
    [conversations, placeholderConversations],
  );

  const activePartner = activeConversation?.otherUser || null;
  const partnerName = useMemo(
    () => activePartner?.name || "Select a conversation",
    [activePartner],
  );

  const ensureConversation = async (conversationLike) => {
    if (!conversationLike?.otherUser) return null;
    if (conversationLike._id) return conversationLike;

    const response = await dataService.createConversation({
      senderId: user._id,
      receiverId: getId(conversationLike.otherUser),
    });

    const nextConversation = response.data.data;
    setConversations((prev) => upsertConversation(prev, nextConversation));
    return nextConversation;
  };

  const handleSelectConversation = async (conversationLike) => {
    try {
      const resolvedConversation = await ensureConversation(conversationLike);
      if (resolvedConversation) {
        setActiveConversation(resolvedConversation);
      }
    } catch (error) {
      toast.error(error.message || "Unable to open conversation");
    }
  };

  const handleSend = async () => {
    const messageText = text.trim();
    if (!messageText || !activeConversation?.otherUser || sending) return;

    let resolvedConversation = activeConversation;
    if (!resolvedConversation._id) {
      resolvedConversation = await ensureConversation(resolvedConversation);
      setActiveConversation(resolvedConversation);
    }

    const optimisticMessage = {
      _id: `temp-${Date.now()}`,
      conversationId: resolvedConversation._id,
      senderId: user._id,
      receiverId: getId(resolvedConversation.otherUser),
      text: messageText,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    setSending(true);
    setMessages((prev) => [...prev, optimisticMessage]);
    setConversations((prev) =>
      upsertConversation(prev, {
        ...resolvedConversation,
        lastMessage: messageText,
        lastMessageAt: optimisticMessage.createdAt,
      }),
    );
    setText("");

    try {
      const response = await dataService.sendMessage({
        conversationId: resolvedConversation._id,
        text: messageText,
      });
      const savedMessage = response.data.data;

      setMessages((prev) =>
        prev.map((message) => (message._id === optimisticMessage._id ? savedMessage : message)),
      );
      setConversations((prev) =>
        upsertConversation(prev, {
          ...resolvedConversation,
          lastMessage: savedMessage.text,
          lastMessageAt: savedMessage.createdAt,
        }),
      );
      socket.emit("private:message", savedMessage);
    } catch (error) {
      setMessages((prev) => prev.filter((message) => message._id !== optimisticMessage._id));
      toast.error(error.message || "Unable to send message");
    } finally {
      setSending(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
      <div className="card overflow-hidden">
        <div className="border-b border-slate-100 p-4 font-semibold">Chats</div>
        {conversationItems.length ? (
          <div className="divide-y divide-slate-100">
            {conversationItems.map((conversation) => {
              const isActive =
                getId(conversation._id) &&
                getId(conversation._id) === getId(activeConversation?._id);

              return (
              <button
                key={conversation._id || `placeholder-${getId(conversation.otherUser)}`}
                onClick={() => handleSelectConversation(conversation)}
                className={`w-full px-4 py-4 text-left hover:bg-slate-50 ${
                  isActive ? "bg-slate-50" : ""
                }`}
              >
                <p className="font-semibold text-slate-900">{conversation.otherUser?.name}</p>
                <p className="truncate text-sm text-slate-500">
                  {conversation.lastMessage || "Start the conversation"}
                </p>
              </button>
              );
            })}
          </div>
        ) : (
          <div className="p-4">
            <EmptyState
              title="No conversations yet"
              description="Accepted mentor-mentee relationships will appear here once a request is accepted."
            />
          </div>
        )}
      </div>
      <div className="card flex min-h-[540px] flex-col overflow-hidden">
        <div className="border-b border-slate-100 p-5">
          <h3 className="text-lg font-bold text-slate-950">{partnerName}</h3>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-5">
          {messagesLoading ? (
            <Loader />
          ) : messages.length ? (
            messages.map((message) => {
              const senderId = getId(message.senderId);

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
              disabled={!activePartner?._id || sending}
            />
            <Button onClick={handleSend} disabled={!activePartner?._id || sending}>
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
