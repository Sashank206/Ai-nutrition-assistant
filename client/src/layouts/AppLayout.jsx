import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  FiHome, 
  FiActivity, 
  FiPlusCircle, 
  FiCompass, 
  FiMessageSquare, 
  FiUser, 
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiMenu
} from "react-icons/fi";

function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <FiHome className="text-lg" /> },
    { name: "Add Meal", path: "/add-meal", icon: <FiPlusCircle className="text-lg text-emerald-400" /> },
    { name: "Analytics", path: "/analytics", icon: <FiActivity className="text-lg" /> },
    { name: "Recommendations", path: "/diet", icon: <FiCompass className="text-lg" /> },
    { name: "AI Chatbot", path: "/chatbot", icon: <FiMessageSquare className="text-lg text-cyan-400" /> },
    { name: "Profile Settings", path: "/profile", icon: <FiUser className="text-lg" /> },
  ];

  return (
    <div className="min-h-screen bg-[#090A0F] text-[#F3F4F6] flex flex-col font-sans">
      
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#12141C]/80 backdrop-blur-md border-b border-[#1F2433] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <FiMenu className="text-2xl" />
          </button>
          
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-wider text-emerald-400 font-display">
              NUTRITION<span className="text-cyan-400">.AI</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-6">
          {user && (
            <div className="hidden sm:flex items-center gap-3 text-sm text-[#9CA3AF]">
              <span>Daily Target:</span>
              <span className="text-emerald-400 font-semibold">
                {user.goal === "weight_loss" ? "1800 kcal" : user.goal === "weight_gain" ? "2500 kcal" : "2000 kcal"}
              </span>
            </div>
          )}
          
          <div className="flex items-center gap-4">
            <Link 
              to="/profile" 
              className="flex items-center gap-2 bg-[#1F2433] hover:bg-[#2A2F3E] transition-all px-3 py-1.5 rounded-full border border-[#2B3042]"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold text-xs">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <span className="hidden sm:inline text-xs font-medium text-gray-300">
                {user?.name || "User"}
              </span>
            </Link>

            <button 
              onClick={handleLogout}
              className="text-gray-400 hover:text-rose-400 transition-colors p-1.5 hover:bg-rose-500/10 rounded-full"
              title="Logout"
            >
              <FiLogOut className="text-lg" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-1 relative">
        
        {/* Desktop Collapsible Sidebar */}
        <aside 
          className={`hidden md:flex flex-col bg-[#12141C] border-r border-[#1F2433] transition-all duration-300 relative ${
            collapsed ? "w-16" : "w-64"
          }`}
        >
          {/* Toggle Button */}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="absolute top-4 -right-3 w-6 h-6 rounded-full bg-[#1F2433] hover:bg-emerald-500 border border-[#2B3042] flex items-center justify-center text-gray-300 hover:text-black cursor-pointer z-10 transition-colors"
          >
            {collapsed ? <FiChevronRight size={12} /> : <FiChevronLeft size={12} />}
          </button>

          {/* Nav Items */}
          <nav className="flex-1 py-6 px-3 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                    isActive 
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium" 
                      : "text-gray-400 hover:text-white hover:bg-gray-800/40"
                  }`}
                >
                  <span className={isActive ? "text-emerald-400" : "text-gray-400"}>
                    {item.icon}
                  </span>
                  {!collapsed && <span className="text-sm">{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Slide-out Drawer */}
        {mobileMenuOpen && (
          <>
            <div 
              className="md:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <aside className="md:hidden fixed top-0 bottom-0 left-0 w-64 z-40 bg-[#12141C] border-r border-[#1F2433] p-4 flex flex-col transition-all duration-300">
              <div className="flex items-center justify-between mb-8">
                <span className="text-lg font-bold text-emerald-400">Navigation</span>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  Close
                </button>
              </div>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                        isActive 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                          : "text-gray-400 hover:text-white hover:bg-gray-800/40"
                      }`}
                    >
                      {item.icon}
                      <span className="text-sm">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </aside>
          </>
        )}

        {/* Content Area */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-24 md:pb-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Floating Bottom Nav for Mobile Screen Sizes */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#12141C]/90 backdrop-blur-lg border-t border-[#1F2433] px-2 py-1 flex items-center justify-around shadow-2xl">
        {navItems.slice(0, 5).map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
                isActive 
                  ? "text-emerald-400" 
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <div className="text-xl">
                {item.icon}
              </div>
              <span className="text-[10px] mt-0.5 font-medium">{item.name.split(" ")[0]}</span>
            </Link>
          );
        })}
      </div>

    </div>
  );
}

export default AppLayout;
