const onlineUsers = new Map();
const getUserId = (value) => (typeof value === "string" ? value : value?._id);

export const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    socket.on("join", (userId) => {
      onlineUsers.set(userId, socket.id);
    });

    socket.on("private:message", async (payload) => {
      const receiverSocket = onlineUsers.get(getUserId(payload.receiverId));
      if (receiverSocket) {
        io.to(receiverSocket).emit("private:message", payload);
      }
    });

    socket.on("disconnect", () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
    });
  });
};
