import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboardSummary } from "../services/dashboardService";
import { useAuth } from "../context/AuthContext";
import { FiPlus, FiChevronRight, FiAlertCircle, FiDroplet, FiClock } from "react-icons/fi";
import AddMealForm from "../Components/AddMealForm"; // Fixed path case: capital C

function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [range, setRange] = useState("daily");
  
  // Hydration state (persisted locally)
  const [waterIntake, setWaterIntake] = useState(() => {
    const saved = localStorage.getItem(`water_${user?._id || "guest"}`);
    return saved ? Number(saved) : 0;
  });

  useEffect(() => {
    fetchDashboard();
  }, [range]);

  useEffect(() => {
    localStorage.setItem(`water_${user?._id || "guest"}`, waterIntake);
  }, [waterIntake, user]);

  const fetchDashboard = async () => {
    try {
      const data = await getDashboardSummary(range);
      setSummary(data);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  const handleAddWater = (amount) => {
    setWaterIntake((prev) => Math.min(prev + amount, 4000));
  };

  const handleResetWater = () => {
    setWaterIntake(0);
  };

  if (!summary) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-gray-400 font-medium">Assembling metrics...</span>
        </div>
      </div>
    );
  }

  // Calculate targets based on goals
  let calorieTarget = 2000;
  if (user?.goal === "weight_loss") calorieTarget = 1800;
  if (user?.goal === "weight_gain") calorieTarget = 2500;

  const proteinTarget = user?.weight ? Math.round(user.weight * 1.8) : 130;
  const carbsTarget = 220;
  const fatsTarget = 65;

  const caloriePct = Math.min((summary.totalCalories / calorieTarget) * 100, 100);
  const proteinPct = Math.min((summary.totalProtein / proteinTarget) * 100, 100);
  const carbsPct = Math.min((summary.totalCarbs / carbsTarget) * 100, 100);
  const fatsPct = Math.min((summary.totalFats / fatsTarget) * 100, 100);

  // SVG Circumference calculation for circular gauge
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (caloriePct / 100) * circumference;

  // Custom AI Advice text builder
  let advice = "";
  if (summary.totalCalories === 0) {
    advice = "You haven't logged any meals yet today. Let's start by snapping a photo of your breakfast!";
  } else if (summary.totalProtein < proteinTarget * 0.5) {
    advice = "Your protein intake is currently low today. Consider adding a high-protein snack, like Greek yogurt or beef jerky, to protect muscle mass.";
  } else if (summary.totalCalories > calorieTarget) {
    advice = "You have exceeded your daily calorie target. Focus on high-fiber greens and lean protein for the rest of the day to maximize satiety.";
  } else {
    advice = "Great consistency! Your macro balance is looking stable. Remember to keep hydrating regularly.";
  }

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Welcome, {user?.name || "Achiever"}!</h1>
          <p className="text-gray-400 font-light text-sm mt-1">Here is your nutritional status for today.</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="bg-[#12141C] border border-[#1F2433] hover:border-gray-700 text-gray-300 text-sm px-4 py-2.5 rounded-xl outline-none cursor-pointer"
          >
            <option value="daily">Daily Summary</option>
            <option value="weekly">Weekly Summary</option>
            <option value="monthly">Monthly Summary</option>
          </select>

          <Link 
            to="/add-meal"
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 active:scale-95 shadow-md shadow-emerald-500/10"
          >
            <FiPlus className="text-base" /> Log Meal
          </Link>
        </div>
      </div>

      {/* Grid Layout Row 1: Metrics Rings & AI Advice */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Caloric Gauge Ring Card */}
        <div className="lg:col-span-5 bg-[#12141C] border border-[#1F2433] rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden min-h-[300px]">
          <div className="absolute top-4 left-6 text-sm font-semibold text-white">Daily Calorie Gauge</div>
          
          <div className="relative flex items-center justify-center mt-4">
            {/* SVG Circle Gauge */}
            <svg className="w-40 h-40 transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-[#1F2433]"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-emerald-400 transition-all duration-500 ease-out"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center text-center">
              <span className="text-3xl font-bold text-white">{summary.totalCalories}</span>
              <span className="text-xs text-gray-500 mt-0.5">/ {calorieTarget} kcal</span>
            </div>
          </div>

          <div className="w-full grid grid-cols-3 gap-2 mt-8 text-center text-xs">
            <div className="bg-[#1F2433]/30 p-2.5 rounded-xl border border-[#2B3042]/50">
              <div className="text-gray-500 mb-0.5">Protein</div>
              <div className="text-white font-bold">{summary.totalProtein}g</div>
              <div className="w-full bg-[#1F2433] h-1 rounded-full mt-1.5 overflow-hidden">
                <div className="bg-emerald-400 h-full" style={{ width: `${proteinPct}%` }} />
              </div>
            </div>
            <div className="bg-[#1F2433]/30 p-2.5 rounded-xl border border-[#2B3042]/50">
              <div className="text-gray-500 mb-0.5">Carbs</div>
              <div className="text-white font-bold">{summary.totalCarbs}g</div>
              <div className="w-full bg-[#1F2433] h-1 rounded-full mt-1.5 overflow-hidden">
                <div className="bg-cyan-400 h-full" style={{ width: `${carbsPct}%` }} />
              </div>
            </div>
            <div className="bg-[#1F2433]/30 p-2.5 rounded-xl border border-[#2B3042]/50">
              <div className="text-gray-500 mb-0.5">Fats</div>
              <div className="text-white font-bold">{summary.totalFats}g</div>
              <div className="w-full bg-[#1F2433] h-1 rounded-full mt-1.5 overflow-hidden">
                <div className="bg-amber-400 h-full" style={{ width: `${fatsPct}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* AI Quick Advice Panel */}
        <div className="lg:col-span-7 bg-[#12141C] border border-[#1F2433] rounded-3xl p-6 flex flex-col justify-between min-h-[300px]">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-semibold mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
              AI Advisor Snapshot
            </div>
            <h3 className="text-xl font-bold text-white mb-3 leading-snug">Personalized feedback based on your profile:</h3>
            <p className="text-[#F3F4F6] text-sm leading-relaxed font-light">{advice}</p>
          </div>

          <div className="border-t border-[#1F2433] pt-5 mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <FiAlertCircle className="text-amber-400 text-lg flex-shrink-0" />
              <div className="text-xs text-gray-400 font-light">
                Aim for <span className="text-white font-medium">{proteinTarget}g Protein</span> for muscle preservation.
              </div>
            </div>
            <Link 
              to="/chatbot" 
              className="text-cyan-400 hover:text-cyan-300 text-xs font-semibold flex items-center gap-1 group self-end sm:self-auto"
            >
              Consult Chatbot
              <FiChevronRight className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

      </div>

      {/* Row 2: Hydration & Add Quick Meal Form */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Hydration Widget */}
        <div className="md:col-span-5 bg-[#12141C] border border-[#1F2433] rounded-3xl p-6 flex flex-col justify-between min-h-[220px]">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FiDroplet className="text-cyan-400" />
              Hydration Tracker
            </h3>
            <div className="text-xs text-gray-500 font-light mt-1">Recommended daily fluid limit: 3,000ml</div>
            
            <div className="my-6">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-2xl font-bold text-cyan-400">{waterIntake} <span className="text-xs font-normal text-gray-400">ml</span></span>
                <span className="text-xs text-gray-500">Goal: {Math.round((waterIntake/3000)*100)}%</span>
              </div>
              <div className="w-full bg-[#1F2433] h-2.5 rounded-full overflow-hidden">
                <div className="bg-cyan-400 h-full transition-all duration-300" style={{ width: `${Math.min((waterIntake/3000)*100, 100)}%` }} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button 
              onClick={() => handleAddWater(250)}
              className="flex-1 bg-[#1F2433] hover:bg-[#2A2F3E] text-xs font-semibold py-2.5 rounded-xl border border-[#2B3042] text-gray-300 transition-colors"
            >
              +250 ml
            </button>
            <button 
              onClick={() => handleAddWater(500)}
              className="flex-1 bg-[#1F2433] hover:bg-[#2A2F3E] text-xs font-semibold py-2.5 rounded-xl border border-[#2B3042] text-gray-300 transition-colors"
            >
              +500 ml
            </button>
            <button 
              onClick={handleResetWater}
              className="px-3 py-2.5 rounded-xl text-rose-500 hover:bg-rose-500/10 text-xs font-semibold transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Quick Log Form */}
        <div className="md:col-span-7">
          <AddMealForm onMealAdded={fetchDashboard} />
        </div>

      </div>

      {/* Row 3: Meal History Timeline */}
      <div className="bg-[#12141C] border border-[#1F2433] rounded-3xl p-6">
        <div className="flex items-center justify-between mb-6 border-b border-[#1F2433] pb-4">
          <h3 className="text-lg font-bold text-white">Daily Meal History</h3>
          <span className="text-xs text-[#9CA3AF] bg-[#1F2433] px-2.5 py-1 rounded-full">
            {summary.meals.length} Meals Logged
          </span>
        </div>

        {summary.meals.length === 0 ? (
          <div className="py-12 text-center text-gray-500 font-light text-sm space-y-2">
            <div>🍽️ No food logged today.</div>
            <Link to="/add-meal" className="text-emerald-400 font-semibold hover:underline inline-block mt-2">Log your first meal</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1F2433] text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="pb-3 pr-4">Time / Meal</th>
                  <th className="pb-3 pr-4">Calories</th>
                  <th className="pb-3 pr-4">Protein</th>
                  <th className="pb-3 pr-4">Carbs</th>
                  <th className="pb-3 pr-4">Fats</th>
                  <th className="pb-3 text-right">Quantity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f2433]/50 text-sm">
                {summary.meals.map((meal, index) => (
                  <tr key={meal._id || index} className="hover:bg-gray-800/10 transition-colors">
                    <td className="py-4 pr-4 font-semibold text-white flex items-center gap-2">
                      <FiClock className="text-emerald-400 text-xs flex-shrink-0" />
                      <div>
                        <div>{meal.foodName}</div>
                        <span className="text-[10px] text-gray-500 font-normal">Logged Today</span>
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-emerald-400 font-bold">{meal.calories} kcal</td>
                    <td className="py-4 pr-4 text-gray-300">{meal.protein}g</td>
                    <td className="py-4 pr-4 text-gray-300">{meal.carbs}g</td>
                    <td className="py-4 pr-4 text-gray-300">{meal.fats}g</td>
                    <td className="py-4 text-right font-medium text-gray-400">{meal.quantity} serving(s)</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

export default Dashboard;