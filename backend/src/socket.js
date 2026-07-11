// backend/socket.js
const { Server } = require("socket.io");

let io = null;

const initSocket = (httpServer) => {
  if (io) {
    console.log("Socket.IO is already initialized.");
    return io;
  }

  io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN || "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A client connected:", socket.id);
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  io.on("error", (err) => {
    console.error("Socket.IO error:", err);
  });

  return io;
};

// Callers assume sockets are already initialized (app.js does this once at
// startup, before any request can reach a route handler). If this ever
// fires, initialization order is broken somewhere — fail loudly rather
// than silently constructing a second, misconfigured server.
const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized yet. Call initSocket(httpServer) first.");
  }
  return io;
};

module.exports = {
  initSocket,
  getIO,
};