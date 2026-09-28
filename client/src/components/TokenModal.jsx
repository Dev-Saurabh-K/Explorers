import React, { useState } from "react";
import { KeyIcon, XIcon, CheckIcon, CopyIcon, ShieldCheckIcon } from "@primer/octicons-react";
import { getToken, setToken } from "../services/api";

export function TokenModal({ onClose, onTokenUpdated }) {
  const [tokenInput, setTokenInput] = useState(getToken() || "");
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setToken(tokenInput.trim() || null);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onTokenUpdated();
      onClose();
    }, 800);
  };

  const handleClear = () => {
    setToken(null);
    setTokenInput("");
    onTokenUpdated();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(tokenInput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", backdropFilter: "blur(2px)" }}
    >
      <div className="github-dialog">
        {/* Header */}
        <div className="github-dialog-header">
          <div className="flex items-center gap-2">
            <KeyIcon size={16} />
            <h3 style={{ fontSize: "16px", fontWeight: 600, color: "var(--fg-default)", margin: 0 }}>
              Custom GitHub / Session Token
            </h3>
          </div>
          <button
            onClick={onClose}
            className="github-button github-button-invisible"
            style={{ width: "28px", height: "28px", padding: 0 }}
          >
            <XIcon size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="github-dialog-body space-y-4">
          <p style={{ fontSize: "14px", color: "var(--fg-muted)", margin: 0, lineHeight: 1.5 }}>
            Provide a custom GitHub Personal Access Token or session token to access private repositories or increase API rate limits.
          </p>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between" style={{ fontSize: "12px", fontWeight: 500, color: "var(--fg-muted)" }}>
              <span>Authorization Token</span>
              {tokenInput && (
                <button
                  type="button"
                  onClick={handleCopy}
                  className="github-button github-button-invisible github-button-sm"
                  style={{ height: "22px", padding: "0 6px", fontSize: "11px" }}
                >
                  {copied ? <CheckIcon size={12} /> : <CopyIcon size={12} />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              )}
            </div>

            <input
              type="password"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="ghp_... or JWT token"
              className="github-input w-full"
              style={{ fontFamily: "var(--font-mono)", fontSize: "13px" }}
            />
          </div>

          <div
            className="alert alert-info"
            style={{ padding: "8px 12px", fontSize: "13px" }}
          >
            <ShieldCheckIcon size={16} className="shrink-0" />
            <span>Tokens are stored locally in your browser session and transmitted only via HTTPS.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="github-dialog-footer">
          {tokenInput && (
            <button
              onClick={handleClear}
              className="github-button github-button-danger mr-auto"
            >
              Clear
            </button>
          )}

          <button
            onClick={onClose}
            className="github-button"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={saved}
            className="github-button github-button-primary"
          >
            {saved ? (
              <>
                <CheckIcon size={14} />
                <span>Saved</span>
              </>
            ) : (
              "Save Token"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
