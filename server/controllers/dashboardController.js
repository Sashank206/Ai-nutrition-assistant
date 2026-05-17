const Meal = require("../models/Meal");

exports.getDashboardSummary = async (req, res) => {
  try {

    const range = req.query.range || "daily";

    let startDate = new Date();

    // DAILY
    if (range === "daily") {
      startDate.setHours(0, 0, 0, 0);
    }

    // WEEKLY
    else if (range === "weekly") {
      startDate.setDate(startDate.getDate() - 7);
    }

    // MONTHLY
    else if (range === "monthly") {
      startDate.setMonth(startDate.getMonth() - 1);
    }

        //Yearly
        else if (range === "yearly") {
        startDate.setFullYear(startDate.getFullYear() - 1);
        }
        // custom 
        else if (range === "custom") {
         startDate = new Date(req.body.startDate);
         endDate = new Date(req.body.endDate);
        }



    const meals = await Meal.find({
      user: req.user,
      createdAt: {
        $gte: startDate,
      },
    });

    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;

    meals.forEach((meal) => {
      totalCalories += meal.calories;
      totalProtein += meal.protein;
      totalCarbs += meal.carbs;
      totalFats += meal.fats;
    });

    res.status(200).json({
      range,
      totalMeals: meals.length,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFats,
      meals,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};