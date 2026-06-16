import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate("/dashboard");
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message || 
        "Authentication failed. Please verify your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090A0F] text-[#F3F4F6] flex flex-col md:flex-row font-sans">
      
      {/* Visual panel (left side on desktop) */}
      <div className="hidden md:flex md:w-1/2 bg-[#12141C] border-r border-[#1F2433] relative flex-col justify-between p-12 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-[-10%] right-[-10%] w-[350px] h-[350px] bg-emerald-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-[100px]" />

        <Link to="/" className="text-xl font-bold tracking-wider text-emerald-400 z-10">
          NUTRITION<span className="text-cyan-400">.AI</span>
        </Link>

        <div className="space-y-6 z-10 max-w-md my-auto">
          <h1 className="text-4xl font-bold leading-tight text-white">
            Maintain Consistency, Achieve Longevity.
          </h1>
          <p className="text-gray-400 leading-relaxed font-light text-sm">
            Log in to access your macro counters, custom diet planners, historical charts, and chat with your personalized AI Nutritionist.
          </p>
          
          <div className="bg-[#1F2433]/50 border border-[#2B3042] rounded-2xl p-5 backdrop-blur-sm">
            <span className="text-cyan-400 text-xs font-semibold uppercase tracking-wider block mb-2">Did you know?</span>
            <p className="text-xs text-gray-300 font-light leading-relaxed">
              Consistently logging meal history increases weight loss success by over 80%. Our AI camera and voice modules make logging instant.
            </p>
          </div>
        </div>

        <div className="text-xs text-gray-500 z-10">
          &copy; 2026 Nutrition.AI SaaS Application.
        </div>
      </div>

      {/* Form panel (right side) */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 md:px-20 relative">
        <div className="max-w-md w-full mx-auto space-y-8">
          
          {/* Header Mobile Only Logo */}
          <div className="md:hidden flex flex-col items-center mb-8">
            <span className="text-2xl font-bold tracking-wider text-emerald-400">
              NUTRITION<span className="text-cyan-400">.AI</span>
            </span>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
            <p className="text-gray-400 font-light text-sm">
              Enter your credentials to manage your diet dashboard.
            </p>
          </div>

          {errorMsg && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs p-4 rounded-xl">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@university.edu"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-[#12141C] border border-[#1F2433] hover:border-gray-700 focus:border-emerald-500 rounded-xl text-white text-sm outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-gray-400">Password</label>
                <a href="#forgot" className="text-xs text-cyan-400 hover:underline">Forgot password?</a>
              </div>
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
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-800 text-black font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer mt-6 active:scale-98"
            >
              {loading ? "Authenticating..." : "Sign In"}
              {!loading && <FiArrowRight />}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link to="/register" className="text-emerald-400 hover:underline font-semibold">
              Create free account
            </Link>
          </p>

        </div>
      </div>

    </div>
  );
}

export default Login;