import React, { useState, useEffect } from "react";
import {
  Search,
  Sparkles,
  ExternalLink,
  KeyRound,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
  Palette,
  ShieldAlert,
  Server,
  Terminal,
  Layers,
  UserCheck
} from "lucide-react";
import { API_BASE_URL, checkHealth } from "../services/api";

export function Navbar({
  user,
  onLogout,
  onOpenTokenModal,
  demoMode,
  onToggleDemoMode,
  activeTab,
  onSelectTab,
  searchQuery = "",
  onSearchChange = () => {},
  theme = "cyber-yellow",
  onToggleTheme = () => {},
  onSelectDeveloper = () => {}
}) {
  const [serverStatus, setServerStatus] = useState("checking");
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    checkHealth()
      .then(() => {
        if (mounted) setServerStatus("online");
      })
      .catch(() => {
        if (mounted) setServerStatus("offline");
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#090b12]/95 backdrop-blur-xl">
      <div className="w-full px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 gap-3 sm:gap-6">
          
          {/* Left: Window Controls + Logo */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Window control dots (matching desktop mockup) */}
            <div className="hidden sm:flex items-center gap-1.5 pr-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors shadow-sm" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors shadow-sm" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500 transition-colors shadow-sm" />
            </div>

            {/* Commitology Brand */}
            <div
              onClick={() => onSelectTab("workspace")}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-yellow-400 via-amber-500 to-purple-600 p-0.5 shadow-md shadow-yellow-500/20 group-hover:scale-105 transition-transform">
                <div className="h-full w-full rounded-[10px] bg-[#0c0f18] flex items-center justify-center">
                  <svg className="h-4 w-4 fill-yellow-400" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </div>
              </div>
              <span className="text-base font-extrabold tracking-tight bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-500 bg-clip-text text-transparent">
                Commitology
              </span>
            </div>
          </div>

          {/* Center: Search Bar with Ctrl K */}
          <div className="flex-1 max-w-md mx-auto hidden md:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search repositories, features, or developers..."
                className="w-full bg-[#121622]/90 border border-slate-700/60 rounded-xl pl-9 pr-14 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-yellow-400/80 focus:ring-1 focus:ring-yellow-400/30 transition-all font-sans"
              />
              <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-400 bg-slate-800/80 rounded border border-slate-700/80">
                Ctrl K
              </kbd>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* View navigation pills */}
            <div className="hidden lg:flex items-center gap-1 bg-slate-900/80 p-0.5 rounded-lg border border-white/5 text-xs font-semibold">
              <button
                onClick={() => onSelectTab("workspace")}
                className={`px-3 py-1 rounded-md transition-all ${
                  activeTab === "workspace"
                    ? "bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Workspace
              </button>
              <button
                onClick={() => onSelectTab("analytics")}
                className={`px-3 py-1 rounded-md transition-all ${
                  activeTab === "analytics"
                    ? "bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Telemetry
              </button>
            </div>

            {/* Demo Mode Toggle */}
            <button
              onClick={onToggleDemoMode}
              title={demoMode ? "Demo Mode is active (Offline rich sample data)" : "Live API Mode"}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
                demoMode
                  ? "bg-yellow-400/15 text-yellow-300 border-yellow-400/30 hover:bg-yellow-400/25 shadow-sm shadow-yellow-500/10"
                  : "bg-slate-900/60 text-slate-400 border-slate-700 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              <Sparkles className="h-3 w-3 text-yellow-400" />
              <span>{demoMode ? "Demo Mode" : "Live API"}</span>
            </button>

            {/* API Health Pill */}
            <div
              className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] bg-slate-900/80 border border-slate-800 text-slate-300 font-mono"
              title={`API Backend: ${API_BASE_URL} (${serverStatus})`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  serverStatus === "online"
                    ? "bg-emerald-400 shadow-sm shadow-emerald-400 animate-pulse"
                    : serverStatus === "offline"
                    ? "bg-rose-500"
                    : "bg-amber-400"
                }`}
              />
              <span className="text-slate-400">API:</span>
              <span className={serverStatus === "online" ? "text-emerald-300 font-bold" : "text-slate-400"}>
                {serverStatus}
              </span>
            </div>

            {/* User Profile / Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1 pl-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/60 transition-colors"
                >
                  <img
                    src={user.avatar_url || `https://ui-avatars.com/api/?name=${user.name || user.username}&background=facc15&color=090a0f`}
                    alt={user.name || user.username}
                    className="w-7 h-7 rounded-lg ring-1 ring-yellow-400/40 object-cover"
                  />
                  <span className="text-xs font-bold text-slate-200 hidden sm:inline max-w-[90px] truncate">
                    {user.name || user.username}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-xl bg-[#0f131d] border border-white/10 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 border-b border-white/5 mb-1">
                      <div className="text-xs font-bold text-white truncate">
                        {user.name || user.username}
                      </div>
                      <div className="text-[10px] text-yellow-400 font-mono truncate">
                        {user.email || "developer@github.com"}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onSelectDeveloper("rahul");
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-200 hover:text-yellow-300 hover:bg-yellow-400/10 rounded-lg transition-colors text-left"
                    >
                      <UserCheck className="h-3.5 w-3.5 text-yellow-400" />
                      <span>Developer Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onOpenTokenModal();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-200 hover:text-cyan-300 hover:bg-slate-800/60 rounded-lg transition-colors text-left"
                    >
                      <KeyRound className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Custom GitHub Token</span>
                    </button>

                    <a
                      href={`${API_BASE_URL}/docs`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-200 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors text-left"
                    >
                      <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                      <span>FastAPI Swagger Spec</span>
                    </a>

                    <div className="border-t border-white/5 my-1" />

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors text-left"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onToggleDemoMode}
                className="px-3 py-1.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold text-xs shadow-md transition-all"
              >
                Sign In / Demo
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
