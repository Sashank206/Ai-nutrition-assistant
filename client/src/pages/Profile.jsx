import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { FiSliders, FiHeart, FiSettings, FiCheck } from "react-icons/fi";

function Profile() {
  const { user, reloadUser } = useAuth();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: 25,
    weight: 70,
    height: 170,
    goal: "maintain",
    dietType: "veg",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Sync state with logged-in user profile
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        age: user.age || 25,
        weight: user.weight || 70,
        height: user.height || 170,
        goal: user.goal || "maintain",
        dietType: user.dietType || "veg",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const value = e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleGoalChange = (goal) => {
    setFormData({ ...formData, goal });
  };

  const handleDietChange = (dietType) => {
    setFormData({ ...formData, dietType });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setErrorMsg("");

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/api/users/profile",
        {
          age: formData.age,
          weight: formData.weight,
          height: formData.height,
          goal: formData.goal,
          dietType: formData.dietType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess(true);
      await reloadUser();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to update profile settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Profile & Goals</h1>
        <p className="text-gray-400 font-light text-sm mt-1">Configure your biometrics, diet objectives, and sync fitness integrations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Biometrics Forms */}
        <div className="lg:col-span-8 bg-[#12141C] border border-[#1F2433] rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-[#1F2433]">
            <FiSliders className="text-emerald-400 text-lg" />
            <h2 className="text-lg font-bold text-white">Biometric Indicators</h2>
          </div>

          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs p-4 rounded-xl flex items-center gap-2">
              <FiCheck className="text-lg" /> Profile settings updated successfully and targets re-calculated!
            </div>
          )}

          {errorMsg && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs p-4 rounded-xl">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Read-Only Account Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-gray-500 font-medium">User Name</label>
                <input
                  type="text"
                  disabled
                  value={formData.name}
                  className="w-full px-4 py-3 bg-[#1F2433]/30 border border-[#1F2433] rounded-xl text-gray-400 text-sm cursor-not-allowed outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-500 font-medium">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={formData.email}
                  className="w-full px-4 py-3 bg-[#1F2433]/30 border border-[#1F2433] rounded-xl text-gray-400 text-sm cursor-not-allowed outline-none"
                />
              </div>
            </div>

            {/* Editable Biometrics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-medium">Age</label>
                <input
                  type="number"
                  name="age"
                  required
                  min="1"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#090A0F] border border-[#1F2433] hover:border-gray-700 focus:border-emerald-500 rounded-xl text-white text-sm outline-none transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-medium">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  required
                  min="1"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#090A0F] border border-[#1F2433] hover:border-gray-700 focus:border-emerald-500 rounded-xl text-white text-sm outline-none transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-medium">Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  required
                  min="1"
                  value={formData.height}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#090A0F] border border-[#1F2433] hover:border-gray-700 focus:border-emerald-500 rounded-xl text-white text-sm outline-none transition-colors"
                />
              </div>
            </div>

            {/* Editable Health Goals */}
            <div className="space-y-2">
              <label className="text-xs text-gray-400 font-medium block">Current Health Target Goal</label>
              <div className="grid grid-cols-3 gap-3">
                {["weight_loss", "maintain", "weight_gain"].map((goalOption) => (
                  <button
                    key={goalOption}
                    type="button"
                    onClick={() => handleGoalChange(goalOption)}
                    className={`p-3.5 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      formData.goal === goalOption
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                        : "bg-[#090A0F] border-[#1F2433] text-gray-400 hover:border-gray-700"
                    }`}
                  >
                    {goalOption.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Editable Diet Type */}
            <div className="space-y-2">
              <label className="text-xs text-gray-400 font-medium block">Dietary Preferences</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: "veg", label: "Vegetarian" },
                  { key: "non_veg", label: "Non-Vegetarian" },
                ].map((dietOption) => (
                  <button
                    key={dietOption.key}
                    type="button"
                    onClick={() => handleDietChange(dietOption.key)}
                    className={`p-3.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      formData.dietType === dietOption.key
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                        : "bg-[#090A0F] border-[#1F2433] text-gray-400 hover:border-gray-700"
                    }`}
                  >
                    {dietOption.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-800 text-black font-semibold py-3 rounded-xl transition-all flex items-center justify-center cursor-pointer mt-8"
            >
              {loading ? "Saving Settings..." : "Save Bio Profile & Re-calculate Targets"}
            </button>

          </form>
        </div>

        {/* Right Side: Integrations Toggles */}
        <div className="lg:col-span-4 bg-[#12141C] border border-[#1F2433] rounded-3xl p-6 flex flex-col justify-between min-h-[300px]">
          <div className="space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-[#1F2433]">
              <FiHeart className="text-cyan-400 text-lg" />
              <h2 className="text-lg font-bold text-white">Integrations</h2>
            </div>
            
            <p className="text-xs text-gray-500 font-light leading-relaxed">
              Sync active calories, heart rate, and workouts from external fitness wearables.
            </p>

            <div className="space-y-3">
              {[
                { name: "Apple Health", active: true },
                { name: "Google Fit", active: false },
                { name: "Fitbit Sync", active: false },
              ].map((item) => (
                <div 
                  key={item.name}
                  className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                    item.active 
                      ? "bg-emerald-500/5 border-emerald-500/20" 
                      : "bg-[#090A0F] border-[#1F2433]"
                  }`}
                >
                  <span className={`text-xs font-semibold ${item.active ? "text-white" : "text-gray-400"}`}>
                    {item.name}
                  </span>
                  
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    item.active 
                      ? "bg-emerald-500/10 text-emerald-400" 
                      : "bg-[#1F2433] text-gray-500"
                  }`}>
                    {item.active ? "Sync Active" : "Disconnected"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-[#1F2433] pt-5 mt-6 flex items-center gap-2 text-[#9CA3AF] text-xs font-light">
            <FiSettings className="text-gray-500 text-base" />
            Device sync refreshes automatically.
          </div>
        </div>

      </div>

    </div>
  );
}

export default Profile;