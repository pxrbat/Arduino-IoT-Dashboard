const User = require("../models/User");
const SensorData = require("../models/SensorData");
const { calculateAverageTemperature, calculateAverageHumidity } = require("./sensorController");

// @desc    Get high-level stats for the admin dashboard overview
// @route   GET /api/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, adminCount, totalReadings, latestReading, avgTemperature, avgHumidity] =
      await Promise.all([
        User.countDocuments({}),
        User.countDocuments({ role: "admin" }),
        SensorData.countDocuments({}),
        SensorData.findOne().sort({ createdAt: -1 }),
        calculateAverageTemperature(),
        calculateAverageHumidity(),
      ]);

    res.status(200).json({
      totalUsers,
      adminCount,
      memberCount: totalUsers - adminCount,
      totalReadings,
      averageTemperature: avgTemperature !== null ? Number(avgTemperature.toFixed(1)) : null,
      averageHumidity: avgHumidity !== null ? Number(avgHumidity.toFixed(1)) : null,
      lastReadingAt: latestReading ? latestReading.createdAt : null,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };