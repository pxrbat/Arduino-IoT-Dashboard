const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const app = express();
connectDB();

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


module.exports = app;


