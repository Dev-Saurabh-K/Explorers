import React from "react";
import {
  AlertIcon,
  GitCommitIcon,
  PeopleIcon,
  PersonIcon,
  ShieldCheckIcon,
  FlameIcon
} from "@primer/octicons-react";

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
          badgeClass: "badge-danger",
          label: "Critical Risk"
        };
      case "HIGH":
        return {
          badgeClass: "badge-danger",
          label: "High Risk"
        };
      case "MEDIUM":
        return {
          badgeClass: "badge-attention",
          label: "Moderate"
        };
      default:
        return {
          badgeClass: "badge-success",
          label: "Healthy"
        };
    }
  };

  const riskBadge = getRiskBadge(repo_risk_level);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* Bus Factor Card */}
      <div className="github-card github-card-padding-md flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--fg-muted)" }}>
            Repository Bus Factor
          </span>
          <span className={`badge ${riskBadge.badgeClass}`}>
            {riskBadge.label}
          </span>
        </div>

        <div className="flex items-baseline gap-2 mt-2">
          <span style={{ fontSize: "32px", fontWeight: 600, color: "var(--fg-default)", fontFamily: "var(--font-mono)" }}>
            {repo_bus_factor}
          </span>
          <span style={{ fontSize: "14px", color: "var(--fg-muted)" }}>
            {repo_bus_factor === 1 ? "developer" : "developers"}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-3 pt-3" style={{ borderTop: "1px solid var(--border-muted)", fontSize: "12px", color: "var(--fg-muted)" }}>
          <AlertIcon size={14} fill="var(--danger-fg)" />
          <span>If {repo_bus_factor} key author leaves, repo loses architectural continuity.</span>
        </div>
      </div>

      {/* Primary Contributor Card */}
      <div className="github-card github-card-padding-md flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--fg-muted)" }}>
            Lead Contributor
          </span>
          <PersonIcon size={16} fill="var(--fg-muted)" />
        </div>

        <div className="flex items-baseline gap-2 mt-2 truncate">
          <span style={{ fontSize: "20px", fontWeight: 600, color: "var(--fg-default)" }} className="truncate">
            @{dominant_contributor}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-3 pt-3" style={{ borderTop: "1px solid var(--border-muted)", fontSize: "12px", color: "var(--fg-muted)" }}>
          <ShieldCheckIcon size={14} fill="var(--success-fg)" />
          <span>Primary author across high-concentration features.</span>
        </div>
      </div>

      {/* Total Commits Card */}
      <div className="github-card github-card-padding-md flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--fg-muted)" }}>
            Analyzed Commits
          </span>
          <GitCommitIcon size={16} fill="var(--fg-muted)" />
        </div>

        <div className="flex items-baseline gap-2 mt-2">
          <span style={{ fontSize: "32px", fontWeight: 600, color: "var(--fg-default)", fontFamily: "var(--font-mono)" }}>
            {total_commits_analyzed}
          </span>
          <span style={{ fontSize: "14px", color: "var(--fg-muted)" }}>
            commits
          </span>
        </div>

        <div className="flex items-center gap-2 mt-3 pt-3" style={{ borderTop: "1px solid var(--border-muted)", fontSize: "12px", color: "var(--fg-muted)" }}>
          <span>Across {total_contributors} distinct git authors.</span>
        </div>
      </div>

      {/* Feature Concentration Card */}
      <div className="github-card github-card-padding-md flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--fg-muted)" }}>
            Decompiled Features
          </span>
          <FlameIcon size={16} fill={high_risk_features_count > 0 ? "var(--attention-fg)" : "var(--fg-muted)"} />
        </div>

        <div className="flex items-baseline gap-2 mt-2">
          <span style={{ fontSize: "32px", fontWeight: 600, color: "var(--fg-default)", fontFamily: "var(--font-mono)" }}>
            {totalFeatures}
          </span>
          <span style={{ fontSize: "14px", color: "var(--fg-muted)" }}>
            modules
          </span>
        </div>

        <div className="flex items-center gap-2 mt-3 pt-3" style={{ borderTop: "1px solid var(--border-muted)", fontSize: "12px", color: "var(--fg-muted)" }}>
          {high_risk_features_count > 0 ? (
            <span className="badge badge-attention" style={{ fontSize: "11px" }}>
              {high_risk_features_count} need succession coverage
            </span>
          ) : (
            <span className="badge badge-success" style={{ fontSize: "11px" }}>
              Knowledge balanced
            </span>
          )}
        </div>
      </div>

    </div>
  );
}
