import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiUser, FiMail, FiLock, FiArrowRight, FiArrowLeft, FiSliders, FiActivity } from "react-icons/fi";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: 25,
    height: 170,
    weight: 70,
    goal: "maintain", // weight_loss, weight_gain, maintain
    dietType: "veg", // veg, non_veg
  });
  
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const value = e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleNext = (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (step === 1) {
      if (!formData.name || !formData.email || !formData.password) {
        setErrorMsg("Please fill out all credentials.");
        return;
      }
      if (formData.password.length < 6) {
        setErrorMsg("Password must be at least 6 characters long.");
        return;
      }
    }
    
    if (step === 2) {
      if (formData.age <= 0 || formData.weight <= 0 || formData.height <= 0) {
        setErrorMsg("Please enter valid positive numbers for biometrics.");
        return;
      }
    }

    setStep(step + 1);
  };

  const handleBack = () => {
    setErrorMsg("");
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      // Structure the data according to database schema
      const credentials = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };
      
      const onboardingData = {
        age: formData.age,
        weight: formData.weight,
        height: formData.height,
        goal: formData.goal,
        dietType: formData.dietType,
      };

      await register(credentials.name, credentials.email, credentials.password, onboardingData);
      
      alert("Registration & Onboarding complete!");
      navigate("/dashboard");
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message || 
        "Failed to register user. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090A0F] text-[#F3F4F6] flex flex-col md:flex-row font-sans">
      
      {/* Side Graphics panel */}
      <div className="hidden md:flex md:w-1/3 bg-[#12141C] border-r border-[#1F2433] relative flex-col justify-between p-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[80px]" />
        
        <Link to="/" className="text-xl font-bold text-emerald-400 z-10">
          NUTRITION<span className="text-cyan-400">.AI</span>
        </Link>

        <div className="space-y-6 z-10 my-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">1</div>
            <div>
              <h3 className="text-sm font-semibold text-white">Setup Account</h3>
              <p className="text-xs text-gray-500">Provide your secure email and credentials</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border transition-all ${
              step >= 2 
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                : "border-gray-800 text-gray-600 bg-transparent"
            }`}>2</div>
            <div>
              <h3 className={`text-sm font-semibold ${step >= 2 ? "text-white" : "text-gray-600"}`}>Biometrics Tuning</h3>
              <p className="text-xs text-gray-500">Sync weight, height, and age parameters</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border transition-all ${
              step >= 3 
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                : "border-gray-800 text-gray-600 bg-transparent"
            }`}>3</div>
            <div>
              <h3 className={`text-sm font-semibold ${step >= 3 ? "text-white" : "text-gray-600"}`}>Target Goal & Diet</h3>
              <p className="text-xs text-gray-500">Formulate caloric targets and preferences</p>
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-500 z-10">
          Onboarding Process &copy; 2026.
        </div>
      </div>

      {/* Main onboarding form panel */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 md:px-20 relative">
        <div className="max-w-md w-full mx-auto space-y-8">
          
          {/* Header Progress Bar for mobile and desktop */}
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs text-gray-400">
              <span className="uppercase tracking-wider font-semibold text-emerald-400">Step {step} of 3</span>
              <span>{step === 1 ? "Credentials" : step === 2 ? "Biometrics" : "Caloric Selection"}</span>
            </div>
            
            <div className="h-1 bg-[#1F2433] rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          {errorMsg && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs p-4 rounded-xl">
              {errorMsg}
            </div>
          )}

          {/* STEP 1: Account setup */}
          {step === 1 && (
            <form onSubmit={handleNext} className="space-y-5">
              <div className="space-y-2 text-left">
                <h2 className="text-2xl font-bold text-white">Create Account</h2>
                <p className="text-xs text-gray-400">Enter your details to initiate registration</p>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-medium">Your Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Sashank K"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-[#12141C] border border-[#1F2433] hover:border-gray-700 focus:border-emerald-500 rounded-xl text-white text-sm outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-medium">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="sashank@university.edu"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-[#12141C] border border-[#1F2433] hover:border-gray-700 focus:border-emerald-500 rounded-xl text-white text-sm outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-medium">Password (min. 6 characters)</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-[#12141C] border border-[#1F2433] hover:border-gray-700 focus:border-emerald-500 rounded-xl text-white text-sm outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer mt-6"
              >
                Continue to Biometrics <FiArrowRight />
              </button>
            </form>
          )}

          {/* STEP 2: Biometrics setup */}
          {step === 2 && (
            <form onSubmit={handleNext} className="space-y-5">
              <div className="space-y-2 text-left">
                <h2 className="text-2xl font-bold text-white">Biometrics Configuration</h2>
                <p className="text-xs text-gray-400">These help calculate your body mass index and caloric maintenance levels.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-medium">Age (Years)</label>
                  <input
                    type="number"
                    name="age"
                    min="1"
                    required
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#12141C] border border-[#1F2433] hover:border-gray-700 focus:border-emerald-500 rounded-xl text-white text-sm outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-medium">Weight (kg)</label>
                  <input
                    type="number"
                    name="weight"
                    min="1"
                    required
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#12141C] border border-[#1F2433] hover:border-gray-700 focus:border-emerald-500 rounded-xl text-white text-sm outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-medium">Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  min="1"
                  required
                  value={formData.height}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#12141C] border border-[#1F2433] hover:border-gray-700 focus:border-emerald-500 rounded-xl text-white text-sm outline-none transition-colors"
                />
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 bg-[#12141C] border border-[#1F2433] hover:border-gray-700 text-gray-300 font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FiArrowLeft /> Back
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Configure Goal <FiArrowRight />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Goals & Diet selections */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2 text-left">
                <h2 className="text-2xl font-bold text-white">Diet & Health Goals</h2>
                <p className="text-xs text-gray-400">Tailor the recommendations layout specifically for your health objectives.</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-gray-400 font-medium">Core Target Goal</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, goal: "weight_loss" })}
                    className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                      formData.goal === "weight_loss" 
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-400" 
                        : "bg-[#12141C] border-[#1F2433] text-gray-400 hover:border-gray-700"
                    }`}
                  >
                    Weight Loss
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, goal: "maintain" })}
                    className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                      formData.goal === "maintain" 
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-400" 
                        : "bg-[#12141C] border-[#1F2433] text-gray-400 hover:border-gray-700"
                    }`}
                  >
                    Maintain
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, goal: "weight_gain" })}
                    className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                      formData.goal === "weight_gain" 
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-400" 
                        : "bg-[#12141C] border-[#1F2433] text-gray-400 hover:border-gray-700"
                    }`}
                  >
                    Weight Gain
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-gray-400 font-medium">Dietary Style Preference</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, dietType: "veg" })}
                    className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                      formData.dietType === "veg" 
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-400" 
                        : "bg-[#12141C] border-[#1F2433] text-gray-400 hover:border-gray-700"
                    }`}
                  >
                    Vegetarian
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, dietType: "non_veg" })}
                    className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                      formData.dietType === "non_veg" 
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-400" 
                        : "bg-[#12141C] border-[#1F2433] text-gray-400 hover:border-gray-700"
                    }`}
                  >
                    Non-Vegetarian
                  </button>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 bg-[#12141C] border border-[#1F2433] hover:border-gray-700 text-gray-300 font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                  disabled={loading}
                >
                  <FiArrowLeft /> Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/10 disabled:bg-emerald-800"
                >
                  {loading ? "Registering..." : "Complete Setup"}
                </button>
              </div>
            </form>
          )}

          <p className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-emerald-400 hover:underline font-semibold">
              Sign In
            </Link>
          </p>

        </div>
      </div>

    </div>
  );
}

export default Register;