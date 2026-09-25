import React, { useState } from "react";

export function DonutChart({
  data = [],
  totalLabel = "COMMITS",
  totalValue = null,
  size = 200,
  strokeWidth = 24,
  centerTitle = "",
  centerSubtitle = "",
  centerTag = "",
  centerTagColor = "#00e5ff"
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const total = totalValue !== null
    ? totalValue
    : data.reduce((sum, item) => sum + (item.value || item.percentage || item.count || 0), 0);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Pre-calculate stroke offsets cleanly
  let currentOffset = 0;
  const slices = data.map((item, idx) => {
    const val = item.value || item.percentage || item.count || 0;
    const percent = total > 0 ? (val / total) : 0;
    const sliceLength = circumference * percent;
    const strokeDasharray = `${sliceLength} ${circumference}`;
    const strokeDashoffset = -currentOffset;
    currentOffset += sliceLength;

    return {
      ...item,
      idx,
      val,
      percent: Math.round(percent * 100),
      strokeDasharray,
      strokeDashoffset,
      color: item.color || (idx === 0 ? "#ffb000" : idx === 1 ? "#ff3366" : idx === 2 ? "#00e5ff" : "#00ff66")
    };
  });

  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          {/* Outer glow ring */}
          <circle
            cx={center}
            cy={center}
            r={radius + strokeWidth / 2 + 1}
            fill="none"
            stroke="rgba(0, 229, 255, 0.12)"
            strokeWidth={1}
            strokeDasharray="4 4"
          />

          {/* Background circle track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="#090b11"
            stroke="#161b28"
            strokeWidth={strokeWidth}
          />

          {/* Slices */}
          {slices.map((slice) => {
            const isHovered = hoveredIndex === slice.idx;

            return (
              <circle
                key={slice.idx}
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke={slice.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={slice.strokeDasharray}
                strokeDashoffset={slice.strokeDashoffset}
                strokeLinecap={slices.length === 1 ? "round" : "butt"}
                className="transition-all duration-200 cursor-pointer"
                style={{
                  filter: isHovered
                    ? `drop-shadow(0 0 12px ${slice.color})`
                    : `drop-shadow(0 0 3px ${slice.color}80)`,
                }}
                onMouseEnter={() => setHoveredIndex(slice.idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            );
          })}

          {/* Inner core circle */}
          <circle
            cx={center}
            cy={center}
            r={radius - strokeWidth / 2 - 2}
            fill="#0b0e17"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={1}
          />
        </svg>

        {/* Center Telemetry Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-2">
          {hoveredIndex !== null && slices[hoveredIndex] ? (
            <div className="animate-in fade-in zoom-in-95 duration-150">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">
                {slices[hoveredIndex].name || slices[hoveredIndex].label || "AUTHOR"}
              </span>
              <span
                className="text-2xl font-black font-mono tracking-tight block"
                style={{ color: slices[hoveredIndex].color }}
              >
                {slices[hoveredIndex].percentage ?? slices[hoveredIndex].percent}%
              </span>
              <span className="text-[10px] font-mono text-slate-400 block">
                {slices[hoveredIndex].count || slices[hoveredIndex].commits || 0} commits
              </span>
            </div>
          ) : (
            <div>
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400 block">
                {centerSubtitle || totalLabel}
              </span>
              <span className="text-3xl font-black text-white font-mono tracking-tight block">
                {centerTitle !== "" ? centerTitle : total}
              </span>
              {centerTag && (
                <span
                  className="text-[10px] font-mono font-bold uppercase tracking-wider block mt-0.5"
                  style={{ color: centerTagColor }}
                >
                  {centerTag}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
