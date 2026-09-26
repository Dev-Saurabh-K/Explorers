import React, { useState } from "react";
import {
  Terminal,
  Play,
  Copy,
  Check,
  Clock,
  ArrowRight,
  Code2,
  CheckCircle,
  AlertCircle,
  Sparkles
} from "lucide-react";
import { API_BASE_URL, getToken } from "../services/api";

const ENDPOINTS = [
  {
    id: "health",
    name: "System Health Check",
    method: "GET",
    path: "/",
    desc: "Check API availability and server state",
    auth: false,
    params: {},
    body: null,
  },
  {
    id: "auth-me",
    name: "Current User Profile",
    method: "GET",
    path: "/auth/me",
    desc: "Fetches currently authenticated user details",
    auth: true,
    params: {},
    body: null,
  },
  {
    id: "repos",
    name: "List Repositories",
    method: "GET",
    path: "/github/repos",
    desc: "Lists all repositories accessible by the user",
    auth: true,
    params: {},
    body: null,
  },
  {
    id: "commits",
    name: "Repository Commits",
    method: "GET",
    path: "/github/repo/commits",
    desc: "Fetches commit log for a repository",
    auth: true,
    params: { repo: "octocat/Hello-World" },
    body: null,
  },
  {
    id: "contributors",
    name: "Repository Contributors",
    method: "GET",
    path: "/github/repo/contributors",
    desc: "Fetches active contributors with avatars",
    auth: true,
    params: { repo: "octocat/Hello-World" },
    body: null,
  },
  {
    id: "contributor-commits",
    name: "Contributor Commits",
    method: "GET",
    path: "/github/repo/contributor/commits",
    desc: "Commits authored by a specific contributor",
    auth: true,
    params: { repo: "octocat/Hello-World", contributor: "octocat" },
    body: null,
  },
  {
    id: "categorize",
    name: "AI Feature Categorization",
    method: "POST",
    path: "/ai/features/categorize",
    desc: "Clusters commits into product features with AI semantic engine",
    auth: true,
    params: {},
    body: JSON.stringify(
      {
        repo: "octocat/Hello-World",
        max_commits: 50,
        include_knowledge_graph: true,
      },
      null,
      2
    ),
  },
  {
    id: "generate-doc",
    name: "Generate Feature Markdown Doc",
    method: "POST",
    path: "/ai/features/generate-doc",
    desc: "Synthesizes comprehensive markdown technical documentation",
    auth: true,
    params: {},
    body: JSON.stringify(
      {
        repo: "octocat/Hello-World",
        feature_id: "github-oauth-authentication",
        feature_name: "GitHub OAuth & JWT Authentication",
        feature_summary: "Implements OAuth 2.0 authorization code grant.",
        commit_shas: ["7fd1a60b01f91b314f59955a4e4d4e80d8edf11d"],
      },
      null,
      2
    ),
  },
  {
    id: "knowledge-concentration",
    name: "Knowledge Concentration",
    method: "GET",
    path: "/github/repo/knowledge-concentration",
    desc: "Calculates repository Bus Factor and code ownership percentage",
    auth: true,
    params: { repo: "octocat/Hello-World", max_commits: 100 },
    body: null,
  },
  {
    id: "knowledge-graph",
    name: "Full Knowledge Graph",
    method: "GET",
    path: "/github/repo/knowledge-graph",
    desc: "Comprehensive repository telemetry heuristics",
    auth: true,
    params: { repo: "octocat/Hello-World", max_commits: 100 },
    body: null,
  },
  {
    id: "feature-knowledge",
    name: "Feature Knowledge Telemetry",
    method: "POST",
    path: "/github/repo/feature-knowledge",
    desc: "Computes knowledge concentration for a single feature",
    auth: true,
    params: {},
    body: JSON.stringify(
      {
        repo: "octocat/Hello-World",
        feature_id: "auth-system",
        feature_name: "Authentication System",
        commit_shas: ["7fd1a60b01f91b314f59955a4e4d4e80d8edf11d"],
        include_diff_stats: true,
      },
      null,
      2
    ),
  },
  {
    id: "features-knowledge-batch",
    name: "Batch Features Knowledge",
    method: "POST",
    path: "/github/repo/features-knowledge-batch",
    desc: "Calculates telemetry across multiple features for stacked bar chart",
    auth: true,
    params: {},
    body: JSON.stringify(
      {
        repo: "octocat/Hello-World",
        features: [
          {
            feature_id: "auth-system",
            feature_name: "Authentication System",
            category: "Authentication",
            commit_shas: ["7fd1a60b01f91b314f59955a4e4d4e80d8edf11d"],
          },
        ],
        include_diff_stats: false,
      },
      null,
      2
    ),
  },
];

