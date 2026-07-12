// backend/app.js — corrected
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const { createServer } = require("node:http");
const { initSocket } = require("./socket.js");

const app = express();
const httpServer = createServer(app);

initSocket(httpServer);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(
  express.json({
    type: ["application/json", "text/plain"],
    limit: "10mb",
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.text({ type: 'text/*' }));

// Auth Routes
app.use("/api/auth", require("./routes/authRoutes"));

app.use("/api/sensor", require("./routes/SensorRoutes"));

app.use("/api/users", require("./routes/userRoutes"));

app.use("/api/stats", require("./routes/statsRoutes"));

module.exports = { app, httpServer };