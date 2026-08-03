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
    socket.on("mistControl", (data) => {
      console.log("Mist command received:", data);
      const esp32 = global.esp32Socket();
      if(esp32){
        esp32.send(JSON.stringify(data));
        console.log("Mist command sent to ESP32:", data);
      }
      else{
        console.log("ESP32 is not connected. Cannot send mist command.");
      }
      io.emit("mistCommand", data);
    });
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  io.on("error", (err) => {
    console.error("Socket.IO error:", err);
  });

  return io;
};

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