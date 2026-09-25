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
  UserCheck
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
  theme = "cyber-yellow",
  onToggleTheme = () => {},
  onSelectDeveloper = () => {}
}) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

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
              <span className="text-base font-black tracking-tight text-white flex items-center">
                Git<span className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">Ocx</span>
              </span>
            </div>
          </div>

          {/* Center: Search Bar with Ctrl K (Only shown when user is logged in) */}
          {user && (
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
          )}

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* View navigation pills (Only shown when user is logged in) */}
            {user && (
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
            )}



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
