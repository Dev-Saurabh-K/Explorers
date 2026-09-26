import React, { useState } from "react";
import { Plus, Search, FolderGit2, Lock, Globe, ChevronLeft, ChevronRight, Disc3 } from "lucide-react";

export function RepositoriesColumn({
  repositories = [],
  selectedRepoId = "",
  onSelectRepo = () => {},
  onAddRepo = () => {},
  collapsed = false,
  onToggleCollapse = () => {}
}) {
  const [localSearch, setLocalSearch] = useState("");

  const filtered = repositories.filter((r) => {
    const name = typeof r === "string" ? r : r.name;
    return name.toLowerCase().includes(localSearch.toLowerCase());
  });

  if (collapsed) {
    return (
      <div className="w-12 shrink-0 flex flex-col items-center py-3 border-r border-[#00ff66]/20 bg-[#090b10] select-none h-full min-h-0 justify-between">
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={onToggleCollapse}
            title="Expand Repositories Deck"
            className="p-1.5 rounded-lg border border-[#00ff66]/40 text-[#00ff66] hover:bg-[#00ff66] hover:text-black transition"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
          <div className="text-[10px] font-mono text-[#ffb000] rotate-90 my-8 whitespace-nowrap tracking-wider font-bold">
            TAPES ({repositories.length})
          </div>
        </div>

        <button
          onClick={onAddRepo}
          title="Mount New Repo"
          className="p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-[#00ff66] hover:border-[#00ff66] transition"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-56 lg:w-60 shrink-0 flex flex-col border-r border-[#00ff66]/20 bg-[#090b10] select-none h-full min-h-0 overflow-hidden font-mono">
      {/* Header with Title and Controls */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-[#00ff66]/20 bg-[#0c0e16] shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <Disc3 className="h-3.5 w-3.5 text-[#ffb000] shrink-0 animate-spin" style={{ animationDuration: "12s" }} />
          <span className="text-[11px] font-bold text-white tracking-wider truncate uppercase">
            Tape Archive
          </span>
          <span className="text-[10px] px-1 py-0.2 rounded bg-black text-[#ffb000] border border-[#ffb000]/40 font-bold shrink-0">
            {repositories.length}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onAddRepo}
            title="Mount new repository"
            className="p-1 rounded text-slate-400 hover:text-[#ffb000] hover:bg-slate-800 transition"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onToggleCollapse}
            title="Collapse Repositories Column"
            className="p-1 rounded text-slate-500 hover:text-white transition"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="p-2 border-b border-[#00ff66]/15 bg-[#0a0d14] shrink-0">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search tapes..."
            className="w-full bg-black border border-slate-800 rounded pl-7 pr-2 py-1 text-[11px] text-[#00ff66] placeholder-slate-600 focus:outline-none focus:border-[#00ff66] transition-all font-mono"
          />
        </div>
      </div>

      {/* Repositories Tape List */}
      <div className="flex-1 overflow-y-auto min-h-0 p-1.5 space-y-1">
        {filtered.map((repo) => {
          const repoId = typeof repo === "string" ? repo : repo.id || repo.name;
          const repoName = typeof repo === "string" ? repo : repo.name;
          const visibility = typeof repo === "object" ? repo.visibility || "Public" : "Public";
          const isSelected = selectedRepoId === repoId || selectedRepoId === repoName;

          return (
            <button
              key={repoId}
              onClick={() => onSelectRepo(repoId)}
              title={repoName}
              className={`w-full p-2 rounded text-left transition-all relative border text-[11px] ${
                isSelected
                  ? "bg-[#101b1f] border-[#00e5ff] text-[#00e5ff] font-bold shadow-[inset_0_0_8px_rgba(0,229,255,0.2)]"
                  : "bg-[#0b0e15] border-slate-900 text-slate-300 hover:border-slate-700 hover:text-white hover:bg-slate-900/40"
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-1.5 truncate">
                  <span className={isSelected ? "text-[#ffb000]" : "text-slate-500"}>
                    {isSelected ? "►" : "▪"}
                  </span>
                  <span className="truncate font-semibold">{repoName}</span>
                </div>
                {visibility === "Private" ? (
                  <Lock className="h-2.5 w-2.5 text-amber-500/70 shrink-0" />
                ) : (
                  <Globe className="h-2.5 w-2.5 text-slate-500 shrink-0" />
                )}
              </div>

              <div className="flex items-center justify-between mt-1 text-[9px] text-slate-500">
                <span className={visibility === "Private" ? "text-[#ffb000]" : "text-slate-400"}>
                  [{visibility.toUpperCase()}]
                </span>
                {isSelected && (
                  <span className="text-[#00ff66] font-bold">[MOUNTED]</span>
                )}
              </div>
            </button>
          );
        })}

        {filtered.length === 0 && (
          <div className="p-4 text-center text-[10px] text-slate-600">
            [NO MATCHING TAPES]
          </div>
        )}
      </div>
    </div>
  );
}
