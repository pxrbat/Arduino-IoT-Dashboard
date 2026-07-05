const mongoose = require('mongoose');

const ThresholdConfigSchema = new mongoose.Schema(
  {
    tempThreshold: {
      type: Number,
      default: 32.0,
      description: 'Temperature threshold in Celsius above which fan runs',
    },
    humidityThreshold: {
      type: Number,
      default: 40.0,
      description: 'Humidity threshold in percentage below which mist maker runs',
    },
    co2Threshold: {
      type: Number,
      default: 1000.0,
      description: 'CO2 alert threshold in ppm',
    },
    pm25Threshold: {
      type: Number,
      default: 35.0,
      description: 'PM2.5 alert threshold in ug/m3',
    },
  },
  {
    timestamps: true,
    collection: 'threshold_config',
  }
);

ThresholdConfigSchema.statics.getConfig = async function () {
  let config = await this.findOne();
  if (!config) {
    config = await this.create({});
  }
  return config;
};

module.exports = mongoose.model('ThresholdConfig', ThresholdConfigSchema);
