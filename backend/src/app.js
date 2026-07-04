const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const { Server } = require("socket.io");
const { createServer } = require('node:http');
const { initSocket } = require('./socket.js');

const app = express();

const httpServer = createServer(app);
// console.log("HTTP server created:", httpServer);
initSocket(httpServer); 
// const io = new Server(httpServer, {
//   cors: {
//     origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization']
//   }
// });

// io.on('connection', (socket) => {
//   console.log('A client connected:', socket.id);
//   socket.on('disconnect', () => {
//     console.log('Client disconnected:', socket.id);
//   });
// });

// io.on('error', (err) => {
//   console.error('Socket.IO error:', err);
// });



app.use(cors(
  {origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
   methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
   allowedHeaders: ['Content-Type', 'Authorization'] // Allow specific headers
  }
));
app.use(express.json({
  type: ['application/json', 'text/plain'] ,
  limit: '10mb' 
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.text({ type: 'text/*' }));



// Sensor Routes
app.use("/api/sensor", require("./routes/SensorRoutes"));



module.exports = { app, httpServer };


