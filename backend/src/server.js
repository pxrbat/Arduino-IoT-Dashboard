// backend/server.js
const connectDB = require("./config/db.js");
const { app, httpServer } = require("./app.js");
const dotenv = require("dotenv");

dotenv.config({
    path: "./.env",
});

const PORT = process.env.PORT || 5000;

const RunServer = async () => {
    try {
        await connectDB();
        httpServer.listen(PORT, () => {
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