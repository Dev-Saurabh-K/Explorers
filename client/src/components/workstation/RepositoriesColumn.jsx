import React, { useState } from "react";
import { Plus, Search, FolderGit2, Lock, Globe } from "lucide-react";

export function RepositoriesColumn({
  repositories = [],
  selectedRepoId = "",
  onSelectRepo = () => {},
  onAddRepo = () => {}
}) {
  const [localSearch, setLocalSearch] = useState("");

  const filtered = repositories.filter((r) => {
    const name = typeof r === "string" ? r : r.name;
    return name.toLowerCase().includes(localSearch.toLowerCase());
  });

  return (
    <div className="w-64 shrink-0 flex flex-col border-r border-white/5 bg-[#0b0e17] select-none h-full overflow-hidden">
      {/* Header with Title and + Button */}
      <div className="flex items-center justify-between px-3.5 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-300 tracking-wide">
            Repositories
          </span>
          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-400">
            {repositories.length}
          </span>
        </div>
        <button
          onClick={onAddRepo}
          title="Import or register repository"
          className="p-1 rounded-md text-slate-400 hover:text-yellow-400 hover:bg-yellow-400/10 transition-colors"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Search Input */}
      <div className="p-2 border-b border-white/5">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search repositories..."
            className="w-full bg-[#121624] border border-slate-700/50 rounded-lg pl-7 pr-3 py-1.5 text-[11px] text-slate-200 placeholder-slate-400 focus:outline-none focus:border-yellow-400/70 transition-all font-mono"
          />
        </div>
      </div>

      {/* Repositories List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {filtered.map((repo) => {
          const repoId = typeof repo === "string" ? repo : repo.id || repo.name;
          const repoName = typeof repo === "string" ? repo : repo.name;
          const visibility = typeof repo === "object" ? repo.visibility || "Public" : "Public";
          const updated = typeof repo === "object" ? repo.updated || "Updated recently" : "Updated recently";
          const isSelected = selectedRepoId === repoId || selectedRepoId === repoName;

          return (
            <button
              key={repoId}
              onClick={() => onSelectRepo(repoId)}
              className={`w-full p-2.5 rounded-xl text-left transition-all ${
                isSelected
                  ? "bg-gradient-to-r from-yellow-400/15 to-transparent border border-yellow-400/40 text-yellow-300 shadow-lg shadow-yellow-500/10"
                  : "hover:bg-slate-800/40 text-slate-300 hover:text-white border border-transparent"
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-1.5 truncate">
                  <FolderGit2 className={`h-3.5 w-3.5 shrink-0 ${isSelected ? "text-yellow-400" : "text-slate-400"}`} />
                  <span className={`text-xs font-semibold truncate ${isSelected ? "text-yellow-300 font-bold" : "text-slate-200"}`}>
                    {repoName}
                  </span>
                </div>
                {visibility === "Private" ? (
                  <Lock className="h-3 w-3 text-slate-400 shrink-0" />
                ) : (
                  <Globe className="h-3 w-3 text-slate-400 shrink-0" />
                )}
              </div>

              <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                <span className={visibility === "Private" ? "text-amber-400/80 font-medium" : "text-slate-400 font-medium"}>
                  {visibility}
                </span>
                <span>•</span>
                <span className="truncate">{updated}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
