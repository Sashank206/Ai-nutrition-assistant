import React, { useState } from "react";
import { addMeal } from "../services/mealService";
import { FiCamera, FiMic, FiSearch, FiLoader, FiCheckCircle } from "react-icons/fi";

function AddMeal() {
  const [activeTab, setActiveTab] = useState("camera"); // camera, voice, manual
  
  // Manual form state
  const [manualName, setManualName] = useState("");
  const [manualQuantity, setManualQuantity] = useState(1);
  const [manualLoading, setManualLoading] = useState(false);

  // Simulated AI Scanning states
  const [scanning, setScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState(null);
  const [loggingSuccess, setLoggingSuccess] = useState(false);

  // Voice states
  const [listening, setListening] = useState(false);
  const [voiceText, setVoiceText] = useState("");

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!manualName) return;
    setManualLoading(true);
    setLoggingSuccess(false);

    try {
      await addMeal({
        foodName: manualName,
        quantity: manualQuantity,
      });
      setLoggingSuccess(true);
      setManualName("");
      setManualQuantity(1);
      setTimeout(() => setLoggingSuccess(false), 3000);
    } catch (err) {
      alert("Failed to log meal manually.");
    } finally {
      setManualLoading(false);
    }
  };

  const handleCapture = () => {
    setScanning(true);
    setScannedResult(null);
    setLoggingSuccess(false);

    // Simulate AI image recognition processing
    setTimeout(() => {
      setScanning(false);
      setScannedResult({
        foodName: "Paneer salad bowl",
        quantity: 1,
        calories: 385,
        protein: 24,
        carbs: 12,
        fats: 22,
      });
    }, 2000);
  };

  const handleVoiceListen = () => {
    if (listening) {
      setListening(false);
      setVoiceText("Listening finished. Transcribing: 'I ate a bowl of rice and some yellow dal for lunch.'");
    } else {
      setListening(true);
      setVoiceText("Listening: speak your meal details clearly...");
      
      setTimeout(() => {
        setListening(false);
        setVoiceText("Transcribed: 'I ate a bowl of rice and some yellow dal for lunch.'");
        setScannedResult({
          foodName: "Rice + Dal",
          quantity: 1,
          calories: 350,
          protein: 12,
          carbs: 65,
          fats: 3,
        });
      }, 3000);
    }
  };

  const handleLogScanned = async () => {
    if (!scannedResult) return;
    setManualLoading(true);
    try {
      await addMeal({
        foodName: scannedResult.foodName,
        quantity: scannedResult.quantity,
      });
      setLoggingSuccess(true);
      setScannedResult(null);
      setTimeout(() => setLoggingSuccess(false), 3000);
    } catch (err) {
      alert("Failed to log processed meal.");
    } finally {
      setManualLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Add Meal Log</h1>
        <p className="text-gray-400 font-light text-sm mt-1">Select your preferred input method to log food calories instantly.</p>
      </div>

      {/* Tabs list */}
      <div className="flex bg-[#12141C] border border-[#1F2433] rounded-2xl p-1.5 max-w-lg">
        {[
          { key: "camera", label: "AI Photo Scan", icon: <FiCamera /> },
          { key: "voice", label: "Voice Logger", icon: <FiMic /> },
          { key: "manual", label: "Manual Database", icon: <FiSearch /> },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setScannedResult(null);
              setLoggingSuccess(false);
              setVoiceText("");
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === tab.key
                ? "bg-emerald-500 text-black shadow-lg"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tab.icon}
            {tab.label.split(" ")[1] || tab.label}
          </button>
        ))}
      </div>

      {/* Logging Feedback Alerts */}
      {loggingSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs p-4 rounded-xl max-w-2xl flex items-center gap-2">
          <FiCheckCircle className="text-lg" /> Meal logged successfully into your daily calorie timeline.
        </div>
      )}

      {/* Tab Contents */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main interactive panel */}
        <div className="lg:col-span-8 bg-[#12141C] border border-[#1F2433] rounded-3xl p-6 md:p-8 min-h-[350px] flex flex-col justify-between">
          
          {/* CAMERA TAB */}
          {activeTab === "camera" && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">AI Image Scanner</h3>
                <p className="text-xs text-gray-500 font-light">Aim camera at your plate or drop an image. AI extracts weight, ingredients, and nutrients.</p>
              </div>

              {/* Viewfinder Mock */}
              <div className="relative border-2 border-dashed border-[#1F2433] hover:border-emerald-500/30 rounded-2xl h-64 bg-[#090A0F] overflow-hidden flex flex-col items-center justify-center transition-colors group">
                {scanning ? (
                  <div className="flex flex-col items-center gap-3">
                    <FiLoader className="text-4xl text-cyan-400 animate-spin" />
                    <span className="text-xs text-cyan-400 font-semibold tracking-wider uppercase animate-pulse">Running Object Detection...</span>
                  </div>
                ) : scannedResult ? (
                  <div className="text-center p-6 space-y-3">
                    <div className="text-emerald-400 font-bold text-base">✓ Food Identified</div>
                    <div className="text-xl font-bold text-white">{scannedResult.foodName}</div>
                    <div className="text-xs text-gray-400 font-light">Serving: {scannedResult.quantity} | Calories: {scannedResult.calories} kcal</div>
                  </div>
                ) : (
                  <div className="text-center p-6 space-y-4">
                    <FiCamera className="text-4xl text-gray-600 mx-auto group-hover:text-emerald-400 transition-colors" />
                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-white">Simulated Viewfinder Ready</div>
                      <div className="text-[10px] text-gray-500">Click Capture Meal to simulate scanner parsing</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleCapture}
                  disabled={scanning}
                  className="flex-1 bg-[#1F2433] border border-[#2B3042] text-[#F3F4F6] text-xs font-semibold py-3 rounded-xl hover:border-emerald-500/20 active:scale-98 transition-all cursor-pointer"
                >
                  Capture Meal Photo
                </button>
                
                {scannedResult && (
                  <button
                    onClick={handleLogScanned}
                    disabled={manualLoading}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold py-3 rounded-xl active:scale-98 transition-all cursor-pointer"
                  >
                    Log {scannedResult.foodName}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* VOICE TAB */}
          {activeTab === "voice" && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Natural Voice Logger</h3>
                <p className="text-xs text-gray-500 font-light">Record your food description. The AI natural language processing parses quantities instantly.</p>
              </div>

              {/* Recording Box */}
              <div className="border border-[#1F2433] rounded-2xl p-6 bg-[#090A0F] h-48 flex flex-col justify-between">
                <div className="text-xs text-gray-400 font-light leading-relaxed">
                  {voiceText || "Press 'Speak Food Items' below and describe your intake (e.g. 'I had a cup of rice and roti for dinner')."}
                </div>
                
                {listening && (
                  <div className="flex items-center justify-center gap-1.5 h-12">
                    <span className="w-1.5 h-6 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <span className="w-1.5 h-10 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    <span className="w-1.5 h-4 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                    <span className="w-1.5 h-8 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                    <span className="w-1.5 h-5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0.5s" }} />
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleVoiceListen}
                  className={`flex-1 font-semibold text-xs py-3 rounded-xl transition-all cursor-pointer ${
                    listening 
                      ? "bg-rose-500 hover:bg-rose-400 text-white" 
                      : "bg-[#1F2433] text-gray-300 border border-[#2B3042]"
                  }`}
                >
                  {listening ? "Recording... Click to Stop" : "Speak Food Items"}
                </button>

                {scannedResult && !listening && (
                  <button
                    onClick={handleLogScanned}
                    disabled={manualLoading}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold py-3 rounded-xl transition-all cursor-pointer"
                  >
                    Log Scanned Intake
                  </button>
                )}
              </div>
            </div>
          )}

          {/* MANUAL TAB */}
          {activeTab === "manual" && (
            <form onSubmit={handleManualSubmit} className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Manual Search & Autocomplete</h3>
                <p className="text-xs text-gray-500 font-light">Select from standard database profiles (Roti, Rice, Dal, Paneer, Egg).</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-medium">Food Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. roti, dal, rice, paneer, egg..."
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    className="w-full px-4 py-3 bg-[#090A0F] border border-[#1F2433] hover:border-gray-700 focus:border-emerald-500 rounded-xl text-white text-sm outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-medium">Portion Quantity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={manualQuantity}
                    onChange={(e) => setManualQuantity(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-[#090A0F] border border-[#1F2433] hover:border-gray-700 focus:border-emerald-500 rounded-xl text-white text-sm outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={manualLoading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-800 text-black font-semibold py-3 rounded-xl transition-all flex items-center justify-center cursor-pointer"
              >
                {manualLoading ? "Logging..." : "Log Eaten Portion"}
              </button>
            </form>
          )}

        </div>

        {/* Right Side Info Pane */}
        <div className="lg:col-span-4 bg-[#12141C] border border-[#1F2433] rounded-3xl p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white mb-2">Supported Search Queries</h3>
            <p className="text-xs text-gray-500 font-light leading-relaxed">
              Our food index is configured to map custom macronutrients and calorie details for:
            </p>
          </div>

          <div className="space-y-2.5">
            {[
              { name: "Roti", cal: "120 kcal", protein: "3g" },
              { name: "Rice", cal: "200 kcal", protein: "4g" },
              { name: "Dal", cal: "150 kcal", protein: "8g" },
              { name: "Paneer", cal: "265 kcal", protein: "18g" },
              { name: "Egg", cal: "78 kcal", protein: "6g" },
            ].map((food) => (
              <div key={food.name} className="flex justify-between items-center text-xs border-b border-[#1F2433]/30 pb-2">
                <span className="text-white font-medium">{food.name}</span>
                <div className="flex gap-2">
                  <span className="text-emerald-400 font-bold">{food.cal}</span>
                  <span className="text-gray-500">({food.protein} P)</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#1F2433]/30 border border-[#2B3042] p-4 rounded-2xl text-xs text-cyan-400 leading-relaxed font-light">
            💡 <strong>UX Tip:</strong> Try switching to <strong>AI Photo Scan</strong> and hitting Capture to see the object parser segmenting meals automatically!
          </div>
        </div>

      </div>

    </div>
  );
}

export default AddMeal;
