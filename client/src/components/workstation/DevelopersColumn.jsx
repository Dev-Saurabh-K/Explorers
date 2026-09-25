import React from "react";
import { Users, ShieldAlert, CheckCircle2, ChevronLeft, ChevronRight, UserCheck } from "lucide-react";

export function DevelopersColumn({
  developers = [],
  selectedDeveloperId = null,
  onSelectDeveloper = () => {},
  searchQuery = "",
  collapsed = false,
  onToggleCollapse = () => {}
}) {
  const filteredDevs = developers.filter((dev) => {
    const name = dev.name || dev.developer || "";
    const role = dev.role || "";
    const q = searchQuery.toLowerCase();
    return name.toLowerCase().includes(q) || role.toLowerCase().includes(q);
  });

  if (collapsed) {
    return (
      <div className="w-12 shrink-0 flex flex-col items-center py-3 border-r border-[#00ff66]/20 bg-[#080a0f] select-none h-full justify-between font-mono">
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={onToggleCollapse}
            title="Expand Authors Deck"
            className="p-1.5 rounded-lg border border-[#00ff66]/40 text-[#00ff66] hover:bg-[#00ff66] hover:text-black transition"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
          <div className="text-[10px] text-[#ffb000] rotate-90 my-8 whitespace-nowrap tracking-wider font-bold">
            AUTHORS ({developers.length})
          </div>
        </div>
        <Users className="h-4 w-4 text-slate-600 mb-2" />
      </div>
    );
  }

  return (
    <div className="w-52 lg:w-56 shrink-0 flex flex-col border-r border-[#00ff66]/20 bg-[#080a0f] select-none h-full overflow-hidden font-mono">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-[#00ff66]/20 bg-[#0b0e17]">
        <div className="flex items-center gap-1.5 min-w-0">
          <Users className="h-3.5 w-3.5 text-[#00ff66] shrink-0" />
          <span className="text-[11px] font-bold text-white tracking-wider truncate uppercase">
            Authors
          </span>
          <span className="text-[10px] px-1 py-0.2 rounded bg-black text-[#00ff66] border border-[#00ff66]/40 font-bold shrink-0">
            {developers.length}
          </span>
        </div>

        <button
          onClick={onToggleCollapse}
          title="Collapse Authors Column"
          className="p-1 rounded text-slate-500 hover:text-white transition"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Developer List */}
      <div className="flex-1 overflow-y-auto p-1.5 space-y-1">
        {filteredDevs.map((dev, idx) => {
          const id = dev.id || dev.developer || `dev-${idx}`;
          const name = dev.name || dev.developer;
          const isSelected = selectedDeveloperId === id || selectedDeveloperId === name;
          const isDominant = dev.isDominant || dev.is_dominant || idx === 0;
          const percentage = dev.knowledge_percentage ?? dev.commit_percentage ?? (dev.percentage || 50);
          const avatar = dev.avatar || dev.avatar_url || `https://ui-avatars.com/api/?name=${name}&background=0c0f18&color=00ff66`;

          return (
            <button
              key={id}
              onClick={() => onSelectDeveloper(id)}
              className={`w-full flex items-center gap-2 p-2 rounded text-left transition-all relative border text-[11px] ${
                isSelected
                  ? "bg-[#101b22] border-[#00ff66] text-[#00ff66] font-bold shadow-[inset_0_0_8px_rgba(0,255,102,0.2)]"
                  : "bg-[#0a0c13] border-slate-900 text-slate-300 hover:border-slate-700 hover:text-white hover:bg-slate-900/40"
              }`}
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                <img
                  src={avatar}
                  alt={name}
                  className={`w-6 h-6 rounded object-cover ring-1 ${
                    isSelected ? "ring-[#00ff66]" : "ring-slate-800"
                  }`}
                />
                {isDominant && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#ffb000] ring-1 ring-black" title="Lead Maintainer" />
                )}
              </div>

              {/* Dev Name & Risk */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className={`text-[11px] font-bold truncate ${isSelected ? "text-white" : "text-slate-200"}`}>
                    @{name}
                  </span>
                  <span className="text-[9px] font-bold text-[#ffb000] shrink-0">
                    {Math.round(percentage)}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-[9px] text-slate-500 mt-0.5">
                  <span className="truncate">{dev.role || `${dev.commit_count || dev.commitsCount || 0} commits`}</span>
                  {isDominant && (
                    <span className="text-[8px] uppercase text-[#ffb000] font-bold">[LEAD]</span>
                  )}
                </div>
              </div>
            </button>
          );
        })}

        {filteredDevs.length === 0 && (
          <div className="p-3 text-center text-[10px] text-slate-600">
            [NO AUTHORS MATCHED]
          </div>
        )}
      </div>
    </div>
  );
}
