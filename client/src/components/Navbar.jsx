import React, { useState, useRef, useEffect } from "react";
import {
  SearchIcon,
  SunIcon,
  MoonIcon,
  PeopleIcon,
  PulseIcon,
  CodeIcon,
  KeyIcon,
  SignOutIcon,
  ChevronDownIcon,
  PersonIcon,
  MarkGithubIcon
} from "@primer/octicons-react";
import { API_BASE_URL } from "../services/api";

export function Navbar({
  user,
  onLogout,
  onOpenTokenModal,
  activeTab,
  onSelectTab,
  searchQuery = "",
  onSearchChange = () => {},
  theme = "dark",
  onToggleTheme = () => {},
  onSelectDeveloper = () => {}
}) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="github-header sticky top-0 z-40 w-full shrink-0 select-none">
      <div className="w-full flex items-center justify-between gap-4">
        
        {/* Left: Brand + Search */}
        <div className="flex items-center gap-4 shrink-0">
          <div
            onClick={() => onSelectTab("workspace")}
            className="flex items-center gap-2 cursor-pointer"
            title="GitOcx — AI Codebase Intelligence"
          >
            <img
              src="/logo.png"
              alt="GitOcx Logo"
              style={{ width: "32px", height: "32px", borderRadius: "6px", objectFit: "contain" }}
            />
            <span style={{ fontSize: "16px", fontWeight: 600, color: "var(--fg-default)" }}>
              GitOcx
            </span>
          </div>

          {/* Search Input (14px font, 32px height, 6px radius) */}
          {user && (
            <div className="hidden md:flex items-center relative" style={{ width: "320px" }}>
              <span
                style={{
                  position: "absolute",
                  left: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--fg-muted)",
                  pointerEvents: "none",
                  display: "flex"
                }}
              >
                <SearchIcon size={16} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Type / to search..."
                className="github-input w-full"
                style={{ paddingLeft: "32px", paddingRight: "48px" }}
              />
              <kbd
                className="badge"
                style={{
                  position: "absolute",
                  right: "6px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "11px",
                  fontFamily: "var(--font-mono)",
                  padding: "1px 5px",
                  color: "var(--fg-muted)",
                  borderColor: "var(--border-default)"
                }}
              >
                Ctrl K
              </kbd>
            </div>
          )}
        </div>

        {/* Center: Navigation Tabs (14px, weight 500, active 2px border) */}
        {user && (
          <nav className="hidden lg:flex items-center" style={{ height: "64px" }}>
            <button
              onClick={() => onSelectTab("workspace")}
              className={`github-tab h-full ${activeTab === "workspace" ? "active" : ""}`}
            >
              <CodeIcon size={16} />
              <span>Workspace</span>
            </button>

            <button
              onClick={() => onSelectTab("analytics")}
              className={`github-tab h-full ${activeTab === "analytics" ? "active" : ""}`}
            >
              <PulseIcon size={16} />
              <span>Telemetry</span>
            </button>

            <button
              onClick={() => onSelectTab("team")}
              className={`github-tab h-full ${activeTab === "team" ? "active" : ""}`}
            >
              <PeopleIcon size={16} />
              <span>Team & Succession</span>
            </button>
          </nav>
        )}

        {/* Right: Actions + Theme + Avatar */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Theme Switcher Button (32px, 6px radius, Octicon) */}
          <button
            onClick={onToggleTheme}
            type="button"
            className="github-button"
            style={{ width: "32px", padding: 0 }}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <SunIcon size={16} /> : <MoonIcon size={16} />}
          </button>

          {/* User Profile / Menu */}
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="github-button"
                style={{ padding: "0 6px", height: "32px", gap: "6px" }}
              >
                <img
                  src={user.avatar_url || `https://ui-avatars.com/api/?name=${user.name || user.username}&background=161b22&color=f0f6fc`}
                  alt={user.name || user.username}
                  className="avatar avatar-small"
                  style={{ width: "20px", height: "20px", borderRadius: "50%" }}
                />
                <span style={{ fontSize: "14px", fontWeight: 500, maxWidth: "110px" }} className="hidden sm:inline truncate">
                  {user.name || user.username}
                </span>
                <ChevronDownIcon size={12} />
              </button>

              {userMenuOpen && (
                <div
                  className="github-menu"
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "38px",
                    zIndex: 100,
                    width: "220px"
                  }}
                >
                  <div style={{ padding: "8px 12px", borderBottom: "1px solid var(--border-muted)" }}>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--fg-default)" }} className="truncate">
                      {user.name || user.username}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--fg-muted)", fontFamily: "var(--font-mono)" }} className="truncate">
                      {user.email || "developer@github.com"}
                    </div>
                  </div>

                  <div style={{ padding: "4px 0" }}>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onSelectDeveloper(user.username || user.name);
                      }}
                      className="github-menu-item"
                    >
                      <PersonIcon size={16} />
                      <span>Developer Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onSelectTab("team");
                      }}
                      className="github-menu-item"
                    >
                      <PeopleIcon size={16} />
                      <span>Team & Succession</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onOpenTokenModal();
                      }}
                      className="github-menu-item"
                    >
                      <KeyIcon size={16} />
                      <span>Custom GitHub Token</span>
                    </button>

                  </div>

                  <div style={{ borderTop: "1px solid var(--border-muted)", margin: "4px 0" }} />

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onLogout();
                    }}
                    className="github-menu-item"
                    style={{ color: "var(--danger-fg)" }}
                  >
                    <SignOutIcon size={16} />
                    <span>Sign out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                window.location.href = `${API_BASE_URL}/auth/github`;
              }}
              className="github-button github-button-primary"
            >
              <MarkGithubIcon size={16} />
              <span>Sign In</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
