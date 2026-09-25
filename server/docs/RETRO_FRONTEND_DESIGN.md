# Commitology: Retro Cyber-Mainframe Frontend Specification

> **Hackathon Edition:** An anti-generic, high-impact Retro-Futuristic Terminal & 90s Workstation UI Design for **Commitology**.
> **Format:** Pure Documentation & React.js Layout Wireframes (No existing codebase files modified).

---

## 1. Aesthetic Vision: Why This Standout Retro Theme Wins

### 1.1 The "Anti-AI-Slop" Manifesto
Most hackathon AI projects look identical:
- Soft purple/indigo gradients
- Rounded-3xl floating cards
- Generic shadcn component copies
- Blurry ambient glowing circles

Judges see 50 of these in an hour. **Commitology stands out instantly** by rejecting the generic SaaS look and adopting a **"Cyber-Archeology / 90s Unix Mainframe"** aesthetic.

### 1.2 The Narrative Metaphor: "Git Commit Archeology"
Git commits are not just rows in a database—they are **geological strata of human thought and code evolution**. Commitology acts as a **Cyberdeck Decompiler** that reads raw magnetic commit tapes and decompiles them into pristine feature-wise technical documentation (`<feature_name>.md`).

### 1.3 Key Retro Visual Elements
1. **Phosphor CRT & Cyberdeck Palette**:
   - **Deep Obsidian Chassis**: `#0c0d12` / `#13161f`
   - **Phosphor Green**: `#00ff66` (Terminal text, success states)
   - **Amber CRT Glow**: `#ffb000` (Warnings, commit SHAs, active highlights)
   - **Cyan Telemetry**: `#00e5ff` (AI processing nodes, file paths)
   - **Glitch Neon Red**: `#ff3366` (Diff deletions, error states)
2. **Tactile Hardware Components**:
   - Beveled hardware buttons (`border-t-white/30 border-l-white/30 border-b-black/90 border-r-black/90`)
   - Monospace typography (`font-mono`) with typewriter blinking cursors (`_`)
   - Real-time telemetry indicators: `[BAUD: 9600]`, `[RATE LIMIT: 4892/5000]`, `[TTY: /dev/pts/0]`
   - CRT Scanline toggle (subtle horizontal scanlines with optional power flicker)
   - ASCII Art Banners and vintage punch-card / tape-reel representations

---

