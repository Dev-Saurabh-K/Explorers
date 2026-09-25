import React, { useState } from "react";
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
  GitCommit
} from "lucide-react";
import { DonutChart } from "../DonutChart";

export function DeveloperProfileView({
  developer,
  onBack = () => {},
  onSelectFeature = () => {}
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [checklist, setChecklist] = useState(
    developer?.suggestedActions || [
      { id: 1, text: "Document payment architecture", done: true },
      { id: 2, text: "Assign secondary reviewer", done: true },
      { id: 3, text: "Add integration tests", done: true },
      { id: 4, text: "Conduct knowledge-transfer session", done: true }
    ]
  );

  if (!developer) return null;

  const toggleCheck = (id) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const getAreaIcon = (name) => {
    if (name.includes("Payment")) return <CreditCard className="h-4 w-4 text-yellow-400" />;
    if (name.includes("Auth")) return <Lock className="h-4 w-4 text-cyan-400" />;
    if (name.includes("Order")) return <Package className="h-4 w-4 text-purple-400" />;
    return <FileCode2 className="h-4 w-4 text-slate-400" />;
  };

  const primaryAreas = developer.primaryAreas || [
    { name: "Payment", percentage: 42, color: "#facc15" },
    { name: "Authentication", percentage: 28, color: "#22d3ee" },
    { name: "Order Processing", percentage: 18, color: "#c084fc" },
    { name: "Others", percentage: 12, color: "#94a3b8" }
  ];

  const affected = developer.affectedStats || { files: 17, services: 4, integrations: 3 };
  const commitsCount = developer.commitsCount || 142;

  const chartData = primaryAreas.map((area) => ({
    label: area.name,
    name: area.name,
    value: area.percentage,
    percentage: area.percentage,
    color: area.color
  }));

  return (
    <div className="flex-1 flex flex-col h-full bg-[#08090e] overflow-y-auto">
      
      {/* Top Banner & Header matching Screen 4 */}
      <div className="p-6 border-b border-white/5 bg-[#0b0e17]">
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

          {/* High Knowledge Concentration Alert Badge matching mockup */}
          <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 max-w-md">
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
      <div className="p-6">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left Column: Primary Areas + Potentially Affected + Risk Cards */}
            <div className="space-y-6">
              
              {/* Primary Areas */}
              <div className="p-5 rounded-2xl bg-[#0e121d] border border-white/5 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Primary Areas
                </h3>
                <div className="space-y-2">
                  {primaryAreas.slice(0, 3).map((area, i) => (
                    <button
                      key={i}
                      onClick={() => onSelectFeature(area.name.toLowerCase().replace(/\s+/g, "-"))}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-white/5 hover:border-yellow-400/40 transition-all text-xs group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-slate-800 border border-slate-700">
                          {getAreaIcon(area.name)}
                        </div>
                        <span className="font-bold text-white group-hover:text-yellow-300 transition-colors">
                          {area.name}
                        </span>
                      </div>
                      <span className="font-mono text-yellow-400 font-semibold">
                        {area.percentage}% ownership
                      </span>
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
                    <div className="text-xl font-black text-white">{affected.files}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Files</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 text-center">
                    <div className="text-xl font-black text-white">{affected.services}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Services</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 text-center">
                    <div className="text-xl font-black text-white">{affected.integrations}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Integrations</div>
                  </div>
                </div>
              </div>

              {/* Risk Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#0e121d] border border-red-500/20 bg-gradient-to-br from-red-500/5 to-transparent">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Knowledge Concentration
                  </div>
                  <div className="text-xl font-black text-red-400">
                    {developer.riskLevel || "HIGH"}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#0e121d] border border-white/5">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Documentation Gaps
                  </div>
                  <div className="text-xl font-black text-yellow-400">
                    {developer.documentationGaps || 12}
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Contribution Distribution + Suggested Actions */}
            <div className="space-y-6">
              
              {/* Contribution Distribution (Donut Chart) */}
              <div className="p-5 rounded-2xl bg-[#0e121d] border border-white/5 shadow-xl flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                    Contribution Distribution
                  </h3>

                  <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
                    <DonutChart
                      data={chartData}
                      centerTitle={`${commitsCount}`}
                      centerSubtitle="Commits"
                      size={180}
                      strokeWidth={22}
                    />

                    <div className="space-y-2.5 min-w-[140px]">
                      {primaryAreas.map((area, i) => (
                        <div key={i} className="flex items-center justify-between text-xs gap-3">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: area.color || "#facc15" }}
                            />
                            <span className="text-slate-300 font-medium truncate max-w-[90px]">
                              {area.name}
                            </span>
                          </div>
                          <span className="font-mono font-bold text-slate-200">
                            {area.percentage}%
                          </span>
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
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Suggested Actions
                </h3>
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
          <div className="p-5 rounded-2xl bg-[#0e121d] border border-white/5 space-y-3">
            <h3 className="text-sm font-bold text-white mb-2">
              Recent Commits by {developer.name}
            </h3>
            <div className="space-y-2">
              {(developer.recentCommits || [
                { sha: "7fd1a60", message: "feat(auth): integrate OAuth2 token refresh & session revocation", date: "2 hours ago" },
                { sha: "4bc912a", message: "fix(payment): stripe webhook idempotency retry mechanism", date: "1 day ago" },
                { sha: "8821dfe", message: "refactor(order): transition state machine to event-driven queue", date: "3 days ago" }
              ]).map((c, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-900/60 border border-white/5 font-mono text-xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-yellow-400 font-bold">{c.sha}</span>
                    <span className="text-slate-200 font-sans">{c.message}</span>
                  </div>
                  <span className="text-slate-400 text-[11px] font-sans">{c.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "knowledge-map" && (
          <div className="p-5 rounded-2xl bg-[#0e121d] border border-white/5 space-y-4">
            <h3 className="text-sm font-bold text-white mb-2">
              Knowledge Map & Ownership Heuristics
            </h3>
            <div className="space-y-3">
              {primaryAreas.map((area, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-900/60 border border-white/5 text-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-white">{area.name}</span>
                    <span className="font-mono text-yellow-400 font-bold">{area.percentage}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${area.percentage}%`, backgroundColor: area.color || "#facc15" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "gaps" && (
          <div className="p-5 rounded-2xl bg-[#0e121d] border border-white/5 space-y-3">
            <h3 className="text-sm font-bold text-white mb-2">
              Identified Documentation Gaps ({developer.documentationGaps || 12})
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-amber-500/20 text-slate-300">
                <span className="text-amber-400 font-bold mr-2">Gap #1</span>
                Missing sequence diagram for Payment refund webhook idempotency.
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-amber-500/20 text-slate-300">
                <span className="text-amber-400 font-bold mr-2">Gap #2</span>
                Undocumented fallback route for OAuth token refresh under Redis downtime.
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-amber-500/20 text-slate-300">
                <span className="text-amber-400 font-bold mr-2">Gap #3</span>
                Order state machine deadlock handling when inventory lock times out.
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
