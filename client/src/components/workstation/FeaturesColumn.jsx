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
  Plus,
  Search,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Zap,
  Terminal
} from "lucide-react";

export function FeaturesColumn({
  features = [],
  selectedFeatureId = "",
  onSelectFeature = () => {},
  onClusterNew = () => {},
  isCategorizing = false,
  collapsed = false,
  onToggleCollapse = () => {}
}) {
  const [localSearch, setLocalSearch] = useState("");

  const getFeatureIcon = (iconName, category = "") => {
    const cat = category.toLowerCase();
    if (iconName === "Lock" || cat.includes("auth") || cat.includes("security")) {
      return <Lock className="h-3 w-3 text-[#ffb000]" />;
    }
    if (iconName === "CreditCard" || cat.includes("pay") || cat.includes("bill")) {
      return <CreditCard className="h-3 w-3 text-[#ffb000]" />;
    }
    if (iconName === "Package" || cat.includes("order") || cat.includes("pack")) {
      return <Package className="h-3 w-3 text-[#00e5ff]" />;
    }
    if (iconName === "Users" || cat.includes("user")) {
      return <Users className="h-3 w-3 text-[#00ff66]" />;
    }
    if (iconName === "Box" || cat.includes("data") || cat.includes("db") || cat.includes("model")) {
      return <Box className="h-3 w-3 text-[#00e5ff]" />;
    }
    if (iconName === "Bell" || cat.includes("notif")) {
      return <Bell className="h-3 w-3 text-[#ff3366]" />;
    }
    if (iconName === "ShoppingCart" || cat.includes("cart")) {
      return <ShoppingCart className="h-3 w-3 text-[#ffb000]" />;
    }
    if (iconName === "ShieldCheck" || cat.includes("admin")) {
      return <ShieldCheck className="h-3 w-3 text-[#00ff66]" />;
    }
    if (cat.includes("ai") || cat.includes("ml")) {
      return <Cpu className="h-3 w-3 text-[#00ff66]" />;
    }
    return <Zap className="h-3 w-3 text-[#00e5ff]" />;
  };

  const filtered = features.filter((f) => {
    const name = f.name || f.feature_name || "";
    const summary = f.summary || "";
    const cat = f.category || "";
    const q = localSearch.toLowerCase();
    return name.toLowerCase().includes(q) || summary.toLowerCase().includes(q) || cat.toLowerCase().includes(q);
  });

  if (collapsed) {
    return (
      <div className="w-12 shrink-0 flex flex-col items-center py-3 border-r border-[#00ff66]/20 bg-[#090b10] select-none h-full min-h-0 justify-between font-mono">
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={onToggleCollapse}
            title="Expand Features Deck"
            className="p-1.5 rounded-lg border border-[#00e5ff]/40 text-[#00e5ff] hover:bg-[#00e5ff] hover:text-black transition"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
          <div className="text-[10px] text-[#00e5ff] rotate-90 my-8 whitespace-nowrap tracking-wider font-bold">
            FEATURES ({features.length})
          </div>
        </div>

        <button
          onClick={onClusterNew}
          disabled={isCategorizing}
          title="Extract Features"
          className="p-1.5 rounded-lg border border-[#ffb000] text-[#ffb000] hover:bg-[#ffb000] hover:text-black transition"
        >
          <Sparkles className={`h-3.5 w-3.5 ${isCategorizing ? "animate-spin" : ""}`} />
        </button>
      </div>
    );
  }

  return (
    <div className="w-60 lg:w-64 shrink-0 flex flex-col border-r border-[#00ff66]/20 bg-[#0a0d14] select-none h-full min-h-0 overflow-hidden font-mono">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-[#00ff66]/20 bg-[#0c0f18] shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <Terminal className="h-3.5 w-3.5 text-[#00e5ff] shrink-0" />
          <span className="text-[11px] font-bold text-white tracking-wider truncate uppercase">
            Features
          </span>
          <span className="text-[10px] px-1 py-0.2 rounded bg-black text-[#00e5ff] border border-[#00e5ff]/40 font-bold shrink-0">
            {features.length}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onClusterNew}
            disabled={isCategorizing}
            title="Extract & cluster features"
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#ffb000] hover:bg-[#00ff66] text-black font-bold text-[10px] uppercase shadow-[1px_1px_0px_#000] transition active:translate-x-0.5 active:translate-y-0.5"
          >
            <Sparkles className={`h-3 w-3 ${isCategorizing ? "animate-spin" : ""}`} />
            <span>{isCategorizing ? "SCAN..." : "EXTRACT"}</span>
          </button>

          <button
            onClick={onToggleCollapse}
            title="Collapse Features Column"
            className="p-1 rounded text-slate-500 hover:text-white transition"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-2 border-b border-[#00ff66]/15 bg-[#090b10] shrink-0">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search features..."
            className="w-full bg-black border border-slate-800 rounded pl-7 pr-2 py-1 text-[11px] text-[#00e5ff] placeholder-slate-600 focus:outline-none focus:border-[#00e5ff] transition-all font-mono"
          />
        </div>
      </div>

      {/* Feature Items List */}
      <div className="flex-1 overflow-y-auto min-h-0 p-1.5 space-y-1">
        {filtered.map((feature, idx) => {
          const fid = feature.id || feature.feature_id || `feat-${idx}`;
          const fname = feature.name || feature.feature_name || "Feature";
          const commits = feature.commitsCount || feature.commit_count || (feature.commit_shas?.length) || (feature.commits?.length) || 0;
          const files = feature.filesCount || (feature.files?.length) || (feature.primary_files_hint?.length) || 0;
          const category = feature.category || "General";
          const isSelected = selectedFeatureId === fid;

          return (
            <button
              key={fid}
              onClick={() => onSelectFeature(fid)}
              className={`w-full p-2 rounded text-left transition-all relative border text-[11px] ${
                isSelected
                  ? "bg-[#111928] border-[#00e5ff] text-[#00e5ff] shadow-[inset_0_0_8px_rgba(0,229,255,0.25)]"
                  : "bg-[#0b0e16] border-slate-900 text-slate-300 hover:border-slate-700 hover:text-white hover:bg-slate-900/40"
              }`}
            >
              <div className="flex items-start gap-2">
                <div
                  className={`p-1 rounded shrink-0 mt-0.5 ${
                    isSelected
                      ? "bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/40"
                      : "bg-black text-slate-400 border border-slate-800"
                  }`}
                >
                  {getFeatureIcon(feature.icon, category)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-[11px] font-bold truncate ${isSelected ? "text-white" : "text-slate-200"}`}>
                      {fname}
                    </span>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-black text-[#ffb000] border border-slate-800 shrink-0 font-bold">
                      {commits}c
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[9px] text-slate-500 mt-1">
                    <span className="truncate uppercase text-[#00ff66]/80 font-semibold">
                      [{category.slice(0, 10)}]
                    </span>
                    {files > 0 && (
                      <span className="shrink-0">{files} files</span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}

        {filtered.length === 0 && !isCategorizing && (
          <div className="p-4 text-center space-y-3 border border-dashed border-slate-800 rounded-lg m-1">
            <p className="text-[10px] text-slate-500 leading-relaxed">
              NO FEATURES CLUSTERED YET.
            </p>
            <button
              onClick={onClusterNew}
              className="w-full py-1.5 px-2 bg-[#ffb000] hover:bg-[#00ff66] text-black font-bold text-[10px] uppercase rounded transition"
            >
              ► DECOMPILE NOW
            </button>
          </div>
        )}

        {isCategorizing && (
          <div className="p-4 text-center space-y-2 border border-[#00e5ff]/40 rounded-lg bg-black/60 m-1">
            <Sparkles className="h-5 w-5 text-[#00e5ff] animate-spin mx-auto" />
            <p className="text-[10px] text-[#00e5ff] font-bold animate-pulse">
              DECOMPILING COMMITS...
            </p>
            <p className="text-[9px] text-slate-500">
              Synthesizing semantic feature clusters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