## 2. Complete Application Layout & Visual Wireframes

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ [● REC] COMMITOLOGY OS v1.0.4  //  DECK: ALPHA-01  //  RATE-LIMIT: [4892/5000]  [CRT: ON]│
├────────────────────────────────────────────────────────────────────────────────────────┤
│ USER: @octocat [ID: 94812]  |  AUTH: GITHUB OAuth2 [TOKEN: ACTIVE]  |  UPTIME: 99.98%   │
├──────────────────────────────┬─────────────────────────────────────────────────────────┤
│ 📼 REPOSITORY TAPE SELECTOR  │ ⚡ STAGE 1: FEATURE DECOMPILER (AI CLUSTERING)           │
│                              │                                                         │
│ ┌──────────────────────────┐ │ [ SCAN COMMITS: 50 ]  [ FILTER: ALL ]  [ STATUS: SYNCED] │
│ │ > octocat/Spoon-Knife    │ │                                                         │
│ │   owner/awesome-api      │ │ ┌─────────────────────────────────────────────────────┐ │
│ │   team/core-engine       │ │ │ [MODULE 01] GITHUB OAUTH AUTHENTICATION             │ │
│ │   bky84/hacknex [ACTIVE] │ │ │ CAT: [AUTH]  COMMITS: [4]  FILES: [5]               │ │
│ └──────────────────────────┘ │ │ SUMMARY: User login, token persistence, JWT guard    │ │
│                              │ │ SHAS: [7a8f3b1] [4c2d9e0] [1b5a2f8] [9e4c1d2]       │ │
│ [ REFRESH REPOS ]            │ │ ACTION: [ > DECOMPILE <feature_name>.md ]           │ │
│                              │ └─────────────────────────────────────────────────────┘ │
│                              │                                                         │
│                              │ ┌─────────────────────────────────────────────────────┐ │
│                              │ │ [MODULE 02] DATABASE SCHEMA & PERSISTENCE           │ │
│                              │ │ CAT: [DATABASE]  COMMITS: [6]  FILES: [4]           │ │
│                              │ │ SUMMARY: SQLite tables, SQLAlchemy ORM mappings      │ │
│                              │ │ ACTION: [ > DECOMPILE <feature_name>.md ]           │ │
│                              │ └─────────────────────────────────────────────────────┘ │
├──────────────────────────────┴─────────────────────────────────────────────────────────┤
│ 📟 STAGE 2: FEATURE DOCUMENTATION WORKBENCH (<feature_name>.md)                        │
│                                                                                        │
│ ┌───────────────────────────────────────┬────────────────────────────────────────────┐ │
│ │ 📁 DIFF STRATUM (TOUCHED FILES)       │ 📄 COMPILED SPECIFICATION: auth-flow.md    │ │
│ │                                       │                                            │ │
│ │ ▾ [MODIFIED] app/core/security.py     │ # Feature Documentation: OAuth Auth        │ │
│ │   + def get_current_user():           │                                            │ │
│ │   - def old_verify():                 │ ## 1. Executive Summary                    │ │
│ │                                       │ The OAuth engine bridges GitHub tokens...  │ │
│ │ ▾ [ADDED] app/models/user.py          │                                            │ │
│ │   + github_access_token = Column()    │ ```mermaid                                 │ │
│ │                                       │ sequenceDiagram                            │ │
│ │ [COMMIT LOG]:                         │   User->>FastAPI: Login                    │ │
│ │ [7a8f3b1] feat: add user model        │ ```                                        │ │
│ └───────────────────────────────────────┴────────────────────────────────────────────┘ │
│ [ 💾 SAVE TO DISK ]   [ 📋 COPY RAW MD ]   [ 🖨 EXPORT PDF ]   [ 🚀 PUSH TO REPO /docs ] │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Modular React.js Component Architecture

Developers can structure the UI cleanly into 5 modular components:

```
client/src/components/retro/
├── RetroShell.jsx               # Outer CRT frame, scanlines, hardware status bar
├── AuthTerminal.jsx             # Retro arcade/mainframe login screen
├── TapeDeckBrowser.jsx          # Midnight Commander style repository selector
├── FeatureDecompilerGrid.jsx    # Hardware rack-mount feature cluster cards
└── DocStratumWorkbench.jsx      # Split-screen Diff Inspector & <feature_name>.md Viewer
```

---

## 4. Ready-to-Use React.js Component Layouts (Written Format)

### 4.1 Shell Wrapper & CRT Scanlines: `RetroShell.jsx`

This component creates the hardware bezel, status telemetry LEDs, scanlines overlay, and system clock.

```jsx
import React, { useState, useEffect } from "react";

export function RetroShell({ children, user, onLogout }) {
  const [crtEnabled, setCrtEnabled] = useState(true);
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`min-h-screen bg-[#090a0f] text-[#00ff66] font-mono selection:bg-[#00ff66] selection:text-black relative ${crtEnabled ? "crt-flicker" : ""}`}>
      {/* Scanline Overlay */}
      {crtEnabled && (
        <div 
          className="pointer-events-none fixed inset-0 z-50 opacity-20"
          style={{
            background: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.4) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))",
            backgroundSize: "100% 3px, 3px 100%"
          }}
        />
      )}

      {/* Hardware Telemetry Bar */}
      <header className="border-b-2 border-[#00ff66]/40 bg-[#0f111a] px-4 py-2 flex flex-wrap items-center justify-between text-xs tracking-wider">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[#ffb000]">
            <span className="inline-block w-2.5 h-2.5 bg-[#ff3366] rounded-full animate-ping" />
            [REC]
          </span>
          <span className="font-black text-[#00e5ff] tracking-widest text-sm">COMMITOLOGY_OS // v1.0.4</span>
          <span className="hidden md:inline text-zinc-500">|</span>
          <span className="hidden md:inline text-zinc-400">TTY: /dev/pts/0</span>
          <span className="hidden md:inline text-zinc-500">|</span>
          <span className="text-[#ffb000]">RATE LIMIT: 4,892/5,000 REQ/H</span>
        </div>

        <div className="flex items-center gap-4 mt-2 sm:mt-0">
          <span className="text-zinc-400">CLOCK: {time}</span>
          <button
            onClick={() => setCrtEnabled(!crtEnabled)}
            className="px-2 py-0.5 border border-[#00ff66] text-xs hover:bg-[#00ff66] hover:text-black transition"
          >
            CRT: {crtEnabled ? "[ON]" : "[OFF]"}
          </button>
          {user && (
            <button
              onClick={onLogout}
              className="px-2 py-0.5 border border-[#ff3366] text-[#ff3366] hover:bg-[#ff3366] hover:text-white transition"
            >
              [EJECT TAPE]
            </button>
          )}
        </div>
      </header>

      {/* Main Screen Container */}
      <main className="p-4 max-w-7xl mx-auto space-y-4">
        {children}
      </main>

      {/* Footer Diagnostic Panel */}
      <footer className="border-t border-[#00ff66]/20 bg-[#0c0d12] px-4 py-2 text-xs text-zinc-500 flex justify-between">
        <span>COMMITOLOGY CORE ENGINE // POWERED BY GEMINI 2.5 FLASH + PYGITHUB</span>
        <span className="text-[#00ff66]">READY_</span>
      </footer>
    </div>
  );
}
```

---

### 4.2 Login Mainframe Terminal: `AuthTerminal.jsx`

Replaces the standard Google/GitHub login card with a retro arcade / boot sequence login terminal.

```jsx
import React from "react";

