import React, { useState } from "react";
import {
  RepoIcon,
  LockIcon,
  GlobeIcon,
  SyncIcon,
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon
} from "@primer/octicons-react";

export function RepositoriesColumn({
  repositories = [],
  selectedRepoId = "",
  onSelectRepo = () => {},
  onAddRepo = () => {},
  onSyncRepo = () => {},
  isSyncing = false,
  collapsed = false,
  onToggleCollapse = () => {}
}) {
  const [localSearch, setLocalSearch] = useState("");

  const filtered = repositories.filter((r) => {
    const name = typeof r === "string" ? r : r.name;
    return name.toLowerCase().includes(localSearch.toLowerCase());
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
            title="Expand Repositories"
            className="github-button"
            style={{ width: "28px", height: "28px", padding: 0 }}
          >
            <ChevronRightIcon size={14} />
          </button>
          <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--fg-muted)" }}>
            {repositories.length}
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 pb-2">
          <button
            onClick={onSyncRepo}
            disabled={isSyncing}
            title="Refresh repository commits"
            className="github-button"
            style={{ width: "28px", height: "28px", padding: 0 }}
          >
            <SyncIcon size={14} className={isSyncing ? "animate-spin text-blue-500" : ""} />
          </button>
          <button
            onClick={onAddRepo}
            title="Add repository"
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
      className="w-56 lg:w-64 shrink-0 flex flex-col select-none h-full min-h-0 overflow-hidden"
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
          <RepoIcon size={16} />
          <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--fg-default)" }} className="truncate">
            Repositories
          </span>
          <span className="badge" style={{ fontSize: "11px", padding: "1px 5px" }}>
            {repositories.length}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onSyncRepo}
            disabled={isSyncing}
            title="Refresh repository commits"
            className="github-button"
            style={{ width: "28px", height: "28px", padding: 0 }}
          >
            <SyncIcon size={14} className={isSyncing ? "animate-spin" : ""} />
          </button>
          <button
            onClick={onAddRepo}
            title="Mount new repository"
            className="github-button"
            style={{ width: "28px", height: "28px", padding: 0 }}
          >
            <PlusIcon size={14} />
          </button>
          <button
            onClick={onToggleCollapse}
            title="Collapse column"
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
            placeholder="Find a repository..."
            className="github-input w-full"
            style={{ height: "28px", paddingLeft: "26px", fontSize: "12px", borderRadius: "6px" }}
          />
        </div>
      </div>

      {/* Repositories List */}
      <div className="flex-1 overflow-y-auto min-h-0 p-2 space-y-1">
        {filtered.map((repo) => {
          const repoId = typeof repo === "string" ? repo : repo.id || repo.name;
          const repoName = typeof repo === "string" ? repo : repo.name;
          const visibility = typeof repo === "object" ? repo.visibility || "Public" : "Public";
          const isSelected = selectedRepoId === repoId || selectedRepoId === repoName;

          return (
            <button
              key={repoId}
              onClick={() => onSelectRepo(repoId)}
              className="github-sidebar-item w-full"
              style={{
                backgroundColor: isSelected ? "var(--bg-default)" : "transparent",
                border: isSelected ? "1px solid var(--border-default)" : "1px solid transparent",
                boxShadow: isSelected ? "0 1px 2px rgba(0,0,0,0.05)" : "none",
                padding: "8px 10px",
                borderRadius: "6px"
              }}
            >
              <div className="flex items-center justify-between gap-2 w-full">
                <div className="flex items-center gap-2 truncate">
                  <span style={{ color: isSelected ? "var(--accent-fg)" : "var(--fg-muted)" }}>
                    <RepoIcon size={14} />
                  </span>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: isSelected ? 600 : 500,
                      color: isSelected ? "var(--accent-fg)" : "var(--fg-default)"
                    }}
                    className="truncate font-mono"
                  >
                    {repoName}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {visibility === "Private" ? (
                    <LockIcon size={12} fill="var(--attention-fg)" />
                  ) : (
                    <GlobeIcon size={12} fill="var(--fg-muted)" />
                  )}
                  {isSelected && (
                    <span className="badge badge-success" style={{ fontSize: "10px", padding: "0 4px" }}>
                      Active
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}

        {filtered.length === 0 && (
          <div style={{ padding: "16px", textAlign: "center", fontSize: "13px", color: "var(--fg-muted)" }}>
            No repositories found
          </div>
        )}
      </div>
    </aside>
  );
}
