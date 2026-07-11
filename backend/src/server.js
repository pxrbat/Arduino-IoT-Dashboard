const connectDB = require("./config/db.js");
const { app } = require("./app.js");
const { httpServer } = require("./app.js");
const dotenv = require("dotenv");

dotenv.config({
    path: "./.env",
});

const { app, httpServer } = require("./app.js");

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
