const calculateDietPlan = (user) => {

  const {
    weight,
    height,
    goal,
    dietType,
  } = user;

  // BMI Formula
  const bmi = (
    weight /
    ((height / 100) * (height / 100))
  ).toFixed(1);

  let bmiCategory = "";

  // BMI Categories
  if (bmi < 18.5) {
    bmiCategory = "Underweight";
  }

  else if (bmi >= 18.5 && bmi < 25) {
    bmiCategory = "Normal";
  }

  else if (bmi >= 25 && bmi < 30) {
    bmiCategory = "Overweight";
  }

  else {
    bmiCategory = "Obese";
  }

  // Daily Calories
  let recommendedCalories = 2000;

  if (goal === "weight_loss") {
    recommendedCalories = 1800;
  }

  else if (goal === "weight_gain") {
    recommendedCalories = 2500;
  }

  // Sample Meal Plan
  let meals = {};

  if (dietType === "veg") {

    meals = {
      breakfast: "Oats + Banana + Milk",
      lunch: "Rice + Dal + Paneer",
      dinner: "Chapati + Vegetables",
    };
  }

  else {

    meals = {
      breakfast: "Eggs + Bread + Milk",
      lunch: "Rice + Chicken + Salad",
      dinner: "Chapati + Fish + Vegetables",
    };
  }

  return {
    bmi,
    bmiCategory,
    recommendedCalories,
    meals,
  };
};

module.exports = calculateDietPlan;