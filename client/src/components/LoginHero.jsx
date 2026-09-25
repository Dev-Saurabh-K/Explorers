import React from "react";
import { ArrowRight, Sparkles, KeyRound, ShieldAlert, Cpu, FileCode } from "lucide-react";
import { API_BASE_URL } from "../services/api";

export function LoginHero({ onEnterDemoMode, onOpenTokenModal }) {
  const loginWithGithub = () => {
    window.location.href = `${API_BASE_URL}/auth/github`;
  };

  return (
    <div className="relative min-h-[calc(100vh-4.25rem)] w-full flex flex-col justify-between items-center px-4 sm:px-6 py-10 overflow-hidden bg-cover bg-center"
         style={{ backgroundImage: `url('/synthwave_bg.jpg')` }}>
      
      {/* Dark overlay with perspective grid glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#08090d]/85 via-[#08090d]/65 to-[#08090d]/90 pointer-events-none" />

      {/* Main Center Hero Content */}
      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6 my-auto py-6">
        
        {/* Brand Icon & Title */}
        <div className="flex flex-col items-center gap-4">
          <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-purple-500 via-pink-500 to-amber-500 p-0.5 shadow-2xl shadow-purple-500/30 group hover:scale-105 transition-transform duration-300">
            <div className="h-full w-full rounded-[22px] bg-[#0c0f18] flex items-center justify-center overflow-hidden p-2">
              <img
                src="/logo.png"
                alt="GitOcx Logo"
                className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white flex items-center justify-center">
            <span>Git</span>
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent drop-shadow-sm">
              Ocx
            </span>
          </h1>
        </div>

        {/* Tagline matching the image */}
        <div className="space-y-2">
          <p className="text-xl sm:text-2xl font-bold text-slate-100">
            From commits to clarity.
          </p>
          <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto font-normal leading-relaxed">
            AI-powered documentation for your codebase.
          </p>
        </div>

        {/* Action Button: Continue with GitHub */}
        <div className="pt-2 flex flex-col items-center gap-4">
          <button
            onClick={loginWithGithub}
            className="w-full sm:w-auto min-w-[280px] flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 font-extrabold text-base shadow-2xl shadow-yellow-500/40 hover:shadow-yellow-400/60 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer border border-yellow-300"
          >
            <svg className="h-5 w-5 fill-slate-950" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>Continue with GitHub</span>
            <ArrowRight className="h-5 w-5 ml-1 text-slate-950 font-bold" />
          </button>

          {/* Subtitle below button matching image */}
          <p className="text-xs sm:text-sm text-slate-400 font-mono tracking-wide">
            Your repositories. Your history. Organized.
          </p>

          {/* Quick secondary actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={onOpenTokenModal}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white text-xs border border-slate-700/80 hover:border-slate-500 transition-colors cursor-pointer"
            >
              <KeyRound className="h-3.5 w-3.5 text-slate-400" />
              <span>Sign in with Custom Token</span>
            </button>
          </div>
        </div>

      </div>

      {/* Bottom MVP Feature Highlights */}
      <div className="relative z-10 w-full max-w-5xl pt-8 border-t border-white/10 text-left">
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono tracking-widest uppercase text-yellow-400 font-bold bg-yellow-400/10 px-2.5 py-0.5 rounded border border-yellow-400/30">
              MVP Deliverables
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Core capabilities built for automated repository intelligence
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">v1.0.0 Ready</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
          {/* MVP 1: AI Clustering */}
          <div className="p-4 rounded-2xl bg-[#0e121d]/85 border border-white/5 hover:border-yellow-400/30 backdrop-blur-md transition-all group">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-2 rounded-xl bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 group-hover:scale-105 transition-transform">
                <Cpu className="h-4 w-4" />
              </div>
              <div className="font-bold text-slate-100 text-xs">AI Feature Extraction</div>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              Semantic commit & diff analysis groups unstructured commit histories into standalone product features without manual tags.
            </p>
          </div>

          {/* MVP 2: Bus Factor Risk */}
          <div className="p-4 rounded-2xl bg-[#0e121d]/85 border border-white/5 hover:border-rose-400/30 backdrop-blur-md transition-all group">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-2 rounded-xl bg-rose-400/10 text-rose-400 border border-rose-400/20 group-hover:scale-105 transition-transform">
                <ShieldAlert className="h-4 w-4" />
              </div>
              <div className="font-bold text-slate-100 text-xs">Bus Factor Telemetry</div>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              Identifies critical developer ownership silos and high-risk knowledge concentrations across repository subsystems.
            </p>
          </div>

          {/* MVP 3: Automated Architecture */}
          <div className="p-4 rounded-2xl bg-[#0e121d]/85 border border-white/5 hover:border-cyan-400/30 backdrop-blur-md transition-all group">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-2 rounded-xl bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 group-hover:scale-105 transition-transform">
                <FileCode className="h-4 w-4" />
              </div>
              <div className="font-bold text-slate-100 text-xs">Architecture Specs (.md)</div>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              Decompiles code diffs into clean, production-ready Markdown technical specifications and component tables instantly.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
