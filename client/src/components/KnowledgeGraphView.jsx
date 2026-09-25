import React, { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  PieChart as PieChartIcon,
  BarChart3,
  Users,
  Code,
  Info,
  CheckCircle,
  HelpCircle,
  TrendingUp,
} from "lucide-react";

export function KnowledgeGraphView({
  knowledgeData,
  onRefresh,
  loading,
  selectedRepo,
}) {
  const [hoveredSlice, setHoveredSlice] = useState(null);

  if (!knowledgeData) {
    return (
      <div className="text-center py-16 px-4 border border-dashed border-slate-800 rounded-2xl bg-slate-950/40">
        <Users className="h-10 w-10 text-cyan-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white mb-2">No Knowledge Telemetry Loaded</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto mb-5">
          Load repository knowledge telemetry to evaluate Bus Factor risk and code ownership concentration.
        </p>
        <button
          onClick={onRefresh}
          className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold"
        >
          Analyze Knowledge Concentration
        </button>
      </div>
    );
  }

  const {
    repository,
    total_commits_analyzed,
    total_contributors,
    repo_bus_factor,
    repo_risk_level,
    repo_summary,
    dominant_contributor,
    overall_developers = [],
    chart_data,
  } = knowledgeData;

  const pieItems = chart_data?.overall_pie_chart?.items || [];
  const stackedBar = chart_data?.features_stacked_bar;

  // Compute SVG Donut Chart Paths
  const radius = 80;
  const strokeWidth = 36;
  const center = 110;
  const circumference = 2 * Math.PI * radius;

  let cumulativeAngle = 0;
  const donutSlices = overall_developers.map((dev, index) => {
    const percentage = dev.knowledge_percentage || dev.commit_percentage || 0;
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -cumulativeAngle;
    cumulativeAngle += (percentage / 100) * circumference;

    return {
      ...dev,
      index,
      percentage,
      strokeDasharray,
      strokeDashoffset,
      color: dev.color || ["#06b6d4", "#8b5cf6", "#10b981", "#f59e0b", "#ec4899"][index % 5],
    };
  });

  const getRiskColor = (risk) => {
    switch (risk?.toUpperCase()) {
      case "CRITICAL":
        return "text-rose-400 bg-rose-500/10 border-rose-500/30";
      case "HIGH":
        return "text-amber-400 bg-amber-500/10 border-amber-500/30";
      case "MEDIUM":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30";
      default:
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Risk Alert Banner */}
      <div
        className={`rounded-2xl p-5 border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl ${
          repo_risk_level === "CRITICAL"
            ? "bg-rose-950/20 border-rose-800/50"
            : repo_risk_level === "HIGH"
            ? "bg-amber-950/20 border-amber-800/50"
            : "bg-emerald-950/20 border-emerald-800/50"
        }`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-2xl ${
              repo_risk_level === "CRITICAL"
                ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                : repo_risk_level === "HIGH"
                ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
            }`}
          >
            {repo_risk_level === "CRITICAL" ? (
              <ShieldAlert className="h-6 w-6" />
            ) : (
              <ShieldCheck className="h-6 w-6" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">
                Bus Factor Risk: {repo_risk_level}
              </h3>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300">
                Score: {repo_bus_factor}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              {repo_summary}
            </p>
          </div>
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 shrink-0 transition-colors"
        >
          {loading ? "Re-evaluating..." : "Recalculate Telemetry"}
        </button>
      </div>

      {/* Charts Section: Donut + Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SVG Donut Chart Card */}
        <div className="lg:col-span-5 glass-card rounded-2xl p-6 border border-slate-800/80 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <PieChartIcon className="h-4 w-4 text-cyan-400" />
              <h4 className="text-sm font-bold text-white">Knowledge Ownership Distribution</h4>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">Normalized %</span>
          </div>

          {/* SVG Donut Canvas */}
          <div className="relative flex items-center justify-center my-4">
            <svg width="220" height="220" viewBox="0 0 220 220" className="rotate-[-9deg]">
              {/* Background ring */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="#1e293b"
                strokeWidth={strokeWidth}
              />
              {/* Slices */}
              {donutSlices.map((slice) => (
                <circle
                  key={slice.developer}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke={slice.color}
                  strokeWidth={hoveredSlice === slice.developer ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={slice.strokeDasharray}
                  strokeDashoffset={slice.strokeDashoffset}
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredSlice(slice.developer)}
                  onMouseLeave={() => setHoveredSlice(null)}
                />
              ))}
            </svg>

            {/* Inner Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                {hoveredSlice ? "Author" : "Bus Factor"}
              </span>
              <span className="text-2xl font-black text-white font-mono">
                {hoveredSlice ? `@${hoveredSlice}` : repo_bus_factor}
              </span>
              <span className="text-[10px] text-cyan-400 font-medium">
                {hoveredSlice
                  ? `${donutSlices.find((s) => s.developer === hoveredSlice)?.percentage.toFixed(1)}%`
                  : repo_bus_factor === 1
                  ? "Bottleneck"
                  : "Distributed"}
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            {donutSlices.map((slice) => (
              <div
                key={slice.developer}
                onMouseEnter={() => setHoveredSlice(slice.developer)}
                onMouseLeave={() => setHoveredSlice(null)}
                className={`flex items-center justify-between p-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                  hoveredSlice === slice.developer ? "bg-slate-800/80" : "hover:bg-slate-800/40"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full shrink-0"
                    style={{ backgroundColor: slice.color }}
                  />
                  <span className="font-mono text-slate-200">@{slice.developer}</span>
                  {slice.is_dominant && (
                    <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                      Dominant
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 font-mono text-slate-400">
                  <span>{slice.percentage.toFixed(1)}%</span>
                  <span className="text-[10px] text-slate-500">({slice.commit_count} commits)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Developer Concentration Breakdown Table */}
        <div className="lg:col-span-7 glass-card rounded-2xl p-6 border border-slate-800/80 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-cyan-400" />
                <h4 className="text-sm font-bold text-white">Developer Ownership Telemetry</h4>
              </div>
              <span className="text-[11px] text-slate-400">
                {overall_developers.length} Authors Analyzed
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2.5 px-3 font-semibold">Author</th>
                    <th className="py-2.5 px-3 font-semibold">Ownership</th>
                    <th className="py-2.5 px-3 font-semibold">Commits</th>
                    <th className="py-2.5 px-3 font-semibold">Lines Changed</th>
                    <th className="py-2.5 px-3 font-semibold">Risk Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {overall_developers.map((dev) => (
                    <tr
                      key={dev.developer}
                      className="hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={
                              dev.avatar_url ||
                              `https://ui-avatars.com/api/?name=${dev.developer}&background=0284c7&color=fff`
                            }
                            alt=""
                            className="w-6 h-6 rounded-full ring-1 ring-slate-700 object-cover"
                          />
                          <span className="font-semibold text-slate-200">
                            {dev.developer}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${dev.knowledge_percentage || dev.commit_percentage}%`,
                                backgroundColor: dev.color || "#06b6d4",
                              }}
                            />
                          </div>
                          <span className="text-cyan-300">
                            {(dev.knowledge_percentage || dev.commit_percentage || 0).toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        {dev.commit_count} ({dev.commit_percentage?.toFixed(0)}%)
                      </td>
                      <td className="py-3 px-3 text-slate-400">
                        {dev.lines_changed > 0 ? (
                          <span>
                            <span className="text-emerald-400">+{dev.lines_added}</span> /{" "}
                            <span className="text-rose-400">-{dev.lines_deleted}</span>
                          </span>
                        ) : (
                          "diff cached"
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${getRiskColor(
                            dev.risk_level
                          )}`}
                        >
                          {dev.risk_level}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Actionable Risk Mitigation Note */}
          <div className="mt-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3 text-xs text-slate-300">
            <Info className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Recommended Mitigation Checklist:</p>
              <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-400 text-[11px]">
                <li>Mandate peer reviews by non-dominant contributors before merging to main.</li>
                <li>Conduct architecture walkthroughs on critical modules flagged with high ownership.</li>
                <li>Generate and commit up-to-date Markdown technical specs via Commitology.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Cross-Feature Stacked Distribution (if available) */}
      {stackedBar && stackedBar.features && stackedBar.features.length > 0 && (
        <div className="glass-card rounded-2xl p-6 border border-slate-800/80 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-purple-400" />
              <h4 className="text-sm font-bold text-white">Feature-by-Feature Developer Concentration</h4>
            </div>
            <span className="text-xs text-slate-400">Cross-Feature Ownership</span>
          </div>

          <div className="space-y-4">
            {stackedBar.features.map((featureName, fIdx) => (
              <div key={featureName} className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-200">{featureName}</span>
                </div>
                <div className="w-full h-4 rounded-lg bg-slate-900 flex overflow-hidden border border-slate-800">
                  {stackedBar.datasets.map((dataset) => {
                    const val = dataset.data[fIdx] || 0;
                    if (val <= 0) return null;
                    return (
                      <div
                        key={dataset.label}
                        title={`@${dataset.label}: ${val}%`}
                        className="h-full transition-all relative group"
                        style={{
                          width: `${val}%`,
                          backgroundColor: dataset.backgroundColor,
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