export function AuthTerminal({ onLogin }) {
  return (
    <div className="border-2 border-[#00ff66] bg-[#0c0e14] p-8 shadow-[0_0_25px_rgba(0,255,102,0.15)] max-w-2xl mx-auto my-12">
      {/* ASCII Header Banner */}
      <pre className="text-[#00ff66] text-[10px] sm:text-xs leading-none select-none font-mono mb-6 overflow-x-auto">
{`
   ____ ___  __  __ __  __ ___ _____ ___  _     ___   ______   __
  / ___/ _ \\|  \\/  |  \\/  |_ _|_   _/ _ \\| |   / _ \\ / ___\\ \\ / /
 | |  | | | | |\\/| | |\\/| || |  | || | | | |  | | | | |  _ \\ V / 
 | |__| |_| | |  | | |  | || |  | || |_| | |__| |_| | |_| | | |  
  \\____\\___/|_|  |_|_|  |_|___| |_| \\___/|_____\\___/ \\____| |_|  
`}
      </pre>

      <div className="space-y-3 text-xs sm:text-sm text-zinc-300 border-l-2 border-[#00e5ff] pl-4 mb-6">
        <p className="text-[#00e5ff]">[SYSTEM BOOT LOG]</p>
        <p>&gt; Initializing Git commit archeology decompiler...</p>
        <p>&gt; Loading PyGithub API gateway bindings... <span className="text-[#00ff66]">[OK]</span></p>
        <p>&gt; Loading Gemini 2.5 Flash semantic feature clustering matrix... <span className="text-[#00ff66]">[OK]</span></p>
        <p>&gt; Authentication required to access repository magnetic tapes.</p>
      </div>

      <div className="bg-[#141824] p-4 border border-[#00ff66]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-[#ffb000] font-bold text-sm">SECURITY CLEARANCE LEVEL 1</p>
          <p className="text-xs text-zinc-400">Authorize GitHub OAuth token for high-rate API ingestion</p>
        </div>

        <button
          onClick={onLogin}
          className="w-full sm:w-auto px-6 py-3 bg-[#00ff66] text-black font-black tracking-wider uppercase text-sm border-2 border-white shadow-[4px_4px_0px_#000] hover:bg-[#00e5ff] hover:shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition"
        >
          [ INSERT GITHUB TAPE ]
        </button>
      </div>
    </div>
  );
}
```

---

### 4.3 Repository Tape Selector: `TapeDeckBrowser.jsx`

Styled after vintage file managers (Norton Commander / Midnight Commander), presenting repos as magnetic tapes.

```jsx
import React from "react";

