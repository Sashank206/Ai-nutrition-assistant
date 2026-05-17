const User = require("../models/User");


// GET USER PROFILE
exports.getUserProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// UPDATE USER PROFILE
exports.updateUserProfile = async (req, res) => {
  try {

    const {
      age,
      weight,
      height,
      goal,
      dietType,
    } = req.body;

    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.age = age || user.age;
    user.weight = weight || user.weight;
    user.height = height || user.height;
    user.goal = goal || user.goal;
    user.dietType = dietType || user.dietType;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};