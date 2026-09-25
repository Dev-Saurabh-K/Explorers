import { useEffect, useState } from "react";

const API = "http://localhost:8000";
const COLORS = ["#8b5cf6","#06b6d4","#f59e0b","#f43f5e","#10b981","#a78bfa","#22d3ee","#fbbf24"];

// ── Donut chart ──────────────────────────────────────────────
const DonutChart = ({ items, size = 100, thickness = 16, center }) => {
  const total = items.reduce((s, i) => s + (i.value || 0), 0) || 100;
  let offset = 0;
  const r = size/2 - thickness/2;
  const circ = 2*Math.PI*r;
  const segments = items.map(item => {
    const pct = item.value / total;
    const seg = { ...item, dash: pct*circ, gap: circ - pct*circ, offset: offset*circ };
    offset += pct;
    return seg;
  });
  return (
    <div style={{ position:"relative", width:size, height:size, flexShrink:0 }}>
      <svg width={size} height={size} style={{ transform:"rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={thickness} />
        {segments.map((seg, i) => (
          <circle key={i} cx={size/2} cy={size/2} r={r} fill="none"
            stroke={seg.color} strokeWidth={thickness}
            strokeDasharray={`${seg.dash} ${seg.gap}`}
            strokeDashoffset={-seg.offset}
          />
        ))}
      </svg>
      {center && (
        <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center" }}>
          {center}
        </div>
      )}
    </div>
  );
};

const RiskBadge = ({ level }) => {
  const map = {
    CRITICAL:{ bg:"rgba(244,63,94,.18)", color:"#fb7185" },
    HIGH:    { bg:"rgba(245,158,11,.18)", color:"#fbbf24" },
    MEDIUM:  { bg:"rgba(139,92,246,.18)", color:"#a78bfa" },
    LOW:     { bg:"rgba(16,185,129,.18)", color:"#34d399" },
  };
  const s = map[level] || map.LOW;
  return (
    <span style={{
      background:s.bg, color:s.color, border:`1px solid ${s.color}40`,
      borderRadius:99, padding:"2px 9px", fontSize:10, fontWeight:700, fontFamily:"var(--font-mono)",
    }}>{level || "LOW"}</span>
  );
};

const TABS_PROFILE = ["Overview","Contributions","Knowledge Map","Documentation Gaps"];

export default function ProfilePage({ user, token, onLogout, onNavigate }) {
  const [repos, setRepos]     = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");

  useEffect(() => {
    if (!token) return;
    fetch(`${API}/github/repos`, {
      headers:{ Authorization:`Bearer ${token}` },
      credentials:"include",
    })
      .then(r => r.ok ? r.json() : [])
      .then(data => { const arr = Array.isArray(data) ? data : []; setRepos(arr); if (arr[0]) setSelectedRepo(arr[0]); })
      .catch(() => {});
  }, [token]);

  useEffect(() => {
    if (!selectedRepo || !token) return;
    setLoading(true);
    fetch(`${API}/ai/features/categorize`, {
      method:"POST",
      headers:{ "Content-Type":"application/json", Authorization:`Bearer ${token}` },
      body: JSON.stringify({ repo:selectedRepo, max_commits:50, include_knowledge_graph:true }),
      credentials:"include",
    })
      .then(r => r.ok ? r.json() : { features:[] })
      .then(data => setFeatures(data.features || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedRepo, token]);

  // Aggregate developer stats across features
  const devStats = {};
  features.forEach(f => {
    (f.knowledge_graph?.developers || []).forEach(d => {
      if (!devStats[d.developer]) {
        devStats[d.developer] = { developer:d.developer, avatar_url:d.avatar_url, total_commits:0, areas:[], knowledge_sum:0, count:0, color:d.color };
      }
      devStats[d.developer].total_commits += d.commit_count;
      devStats[d.developer].knowledge_sum += d.knowledge_percentage;
      devStats[d.developer].count += 1;
      if (!devStats[d.developer].areas.includes(f.feature_name)) devStats[d.developer].areas.push(f.feature_name);
    });
  });
  const developers = Object.values(devStats)
    .map(d => ({ ...d, avg_knowledge: d.count ? d.knowledge_sum / d.count : 0 }))
    .sort((a,b) => b.total_commits - a.total_commits);

  const topDev = developers[0];
  const totalCommits = developers.reduce((s, d) => s + d.total_commits, 0);

  // Risk assessment
  const highRiskFeatures = features.filter(f => f.knowledge_graph?.risk_level === "HIGH" || f.knowledge_graph?.risk_level === "CRITICAL");

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden", fontFamily:"var(--font-body)" }}>
      {/* Sidebar */}
      <div style={{ width:200, minWidth:200, background:"var(--bg-panel)", borderRight:"1px solid var(--glass-border)", display:"flex", flexDirection:"column" }}>
        {/* Brand */}
        <div style={{ padding:"16px 14px 14px", borderBottom:"1px solid var(--glass-border)", display:"flex", alignItems:"center", gap:10 }}>
          <div className="logo-glow" style={{ width:30, height:30, background:"linear-gradient(135deg,#7c3aed,#8b5cf6)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, flexShrink:0 }}>⊕</div>
          <span className="grad-brand" style={{ fontFamily:"var(--font-display)", fontSize:12, fontWeight:700, letterSpacing:1.5 }}>Commitology</span>
        </div>

        <button onClick={() => onNavigate("home")} style={{
          display:"flex", alignItems:"center", gap:8, padding:"10px 14px", marginTop:8,
          background:"transparent", border:"none", color:"var(--text-2)", fontSize:12,
          cursor:"pointer", transition:"all .15s", borderLeft:"3px solid transparent",
        }}
        onMouseEnter={e => { e.currentTarget.style.color="#a78bfa"; e.currentTarget.style.borderLeftColor="#8b5cf6"; e.currentTarget.style.background="rgba(139,92,246,.08)"; }}
        onMouseLeave={e => { e.currentTarget.style.color="var(--text-2)"; e.currentTarget.style.borderLeftColor="transparent"; e.currentTarget.style.background="transparent"; }}
        >
          <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2}><polyline points="15 18 9 12 15 6"/></svg>
          Back to Developers
        </button>

        <div style={{ padding:"14px 14px 6px" }}>
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", color:"var(--text-3)", marginBottom:10 }}>Developers</div>
          {developers.slice(0,10).map((d, i) => (
            <div key={d.developer} style={{
              display:"flex", alignItems:"center", gap:8, padding:"6px 10px",
              borderRadius:7, marginBottom:2,
              background: i === 0 ? "rgba(139,92,246,.12)" : "transparent",
              cursor:"pointer",
            }}>
              {d.avatar_url
                ? <img src={d.avatar_url} alt="" style={{ width:24, height:24, borderRadius:"50%", border: i===0?"2px solid #8b5cf6":"2px solid transparent" }} />
                : <div style={{ width:24, height:24, borderRadius:"50%", background: d.color || COLORS[i%COLORS.length], display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:"#fff", flexShrink:0 }}>{d.developer[0].toUpperCase()}</div>
              }
              <span style={{ fontSize:11, color: i===0 ? "#a78bfa" : "var(--text-2)", fontWeight: i===0 ? 600 : 400 }}>{d.developer}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main profile content */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", background:"var(--bg-secondary)" }}>
        {/* Topbar */}
        <div style={{ height:50, background:"var(--bg-panel)", borderBottom:"1px solid var(--glass-border)", display:"flex", alignItems:"center", padding:"0 20px", gap:12, flexShrink:0 }}>
          <div style={{ fontSize:12, color:"var(--text-3)", display:"flex", gap:6, alignItems:"center" }}>
            <span style={{ color:"#a78bfa" }}>Commitology</span>
            <span>›</span>
            <span style={{ color:"var(--text-1)", fontWeight:500 }}>Developer Profile</span>
          </div>
          <div style={{ marginLeft:"auto", display:"flex", gap:10, alignItems:"center" }}>
            {/* Repo selector */}
            <select
              value={selectedRepo || ""}
              onChange={e => setSelectedRepo(e.target.value)}
              style={{
                background:"rgba(255,255,255,.04)", border:"1px solid var(--glass-border)",
                borderRadius:7, color:"var(--text-1)", fontFamily:"var(--font-body)", fontSize:12,
                padding:"5px 10px", outline:"none", cursor:"pointer",
              }}
            >
              {repos.map(r => <option key={r} value={r} style={{ background:"#0d0f1f" }}>{r.split("/")[1]}</option>)}
            </select>
            {user.avatar_url
              ? <img src={user.avatar_url} alt="" style={{ width:30, height:30, borderRadius:"50%", border:"2px solid rgba(139,92,246,.4)" }} />
              : <div style={{ width:30, height:30, borderRadius:"50%", background:"linear-gradient(135deg,#7c3aed,#06b6d4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:"#fff" }}>{user.name?.[0]||user.username?.[0]}</div>
            }
          </div>
        </div>

        {loading ? (
          <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12 }}>
            <div style={{ width:32, height:32, border:"2.5px solid rgba(139,92,246,.2)", borderTop:"2.5px solid #8b5cf6", borderRadius:"50%" }} className="anim-spin" />
            <p style={{ color:"var(--text-3)", fontSize:13, fontFamily:"var(--font-mono)" }}>Analysing knowledge graph…</p>
          </div>
        ) : (
          <div style={{ flex:1, overflowY:"auto", padding:"20px" }}>
            {/* Profile hero */}
            {topDev && (
              <div className="anim-up" style={{
                background:"var(--bg-card)", border:"1px solid var(--glass-border)",
                borderRadius:14, padding:"20px 22px", marginBottom:18,
                display:"flex", alignItems:"center", gap:20, flexWrap:"wrap",
              }}>
                {/* Avatar */}
                <div style={{ position:"relative" }}>
                  {topDev.avatar_url
                    ? <img src={topDev.avatar_url} alt="" style={{ width:72, height:72, borderRadius:"50%", border:"3px solid rgba(139,92,246,.5)" }} />
                    : <div style={{ width:72, height:72, borderRadius:"50%", background:"linear-gradient(135deg,#7c3aed,#06b6d4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, fontWeight:700, color:"#fff" }}>{topDev.developer[0].toUpperCase()}</div>
                  }
                  <div style={{
                    position:"absolute", bottom:-2, right:-2,
                    background:"rgba(245,158,11,.2)", border:"1.5px solid rgba(245,158,11,.5)",
                    borderRadius:99, padding:"2px 7px", fontSize:9, color:"#fbbf24", fontWeight:700, whiteSpace:"nowrap"
                  }}>
                    Top Contributor
                  </div>
                </div>

                {/* Info */}
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
                    <h1 style={{ fontSize:20, fontWeight:700, color:"var(--text-1)" }}>@{topDev.developer}</h1>
                    {highRiskFeatures.length > 0 && (
                      <span style={{ background:"rgba(244,63,94,.15)", color:"#fb7185", border:"1px solid rgba(244,63,94,.3)", borderRadius:99, padding:"2px 9px", fontSize:10, fontWeight:700 }}>
                        ⚠ High Knowledge Concentration
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize:12, color:"var(--text-3)", marginBottom:12 }}>
                    Primary contributor in {topDev.areas.length} key features
                  </div>
                  <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
                    {[
                      { label:"Total Commits", value:topDev.total_commits, color:"#a78bfa" },
                      { label:"Features",      value:topDev.areas.length,  color:"#22d3ee" },
                      { label:"Avg Knowledge", value:`${topDev.avg_knowledge.toFixed(0)}%`, color:"#fbbf24" },
                    ].map(s => (
                      <div key={s.label} style={{ textAlign:"center" }}>
                        <div style={{ fontSize:20, fontWeight:700, fontFamily:"var(--font-mono)", color:s.color }}>{s.value}</div>
                        <div style={{ fontSize:10, color:"var(--text-3)" }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div style={{ display:"flex", gap:2, borderBottom:"1px solid var(--glass-border)", marginBottom:18 }}>
              {TABS_PROFILE.map(t => (
                <div key={t} onClick={() => setActiveTab(t)} style={{
                  padding:"8px 16px", fontSize:12, fontWeight:500, cursor:"pointer",
                  color: activeTab===t ? "#a78bfa" : "var(--text-3)",
                  borderBottom: activeTab===t ? "2px solid #8b5cf6" : "2px solid transparent",
                  transition:"all .15s",
                }}>{t}</div>
              ))}
            </div>

            {/* Grid content */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              {/* Primary areas */}
              <div className="anim-up2" style={{ background:"var(--bg-card)", border:"1px solid var(--glass-border)", borderRadius:12, padding:"16px" }}>
                <div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:1, color:"var(--text-3)", marginBottom:12 }}>Primary Areas</div>
                {features.slice(0,6).map((f, i) => {
                  const dev = f.knowledge_graph?.developers?.[0];
                  return (
                    <div key={f.feature_id} style={{ display:"flex", alignItems:"center", gap:10, padding:"6px 0", borderBottom:"1px solid rgba(255,255,255,.04)" }}>
                      <div style={{
                        width:8, height:8, borderRadius:"50%", flexShrink:0,
                        background: f.knowledge_graph?.risk_level === "HIGH" || f.knowledge_graph?.risk_level === "CRITICAL" ? "#f59e0b" : "#8b5cf6",
                        boxShadow: `0 0 5px ${f.knowledge_graph?.risk_level === "HIGH" ? "rgba(245,158,11,.5)" : "rgba(139,92,246,.5)"}`,
                      }} />
                      <span style={{ fontSize:12, color:"var(--text-1)", flex:1 }}>{f.feature_name}</span>
                      {f.knowledge_graph && <RiskBadge level={f.knowledge_graph.risk_level} />}
                    </div>
                  );
                })}
              </div>

              {/* Contribution distribution */}
              <div className="anim-up2" style={{ background:"var(--bg-card)", border:"1px solid var(--glass-border)", borderRadius:12, padding:"16px" }}>
                <div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:1, color:"var(--text-3)", marginBottom:14 }}>Contribution Distribution</div>
                <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                  <DonutChart
                    items={developers.slice(0,5).map((d, i) => ({ value:d.total_commits, color:d.color||COLORS[i%COLORS.length] }))}
                    size={96}
                    thickness={14}
                    center={
                      <div>
                        <div style={{ fontSize:16, fontWeight:700, fontFamily:"var(--font-mono)", color:"var(--text-1)" }}>{totalCommits}</div>
                        <div style={{ fontSize:9, color:"var(--text-3)" }}>commits</div>
                      </div>
                    }
                  />
                  <div style={{ flex:1 }}>
                    {developers.slice(0,5).map((d, i) => (
                      <div key={d.developer} style={{ display:"flex", alignItems:"center", gap:7, marginBottom:6 }}>
                        <div style={{ width:7, height:7, borderRadius:"50%", background:d.color||COLORS[i%COLORS.length], flexShrink:0 }} />
                        <span style={{ fontSize:11, color:"var(--text-2)", flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{d.developer}</span>
                        <span style={{ fontSize:11, fontFamily:"var(--font-mono)", color:"var(--text-1)", fontWeight:600 }}>
                          {totalCommits ? ((d.total_commits/totalCommits)*100).toFixed(0) : 0}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Risk alerts */}
              {highRiskFeatures.length > 0 && (
                <div className="anim-up3" style={{ background:"var(--bg-card)", border:"1px solid rgba(245,158,11,.2)", borderRadius:12, padding:"16px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:12 }}>
                    <span style={{ fontSize:14 }}>⚠️</span>
                    <div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:1, color:"#fbbf24" }}>
                      Potentially Affected ({highRiskFeatures.length})
                    </div>
                  </div>
                  {highRiskFeatures.map(f => (
                    <div key={f.feature_id} style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 0", borderBottom:"1px solid rgba(255,255,255,.04)" }}>
                      <span style={{ fontSize:12 }}>🔥</span>
                      <span style={{ fontSize:12, color:"var(--text-1)", flex:1 }}>{f.feature_name}</span>
                      <RiskBadge level={f.knowledge_graph?.risk_level} />
                    </div>
                  ))}
                </div>
              )}

              {/* Suggested actions */}
              <div className="anim-up3" style={{ background:"var(--bg-card)", border:"1px solid var(--glass-border)", borderRadius:12, padding:"16px" }}>
                <div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:1, color:"var(--text-3)", marginBottom:12 }}>Suggested Actions</div>
                {[
                  { text:"Document payment architecture",        done:true  },
                  { text:"Assign secondary reviewers",           done:false },
                  { text:"Add integration tests",               done:false },
                  { text:"Conduct knowledge-transfer session",   done:false },
                ].map((a, i) => (
                  <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:8, padding:"6px 0" }}>
                    <div style={{
                      width:16, height:16, borderRadius:"50%", flexShrink:0, marginTop:1,
                      background: a.done ? "rgba(16,185,129,.2)" : "rgba(255,255,255,.05)",
                      border: a.done ? "1.5px solid #10b981" : "1.5px solid rgba(255,255,255,.1)",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:9, color: a.done ? "#34d399" : "transparent",
                    }}>✓</div>
                    <span style={{ fontSize:12, color: a.done ? "var(--text-3)" : "var(--text-2)", textDecoration: a.done ? "line-through" : "none" }}>{a.text}</span>
                  </div>
                ))}
              </div>

              {/* Documentation gaps */}
              <div className="anim-up4" style={{ background:"var(--bg-card)", border:"1px solid rgba(244,63,94,.18)", borderRadius:12, padding:"16px", gridColumn:"1/-1" }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                    <span style={{ fontSize:14 }}>📋</span>
                    <div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:1, color:"#fb7185" }}>Documentation Gaps</div>
                  </div>
                  <span style={{ fontSize:18, fontWeight:700, fontFamily:"var(--font-mono)", color:"#fb7185" }}>
                    {features.filter(f => !f.summary || f.summary.length < 20).length}
                  </span>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:8 }}>
                  {features.filter(f => !f.summary || f.summary.length < 20).slice(0,6).map(f => (
                    <div key={f.feature_id} style={{
                      padding:"8px 10px", background:"rgba(244,63,94,.06)", border:"1px solid rgba(244,63,94,.18)",
                      borderRadius:7, fontSize:11, color:"#fb7185",
                    }}>
                      {f.feature_name}
                    </div>
                  ))}
                  {features.filter(f => f.summary && f.summary.length >= 20).slice(0,4).map(f => (
                    <div key={f.feature_id} style={{
                      padding:"8px 10px", background:"rgba(16,185,129,.06)", border:"1px solid rgba(16,185,129,.18)",
                      borderRadius:7, fontSize:11, color:"#34d399",
                      display:"flex", alignItems:"center", gap:6,
                    }}>
                      <span>✓</span>{f.feature_name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
