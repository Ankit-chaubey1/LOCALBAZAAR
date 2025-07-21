const User = require("../Models/user.model");

// GET current user details
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password -__v");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE current user profile
exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.userId, updates, {
      new: true,
    }).select("-password -__v");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "Profile updated", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE user account
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.userId);
    res.status(200).json({ message: "User account deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
