import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  CheckCircle2,
  AlertTriangle,
  FileCode2,
  Server,
  Network,
  CreditCard,
  Lock,
  Package,
  ShieldAlert,
  CheckSquare,
  Square,
  Sparkles,
  ExternalLink,
  GitCommit,
  RefreshCw
} from "lucide-react";
import { DonutChart } from "../DonutChart";
import { getContributorCommits } from "../../services/api";

function formatTimeAgo(dateStr) {
  if (!dateStr) return "Recent";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const now = new Date();
  const diffSec = Math.floor((now - date) / 1000);
  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.floor(diffHr / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths}mo ago`;
}

export function DeveloperProfileView({
  developer,
  repoName = "",
  onBack = () => {},
  onSelectFeature = () => {}
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [checklist, setChecklist] = useState(() => developer?.suggestedActions || []);

  useEffect(() => {
    if (developer?.suggestedActions) {
      setChecklist(developer.suggestedActions);
    }
  }, [developer?.suggestedActions]);

  const [liveContributorCommits, setLiveContributorCommits] = useState([]);
  const [syncingLive, setSyncingLive] = useState(false);

  const fetchLiveContributorCommits = async (forceRefresh = false) => {
    if (!repoName || !developer) return;
    setSyncingLive(true);
    try {
      const devName = developer.developer || developer.name || developer.id;
      const res = await getContributorCommits(repoName, devName, forceRefresh);
      if (res && res.length > 0) {
        setLiveContributorCommits(res.map(c => ({
          sha: (c.sha || "").slice(0, 7),
          message: c.message || "",
          date: c.date ? formatTimeAgo(c.date) : "Recent"
        })));
      }
    } catch (err) {
      console.warn("Could not fetch contributor commits:", err);
    } finally {
      setSyncingLive(false);
    }
  };

  useEffect(() => {
    fetchLiveContributorCommits(false);
  }, [repoName, developer?.name, developer?.developer, developer?.id]);

  if (!developer) return null;

  const toggleCheck = (id) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const getAreaIcon = (name) => {
    const n = (name || "").toLowerCase();
    if (n.includes("auth") || n.includes("login") || n.includes("security")) return <Lock className="h-4 w-4 text-cyan-400" />;
    if (n.includes("db") || n.includes("database") || n.includes("persist") || n.includes("sql")) return <Server className="h-4 w-4 text-emerald-400" />;
    if (n.includes("api") || n.includes("route") || n.includes("server") || n.includes("backend")) return <Network className="h-4 w-4 text-purple-400" />;
    if (n.includes("ui") || n.includes("front") || n.includes("view") || n.includes("theme")) return <FileCode2 className="h-4 w-4 text-yellow-400" />;
    if (n.includes("ai") || n.includes("llm") || n.includes("model")) return <Sparkles className="h-4 w-4 text-pink-400" />;
    return <FileCode2 className="h-4 w-4 text-slate-400" />;
  };

  const overallPercentage = Math.round(
    developer.knowledge_percentage ??
    developer.commit_percentage ??
    developer.overall_contribution ??
    (developer.percentage || 100)
  );

  const primaryAreas = developer.primaryAreas && developer.primaryAreas.length > 0
    ? developer.primaryAreas
    : [
        {
          id: "core",
          name: repoName ? `${repoName.split('/').pop()} Core Architecture` : "Core Architecture",
          commits: developer.commitsCount || 1,
          commitsCount: developer.commitsCount || 1,
          featureOwnership: overallPercentage,
          percentage: overallPercentage,
          distributionPercentage: 100,
          color: "#ffb000"
        }
      ];

  const affected = developer.affectedStats || { files: 1, services: 1, integrations: 1 };
  const commitsCount = (liveContributorCommits.length > 0 ? liveContributorCommits.length : developer.commitsCount) || 1;

  const commitsList = (liveContributorCommits && liveContributorCommits.length > 0)
    ? liveContributorCommits
    : ((developer.recentCommits && developer.recentCommits.length > 0)
      ? developer.recentCommits
      : [
          {
            sha: "7fd1a60",
            message: `feat(${repoName ? repoName.split('/').pop() : "core"}): update architecture implementation`,
            date: "Recent"
          }
        ]);

  // Chart data: values are proportional to the developer's authored commits across areas (adds up to 100%)
  const chartData = primaryAreas.map((area) => ({
    label: area.name,
    name: area.name,
    value: area.commitsCount || area.commits || area.distributionPercentage || 1,
    count: area.commitsCount || area.commits || 1,
    percentage: area.distributionPercentage ?? 100,
    color: area.color || "#ffb000"
  }));

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-[#08090e] overflow-hidden">
      
      {/* Top Banner & Header matching Screen 4 */}
      <div className="p-4 sm:p-6 border-b border-white/5 bg-[#0b0e17] shrink-0 z-10">
        {/* Back Link */}
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-yellow-400 transition-colors mb-4 group font-mono"
        >
          <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to developers</span>
        </button>

        {/* Profile Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={developer.avatar}
                alt={developer.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-yellow-400/40 shadow-xl"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-[#0b0e17]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {developer.name}
                </h1>
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                <span className="font-semibold text-slate-300">{developer.role}</span>
                <span>•</span>
                <span className="font-mono text-yellow-400/90">{developer.email}</span>
              </div>
            </div>
          </div>

          {/* Badges: Overall Contribution & Knowledge Concentration */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="p-3.5 rounded-2xl bg-[#00ff66]/10 border border-[#00ff66]/30 flex items-center gap-3">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  Overall Contribution
                </div>
                <div className="text-xl font-black text-[#00ff66] font-mono mt-0.5">
                  {overallPercentage}%
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 max-w-xs">
              <ShieldAlert className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-black text-red-400 uppercase tracking-wide">
                  {developer.riskTitle || "High Knowledge Concentration"}
                </div>
                <div className="text-[11px] text-slate-300 mt-0.5">
                  {developer.riskDescription || "Primary contributor in 3 key features"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 mt-6 border-b border-white/5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-2 transition-all relative ${
              activeTab === "overview"
                ? "text-yellow-400 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Overview
            {activeTab === "overview" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("contributions")}
            className={`pb-2 transition-all relative ${
              activeTab === "contributions"
                ? "text-yellow-400 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Contributions
            {activeTab === "contributions" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("knowledge-map")}
            className={`pb-2 transition-all relative ${
              activeTab === "knowledge-map"
                ? "text-yellow-400 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Knowledge Map
            {activeTab === "knowledge-map" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("gaps")}
            className={`pb-2 transition-all relative ${
              activeTab === "gaps"
                ? "text-yellow-400 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Documentation Gaps
            {activeTab === "gaps" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400 rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Profile Body */}
      <div className="flex-1 overflow-y-auto min-h-0 p-4 sm:p-6">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left Column: Primary Areas + Potentially Affected + Risk Cards */}
            <div className="space-y-6">
              
              {/* Primary Areas */}
              <div className="p-5 rounded-2xl bg-[#0e121d] border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Primary Areas
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {primaryAreas.length} subsystems
                  </span>
                </div>
                <div className="space-y-2">
                  {primaryAreas.slice(0, 4).map((area, i) => (
                    <button
                      key={i}
                      onClick={() => onSelectFeature((area.id || area.feature_id || area.name).toLowerCase().replace(/\s+/g, "-"))}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-white/5 hover:border-yellow-400/40 transition-all text-xs group cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 shrink-0">
                          {getAreaIcon(area.name)}
                        </div>
                        <div className="text-left truncate">
                          <span className="font-bold text-white group-hover:text-yellow-300 transition-colors block truncate">
                            {area.name}
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {area.commits} commit{area.commits > 1 ? "s" : ""} • {area.distributionPercentage}% of work
                          </span>
                        </div>
                      </div>
                      <div className="text-right font-mono shrink-0 ml-2">
                        <div className="text-yellow-400 font-bold">
                          {area.featureOwnership ?? area.percentage}%
                        </div>
                        <div className="text-[9px] text-slate-500 uppercase">
                          ownership
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Potentially Affected */}
              <div className="p-5 rounded-2xl bg-[#0e121d] border border-white/5 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Potentially Affected
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 text-center">
                    <div className="text-xl font-black text-white font-mono">{affected.files}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Files</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 text-center">
                    <div className="text-xl font-black text-white font-mono">{affected.services}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Features</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 text-center">
                    <div className="text-xl font-black text-white font-mono">{affected.integrations}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Domains</div>
                  </div>
                </div>
              </div>

              {/* Risk Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#0e121d] border border-red-500/20 bg-gradient-to-br from-red-500/5 to-transparent">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Knowledge Concentration
                  </div>
                  <div className="text-xl font-black text-red-400 font-mono">
                    {developer.riskLevel || "HIGH"}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#0e121d] border border-white/5">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Documentation Gaps
                  </div>
                  <div className="text-xl font-black text-yellow-400 font-mono">
                    {developer.documentationGaps || 0}
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Contribution Distribution + Suggested Actions */}
            <div className="space-y-6">
              
              {/* Contribution Distribution (Donut Chart) */}
              <div className="p-5 rounded-2xl bg-[#0e121d] border border-white/5 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Contribution Distribution
                    </h3>
                    <span className="text-[10px] text-slate-500 font-mono">
                      By subsystem commits
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
                    <DonutChart
                      data={chartData}
                      totalValue={commitsCount}
                      centerTitle={`${commitsCount}`}
                      centerSubtitle="Commits"
                      size={180}
                      strokeWidth={22}
                    />

                    <div className="space-y-2.5 min-w-[150px] max-w-[200px]">
                      {primaryAreas.map((area, i) => (
                        <div key={i} className="flex items-center justify-between text-xs gap-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: area.color || "#facc15" }}
                            />
                            <span className="text-slate-300 font-medium truncate max-w-[100px]" title={area.name}>
                              {area.name}
                            </span>
                          </div>
                          <div className="text-right font-mono shrink-0">
                            <span className="font-bold text-slate-200">
                              {area.distributionPercentage ?? area.percentage}%
                            </span>
                            <span className="text-[10px] text-slate-500 ml-1">
                              ({area.commits})
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 text-[11px] text-slate-400 flex items-center justify-between mt-4">
                  <span>Total Author Commits</span>
                  <span className="font-mono text-white font-bold">{commitsCount}</span>
                </div>
              </div>

              {/* Suggested Actions Checklist */}
              <div className="p-5 rounded-2xl bg-[#0e121d] border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Suggested Actions
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Dynamic Telemetry
                  </span>
                </div>
                <div className="space-y-2.5">
                  {checklist.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => toggleCheck(item.id)}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/50 hover:bg-slate-800/60 border border-white/5 transition-all text-left text-xs cursor-pointer"
                    >
                      {item.done ? (
                        <CheckSquare className="h-4 w-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Square className="h-4 w-4 text-slate-500 shrink-0" />
                      )}
                      <span className={item.done ? "text-slate-200 font-medium" : "text-slate-400 line-through"}>
                        {item.text}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {activeTab === "contributions" && (
          <div className="space-y-6">
            {/* Overall Contribution Telemetry Banner */}
            <div className="p-5 rounded-2xl bg-[#0e121d] border border-[#00ff66]/20 shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Overall Contribution Telemetry
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-black text-[#00ff66] border border-[#00ff66]/40 font-mono font-bold uppercase">
                      {developer.role || "Contributor"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Aggregate code ownership, commit volume, and architecture impact across all repository subsystems.
                  </p>
                </div>

                <div className="flex items-baseline gap-2 shrink-0 bg-black/60 px-4 py-2.5 rounded-xl border border-white/10 self-start sm:self-auto">
                  <span className="text-2xl sm:text-3xl font-black text-[#00ff66] font-mono">
                    {overallPercentage}%
                  </span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    Overall Share
                  </span>
                </div>
              </div>

              {/* Progress Bar of Overall Contribution */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-semibold flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00ff66]" />
                    Overall Knowledge & Codebase Footprint
                  </span>
                  <span className="font-mono text-yellow-400 font-bold">
                    {overallPercentage}% of total repository logic
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-900 border border-slate-800 overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#00ff66] via-[#00e5ff] to-[#ffb000] transition-all duration-500 shadow-[0_0_12px_rgba(0,255,102,0.4)]"
                    style={{ width: `${Math.min(100, Math.max(5, overallPercentage))}%` }}
                  />
                </div>
              </div>

              {/* 4 Stat Cards for Overall Contribution */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Total Commits
                  </div>
                  <div className="text-xl font-black text-white font-mono">
                    {commitsCount}
                  </div>
                  <div className="text-[9px] text-[#00ff66] mt-0.5 font-mono">
                    Authored in repo
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Files Impacted
                  </div>
                  <div className="text-xl font-black text-white font-mono">
                    {affected.files}
                  </div>
                  <div className="text-[9px] text-slate-500 mt-0.5 font-mono">
                    Across modules
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Services Touched
                  </div>
                  <div className="text-xl font-black text-white font-mono">
                    {affected.services}
                  </div>
                  <div className="text-[9px] text-slate-500 mt-0.5 font-mono">
                    Active services
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Risk Concentration
                  </div>
                  <div className={`text-xl font-black font-mono ${developer.isDominant || developer.riskLevel === "HIGH" ? "text-amber-400" : "text-emerald-400"}`}>
                    {developer.riskLevel || (developer.isDominant ? "HIGH" : "BALANCED")}
                  </div>
                  <div className="text-[9px] text-slate-500 mt-0.5 font-mono">
                    Bus-factor index
                  </div>
                </div>
              </div>

              {/* Module-by-Module Contribution Breakdown */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Contribution Breakdown by Module
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Normalized authored commit share
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {primaryAreas.map((area, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-slate-900/40 border border-white/5 flex flex-col justify-between gap-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: area.color || "#ffb000" }}
                          />
                          <span className="font-semibold text-slate-200 truncate">{area.name}</span>
                          <span className="text-[10px] text-slate-500 font-mono shrink-0">
                            ({area.commits} commit{area.commits > 1 ? "s" : ""})
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-black text-yellow-400 border border-yellow-400/30 font-mono">
                            {area.featureOwnership ?? area.percentage}% ownership
                          </span>
                          <span className="font-mono font-bold text-[#ffb000]">
                            {area.distributionPercentage ?? area.percentage}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${area.distributionPercentage ?? area.percentage}%`,
                            backgroundColor: area.color || "#ffb000"
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Commits Section */}
            <div className="p-5 rounded-2xl bg-[#0e121d] border border-white/5 space-y-3">
              <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <h3 className="text-sm font-bold text-white">
                  Recent Commits by {developer.name}
                </h3>
                <div className="flex items-center gap-2.5">
                  <span className="text-[11px] font-mono text-slate-400">
                    {commitsList.length} verified commits
                  </span>
                  <button
                    onClick={() => fetchLiveContributorCommits(true)}
                    disabled={syncingLive}
                    title="Fetch latest commits directly from GitHub"
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-black border border-[#00ff66]/40 text-[#00ff66] hover:bg-[#00ff66] hover:text-black transition text-[10px] font-mono font-bold cursor-pointer shadow-sm active:translate-y-0.5"
                  >
                    <RefreshCw className={`h-3 w-3 ${syncingLive ? "animate-spin" : ""}`} />
                    <span>{syncingLive ? "SYNCING..." : "SYNC GITHUB"}</span>
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                {commitsList.map((c, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-900/60 border border-white/5 font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <GitCommit className="h-4 w-4 text-[#00ff66] shrink-0" />
                      <span className="text-yellow-400 font-bold shrink-0">{c.sha}</span>
                      <span className="text-slate-200 font-sans truncate">{c.message}</span>
                    </div>
                    <span className="text-slate-400 text-[11px] font-sans shrink-0 sm:self-center">{c.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "knowledge-map" && (
          <div className="p-5 rounded-2xl bg-[#0e121d] border border-white/5 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white">
                Knowledge Map & Ownership Heuristics
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">
                Real-time Subsystem Concentration
              </span>
            </div>
            <div className="space-y-3">
              {primaryAreas.map((area, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: area.color || "#ffb000" }} />
                      <span className="font-bold text-white text-sm">{area.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">[{area.category || "Module"}]</span>
                    </div>
                    <div className="flex items-center gap-3 font-mono">
                      <span className="text-[10px] text-slate-400">{area.commits} commits</span>
                      <span className="text-yellow-400 font-bold">{area.featureOwnership ?? area.percentage}% Ownership</span>
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${area.featureOwnership ?? area.percentage}%`, backgroundColor: area.color || "#facc15" }}
                    />
                  </div>
                  {area.summary && (
                    <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{area.summary}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "gaps" && (
          <div className="p-5 rounded-2xl bg-[#0e121d] border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">
                Identified Documentation Gaps ({(developer.realGaps || []).length})
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">
                Real-time Telemetry Diagnostics
              </span>
            </div>
            <div className="space-y-3">
              {(developer.realGaps && developer.realGaps.length > 0 ? developer.realGaps : [
                {
                  id: "gap-1",
                  title: `Architectural specification for ${primaryAreas[0]?.name || "Core Module"}`,
                  description: `@${developer.name} is a primary author (${primaryAreas[0]?.featureOwnership || overallPercentage}% share). Subsystem contracts should be generated.`,
                  risk: developer.isDominant ? "HIGH" : "MEDIUM",
                  feature_name: primaryAreas[0]?.name
                }
              ]).map((gap, i) => (
                <div key={gap.id || i} className="p-3.5 rounded-xl bg-slate-900/60 border border-amber-500/20 text-slate-300 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400 font-bold text-xs font-mono">Gap #{i + 1}</span>
                      <span className="font-semibold text-white text-xs">{gap.title}</span>
                    </div>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                      gap.risk === "HIGH" ? "bg-red-500/10 text-red-400 border border-red-500/30" : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30"
                    }`}>
                      [{gap.risk || "MEDIUM"} RISK]
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    {gap.description}
                  </p>
                  {gap.feature_name && (
                    <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>Subsystem: {gap.feature_name}</span>
                      <button
                        onClick={() => onSelectFeature((gap.feature_id || gap.feature_name).toLowerCase().replace(/\s+/g, "-"))}
                        className="text-[#00e5ff] hover:underline cursor-pointer flex items-center gap-1"
                      >
                        View & Decompile Spec →
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
