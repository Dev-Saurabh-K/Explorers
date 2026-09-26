import React, { Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an unhandled error:", error, errorInfo);
  }

  handleReset = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("gitocx_demo_mode");
    localStorage.removeItem("commitology_demo_mode");
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-screen bg-[#08090d] text-slate-100 flex flex-col items-center justify-center p-6 font-mono selection:bg-yellow-400/30">
          <div className="max-w-md w-full bg-[#0f131f] border border-red-500/30 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
              <h1 className="text-base font-bold text-red-400">APPLICATION RUNTIME RECOVERY</h1>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              An unexpected render error occurred:
            </p>
            <div className="p-3 bg-black/60 border border-white/5 rounded-xl text-[11px] text-red-300 font-mono overflow-x-auto max-h-36">
              {this.state.error?.message || "Unknown client error"}
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 py-2 px-4 bg-[#00ff66]/10 border border-[#00ff66]/40 hover:bg-[#00ff66] hover:text-black text-[#00ff66] rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Reload Page
              </button>
              <button
                onClick={this.handleReset}
                className="flex-1 py-2 px-4 bg-yellow-400/10 border border-yellow-400/40 hover:bg-yellow-400 hover:text-black text-yellow-300 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Reset Session
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
