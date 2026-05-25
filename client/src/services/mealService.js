import axios from "axios";

const API = "http://localhost:5000/api/meals";


// ADD MEAL
export const addMeal = async (mealData) => {

  const token = localStorage.getItem("token");

  const response = await axios.post(
    API,
    mealData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};