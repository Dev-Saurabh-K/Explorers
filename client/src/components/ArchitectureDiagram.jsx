import React from "react";
import { Monitor, Server, Database, Globe, ArrowRight, ShieldCheck, Zap } from "lucide-react";

export function ArchitectureDiagram({
  clientLabel = "Client (Web/Mobile)",
  serviceLabel = "Auth Service",
  databaseLabel = "Database (Users, Sessions)",
  externalLabel = "External (JWT, Email)"
}) {
  return (
    <div className="w-full my-6 p-6 rounded-2xl bg-[#0b0e17]/90 border border-yellow-500/20 backdrop-blur-xl shadow-2xl relative overflow-hidden">
      {/* Background glow & subtle grid */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-yellow-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-yellow-400">
            Topology & Dataflow Architecture
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Sync Protocol: REST / gRPC / WebSockets
        </span>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 relative z-10">
        
        {/* Client Node */}
        <div className="flex-1 w-full flex flex-col items-center">
          <div className="w-full max-w-[190px] p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-yellow-400/60 transition-all text-center group shadow-lg shadow-black/40">
            <div className="h-10 w-10 mx-auto rounded-lg bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400 mb-2 group-hover:scale-110 transition-transform">
              <Monitor className="h-5 w-5" />
            </div>
            <div className="text-xs font-bold text-white tracking-wide">
              {clientLabel}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Next.js / React / iOS
            </div>
          </div>
        </div>

        {/* Arrow 1 */}
        <div className="flex items-center justify-center text-yellow-400/70 font-mono text-xs gap-1">
          <div className="hidden md:flex items-center">
            <div className="h-0.5 w-8 bg-gradient-to-r from-yellow-400/30 to-yellow-400" />
            <ArrowRight className="h-4 w-4 -ml-1 text-yellow-400 animate-pulse" />
          </div>
          <div className="md:hidden flex flex-col items-center my-1">
            <div className="w-0.5 h-6 bg-yellow-400/60" />
          </div>
        </div>

        {/* Central Core Service Node */}
        <div className="flex-1 w-full flex flex-col items-center">
          <div className="w-full max-w-[210px] p-4 rounded-xl bg-gradient-to-b from-yellow-500/10 via-slate-900/90 to-slate-900/90 border border-yellow-500/50 hover:border-yellow-400 transition-all text-center group shadow-xl shadow-yellow-500/10 relative">
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-yellow-400 text-slate-950 text-[9px] font-black uppercase tracking-wider rounded-full shadow-sm">
              Core Gateway
            </div>
            <div className="h-10 w-10 mx-auto rounded-lg bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center text-yellow-300 mb-2 group-hover:scale-110 transition-transform">
              <Server className="h-5 w-5" />
            </div>
            <div className="text-xs font-black text-white tracking-wide">
              {serviceLabel}
            </div>
            <div className="text-[10px] text-yellow-200/80 mt-1">
              Tokenization & Auth Router
            </div>
          </div>
        </div>

        {/* Arrow 2 */}
        <div className="flex items-center justify-center text-yellow-400/70 font-mono text-xs gap-1">
          <div className="hidden md:flex items-center">
            <div className="h-0.5 w-8 bg-gradient-to-r from-yellow-400 to-cyan-400" />
            <ArrowRight className="h-4 w-4 -ml-1 text-cyan-400 animate-pulse" />
          </div>
          <div className="md:hidden flex flex-col items-center my-1">
            <div className="w-0.5 h-6 bg-cyan-400/60" />
          </div>
        </div>

        {/* Target Nodes (Database + External) */}
        <div className="flex-1 w-full flex flex-col gap-3 items-center">
          {/* Database */}
          <div className="w-full max-w-[210px] p-3 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-cyan-400/60 transition-all text-left group shadow-lg shadow-black/40 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 group-hover:scale-105 transition-transform">
              <Database className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">
                {databaseLabel}
              </div>
              <div className="text-[10px] text-slate-400">
                PostgreSQL & Redis Session
              </div>
            </div>
          </div>

          {/* External */}
          <div className="w-full max-w-[210px] p-3 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-purple-400/60 transition-all text-left group shadow-lg shadow-black/40 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 group-hover:scale-105 transition-transform">
              <Globe className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">
                {externalLabel}
              </div>
              <div className="text-[10px] text-slate-400">
                OAuth Providers & SMTP
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
