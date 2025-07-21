const express = require("express");
const router = express.Router();
const auth = require("../Middlewares/auth");
const {
  getProfile,
  updateProfile,
  deleteUser,
} = require("../controllers/user.controller");

// /api/user/profile
router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);
router.delete("/profile", auth, deleteUser);

module.exports = router;
