import React, { useState } from "react";
import { KeyRound, X, Check, Copy, ExternalLink, ShieldCheck } from "lucide-react";
import { getToken, setToken, API_BASE_URL } from "../services/api";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0d1322] border border-slate-700/80 shadow-2xl p-6 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">JWT Session Token</h3>
              <p className="text-xs text-slate-400">
                Bearer credential sent in <code className="text-cyan-300">Authorization</code> header
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Input Area */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>Bearer JWT Token</span>
            {tokenInput && (
              <button
                onClick={handleCopy}
                className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            )}
          </label>
          <textarea
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            rows={4}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-cyan-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 resize-none leading-relaxed"
          />
        </div>

        {/* GitHub OAuth Quick Link */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-300">Get token via GitHub OAuth:</span>
            <a
              href={`${API_BASE_URL}/auth/github`}
              className="text-cyan-400 hover:underline flex items-center gap-1 font-medium"
            >
              <span>Login via GitHub</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <p className="text-[11px] text-slate-500">
            Redirects to GitHub, exchanges oauth code, and saves JWT automatically.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleClear}
            className="px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors border border-transparent hover:border-rose-500/20"
          >
            Clear Token
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-cyan-500/20 transition-all"
            >
              {saved ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Token</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
