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
  Sparkles
} from "lucide-react";

export function FeaturesColumn({
  features = [],
  selectedFeatureId = "",
  onSelectFeature = () => {},
  onClusterNew = () => {}
}) {
  const [localSearch, setLocalSearch] = useState("");

  const getFeatureIcon = (iconName) => {
    switch (iconName) {
      case "Lock":
        return <Lock className="h-3.5 w-3.5" />;
      case "CreditCard":
        return <CreditCard className="h-3.5 w-3.5" />;
      case "Package":
        return <Package className="h-3.5 w-3.5" />;
      case "Users":
        return <Users className="h-3.5 w-3.5" />;
      case "Box":
        return <Box className="h-3.5 w-3.5" />;
      case "Bell":
        return <Bell className="h-3.5 w-3.5" />;
      case "ShoppingCart":
        return <ShoppingCart className="h-3.5 w-3.5" />;
      case "ShieldCheck":
        return <ShieldCheck className="h-3.5 w-3.5" />;
      case "Layout":
        return <Layout className="h-3.5 w-3.5" />;
      default:
        return <Sparkles className="h-3.5 w-3.5" />;
    }
  };

  const filtered = features.filter((f) => {
    const name = f.name || f.feature_name || "";
    return name.toLowerCase().includes(localSearch.toLowerCase());
  });

  return (
    <div className="w-64 shrink-0 flex flex-col border-r border-white/5 bg-[#0c101b] select-none h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-300 tracking-wide">
            Features
          </span>
          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-400">
            {features.length}
          </span>
        </div>
        <button
          onClick={onClusterNew}
          title="Cluster new commits into features"
          className="p-1 rounded-md text-slate-400 hover:text-yellow-400 hover:bg-yellow-400/10 transition-colors"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-2 border-b border-white/5">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search features..."
            className="w-full bg-[#121727] border border-slate-700/50 rounded-lg pl-7 pr-3 py-1.5 text-[11px] text-slate-200 placeholder-slate-400 focus:outline-none focus:border-yellow-400/70 transition-all font-mono"
          />
        </div>
      </div>

      {/* Feature Items List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {filtered.map((feature) => {
          const fid = feature.id || feature.feature_id;
          const fname = feature.name || feature.feature_name;
          const commits = feature.commitsCount || feature.commit_count || (feature.commits?.length) || 0;
          const files = feature.filesCount || (feature.files?.length) || (feature.primary_files_hint?.length) || 0;
          const isSelected = selectedFeatureId === fid;

          return (
            <button
              key={fid}
              onClick={() => onSelectFeature(fid)}
              className={`w-full p-2.5 rounded-xl text-left transition-all ${
                isSelected
                  ? "bg-gradient-to-r from-yellow-400/20 via-yellow-400/10 to-transparent border border-yellow-400/40 text-yellow-300 shadow-md shadow-yellow-500/10"
                  : "hover:bg-slate-800/40 text-slate-300 hover:text-white border border-transparent"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`p-1.5 rounded-lg shrink-0 ${
                    isSelected
                      ? "bg-yellow-400 text-slate-950 font-bold shadow-sm shadow-yellow-400/40"
                      : "bg-slate-800/80 text-yellow-400 border border-slate-700/60"
                  }`}
                >
                  {getFeatureIcon(feature.icon)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-xs font-semibold truncate ${isSelected ? "text-yellow-300 font-bold" : "text-slate-200"}`}>
                    {fname}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                    {commits} commits • {files} files
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
