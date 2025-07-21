const express = require("express");
const router = express.Router();
const authMiddleware = require("../Middlewares/auth");
const {
  signup,
  login,
  refreshAccessToken,
  logout
} = require("../controllers/auth.controller");

router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", authMiddleware, logout);

module.exports = router;
