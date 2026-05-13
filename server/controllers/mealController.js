const Meal = require("../models/Meal");
const calculateNutrition = require("../services/calorieService");


// ADD MEAL
exports.addMeal = async (req, res) => {
  try {

    const { foodName, quantity } = req.body;

    const nutrition = calculateNutrition(
      foodName,
      quantity
    );

    if (!nutrition) {
      return res.status(400).json({
        message: "Food item not found",
      });
    }

    const meal = await Meal.create({
      user: req.user,
      foodName,
      quantity,
      calories: nutrition.calories,
      protein: nutrition.protein,
      carbs: nutrition.carbs,
      fats: nutrition.fats,
    });

    res.status(201).json({
      message: "Meal added successfully",
      meal,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// GET USER MEALS
exports.getMeals = async (req, res) => {
  try {

    const meals = await Meal.find({
      user: req.user,
    });

    res.status(200).json(meals);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};