import React from "react";
import {
  AlertTriangle,
  GitCommit,
  Users,
  ShieldCheck,
  Flame,
  ArrowUpRight,
  UserCheck
} from "lucide-react";

export function MetricCards({ knowledgeData, totalFeatures }) {
  if (!knowledgeData) return null;

  const {
    repo_bus_factor = 1,
    repo_risk_level = "CRITICAL",
    total_commits_analyzed = 0,
    total_contributors = 0,
    dominant_contributor = "N/A",
    high_risk_features_count = 0,
  } = knowledgeData;

  const getRiskBadge = (risk) => {
    switch (risk?.toUpperCase()) {
      case "CRITICAL":
        return {
          bg: "bg-rose-500/15 border-rose-500/30 text-rose-400",
          glow: "shadow-rose-500/10",
          label: "Critical Risk",
        };
      case "HIGH":
        return {
          bg: "bg-amber-500/15 border-amber-500/30 text-amber-400",
          glow: "shadow-amber-500/10",
          label: "High Risk",
        };
      case "MEDIUM":
        return {
          bg: "bg-yellow-500/15 border-yellow-500/30 text-yellow-400",
          glow: "shadow-yellow-500/10",
          label: "Moderate",
        };
      default:
        return {
          bg: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
          glow: "shadow-emerald-500/10",
          label: "Healthy",
        };
    }
  };

  const riskBadge = getRiskBadge(repo_risk_level);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Bus Factor Card */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800/80 hover:border-slate-700 transition-all shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl group-hover:bg-rose-500/10 transition-all" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Repository Bus Factor
          </span>
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${riskBadge.bg}`}>
            {riskBadge.label}
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-white font-mono tracking-tight">
            {repo_bus_factor}
          </span>
          <span className="text-xs text-slate-400">
            {repo_bus_factor === 1 ? "dev bottleneck" : "devs spread"}
          </span>
        </div>
        <p className="mt-2 text-xs text-slate-400 line-clamp-1">
          {dominant_contributor ? `Dominated by @${dominant_contributor}` : "Balanced ownership"}
        </p>
      </div>

      {/* Commits Analyzed Card */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800/80 hover:border-slate-700 transition-all shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-all" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Analyzed Commits
          </span>
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
            <GitCommit className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-white font-mono tracking-tight">
            {total_commits_analyzed}
          </span>
          <span className="text-xs text-slate-400">git revisions</span>
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Hydrated with diff & patch heuristics
        </p>
      </div>

      {/* Active Contributors Card */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800/80 hover:border-slate-700 transition-all shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Contributors
          </span>
          <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
            <Users className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-white font-mono tracking-tight">
            {total_contributors}
          </span>
          <span className="text-xs text-slate-400">active authors</span>
        </div>
        <p className="mt-2 text-xs text-slate-400 truncate">
          Lead maintainer: <span className="text-cyan-300 font-mono">@{dominant_contributor || "octocat"}</span>
        </p>
      </div>

      {/* Extracted Features / Risk Count */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800/80 hover:border-slate-700 transition-all shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Clustered Features
          </span>
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Flame className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-white font-mono tracking-tight">
            {totalFeatures || 0}
          </span>
          <span className="text-xs text-slate-400">
            ({high_risk_features_count} high risk)
          </span>
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Mapped via Gemini LLM clustering
        </p>
      </div>
    </div>
  );
}
