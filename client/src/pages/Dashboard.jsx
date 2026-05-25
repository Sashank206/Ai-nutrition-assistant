import { useEffect, useState } from "react";
import AddMealForm from "../components/AddMealForm";

import AnalyticsCard from "../components/AnalyticsCard";

import { getDashboardSummary }
from "../services/dashboardService";



function Dashboard() {

  const [summary, setSummary] = useState(null);

  const [range, setRange] = useState("daily");


  useEffect(() => {

    fetchDashboard();

  }, [range]);


  const fetchDashboard = async () => {

    try {

      const data = await getDashboardSummary(range);

      setSummary(data);

    } catch (error) {

      console.log(error);
    }
  };


  if (!summary) {
    return (
      <div className="text-white p-10">
        Loading...
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-black text-white p-10">

      <div className="flex items-center justify-between mb-8">

        <h1 className="text-4xl font-bold">
          Dashboard 📊
        </h1>


        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="bg-gray-800 p-3 rounded-lg"
        >

          <option value="daily">
            Daily
          </option>

          <option value="weekly">
            Weekly
          </option>

          <option value="monthly">
            Monthly
          </option>

          <option value="yearly">
            Yearly
          </option>

        </select>
      </div>

      
      <AddMealForm onMealAdded={fetchDashboard} />
      {/* ANALYTICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

        <AnalyticsCard
          title="Calories"
          value={summary.totalCalories}
        />

        <AnalyticsCard
          title="Protein"
          value={`${summary.totalProtein} g`}
        />

        <AnalyticsCard
          title="Carbs"
          value={`${summary.totalCarbs} g`}
        />

        <AnalyticsCard
          title="Fats"
          value={`${summary.totalFats} g`}
        />

      </div>


      {/* MEAL TABLE */}
      <div className="bg-gray-900 rounded-2xl p-6">

        <h2 className="text-2xl font-bold mb-6">
          Meal History 🍽️
        </h2>

        <table className="w-full">

          <thead>

            <tr className="text-left border-b border-gray-700">

              <th className="pb-4">Food</th>

              <th className="pb-4">Quantity</th>

              <th className="pb-4">Calories</th>

              <th className="pb-4">Protein</th>

            </tr>

          </thead>


          <tbody>

            {summary.meals.map((meal) => (

              <tr
                key={meal._id}
                className="border-b border-gray-800"
              >

                <td className="py-4">
                  {meal.foodName}
                </td>

                <td className="py-4">
                  {meal.quantity}
                </td>

                <td className="py-4">
                  {meal.calories}
                </td>

                <td className="py-4">
                  {meal.protein} g
                </td>

              </tr>
            ))}

          </tbody>

        </table>
      </div>
    </div>
  );
}

export default Dashboard;