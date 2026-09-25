import React from "react";
import {
  GitBranch,
  Sparkles,
  ShieldAlert,
  FileText,
  KeyRound,
  ExternalLink,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { API_BASE_URL } from "../services/api";

export function LoginHero({ onEnterDemoMode, onOpenTokenModal }) {
  const loginWithGithub = () => {
    window.location.href = `${API_BASE_URL}/auth/github`;
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-600/15 via-indigo-600/15 to-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto text-center space-y-8 z-10">
        
        {/* Glowing Pill Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold shadow-sm shadow-cyan-500/10 animate-pulse-subtle">
          <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
          <span>Next-Gen Git Telemetry & LLM Documentation</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Turn Git Commits into{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
            Living Architecture
          </span>
        </h1>

        {/* Hero Description */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
          Commitology clusters historical git changes into semantic features using Gemini AI, detects single points of failure with Bus Factor risk heuristics, and synthesizes engineering documentation automatically.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          {/* Sign in with GitHub */}
          <button
            onClick={loginWithGithub}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-xl shadow-white/10 hover:shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>Continue with GitHub</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </button>

          {/* Explore Demo Mode */}
          <button
            onClick={onEnterDemoMode}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 text-cyan-300 font-semibold text-sm border border-slate-700/80 hover:border-cyan-500/40 backdrop-blur-xl shadow-lg transition-all"
          >
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>Explore Interactive Demo</span>
          </button>

          {/* Paste Token Modal */}
          <button
            onClick={onOpenTokenModal}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs border border-slate-800 transition-colors"
          >
            <KeyRound className="h-4 w-4" />
            <span>Custom Token</span>
          </button>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 text-left">
          <div className="glass-card rounded-2xl p-5 border border-slate-800/80">
            <div className="p-2 w-fit rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-3">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">AI Feature Clustering</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Gemini LLM groups dispersed commit logs into modular features with primary file hints.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-slate-800/80">
            <div className="p-2 w-fit rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-3">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Bus Factor Telemetry</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Detects developer knowledge concentration and calculates single points of failure.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-slate-800/80">
            <div className="p-2 w-fit rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Automated Docs Studio</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Synthesizes production-grade markdown specs with Mermaid architecture diagrams.
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-6 flex items-center justify-center gap-6 text-xs text-slate-500">
          <a
            href={`${API_BASE_URL}/docs`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>FastAPI Swagger Spec</span>
          </a>
          <span>&bull;</span>
          <span className="font-mono text-slate-400">OAuth 2.0 & JWT Sessions</span>
        </div>
      </div>
    </div>
  );
}
