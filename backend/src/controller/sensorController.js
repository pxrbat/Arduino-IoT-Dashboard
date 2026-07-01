const SensorData = require("../models/SensorData");
const { io } = require("../app.js");

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
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const getSensorData = async (req, res) => {
    try {
        const data = await SensorData.find();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const emitSensorData = async () => {
    try {
        const data = await SensorData.find().sort({ createdAt: -1 }).limit(1);
        console.log("Emitting sensor data:", data);
        const Data = data.map((log) => ({
            temperature: log.temperature,
            humidity: log.humidity,
            timestamp: log.createdAt,
        }));

        if (data.length > 0) {
            io.emit("newSensorData", Data);
        }
    } catch (error) {
        console.error("Error emitting sensor data:", error);
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
    calculateAverageTemperature,
    calculateAverageHumidity,
    emitSensorData,
};