export function TapeDeckBrowser({ repos, selectedRepo, onSelectRepo, onRefresh, loading }) {
  return (
    <div className="border border-[#00ff66]/50 bg-[#0f121a] p-4">
      <div className="flex items-center justify-between border-b border-[#00ff66]/30 pb-2 mb-3">
        <h2 className="text-xs sm:text-sm font-bold text-[#ffb000] tracking-wider flex items-center gap-2">
          <span>📼</span> MAGNETIC TAPE REPOSITORY ARCHIVE
        </h2>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="text-xs px-2 py-1 border border-[#00e5ff] text-[#00e5ff] hover:bg-[#00e5ff] hover:text-black transition"
        >
          {loading ? "[SPINNING...]" : "[REWIND / REFRESH]"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
        {repos.map((repo) => {
          const isSelected = selectedRepo === repo;
          return (
            <div
              key={repo}
              onClick={() => onSelectRepo(repo)}
              className={`p-2 cursor-pointer border text-xs transition flex items-center justify-between ${
                isSelected
                  ? "bg-[#00ff66]/20 border-[#00ff66] text-[#00ff66] font-bold shadow-[inset_0_0_8px_rgba(0,255,102,0.3)]"
                  : "bg-[#090b10] border-zinc-800 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
              }`}
            >
              <div className="truncate flex items-center gap-2">
                <span className="text-[#00e5ff]">{isSelected ? "►" : "▪"}</span>
                <span className="truncate">{repo}</span>
              </div>
              {isSelected && <span className="text-[10px] text-[#ffb000] shrink-0">[MOUNTED]</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

---

### 4.4 Feature Decompiler & Clustering Matrix: `FeatureDecompilerGrid.jsx`

Presents the Stage 1 AI clustered features as modular rack-mounted hardware units with punchcard SHAs and a prominent decompile button.

```jsx
import React from "react";

export function FeatureDecompilerGrid({ 
  features, 
  onDecompileDoc, 
  activeFeatureId, 
  onAnalyze, 
  isAnalyzing 
}) {
  return (
    <div className="border border-[#00ff66]/50 bg-[#0f121a] p-4 space-y-4">
      {/* Top Controller Panel */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#00ff66]/30 pb-3">
        <div>
          <h2 className="text-sm font-bold text-[#00e5ff] tracking-wide flex items-center gap-2">
            <span>⚡</span> STAGE 1: SEMANTIC FEATURE DECOMPILER
          </h2>
          <p className="text-xs text-zinc-400">
            Bulk analyzes raw commit telemetry & categorizes into isolated engineering features.
          </p>
        </div>

        <button
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className="px-4 py-2 bg-[#ffb000] text-black font-bold text-xs uppercase border border-white hover:bg-[#00ff66] transition shadow-[3px_3px_0px_#000]"
        >
          {isAnalyzing ? "[DECOMPILING COMMITS...]" : "[INITIALIZE CLUSTER SCAN]"}
        </button>
      </div>

      {/* Clustered Feature Cards */}
      {features.length === 0 ? (
        <div className="border border-dashed border-zinc-700 p-8 text-center text-xs text-zinc-500">
          NO CLUSTERS DECOMPILED YET. CLICK [INITIALIZE CLUSTER SCAN] TO ANALYZE REPOSITORY COMMITS.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {features.map((feat) => {
            const isActive = activeFeatureId === feat.feature_id;
            return (
              <div
                key={feat.feature_id}
                className={`border p-4 transition relative flex flex-col justify-between ${
                  isActive
                    ? "border-[#00e5ff] bg-[#101928] shadow-[0_0_15px_rgba(0,229,255,0.2)]"
                    : "border-zinc-800 bg-[#0a0c12] hover:border-zinc-600"
                }`}
              >
                <div>
                  {/* Category Badge & Count */}
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="px-1.5 py-0.5 bg-[#00ff66]/10 border border-[#00ff66] text-[#00ff66] text-[10px] font-bold">
                      TAG: {feat.category || "GENERAL"}
                    </span>
                    <span className="text-[#ffb000] text-xs font-mono">
                      {feat.commit_shas?.length || feat.commit_count || 0} COMMITS
                    </span>
                  </div>

                  {/* Feature Name & Summary */}
                  <h3 className="text-sm font-bold text-white mb-1 tracking-wide">
                    {feat.feature_name}
                  </h3>
                  <p className="text-xs text-zinc-400 mb-3 leading-relaxed">
                    {feat.summary}
                  </p>

                  {/* Commit SHA Pills */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {feat.commit_shas?.slice(0, 5).map((sha) => (
                      <span key={sha} className="px-1.5 py-0.5 bg-black border border-zinc-700 text-[#ffb000] text-[10px] font-mono">
                        #{sha.slice(0, 7)}
                      </span>
                    ))}
                    {feat.commit_shas?.length > 5 && (
                      <span className="text-[10px] text-zinc-500 self-center">
                        +{feat.commit_shas.length - 5} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Decompile Action Button */}
                <button
                  onClick={() => onDecompileDoc(feat)}
                  className={`w-full py-2 text-xs font-bold uppercase tracking-wider border transition ${
                    isActive
                      ? "bg-[#00e5ff] text-black border-white"
                      : "bg-[#141824] text-[#00ff66] border-[#00ff66] hover:bg-[#00ff66] hover:text-black"
                  }`}
                >
                  {isActive ? "[CURRENTLY INSPECTING]" : "► DECOMPILE <" + feat.feature_id + ">.md"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
```

---

### 4.5 Split-Pane Feature Documentation Workbench: `DocStratumWorkbench.jsx`

The centerpiece of the application. Displays the commit diff context on the left and the rendered `<feature_name>.md` on the right with quick export options.

```jsx
import React, { useState } from "react";

export function DocStratumWorkbench({ 
  feature, 
  markdownContent, 
  diffContext, 
  isGenerating 
}) {
  const [activeTab, setActiveTab] = useState("preview"); // "preview" | "raw"
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!markdownContent) return;
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!markdownContent) return;
    const blob = new Blob([markdownContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${feature?.feature_id || "feature"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!feature) {
    return (
      <div className="border border-zinc-800 bg-[#0c0d14] p-8 text-center text-xs text-zinc-600">
        [NO FEATURE MOUNTED FOR DOCUMENTATION SYNTHESIS]
      </div>
    );
  }

  return (
    <div className="border-2 border-[#00e5ff] bg-[#0c0e16] p-4 shadow-[0_0_20px_rgba(0,229,255,0.15)] space-y-3">
      {/* Workbench Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#00e5ff]/40 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-base text-[#ffb000]">📄</span>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">
              {feature.feature_name}
            </h2>
            <span className="text-xs text-[#00ff66] font-mono">
              TARGET FILE: {feature.feature_id}.md
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="border border-zinc-700 bg-black p-0.5 flex text-xs">
            <button
              onClick={() => setActiveTab("preview")}
              className={`px-3 py-1 ${activeTab === "preview" ? "bg-[#00e5ff] text-black font-bold" : "text-zinc-400 hover:text-white"}`}
            >
              RENDERED VIEW
            </button>
            <button
              onClick={() => setActiveTab("raw")}
              className={`px-3 py-1 ${activeTab === "raw" ? "bg-[#00e5ff] text-black font-bold" : "text-zinc-400 hover:text-white"}`}
            >
              RAW .MD
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="px-3 py-1 border border-[#00ff66] text-[#00ff66] hover:bg-[#00ff66] hover:text-black text-xs font-bold transition"
          >
            {copied ? "[COPIED!]" : "[COPY MD]"}
          </button>

          <button
            onClick={handleDownload}
            className="px-3 py-1 bg-[#ffb000] text-black border border-white hover:bg-white text-xs font-bold transition"
          >
            [SAVE TO DISK]
          </button>
        </div>
      </div>

      {isGenerating ? (
        <div className="p-16 text-center space-y-3">
          <div className="inline-block w-8 h-8 border-4 border-[#00ff66] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[#00ff66] tracking-widest animate-pulse">
            SYNTHESIZING &lt;{feature.feature_id}&gt;.md USING GEMINI 2.5 FLASH...
          </p>
          <p className="text-xs text-zinc-500">
            Analyzing commit diffs, touched files, and architectural relationships...
          </p>
        </div>
      ) : (
        /* Split Screen: Diff Context on Left, Markdown Doc on Right */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[600px]">
          {/* Left Panel: Diff Stratum (4 cols) */}
          <div className="lg:col-span-4 border border-zinc-800 bg-[#07080c] p-3 overflow-y-auto font-mono text-xs">
            <div className="text-[#ffb000] font-bold border-b border-zinc-800 pb-1 mb-2 flex items-center justify-between">
              <span>IMPACTED FILES & PATCHES</span>
              <span>{diffContext?.files?.length || 0} FILES</span>
            </div>

            {diffContext?.files ? (
              diffContext.files.map((file, idx) => (
                <div key={idx} className="mb-3 border border-zinc-900 p-2 bg-[#0a0c12]">
                  <div className="text-[#00e5ff] font-bold truncate mb-1">
                    {file.filename}
                  </div>
                  <div className="text-[10px] text-zinc-500 mb-1">
                    +{file.additions} / -{file.deletions} lines
                  </div>
                  {file.patch && (
                    <pre className="text-[10px] text-zinc-400 bg-black p-1.5 overflow-x-auto max-h-32 border-l-2 border-[#00ff66]/60">
                      {file.patch}
                    </pre>
                  )}
                </div>
              ))
            ) : (
              <p className="text-zinc-600 italic">No diff context loaded.</p>
            )}
          </div>

          {/* Right Panel: Markdown Document Viewer (8 cols) */}
          <div className="lg:col-span-8 border border-zinc-800 bg-[#07080c] p-4 overflow-y-auto">
            {activeTab === "preview" ? (
              <div className="prose prose-invert max-w-none text-zinc-200 text-xs sm:text-sm leading-relaxed font-sans space-y-4">
                {/* Styled Markdown Content */}
                <div className="border-b border-[#00ff66]/30 pb-3 mb-4 font-mono">
                  <h1 className="text-lg sm:text-xl font-black text-[#00ff66] tracking-wide">
                    {feature.feature_name}
                  </h1>
                  <span className="text-xs text-zinc-500">DOCUMENTATION SPECIFICATION // AUTO-GENERATED BY COMMITOLOGY</span>
                </div>

                <div className="whitespace-pre-wrap font-mono text-xs bg-black/60 p-4 border border-zinc-800">
                  {markdownContent || "Documentation synthesis pending..."}
                </div>
              </div>
            ) : (
              <textarea
                readOnly
                value={markdownContent || ""}
                className="w-full h-full bg-black text-[#00ff66] font-mono text-xs p-3 border border-zinc-800 resize-none outline-none"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## 5. Wiring into the Existing Backend API (React Integration Guide)

Frontend developers can wire the above components directly into the existing FastAPI backend using standard `fetch`:

```javascript
const API_BASE = "http://localhost:8000";

// 1. Fetch Repositories
async function fetchRepos(token) {
  const res = await fetch(`${API_BASE}/github/repos`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return await res.json(); // returns list of "owner/repo" strings
}

// 2. Stage 1: Categorize Features via AI
async function categorizeFeatures(token, repoName) {
  const res = await fetch(`${API_BASE}/ai/features/categorize`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify({ repo: repoName, max_commits: 50 })
  });
  return await res.json(); // returns { repo, total_commits, features: [...] }
}

// 3. Stage 2: Generate <feature_name>.md via AI
async function generateDoc(token, repoName, feature) {
  const res = await fetch(`${API_BASE}/ai/features/generate-doc`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify({
      repo: repoName,
      feature_id: feature.feature_id,
      feature_name: feature.feature_name,
      feature_summary: feature.summary,
      commit_shas: feature.commit_shas
    })
  });
  return await res.json(); // returns { filename, markdown_content }
}
```

---

## 6. Hackathon Winning Presentation Tips

1. **Live Demo Punchline**:
   - Start in dark room mode: Show the CRT flicker and the ASCII boot sequence.
   - Click one button: **[INITIALIZE CLUSTER SCAN]**—watch 50 commits instantly organize into 4 distinct features.
   - Click **[► DECOMPILE auth-flow.md]**—watch the diff viewer populate and the technical documentation render in real-time.
2. **Key Talking Points for Judges**:
   - *"Commit messages are high quality, but lost in git log. Commitology is the missing compiler that converts linear commit history into feature-oriented architecture documentation."*
   - *"Our retro-archeology theme isn't just cosmetic; it visually represents the extraction of valuable engineering knowledge buried in Git history."*
