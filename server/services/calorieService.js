const foodDatabase = {
  roti: {
    calories: 120,
    protein: 3,
    carbs: 20,
    fats: 3,
  },

  rice: {
    calories: 200,
    protein: 4,
    carbs: 45,
    fats: 1,
  },

  dal: {
    calories: 150,
    protein: 8,
    carbs: 20,
    fats: 2,
  },

  paneer: {
    calories: 265,
    protein: 18,
    carbs: 6,
    fats: 20,
  },

  egg: {
    calories: 78,
    protein: 6,
    carbs: 1,
    fats: 5,
  },
};

const calculateNutrition = (foodName, quantity) => {

  const food = foodDatabase[foodName.toLowerCase()];

  if (!food) {
    return null;
  }

  return {
    calories: food.calories * quantity,
    protein: food.protein * quantity,
    carbs: food.carbs * quantity,
    fats: food.fats * quantity,
  };
};

module.exports = calculateNutrition;