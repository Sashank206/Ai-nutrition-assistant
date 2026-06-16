import React, { useState } from "react";
import { FiCalendar, FiTrendingUp, FiCheckCircle } from "react-icons/fi";

function Analytics() {
  const [range, setRange] = useState("7d"); // 7d, 30d, 3m

  // Simulated Weekly Metrics Data points
  const weekData = [
    { label: "Mon", cal: 1650, protein: 120, carbs: 180, fats: 55 },
    { label: "Tue", cal: 1820, protein: 145, carbs: 210, fats: 60 },
    { label: "Wed", cal: 1450, protein: 110, carbs: 170, fats: 45 },
    { label: "Thu", cal: 2100, protein: 160, carbs: 250, fats: 75 },
    { label: "Fri", cal: 1750, protein: 130, carbs: 200, fats: 58 },
    { label: "Sat", cal: 1900, protein: 140, carbs: 230, fats: 65 },
    { label: "Sun", cal: 1550, protein: 115, carbs: 190, fats: 50 },
  ];

  // Targets
  const targetCal = 1800;
  
  // Custom SVG path computations
  // We compute line coordinates in a 500x200 canvas
  const paddingX = 40;
  const paddingY = 30;
  const width = 500;
  const height = 200;

  const getCoordinates = () => {
    const maxX = weekData.length - 1;
    const maxVal = 2500; // max Y value

    return weekData.map((d, index) => {
      const x = paddingX + (index / maxX) * (width - 2 * paddingX);
      const y = height - paddingY - (d.cal / maxVal) * (height - 2 * paddingY);
      return { x, y };
    });
  };

  const coords = getCoordinates();
  
  // Create line path d-string
  const linePath = coords.reduce((acc, coord, idx) => {
    return idx === 0 ? `M ${coord.x} ${coord.y}` : `${acc} L ${coord.x} ${coord.y}`;
  }, "");

  // Create area path d-string (closing path at the baseline)
  const baselineY = height - paddingY;
  const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${baselineY} L ${coords[0].x} ${baselineY} Z`;

  // Calorie Target Line y coordinate
  const targetY = height - paddingY - (targetCal / 2500) * (height - 2 * paddingY);

  return (
    <div className="space-y-8">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Analytics Dashboard</h1>
          <p className="text-gray-400 font-light text-sm mt-1">Review caloric consistency scores and weekly nutritional trends.</p>
        </div>

        <div className="flex items-center gap-1.5 bg-[#12141C] border border-[#1F2433] rounded-xl p-1">
          {[
            { key: "7d", label: "7 Days" },
            { key: "30d", label: "30 Days" },
            { key: "3m", label: "3 Months" },
          ].map((btn) => (
            <button
              key={btn.key}
              onClick={() => setRange(btn.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                range === btn.key
                  ? "bg-emerald-500 text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Row 1: Area Chart & Score */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* area chart */}
        <div className="lg:col-span-8 bg-[#12141C] border border-[#1F2433] rounded-3xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Caloric History vs Target</h3>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Calorie Eaten
              </span>
              <span className="flex items-center gap-1.5 text-rose-500 font-semibold">
                <span className="w-3 h-0.5 bg-rose-500"></span> Target Limit
              </span>
            </div>
          </div>

          {/* SVG Area Chart Graphic */}
          <div className="relative w-full h-56 bg-[#090A0F]/50 rounded-2xl border border-[#1F2433]/30 overflow-hidden px-4">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
              {/* Target Line */}
              <line
                x1={paddingX}
                y1={targetY}
                x2={width - paddingX}
                y2={targetY}
                className="stroke-rose-500/70"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              
              {/* Gradient definition */}
              <defs>
                <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Area filled path */}
              <path d={areaPath} fill="url(#chartGlow)" />

              {/* Line path */}
              <path d={linePath} fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

              {/* Dots on coordinate nodes */}
              {coords.map((coord, idx) => (
                <circle
                  key={idx}
                  cx={coord.x}
                  cy={coord.y}
                  r="4.5"
                  className="fill-[#090A0F] stroke-emerald-400"
                  strokeWidth="2.5"
                />
              ))}

              {/* Baseline divider */}
              <line
                x1={paddingX}
                y1={height - paddingY}
                x2={width - paddingX}
                y2={height - paddingY}
                className="stroke-[#1F2433]"
                strokeWidth="1"
              />

              {/* X Axis Labels */}
              {coords.map((coord, idx) => (
                <text
                  key={idx}
                  x={coord.x}
                  y={height - 10}
                  className="fill-gray-500 text-[10px] font-semibold"
                  textAnchor="middle"
                >
                  {weekData[idx].label}
                </text>
              ))}
            </svg>
          </div>
        </div>

        {/* Consistency Score Card */}
        <div className="lg:col-span-4 bg-[#12141C] border border-[#1F2433] rounded-3xl p-6 flex flex-col justify-between min-h-[280px]">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Consistency Score</h3>
            
            <div className="flex flex-col items-center justify-center my-4">
              <div className="w-28 h-28 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 flex items-center justify-center relative">
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-extrabold text-white">88%</span>
                  <span className="text-[9px] uppercase tracking-wider font-semibold text-emerald-400 mt-0.5">Optimum</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#1F2433] pt-4 mt-4 text-xs text-gray-500 leading-relaxed font-light">
            You matched your dietary objectives on <span className="text-white font-medium">6 out of 7 days</span> this week. Excellent streak!
          </div>
        </div>

      </div>

      {/* Grid Row 2: Macronutrient splits & Micronutrient Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Weekly Macro splits */}
        <div className="lg:col-span-7 bg-[#12141C] border border-[#1F2433] rounded-3xl p-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Macro Distribution (Daily g)</h3>

          <div className="space-y-4">
            {weekData.map((day) => {
              const totalMacros = day.protein + day.carbs + day.fats;
              const protPct = (day.protein / totalMacros) * 100;
              const carbPct = (day.carbs / totalMacros) * 100;
              const fatsPct = (day.fats / totalMacros) * 100;

              return (
                <div key={day.label} className="flex items-center gap-4">
                  <span className="w-8 text-xs font-semibold text-gray-400">{day.label}</span>
                  <div className="flex-1 bg-[#1F2433] h-4 rounded-lg overflow-hidden flex">
                    <div className="bg-emerald-400 h-full" style={{ width: `${protPct}%` }} title={`Protein: ${day.protein}g`} />
                    <div className="bg-cyan-400 h-full" style={{ width: `${carbPct}%` }} title={`Carbs: ${day.carbs}g`} />
                    <div className="bg-amber-400 h-full" style={{ width: `${fatsPct}%` }} title={`Fats: ${day.fats}g`} />
                  </div>
                  <span className="w-12 text-right text-xs text-white font-bold">{totalMacros}g</span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center gap-6 mt-6 text-xs font-medium text-gray-400 border-t border-[#1F2433]/30 pt-4">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-400"></span> Protein</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-cyan-400"></span> Carbohydrates</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-amber-400"></span> Fats</span>
          </div>
        </div>

        {/* Micronutrient deficiencies checklists */}
        <div className="lg:col-span-5 bg-[#12141C] border border-[#1F2433] rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Micronutrient Checklist</h3>
            <p className="text-xs text-gray-500 font-light mb-4">Estimated status based on your meal ingredients logged.</p>
            
            <div className="space-y-3">
              {[
                { name: "Vitamin D3", status: "Optimal", level: "90%", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
                { name: "Vitamin C", status: "Optimal", level: "100%", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
                { name: "Iron (Fe)", status: "Deficient", level: "35%", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
                { name: "Calcium (Ca)", status: "Optimal", level: "85%", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
                { name: "Zinc (Zn)", status: "Marginal", level: "55%", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
              ].map((micro) => (
                <div key={micro.name} className="flex justify-between items-center border-b border-[#1F2433]/30 pb-2">
                  <span className="text-xs font-semibold text-gray-300">{micro.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-500 font-light">{micro.level}</span>
                    <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${micro.color}`}>
                      {micro.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-[#1F2433] pt-4 mt-6 text-xs text-gray-500 font-light leading-relaxed flex items-center gap-2">
            <FiCheckCircle className="text-emerald-400 text-base flex-shrink-0" />
            Micronutrients automatically synchronized.
          </div>
        </div>

      </div>

    </div>
  );
}

export default Analytics;
