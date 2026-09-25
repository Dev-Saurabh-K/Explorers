import { useState } from "react";

// ── Simple markdown renderer ─────────────────────────────────
function MarkdownView({ content }) {
  if (!content) return null;
  const lines = content.split("\n");
  return (
    <div style={{ fontFamily:"var(--font-body)", color:"var(--text-1)", lineHeight:1.75 }}>
      {lines.map((line, i) => {
        if (line.startsWith("# "))  return <h1 key={i} style={{ fontSize:22, fontWeight:700, color:"#a78bfa", marginBottom:12, marginTop:i ? 28 : 0, fontFamily:"var(--font-body)" }}>{line.slice(2)}</h1>;
        if (line.startsWith("## ")) return <h2 key={i} style={{ fontSize:16, fontWeight:600, color:"#22d3ee", marginBottom:8, marginTop:22, paddingBottom:6, borderBottom:"1px solid var(--glass-border)" }}>{line.slice(3)}</h2>;
        if (line.startsWith("### "))return <h3 key={i} style={{ fontSize:14, fontWeight:600, color:"#fbbf24", marginBottom:6, marginTop:16 }}>{line.slice(4)}</h3>;
        if (line.startsWith("- ") || line.startsWith("* "))
          return <div key={i} style={{ display:"flex", gap:8, marginBottom:4, paddingLeft:8 }}><span style={{ color:"#8b5cf6", marginTop:2, flexShrink:0 }}>▸</span><span style={{ fontSize:13, color:"var(--text-2)" }}>{line.slice(2)}</span></div>;
        if (line.startsWith("```")) return <div key={i} />;
        if (line.startsWith("|")) {
          const cells = line.split("|").filter(c => c.trim());
          return (
            <div key={i} style={{ display:"flex", gap:1, marginBottom:1 }}>
              {cells.map((c, j) => (
                <div key={j} style={{
                  flex:1, padding:"5px 10px", fontSize:11, fontFamily:"var(--font-mono)",
                  background:"rgba(255,255,255,.03)", border:"1px solid var(--glass-border)", color:"var(--text-2)"
                }}>{c.trim()}</div>
              ))}
            </div>
          );
        }
        if (line.trim() === "" || line.startsWith("---")) return <div key={i} style={{ height:8 }} />;
        return <p key={i} style={{ fontSize:13, color:"var(--text-2)", marginBottom:6 }}>{line}</p>;
      })}
    </div>
  );
}

const TABS = ["Documentation", "Architecture", "Code References", "Commits", "Integrations"];

