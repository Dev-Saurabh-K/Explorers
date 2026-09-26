import React, { useState, useEffect, useMemo } from "react";
import {
  Users,
  UserMinus,
  UserCheck,
  ShieldAlert,
  ShieldCheck,
  Award,
  Sparkles,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Filter,
  Search,
  Database,
  Cpu,
  Layers,
  Lock,
  CreditCard,
  Package,
  TrendingUp,
  SlidersHorizontal,
  X,
  Zap,
  Info
} from "lucide-react";
import {
  getTeamOverview,
  offboardDeveloper,
  reinstateDeveloper,
  simulateSuccession,
  overrideSuccession
} from "../services/api";

export function TeamSuccessionPage({
  selectedRepo = "default",
  onNavigateToDeveloper = () => {},
  showToast = () => {}
}) {
  const [loading, setLoading] = useState(true);
  const [teamData, setTeamData] = useState(null);
  const [activeTab, setActiveTab] = useState("roster"); // "roster" | "succession"
  const [searchFilter, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "active" | "quitted" | "at_risk"

  // Modals state
  const [offboardTargetDev, setOffboardTargetDev] = useState(null);
  const [offboardReason, setOffboardReason] = useState("");
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  const [simulationData, setSimulationData] = useState(null);
  const [simulatingDev, setSimulatingDev] = useState(null);

  const [overrideModalTarget, setOverrideModalTarget] = useState(null);
  const [overrideSelectedDev, setOverrideSelectedDev] = useState("");

  // Load team data
  const loadTeamData = async () => {
    setLoading(true);
    try {
      const data = await getTeamOverview(selectedRepo);
      setTeamData(data);
    } catch (err) {
      console.error("Failed to load team overview:", err);
      showToast(`Failed to load team: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeamData();
  }, [selectedRepo]);

  // Execute Offboard / Quit Developer
  const handleConfirmOffboard = async () => {
    if (!offboardTargetDev) return;
    setIsProcessingAction(true);
    try {
      const res = await offboardDeveloper({
        developer_name: offboardTargetDev.developer_name,
        repo: selectedRepo,
        reason: offboardReason || "Offboarded by project administrator"
      });

      showToast(`Offboarded @${offboardTargetDev.developer_name} and auto-reassigned features!`);
      setOffboardTargetDev(null);
      setOffboardReason("");
      await loadTeamData();
      setActiveTab("succession");
    } catch (err) {
      console.error("Offboard failed:", err);
      showToast(`Offboard failed: ${err.message}`);
    } finally {
      setIsProcessingAction(false);
    }
  };

  // Execute Reinstate Developer
  const handleReinstate = async (devName) => {
    setIsProcessingAction(true);
    try {
      await reinstateDeveloper({
        developer_name: devName,
        repo: selectedRepo
      });
      showToast(`Reinstated @${devName} back to active team!`);
      await loadTeamData();
    } catch (err) {
      console.error("Reinstate failed:", err);
      showToast(`Reinstate failed: ${err.message}`);
    } finally {
      setIsProcessingAction(false);
    }
  };

  // Run Simulation Preview
  const handleRunSimulation = async (dev) => {
    setSimulatingDev(dev);
    setIsProcessingAction(true);
    try {
      const res = await simulateSuccession({
        developer_name: dev.developer_name,
        repo: selectedRepo
      });
      setSimulationData(res);
    } catch (err) {
      console.error("Simulation failed:", err);
      showToast(`Simulation failed: ${err.message}`);
    } finally {
      setIsProcessingAction(false);
    }
  };

  // Execute Manual Override
  const handleConfirmOverride = async () => {
    if (!overrideModalTarget || !overrideSelectedDev) return;
    setIsProcessingAction(true);
    try {
      await overrideSuccession({
        feature_id: overrideModalTarget.feature_id,
        repo: selectedRepo,
        new_developer: overrideSelectedDev,
        notes: `Manual assignment override to @${overrideSelectedDev}`
      });
      showToast(`Assigned @${overrideSelectedDev} to ${overrideModalTarget.feature_name}!`);
      setOverrideModalTarget(null);
      setOverrideSelectedDev("");
      await loadTeamData();
    } catch (err) {
      console.error("Override failed:", err);
      showToast(`Override failed: ${err.message}`);
    } finally {
      setIsProcessingAction(false);
    }
  };

  // Filter developers
  const filteredDevelopers = useMemo(() => {
    if (!teamData?.developers) return [];
    return teamData.developers.filter((d) => {
      const query = searchFilter.toLowerCase().trim();
      const matchesSearch =
        !query ||
        d.developer_name.toLowerCase().includes(query) ||
        (d.role && d.role.toLowerCase().includes(query)) ||
        (d.email && d.email.toLowerCase().includes(query)) ||
        (d.top_domains && d.top_domains.some((dom) => dom.toLowerCase().includes(query)));

      let matchesStatus = true;
      if (statusFilter === "active") matchesStatus = d.status !== "quitted";
      else if (statusFilter === "quitted") matchesStatus = d.status === "quitted";
      else if (statusFilter === "at_risk") matchesStatus = d.risk_level === "CRITICAL" || d.risk_level === "HIGH";

      return matchesSearch && matchesStatus;
    });
  }, [teamData, searchFilter, statusFilter]);

  return (
    <div className="flex-1 w-full h-[calc(100vh-3.5rem)] flex flex-col overflow-y-auto bg-[#08090d] text-slate-100 font-mono select-none">
      
      {/* Header Banner */}
      <div className="shrink-0 border-b border-[#00ff66]/20 bg-[#090b12] px-6 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-lg bg-[#00ff66]/10 border border-[#00ff66]/30 text-[#00ff66]">
                <Users className="h-5 w-5" />
              </span>
              <h1 className="text-xl font-black tracking-wider text-white uppercase flex items-center gap-2">
                Team Roster & Succession Engine
                <span className="text-xs px-2 py-0.5 rounded bg-[#00e5ff]/10 text-[#00e5ff] border border-[#00e5ff]/30 font-normal">
                  BUS FACTOR GUARD
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-sans">
              Intelligent developer offboarding & automated successor reassignment based on historical commit telemetry and feature affinity.
            </p>
          </div>

          {/* Zero GitHub API Overload Badge */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#00ff66]/5 border border-[#00ff66]/30 text-[#00ff66] text-xs">
              <Database className="h-4 w-4 animate-pulse text-[#00ff66]" />
              <div>
                <span className="font-bold tracking-wider">DATABASE CACHE ACTIVE</span>
                <span className="text-[10px] text-slate-400 block font-sans">0 GitHub API Calls Used (Anti-Overload)</span>
              </div>
            </div>

            <button
              onClick={loadTeamData}
              disabled={loading}
              title="Refresh Team Telemetry"
              className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-[#00ff66] text-slate-300 hover:text-[#00ff66] transition"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Global Telemetry Metrics */}
        {teamData && (
          <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            <div className="p-3 rounded-xl bg-[#0c0e16] border border-white/5 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-sans">Total Roster</div>
                <div className="text-2xl font-black text-white">{teamData.total_developers}</div>
              </div>
              <Users className="h-5 w-5 text-slate-500" />
            </div>

            <div className="p-3 rounded-xl bg-[#0c0e16] border border-[#00ff66]/20 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-sans">Active Developers</div>
                <div className="text-2xl font-black text-[#00ff66]">{teamData.active_developers}</div>
              </div>
              <CheckCircle2 className="h-5 w-5 text-[#00ff66]" />
            </div>

            <div className="p-3 rounded-xl bg-[#0c0e16] border border-red-500/20 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-sans">Offboarded / Quitted</div>
                <div className="text-2xl font-black text-red-400">{teamData.quitted_developers}</div>
              </div>
              <UserMinus className="h-5 w-5 text-red-400" />
            </div>

            <div className="p-3 rounded-xl bg-[#0c0e16] border border-[#ffb000]/20 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-sans">Reassigned Features</div>
                <div className="text-2xl font-black text-[#ffb000]">
                  {teamData.recent_assignments?.length || teamData.reassigned_features_count || 0}
                </div>
              </div>
              <Award className="h-5 w-5 text-[#ffb000]" />
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto flex items-center gap-4 mt-5 border-b border-white/5 text-xs font-bold">
          <button
            onClick={() => setActiveTab("roster")}
            className={`pb-2.5 transition relative flex items-center gap-2 ${
              activeTab === "roster" ? "text-[#00ff66] font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            <Users className="h-4 w-4" />
            Developer Roster ({teamData?.total_developers || 0})
            {activeTab === "roster" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00ff66] shadow-[0_0_8px_#00ff66]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("succession")}
            className={`pb-2.5 transition relative flex items-center gap-2 ${
              activeTab === "succession" ? "text-[#ffb000] font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            <Award className="h-4 w-4" />
            Succession Matrix & Reassignments ({teamData?.recent_assignments?.length || 0})
            {activeTab === "succession" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ffb000] shadow-[0_0_8px_#ffb000]" />
            )}
          </button>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        
        {/* ================= TAB 1: DEVELOPER ROSTER ================= */}
        {activeTab === "roster" && (
          <div className="space-y-5">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter developers by name, role, domain..."
                  className="w-full bg-[#0c0e16] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00ff66]/60 transition"
                />
              </div>

              {/* Status Filter Pills */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0c0e16] border border-white/5 text-xs">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`px-3 py-1 rounded-lg transition ${
                    statusFilter === "all" ? "bg-white/10 text-white font-bold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  All ({teamData?.total_developers || 0})
                </button>
                <button
                  onClick={() => setStatusFilter("active")}
                  className={`px-3 py-1 rounded-lg transition ${
                    statusFilter === "active" ? "bg-[#00ff66]/20 text-[#00ff66] font-bold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Active ({teamData?.active_developers || 0})
                </button>
                <button
                  onClick={() => setStatusFilter("quitted")}
                  className={`px-3 py-1 rounded-lg transition ${
                    statusFilter === "quitted" ? "bg-red-500/20 text-red-400 font-bold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Quitted ({teamData?.quitted_developers || 0})
                </button>
                <button
                  onClick={() => setStatusFilter("at_risk")}
                  className={`px-3 py-1 rounded-lg transition ${
                    statusFilter === "at_risk" ? "bg-[#ffb000]/20 text-[#ffb000] font-bold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  At Risk
                </button>
              </div>
            </div>

            {/* Developers Grid */}
            {loading ? (
              <div className="py-20 text-center space-y-3">
                <RefreshCw className="h-8 w-8 text-[#00ff66] animate-spin mx-auto" />
                <div className="text-xs text-slate-400">Loading developer roster from database...</div>
              </div>
            ) : filteredDevelopers.length === 0 ? (
              <div className="py-20 text-center border border-white/5 rounded-2xl bg-[#0c0e16] p-8">
                <Users className="h-10 w-10 text-slate-600 mx-auto mb-3" />
                <div className="text-sm font-bold text-white">No developers match your filter criteria</div>
                <div className="text-xs text-slate-400 mt-1">Try resetting the search bar or status filter.</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDevelopers.map((dev) => {
                  const isQuitted = dev.status === "quitted";
                  const isCritical = dev.risk_level === "CRITICAL";
                  const isHigh = dev.risk_level === "HIGH";

                  return (
                    <div
                      key={dev.developer_name}
                      className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                        isQuitted
                          ? "bg-[#110e14]/60 border-red-500/30 opacity-80"
                          : isCritical
                          ? "bg-[#0c0e16] border-red-500/40 hover:border-red-500 shadow-lg shadow-red-950/20"
                          : isHigh
                          ? "bg-[#0c0e16] border-[#ffb000]/40 hover:border-[#ffb000] shadow-lg shadow-amber-950/20"
                          : "bg-[#0c0e16] border-white/10 hover:border-[#00ff66]/40"
                      }`}
                    >
                      <div>
                        {/* Header: Avatar, Name, Status Badge */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={dev.avatar_url}
                              alt={dev.developer_name}
                              className={`w-11 h-11 rounded-xl object-cover ring-2 ${
                                isQuitted
                                  ? "ring-red-500/40 grayscale"
                                  : isCritical
                                  ? "ring-red-400"
                                  : "ring-[#00ff66]/50"
                              }`}
                            />
                            <div className="min-w-0">
                              <h3 className="text-sm font-bold text-white truncate flex items-center gap-1.5">
                                @{dev.developer_name}
                                {dev.is_dominant && (
                                  <span className="text-[10px] px-1 py-0.2 rounded bg-[#ffb000]/20 text-[#ffb000] border border-[#ffb000]/40 font-mono">
                                    LEAD
                                  </span>
                                )}
                              </h3>
                              <div className="text-[11px] text-slate-400 truncate font-sans">{dev.role}</div>
                              <div className="text-[10px] text-slate-500 truncate font-mono">{dev.email}</div>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div className="shrink-0 text-right">
                            {isQuitted ? (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 font-bold inline-block">
                                QUITTED
                              </span>
                            ) : (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00ff66]/20 text-[#00ff66] border border-[#00ff66]/40 font-bold inline-block">
                                ACTIVE
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Telemetry Stats: Concentration & Commits */}
                        <div className="grid grid-cols-2 gap-2 my-3 p-2.5 rounded-xl bg-black/40 border border-white/5 text-xs">
                          <div>
                            <div className="text-[10px] text-slate-500 uppercase font-sans">Concentration</div>
                            <div className={`font-bold ${isCritical ? "text-red-400" : isHigh ? "text-amber-400" : "text-[#00ff66]"}`}>
                              {dev.knowledge_percentage}%
                              <span className="text-[9px] ml-1 font-mono uppercase text-slate-400">({dev.risk_level})</span>
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] text-slate-500 uppercase font-sans">Commits Analyzed</div>
                            <div className="font-bold text-slate-200">{dev.commits_count} commits</div>
                          </div>
                        </div>

                        {/* Owned Features */}
                        <div className="mb-3">
                          <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-sans">
                            Assigned Features ({dev.owned_features?.length || 0})
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {dev.owned_features && dev.owned_features.length > 0 ? (
                              dev.owned_features.map((feat) => (
                                <span
                                  key={feat}
                                  className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10 truncate max-w-[200px]"
                                  title={feat}
                                >
                                  {feat}
                                </span>
                              ))
                            ) : (
                              <span className="text-[10px] text-slate-500 italic">No dominant features</span>
                            )}
                          </div>
                        </div>

                        {/* Domain Tags */}
                        <div className="mb-4">
                          <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-sans">
                            Domain Expertise
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {(dev.top_domains || []).map((dom) => (
                              <span
                                key={dom}
                                className="text-[9px] px-1.5 py-0.5 rounded bg-[#00e5ff]/10 text-[#00e5ff] border border-[#00e5ff]/20 font-sans"
                              >
                                {dom}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                        {isQuitted ? (
                          <button
                            onClick={() => handleReinstate(dev.developer_name)}
                            disabled={isProcessingAction}
                            className="flex-1 py-1.5 px-3 rounded-lg bg-[#00ff66]/10 border border-[#00ff66]/40 hover:bg-[#00ff66] hover:text-black text-[#00ff66] text-xs font-bold transition flex items-center justify-center gap-1.5"
                          >
                            <UserCheck className="h-3.5 w-3.5" />
                            Reinstate Developer
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => setOffboardTargetDev(dev)}
                              disabled={isProcessingAction}
                              className="flex-1 py-1.5 px-2.5 rounded-lg bg-red-500/10 border border-red-500/30 hover:bg-red-500 hover:text-white text-red-400 text-[11px] font-bold transition flex items-center justify-center gap-1"
                              title="Quit or Offboard developer and trigger smart successor assignment"
                            >
                              <UserMinus className="h-3.5 w-3.5" />
                              Quit / Offboard
                            </button>

                            <button
                              onClick={() => handleRunSimulation(dev)}
                              disabled={isProcessingAction}
                              className="py-1.5 px-2.5 rounded-lg bg-[#ffb000]/10 border border-[#ffb000]/30 hover:bg-[#ffb000] hover:text-black text-[#ffb000] text-[11px] font-bold transition flex items-center justify-center gap-1"
                              title="Simulate departure preview without saving"
                            >
                              <Sparkles className="h-3.5 w-3.5" />
                              Simulate
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => onNavigateToDeveloper(dev.developer_name.toLowerCase())}
                          className="p-1.5 rounded-lg bg-slate-900 border border-white/10 hover:border-[#00e5ff] text-slate-400 hover:text-[#00e5ff] transition"
                          title="Inspect deep telemetry profile"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: SUCCESSION MATRIX ================= */}
        {activeTab === "succession" && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-[#0c0e16] border border-[#ffb000]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Award className="h-4 w-4 text-[#ffb000]" />
                  Active Feature Succession & Bus Factor Mitigations
                </h2>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  When a developer quits, the smart scoring algorithm analyzes remaining candidates' direct commit touch, file overlap, domain affinity, and workload capacity to automatically assign the best successor.
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <span className="text-xs font-mono text-[#00ff66] px-2.5 py-1 rounded-lg bg-[#00ff66]/10 border border-[#00ff66]/30">
                  {teamData?.recent_assignments?.length || 0} Reassignments Active
                </span>
              </div>
            </div>

            {/* Assignments List */}
            {teamData?.recent_assignments && teamData.recent_assignments.length > 0 ? (
              <div className="space-y-5">
                {teamData.recent_assignments.map((assignment) => (
                  <div
                    key={assignment.feature_id}
                    className="p-5 rounded-2xl bg-[#0c0e16] border border-white/10 shadow-xl space-y-4"
                  >
                    {/* Header: Feature Details + Previous Owner */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#00e5ff] uppercase tracking-wider">
                            {assignment.category}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            ID: {assignment.feature_id}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white mt-0.5">
                          {assignment.feature_name}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-400 font-sans">Departed Owner:</span>
                        <span className="text-red-400 line-through font-bold">
                          @{assignment.previous_owner}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
                        <span className="text-[#00ff66] font-bold">
                          @{assignment.assigned_successor}
                        </span>
                      </div>
                    </div>

                    {/* Successor Recommendation Card */}
                    <div className="p-4 rounded-xl bg-[#090b10] border border-[#00ff66]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={assignment.successor_avatar || `https://ui-avatars.com/api/?name=${assignment.assigned_successor}&background=0c0f18&color=00ff66`}
                          alt={assignment.assigned_successor}
                          className="w-12 h-12 rounded-xl object-cover ring-2 ring-[#00ff66]"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">
                              @{assignment.assigned_successor}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00ff66]/20 text-[#00ff66] border border-[#00ff66]/40 font-bold">
                              {assignment.is_manual_override ? "MANUAL OVERRIDE" : "RECOMMENDED SUCCESSOR"}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 font-sans mt-1 max-w-xl">
                            {assignment.rationale}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right">
                          <div className="text-[10px] text-slate-400 uppercase font-sans">Suitability Score</div>
                          <div className="text-2xl font-black text-[#00ff66]">
                            {assignment.successor_score}%
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setOverrideModalTarget(assignment);
                            setOverrideSelectedDev(assignment.assigned_successor);
                          }}
                          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-[#ffb000] text-slate-300 hover:text-[#ffb000] text-xs font-bold transition flex items-center gap-1.5"
                        >
                          <SlidersHorizontal className="h-3.5 w-3.5" />
                          Change Successor
                        </button>
                      </div>
                    </div>

                    {/* Top Scored Candidates Breakdown Table */}
                    {assignment.top_candidates && assignment.top_candidates.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                          <span>Scoring Breakdown Across Candidates</span>
                          <span className="text-[10px] font-normal text-slate-500 font-sans">
                            Evaluated against 4 criteria: Direct Touch, File Overlap, Domain Affinity, Workload
                          </span>
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-white/5">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-[#090b10] text-slate-400 font-semibold border-b border-white/5 text-[11px]">
                              <tr>
                                <th className="p-2.5 pl-3">Rank & Candidate</th>
                                <th className="p-2.5">Total Score</th>
                                <th className="p-2.5">Direct Experience (/35)</th>
                                <th className="p-2.5">File Overlap (/25)</th>
                                <th className="p-2.5">Domain Fit (/25)</th>
                                <th className="p-2.5">Availability (/15)</th>
                                <th className="p-2.5 text-right pr-3">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 bg-[#0c0e16]/60">
                              {assignment.top_candidates.map((cand) => (
                                <tr key={cand.developer_name} className="hover:bg-white/5 transition">
                                  <td className="p-2.5 pl-3 flex items-center gap-2">
                                    <span className="text-[10px] font-mono text-slate-500 w-4">#{cand.rank}</span>
                                    <span className="font-bold text-white">@{cand.developer_name}</span>
                                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-sans uppercase font-bold ${
                                      cand.match_tier === "EXCELLENT MATCH"
                                        ? "bg-[#00ff66]/10 text-[#00ff66]"
                                        : cand.match_tier === "STRONG CANDIDATE"
                                        ? "bg-[#00e5ff]/10 text-[#00e5ff]"
                                        : "bg-amber-500/10 text-amber-400"
                                    }`}>
                                      {cand.match_tier}
                                    </span>
                                  </td>
                                  <td className="p-2.5 font-bold text-[#00ff66]">
                                    {cand.total_score}%
                                  </td>
                                  <td className="p-2.5 text-slate-300 font-mono">
                                    {cand.direct_experience_score}
                                  </td>
                                  <td className="p-2.5 text-slate-300 font-mono">
                                    {cand.file_overlap_score}
                                  </td>
                                  <td className="p-2.5 text-slate-300 font-mono">
                                    {cand.domain_affinity_score}
                                  </td>
                                  <td className="p-2.5 text-slate-300 font-mono">
                                    {cand.availability_score}
                                  </td>
                                  <td className="p-2.5 text-right pr-3">
                                    {cand.developer_name.toLowerCase() === assignment.assigned_successor.toLowerCase() ? (
                                      <span className="text-[10px] text-[#00ff66] font-bold">Assigned</span>
                                    ) : (
                                      <button
                                        onClick={() => {
                                          setOverrideModalTarget(assignment);
                                          setOverrideSelectedDev(cand.developer_name);
                                        }}
                                        className="text-[10px] py-1 px-2.5 rounded bg-slate-800 hover:bg-[#00e5ff] hover:text-black text-slate-300 transition font-bold"
                                      >
                                        Assign
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center border border-white/5 rounded-2xl bg-[#0c0e16] p-8 space-y-3">
                <CheckCircle2 className="h-10 w-10 text-[#00ff66] mx-auto" />
                <h3 className="text-base font-bold text-white">No Orphaned Features Detected</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto font-sans">
                  All features currently have active lead maintainers. If a developer departs or is removed, this engine will automatically compute suitable replacements.
                </p>
                <button
                  onClick={() => setActiveTab("roster")}
                  className="mt-2 px-4 py-2 rounded-xl bg-[#00ff66]/10 border border-[#00ff66]/40 text-[#00ff66] text-xs font-bold hover:bg-[#00ff66] hover:text-black transition inline-flex items-center gap-1.5"
                >
                  <Users className="h-3.5 w-3.5" />
                  View Developer Roster to Test Offboarding
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ================= MODAL: OFFBOARD CONFIRMATION ================= */}
      {offboardTargetDev && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#0f131f] border border-red-500/40 p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
                  <UserMinus className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Offboard Developer: @{offboardTargetDev.developer_name}
                  </h3>
                  <p className="text-xs text-slate-400 font-sans">
                    Execute departure & automated knowledge succession.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOffboardTargetDev(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 space-y-1 font-sans">
              <div className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
                Knowledge Concentration Warning
              </div>
              <p>
                @{offboardTargetDev.developer_name} currently holds <span className="font-bold text-white">{offboardTargetDev.knowledge_percentage}%</span> of repository knowledge across <span className="font-bold text-white">{offboardTargetDev.owned_features?.length || 0}</span> features.
              </p>
            </div>

            <div>
              <label className="text-xs text-slate-400 font-sans block mb-1.5">
                Departure Notes / Reason (Optional):
              </label>
              <input
                type="text"
                value={offboardReason}
                onChange={(e) => setOffboardReason(e.target.value)}
                placeholder="e.g. Resigned from team, transferred to mobile team..."
                className="w-full bg-[#08090d] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500/60"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => setOffboardTargetDev(null)}
                disabled={isProcessingAction}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmOffboard}
                disabled={isProcessingAction}
                className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold shadow-lg shadow-red-950 transition flex items-center gap-2"
              >
                {isProcessingAction ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <UserMinus className="h-3.5 w-3.5" />
                )}
                Confirm Offboard & Reassign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: SIMULATION PREVIEW ================= */}
      {simulatingDev && simulationData && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-[#0f131f] border border-[#ffb000]/40 p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#ffb000]/20 text-[#ffb000] border border-[#ffb000]/30">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Simulated Departure Preview: @{simulatingDev.developer_name}
                  </h3>
                  <p className="text-xs text-slate-400 font-sans">
                    Hypothetical succession plan calculated from local database telemetry (No changes saved).
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSimulatingDev(null);
                  setSimulationData(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {simulationData.map((sim) => (
                <div key={sim.feature_id} className="p-4 rounded-xl bg-[#08090d] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#00e5ff] font-bold uppercase">{sim.category}</span>
                      <h4 className="text-sm font-bold text-white">{sim.feature_name}</h4>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-500 font-sans">Assigned Successor</div>
                      <div className="text-sm font-bold text-[#00ff66]">@{sim.assigned_successor} ({sim.successor_score}%)</div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 font-sans italic bg-white/5 p-2 rounded-lg">
                    {sim.rationale}
                  </p>

                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-slate-400 uppercase font-sans">Top Ranked Candidates:</div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {sim.top_candidates?.map((c) => (
                        <div key={c.developer_name} className="p-2 rounded-lg bg-black/40 border border-white/5 text-xs">
                          <div className="font-bold text-white flex items-center justify-between">
                            <span>#{c.rank} @{c.developer_name}</span>
                            <span className="text-[#00ff66]">{c.total_score}%</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-sans truncate">{c.match_tier}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  setSimulatingDev(null);
                  setSimulationData(null);
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold hover:bg-slate-800 transition"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: MANUAL OVERRIDE ================= */}
      {overrideModalTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#0f131f] border border-[#00e5ff]/40 p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/30">
                  <SlidersHorizontal className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Manual Successor Assignment
                  </h3>
                  <p className="text-xs text-slate-400 font-sans truncate max-w-[240px]">
                    {overrideModalTarget.feature_name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOverrideModalTarget(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-sans block mb-1.5 font-bold">
                Select Successor Developer:
              </label>
              <select
                value={overrideSelectedDev}
                onChange={(e) => setOverrideSelectedDev(e.target.value)}
                className="w-full bg-[#08090d] border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#00e5ff]"
              >
                {(teamData?.developers || [])
                  .filter((d) => d.status !== "quitted")
                  .map((d) => (
                    <option key={d.developer_name} value={d.developer_name}>
                      @{d.developer_name} — {d.role} ({d.commits_count} commits)
                    </option>
                  ))}
              </select>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => setOverrideModalTarget(null)}
                disabled={isProcessingAction}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmOverride}
                disabled={isProcessingAction || !overrideSelectedDev}
                className="px-4 py-2 rounded-xl bg-[#00e5ff] hover:bg-[#00c8e0] text-black text-xs font-bold shadow-lg shadow-cyan-950 transition flex items-center gap-2"
              >
                {isProcessingAction ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                )}
                Save Assignment
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
