import React, { useState } from "react";

export function DonutChart({
  data = [],
  totalLabel = "Commits",
  totalValue = null,
  size = 200,
  strokeWidth = 24,
  centerTitle = "",
  centerSubtitle = ""
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const total = totalValue !== null
    ? totalValue
    : data.reduce((sum, item) => sum + (item.value || item.percentage || item.count || 0), 0);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let accumulatedPercent = 0;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          {/* Background circle track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth={strokeWidth}
          />

          {/* Slices */}
          {data.map((item, idx) => {
            const val = item.value || item.percentage || item.count || 0;
            const percent = total > 0 ? (val / total) : 0;
            const strokeDasharray = `${circumference * percent} ${circumference * (1 - percent)}`;
            const strokeDashoffset = -circumference * accumulatedPercent;
            accumulatedPercent += percent;

            const isHovered = hoveredIndex === idx;

            return (
              <circle
                key={idx}
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke={item.color || "#facc15"}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-300 cursor-pointer"
                style={{
                  filter: isHovered
                    ? `drop-shadow(0 0 10px ${item.color || "#facc15"})`
                    : "drop-shadow(0 0 2px rgba(0,0,0,0.5))",
                }}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            );
          })}
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-2">
          {hoveredIndex !== null && data[hoveredIndex] ? (
            <>
              <span className="text-xl font-black text-white tracking-tight drop-shadow-md">
                {data[hoveredIndex].value || data[hoveredIndex].percentage}%
              </span>
              <span className="text-[11px] font-semibold text-yellow-400 truncate max-w-[110px]">
                {data[hoveredIndex].name || data[hoveredIndex].label}
              </span>
            </>
          ) : (
            <>
              <span className="text-2xl font-black text-white tracking-tight drop-shadow-md">
                {centerTitle || total}
              </span>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                {centerSubtitle || totalLabel}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
