import React, { useState } from "react";
import { addMeal } from "../services/mealService";
import { FiPlus } from "react-icons/fi";

function AddMealForm({ onMealAdded }) {
  const [formData, setFormData] = useState({
    foodName: "",
    quantity: 1,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.type === "number" ? Number(e.target.value) : e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.foodName) return;
    setLoading(true);

    try {
      await addMeal(formData);
      setFormData({
        foodName: "",
        quantity: 1,
      });
      onMealAdded();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add meal log");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#12141C] border border-[#1F2433] p-6 rounded-3xl min-h-[220px] flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-bold text-white mb-1">Quick Log Meal</h3>
        <p className="text-xs text-gray-500 font-light mb-4">Quick search database: roti, rice, dal, paneer, egg.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          name="foodName"
          required
          placeholder="e.g. Rice, paneer, dal..."
          value={formData.foodName}
          onChange={handleChange}
          className="flex-1 px-4 py-2.5 rounded-xl bg-[#090A0F] border border-[#1F2433] hover:border-gray-700 focus:border-emerald-500 text-white text-sm outline-none transition-colors"
        />

        <div className="flex gap-2.5 sm:w-[150px]">
          <input
            type="number"
            name="quantity"
            min="1"
            required
            value={formData.quantity}
            onChange={handleChange}
            className="w-20 px-3 py-2.5 rounded-xl bg-[#090A0F] border border-[#1F2433] hover:border-gray-700 focus:border-emerald-500 text-white text-sm outline-none transition-colors text-center"
          />

          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-800 text-black text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
          >
            <FiPlus /> {loading ? "Adding..." : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddMealForm;