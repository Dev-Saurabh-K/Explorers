import React from "react";
import {
  PeopleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TrophyIcon
} from "@primer/octicons-react";

export function DevelopersColumn({
  developers = [],
  selectedDeveloperId = null,
  onSelectDeveloper = () => {},
  searchQuery = "",
  collapsed = false,
  onToggleCollapse = () => {},
  width = 220,
  onOpenTeamPage = () => {}
}) {
  const filteredDevs = developers.filter((dev) => {
    const name = dev.name || dev.developer || "";
    const role = dev.role || "";
    const q = searchQuery.toLowerCase();
    return name.toLowerCase().includes(q) || role.toLowerCase().includes(q);
  });

  if (collapsed) {
    return (
      <div
        className="w-12 shrink-0 flex flex-col items-center py-2 select-none h-full min-h-0 overflow-hidden"
        style={{ backgroundColor: "var(--bg-muted)", borderRight: "1px solid var(--border-default)" }}
      >
        <div className="flex flex-col items-center gap-2 pb-2 w-full px-1 shrink-0" style={{ borderBottom: "1px solid var(--border-default)" }}>
          <button
            onClick={onToggleCollapse}
            title="Expand Authors"
            className="github-button"
            style={{ width: "28px", height: "28px", padding: 0 }}
          >
            <ChevronRightIcon size={14} />
          </button>
          <div className="flex items-center gap-1" style={{ fontSize: "11px", fontWeight: 600, color: "var(--fg-muted)" }}>
            <span>{developers.length}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 py-2 px-1 space-y-1.5 w-full flex flex-col items-center">
          {filteredDevs.map((dev, idx) => {
            const id = dev.id || dev.developer || `dev-${idx}`;
            const name = dev.name || dev.developer;
            const isSelected = selectedDeveloperId === id || selectedDeveloperId === name;
            const percentage = dev.knowledge_percentage ?? dev.commit_percentage ?? (dev.percentage || 50);
            const avatar = dev.avatar || dev.avatar_url || `https://ui-avatars.com/api/?name=${name}&background=161b22&color=f0f6fc`;

            return (
              <button
                key={id}
                onClick={() => onSelectDeveloper(id)}
                title={`@${name} • ${Math.round(percentage)}%`}
                style={{
                  padding: "2px",
                  borderRadius: "50%",
                  border: isSelected ? "2px solid var(--accent-fg)" : "1px solid var(--border-default)",
                  background: isSelected ? "var(--accent-muted)" : "transparent",
                  cursor: "pointer"
                }}
              >
                <img
                  src={avatar}
                  alt={name}
                  className="avatar avatar-small"
                  style={{ width: "24px", height: "24px", borderRadius: "50%" }}
                />
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <aside
      style={{
        width: `${width}px`,
        backgroundColor: "var(--bg-muted)",
        borderRight: "1px solid var(--border-default)"
      }}
      className="shrink-0 flex flex-col select-none h-full min-h-0 overflow-hidden"
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
          <PeopleIcon size={16} />
          <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--fg-default)" }} className="truncate">
            Authors
          </span>
          <span className="badge" style={{ fontSize: "11px", padding: "1px 5px" }}>
            {developers.length}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {onOpenTeamPage && (
            <button
              onClick={onOpenTeamPage}
              title="Team Roster & Succession"
              className="github-button"
              style={{ width: "28px", height: "28px", padding: 0 }}
            >
              <TrophyIcon size={14} />
            </button>
          )}

          <button
            onClick={onToggleCollapse}
            title="Collapse Authors"
            className="github-button"
            style={{ width: "28px", height: "28px", padding: 0 }}
          >
            <ChevronLeftIcon size={14} />
          </button>
        </div>
      </div>

      {/* Developer List */}
      <div className="flex-1 overflow-y-auto min-h-0 p-2 space-y-1">
        {filteredDevs.map((dev, idx) => {
          const id = dev.id || dev.developer || `dev-${idx}`;
          const name = dev.name || dev.developer;
          const isSelected = selectedDeveloperId === id || selectedDeveloperId === name;
          const isDominant = dev.isDominant || dev.is_dominant || idx === 0;
          const percentage = dev.knowledge_percentage ?? dev.commit_percentage ?? (dev.percentage || 50);
          const avatar = dev.avatar || dev.avatar_url || `https://ui-avatars.com/api/?name=${name}&background=161b22&color=f0f6fc`;

          return (
            <button
              key={id}
              onClick={() => onSelectDeveloper(id)}
              className="github-sidebar-item w-full"
              style={{
                backgroundColor: isSelected ? "var(--bg-default)" : "transparent",
                border: isSelected ? "1px solid var(--border-default)" : "1px solid transparent",
                boxShadow: isSelected ? "0 1px 2px rgba(0,0,0,0.05)" : "none",
                padding: "8px",
                borderRadius: "6px"
              }}
            >
              {/* Avatar */}
              <div className="relative shrink-0 flex items-center">
                <img
                  src={avatar}
                  alt={name}
                  className="avatar avatar-small"
                  style={{ width: "24px", height: "24px", borderRadius: "50%" }}
                />
              </div>

              {/* Dev Name & Metadata */}
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between gap-1">
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: isSelected ? 600 : 500,
                      color: isSelected ? "var(--accent-fg)" : "var(--fg-default)"
                    }}
                    className="truncate"
                  >
                    @{name}
                  </span>
                  <span
                    className="badge"
                    style={{
                      fontSize: "11px",
                      padding: "0 4px",
                      fontFamily: "var(--font-mono)",
                      color: isDominant ? "var(--attention-fg)" : "var(--fg-muted)"
                    }}
                  >
                    {Math.round(percentage)}%
                  </span>
                </div>
                <div style={{ fontSize: "12px", color: "var(--fg-muted)", marginTop: "2px" }} className="flex items-center justify-between">
                  <span className="truncate">{dev.role || `${dev.commit_count || dev.commitsCount || 0} commits`}</span>
                  {isDominant && (
                    <span className="badge badge-attention" style={{ fontSize: "10px", padding: "0 4px" }}>LEAD</span>
                  )}
                </div>
              </div>
            </button>
          );
        })}

        {filteredDevs.length === 0 && (
          <div style={{ padding: "16px", textAlign: "center", fontSize: "13px", color: "var(--fg-muted)" }}>
            No authors found
          </div>
        )}
      </div>
    </aside>
  );
}
