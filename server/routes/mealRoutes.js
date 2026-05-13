const express = require("express");

const {
  addMeal,
  getMeals,
} = require("../controllers/mealController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, addMeal);

router.get("/", protect, getMeals);

module.exports = router;