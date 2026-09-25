import React, { useState } from "react";
import {
  ChevronLeft,
  RefreshCw,
  Download,
  Copy,
  Check,
  FileText,
  Workflow,
  Code2,
  GitCommit,
  Share2,
  ExternalLink,
  BookOpen
} from "lucide-react";
import { ArchitectureDiagram } from "../ArchitectureDiagram";

export function FeatureDocumentationView({
  feature,
  repoName = "ecommerce-platform",
  onBack = () => {},
  onRegenerate = () => {},
  isRegenerating = false
}) {
  const [activeTab, setActiveTab] = useState("documentation");
  const [activeSection, setActiveSection] = useState("overview");
  const [copied, setCopied] = useState(false);
  const [showRawMarkdown, setShowRawMarkdown] = useState(false);

  if (!feature) return null;

  const fname = feature.name || feature.feature_name || "Authentication";
  const lastGenerated = feature.lastGenerated || "25 Sep 2026, 11:42 AM";
  const doc = feature.documentation || {};
  const sections = doc.sections || [
    { id: "overview", label: "1. Overview" },
    { id: "system-design", label: "2. System Design" },
    { id: "flow-diagrams", label: "3. Flow Diagrams" },
    { id: "key-components", label: "4. Key Components" },
    { id: "code-walkthrough", label: "5. Code Walkthrough" },
    { id: "external-integrations", label: "6. External Integrations" },
    { id: "api-endpoints", label: "7. API Endpoints" },
    { id: "deployment-notes", label: "8. Deployment Notes" },
    { id: "known-issues", label: "9. Known Issues" },
    { id: "future-improvements", label: "10. Future Improvements" }
  ];

  const componentsTable = doc.componentsTable || [
    { component: "Auth Controller", description: "Handles login, signup, token refresh", path: "/src/controllers/auth.js" },
    { component: "JWT Service", description: "Generates and verifies tokens", path: "/src/services/jwt.js" },
    { component: "User Model", description: "User schema and DB operations", path: "/src/models/user.js" },
    { component: "Auth Middleware", description: "Validates JWT for protected routes", path: "/src/middleware/auth.js" }
  ];

  const handleCopyMarkdown = () => {
    const text = doc.markdown || `# ${fname} Documentation\n\n${doc.overviewText}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    const text = doc.markdown || `# ${fname} Documentation\n\n${doc.overviewText}`;
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fname.toLowerCase().replace(/\s+/g, "-")}-documentation.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#08090e] overflow-hidden">
      
      {/* Top Header & Breadcrumbs matching Screen 3 */}
      <div className="p-5 border-b border-white/5 bg-[#0b0e17]">
        {/* Breadcrumb row */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-2 font-mono">
          <button
            onClick={onBack}
            className="flex items-center gap-1 hover:text-yellow-400 transition-colors text-slate-400"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Overview</span>
          </button>
          <span>/</span>
          <span className="text-slate-400">{repoName}</span>
          <span>&gt;</span>
          <span className="text-slate-300 font-semibold">{fname}</span>
          <span>&gt;</span>
          <span className="text-yellow-400 font-bold">Documentation</span>
        </div>

        {/* Feature Title & Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>{fname}</span>
            </h1>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Last generated: <span className="font-mono text-slate-300">{lastGenerated}</span>
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onRegenerate(feature)}
              disabled={isRegenerating}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-yellow-400/60 text-slate-200 text-xs font-semibold hover:text-yellow-300 transition-all cursor-pointer shadow-sm"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRegenerating ? "animate-spin text-yellow-400" : ""}`} />
              <span>{isRegenerating ? "Synthesizing..." : "Regenerate"}</span>
            </button>

            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 text-xs font-extrabold shadow-md shadow-yellow-500/20 hover:shadow-yellow-400/40 transition-all cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 text-slate-950" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-6 mt-4 border-b border-white/5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("documentation")}
            className={`pb-2 transition-all relative ${
              activeTab === "documentation"
                ? "text-yellow-400 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Documentation
            {activeTab === "documentation" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("architecture")}
            className={`pb-2 transition-all relative ${
              activeTab === "architecture"
                ? "text-yellow-400 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Architecture
            {activeTab === "architecture" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("code")}
            className={`pb-2 transition-all relative ${
              activeTab === "code"
                ? "text-yellow-400 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Code References
            {activeTab === "code" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("commits")}
            className={`pb-2 transition-all relative ${
              activeTab === "commits"
                ? "text-yellow-400 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Commits
            {activeTab === "commits" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("integrations")}
            className={`pb-2 transition-all relative ${
              activeTab === "integrations"
                ? "text-yellow-400 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Integrations
            {activeTab === "integrations" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400 rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Main Split Body: Sub-sidebar on Left + Reading Content on Right */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sub-Sidebar (Documentation TOC) */}
        <div className="w-56 shrink-0 border-r border-white/5 bg-[#0a0d15] p-3 overflow-y-auto space-y-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 mb-1">
            Table of Contents
          </div>
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                activeSection === sec.id
                  ? "bg-yellow-400/15 text-yellow-300 font-bold border border-yellow-400/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              {sec.label}
            </button>
          ))}

          <div className="pt-4 border-t border-white/5 mt-4 space-y-2">
            <button
              onClick={() => setShowRawMarkdown(!showRawMarkdown)}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
            >
              <span>{showRawMarkdown ? "Formatted View" : "Raw Markdown"}</span>
              <Code2 className="h-3 w-3" />
            </button>

            <button
              onClick={handleCopyMarkdown}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] text-yellow-400 hover:bg-yellow-400/10"
            >
              <span>{copied ? "Copied!" : "Copy Spec"}</span>
              {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            </button>
          </div>
        </div>

        {/* Right Content Reading Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-[#08090e]">
          
          {showRawMarkdown ? (
            <div className="p-4 rounded-xl bg-[#0e121d] border border-white/5">
              <pre className="font-mono text-xs text-yellow-300 whitespace-pre-wrap leading-relaxed">
                {doc.markdown || `# ${fname} Documentation\n\n${doc.overviewText}`}
              </pre>
            </div>
          ) : (
            <>
              {/* 1. Overview */}
              <section id="overview" className="space-y-3">
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <span className="text-yellow-400 font-mono">1.</span>
                  <span>Overview</span>
                </h2>
                <div className="p-4 rounded-xl bg-[#0e121d] border border-white/5 text-xs text-slate-300 leading-relaxed font-normal">
                  {doc.overviewText || "The authentication module handles user registration, login, JWT authentication, token refresh, and session management for the e-commerce platform."}
                </div>
              </section>

              {/* 2. Architecture */}
              <section id="architecture" className="space-y-3">
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <span className="text-yellow-400 font-mono">2.</span>
                  <span>Architecture</span>
                </h2>

                {/* Visual flowchart diagram */}
                <ArchitectureDiagram
                  clientLabel="Client (Web/Mobile)"
                  serviceLabel="Auth Service"
                  databaseLabel="Database (Users, Sessions)"
                  externalLabel="External (JWT, Email)"
                />
              </section>

              {/* 3. Key Components */}
              <section id="key-components" className="space-y-3">
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <span className="text-yellow-400 font-mono">3.</span>
                  <span>Key Components</span>
                </h2>

                <div className="overflow-x-auto rounded-xl border border-white/5 bg-[#0e121d]">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/5 bg-slate-900/60 text-slate-400 font-semibold">
                        <th className="py-2.5 px-4">Component</th>
                        <th className="py-2.5 px-4">Description</th>
                        <th className="py-2.5 px-4">File Path</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-sans">
                      {componentsTable.map((row, i) => (
                        <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-3 px-4 font-bold text-white whitespace-nowrap">
                            {row.component}
                          </td>
                          <td className="py-3 px-4 text-slate-300">
                            {row.description}
                          </td>
                          <td className="py-3 px-4 font-mono text-yellow-400 whitespace-nowrap text-[11px]">
                            {row.path}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* 4. API Endpoints */}
              <section id="api-endpoints" className="space-y-3">
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <span className="text-yellow-400 font-mono">4.</span>
                  <span>API Endpoints</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#0e121d] border border-white/5">
                    <span className="font-mono text-emerald-400 font-bold mr-2">POST</span>
                    <span className="font-mono text-slate-200">/api/auth/login</span>
                    <div className="text-[11px] text-slate-400 mt-1">Direct password credentials or OAuth exchange</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0e121d] border border-white/5">
                    <span className="font-mono text-emerald-400 font-bold mr-2">POST</span>
                    <span className="font-mono text-slate-200">/api/auth/register</span>
                    <div className="text-[11px] text-slate-400 mt-1">Registers user profile and issues verification token</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0e121d] border border-white/5">
                    <span className="font-mono text-cyan-400 font-bold mr-2">GET</span>
                    <span className="font-mono text-slate-200">/api/auth/me</span>
                    <div className="text-[11px] text-slate-400 mt-1">Retrieves authenticated claims and permissions</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0e121d] border border-white/5">
                    <span className="font-mono text-yellow-400 font-bold mr-2">POST</span>
                    <span className="font-mono text-slate-200">/api/auth/refresh</span>
                    <div className="text-[11px] text-slate-400 mt-1">Refreshes session token via Redis backchannel</div>
                  </div>
                </div>
              </section>
            </>
          )}

        </div>

      </div>

    </div>
  );
}
