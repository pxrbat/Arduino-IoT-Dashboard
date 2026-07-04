const connectDB = require("./config/db.js");
const { app } = require("./app.js");
const { httpServer } = require("./app.js");
const dotenv = require("dotenv");

dotenv.config({
    path: "./.env",
});

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

const RunServer = async () => {
    try {
        await connectDB(MONGODB_URI);
        console.log("MongoDB Connected");
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
