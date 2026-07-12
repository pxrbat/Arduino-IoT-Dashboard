const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  register,
  login,
  updateProfile,
  changePassword,
} = require("../controller/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.put("/profile", protect, updateProfile);
router.put("/password", protect, changePassword);

module.exports = router;