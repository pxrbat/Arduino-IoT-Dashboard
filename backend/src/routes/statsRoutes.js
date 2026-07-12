const express = require("express");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { getDashboardStats } = require("../controller/statsController");

const router = express.Router();

router.get("/", protect, adminOnly, getDashboardStats);

module.exports = router;