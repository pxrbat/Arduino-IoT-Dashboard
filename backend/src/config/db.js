const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB Connected");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1); // Stop the server if the database connection fails
  }
};

module.exports = connectDB;