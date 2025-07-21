const User = require("../Models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, "secret", { expiresIn: "2h" });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, "secret", { expiresIn: "10d" });
};

// ===================== SIGNUP =====================

const signup = async (req, res) => {
  try {
    const { name, email, phoneNo, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // 🔐 Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save the hashed password
    const user = new User({ name, email, phoneNo, password: hashedPassword });
    await user.save();

    res.status(201).json({
      message: "Signup successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ===================== LOGIN =====================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.token = token;
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      message: "Login successful",
      token,
      refreshToken,
      user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

// ===================== REFRESH TOKEN =====================
const refreshAccessToken = async (req, res) => {
  if (!req.body)
    return res.status(400).json({ message: "Request body is required" });
  const { refreshToken } = req.body;

  if (!refreshToken)
    return res.status(401).json({ message: "Refresh token required" });

  try {
    const decoded = jwt.verify(refreshToken, "secret");

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken(user._id);
    user.token = newAccessToken;
    await user.save();

    res.status(200).json({
      message: "New access token generated",
      token: newAccessToken,
    });
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Refresh token expired or invalid" });
  }
};

// ===================== LOGOUT =====================
const logout = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.token = null;
    user.refreshToken = null;
    await user.save();

    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  signup,
  login,
  refreshAccessToken,
  logout,
};



