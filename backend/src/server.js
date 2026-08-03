const connectDB = require("./config/db.js");
const { app, httpServer } = require("./app.js");
const dotenv = require("dotenv");
const { WebSocketServer } = require("ws");

dotenv.config({
    path: "./.env",
});

const PORT = process.env.PORT || 5000;

const wss = new WebSocketServer({
    server: httpServer,
    path: "/esp32"
});

let esp32Socket = null;

wss.on("connection", (ws) => {
    console.log("ESP32 connected via WebSocket");
    esp32Socket = ws;

    ws.on("close", ()=>{
        console.log("ESP32 disconnected");
        esp32Socket = null;
    })

    ws.on("message", (message) => {
        console.log("Received message from ESP32:", message.toString());
    });
});

global.esp32Socket = () => esp32Socket;

const RunServer = async () => {
    try {
        await connectDB();
        httpServer.listen(PORT, "0.0.0.0",() => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
};

RunServer()
    .then(() => {
        console.log("Server started successfully");
    })
    .catch((err) => {
        console.error("Error starting server:", err);
    });

    