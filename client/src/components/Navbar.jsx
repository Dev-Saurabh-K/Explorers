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
  Layers,
  UserCheck,
  Users
} from "lucide-react";
import { API_BASE_URL } from "../services/api";

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
  theme = "dark",
  onToggleTheme = () => {},
  onSelectDeveloper = () => {}
}) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className={`sticky top-0 z-40 w-full shrink-0 border-b backdrop-blur-xl transition-colors duration-200 ${
      theme === "light"
        ? "border-slate-200/80 bg-white/90 text-slate-800"
        : "border-white/5 bg-[#090b12]/95 text-slate-100"
    }`}>
      <div className="w-full px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 gap-3 sm:gap-6">
          
          {/* Left: Logo */}
          <div className="flex items-center gap-4 shrink-0">

            {/* GitOcx Brand */}
            <div
              onClick={() => onSelectTab("workspace")}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <img
                src="/logo.png"
                alt="GitOcx Logo"
                className="h-8 w-8 rounded-lg object-contain shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform"
              />
              <span className={`text-base font-black tracking-tight flex items-center ${
                theme === "light" ? "text-slate-900" : "text-white"
              }`}>
                Git<span className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">Ocx</span>
              </span>
            </div>
          </div>

          {/* Center: Search Bar with Ctrl K (Only shown when user is logged in) */}
          {user && (
            <div className="flex-1 max-w-md mx-auto hidden md:block">
              <div className="relative">
                <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none ${
                  theme === "light" ? "text-slate-400" : "text-slate-400"
                }`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search repositories, features, or developers..."
                  className={`w-full border rounded-xl pl-9 pr-14 py-1.5 text-xs transition-all font-sans focus:outline-none focus:ring-1 ${
                    theme === "light"
                      ? "bg-slate-100/90 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-yellow-500 focus:ring-yellow-400/40"
                      : "bg-[#121622]/90 border-slate-700/60 text-slate-200 placeholder-slate-400 focus:border-yellow-400/80 focus:ring-yellow-400/30"
                  }`}
                />
                <kbd className={`absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded border ${
                  theme === "light"
                    ? "text-slate-500 bg-slate-200/80 border-slate-300"
                    : "text-slate-400 bg-slate-800/80 border-slate-700/80"
                }`}>
                  Ctrl K
                </kbd>
              </div>
            </div>
          )}

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* View navigation pills (Only shown when user is logged in) */}
            {user && (
              <div className={`hidden lg:flex items-center gap-1 p-0.5 rounded-lg border text-xs font-semibold ${
                theme === "light"
                  ? "bg-slate-100 border-slate-200"
                  : "bg-slate-900/80 border-white/5"
              }`}>
                <button
                  onClick={() => onSelectTab("workspace")}
                  className={`px-3 py-1 rounded-md transition-all ${
                    activeTab === "workspace"
                      ? theme === "light"
                        ? "bg-white text-yellow-600 border border-yellow-400/50 shadow-xs font-bold"
                        : "bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 shadow-sm"
                      : theme === "light"
                        ? "text-slate-600 hover:text-slate-900"
                        : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Workspace
                </button>
                <button
                  onClick={() => onSelectTab("analytics")}
                  className={`px-3 py-1 rounded-md transition-all ${
                    activeTab === "analytics"
                      ? theme === "light"
                        ? "bg-white text-yellow-600 border border-yellow-400/50 shadow-xs font-bold"
                        : "bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 shadow-sm"
                      : theme === "light"
                        ? "text-slate-600 hover:text-slate-900"
                        : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Telemetry
                </button>
                <button
                  onClick={() => onSelectTab("team")}
                  className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                    activeTab === "team"
                      ? theme === "light"
                        ? "bg-white text-emerald-600 border border-emerald-500/50 shadow-xs font-bold"
                        : "bg-[#00ff66]/20 text-[#00ff66] border border-[#00ff66]/30 shadow-sm font-bold"
                      : theme === "light"
                        ? "text-slate-600 hover:text-slate-900"
                        : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Users className="h-3 w-3" />
                  Team & Succession
                </button>
              </div>
            )}

            {/* Dark / Light Mode Toggle Button */}
            <button
              onClick={onToggleTheme}
              type="button"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                theme === "light"
                  ? "bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700 shadow-xs"
                  : "bg-slate-900/90 hover:bg-slate-800 border-slate-700/60 text-slate-300 shadow-sm"
              }`}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-yellow-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="h-4 w-4 text-indigo-600 hover:-rotate-12 transition-transform" />
              )}
            </button>

            {/* User Profile / Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={`flex items-center gap-2 p-1 pl-2 rounded-xl border transition-colors ${
                    theme === "light"
                      ? "bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800"
                      : "bg-slate-900/90 hover:bg-slate-800 border-slate-700/60 text-slate-200"
                  }`}
                >
                  <img
                    src={user.avatar_url || `https://ui-avatars.com/api/?name=${user.name || user.username}&background=facc15&color=090a0f`}
                    alt={user.name || user.username}
                    className="w-7 h-7 rounded-lg ring-1 ring-yellow-400/40 object-cover"
                  />
                  <span className={`text-xs font-bold hidden sm:inline max-w-[90px] truncate ${
                    theme === "light" ? "text-slate-800" : "text-slate-200"
                  }`}>
                    {user.name || user.username}
                  </span>
                  <ChevronDown className={`h-3.5 w-3.5 ${theme === "light" ? "text-slate-500" : "text-slate-400"}`} />
                </button>

                {userMenuOpen && (
                  <div className={`absolute right-0 mt-2 w-52 rounded-xl border shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 ${
                    theme === "light"
                      ? "bg-white border-slate-200 text-slate-800 shadow-slate-300/50"
                      : "bg-[#0f131d] border-white/10 text-slate-200"
                  }`}>
                    <div className={`px-3 py-2 border-b mb-1 ${
                      theme === "light" ? "border-slate-100" : "border-white/5"
                    }`}>
                      <div className={`text-xs font-bold truncate ${
                        theme === "light" ? "text-slate-900" : "text-white"
                      }`}>
                        {user.name || user.username}
                      </div>
                      <div className={`text-[10px] font-mono truncate ${
                        theme === "light" ? "text-amber-600" : "text-yellow-400"
                      }`}>
                        {user.email || "developer@github.com"}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onSelectDeveloper(user.username || user.name);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg transition-colors text-left ${
                        theme === "light"
                          ? "text-slate-700 hover:text-amber-700 hover:bg-amber-50"
                          : "text-slate-200 hover:text-yellow-300 hover:bg-yellow-400/10"
                      }`}
                    >
                      <UserCheck className={`h-3.5 w-3.5 ${theme === "light" ? "text-amber-600" : "text-yellow-400"}`} />
                      <span>Developer Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onSelectTab("team");
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg transition-colors text-left ${
                        theme === "light"
                          ? "text-slate-700 hover:text-emerald-700 hover:bg-emerald-50"
                          : "text-slate-200 hover:text-[#00ff66] hover:bg-[#00ff66]/10"
                      }`}
                    >
                      <Users className={`h-3.5 w-3.5 ${theme === "light" ? "text-emerald-600" : "text-[#00ff66]"}`} />
                      <span>Team & Succession</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onOpenTokenModal();
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg transition-colors text-left ${
                        theme === "light"
                          ? "text-slate-700 hover:text-cyan-700 hover:bg-cyan-50"
                          : "text-slate-200 hover:text-cyan-300 hover:bg-slate-800/60"
                      }`}
                    >
                      <KeyRound className={`h-3.5 w-3.5 ${theme === "light" ? "text-cyan-600" : "text-cyan-400"}`} />
                      <span>Custom GitHub Token</span>
                    </button>

                    <a
                      href={`${API_BASE_URL}/docs`}
                      target="_blank"
                      rel="noreferrer"
                      className={`w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg transition-colors text-left ${
                        theme === "light"
                          ? "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                          : "text-slate-200 hover:text-white hover:bg-slate-800/60"
                      }`}
                    >
                      <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                      <span>FastAPI Swagger Spec</span>
                    </a>

                    <div className={`border-t my-1 ${theme === "light" ? "border-slate-100" : "border-white/5"}`} />

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-colors text-left"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  window.location.href = `${API_BASE_URL}/auth/github`;
                }}
                className="px-4 py-1.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Sign In
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
