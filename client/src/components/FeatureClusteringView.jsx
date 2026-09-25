import React, { useState } from "react";
import {
  Sparkles,
  Layers,
  FileCode2,
  FileText,
  AlertTriangle,
  GitCommit,
  CheckCircle2,
  Sliders,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Flame,
  Search,
  Filter
} from "lucide-react";

export function FeatureClusteringView({
  features,
  loading,
  onCategorize,
  onGenerateDoc,
  generatingDocId,
  selectedRepo,
}) {
  const [maxCommits, setMaxCommits] = useState(50);
  const [includeKnowledge, setIncludeKnowledge] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedCommits, setExpandedCommits] = useState({});

  // Categories extraction
  const categories = [
    "all",
    ...Array.from(new Set(features.map((f) => f.category).filter(Boolean))),
  ];

  const filteredFeatures = features.filter((feat) => {
    const matchesSearch =
      feat.feature_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feat.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feat.feature_id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || feat.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleCommits = (featureId) => {
    setExpandedCommits((prev) => ({
      ...prev,
      [featureId]: !prev[featureId],
    }));
  };

  const getRiskStyle = (risk) => {
    switch (risk?.toUpperCase()) {
      case "CRITICAL":
        return "bg-rose-500/15 text-rose-400 border-rose-500/30";
      case "HIGH":
        return "bg-amber-500/15 text-amber-400 border-amber-500/30";
      case "MEDIUM":
        return "bg-yellow-500/15 text-yellow-400 border-yellow-500/30";
      default:
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Control Banner & Trigger Card */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-500/10 via-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Sparkles className="h-4 w-4" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                AI Feature Clustering & Synthesis
              </h2>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Analyzes repository git log in bulk using Gemini LLM. It clusters commits into logical product capabilities, computes developer concentration telemetry, and prepares documentation templates.
            </p>
          </div>

          {/* Configuration & Action */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            {/* Slider */}
            <div className="flex flex-col gap-1 min-w-[150px]">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Commit Depth:</span>
                <span className="font-mono text-cyan-400 font-semibold">{maxCommits}</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={maxCommits}
                onChange={(e) => setMaxCommits(Number(e.target.value))}
                className="accent-cyan-400 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
              />
            </div>

            {/* Checkbox */}
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeKnowledge}
                onChange={(e) => setIncludeKnowledge(e.target.checked)}
                className="accent-cyan-500 rounded cursor-pointer"
              />
              <span>Telemetry Graph</span>
            </label>

            {/* Run Button */}
            <button
              onClick={() => onCategorize({ max_commits: maxCommits, include_knowledge_graph: includeKnowledge })}
              disabled={loading || !selectedRepo}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin text-cyan-200" />
                  <span>Clustering Features...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-cyan-200" />
                  <span>Extract Features</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      {features.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search features, summaries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Filter:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
                  selectedCategory === cat
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                    : "bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Feature Cards Grid */}
      {filteredFeatures.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredFeatures.map((feat) => {
            const kg = feat.knowledge_graph;
            const isGenerating = generatingDocId === feat.feature_id;
            const commitsExpanded = expandedCommits[feat.feature_id];

            return (
              <div
                key={feat.feature_id}
                className="glass-card rounded-2xl p-5 border border-slate-800/80 hover:border-slate-700/80 transition-all flex flex-col justify-between shadow-lg relative group"
              >
                <div>
                  {/* Top Badge & Category */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                        {feat.category || "General Feature"}
                      </span>
                      <h3 className="text-base font-bold text-white mt-1.5 leading-snug group-hover:text-cyan-300 transition-colors">
                        {feat.feature_name}
                      </h3>
                      <p className="text-[11px] font-mono text-slate-500">#{feat.feature_id}</p>
                    </div>

                    {kg && (
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border whitespace-nowrap ${getRiskStyle(
                          kg.risk_level
                        )}`}
                      >
                        {kg.risk_level} Risk
                      </span>
                    )}
                  </div>

                  {/* Summary */}
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {feat.summary}
                  </p>

                  {/* Primary Files Hint */}
                  {feat.primary_files_hint && feat.primary_files_hint.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium mb-1.5">
                        <FileCode2 className="h-3 w-3 text-cyan-400" />
                        <span>Core Module Files:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {feat.primary_files_hint.map((file, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-900/90 text-cyan-300 border border-slate-800 truncate max-w-full"
                          >
                            {file}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Knowledge & Bus Factor Info */}
                  {kg && (
                    <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 mb-4 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Bus Factor:</span>
                        <span className="font-mono font-bold text-white">
                          {kg.bus_factor} {kg.bus_factor === 1 ? "(Single Bottleneck)" : "devs"}
                        </span>
                      </div>
                      {kg.dominant_developer && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">Dominant Dev:</span>
                          <span className="font-mono text-cyan-300">
                            @{kg.dominant_developer}
                          </span>
                        </div>
                      )}
                      <p className="text-[11px] text-slate-400 italic">
                        {kg.risk_summary}
                      </p>
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between gap-3">
                  {/* Commits Drawer Toggle */}
                  <button
                    onClick={() => toggleCommits(feat.feature_id)}
                    className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1 font-mono transition-colors"
                  >
                    <GitCommit className="h-3.5 w-3.5" />
                    <span>{feat.commit_count || feat.commit_shas?.length || 0} Commits</span>
                  </button>

                  {/* Generate Doc Button */}
                  <button
                    onClick={() => onGenerateDoc(feat)}
                    disabled={isGenerating}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-cyan-600 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 hover:border-cyan-500 shadow-sm transition-all disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <Sparkles className="h-3.5 w-3.5 animate-spin text-cyan-300" />
                        <span>Synthesizing Doc...</span>
                      </>
                    ) : (
                      <>
                        <FileText className="h-3.5 w-3.5 text-cyan-400" />
                        <span>Generate Doc</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Expandable commits list */}
                {commitsExpanded && feat.commit_shas && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 animate-in fade-in duration-200">
                    <p className="text-[11px] font-semibold text-slate-400 mb-1.5">
                      Included Commit SHAs:
                    </p>
                    <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
                      {feat.commit_shas.map((sha) => (
                        <div
                          key={sha}
                          className="flex items-center justify-between text-[11px] font-mono p-1 rounded bg-slate-950/80 text-cyan-300 border border-slate-800/50"
                        >
                          <span className="truncate">{sha}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : features.length === 0 && !loading ? (
        <div className="text-center py-16 px-4 border border-dashed border-slate-800 rounded-2xl bg-slate-950/40">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto mb-4 border border-cyan-500/20">
            <Sparkles className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">No Features Clustered Yet</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
            Click <strong className="text-cyan-300">"Extract Features"</strong> above to inspect the repository commits with Gemini AI.
          </p>
          <button
            onClick={() => onCategorize({ max_commits: maxCommits, include_knowledge_graph: includeKnowledge })}
            className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs shadow-lg shadow-cyan-500/20 transition-all"
          >
            Extract Features Now
          </button>
        </div>
      ) : null}
    </div>
  );
}
