// backend/models/SensorData.js
const mongoose = require('mongoose');

const SensorDataSchema = new mongoose.Schema(
  {
    temperature: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      description: 'Temperature in Celsius',
    },
    humidity: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      description: 'Relative humidity in percentage',
    },
  },
  {
    timestamps: true,
    collection: 'sensor_logs',
  }
);

SensorDataSchema.index({ createdAt: -1 });

module.exports = mongoose.model('SensorData', SensorDataSchema);