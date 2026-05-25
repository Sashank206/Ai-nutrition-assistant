import { useState } from "react";

import { addMeal } from "../services/mealService";


function AddMealForm({ onMealAdded }) {

  const [formData, setFormData] = useState({
    foodName: "",
    quantity: 1,
  });


  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await addMeal(formData);

      alert("Meal added successfully");

      setFormData({
        foodName: "",
        quantity: 1,
      });

      onMealAdded();

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Failed to add meal"
      );
    }
  };


  return (
    <div className="bg-gray-900 p-6 rounded-2xl mb-10">

      <h2 className="text-2xl font-bold mb-6 text-white">
        Add Meal 🍽️
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row gap-4"
      >

        <input
          type="text"
          name="foodName"
          placeholder="Food Name"
          value={formData.foodName}
          onChange={handleChange}
          className="flex-1 p-3 rounded-lg bg-gray-800 text-white"
        />

        <input
          type="number"
          name="quantity"
          min="1"
          value={formData.quantity}
          onChange={handleChange}
          className="w-[120px] p-3 rounded-lg bg-gray-800 text-white"
        />

        <button
          className="bg-green-500 px-6 py-3 rounded-lg text-white font-semibold"
        >
          Add
        </button>

      </form>
    </div>
  );
}

export default AddMealForm;