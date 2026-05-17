const User = require("../models/User");

const calculateDietPlan = require(
  "../services/dietService"
);


// GET DIET PLAN
exports.getDietPlan = async (req, res) => {

  try {

    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const dietPlan = calculateDietPlan(user);

    res.status(200).json(dietPlan);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};