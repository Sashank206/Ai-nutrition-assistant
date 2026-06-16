import React from "react";
import { Link } from "react-router-dom";
import { FiChevronRight, FiCheck, FiCamera, FiMic, FiCompass } from "react-icons/fi";

function Home() {
  return (
    <div className="min-h-screen bg-[#090A0F] text-[#F3F4F6] font-sans overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-400">
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#090A0F]/80 backdrop-blur-md border-b border-[#1F2433] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-wider text-emerald-400">
            NUTRITION<span className="text-cyan-400">.AI</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            to="/login" 
            className="text-gray-300 hover:text-white text-sm font-semibold transition-colors px-4 py-2"
          >
            Login
          </Link>
          <Link 
            to="/register" 
            className="bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-95"
          >
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-28 md:py-32 flex flex-col items-center text-center">
        {/* Subtle Ambient Radial Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#1F2433] border border-[#2B3042] text-xs font-semibold px-4 py-1.5 rounded-full text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Version 2.0: Powered by GPT-4 & Gemini Pro
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
            Your Personal <span className="text-emerald-400 bg-clip-text">AI Nutritionist</span>, <br />
            in Your Pocket.
          </h1>
          
          <p className="text-gray-400 text-base sm:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            Snap a photo, record your voice, or search to log meals in 3 seconds. Get custom diet plans, real-time feedback, and automated shopping lists.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/register" 
              className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-bold px-8 py-4 rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/20 flex items-center justify-center gap-2 group"
            >
              Start Free Today
              <FiChevronRight className="transition-transform duration-200 group-hover:translate-x-1 text-lg" />
            </Link>
            <Link 
              to="/login" 
              className="w-full sm:w-auto bg-[#12141C] border border-[#1F2433] hover:border-gray-700 text-gray-300 hover:text-white px-8 py-4 rounded-full transition-all font-semibold"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="px-6 py-20 bg-[#12141C]/30 border-y border-[#1F2433]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl font-bold text-white">Advanced Logging Ecosystem</h2>
            <p className="text-gray-400 font-light">
              Say goodbye to tedious macro tracking apps. Logging should take seconds, not minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#12141C] border border-[#1F2433] rounded-3xl p-8 hover:border-emerald-500/30 transition-all duration-300 hover:scale-[1.02] flex flex-col gap-5 group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-black transition-colors duration-300">
                <FiCamera className="text-xl" />
              </div>
              <h3 className="text-xl font-bold text-white">AI Image Scanner</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Take a photo of your lunch or upload from your library. The AI instant scanner recognizes the ingredients and estimates weight and macros in seconds.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#12141C] border border-[#1F2433] rounded-3xl p-8 hover:border-cyan-500/30 transition-all duration-300 hover:scale-[1.02] flex flex-col gap-5 group">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-black transition-colors duration-300">
                <FiMic className="text-xl" />
              </div>
              <h3 className="text-xl font-bold text-white">Natural Voice Logger</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Just speak naturally. "I had two fried eggs and wheat toast with honey." The voice parser maps it instantly to your daily calories sheet.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#12141C] border border-[#1F2433] rounded-3xl p-8 hover:border-emerald-500/30 transition-all duration-300 hover:scale-[1.02] flex flex-col gap-5 group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-black transition-colors duration-300">
                <FiCompass className="text-xl" />
              </div>
              <h3 className="text-xl font-bold text-white">Contextual Recommendations</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Get custom AI weekly food schedules tailored to your body weight goals, budget restrictions, dietary preferences, and fitness style.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials / Social Proof */}
      <section className="px-6 py-20 max-w-6xl mx-auto space-y-16">
        <div className="text-center max-w-xl mx-auto space-y-4">
          <h2 className="text-3xl font-bold text-white">Loved by Busy Professionals & Athletes</h2>
          <p className="text-gray-400 font-light">Here's how Nutrition.AI changes the game for our active users.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#12141C] p-6 rounded-2xl border border-[#1F2433] space-y-4">
            <p className="text-gray-300 text-sm italic">
              "As a student on a budget, the AI chatbot gives me amazing high-protein dorm recipes. It takes all the stress out of eating healthy!"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">S</div>
              <div>
                <h4 className="text-xs font-bold text-white">Sashank, 21</h4>
                <p className="text-[10px] text-gray-500">Computer Science Student</p>
              </div>
            </div>
          </div>

          <div className="bg-[#12141C] p-6 rounded-2xl border border-[#1F2433] space-y-4">
            <p className="text-gray-300 text-sm italic">
              "Being a fitness enthusiast, I need precise protein metrics. This is the first app where logging meals doesn't feel like a part-time job."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">M</div>
              <div>
                <h4 className="text-xs font-bold text-white">Marcus, 28</h4>
                <p className="text-[10px] text-gray-500">Bodybuilder & Engineer</p>
              </div>
            </div>
          </div>

          <div className="bg-[#12141C] p-6 rounded-2xl border border-[#1F2433] space-y-4">
            <p className="text-gray-300 text-sm italic">
              "The voice logger is incredible. I can log my restaurant business lunches in my car in 10 seconds. Keeps me perfectly on track!"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">E</div>
              <div>
                <h4 className="text-xs font-bold text-white">Elena, 34</h4>
                <p className="text-[10px] text-gray-500">Working Executive</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1F2433] py-12 px-6 bg-[#090A0F] text-center text-gray-500 text-xs">
        <p>&copy; 2026 Nutrition.AI SaaS Application. Built for health & longevity.</p>
      </footer>

    </div>
  );
}

export default Home;