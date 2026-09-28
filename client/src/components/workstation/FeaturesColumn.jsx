import React, { useState } from "react";
import {
  PackageIcon,
  ShieldLockIcon,
  CreditCardIcon,
  TagIcon,
  CpuIcon,
  ZapIcon,
  PlusIcon,
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "@primer/octicons-react";

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

  const getFeatureIcon = (category = "") => {
    const cat = category.toLowerCase();
    if (cat.includes("auth") || cat.includes("security") || cat.includes("admin")) {
      return <ShieldLockIcon size={14} />;
    }
    if (cat.includes("pay") || cat.includes("bill") || cat.includes("checkout")) {
      return <CreditCardIcon size={14} />;
    }
    if (cat.includes("ai") || cat.includes("ml")) {
      return <CpuIcon size={14} />;
    }
    if (cat.includes("data") || cat.includes("db") || cat.includes("model")) {
      return <ZapIcon size={14} />;
    }
    return <PackageIcon size={14} />;
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
      <div
        className="w-12 shrink-0 flex flex-col items-center py-2 select-none h-full min-h-0 justify-between"
        style={{ backgroundColor: "var(--bg-muted)", borderRight: "1px solid var(--border-default)" }}
      >
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={onToggleCollapse}
            title="Expand Features"
            className="github-button"
            style={{ width: "28px", height: "28px", padding: 0 }}
          >
            <ChevronRightIcon size={14} />
          </button>
          <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--fg-muted)" }}>
            {features.length}
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 pb-2">
          <button
            onClick={onClusterNew}
            disabled={isCategorizing}
            title="Decompile features"
            className="github-button"
            style={{ width: "28px", height: "28px", padding: 0 }}
          >
            <PlusIcon size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <aside
      className="w-64 lg:w-72 shrink-0 flex flex-col select-none h-full min-h-0 overflow-hidden"
      style={{ backgroundColor: "var(--bg-muted)", borderRight: "1px solid var(--border-default)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 shrink-0"
        style={{
          height: "44px",
          backgroundColor: "var(--bg-default)",
          borderBottom: "1px solid var(--border-default)"
        }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <TagIcon size={16} />
          <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--fg-default)" }} className="truncate">
            Features
          </span>
          <span className="badge" style={{ fontSize: "11px", padding: "1px 5px" }}>
            {features.length}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onClusterNew}
            disabled={isCategorizing}
            title="Decompile Features with AI"
            className="github-button"
            style={{ height: "28px", padding: "0 8px", fontSize: "12px" }}
          >
            <PlusIcon size={12} />
            <span>{isCategorizing ? "Decompiling..." : "Scan"}</span>
          </button>
          <button
            onClick={onToggleCollapse}
            title="Collapse Features"
            className="github-button"
            style={{ width: "28px", height: "28px", padding: 0 }}
          >
            <ChevronLeftIcon size={14} />
          </button>
        </div>
      </div>

      {/* Filter Input */}
      <div
        className="p-2 shrink-0"
        style={{ borderBottom: "1px solid var(--border-muted)", backgroundColor: "var(--bg-default)" }}
      >
        <div className="relative">
          <span
            style={{
              position: "absolute",
              left: "8px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--fg-muted)",
              pointerEvents: "none",
              display: "flex"
            }}
          >
            <SearchIcon size={12} />
          </span>
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Filter features..."
            className="github-input w-full"
            style={{ height: "28px", paddingLeft: "26px", fontSize: "12px", borderRadius: "6px" }}
          />
        </div>
      </div>

      {/* Feature List */}
      <div className="flex-1 overflow-y-auto min-h-0 p-2 space-y-1">
        {filtered.map((feat) => {
          const fid = feat.id || feat.feature_id;
          const fname = feat.name || feat.feature_name;
          const category = feat.category || "General";
          const isSelected = selectedFeatureId === fid;
          const risk = feat.riskLevel || feat.knowledge_graph?.risk_level || "MEDIUM";
          const commits = feat.commitsCount || feat.commit_count || (feat.commit_shas ? feat.commit_shas.length : 0) || 1;

          return (
            <button
              key={fid}
              onClick={() => onSelectFeature(fid)}
              className="github-sidebar-item w-full"
              style={{
                backgroundColor: isSelected ? "var(--bg-default)" : "transparent",
                border: isSelected ? "1px solid var(--border-default)" : "1px solid transparent",
                boxShadow: isSelected ? "0 1px 2px rgba(0,0,0,0.05)" : "none",
                padding: "8px 10px",
                borderRadius: "6px",
                display: "block"
              }}
            >
              <div className="flex items-start gap-2 w-full text-left">
                <span
                  style={{
                    color: isSelected ? "var(--accent-fg)" : "var(--fg-muted)",
                    marginTop: "2px",
                    display: "flex"
                  }}
                >
                  {getFeatureIcon(category)}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: isSelected ? 600 : 500,
                        color: isSelected ? "var(--accent-fg)" : "var(--fg-default)"
                      }}
                      className="truncate"
                    >
                      {fname}
                    </span>
                    <span
                      className={`badge ${
                        risk === "HIGH" || risk === "CRITICAL"
                          ? "badge-danger"
                          : risk === "MEDIUM"
                          ? "badge-attention"
                          : "badge-success"
                      }`}
                      style={{ fontSize: "10px", padding: "0 4px" }}
                    >
                      {risk}
                    </span>
                  </div>

                  <p
                    style={{
                      fontSize: "12px",
                      color: "var(--fg-muted)",
                      marginTop: "2px",
                      lineHeight: "1.4"
                    }}
                    className="line-clamp-2"
                  >
                    {feat.summary}
                  </p>

                  <div className="flex items-center justify-between gap-1 mt-1.5" style={{ fontSize: "11px", color: "var(--fg-subtle)" }}>
                    <span className="badge" style={{ fontSize: "10px", padding: "0 4px" }}>
                      {category}
                    </span>
                    <span style={{ fontFamily: "var(--font-mono)" }}>
                      {commits} commits
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}

        {filtered.length === 0 && (
          <div style={{ padding: "16px", textAlign: "center", fontSize: "13px", color: "var(--fg-muted)" }}>
            No features found
          </div>
        )}
      </div>
    </aside>
  );
}
