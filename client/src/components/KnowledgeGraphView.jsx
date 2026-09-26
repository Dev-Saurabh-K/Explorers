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
  Activity,
  Layers,
  Network,
  Cpu
} from "lucide-react";
import { DonutChart } from "./DonutChart";

export function KnowledgeGraphView({
  knowledgeData,
  onRefresh,
  loading,
  selectedRepo,
}) {
  const [viewMode, setViewMode] = useState("donut"); // "donut" | "topology"
  const [selectedNode, setSelectedNode] = useState(null);

  if (!knowledgeData) {
    return (
      <div className="text-center py-16 px-4 border border-dashed border-[#00e5ff]/30 rounded-2xl bg-[#090b12] text-xs font-mono">
        <Users className="h-10 w-10 text-[#00e5ff] mx-auto mb-3 animate-pulse" />
        <h3 className="text-base font-bold text-white mb-2">[NO KNOWLEDGE TELEMETRY LOADED]</h3>
        <p className="text-slate-400 max-w-md mx-auto mb-5 leading-relaxed">
          Initialize repository telemetry to decompile Bus Factor risk and author ownership concentration.
        </p>
        <button
          onClick={onRefresh}
          className="px-5 py-2.5 bg-[#ffb000] text-black font-bold uppercase tracking-wider rounded-xl shadow-[2px_2px_0px_#000] hover:bg-[#00ff66] transition"
        >
          ► INITIALIZE TELEMETRY SCAN
        </button>
      </div>
    );
  }

  const {
    repository,
    total_commits_analyzed = 0,
    total_contributors = 0,
    repo_bus_factor = 1,
    repo_risk_level = "CRITICAL",
    repo_summary = "",
    dominant_contributor = "N/A",
    overall_developers = [],
    chart_data,
    feature_breakdown = []
  } = knowledgeData;

  const getRiskColor = (risk) => {
    switch (risk?.toUpperCase()) {
      case "CRITICAL":
        return "text-[#ff3366] bg-[#ff3366]/10 border-[#ff3366]/40";
      case "HIGH":
        return "text-[#ffb000] bg-[#ffb000]/10 border-[#ffb000]/40";
      case "MEDIUM":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
      default:
        return "text-[#00ff66] bg-[#00ff66]/10 border-[#00ff66]/40";
    }
  };

  // Prepare chart items matching Image 1
  const donutData = overall_developers.map((dev, idx) => {
    const rawDev = dev.developer || "dev";
    const cleanDev = rawDev.replace(/^@+/, "");
    const pct = Number((dev.knowledge_percentage ?? dev.commit_percentage ?? 0).toFixed(1));
    const isDominant = dev.is_dominant || idx === 0;
    return {
      name: `@${cleanDev}`,
      developer: cleanDev,
      value: pct,
      percentage: pct,
      commits: dev.commit_count,
      is_dominant: isDominant,
      color: dev.color || (idx === 0 ? "#ffb000" : idx === 1 ? "#ff3366" : idx === 2 ? "#00e5ff" : "#00ff66"),
      avatar: dev.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanDev)}&background=0b0e17&color=00e5ff`
    };
  });

  return (
    <div className="space-y-6 font-mono text-xs select-none">
      
      {/* Retro Hardware Status & Mode Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#0c0e16] border border-[#00e5ff]/30 text-slate-300">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[#ffb000] font-bold text-xs">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#ff3366] animate-ping" />
            [REC]
          </span>
          <span className="text-[#00e5ff] font-bold tracking-wide">
            KNOWLEDGE_TELEMETRY // {repository || selectedRepo || "MAIN"}
          </span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-slate-400">BUS FACTOR: [{repo_bus_factor}]</span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className={repo_risk_level === "CRITICAL" ? "text-[#ff3366]" : "text-[#ffb000]"}>
            RISK: [{repo_risk_level}]
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle: Donut vs Topology */}
          <div className="border border-slate-700 bg-black p-0.5 rounded-lg flex text-[11px]">
            <button
              onClick={() => setViewMode("donut")}
              className={`px-3 py-1 rounded-md transition ${
                viewMode === "donut"
                  ? "bg-[#00e5ff] text-black font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              [DONUT MATRIX]
            </button>
            <button
              onClick={() => setViewMode("topology")}
              className={`px-3 py-1 rounded-md transition ${
                viewMode === "topology"
                  ? "bg-[#00e5ff] text-black font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              [TOPOLOGY GRAPH]
            </button>
          </div>

          <button
            onClick={onRefresh}
            disabled={loading}
            className="px-3 py-1.5 border border-[#ffb000] text-[#ffb000] hover:bg-[#ffb000] hover:text-black transition rounded-lg text-[11px] font-bold"
          >
            {loading ? "[SCANNING...]" : "[REFRESH]"}
          </button>
        </div>
      </div>

      {/* Risk Alert Telemetry Banner */}
      <div
        className={`p-4 rounded-xl border relative overflow-hidden ${
          repo_risk_level === "CRITICAL"
            ? "bg-[#180a0f] border-[#ff3366]/40 text-[#ff3366]"
            : repo_risk_level === "HIGH"
            ? "bg-[#161208] border-[#ffb000]/40 text-[#ffb000]"
            : "bg-[#091510] border-[#00ff66]/40 text-[#00ff66]"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-black/50 border border-current shrink-0 mt-0.5">
              {repo_risk_level === "CRITICAL" ? (
                <ShieldAlert className="h-5 w-5" />
              ) : (
                <ShieldCheck className="h-5 w-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm tracking-wider uppercase">
                  BUS FACTOR TELEMETRY: {repo_risk_level}
                </span>
                <span className="px-2 py-0.5 bg-black/60 rounded border border-current text-[10px] font-bold">
                  FACTOR SCORE: {repo_bus_factor}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-3xl">
                {repo_summary || `High single-author concentration detected. Primary author accounts for majority of repository contributions.`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Mode View */}
      {viewMode === "donut" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Card 1: Donut Ownership Distribution (Exact Match to Image 1) */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0c0e16] border border-[#00e5ff]/20 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <PieChartIcon className="h-4 w-4 text-[#00e5ff]" />
                  <h4 className="text-xs font-bold text-white tracking-wide uppercase">
                    Knowledge Ownership Distribution
                  </h4>
                </div>
                <span className="text-[10px] text-slate-400">Normalized %</span>
              </div>

              {/* Donut Canvas */}
              <div className="py-4">
                <DonutChart
                  data={donutData}
                  size={210}
                  strokeWidth={28}
                  centerTitle={`${repo_bus_factor}`}
                  centerSubtitle="BUS FACTOR"
                  centerTag={repo_bus_factor === 1 ? "Bottleneck" : "Distributed"}
                  centerTagColor={repo_bus_factor === 1 ? "#00e5ff" : "#00ff66"}
                />
              </div>

              {/* Legend List (Matching Image 1 perfectly) */}
              <div className="space-y-3 pt-4 border-t border-white/5">
                {donutData.map((item) => (
                  <div
                    key={item.developer}
                    className="flex items-center justify-between text-xs p-2 rounded-lg bg-[#07090e] border border-white/5 hover:border-[#00e5ff]/40 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-bold text-slate-100">
                        {item.name}
                      </span>
                      {item.is_dominant && (
                        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-[#00e5ff]/20 text-[#00e5ff] font-black border border-[#00e5ff]/30">
                          DOMINANT
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">
                        {item.percentage}%
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        ({item.commits} commits)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 mt-4 flex items-center justify-between text-[11px] text-slate-400">
              <span>Total Commits Analyzed:</span>
              <span className="text-[#ffb000] font-bold">{total_commits_analyzed}</span>
            </div>
          </div>

          {/* Card 2: Developer Ownership Telemetry Table */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0c0e16] border border-[#00e5ff]/20 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#ffb000]" />
                  <h4 className="text-xs font-bold text-white tracking-wide uppercase">
                    Developer Authorship Telemetry
                  </h4>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {overall_developers.length} AUTHORS RECORDED
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase tracking-wider">
                      <th className="py-2 px-3">Author</th>
                      <th className="py-2 px-3">Concentration</th>
                      <th className="py-2 px-3">Commits</th>
                      <th className="py-2 px-3">Lines Impacted</th>
                      <th className="py-2 px-3">Risk Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {overall_developers.map((dev, idx) => (
                      <tr key={dev.developer} className="hover:bg-slate-900/40 transition">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: dev.color || (idx === 0 ? "#ffb000" : "#ff3366") }}
                            />
                            <span className="font-bold text-slate-100">
                              @{dev.developer}
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
                                  backgroundColor: dev.color || (idx === 0 ? "#ffb000" : "#ff3366"),
                                }}
                              />
                            </div>
                            <span className="text-white font-bold">
                              {(dev.knowledge_percentage || dev.commit_percentage || 0).toFixed(1)}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-slate-300">
                          {dev.commit_count} ({dev.commit_percentage?.toFixed(0)}%)
                        </td>
                        <td className="py-3 px-3 text-slate-400 text-[11px]">
                          {dev.lines_changed > 0 ? (
                            <span>
                              <span className="text-[#00ff66]">+{dev.lines_added}</span> /{" "}
                              <span className="text-[#ff3366]">-{dev.lines_deleted}</span>
                            </span>
                          ) : (
                            <span className="text-slate-500">active diff</span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getRiskColor(dev.risk_level)}`}>
                            {dev.risk_level}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Retro Diagnostic Note */}
            <div className="mt-4 p-3.5 rounded-xl bg-[#08090f] border border-slate-800 text-[11px] text-slate-400 space-y-1.5">
              <div className="text-white font-bold flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5 text-[#00e5ff]" />
                <span>ARCHITECTURAL RISK RECOMMENDATION:</span>
              </div>
              <p>
                {repo_bus_factor === 1
                  ? "Single author bottleneck represents critical failure vulnerability if the primary maintainer departs. Recommend decompiling features into markdown specs and pairing secondary contributors."
                  : "Work is reasonably spread across active team authors."}
              </p>
            </div>
          </div>

        </div>
      ) : (
        /* View 2: Retro Topology Radar / Network Graph */
        <div className="p-6 rounded-2xl bg-[#0c0e16] border border-[#00e5ff]/30 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Network className="h-4 w-4 text-[#00ff66]" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Cybernetic Repository Topology Network
              </h4>
            </div>
            <span className="text-[10px] text-slate-400">
              Interactive node graph: Click nodes to inspect telemetry
            </span>
          </div>

          {/* Interactive SVG Network Canvas */}
          <div className="relative w-full h-[400px] bg-[#07080d] rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center">
            {/* Background grid */}
            <div className="absolute inset-0 retro-grid-lines opacity-30 pointer-events-none" />

            <svg width="100%" height="100%" viewBox="0 0 800 400" className="w-full h-full">
              {/* Central Repository Node (400, 200) */}
              <defs>
                <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="glow-gold" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Connection Lines from Center to Developers */}
              {overall_developers.map((dev, i) => {
                const total = overall_developers.length || 1;
                const angle = (i / total) * Math.PI - Math.PI / 2;
                const x = 400 + Math.cos(angle) * 220;
                const y = 200 + Math.sin(angle) * 130;

                return (
                  <g key={`dev-line-${dev.developer}`}>
                    <line
                      x1="400"
                      y1="200"
                      x2={x}
                      y2={y}
                      stroke={dev.color || "#ffb000"}
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      className="animate-pulse"
                      opacity="0.6"
                    />
                    {/* Developer Node */}
                    <circle
                      cx={x}
                      cy={y}
                      r="22"
                      fill="#0e131f"
                      stroke={dev.color || "#ffb000"}
                      strokeWidth="2"
                      filter="url(#glow-gold)"
                      className="cursor-pointer hover:r-26 transition-all"
                      onClick={() => setSelectedNode(dev)}
                    />
                    <text
                      x={x}
                      y={y + 4}
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                      pointerEvents="none"
                      fontFamily="monospace"
                    >
                      @{dev.developer.slice(0, 5)}
                    </text>
                    <text
                      x={x}
                      y={y + 36}
                      fill={dev.color || "#ffb000"}
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                      pointerEvents="none"
                      fontFamily="monospace"
                    >
                      {(dev.knowledge_percentage || dev.commit_percentage || 0).toFixed(0)}%
                    </text>
                  </g>
                );
              })}

              {/* Central Repository Node */}
              <circle
                cx="400"
                cy="200"
                r="44"
                fill="#0b0e17"
                stroke="#00e5ff"
                strokeWidth="3"
                filter="url(#glow-cyan)"
                className="cursor-pointer"
                onClick={() => setSelectedNode({ developer: repository || "Repository", isCore: true })}
              />
              <text
                x="400"
                y="196"
                fill="#00e5ff"
                fontSize="10"
                fontWeight="900"
                textAnchor="middle"
                pointerEvents="none"
                fontFamily="monospace"
              >
                REPO CORE
              </text>
              <text
                x="400"
                y="212"
                fill="#ffffff"
                fontSize="9"
                fontWeight="bold"
                textAnchor="middle"
                pointerEvents="none"
                fontFamily="monospace"
              >
                BF: {repo_bus_factor}
              </text>
            </svg>

            {/* Selected Node Details Box */}
            {selectedNode && (
              <div className="absolute bottom-4 left-4 p-3 bg-black/90 border border-[#00e5ff] rounded-xl text-xs max-w-xs shadow-2xl backdrop-blur-md">
                <div className="text-[#00e5ff] font-bold">
                  {selectedNode.isCore ? "REPOSITORY CORE NODE" : `@${selectedNode.developer}`}
                </div>
                <div className="text-slate-300 text-[11px] mt-1">
                  {selectedNode.isCore
                    ? `Total Commits: ${total_commits_analyzed} • Bus Factor: ${repo_bus_factor}`
                    : `Authorship: ${(selectedNode.knowledge_percentage || selectedNode.commit_percentage || 0).toFixed(1)}% (${selectedNode.commit_count} commits)`}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
