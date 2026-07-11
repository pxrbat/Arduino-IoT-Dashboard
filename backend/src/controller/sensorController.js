// backend/controller/sensorController.js
const SensorData = require("../models/SensorData");
const ThresholdConfig = require("../models/ThresholdConfig");
const { getIO } = require("../socket.js");

const addSensorData = async (req, res) => {
    const { temperature, humidity } = req.body;
    if (temperature === undefined || humidity === undefined) {
        return res.status(400).json({
            message: "Temperature and Humidity are required fields.",
        });
    }

    if (temperature < 0 || temperature > 100) {
        return res.status(400).json({
            message: "Temperature must be between 0 and 100 °C.",
        });
    }

    if (humidity < 0 || humidity > 100) {
        return res.status(400).json({
            message: "Humidity must be between 0 and 100 %.",
        });
    }

    try {
        const data = await SensorData.create({ temperature, humidity });
        emitSensorData();
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Returns the most recent readings, newest first. Defaults to 40 to match
// the frontend's rolling log window; pass ?limit= to override.
const getSensorData = async (req, res) => {
    try {
        const limit = Math.min(Number(req.query.limit) || 40, 500);
        const data = await SensorData.find().sort({ createdAt: -1 }).limit(limit);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Wipes all stored sensor readings. Used by the admin "purge logs" action —
// irreversible, so the frontend is expected to confirm before calling this.
const clearSensorData = async (req, res) => {
    try {
        const result = await SensorData.deleteMany({});
        res.status(200).json({
            message: "Sensor logs cleared.",
            deletedCount: result.deletedCount,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const emitSensorData = async (req, res) => {
    try {
        const io = getIO();
        const data = await SensorData.find().sort({ createdAt: -1 }).limit(1);
        const Data = data.map((log) => ({
            temperature: log.temperature,
            humidity: log.humidity,
            timestamp: log.createdAt,
        }));

        if (data.length > 0) {
            io.emit("newSensorData", Data);
        }
        if (res) {
            res.status(200).json({ message: "Sensor data emitted successfully.", data: Data });
        }
    } catch (error) {
        console.error("Error emitting sensor data:", error);
        if (res) {
            res.status(500).json({ message: "Error emitting sensor data." });
        }
    }
};

const getThreshold = async (req, res) => {
    try {
        const config = await ThresholdConfig.getConfig();
        res.status(200).json(config);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Partial update — only overwrites fields present in the request body.
const updateThreshold = async (req, res) => {
    const { tempThreshold, humidityThreshold, co2Threshold, pm25Threshold } = req.body;

    const updates = {};
    if (tempThreshold !== undefined) updates.tempThreshold = tempThreshold;
    if (humidityThreshold !== undefined) updates.humidityThreshold = humidityThreshold;
    if (co2Threshold !== undefined) updates.co2Threshold = co2Threshold;
    if (pm25Threshold !== undefined) updates.pm25Threshold = pm25Threshold;

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: "No valid threshold fields provided." });
    }

    try {
        const config = await ThresholdConfig.getConfig();
        Object.assign(config, updates);
        await config.save();
        res.status(200).json(config);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const calculateAverageTemperature = async () => {
    try {
        const result = await SensorData.aggregate([
            {
                $group: {
                    _id: null,
                    averageTemperature: { $avg: "$temperature" },
                },
            },
        ]);
        return result[0] ? result[0].averageTemperature : null;
    } catch (error) {
        console.error("Error calculating average temperature:", error);
        return null;
    }
};

const calculateAverageHumidity = async () => {
    try {
        const result = await SensorData.aggregate([
            {
                $group: {
                    _id: null,
                    averageHumidity: { $avg: "$humidity" },
                },
            },
        ]);
        return result[0] ? result[0].averageHumidity : null;
    } catch (error) {
        console.error("Error calculating average humidity:", error);
        return null;
    }
};

module.exports = {
    addSensorData,
    getSensorData,
    clearSensorData,
    calculateAverageTemperature,
    calculateAverageHumidity,
    emitSensorData,
    getThreshold,
    updateThreshold,
};