export function ApiConsoleView({ defaultRepo }) {
  const [selectedEndpoint, setSelectedEndpoint] = useState(ENDPOINTS[0]);
  const [params, setParams] = useState(ENDPOINTS[0].params);
  const [requestBody, setRequestBody] = useState(ENDPOINTS[0].body || "");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [responseTime, setResponseTime] = useState(null);
  const [copiedCurl, setCopiedCurl] = useState(false);

  const handleSelectEndpoint = (ep) => {
    setSelectedEndpoint(ep);
    // Auto-fill current default repo if param exists
    const newParams = { ...ep.params };
    if (newParams.repo && defaultRepo) {
      newParams.repo = defaultRepo;
    }
    setParams(newParams);

    if (ep.body && defaultRepo) {
      try {
        const parsed = JSON.parse(ep.body);
        if (parsed.repo) parsed.repo = defaultRepo;
        setRequestBody(JSON.stringify(parsed, null, 2));
      } catch {
        setRequestBody(ep.body || "");
      }
    } else {
      setRequestBody(ep.body || "");
    }

    setResponse(null);
  };

  const executeRequest = async () => {
    setLoading(true);
    setResponse(null);
    const startTime = performance.now();

    // Build URL query string
    let url = `${API_BASE_URL}${selectedEndpoint.path}`;
    const queryEntries = Object.entries(params);
    if (queryEntries.length > 0) {
      const searchParams = new URLSearchParams();
      queryEntries.forEach(([k, v]) => {
        if (v !== undefined && v !== "") searchParams.append(k, v);
      });
      url += `?${searchParams.toString()}`;
    }

    const headers = {
      "Content-Type": "application/json",
    };

    const token = getToken();
    if (selectedEndpoint.auth && token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const options = {
        method: selectedEndpoint.method,
        headers,
        credentials: "include",
      };

      if (selectedEndpoint.method !== "GET" && requestBody) {
        options.body = requestBody;
      }

      const res = await fetch(url, options);
      const endTime = performance.now();
      setResponseTime(Math.round(endTime - startTime));

      let bodyData;
      const text = await res.text();
      try {
        bodyData = JSON.parse(text);
      } catch {
        bodyData = text;
      }

      setResponse({
        status: res.status,
        statusText: res.statusText,
        ok: res.ok,
        data: bodyData,
      });
    } catch (err) {
      const endTime = performance.now();
      setResponseTime(Math.round(endTime - startTime));
      setResponse({
        status: 0,
        statusText: "Network / CORS Error",
        ok: false,
        data: { error: err.message },
      });
    } finally {
      setLoading(false);
    }
  };

  const getCurlCommand = () => {
    let url = `${API_BASE_URL}${selectedEndpoint.path}`;
    const queryEntries = Object.entries(params);
    if (queryEntries.length > 0) {
      const searchParams = new URLSearchParams();
      queryEntries.forEach(([k, v]) => {
        if (v !== undefined && v !== "") searchParams.append(k, v);
      });
      url += `?${searchParams.toString()}`;
    }

    const token = getToken() || "YOUR_BEARER_TOKEN";
    let cmd = `curl -X ${selectedEndpoint.method} "${url}"`;
    cmd += ` \\\n  -H "Content-Type: application/json"`;
    if (selectedEndpoint.auth) {
      cmd += ` \\\n  -H "Authorization: Bearer ${token}"`;
    }
    if (selectedEndpoint.method !== "GET" && requestBody) {
      cmd += ` \\\n  -d '${requestBody.replace(/'/g, "\\'")}'`;
    }
    return cmd;
  };

  const copyCurl = () => {
    navigator.clipboard.writeText(getCurlCommand());
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Introduction */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <Terminal className="h-5 w-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white">
            Interactive API Playground (12 Endpoints)
          </h3>
        </div>
        <p className="text-xs text-slate-400">
          Directly test and inspect every endpoint documented in <code className="text-cyan-300">server/api_documentation.md</code> with live latency diagnostics.
        </p>
      </div>

      {/* Main Console Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Endpoints Sidebar */}
        <div className="lg:col-span-4 glass-card rounded-2xl p-4 border border-slate-800/80 shadow-xl flex flex-col gap-1 max-h-[700px] overflow-y-auto">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1">
            API Endpoints Catalog
          </div>
          {ENDPOINTS.map((ep) => {
            const isSelected = selectedEndpoint.id === ep.id;
            return (
              <button
                key={ep.id}
                onClick={() => handleSelectEndpoint(ep)}
                className={`text-left p-3 rounded-xl transition-all border ${
                  isSelected
                    ? "bg-slate-800/90 border-cyan-500/40 shadow-sm"
                    : "border-transparent hover:bg-slate-900/60"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span
                    className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                      ep.method === "GET"
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                    }`}
                  >
                    {ep.method}
                  </span>
                  {ep.auth && (
                    <span className="text-[10px] text-amber-400/80 font-mono">
                      Bearer
                    </span>
                  )}
                </div>
                <div className="text-xs font-semibold text-white truncate">
                  {ep.name}
                </div>
                <div className="text-[11px] text-slate-400 font-mono truncate mt-0.5">
                  {ep.path}
                </div>
              </button>
            );
          })}
        </div>

        {/* Request & Response Workspace */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Request Panel */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800/80 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-bold font-mono px-2.5 py-1 rounded-md ${
                    selectedEndpoint.method === "GET"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                  }`}
                >
                  {selectedEndpoint.method}
                </span>
                <span className="text-xs sm:text-sm font-mono text-slate-200">
                  {selectedEndpoint.path}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={copyCurl}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs border border-slate-800 transition-colors"
                >
                  {copiedCurl ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  <span>Copy cURL</span>
                </button>

                <button
                  onClick={executeRequest}
                  disabled={loading}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-500/20 transition-all disabled:opacity-50"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>{loading ? "Executing..." : "Send Request"}</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-400">{selectedEndpoint.desc}</p>

            {/* Query Parameters Form */}
            {Object.keys(params).length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Query Parameters
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(params).map(([key, val]) => (
                    <div key={key} className="space-y-1">
                      <label className="text-[11px] font-mono text-slate-400">{key}</label>
                      <input
                        type="text"
                        value={val}
                        onChange={(e) =>
                          setParams({ ...params, [key]: e.target.value })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500/50"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Request Body JSON */}
            {selectedEndpoint.method !== "GET" && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Request Body (JSON)
                </span>
                <textarea
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  rows={6}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-cyan-200 focus:outline-none focus:border-cyan-500/50 resize-y leading-relaxed"
                />
              </div>
            )}
          </div>

          {/* Response Panel */}
          {response && (
            <div className="glass-card rounded-2xl p-6 border border-slate-800/80 shadow-xl space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Response
                  </span>
                  <span
                    className={`text-xs font-bold font-mono px-2.5 py-0.5 rounded-full border ${
                      response.ok
                        ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                        : "bg-rose-500/15 text-rose-400 border-rose-500/30"
                    }`}
                  >
                    {response.status} {response.statusText}
                  </span>
                </div>

                {responseTime !== null && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                    <Clock className="h-3.5 w-3.5 text-slate-500" />
                    <span>{responseTime} ms</span>
                  </div>
                )}
              </div>

              {/* Formatted JSON Body */}
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-xs font-mono text-slate-200 overflow-x-auto max-h-96 leading-relaxed selection:bg-cyan-500/30">
                {typeof response.data === "object"
                  ? JSON.stringify(response.data, null, 2)
                  : String(response.data)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
