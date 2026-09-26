import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  X,
  Download,
  Copy,
  Check,
  FileText,
  Code2,
  Eye,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export function DocViewerModal({ doc, onClose }) {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState("rendered"); // "rendered" | "raw"

  if (!doc) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(doc.markdown_content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([doc.markdown_content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = doc.filename || `${doc.feature_id || "feature"}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-[#0d1322] border border-slate-700/80 shadow-2xl overflow-hidden">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#090d16]/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white font-mono">
                  {doc.filename || "documentation.md"}
                </h3>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  AI Synthesized
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {doc.feature_name} &bull; <span className="font-mono text-cyan-400">{doc.repo}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setViewMode("rendered")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                  viewMode === "rendered"
                    ? "bg-cyan-500/20 text-cyan-300 font-medium"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Preview</span>
              </button>
              <button
                onClick={() => setViewMode("raw")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                  viewMode === "raw"
                    ? "bg-cyan-500/20 text-cyan-300 font-medium"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Code2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Raw Markdown</span>
              </button>
            </div>

            {/* Copy button */}
            <button
              onClick={handleCopy}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors"
              title="Copy to clipboard"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            </button>

            {/* Download button */}
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-cyan-500/20 transition-all"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Download .md</span>
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors ml-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-4">
          {viewMode === "raw" ? (
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs sm:text-sm text-slate-200 whitespace-pre-wrap overflow-x-auto leading-relaxed selection:bg-cyan-500/30">
              {doc.markdown_content}
            </pre>
          ) : (
            <div className="prose prose-invert prose-cyan max-w-none space-y-4 text-slate-200 text-sm sm:text-base leading-relaxed">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ node, ...props }) => (
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white border-b border-slate-800 pb-3 mb-4 tracking-tight" {...props} />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2 className="text-xl font-bold text-cyan-300 mt-6 mb-3 flex items-center gap-2 border-b border-slate-800/60 pb-2" {...props} />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 className="text-lg font-semibold text-slate-100 mt-4 mb-2" {...props} />
                  ),
                  p: ({ node, ...props }) => (
                    <p className="text-slate-300 leading-relaxed my-2" {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul className="list-disc list-inside space-y-1 my-2 text-slate-300" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="list-decimal list-inside space-y-1 my-2 text-slate-300" {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="text-slate-300" {...props} />
                  ),
                  code: ({ node, inline, className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline ? (
                      <div className="my-4 rounded-xl overflow-hidden border border-slate-800 bg-[#070b13]">
                        <div className="px-4 py-1.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                          <span>{match ? match[1] : "code"}</span>
                          <span className="text-[10px] text-slate-500">GitOcx Code</span>
                        </div>
                        <pre className="p-4 overflow-x-auto text-xs font-mono text-cyan-200 leading-relaxed">
                          <code className={className} {...props}>
                            {children}
                          </code>
                        </pre>
                      </div>
                    ) : (
                      <code className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-xs" {...props}>
                        {children}
                      </code>
                    );
                  },
                  blockquote: ({ node, ...props }) => (
                    <blockquote className="border-l-4 border-cyan-500/70 pl-4 py-1 my-3 bg-cyan-950/20 text-slate-300 italic rounded-r-lg" {...props} />
                  ),
                  table: ({ node, ...props }) => (
                    <div className="overflow-x-auto my-4 rounded-xl border border-slate-800">
                      <table className="min-w-full divide-y divide-slate-800 text-left text-xs sm:text-sm" {...props} />
                    </div>
                  ),
                  th: ({ node, ...props }) => (
                    <th className="px-4 py-2 bg-slate-900 font-semibold text-cyan-300" {...props} />
                  ),
                  td: ({ node, ...props }) => (
                    <td className="px-4 py-2 border-t border-slate-800/60 text-slate-300" {...props} />
                  ),
                }}
              >
                {doc.markdown_content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-slate-800 bg-[#090d16] flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>Target File: docs/{doc.filename}</span>
          <span>Synthesized via AI Telemetry Engine</span>
        </div>
      </div>
    </div>
  );
}
