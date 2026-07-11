const express = require("express");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
  getUsers,
  updateUserRole,
  deleteUser,
} = require("../controller/userController");

const router = express.Router();

// Every route here requires: 1) a valid logged-in user (protect),
// and 2) that user being an admin (adminOnly).
router.get("/", protect, adminOnly, getUsers);
router.put("/:id/role", protect, adminOnly, updateUserRole);
router.delete("/:id", protect, adminOnly, deleteUser);

module.exports = router;