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
     mq135: {
      type: Number,
      required: true,
      description: "Raw MQ-135 ADC value",
    },
    airQualityScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      description: "Calculated air quality score",
    },
    airQualityStatus: {
      type: String,
      required: true,
      enum: [
        "Excellent",
        "Good",
        "Moderate",
        "Poor",
        "Very Poor",
      ],
      description: "Air quality status",
    },
  },
  {
    timestamps: true,
    collection: 'sensor_logs',
  }
);

SensorDataSchema.index({ createdAt: -1 });

module.exports = mongoose.model('SensorData', SensorDataSchema);