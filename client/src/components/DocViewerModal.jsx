import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  XIcon,
  DownloadIcon,
  CopyIcon,
  CheckIcon,
  FileCodeIcon,
  CodeIcon,
  EyeIcon
} from "@primer/octicons-react";

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", backdropFilter: "blur(2px)" }}
    >
      <div
        className="github-dialog flex flex-col overflow-hidden"
        style={{ width: "min(860px, calc(100vw - 32px))", maxHeight: "88vh" }}
      >
        {/* Header */}
        <div className="github-dialog-header">
          <div className="flex items-center gap-2.5 min-w-0">
            <FileCodeIcon size={16} />
            <h3 style={{ fontSize: "16px", fontWeight: 600, color: "var(--fg-default)", margin: 0 }} className="truncate">
              {doc.filename || "documentation.md"}
            </h3>
            <span className="badge badge-success" style={{ fontSize: "11px", padding: "1px 6px" }}>
              Synthesized
            </span>
          </div>

          <button
            onClick={onClose}
            className="github-button github-button-invisible"
            style={{ width: "28px", height: "28px", padding: 0 }}
          >
            <XIcon size={16} />
          </button>
        </div>

        {/* Toolbar */}
        <div
          className="flex items-center justify-between px-4 py-2 shrink-0"
          style={{ backgroundColor: "var(--bg-muted)", borderBottom: "1px solid var(--border-default)" }}
        >
          {/* View mode toggle */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setViewMode("rendered")}
              className={`github-button github-button-sm ${viewMode === "rendered" ? "github-button-primary" : ""}`}
            >
              <EyeIcon size={14} />
              <span>Preview</span>
            </button>
            <button
              onClick={() => setViewMode("raw")}
              className={`github-button github-button-sm ${viewMode === "raw" ? "github-button-primary" : ""}`}
            >
              <CodeIcon size={14} />
              <span>Raw</span>
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="github-button github-button-sm"
            >
              {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>

            <button
              onClick={handleDownload}
              className="github-button github-button-sm"
            >
              <DownloadIcon size={14} />
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div
          className="flex-1 overflow-y-auto p-5"
          style={{ backgroundColor: "var(--bg-default)", fontSize: "14px", lineHeight: "1.6" }}
        >
          {viewMode === "rendered" ? (
            <div className="prose max-w-none space-y-4">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ node, ...props }) => (
                    <h1
                      style={{
                        fontSize: "24px",
                        fontWeight: 600,
                        borderBottom: "1px solid var(--border-default)",
                        paddingBottom: "8px",
                        marginBottom: "16px",
                        color: "var(--fg-default)"
                      }}
                      {...props}
                    />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2
                      style={{
                        fontSize: "18px",
                        fontWeight: 600,
                        borderBottom: "1px solid var(--border-muted)",
                        paddingBottom: "6px",
                        marginTop: "20px",
                        marginBottom: "12px",
                        color: "var(--fg-default)"
                      }}
                      {...props}
                    />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 style={{ fontSize: "15px", fontWeight: 600, marginTop: "16px", marginBottom: "8px", color: "var(--fg-default)" }} {...props} />
                  ),
                  p: ({ node, ...props }) => <p style={{ marginBottom: "12px", color: "var(--fg-default)" }} {...props} />,
                  code: ({ node, inline, ...props }) =>
                    inline ? (
                      <code
                        style={{
                          backgroundColor: "var(--bg-muted)",
                          padding: "2px 5px",
                          borderRadius: "4px",
                          fontSize: "0.9285em",
                          fontFamily: "var(--font-mono)"
                        }}
                        {...props}
                      />
                    ) : (
                      <div className="github-code my-3">
                        <code {...props} />
                      </div>
                    ),
                  table: ({ node, ...props }) => (
                    <div className="overflow-x-auto my-4 border rounded" style={{ borderColor: "var(--border-default)" }}>
                      <table className="github-table" {...props} />
                    </div>
                  )
                }}
              >
                {doc.markdown_content}
              </ReactMarkdown>
            </div>
          ) : (
            <pre
              className="github-code h-full"
              style={{ margin: 0, whiteSpace: "pre-wrap" }}
            >
              {doc.markdown_content}
            </pre>
          )}
        </div>

        {/* Footer */}
        <div className="github-dialog-footer">
          <button onClick={onClose} className="github-button">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
