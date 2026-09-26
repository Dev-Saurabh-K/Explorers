import { API_BASE_URL } from "../services/api";
import gitocxLogo from "../assets/gitocx-logo.jpeg";

// ─────────────────────────────────────────────────────────────
// Stars
// ─────────────────────────────────────────────────────────────

const Stars = () => {
  const stars = Array.from({ length: 180 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 72}%`,
    size: Math.random() > 0.92 ? 3 : Math.random() > 0.65 ? 2 : 1,
    opacity: 0.15 + Math.random() * 0.65,
    duration: `${2 + Math.random() * 5}s`,
    delay: `${Math.random() * 5}s`,
  }));

  return (
    <div className="stars">
      {stars.map((star) => (
        <span
          key={star.id}
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            animationDuration: star.duration,
            animationDelay: star.delay,
          }}
        />
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Logo
// ─────────────────────────────────────────────────────────────

const GitocxLogo = ({ className = "" }) => {
  return (
    <img
      src={gitocxLogo}
      alt="Gitocx"
      className={`gitocx-logo ${className}`}
    />
  );
};

// ─────────────────────────────────────────────────────────────
// GitHub Icon
// ─────────────────────────────────────────────────────────────

const GithubIcon = ({ size = 22 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688.103-.253.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

// ─────────────────────────────────────────────────────────────
// Arrow
// ─────────────────────────────────────────────────────────────

const ArrowIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14" />
    <path d="m13 5 7 7-7 7" />
  </svg>
);

// ─────────────────────────────────────────────────────────────
// Key Icon
// ─────────────────────────────────────────────────────────────

const KeyIcon = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="7.5" cy="15.5" r="5.5" />
    <path d="m21 2-9.6 9.6" />
    <path d="m15.5 6.5 2 2" />
    <path d="m18 4 2 2" />
  </svg>
);

// ─────────────────────────────────────────────────────────────
// Mountains
// ─────────────────────────────────────────────────────────────

const Mountains = () => {
  return (
    <>
      <div className="mountain mountain-back" />

      <div className="mountain mountain-left" />

      <div className="mountain mountain-right" />

      <div className="mountain mountain-front" />
    </>
  );
};

// ─────────────────────────────────────────────────────────────
// Login Page
// ─────────────────────────────────────────────────────────────

export default function LoginPage() {
  const handleLogin = (e) => {
    e.preventDefault();

    window.location.href = `${API_BASE_URL}/auth/github`;
  };

  return (
    <div className="login-page">

      {/* ═══════════════════════════════════════════════════════
          BACKGROUND
      ═══════════════════════════════════════════════════════ */}

      <div className="sky-glow" />

      <Stars />

      <div className="moon-glow" />

      <Mountains />

      {/* Horizon */}
      <div className="horizon-glow" />
      <div className="horizon-line" />

      {/* Retro floor */}
      <div className="retro-floor">
        <div className="floor-grid" />
      </div>

      {/* ═══════════════════════════════════════════════════════
          NAVBAR
      ═══════════════════════════════════════════════════════ */}

      <header className="topbar">

        {/* macOS style controls */}
        <div className="window-controls">
          <span className="window-red" />
          <span className="window-yellow" />
          <span className="window-green" />
        </div>

        {/* Brand */}
        <div className="nav-brand">

          <div className="nav-logo">
            <GitocxLogo />
          </div>

          <span className="nav-brand-text">
            Git<span>ocx</span>
          </span>

        </div>

        {/* Sign in */}
        <button className="signin-button">
          Sign In
        </button>

      </header>

      {/* ═══════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════ */}

      <main className="hero">

        <div className="hero-content">

          {/* Logo */}
          <div className="hero-logo-wrapper">
            <GitocxLogo />
          </div>

          {/* Brand */}
          <h1 className="hero-title">
            Git<span>ocx</span>
          </h1>

          {/* Tagline */}
          <h2 className="hero-tagline">
            From commits to clarity.
          </h2>

          {/* Description */}
          <p className="hero-description">
            AI-powered documentation for your codebase.
          </p>

          {/* GitHub Login */}
          <a
            href="#"
            onClick={handleLogin}
            className="github-button"
          >
            <GithubIcon size={23} />

            <span>
              Continue with GitHub
            </span>

            <span className="github-arrow">
              <ArrowIcon />
            </span>
          </a>

          {/* Trust */}
          <p className="trust-text">
            Your repositories. Your history. Organized.
          </p>

          {/* Custom token */}
          <button className="token-button">
            <KeyIcon />

            <span>
              Sign in with Custom Token
            </span>
          </button>

        </div>

      </main>

      {/* ═══════════════════════════════════════════════════════
          BOTTOM BAR
      ═══════════════════════════════════════════════════════ */}

      <footer className="bottom-bar">

        <div className="mvp-section">

          <span className="mvp-badge">
            MVP DELIVERABLES
          </span>

          <span className="mvp-text">
            Core capabilities built for automated repository intelligence
          </span>

        </div>

        <div className="version">
          v1.0.0 Ready
        </div>

      </footer>

      {/* ═══════════════════════════════════════════════════════
          STYLES
      ═══════════════════════════════════════════════════════ */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        html,
        body,
        #root {
          margin: 0;
          width: 100%;
          min-height: 100%;
        }

        body {
          background: #03050a;
        }

        button,
        a {
          font-family: inherit;
        }


        /* =====================================================
           MAIN PAGE
        ===================================================== */

        .login-page {
          position: relative;

          width: 100%;
          min-height: 100vh;

          overflow: hidden;

          background:
            radial-gradient(
              ellipse at 50% 5%,
              #18132e 0%,
              #090a13 42%,
              #03050a 100%
            );

          color: white;

          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }


        /* =====================================================
           SKY GLOW
        ===================================================== */

        .sky-glow {
          position: absolute;

          inset: 0;

          pointer-events: none;

          background:
            radial-gradient(
              ellipse at 12% 70%,
              rgba(255, 0, 174, 0.28),
              transparent 30%
            ),
            radial-gradient(
              ellipse at 88% 67%,
              rgba(255, 143, 32, 0.25),
              transparent 30%
            ),
            radial-gradient(
              ellipse at 50% 76%,
              rgba(167, 45, 255, 0.24),
              transparent 42%
            );

          filter: blur(25px);
        }


        /* =====================================================
           STARS
        ===================================================== */

        .stars {
          position: absolute;

          inset: 0;

          pointer-events: none;

          z-index: 1;
        }

        .stars span {
          position: absolute;

          display: block;

          border-radius: 50%;

          background: white;

          box-shadow:
            0 0 5px rgba(255, 255, 255, 0.8);

          animation:
            starTwinkle ease-in-out infinite;
        }

        @keyframes starTwinkle {

          0%,
          100% {
            opacity: 0.15;
            transform: scale(0.8);
          }

          50% {
            opacity: 0.9;
            transform: scale(1.25);
          }

        }


        /* =====================================================
           TOP NAVBAR
        ===================================================== */

        .topbar {
          position: absolute;

          top: 0;
          left: 0;
          right: 0;

          height: 74px;

          z-index: 100;

          display: flex;

          align-items: center;

          padding: 0 30px;

          background:
            rgba(5, 6, 14, 0.93);

          border-bottom:
            1px solid rgba(255, 255, 255, 0.055);

          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
        }


        /* =====================================================
           WINDOW CONTROLS
        ===================================================== */

        .window-controls {
          display: flex;

          align-items: center;

          gap: 9px;

          width: 82px;
        }

        .window-controls span {
          display: block;

          width: 15px;
          height: 15px;

          border-radius: 50%;
        }

        .window-red {
          background: #ff3b30;
        }

        .window-yellow {
          background: #ffbd2e;
        }

        .window-green {
          background: #00c851;
        }


        /* =====================================================
           NAV BRAND
        ===================================================== */

        .nav-brand {
          display: flex;

          align-items: center;

          gap: 10px;
        }


        .nav-logo {
          width: 42px;
          height: 42px;

          overflow: hidden;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 10px;

          background: #070910;

          border:
            1px solid rgba(168, 85, 247, 0.25);

          box-shadow:
            0 0 20px rgba(168, 85, 247, 0.16);
        }


        .nav-logo .gitocx-logo {
          width: 100%;
          height: 100%;

          border-radius: 10px;

          box-shadow: none;
        }


        .nav-brand-text {
          font-size: 20px;

          font-weight: 900;

          letter-spacing: -0.7px;

          color: #ffffff;
        }


        .nav-brand-text span {
          color: #db57ff;
        }


        /* =====================================================
           SIGN IN
        ===================================================== */

        .signin-button {
          margin-left: auto;

          border: none;

          padding:
            10px 25px;

          border-radius: 13px;

          background:
            linear-gradient(
              135deg,
              #ffd000,
              #ffb800
            );

          color: #090909;

          font-size: 15px;

          font-weight: 850;

          cursor: pointer;

          box-shadow:
            0 0 25px rgba(255, 190, 0, 0.12);

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            filter 0.2s ease;
        }


        .signin-button:hover {
          transform:
            translateY(-1px);

          filter:
            brightness(1.04);

          box-shadow:
            0 8px 30px rgba(255, 190, 0, 0.28);
        }


        /* =====================================================
           LOGO
        ===================================================== */

        .gitocx-logo {
          display: block;

          width: 125px;
          height: 125px;

          object-fit: cover;

          border-radius: 28px;

          box-shadow:
            0 0 30px rgba(168, 85, 247, 0.32),
            0 0 70px rgba(236, 72, 153, 0.13);
        }


        /* =====================================================
           MOUNTAINS
        ===================================================== */

        .mountain {
          position: absolute;

          pointer-events: none;

          z-index: 3;
        }


        .mountain-back {
          left: -5%;
          bottom: 21%;

          width: 110%;
          height: 260px;

          opacity: 0.8;

          background:
            linear-gradient(
              150deg,
              transparent 18%,
              #12121e 18.2%,
              #080910 38%,
              transparent 38.2%,
              transparent 45%,
              #131322 45.2%,
              #07080f 68%,
              transparent 68.2%
            );
        }


        .mountain-left {
          left: -12%;
          bottom: 21%;

          width: 62%;
          height: 270px;

          background: #080a12;

          clip-path:
            polygon(
              0 100%,
              0 72%,
              8% 65%,
              15% 68%,
              22% 45%,
              28% 57%,
              37% 30%,
              43% 52%,
              52% 20%,
              59% 46%,
              68% 34%,
              75% 57%,
              84% 43%,
              93% 68%,
              100% 57%,
              100% 100%
            );

          box-shadow:
            0 -20px 60px rgba(255, 0, 180, 0.12);
        }


        .mountain-right {
          right: -12%;
          bottom: 21%;

          width: 58%;
          height: 300px;

          background: #080a12;

          clip-path:
            polygon(
              0 100%,
              0 70%,
              8% 58%,
              17% 64%,
              27% 40%,
              34% 55%,
              44% 25%,
              50% 45%,
              59% 18%,
              66% 50%,
              74% 36%,
              82% 62%,
              91% 48%,
              100% 68%,
              100% 100%
            );

          box-shadow:
            0 -20px 70px rgba(255, 130, 20, 0.12);
        }


        .mountain-front {
          left: 0;
          right: 0;

          bottom: 17%;

          height: 110px;

          background: #05060c;

          clip-path:
            polygon(
              0 65%,
              5% 55%,
              10% 62%,
              17% 48%,
              24% 58%,
              32% 44%,
              39% 62%,
              46% 52%,
              54% 63%,
              62% 45%,
              70% 60%,
              78% 48%,
              86% 58%,
              94% 44%,
              100% 56%,
              100% 100%,
              0 100%
            );
        }


        /* =====================================================
           HORIZON
        ===================================================== */

        .horizon-glow {
          position: absolute;

          left: 50%;
          bottom: 22%;

          transform:
            translateX(-50%);

          width: 700px;
          height: 150px;

          z-index: 4;

          background:
            radial-gradient(
              ellipse,
              rgba(255, 159, 28, 0.25),
              rgba(219, 44, 255, 0.16),
              transparent 70%
            );

          filter: blur(12px);

          pointer-events: none;
        }


        .horizon-line {
          position: absolute;

          left: 0;
          right: 0;

          bottom: 22%;

          height: 2px;

          z-index: 5;

          background:
            linear-gradient(
              90deg,
              transparent,
              #9e32ff 18%,
              #ffb82e 48%,
              #ff4fc8 70%,
              transparent
            );

          box-shadow:
            0 0 20px rgba(255, 65, 203, 0.7);

          pointer-events: none;
        }


        /* =====================================================
           RETRO FLOOR
        ===================================================== */

        .retro-floor {
          position: absolute;

          left: 0;
          right: 0;

          bottom: -5%;

          height: 47%;

          overflow: hidden;

          perspective: 500px;

          z-index: 6;

          pointer-events: none;
        }


        .floor-grid {
          position: absolute;

          left: -20%;
          right: -20%;

          top: 0;
          bottom: -50%;

          transform:
            rotateX(65deg)
            scale(1.35);

          transform-origin:
            top center;

          background-image:
            linear-gradient(
              rgba(255, 56, 190, 0.30) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255, 181, 45, 0.24) 1px,
              transparent 1px
            );

          background-size:
            58px 58px;

          mask-image:
            linear-gradient(
              to bottom,
              rgba(0, 0, 0, 0.9),
              transparent 80%
            );

          -webkit-mask-image:
            linear-gradient(
              to bottom,
              rgba(0, 0, 0, 0.9),
              transparent 80%
            );

          animation:
            floorMove 8s linear infinite;
        }


        @keyframes floorMove {

          from {
            background-position:
              0 0,
              0 0;
          }

          to {
            background-position:
              0 58px,
              58px 0;
          }

        }


        /* =====================================================
           HERO
        ===================================================== */

        .hero {
          position: relative;

          z-index: 20;

          min-height: 100vh;

          display: flex;

          align-items: center;
          justify-content: center;

          text-align: center;

          padding:
            95px 20px
            135px;
        }


        .hero-content {
          position: relative;

          width: 100%;

          max-width: 700px;

          display: flex;

          flex-direction: column;

          align-items: center;

          animation:
            heroIn 0.9s
            cubic-bezier(.16,1,.3,1);
        }


        @keyframes heroIn {

          from {
            opacity: 0;

            transform:
              translateY(25px);
          }

          to {
            opacity: 1;

            transform:
              translateY(0);
          }

        }


        /* =====================================================
           HERO LOGO
        ===================================================== */

        .hero-logo-wrapper {
          margin-bottom: 26px;

          animation:
            logoFloat 4s ease-in-out infinite;
        }


        .hero-logo-wrapper .gitocx-logo {
          width: 125px;
          height: 125px;

          border-radius: 29px;
        }


        @keyframes logoFloat {

          0%,
          100% {
            transform:
              translateY(0);
          }

          50% {
            transform:
              translateY(-6px);
          }

        }


        /* =====================================================
           HERO TITLE
        ===================================================== */

        .hero-title {
          margin: 0;

          font-size:
            clamp(58px, 8vw, 88px);

          line-height: 0.95;

          font-weight: 950;

          letter-spacing: -5px;

          color: white;

          text-shadow:
            0 4px 30px rgba(255, 255, 255, 0.08);
        }


        .hero-title span {
          background:
            linear-gradient(
              100deg,
              #b55cff,
              #f35db5,
              #ff688d
            );

          -webkit-background-clip: text;

          background-clip: text;

          color: transparent;
        }


        /* =====================================================
           TAGLINE
        ===================================================== */

        .hero-tagline {
          margin:
            28px 0 9px;

          font-size:
            clamp(25px, 3vw, 33px);

          line-height: 1.2;

          font-weight: 800;

          letter-spacing: -0.8px;

          color:
            #f4f4f7;
        }


        /* =====================================================
           DESCRIPTION
        ===================================================== */

        .hero-description {
          margin:
            0 0 30px;

          color:
            rgba(231, 232, 240, 0.72);

          font-size: 19px;

          line-height: 1.5;

          letter-spacing: -0.2px;
        }


        /* =====================================================
           GITHUB BUTTON
        ===================================================== */

        .github-button {
          position: relative;

          width:
            min(390px, 90vw);

          min-height: 76px;

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 15px;

          padding:
            0 28px;

          border-radius: 18px;

          color:
            #080808;

          background:
            linear-gradient(
              135deg,
              #ffd000,
              #ffb900
            );

          text-decoration: none;

          font-size: 18px;

          font-weight: 900;

          box-shadow:
            0 12px 35px
            rgba(255, 185, 0, 0.20),

            inset 0 1px 0
            rgba(255, 255, 255, 0.35);

          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease,
            filter 0.25s ease;
        }


        .github-button:hover {
          transform:
            translateY(-3px)
            scale(1.015);

          filter:
            brightness(1.05);

          box-shadow:
            0 20px 50px
            rgba(255, 185, 0, 0.35),

            0 0 45px
            rgba(255, 195, 0, 0.12);
        }


        .github-button:active {
          transform:
            translateY(0)
            scale(1);
        }


        .github-arrow {
          display: flex;

          margin-left: 5px;
        }


        /* =====================================================
           TRUST TEXT
        ===================================================== */

        .trust-text {
          margin:
            20px 0 33px;

          color:
            rgba(213, 215, 225, 0.64);

          font-family:
            "SFMono-Regular",
            Consolas,
            "Liberation Mono",
            monospace;

          font-size: 15px;

          letter-spacing: 0.5px;
        }


        /* =====================================================
           TOKEN BUTTON
        ===================================================== */

        .token-button {
          display: flex;

          align-items: center;

          justify-content: center;

          gap: 8px;

          padding:
            11px 22px;

          border-radius: 12px;

          border:
            1px solid
            rgba(113, 132, 183, 0.4);

          background:
            rgba(13, 17, 31, 0.55);

          color:
            rgba(222, 225, 238, 0.8);

          font-size: 14px;

          cursor: pointer;

          box-shadow:
            inset 0 1px 0
            rgba(255, 255, 255, 0.04);

          transition:
            border-color 0.2s ease,
            background 0.2s ease,
            transform 0.2s ease;
        }


        .token-button:hover {
          border-color:
            rgba(168, 85, 247, 0.7);

          background:
            rgba(95, 45, 145, 0.15);

          transform:
            translateY(-1px);
        }


        /* =====================================================
           BOTTOM BAR
        ===================================================== */

        .bottom-bar {
          position: absolute;

          left: 7%;
          right: 7%;

          bottom: 24px;

          z-index: 40;

          padding-top: 20px;

          border-top:
            1px solid
            rgba(255, 255, 255, 0.09);

          display: flex;

          align-items: center;

          justify-content: space-between;

          color:
            rgba(175, 180, 200, 0.68);

          font-size: 13px;
        }


        .mvp-section {
          display: flex;

          align-items: center;

          gap: 12px;
        }


        .mvp-badge {
          padding:
            6px 12px;

          border-radius: 5px;

          border:
            1px solid
            rgba(255, 190, 0, 0.4);

          color:
            #ffd000;

          background:
            rgba(255, 190, 0, 0.07);

          font-family:
            monospace;

          font-weight: 800;

          font-size: 11px;

          letter-spacing: 0.8px;
        }


        .mvp-text {
          font-size: 13px;
        }


        .version {
          color:
            rgba(139, 151, 181, 0.65);

          font-family:
            monospace;

          font-size: 12px;
        }


        /* =====================================================
           TABLET
        ===================================================== */

        @media (max-width: 700px) {

          .topbar {
            height: 64px;

            padding:
              0 16px;
          }


          .window-controls {
            width: 60px;

            gap: 6px;
          }


          .window-controls span {
            width: 11px;
            height: 11px;
          }


          .nav-brand-text {
            font-size: 17px;
          }


          .signin-button {
            padding:
              8px 16px;

            font-size: 13px;
          }


          .hero {
            padding:
              90px 15px
              105px;
          }


          .hero-logo-wrapper {
            margin-bottom: 22px;
          }


          .hero-logo-wrapper .gitocx-logo {
            width: 100px;
            height: 100px;

            border-radius: 23px;
          }


          .hero-title {
            font-size: 62px;

            letter-spacing:
              -4px;
          }


          .hero-tagline {
            font-size: 25px;
          }


          .hero-description {
            font-size: 16px;
          }


          .github-button {
            min-height: 66px;

            font-size: 16px;
          }


          .trust-text {
            font-size: 12px;
          }


          .bottom-bar {
            left: 16px;
            right: 16px;

            bottom: 12px;
          }


          .mvp-text {
            display: none;
          }


          .mvp-badge {
            font-size: 9px;
          }


          .version {
            font-size: 10px;
          }


          .mountain-left,
          .mountain-right {
            bottom: 21%;
          }


          .retro-floor {
            height: 38%;
          }

        }


        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 420px) {

          .window-controls {
            display: none;
          }


          .nav-brand {
            margin-left: 0;
          }


          .hero-title {
            font-size: 54px;

            letter-spacing:
              -3px;
          }


          .hero-tagline {
            font-size: 22px;
          }


          .hero-description {
            font-size: 14px;
          }


          .github-button {
            width: 92vw;
          }


          .token-button {
            font-size: 12px;
          }


          .hero-logo-wrapper .gitocx-logo {
            width: 88px;
            height: 88px;

            border-radius: 20px;
          }

        }


        /* =====================================================
           REDUCED MOTION
        ===================================================== */

        @media (prefers-reduced-motion: reduce) {

          .stars span,
          .floor-grid,
          .hero-content,
          .hero-logo-wrapper {
            animation: none !important;
          }

        }

      `}</style>
    </div>
  );
}