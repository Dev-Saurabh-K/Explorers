import React, { useState } from "react";
import {
  Lock,
  CreditCard,
  Package,
  Users,
  Box,
  Bell,
  ShoppingCart,
  ShieldCheck,
  Layout,
  Sparkles,
  FileCode,
  GitCommit,
  Share2,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Layers,
  ArrowRight
} from "lucide-react";
import { DonutChart } from "../DonutChart";

export function FeatureOverviewView({
  feature,
  onGenerateDoc = () => {},
  onSelectDeveloper = () => {},
  isGenerating = false
}) {
  const [activeSubTab, setActiveSubTab] = useState("overview");

  if (!feature) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 text-slate-500 text-sm">
        Select a feature from the list to inspect overview telemetry.
      </div>
    );
  }

  const fid = feature.id || feature.feature_id;
  const fname = feature.name || feature.feature_name;
  const summary = feature.summary || "No summary available for this feature.";
  const commitsCount = feature.commitsCount || feature.commit_count || (feature.commits?.length) || 32;
  const filesCount = feature.filesCount || (feature.files?.length) || 5;
  const servicesCount = feature.servicesCount || 4;
  const integrationsCount = feature.integrationsCount || (feature.integrations?.length) || 3;
  const riskLevel = feature.riskLevel || "HIGH";
  const riskBadge = feature.riskBadge || "High concentration";

  const contributors = feature.contributors || [
    { name: "Rahul", percentage: 68, commits: 22, color: "#facc15", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80" },
    { name: "Priya", percentage: 18, commits: 6, color: "#c084fc", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80" },
    { name: "Aman", percentage: 8, commits: 3, color: "#22d3ee", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80" },
    { name: "Swati", percentage: 6, commits: 1, color: "#10b981", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80" }
  ];

  const files = feature.files || [
    { name: "Auth Controller", path: "/src/controllers/auth.js", changes: "+180 / -12", lines: 192 },
    { name: "JWT Service", path: "/src/services/jwt.js", changes: "+95 / -4", lines: 99 },
    { name: "User Model", path: "/src/models/user.js", changes: "+140 / -8", lines: 148 },
    { name: "Auth Middleware", path: "/src/middleware/auth.js", changes: "+65 / -2", lines: 67 },
    { name: "Session Config", path: "/src/config/session.js", changes: "+42 / -0", lines: 42 }
  ];

  const commits = feature.commits || [
    { sha: "7fd1a60", author: "Rahul", message: "feat(auth): integrate OAuth2 token refresh & session revocation", date: "2 days ago" },
    { sha: "6dcb09b", author: "Rahul", message: "fix(jwt): implement sliding session expiration with redis refresh", date: "4 days ago" },
    { sha: "3a8f921", author: "Priya", message: "feat(security): bcrypt password hashing salt rounds calibration", date: "1 week ago" }
  ];

  const integrations = feature.integrations || [
    { name: "GitHub OAuth", status: "Active", type: "External Identity", latency: "120ms" },
    { name: "Redis Cache", status: "Active", type: "Session Token Store", latency: "2ms" },
    { name: "SendGrid API", status: "Active", type: "Email Verification & OTP", latency: "85ms" }
  ];

  // Icon selector
  const getIcon = () => {
    switch (feature.icon) {
      case "CreditCard":
        return <CreditCard className="h-6 w-6 text-yellow-400" />;
      case "Package":
        return <Package className="h-6 w-6 text-yellow-400" />;
      case "Users":
        return <Users className="h-6 w-6 text-yellow-400" />;
      case "Box":
        return <Box className="h-6 w-6 text-yellow-400" />;
      case "Bell":
        return <Bell className="h-6 w-6 text-yellow-400" />;
      case "ShoppingCart":
        return <ShoppingCart className="h-6 w-6 text-yellow-400" />;
      case "ShieldCheck":
        return <ShieldCheck className="h-6 w-6 text-yellow-400" />;
      case "Layout":
        return <Layout className="h-6 w-6 text-yellow-400" />;
      default:
        return <Lock className="h-6 w-6 text-yellow-400" />;
    }
  };

  const chartData = contributors.map((c) => ({
    label: c.name,
    name: c.name,
    value: c.percentage,
    percentage: c.percentage,
    count: c.commits,
    color: c.color
  }));

  return (
    <div className="flex-1 flex flex-col h-full bg-[#08090e] overflow-y-auto">
      
      {/* Top Header matching mockup */}
      <div className="p-6 border-b border-white/5 bg-[#0b0e17]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Feature Identity */}
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 shadow-lg shadow-yellow-500/10 shrink-0">
              {getIcon()}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {fname}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
                {summary}
              </p>
            </div>
          </div>

          {/* Generate Documentation Action */}
          <button
            onClick={() => onGenerateDoc(feature)}
            disabled={isGenerating}
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 font-extrabold text-xs shadow-xl shadow-yellow-500/25 hover:shadow-yellow-400/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border border-yellow-300 shrink-0 self-start sm:self-center"
          >
            <Sparkles className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
            <span>{isGenerating ? "Synthesizing Documentation..." : "Generate Documentation"}</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-6 mt-6 border-b border-white/5 text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab("overview")}
            className={`pb-2 transition-all relative ${
              activeSubTab === "overview"
                ? "text-yellow-400 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Overview
            {activeSubTab === "overview" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400 rounded-full shadow-sm shadow-yellow-400" />
            )}
          </button>

          <button
            onClick={() => setActiveSubTab("files")}
            className={`pb-2 transition-all relative ${
              activeSubTab === "files"
                ? "text-yellow-400 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Files ({filesCount})
            {activeSubTab === "files" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400 rounded-full shadow-sm shadow-yellow-400" />
            )}
          </button>

          <button
            onClick={() => setActiveSubTab("commits")}
            className={`pb-2 transition-all relative ${
              activeSubTab === "commits"
                ? "text-yellow-400 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Commits ({commitsCount})
            {activeSubTab === "commits" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400 rounded-full shadow-sm shadow-yellow-400" />
            )}
          </button>

          <button
            onClick={() => setActiveSubTab("integrations")}
            className={`pb-2 transition-all relative ${
              activeSubTab === "integrations"
                ? "text-yellow-400 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Integrations ({integrationsCount})
            {activeSubTab === "integrations" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400 rounded-full shadow-sm shadow-yellow-400" />
            )}
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="p-6 space-y-6">
        
        {/* Sub-Tab: Overview */}
        {activeSubTab === "overview" && (
          <>
            {/* Top Cards: Contributors & Contribution Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Card 1: Contributors */}
              <div className="p-5 rounded-2xl bg-[#0e121d] border border-white/5 backdrop-blur-md shadow-xl flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-100 mb-4 tracking-wide">
                    Contributors
                  </h3>
                  <div className="space-y-4">
                    {contributors.map((c) => (
                      <div
                        key={c.name}
                        onClick={() => onSelectDeveloper(c.name.toLowerCase())}
                        className="group cursor-pointer"
                      >
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={c.avatar}
                              alt={c.name}
                              className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-700 group-hover:ring-yellow-400 transition-all"
                            />
                            <span className="font-semibold text-slate-200 group-hover:text-yellow-300 transition-colors">
                              {c.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400 font-mono">
                              {c.commits} commits
                            </span>
                            <span className="font-mono font-bold text-slate-100">
                              {c.percentage}%
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${c.percentage}%`,
                              backgroundColor: c.color || "#facc15"
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 text-[11px] text-slate-400 flex items-center justify-between mt-4">
                  <span>Calculated via commit SHA authorship</span>
                  <span className="text-yellow-400 hover:underline cursor-pointer" onClick={() => onSelectDeveloper("rahul")}>
                    Inspect Developer Risk →
                  </span>
                </div>
              </div>

              {/* Card 2: Contribution Distribution (Donut Chart matching mockup) */}
              <div className="p-5 rounded-2xl bg-[#0e121d] border border-white/5 backdrop-blur-md shadow-xl flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-100 mb-4 tracking-wide">
                    Contribution Distribution
                  </h3>

                  <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
                    {/* SVG Donut */}
                    <DonutChart
                      data={chartData}
                      centerTitle={`${commitsCount}`}
                      centerSubtitle="Commits"
                      size={180}
                      strokeWidth={22}
                    />

                    {/* Chart Legend */}
                    <div className="space-y-2.5 min-w-[130px]">
                      {contributors.map((c) => (
                        <div key={c.name} className="flex items-center justify-between text-xs gap-3">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: c.color || "#facc15" }}
                            />
                            <span className="text-slate-300 font-medium">
                              {c.name}
                            </span>
                          </div>
                          <span className="font-mono font-bold text-slate-200">
                            {c.percentage}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 text-[11px] text-slate-400 flex items-center justify-between mt-4">
                  <span>Total Commits Analyzed</span>
                  <span className="font-mono text-white font-bold">{commitsCount}</span>
                </div>
              </div>

            </div>

            {/* Bottom Row: 4 Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              
              {/* Files */}
              <div className="p-4 rounded-xl bg-[#0e121d] border border-white/5">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Files
                </div>
                <div className="text-2xl font-black text-white">
                  {filesCount}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Modified files
                </div>
              </div>

              {/* Services */}
              <div className="p-4 rounded-xl bg-[#0e121d] border border-white/5">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Services
                </div>
                <div className="text-2xl font-black text-white">
                  {servicesCount}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Related services
                </div>
              </div>

              {/* Integrations */}
              <div className="p-4 rounded-xl bg-[#0e121d] border border-white/5">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Integrations
                </div>
                <div className="text-2xl font-black text-white">
                  {integrationsCount}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  External APIs
                </div>
              </div>

              {/* Knowledge Risk */}
              <div className="p-4 rounded-xl bg-[#0e121d] border border-red-500/20 bg-gradient-to-br from-red-500/5 to-transparent">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Knowledge Risk
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-black uppercase tracking-wider">
                    {riskLevel}
                  </span>
                </div>
                <div className="text-[10px] text-red-300/80 mt-1 font-medium">
                  {riskBadge}
                </div>
              </div>

            </div>
          </>
        )}

        {/* Sub-Tab: Files */}
        {activeSubTab === "files" && (
          <div className="p-5 rounded-2xl bg-[#0e121d] border border-white/5 space-y-3">
            <h3 className="text-sm font-bold text-white mb-2">
              Modified Source Files ({files.length})
            </h3>
            <div className="space-y-2">
              {files.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-white/5 hover:border-yellow-400/40 transition-all font-mono text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <FileCode className="h-4 w-4 text-yellow-400" />
                    <div>
                      <span className="text-white font-semibold">{file.path}</span>
                      <span className="text-slate-500 text-[10px] ml-2 hidden sm:inline">({file.name})</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-400 font-semibold">{file.changes}</span>
                    <span className="text-slate-400 text-[11px]">{file.lines} lines</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sub-Tab: Commits */}
        {activeSubTab === "commits" && (
          <div className="p-5 rounded-2xl bg-[#0e121d] border border-white/5 space-y-3">
            <h3 className="text-sm font-bold text-white mb-2">
              Semantic Feature Commits ({commits.length})
            </h3>
            <div className="space-y-2">
              {commits.map((c, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-slate-900/60 border border-white/5 hover:border-yellow-400/40 transition-all text-xs"
                >
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <div className="flex items-center gap-2">
                      <GitCommit className="h-3.5 w-3.5 text-yellow-400" />
                      <span className="font-mono text-yellow-300 font-bold">{c.sha}</span>
                      <span>•</span>
                      <span className="text-slate-200 font-semibold">{c.author}</span>
                    </div>
                    <span className="text-[11px]">{c.date}</span>
                  </div>
                  <div className="text-slate-100 font-mono text-[11px] pl-5">
                    {c.message}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sub-Tab: Integrations */}
        {activeSubTab === "integrations" && (
          <div className="p-5 rounded-2xl bg-[#0e121d] border border-white/5 space-y-3">
            <h3 className="text-sm font-bold text-white mb-2">
              Linked Services & Third-Party APIs ({integrations.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {integrations.map((integ, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white text-xs">{integ.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {integ.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">{integ.type}</div>
                  <div className="text-[10px] font-mono text-yellow-400 mt-2">
                    Avg Latency: {integ.latency}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
