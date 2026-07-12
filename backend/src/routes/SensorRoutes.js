// backend/routes/SensorRoutes.js
const express = require("express");
const {protect, adminOnly} = require("../middleware/authMiddleware");

const router = express.Router();

const {
  addSensorData,
  getSensorData,
  clearSensorData,
  emitSensorData,
  getThreshold,
  updateThreshold,
} = require("../controller/sensorController");

router.post("/data", addSensorData);
router.get("/data", getSensorData);
router.delete("/data", protect, adminOnly, clearSensorData);

router.get("/emit", emitSensorData);

router.get("/threshold", getThreshold);
router.put("/threshold", protect, adminOnly, updateThreshold);

module.exports = router;