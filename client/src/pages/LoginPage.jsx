import { useEffect, useState } from "react";

const API = "http://localhost:8000";

// ── Stars background ────────────────────────────────────────────
const Stars = () => {
  const stars = Array.from({ length: 90 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top:  `${Math.random() * 75}%`,
    dur:  `${2.5 + Math.random() * 4}s`,
    delay:`${Math.random() * 3}s`,
    size: Math.random() > 0.82 ? 3 : 2,
    opacity: 0.15 + Math.random() * 0.55,
  }));
  return (
    <div style={{ position:"absolute", inset:0, pointerEvents:"none", zIndex:0 }}>
      {stars.map(s => (
        <div key={s.id} style={{
          position:"absolute",
          left: s.left, top: s.top,
          width: s.size, height: s.size,
          background: "white",
          borderRadius: "50%",
          opacity: s.opacity,
          animation: `twinkle ${s.dur} ${s.delay} infinite ease-in-out`,
        }} />
      ))}
    </div>
  );
};

// ── GitHub Icon ─────────────────────────────────────────────────
const GithubIcon = ({ size = 22 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

export default function LoginPage({ onLogin }) {
  const handleLogin = (e) => {
    e.preventDefault();
    window.location.href = `${API}/auth/github`;
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at 50% 0%, #1a0d3a 0%, #080912 50%, #0a0d1a 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Retro grid */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(139,92,246,0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(139,92,246,0.1) 1px, transparent 1px)
        `,
        backgroundSize: "52px 52px",
        animation: "gridScroll 12s linear infinite",
        maskImage: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 70%)",
        WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 70%)",
      }} />

      <Stars />

      {/* Horizon sun glow */}
      <div style={{
        position:"absolute", bottom:"25%", left:"50%", transform:"translateX(-50%)",
        width:480, height:200,
        background:"radial-gradient(ellipse at 50% 100%, rgba(245,158,11,0.45) 0%, rgba(139,92,246,0.25) 45%, transparent 70%)",
        pointerEvents:"none", zIndex:1,
      }} />
      <div style={{
        position:"absolute", bottom:"25%", left:0, right:0, height:2,
        background:"linear-gradient(90deg,transparent,rgba(245,158,11,0.7),rgba(139,92,246,0.7),transparent)",
        zIndex:2,
      }} />

      {/* Login card */}
      <div className="anim-up" style={{
        position:"relative", zIndex:10,
        background:"rgba(10,11,28,0.88)",
        border:"1px solid rgba(139,92,246,0.28)",
        borderRadius:24,
        padding:"52px 48px",
        width:"100%", maxWidth:460,
        textAlign:"center",
        backdropFilter:"blur(28px)",
        WebkitBackdropFilter:"blur(28px)",
        boxShadow:"0 0 0 1px rgba(255,255,255,0.04),0 32px 80px rgba(0,0,0,0.55),0 0 70px rgba(139,92,246,0.12),inset 0 1px 0 rgba(255,255,255,0.06)",
      }}>
        {/* Scanlines */}
        <div style={{
          position:"absolute",inset:0,borderRadius:24,pointerEvents:"none",zIndex:20,
          background:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.025) 2px,rgba(0,0,0,0.025) 4px)",
        }} />

        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:14, marginBottom:14 }}>
          <div className="logo-glow" style={{
            width:52, height:52,
            background:"rgba(255,255,255,0.07)",
            border:"2px solid rgba(139,92,246,0.38)",
            borderRadius:14,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:26,
          }}>
            <GithubIcon size={28} />
          </div>
          <span className="grad-brand" style={{
            fontFamily:"var(--font-display)",
            fontSize:26, fontWeight:900, letterSpacing:2,
          }}>
            Commitology
          </span>
        </div>

        <p style={{ fontSize:20, fontWeight:600, color:"var(--text-1)", marginBottom:8 }}>
          From commits to clarity.
        </p>
        <p style={{ fontSize:14, color:"var(--text-2)", lineHeight:1.75, marginBottom:38 }}>
          AI-powered documentation for your codebase.<br />
          Turn raw Git history into structured feature docs.
        </p>

        {/* GitHub OAuth button */}
        <a
          id="github-login-btn"
          href="#"
          onClick={handleLogin}
          style={{
            display:"flex", alignItems:"center", justifyContent:"center", gap:12,
            width:"100%", padding:"15px 24px",
            background:"rgba(255,255,255,0.055)",
            border:"1.5px solid rgba(139,92,246,0.38)",
            borderRadius:12,
            color:"var(--text-1)",
            fontFamily:"var(--font-body)",
            fontSize:16, fontWeight:600,
            cursor:"pointer",
            textDecoration:"none",
            transition:"all .28s cubic-bezier(.4,0,.2,1)",
            marginBottom:22,
            position:"relative", overflow:"hidden",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = "rgba(139,92,246,.7)";
            e.currentTarget.style.boxShadow = "0 0 32px rgba(139,92,246,.3),inset 0 0 20px rgba(139,92,246,.04)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = "rgba(139,92,246,.38)";
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.transform = "none";
          }}
        >
          <GithubIcon size={21} />
          Continue with GitHub
          <span style={{ marginLeft:"auto", opacity:.5, display:"flex" }}>
            <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </span>
        </a>

        <p style={{ fontSize:12, color:"var(--text-3)", fontStyle:"italic" }}>
          Your repositories. Your history. Organized.
        </p>
      </div>
    </div>
  );
}
