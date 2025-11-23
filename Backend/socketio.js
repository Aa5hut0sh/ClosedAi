let io = null;
const onlineUsers = new Map();

function initSocket(server) {
  io = require("socket.io")(server, {
    cors: { origin: "*" }
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      onlineUsers.set(userId, socket.id);
    }

    socket.on("disconnect", () => {
      onlineUsers.delete(userId);
    });
  });
}

module.exports = { initSocket, io };
