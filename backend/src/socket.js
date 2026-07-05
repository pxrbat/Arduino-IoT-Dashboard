const { Server } = require("socket.io");

let io = null;

const initSocket = (httpServer) => {
  console.log("Initializing Socket.IO...");
  if (io) {
    console.log("Socket.IO is already initialized.");
    return io;
  }
  try{
    console.log("Creating new Socket.IO server instance...", httpServer);
     io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }
  });

  io.on('connection', (socket) => {
    console.log('A client connected:', socket.id);
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  io.on('error', (err) => {
    console.error('Socket.IO error:', err);
  });

  return io;
  }catch(err){
    console.error("Error initializing Socket.IO:", err);
  }
};

const getIO = (

) => {
  if (!io) {
    initSocket();
    // throw new Error('Socket.IO has not been initialized yet.');
  }
  return io;
};

module.exports = {
  initSocket,
  getIO,
};
