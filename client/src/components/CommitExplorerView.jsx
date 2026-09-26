import React, { useState, useEffect } from "react";
import {
  GitCommit,
  Users,
  Search,
  Copy,
  Check,
  Calendar,
  Filter,
  ArrowRight,
  UserCheck,
  RefreshCw
} from "lucide-react";
import {
  getRepoCommits,
  getRepoContributors,
  getContributorCommits,
} from "../services/api";

export function CommitExplorerView({ selectedRepo }) {
  const [commits, setCommits] = useState([]);
  const [contributors, setContributors] = useState([]);
  const [activeContributor, setActiveContributor] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedSha, setCopiedSha] = useState(null);

  useEffect(() => {
    if (!selectedRepo) return;
    loadData(false);
  }, [selectedRepo]);

  const loadData = async (forceRefresh = false) => {
    setLoading(true);
    try {
      const [commitsRes, contributorsRes] = await Promise.allSettled([
        getRepoCommits(selectedRepo, forceRefresh),
        getRepoContributors(selectedRepo, forceRefresh),
      ]);

      if (commitsRes.status === "fulfilled") {
        setCommits(commitsRes.value || []);
      }
      if (contributorsRes.status === "fulfilled") {
        setContributors(contributorsRes.value || []);
      }
    } catch (err) {
      console.error("Error loading commit data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectContributor = async (username) => {
    if (activeContributor === username) {
      // Toggle off
      setActiveContributor(null);
      loadData(false);
      return;
    }

    setActiveContributor(username);
    setLoading(true);
    try {
      const filteredCommits = await getContributorCommits(selectedRepo, username);
      setCommits(
        filteredCommits.map((c) => ({
          ...c,
          author: username,
        }))
      );
    } catch (err) {
      console.error("Error filtering by contributor:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (sha) => {
    navigator.clipboard.writeText(sha);
    setCopiedSha(sha);
    setTimeout(() => setCopiedSha(null), 2000);
  };

  const filteredCommits = commits.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.message?.toLowerCase().includes(q) ||
      c.author?.toLowerCase().includes(q) ||
      c.sha?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Header & Contributor Filter Pills */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                <GitCommit className="h-4 w-4" />
              </span>
              <h3 className="text-base font-bold text-white">
                Git Commit History & Contributors
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Repository: <span className="font-mono text-cyan-300">{selectedRepo}</span>
            </p>
          </div>

          {/* Controls: Sync Button & Search Box */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => loadData(true)}
              disabled={loading}
              title="Force fetch latest commits directly from GitHub"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-[#00ff66] text-xs font-mono text-[#00ff66] transition shrink-0 active:translate-y-0.5 cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>{loading ? "SYNCING..." : "SYNC GITHUB"}</span>
            </button>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search commits or SHAs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>
        </div>

        {/* Contributors Row */}
        {contributors.length > 0 && (
          <div className="pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs text-slate-500 flex items-center gap-1 shrink-0 font-medium">
                <Users className="h-3.5 w-3.5" /> Filter by:
              </span>
              <button
                onClick={() => handleSelectContributor(null)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                  activeContributor === null
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                    : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                All Contributors ({contributors.length})
              </button>
              {contributors.map((contrib) => (
                <button
                  key={contrib.username}
                  onClick={() => handleSelectContributor(contrib.username)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-colors shrink-0 ${
                    activeContributor === contrib.username
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                      : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                  }`}
                >
                  <img
                    src={
                      contrib.avatar_url ||
                      `https://ui-avatars.com/api/?name=${contrib.username}&background=0284c7&color=fff`
                    }
                    alt=""
                    className="w-4 h-4 rounded-full"
                  />
                  <span>@{contrib.username}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Commits Timeline */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 text-xs">
          <GitCommit className="h-6 w-6 animate-spin text-cyan-400 mx-auto mb-2" />
          <span>Fetching commit log...</span>
        </div>
      ) : filteredCommits.length > 0 ? (
        <div className="space-y-3">
          {filteredCommits.map((c, i) => (
            <div
              key={c.sha || i}
              className="glass-card rounded-xl p-4 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 shrink-0 mt-0.5 sm:mt-0">
                  <GitCommit className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-200 leading-snug">
                    {c.message}
                  </h4>
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
                    <span className="text-cyan-300 font-mono">@{c.author || "maintainer"}</span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-slate-500" />
                      {c.date ? new Date(c.date).toLocaleDateString() : "recent"}
                    </span>
                  </div>
                </div>
              </div>

              {/* SHA badge */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-slate-950 text-cyan-300 border border-slate-800">
                  {c.sha ? c.sha.slice(0, 7) : "commit"}
                </span>
                <button
                  onClick={() => handleCopy(c.sha)}
                  className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors"
                  title="Copy full SHA"
                >
                  {copiedSha === c.sha ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-slate-500 text-xs">
          No commits found for the current search/filter.
        </div>
      )}
    </div>
  );
}
