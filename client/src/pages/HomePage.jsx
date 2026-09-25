import { useEffect, useState, useCallback } from "react";

const API = "http://localhost:8000";

// ── Colour palette for avatars / charts ──────────────────────
const COLORS = ["#8b5cf6","#06b6d4","#f59e0b","#f43f5e","#10b981","#a78bfa","#22d3ee","#fbbf24"];
const avatar = (name, idx) => {
  const bg = COLORS[idx % COLORS.length];
  return (
    <div style={{
      width:28, height:28, borderRadius:"50%", background:bg, flexShrink:0,
      display:"flex", alignItems:"center", justifyContent:"center",
      fontSize:11, fontWeight:700, color:"#fff",
    }}>
      {name?.[0]?.toUpperCase() || "?"}
    </div>
  );
};

// ── Icons (inline SVG) ────────────────────────────────────────
const Icon = {
  github:  <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>,
  repo:    <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2}><path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>,
  doc:     <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  spark:   <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2}><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  user:    <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2}><circle cx={12} cy={8} r={4}/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
  logout:  <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1={21} y1={12} x2={9} y2={12}/></svg>,
  search:  <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2}><circle cx={11} cy={11} r={8}/><path d="M21 21l-4.35-4.35"/></svg>,
  lock:    <svg viewBox="0 0 24 24" width={11} height={11} fill="none" stroke="currentColor" strokeWidth={2}><rect x={3} y={11} width={18} height={11} rx={2}/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  globe:   <svg viewBox="0 0 24 24" width={11} height={11} fill="none" stroke="currentColor" strokeWidth={2}><circle cx={12} cy={12} r={10}/><path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20"/></svg>,
  plus:    <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="currentColor" strokeWidth={2}><line x1={12} y1={5} x2={12} y2={19}/><line x1={5} y1={12} x2={19} y2={12}/></svg>,
  chevron: <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="currentColor" strokeWidth={2}><polyline points="9 18 15 12 9 6"/></svg>,
  sun:     <svg viewBox="0 0 24 24" width={15} height={15} fill="none" stroke="currentColor" strokeWidth={2}><circle cx={12} cy={12} r={5}/><line x1={12} y1={1} x2={12} y2={3}/><line x1={12} y1={21} x2={12} y2={23}/><line x1={4.22} y1={4.22} x2={5.64} y2={5.64}/><line x1={18.36} y1={18.36} x2={19.78} y2={19.78}/><line x1={1} y1={12} x2={3} y2={12}/><line x1={21} y1={12} x2={23} y2={12}/><line x1={4.22} y1={19.78} x2={5.64} y2={18.36}/><line x1={18.36} y1={5.64} x2={19.78} y2={4.22}/></svg>,
  warn:    <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="currentColor" strokeWidth={2}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1={12} y1={9} x2={12} y2={13}/><line x1={12} y1={17} x2={12.01} y2={17}/></svg>,
};

// ── Category icon mapping ────────────────────────────────────
const CATEGORY_ICONS = {
  "Authentication":"🔐","Payment":"💳","Order Processing":"📦","User Management":"👤",
  "Product Catalog":"🛍️","Notifications":"🔔","Cart & Checkout":"🛒","Admin Panel":"⚙️",
  "UIFrontend":"🖥️","Frontend UI":"🖥️","Database":"🗄️","AI Pipeline":"🤖",
  "API":"⚡","Infrastructure":"🏗️","General":"📁",
};
const catIcon = (cat) => CATEGORY_ICONS[cat] || "📁";

// ── Risk badge ───────────────────────────────────────────────
const RiskBadge = ({ level }) => {
  const map = {
    CRITICAL:{ bg:"rgba(244,63,94,.18)", color:"#fb7185", label:"CRITICAL" },
    HIGH:    { bg:"rgba(245,158,11,.18)", color:"#fbbf24", label:"HIGH" },
    MEDIUM:  { bg:"rgba(139,92,246,.18)", color:"#a78bfa", label:"MEDIUM" },
    LOW:     { bg:"rgba(16,185,129,.18)", color:"#34d399", label:"LOW" },
  };
  const s = map[level] || map.LOW;
  return (
    <span style={{
      background:s.bg, color:s.color, border:`1px solid ${s.color}40`,
      borderRadius:99, padding:"2px 9px", fontSize:10, fontWeight:700,
      fontFamily:"var(--font-mono)", letterSpacing:.5,
    }}>{s.label}</span>
  );
};

