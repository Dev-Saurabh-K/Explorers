import React from "react";
import { Users, ShieldAlert, CheckCircle2 } from "lucide-react";

export function DevelopersColumn({
  developers = [],
  selectedDeveloperId = null,
  onSelectDeveloper = () => {},
  searchQuery = ""
}) {
  const filteredDevs = developers.filter((dev) =>
    dev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dev.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-56 shrink-0 flex flex-col border-r border-white/5 bg-[#0a0c13] select-none h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-300 tracking-wide">
            Developers
          </span>
          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
            {developers.length}
          </span>
        </div>
      </div>

      {/* Developer List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredDevs.map((dev) => {
          const isSelected = selectedDeveloperId === dev.id;

          return (
            <button
              key={dev.id}
              onClick={() => onSelectDeveloper(dev.id)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition-all group ${
                isSelected
                  ? "bg-yellow-400/15 border border-yellow-400/40 text-yellow-300 shadow-md shadow-yellow-500/10"
                  : "hover:bg-slate-800/40 text-slate-400 hover:text-slate-200 border border-transparent"
              }`}
            >
              {/* Avatar with status */}
              <div className="relative shrink-0">
                <img
                  src={dev.avatar}
                  alt={dev.name}
                  className={`w-7 h-7 rounded-lg object-cover ring-1 ${
                    isSelected ? "ring-yellow-400" : "ring-slate-700/60"
                  }`}
                />
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ring-2 ring-[#0a0c13] ${
                    dev.status === "online"
                      ? "bg-emerald-400"
                      : dev.status === "busy"
                      ? "bg-amber-400"
                      : "bg-slate-500"
                  }`}
                />
              </div>

              {/* Dev Name & Risk */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold truncate ${isSelected ? "text-yellow-300 font-bold" : "text-slate-200"}`}>
                    {dev.name}
                  </span>
                  {dev.isDominant && (
                    <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 animate-pulse" title="Primary Contributor" />
                  )}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {dev.role}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