export default function DocPage({ user, token, onLogout, onNavigate, doc, feature }) {
  const [activeTab, setActiveTab] = useState("Documentation");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (doc?.markdown_content) {
      navigator.clipboard.writeText(doc.markdown_content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExport = () => {
    const blob = new Blob([doc?.markdown_content || ""], { type:"text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = doc?.filename || "documentation.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden", fontFamily:"var(--font-body)" }}>
      {/* Left sidebar (navigation context) */}
      <div style={{
        width:200, minWidth:200, background:"var(--bg-panel)",
        borderRight:"1px solid var(--glass-border)",
        display:"flex", flexDirection:"column",
      }}>
        {/* Brand */}
        <div style={{
          padding:"16px 14px 14px",
          borderBottom:"1px solid var(--glass-border)",
          display:"flex", alignItems:"center", gap:10,
        }}>
          <div style={{
            width:30, height:30, background:"linear-gradient(135deg,#7c3aed,#8b5cf6)",
            borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, flexShrink:0,
          }} className="logo-glow">⊕</div>
          <span className="grad-brand" style={{ fontFamily:"var(--font-display)", fontSize:12, fontWeight:700, letterSpacing:1.5 }}>
            Commitology
          </span>
        </div>

        {/* Back button */}
        <button
          onClick={() => onNavigate("home")}
          style={{
            display:"flex", alignItems:"center", gap:8, padding:"10px 14px",
            background:"transparent", border:"none", color:"var(--text-2)", fontSize:12,
            cursor:"pointer", borderLeft:"3px solid transparent", transition:"all .15s",
            marginTop:8,
          }}
          onMouseEnter={e => { e.currentTarget.style.color="#a78bfa"; e.currentTarget.style.borderLeftColor="#8b5cf6"; e.currentTarget.style.background="rgba(139,92,246,.08)"; }}
          onMouseLeave={e => { e.currentTarget.style.color="var(--text-2)"; e.currentTarget.style.borderLeftColor="transparent"; e.currentTarget.style.background="transparent"; }}
        >
          <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2}><polyline points="15 18 9 12 15 6"/></svg>
          Back to Repos
        </button>

        {/* Doc navigation sections */}
        <div style={{ padding:"10px 14px 6px" }}>
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", color:"var(--text-3)", marginBottom:8 }}>
            Documentation
          </div>
        </div>
        {[
          { label:"Overview",            icon:"📋" },
          { label:"System Design",       icon:"🏗️" },
          { label:"How Diagrams",        icon:"📊" },
          { label:"Key Components",      icon:"🔑" },
          { label:"External Integrations",icon:"🔗" },
          { label:"API Endpoints",       icon:"⚡" },
          { label:"Deployment Notes",    icon:"🚀" },
          { label:"Known Issues",        icon:"⚠️" },
          { label:"Future Improvements", icon:"🔮" },
        ].map((s, i) => (
          <div key={s.label} style={{
            display:"flex", alignItems:"center", gap:8, padding:"6px 14px",
            cursor:"pointer", color: i === 0 ? "#a78bfa" : "var(--text-3)", fontSize:12,
            borderLeft: i === 0 ? "3px solid #8b5cf6" : "3px solid transparent",
            background: i === 0 ? "rgba(139,92,246,.08)" : "transparent",
            transition:"all .15s",
          }}
          onMouseEnter={e => { if(i!==0){ e.currentTarget.style.color="var(--text-2)"; e.currentTarget.style.background="rgba(255,255,255,.03)"; } }}
          onMouseLeave={e => { if(i!==0){ e.currentTarget.style.color="var(--text-3)"; e.currentTarget.style.background="transparent"; } }}
          >
            <span>{s.icon}</span>
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Main doc area */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {/* Topbar */}
        <div style={{
          height:50, background:"var(--bg-panel)", borderBottom:"1px solid var(--glass-border)",
          display:"flex", alignItems:"center", padding:"0 20px", gap:12, flexShrink:0,
        }}>
          {/* Breadcrumb */}
          <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"var(--text-3)", flex:1 }}>
            <span style={{ color:"#a78bfa" }}>{doc?.repo?.split("/")[1] || "repo"}</span>
            <span>›</span>
            <span style={{ color:"var(--text-2)" }}>{feature?.feature_name || doc?.feature_name}</span>
            <span>›</span>
            <span style={{ color:"var(--text-1)", fontWeight:500 }}>Documentation</span>
          </div>

          {/* Actions */}
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <button
              onClick={handleCopy}
              style={{
                display:"flex", alignItems:"center", gap:6, padding:"6px 12px",
                background:"rgba(255,255,255,.05)", border:"1px solid var(--glass-border)",
                borderRadius:7, color: copied ? "#34d399" : "var(--text-2)", fontSize:12, cursor:"pointer", fontFamily:"var(--font-body)",
                transition:"all .2s",
              }}
            >
              {copied
                ? <><svg viewBox="0 0 24 24" width={12} height={12} fill="none" stroke="currentColor" strokeWidth={2}><polyline points="20 6 9 17 4 12"/></svg>Copied!</>
                : <><svg viewBox="0 0 24 24" width={12} height={12} fill="none" stroke="currentColor" strokeWidth={2}><rect x={9} y={9} width={13} height={13} rx={2}/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>Copy</>
              }
            </button>

            <button
              id="regenerate-doc-btn"
              onClick={() => onNavigate("home")}
              style={{
                display:"flex", alignItems:"center", gap:6, padding:"6px 12px",
                background:"rgba(255,255,255,.05)", border:"1px solid var(--glass-border)",
                borderRadius:7, color:"var(--text-2)", fontSize:12, cursor:"pointer", fontFamily:"var(--font-body)",
              }}
            >
              <svg viewBox="0 0 24 24" width={12} height={12} fill="none" stroke="currentColor" strokeWidth={2}><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
              Regenerate
            </button>

            <button
              id="export-doc-btn"
              onClick={handleExport}
              style={{
                display:"flex", alignItems:"center", gap:6, padding:"6px 14px",
                background:"linear-gradient(135deg,#7c3aed,#8b5cf6)",
                border:"none", borderRadius:7, color:"#fff", fontSize:12, fontWeight:600,
                cursor:"pointer", fontFamily:"var(--font-body)",
                boxShadow:"0 2px 12px rgba(139,92,246,.35)",
              }}
            >
              <svg viewBox="0 0 24 24" width={12} height={12} fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1={12} y1={15} x2={12} y2={3}/></svg>
              Export
            </button>
          </div>

          {/* User avatar */}
          {user.avatar_url
            ? <img src={user.avatar_url} alt="" style={{ width:30, height:30, borderRadius:"50%", border:"2px solid rgba(139,92,246,.4)" }} />
            : <div style={{ width:30, height:30, borderRadius:"50%", background:"linear-gradient(135deg,#7c3aed,#06b6d4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:"#fff" }}>{user.name?.[0]||user.username?.[0]}</div>
          }
        </div>

        {/* Doc header */}
        <div style={{ padding:"18px 24px 0", background:"var(--bg-panel)", borderBottom:"1px solid var(--glass-border)" }}>
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:14 }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
                <span style={{ fontSize:20 }}>🔐</span>
                <h1 style={{ fontSize:20, fontWeight:700, color:"var(--text-1)" }}>{feature?.feature_name || doc?.feature_name}</h1>
              </div>
              {doc && (
                <div style={{ fontSize:11, color:"var(--text-3)", fontFamily:"var(--font-mono)" }}>
                  Last generated · {new Date().toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" })}
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display:"flex", gap:2 }}>
            {TABS.map(t => (
              <div key={t} onClick={() => setActiveTab(t)} style={{
                padding:"8px 16px", fontSize:12, fontWeight:500, cursor:"pointer",
                color: activeTab === t ? "#a78bfa" : "var(--text-3)",
                borderBottom: activeTab === t ? "2px solid #8b5cf6" : "2px solid transparent",
                transition:"all .15s",
              }}
              onMouseEnter={e => { if(activeTab!==t) e.currentTarget.style.color="var(--text-2)"; }}
              onMouseLeave={e => { if(activeTab!==t) e.currentTarget.style.color="var(--text-3)"; }}
              >{t}</div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex:1, overflowY:"auto", padding:"24px", display:"flex", gap:20 }}>
          {/* Main doc content */}
          <div style={{
            flex:1,
            background:"var(--bg-card)", border:"1px solid var(--glass-border)",
            borderRadius:12, padding:"24px", maxWidth:680,
          }}>
            {doc?.markdown_content
              ? <MarkdownView content={doc.markdown_content} />
              : (
                <div style={{ textAlign:"center", padding:"60px 0", color:"var(--text-3)" }}>
                  <div style={{ fontSize:48, marginBottom:16 }}>📄</div>
                  <div style={{ fontSize:14 }}>No documentation generated yet</div>
                  <div style={{ fontSize:12, marginTop:8 }}>Go back and click "Generate Documentation"</div>
                </div>
              )
            }
          </div>

          {/* Architecture diagram placeholder */}
          <div style={{ width:280, display:"flex", flexDirection:"column", gap:14 }}>
            {/* Architecture box */}
            <div style={{
              background:"var(--bg-card)", border:"1px solid var(--glass-border)",
              borderRadius:12, padding:"16px",
            }}>
              <div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:1, color:"var(--text-3)", marginBottom:14 }}>Architecture</div>
              {/* Simple flow diagram */}
              {[
                { label:"Client (Web/Mobile)", color:"rgba(139,92,246,.2)", border:"rgba(139,92,246,.5)", icon:"🌐" },
                { label:"Auth Service",         color:"rgba(6,182,212,.2)",  border:"rgba(6,182,212,.5)",  icon:"🔐" },
                { label:"Database",             color:"rgba(16,185,129,.2)", border:"rgba(16,185,129,.5)", icon:"🗄️" },
                { label:"External (JWT, Email)",color:"rgba(245,158,11,.2)", border:"rgba(245,158,11,.5)", icon:"⚡" },
              ].map((n, i, arr) => (
                <div key={n.label}>
                  <div style={{
                    background:n.color, border:`1px solid ${n.border}`,
                    borderRadius:7, padding:"8px 12px",
                    display:"flex", alignItems:"center", gap:7,
                    fontSize:11, color:"var(--text-1)", fontWeight:500,
                  }}>
                    <span>{n.icon}</span>{n.label}
                  </div>
                  {i < arr.length - 1 && (
                    <div style={{ textAlign:"center", color:"var(--text-3)", fontSize:16, lineHeight:1.4, padding:"2px 0" }}>↓</div>
                  )}
                </div>
              ))}
            </div>

            {/* File info */}
            {doc && (
              <div style={{
                background:"var(--bg-card)", border:"1px solid var(--glass-border)",
                borderRadius:12, padding:"14px 16px",
              }}>
                <div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:1, color:"var(--text-3)", marginBottom:10 }}>Export Info</div>
                <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <span style={{ fontSize:11, color:"var(--text-3)" }}>Filename</span>
                    <span style={{ fontSize:11, fontFamily:"var(--font-mono)", color:"#a78bfa" }}>{doc.filename}</span>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <span style={{ fontSize:11, color:"var(--text-3)" }}>Size</span>
                    <span style={{ fontSize:11, fontFamily:"var(--font-mono)", color:"var(--text-2)" }}>
                      {((doc.markdown_content?.length || 0) / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <span style={{ fontSize:11, color:"var(--text-3)" }}>Format</span>
                    <span style={{ fontSize:11, background:"rgba(139,92,246,.12)", color:"#a78bfa", border:"1px solid rgba(139,92,246,.25)", borderRadius:99, padding:"1px 8px", fontFamily:"var(--font-mono)" }}>Markdown</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
