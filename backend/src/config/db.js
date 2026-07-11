const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const SensorData = require("../models/SensorData");
const ThresholdConfig = require("../models/ThresholdConfig");

const DB_PATH = path.resolve(__dirname, "db_fallback.json");

const loadDB = () => {
  if (!fs.existsSync(DB_PATH)) {
    // Seed default demo users in JSON if they don't exist
    const adminPasswordHash = bcrypt.hashSync("admin123", 10);
    const userPasswordHash = bcrypt.hashSync("user123", 10);
    const initialDB = {
      users: [
        {
          _id: "admin_id_123",
          name: "System Admin",
          email: "admin@iot.local",
          password: adminPasswordHash,
          role: "admin",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: "user_id_123",
          name: "Guest Operator",
          email: "user@iot.local",
          password: userPasswordHash,
          role: "user",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      sensordatas: [],
      thresholdconfigs: [],
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initialDB, null, 2));
    return initialDB;
  }
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
  } catch (e) {
    return { users: [], sensordatas: [], thresholdconfigs: [] };
  }
};

const saveDB = (data) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

const setupFallback = () => {
  console.log("--------------------------------------------------");
  console.log("WARNING: Local MongoDB was not detected/connected.");
  console.log("Setting up local JSON file-based database fallback");
  console.log(`Path: ${DB_PATH}`);
  console.log("--------------------------------------------------");

  const db = loadDB();

  // Mock User statics
  User.findOne = async function (query) {
    const data = loadDB();
    const email = query.email ? query.email.toLowerCase() : null;
    const user = data.users.find((u) => u.email === email);
    if (!user) return null;

    return {
      ...user,
      matchPassword: async function (enteredPassword) {
        return bcrypt.compare(enteredPassword, this.password);
      },
    };
  };

  User.create = async function (doc) {
    const data = loadDB();
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(doc.password, salt);

    const newUser = {
      _id: "user_" + Math.random().toString(36).substr(2, 9),
      name: doc.name,
      email: doc.email.toLowerCase(),
      password: passwordHash,
      role: doc.role || "user",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    data.users.push(newUser);
    saveDB(data);

    return {
      ...newUser,
      matchPassword: async function (enteredPassword) {
        return bcrypt.compare(enteredPassword, this.password);
      },
    };
  };

  // Mock SensorData statics
  SensorData.create = async function (doc) {
    const data = loadDB();
    const newReading = {
      _id: "sensor_" + Math.random().toString(36).substr(2, 9),
      temperature: doc.temperature,
      humidity: doc.humidity,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    data.sensordatas.push(newReading);
    saveDB(data);
    return newReading;
  };

  SensorData.find = function () {
    const data = loadDB();
    let results = [...data.sensordatas];

    const queryObj = {
      sort: function (sortOpts) {
        if (sortOpts && sortOpts.createdAt === -1) {
          results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        return queryObj;
      },
      limit: function (n) {
        results = results.slice(0, n);
        return queryObj;
      },
      map: function (fn) {
        return results.map(fn);
      },
      then: function (onResolve) {
        return Promise.resolve(results).then(onResolve);
      },
    };

    return queryObj;
  };

  SensorData.aggregate = async function (pipeline) {
    const data = loadDB();
    if (data.sensordatas.length === 0) return [];

    const temps = data.sensordatas.map((d) => d.temperature);
    const hums = data.sensordatas.map((d) => d.humidity);

    const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
    const avgHum = hums.reduce((a, b) => a + b, 0) / hums.length;

    const groupStage = pipeline.find((stage) => stage.$group);
    if (groupStage) {
      const isTemp = groupStage.$group.averageTemperature;
      if (isTemp) {
        return [{ _id: null, averageTemperature: avgTemp }];
      } else {
        return [{ _id: null, averageHumidity: avgHum }];
      }
    }
    return [];
  };

  // Mock ThresholdConfig statics
  ThresholdConfig.findOne = async function () {
    const data = loadDB();
    if (data.thresholdconfigs.length === 0) return null;
    return data.thresholdconfigs[0];
  };

  ThresholdConfig.create = async function (doc) {
    const data = loadDB();
    const newConfig = {
      _id: "config_123",
      tempThreshold: doc.tempThreshold || 32.0,
      humidityThreshold: doc.humidityThreshold || 40.0,
      co2Threshold: doc.co2Threshold || 1000.0,
      pm25Threshold: doc.pm25Threshold || 35.0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    data.thresholdconfigs = [newConfig];
    saveDB(data);
    return newConfig;
  };
};

const seedUsers = async () => {
  try {
    const adminEmail = "admin@iot.local";
    const userEmail = "user@iot.local";

    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      await User.create({
        name: "System Admin",
        email: adminEmail,
        password: "admin123",
        role: "admin",
      });
      console.log("Seeded admin@iot.local account successfully");
    }

    const userExists = await User.findOne({ email: userEmail });
    if (!userExists) {
      await User.create({
        name: "Guest Operator",
        email: userEmail,
        password: "user123",
        role: "user",
      });
      console.log("Seeded user@iot.local account successfully");
    }
  } catch (err) {
    console.error("Error seeding users:", err);
  }
};

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/IOT", {
      serverSelectionTimeoutMS: 2000, // Quick timeout to fail fast
    });
    console.log("MongoDB Connected");
    await seedUsers();
  } catch (err) {
    console.log(`Failed to connect to MongoDB: ${err.message}`);
    setupFallback();
  }
};


module.exports = connectDB;