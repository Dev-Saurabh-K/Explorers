import React, { useState, useEffect } from "react";
import {
  GitBranch,
  ShieldCheck,
  ShieldAlert,
  Terminal,
  LogOut,
  ExternalLink,
  KeyRound,
  Sparkles,
  ChevronDown,
  RefreshCw,
  Server
} from "lucide-react";
import { API_BASE_URL, checkHealth } from "../services/api";

export function Navbar({
  user,
  repos,
  selectedRepo,
  onSelectRepo,
  onLogout,
  onOpenTokenModal,
  demoMode,
  onToggleDemoMode,
  activeTab,
  onSelectTab,
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
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#090d16]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-sky-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white font-bold ring-1 ring-white/20">
              <GitBranch className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  Commitology
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  AI Telemetry
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Feature Clustering & Knowledge Risk Engine
              </p>
            </div>
          </div>

          {/* Repo Selector & Demo Mode Indicator */}
          <div className="flex items-center gap-3">
            {repos.length > 0 && (
              <div className="relative">
                <select
                  value={selectedRepo}
                  onChange={(e) => onSelectRepo(e.target.value)}
                  className="bg-slate-900/90 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-mono text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 appearance-none pr-8 cursor-pointer hover:border-slate-600 transition-colors shadow-inner"
                >
                  {repos.map((r) => (
                    <option key={r} value={r} className="bg-slate-900 text-slate-200">
                      {r}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              </div>
            )}

            {/* Demo Mode Toggle */}
            <button
              onClick={onToggleDemoMode}
              title={demoMode ? "Switch to Live Server Mode" : "Switch to Offline Demo Mode"}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all border ${
                demoMode
                  ? "bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/25"
                  : "bg-slate-800/60 text-slate-400 border-slate-700 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              <Sparkles className="h-3 w-3 text-amber-400" />
              <span className="hidden md:inline">{demoMode ? "Demo Mode (Mock)" : "Live API"}</span>
              <span className="md:hidden">{demoMode ? "Demo" : "Live"}</span>
            </button>
          </div>

          {/* Right Side: Health + Docs + User */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Backend Health Badge */}
            <div
              className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] bg-slate-900/60 border border-slate-800 text-slate-300"
              title={`FastAPI Backend: ${API_BASE_URL} (${serverStatus})`}
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
              <span className="hidden xl:inline text-slate-400">API:</span>
              <span className="font-mono">{serverStatus}</span>
            </div>

            {/* Swagger Docs Link */}
            <a
              href={`${API_BASE_URL}/docs`}
              target="_blank"
              rel="noreferrer"
              className="hidden lg:flex items-center gap-1 px-2.5 py-1 text-xs text-slate-400 hover:text-cyan-300 hover:bg-slate-800/60 rounded-md transition-colors border border-transparent hover:border-slate-700"
              title="Open Backend Swagger UI"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Docs</span>
            </a>

            {/* User Profile or Token Config */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1 pl-2 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 transition-colors"
                >
                  <img
                    src={user.avatar_url || `https://ui-avatars.com/api/?name=${user.username}`}
                    alt={user.username}
                    className="w-7 h-7 rounded-lg ring-1 ring-cyan-500/40 object-cover"
                  />
                  <span className="text-xs font-medium text-slate-200 hidden sm:inline max-w-[100px] truncate">
                    {user.name || user.username}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 mr-1" />
                </button>

                {userMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900/95 border border-slate-700/80 shadow-2xl backdrop-blur-2xl py-2 z-50 text-xs"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="font-semibold text-slate-200">{user.name || user.username}</p>
                      <p className="text-[11px] text-slate-400 font-mono">@{user.username}</p>
                      {user.email && <p className="text-[10px] text-slate-500 truncate">{user.email}</p>}
                    </div>

                    <button
                      onClick={onOpenTokenModal}
                      className="w-full text-left px-4 py-2 text-slate-300 hover:bg-slate-800/80 flex items-center gap-2"
                    >
                      <KeyRound className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Manage Bearer Token</span>
                    </button>

                    <button
                      onClick={() => onLogout(false)}
                      className="w-full text-left px-4 py-2 text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenTokenModal}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
              >
                <KeyRound className="h-3.5 w-3.5 text-cyan-400" />
                <span>Token</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 sm:space-x-3 overflow-x-auto py-2 border-t border-slate-800/50 scrollbar-none">
          {[
            { id: "features", label: "AI Feature Extraction", badge: "Gemini" },
            { id: "knowledge", label: "Knowledge Concentration", badge: "Bus Factor" },
            { id: "commits", label: "Commit Stream & Contributors" },
            { id: "api-explorer", label: "Live API Playground", badge: "12 Endpoints" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent"
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono uppercase ${
                    activeTab === tab.id
                      ? "bg-cyan-400/20 text-cyan-200"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