// ── Donut chart (pure CSS/SVG) ──────────────────────────────
const DonutChart = ({ items, size = 88, thickness = 14, center }) => {
  const total = items.reduce((s, i) => s + i.value, 0) || 100;
  let offset = 0;
  const r = (size / 2) - thickness / 2;
  const circ = 2 * Math.PI * r;
  const segments = items.map(item => {
    const pct = (item.value / total);
    const dash = pct * circ;
    const gap  = circ - dash;
    const seg  = { ...item, dash, gap, offset: offset * circ };
    offset += pct;
    return seg;
  });
  return (
    <div style={{ position:"relative", width:size, height:size, flexShrink:0 }}>
      <svg width={size} height={size} style={{ transform:"rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={thickness} />
        {segments.map((seg, i) => (
          <circle key={i} cx={size/2} cy={size/2} r={r} fill="none"
            stroke={seg.color} strokeWidth={thickness}
            strokeDasharray={`${seg.dash} ${seg.gap}`}
            strokeDashoffset={-seg.offset}
            strokeLinecap="butt"
          />
        ))}
      </svg>
      {center && (
        <div style={{
          position:"absolute", inset:0, display:"flex", flexDirection:"column",
          alignItems:"center", justifyContent:"center", textAlign:"center",
        }}>
          {center}
        </div>
      )}
    </div>
  );
};

// ── Progress bar ────────────────────────────────────────────
const Bar = ({ value, color, max = 100 }) => (
  <div style={{ height:3, background:"rgba(255,255,255,.07)", borderRadius:99, overflow:"hidden", flex:1 }}>
    <div style={{ height:"100%", width:`${Math.min((value/max)*100, 100)}%`, background:color, borderRadius:99, transition:"width .8s ease" }} />
  </div>
);

// ── Sidebar ─────────────────────────────────────────────────
function Sidebar({ user, repos, selectedRepo, onSelectRepo, onLogout, onNavigate }) {
  const [repoSearch, setRepoSearch] = useState("");
  const filtered = repos.filter(r => r.toLowerCase().includes(repoSearch.toLowerCase()));
  const shortName = (full) => full.split("/")[1] || full;

  return (
    <div style={{
      width:210, minWidth:210, background:"var(--bg-panel)",
      borderRight:"1px solid var(--glass-border)",
      display:"flex", flexDirection:"column", overflow:"hidden", position:"relative",
    }}>
      {/* Top accent line */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,#8b5cf6,transparent)" }} />

      {/* Brand */}
      <div style={{
        padding:"16px 14px 14px",
        borderBottom:"1px solid var(--glass-border)",
        display:"flex", alignItems:"center", gap:10,
      }}>
        <div className="logo-glow" style={{
          width:30, height:30, background:"linear-gradient(135deg,#7c3aed,#8b5cf6)",
          borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0,
        }}>⊕</div>
        <span className="grad-brand" style={{ fontFamily:"var(--font-display)", fontSize:12, fontWeight:700, letterSpacing:1.5 }}>
          Commitology
        </span>
      </div>

      {/* User profile */}
      <div style={{ padding:"12px 14px", borderBottom:"1px solid var(--glass-border)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:9 }}>
          {user.avatar_url
            ? <img src={user.avatar_url} alt="" style={{ width:32, height:32, borderRadius:"50%", border:"2px solid rgba(139,92,246,.4)" }} />
            : <div style={{ width:32, height:32, borderRadius:"50%", background:"linear-gradient(135deg,#7c3aed,#06b6d4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"#fff" }}>{user.name?.[0] || user.username?.[0]}</div>
          }
          <div>
            <div style={{ fontSize:13, fontWeight:600, color:"var(--text-1)" }}>{user.name || user.username}</div>
            <div style={{ fontSize:10, color:"var(--text-3)", fontFamily:"var(--font-mono)" }}>{repos.length} repos</div>
          </div>
        </div>
      </div>

      {/* Repos header */}
      <div style={{ padding:"10px 14px 6px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <span style={{ fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", color:"var(--text-3)" }}>
          Repositories
        </span>
        <span style={{
          fontSize:10, background:"rgba(139,92,246,.15)", color:"#a78bfa",
          border:"1px solid rgba(139,92,246,.25)", borderRadius:99, padding:"1px 7px",
          fontFamily:"var(--font-mono)",
        }}>{repos.length}</span>
      </div>

      {/* Search repos */}
      <div style={{ padding:"0 10px 8px", position:"relative" }}>
        <input
          value={repoSearch}
          onChange={e => setRepoSearch(e.target.value)}
          placeholder="Search repos…"
          style={{
            width:"100%", background:"rgba(255,255,255,.04)", border:"1px solid var(--glass-border)",
            borderRadius:8, color:"var(--text-1)", fontFamily:"var(--font-body)", fontSize:12,
            padding:"6px 10px 6px 28px", outline:"none",
          }}
        />
        <span style={{ position:"absolute", left:18, top:"50%", transform:"translateY(-50%)", color:"var(--text-3)", display:"flex" }}>{Icon.search}</span>
      </div>

      {/* Repo list */}
      <div style={{ flex:1, overflowY:"auto", padding:"0 6px" }}>
        {filtered.length === 0 && (
          <div style={{ padding:"20px 10px", textAlign:"center", color:"var(--text-3)", fontSize:12 }}>No repos found</div>
        )}
        {filtered.map((repo, i) => {
          const name = shortName(repo);
          const active = repo === selectedRepo;
          return (
            <div key={repo} onClick={() => onSelectRepo(repo)} style={{
              display:"flex", alignItems:"center", gap:8, padding:"7px 10px",
              borderRadius:7, cursor:"pointer", marginBottom:1,
              background: active ? "rgba(139,92,246,.14)" : "transparent",
              border: active ? "1px solid rgba(139,92,246,.25)" : "1px solid transparent",
              transition:"all .15s",
            }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,.04)"; }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
            >
              {active && <div style={{ position:"absolute", left:6, width:2, height:20, background:"linear-gradient(180deg,#8b5cf6,#a78bfa)", borderRadius:1 }} />}
              {avatar(name, i)}
              <div style={{ flex:1, overflow:"hidden" }}>
                <div style={{ fontSize:12, fontWeight:500, color: active ? "#a78bfa" : "var(--text-1)", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{name}</div>
                <div style={{ fontSize:10, color:"var(--text-3)", display:"flex", alignItems:"center", gap:4 }}>
                  {Math.random() > .5 ? <><span style={{ color:"rgba(139,92,246,.6)" }}>{Icon.lock}</span>Private</> : <><span style={{ color:"rgba(34,197,94,.6)" }}>{Icon.globe}</span>Public</>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom actions */}
      <div style={{ padding:"10px 10px 14px", borderTop:"1px solid var(--glass-border)", display:"flex", flexDirection:"column", gap:4 }}>
        <button
          onClick={() => onNavigate("profile")}
          style={{
            display:"flex", alignItems:"center", gap:8, padding:"7px 10px",
            background:"transparent", border:"none", color:"var(--text-2)", fontSize:12,
            cursor:"pointer", borderRadius:7, transition:"all .15s", width:"100%", textAlign:"left",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,.05)"; e.currentTarget.style.color = "var(--text-1)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-2)"; }}
        >
          {Icon.user} Developer Profile
        </button>
        <button
          onClick={onLogout}
          style={{
            display:"flex", alignItems:"center", gap:8, padding:"7px 10px",
            background:"transparent", border:"none", color:"var(--text-3)", fontSize:12,
            cursor:"pointer", borderRadius:7, transition:"all .15s", width:"100%", textAlign:"left",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(244,63,94,.08)"; e.currentTarget.style.color = "#fb7185"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-3)"; }}
        >
          {Icon.logout} Logout
        </button>
      </div>
    </div>
  );
}

// ── Feature panel (middle) ────────────────────────────────────
function FeaturePanel({ repo, token, selectedFeature, onSelectFeature, onGenerateDoc }) {
  const [features, setFeatures]     = useState([]);
  const [loading, setLoading]       = useState(false);
  const [featureSearch, setFeatureSearch] = useState("");
  const [generated, setGenerated]   = useState(new Set());

  const categorize = useCallback(async () => {
    if (!repo || !token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/ai/features/categorize`, {
        method:"POST",
        headers:{ "Content-Type":"application/json", Authorization:`Bearer ${token}` },
        body: JSON.stringify({ repo, max_commits:50, include_knowledge_graph:true }),
        credentials:"include",
      });
      if (res.ok) {
        const data = await res.json();
        setFeatures(data.features || []);
        if (data.features?.length) onSelectFeature(data.features[0]);
      }
    } catch {}
    setLoading(false);
  }, [repo, token]);

  useEffect(() => { setFeatures([]); onSelectFeature(null); if (repo) categorize(); }, [repo]);

  const filtered = features.filter(f =>
    f.feature_name.toLowerCase().includes(featureSearch.toLowerCase()) ||
    f.category?.toLowerCase().includes(featureSearch.toLowerCase())
  );

  return (
    <div style={{ width:200, minWidth:200, borderRight:"1px solid var(--glass-border)", display:"flex", flexDirection:"column" }}>
      {/* Header */}
      <div style={{ padding:"12px 12px 8px", borderBottom:"1px solid var(--glass-border)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
          <span style={{ fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", color:"var(--text-3)" }}>Features</span>
          {features.length > 0 && (
            <span style={{
              fontSize:10, background:"rgba(6,182,212,.15)", color:"#22d3ee",
              border:"1px solid rgba(6,182,212,.25)", borderRadius:99, padding:"1px 7px",
              fontFamily:"var(--font-mono)",
            }}>{features.length}</span>
          )}
        </div>
        <div style={{ position:"relative" }}>
          <input
            value={featureSearch}
            onChange={e => setFeatureSearch(e.target.value)}
            placeholder="Search features…"
            style={{
              width:"100%", background:"rgba(255,255,255,.04)", border:"1px solid var(--glass-border)",
              borderRadius:7, color:"var(--text-1)", fontFamily:"var(--font-body)", fontSize:11,
              padding:"5px 9px 5px 26px", outline:"none",
            }}
          />
          <span style={{ position:"absolute", left:8, top:"50%", transform:"translateY(-50%)", color:"var(--text-3)", display:"flex" }}>{Icon.search}</span>
        </div>
      </div>

      {/* List */}
      <div style={{ flex:1, overflowY:"auto", padding:"6px" }}>
        {!repo && <div style={{ padding:"24px 10px", textAlign:"center", color:"var(--text-3)", fontSize:12 }}>Select a repo to analyse</div>}
        {repo && loading && (
          <div style={{ padding:"24px 10px", textAlign:"center" }}>
            <div style={{ width:24, height:24, border:"2px solid rgba(139,92,246,.2)", borderTop:"2px solid #8b5cf6", borderRadius:"50%", margin:"0 auto 8px" }} className="anim-spin" />
            <div style={{ fontSize:11, color:"var(--text-3)" }}>Analysing commits…</div>
          </div>
        )}
        {filtered.map((f, i) => {
          const active = selectedFeature?.feature_id === f.feature_id;
          return (
            <div key={f.feature_id} onClick={() => onSelectFeature(f)} style={{
              display:"flex", alignItems:"center", gap:8, padding:"8px 9px",
              borderRadius:7, cursor:"pointer", marginBottom:2,
              background: active ? "rgba(139,92,246,.12)" : "transparent",
              border: active ? "1px solid rgba(139,92,246,.22)" : "1px solid transparent",
              transition:"all .15s",
            }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.background="rgba(255,255,255,.03)"; }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.background="transparent"; }}
            >
              <div style={{
                width:26, height:26, borderRadius:6, flexShrink:0,
                background: active ? "rgba(139,92,246,.2)" : "rgba(255,255,255,.05)",
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:12,
              }}>
                {catIcon(f.category)}
              </div>
              <div style={{ flex:1, overflow:"hidden" }}>
                <div style={{
                  fontSize:11, fontWeight:500, color: active ? "#a78bfa" : "var(--text-1)",
                  whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis",
                }}>{f.feature_name}</div>
                <div style={{ fontSize:10, color:"var(--text-3)" }}>
                  {f.commit_count} commits
                  {f.knowledge_graph?.risk_level && f.knowledge_graph.risk_level !== "LOW" && (
                    <span style={{ marginLeft:4, color: f.knowledge_graph.risk_level === "HIGH" || f.knowledge_graph.risk_level === "CRITICAL" ? "#fbbf24" : "#a78bfa" }}>
                      ⚠
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Overview panel (right) ─────────────────────────────────────
function OverviewPanel({ repo, token, feature, onNavigate }) {
  const [generating, setGenerating] = useState(false);
  const [docResult,  setDocResult]  = useState(null);

  useEffect(() => { setDocResult(null); }, [feature?.feature_id]);

  const generateDoc = async () => {
    if (!feature || generating) return;
    setGenerating(true);
    try {
      const res = await fetch(`${API}/ai/features/generate-doc`, {
        method:"POST",
        headers:{ "Content-Type":"application/json", Authorization:`Bearer ${token}` },
        body: JSON.stringify({
          repo,
          feature_id:      feature.feature_id,
          feature_name:    feature.feature_name,
          feature_summary: feature.summary,
          commit_shas:     feature.commit_shas,
        }),
        credentials:"include",
      });
      if (res.ok) {
        const data = await res.json();
        setDocResult(data);
      }
    } catch {}
    setGenerating(false);
  };

  if (!feature) {
    return (
      <div style={{
        flex:1, display:"flex", alignItems:"center", justifyContent:"center",
        flexDirection:"column", gap:16, color:"var(--text-3)",
      }}>
        <div style={{ fontSize:48, opacity:.3 }}>📂</div>
        <div style={{ fontSize:14, fontWeight:500 }}>Select a feature to preview</div>
        <div style={{ fontSize:12, color:"var(--text-3)" }}>Choose from the features panel</div>
      </div>
    );
  }

  const kg = feature.knowledge_graph;
  const devs = kg?.developers?.slice(0,4) || [];
  const donutItems = devs.map(d => ({ value: d.knowledge_percentage, color: d.color || COLORS[devs.indexOf(d) % COLORS.length] }));

  return (
    <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* Feature header */}
      <div style={{
        padding:"16px 22px 14px",
        borderBottom:"1px solid var(--glass-border)",
        display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:16,
      }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
            <span style={{ fontSize:18 }}>{catIcon(feature.category)}</span>
            <h2 style={{ fontSize:17, fontWeight:700, color:"var(--text-1)" }}>{feature.feature_name}</h2>
          </div>
          <p style={{ fontSize:12, color:"var(--text-2)", lineHeight:1.6, maxWidth:480 }}>{feature.summary}</p>
          <div style={{ display:"flex", gap:8, marginTop:8, flexWrap:"wrap" }}>
            <span style={{ fontSize:10, background:"rgba(139,92,246,.14)", color:"#a78bfa", border:"1px solid rgba(139,92,246,.28)", borderRadius:99, padding:"2px 9px", fontFamily:"var(--font-mono)" }}>{feature.category}</span>
            <span style={{ fontSize:10, background:"rgba(6,182,212,.14)", color:"#22d3ee", border:"1px solid rgba(6,182,212,.28)", borderRadius:99, padding:"2px 9px", fontFamily:"var(--font-mono)" }}>{feature.commit_count} commits</span>
            {kg && <RiskBadge level={kg.risk_level} />}
          </div>
        </div>

        <div style={{ display:"flex", gap:8, flexShrink:0 }}>
          {docResult && (
            <button onClick={() => onNavigate("doc", { doc: docResult, feature })}
              style={{
                display:"flex", alignItems:"center", gap:6, padding:"8px 14px",
                background:"rgba(16,185,129,.12)", border:"1px solid rgba(16,185,129,.3)",
                borderRadius:8, color:"#34d399", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"var(--font-body)",
              }}>
              {Icon.doc} View Docs
            </button>
          )}
          <button
            id="generate-doc-btn"
            onClick={generateDoc}
            disabled={generating}
            style={{
              display:"flex", alignItems:"center", gap:6, padding:"8px 16px",
              background: generating ? "rgba(139,92,246,.08)" : "linear-gradient(135deg,#7c3aed,#8b5cf6)",
              border:"1px solid rgba(139,92,246,.4)",
              borderRadius:8, color:"#fff", fontSize:12, fontWeight:600, cursor: generating ? "not-allowed" : "pointer",
              fontFamily:"var(--font-body)",
              boxShadow: generating ? "none" : "0 4px 18px rgba(139,92,246,.35)",
              transition:"all .2s",
            }}
          >
            {generating
              ? <><div style={{ width:12, height:12, border:"1.5px solid rgba(255,255,255,.3)", borderTop:"1.5px solid white", borderRadius:"50%" }} className="anim-spin" />Generating…</>
              : <>{Icon.spark} Generate Documentation</>
            }
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ padding:"0 22px", borderBottom:"1px solid var(--glass-border)", display:"flex", gap:4 }}>
        {["Overview", `Files (${feature.primary_files_hint?.length || 0})`, `Commits (${feature.commit_count})`, "Knowledge"].map((t, i) => (
          <div key={t} style={{
            padding:"10px 14px", fontSize:12, fontWeight:500, cursor:"pointer",
            color: i === 0 ? "#a78bfa" : "var(--text-3)",
            borderBottom: i === 0 ? "2px solid #8b5cf6" : "2px solid transparent",
            transition:"all .15s",
          }}>{t}</div>
        ))}
      </div>

      {/* Content area */}
      <div style={{ flex:1, overflowY:"auto", padding:"20px 22px", display:"flex", flexDirection:"column", gap:20 }}>

        {/* Knowledge / Contributors section */}
        {kg && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            {/* Contributor distribution */}
            <div style={{
              background:"var(--bg-card)", border:"1px solid var(--glass-border)",
              borderRadius:12, padding:"16px",
            }}>
              <div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:1, color:"var(--text-3)", marginBottom:14 }}>
                Contribution Distribution
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                <DonutChart
                  items={donutItems}
                  size={82}
                  thickness={12}
                  center={
                    <div>
                      <div style={{ fontSize:15, fontWeight:700, fontFamily:"var(--font-mono)", color:"var(--text-1)" }}>{kg.total_commits}</div>
                      <div style={{ fontSize:9, color:"var(--text-3)" }}>Commits</div>
                    </div>
                  }
                />
                <div style={{ flex:1 }}>
                  {devs.map((d, i) => (
                    <div key={d.developer} style={{ display:"flex", alignItems:"center", gap:7, marginBottom:6 }}>
                      <div style={{ width:7, height:7, borderRadius:"50%", background: d.color || COLORS[i % COLORS.length], flexShrink:0 }} />
                      <div style={{ fontSize:11, color:"var(--text-2)", flex:1, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{d.developer}</div>
                      <div style={{ fontSize:11, fontFamily:"var(--font-mono)", color:"var(--text-1)", fontWeight:600 }}>
                        {d.knowledge_percentage?.toFixed(0)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Risk analysis */}
            <div style={{
              background:"var(--bg-card)", border:"1px solid var(--glass-border)",
              borderRadius:12, padding:"16px",
            }}>
              <div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:1, color:"var(--text-3)", marginBottom:10 }}>
                Risk Analysis
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:12, color:"var(--text-2)" }}>Risk Level</span>
                  <RiskBadge level={kg.risk_level} />
                </div>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <span style={{ fontSize:12, color:"var(--text-2)" }}>Bus Factor</span>
                  <span style={{ fontSize:12, fontFamily:"var(--font-mono)", color:"var(--text-1)", fontWeight:600 }}>{kg.bus_factor}</span>
                </div>
                {kg.dominant_developer && (
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <span style={{ fontSize:12, color:"var(--text-2)" }}>Dominant Dev</span>
                    <span style={{ fontSize:12, color:"#a78bfa", fontWeight:500 }}>@{kg.dominant_developer}</span>
                  </div>
                )}
                <div style={{
                  marginTop:4, padding:"8px 10px",
                  background:"rgba(245,158,11,.08)", border:"1px solid rgba(245,158,11,.2)",
                  borderRadius:7, fontSize:11, color:"#fbbf24", lineHeight:1.5,
                }}>
                  {Icon.warn} {kg.risk_summary?.slice(0,100)}{kg.risk_summary?.length > 100 ? "…" : ""}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Files */}
        {feature.primary_files_hint?.length > 0 && (
          <div style={{ background:"var(--bg-card)", border:"1px solid var(--glass-border)", borderRadius:12, padding:"14px 16px" }}>
            <div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:1, color:"var(--text-3)", marginBottom:10 }}>
              Primary Files
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
              {feature.primary_files_hint.slice(0, 8).map((f, i) => (
                <div key={i} style={{
                  display:"flex", alignItems:"center", gap:8, padding:"5px 8px",
                  background:"rgba(255,255,255,.03)", borderRadius:6,
                  fontFamily:"var(--font-mono)", fontSize:11, color:"var(--text-2)",
                }}>
                  <span style={{ color:"rgba(139,92,246,.6)" }}>📄</span>
                  {f}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stat cards */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
          {[
            { label:"Files",    value: feature.primary_files_hint?.length || 0,  color:"#a78bfa", sub:"Modified files" },
            { label:"Commits",  value: feature.commit_count,                      color:"#22d3ee", sub:"Total commits" },
            { label:"Risk",     value: kg?.risk_level || "N/A",                   color: kg?.risk_level === "HIGH" || kg?.risk_level === "CRITICAL" ? "#fbbf24" : "#34d399", sub:"Knowledge risk" },
            { label:"Bus Factor",value: kg?.bus_factor || 1,                       color:"#fb7185", sub:"Min. bus factor" },
          ].map(s => (
            <div key={s.label} style={{
              background:"var(--bg-card)", border:"1px solid var(--glass-border)",
              borderRadius:10, padding:"12px 14px",
              transition:"all .2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(139,92,246,.3)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--glass-border)"; e.currentTarget.style.transform = "none"; }}
            >
              <div style={{ fontSize:10, color:"var(--text-3)", textTransform:"uppercase", letterSpacing:1, marginBottom:5 }}>{s.label}</div>
              <div style={{ fontSize:20, fontWeight:700, fontFamily:"var(--font-mono)", color:s.color }}>{s.value}</div>
              <div style={{ fontSize:10, color:"var(--text-3)", marginTop:2 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── HomePage ────────────────────────────────────────────────────
export default function HomePage({ user, token, onLogout, onNavigate }) {
  const [repos, setRepos]         = useState([]);
  const [reposLoading, setReposLoading] = useState(true);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);

  useEffect(() => {
    if (!token) return;
    fetch(`${API}/github/repos`, {
      headers:{ Authorization:`Bearer ${token}` },
      credentials:"include",
    })
      .then(r => r.ok ? r.json() : [])
      .then(data => setRepos(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setReposLoading(false));
  }, [token]);

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden", fontFamily:"var(--font-body)" }}>
      {/* Sidebar */}
      <Sidebar
        user={user}
        repos={repos}
        selectedRepo={selectedRepo}
        onSelectRepo={setSelectedRepo}
        onLogout={onLogout}
        onNavigate={onNavigate}
      />

      {/* Features panel */}
      <FeaturePanel
        repo={selectedRepo}
        token={token}
        selectedFeature={selectedFeature}
        onSelectFeature={setSelectedFeature}
        onGenerateDoc={() => {}}
      />

      {/* Main content */}
      <div style={{ flex:1, background:"var(--bg-secondary)", display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {/* Topbar */}
        <div style={{
          height:50, background:"var(--bg-panel)", borderBottom:"1px solid var(--glass-border)",
          display:"flex", alignItems:"center", padding:"0 18px", gap:12, flexShrink:0,
        }}>
          {/* Breadcrumb */}
          <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"var(--text-3)" }}>
            <span style={{ color:"#a78bfa", fontWeight:500 }}>Commitology</span>
            {selectedRepo && <><span>›</span><span style={{ color:"var(--text-2)" }}>{selectedRepo.split("/")[1]}</span></>}
            {selectedFeature && <><span>›</span><span style={{ color:"var(--text-1)", fontWeight:500 }}>{selectedFeature.feature_name}</span></>}
          </div>

          <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:10 }}>
            {/* Theme toggle placeholder */}
            <button style={{
              width:30, height:30, display:"flex", alignItems:"center", justifyContent:"center",
              background:"rgba(255,255,255,.04)", border:"1px solid var(--glass-border)",
              borderRadius:7, color:"var(--text-2)", cursor:"pointer",
            }}>{Icon.sun}</button>
            {/* Avatar */}
            {user.avatar_url
              ? <img src={user.avatar_url} alt="" style={{ width:30, height:30, borderRadius:"50%", border:"2px solid rgba(139,92,246,.4)", cursor:"pointer" }} onClick={() => onNavigate("profile")} />
              : <div onClick={() => onNavigate("profile")} style={{ width:30, height:30, borderRadius:"50%", background:"linear-gradient(135deg,#7c3aed,#06b6d4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:"#fff", cursor:"pointer" }}>{user.name?.[0]||user.username?.[0]}</div>
            }
          </div>
        </div>

        {/* Main scrollable */}
        <div style={{ flex:1, overflowY:"auto" }}>
          {reposLoading ? (
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100%", flexDirection:"column", gap:12 }}>
              <div style={{ width:32, height:32, border:"2.5px solid rgba(139,92,246,.2)", borderTop:"2.5px solid #8b5cf6", borderRadius:"50%" }} className="anim-spin" />
              <p style={{ color:"var(--text-3)", fontSize:13, fontFamily:"var(--font-mono)" }}>Loading repositories…</p>
            </div>
          ) : !selectedRepo ? (
            /* Welcome screen */
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100%", flexDirection:"column", gap:20 }}>
              <div className="anim-float" style={{ fontSize:64, filter:"drop-shadow(0 0 24px rgba(139,92,246,.4))" }}>⊕</div>
              <div style={{ textAlign:"center" }}>
                <h1 className="grad-violet" style={{ fontFamily:"var(--font-display)", fontSize:24, fontWeight:700, marginBottom:8 }}>
                  Select a Repository
                </h1>
                <p style={{ color:"var(--text-2)", fontSize:14, maxWidth:340 }}>
                  Choose a repository from the sidebar to begin AI-powered feature analysis and documentation generation.
                </p>
              </div>
              <div style={{ display:"flex", gap:16, marginTop:8 }}>
                {[
                  { icon:"🤖", label:"AI Analysis",      desc:"Cluster commits into features" },
                  { icon:"📄", label:"Auto Docs",         desc:"Generate structured markdown" },
                  { icon:"🧠", label:"Knowledge Graph",   desc:"Visualize contributor risk" },
                ].map(card => (
                  <div key={card.label} style={{
                    background:"var(--bg-card)", border:"1px solid var(--glass-border)",
                    borderRadius:12, padding:"16px 18px", textAlign:"center", width:140,
                    transition:"all .2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(139,92,246,.3)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--glass-border)"; e.currentTarget.style.transform = "none"; }}
                  >
                    <div style={{ fontSize:28, marginBottom:8 }}>{card.icon}</div>
                    <div style={{ fontSize:12, fontWeight:600, color:"var(--text-1)", marginBottom:4 }}>{card.label}</div>
                    <div style={{ fontSize:11, color:"var(--text-3)" }}>{card.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <OverviewPanel
              repo={selectedRepo}
              token={token}
              feature={selectedFeature}
              onNavigate={onNavigate}
            />
          )}
        </div>
      </div>
    </div>
  );
}
