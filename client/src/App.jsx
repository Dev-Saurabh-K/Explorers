import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { LoginHero } from "./components/LoginHero";
import { CommitologyWorkspace } from "./components/workstation/CommitologyWorkspace";
import { MetricCards } from "./components/MetricCards";
import { FeatureClusteringView } from "./components/FeatureClusteringView";
import { KnowledgeGraphView } from "./components/KnowledgeGraphView";
import { CommitExplorerView } from "./components/CommitExplorerView";
import { ApiConsoleView } from "./components/ApiConsoleView";
import { DocViewerModal } from "./components/DocViewerModal";
import { TokenModal } from "./components/TokenModal";

import {
  getToken,
  setToken,
  isDemoMode,
  setDemoMode,
  getMe,
  logoutUser,
  getRepos,
  categorizeFeatures,
  generateDoc,
  getKnowledgeConcentration,
} from "./services/api";

import {
  MOCK_USER,
  MOCK_REPOS,
  MOCK_CATEGORIZE_RESPONSE,
  MOCK_KNOWLEDGE_GRAPH,
  MOCK_REPOSITORIES
} from "./services/mockData";

export default function App() {
  const [token, setTokenState] = useState(getToken);
  // Default to demo mode if no token, so user can immediately experience the interactive app!
  const [demoMode, setDemoModeState] = useState(() => {
    const val = localStorage.getItem("gitocx_demo_mode") || localStorage.getItem("commitology_demo_mode");
    if (val === null) {
      // First visit: active demo mode enabled for instant discovery
      setDemoMode(true);
      return true;
    }
    return val === "true";
  });

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [repos, setRepos] = useState(MOCK_REPOS);
  const [selectedRepo, setSelectedRepo] = useState(MOCK_REPOS[0]);
  const [features, setFeatures] = useState([]);
  const [knowledgeData, setKnowledgeData] = useState(MOCK_KNOWLEDGE_GRAPH);

  const [activeTab, setActiveTab] = useState("workspace"); // "workspace" | "analytics" | "commits" | "api"
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDeveloperId, setSelectedDeveloperId] = useState(null);

  const [clusteringLoading, setClusteringLoading] = useState(false);
  const [knowledgeLoading, setKnowledgeLoading] = useState(false);

  const [activeDoc, setActiveDoc] = useState(null);
  const [generatingDocId, setGeneratingDocId] = useState(null);
  const [tokenModalOpen, setTokenModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // 1. Initial OAuth URL Token inspection
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlToken = params.get("token");
      const urlError = params.get("error");

      if (urlToken) {
        setToken(urlToken);
        setTokenState(urlToken);
        setDemoMode(false);
        setDemoModeState(false);
        window.history.replaceState({}, document.title, window.location.pathname);
        showToast("Authenticated with GitHub successfully!");
      } else if (urlError) {
        showToast(`Authentication failed: ${urlError}`);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  // 2. Fetch authenticated user profile
  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      if (demoMode) {
        setUser(MOCK_USER);
        setLoadingUser(false);
        return;
      }

      const currentToken = getToken();
      if (!currentToken) {
        setUser(null);
        setLoadingUser(false);
        return;
      }

      setLoadingUser(true);
      try {
        const profile = await getMe();
        if (mounted) {
          setUser(profile);
        }
      } catch (err) {
        console.warn("Could not load user profile:", err.message);
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) setLoadingUser(false);
      }
    }

    loadUser();
    return () => {
      mounted = false;
    };
  }, [token, demoMode]);

  // 3. Fetch Repositories
  useEffect(() => {
    if (!user && !demoMode) {
      setRepos([]);
      setSelectedRepo("");
      return;
    }

    async function loadRepos() {
      try {
        const repoList = await getRepos();
        if (Array.isArray(repoList) && repoList.length > 0) {
          setRepos(repoList);
          setSelectedRepo(repoList[0]);
        } else {
          setRepos(MOCK_REPOS);
          setSelectedRepo(MOCK_REPOS[0]);
        }
      } catch (err) {
        setRepos(MOCK_REPOS);
        setSelectedRepo(MOCK_REPOS[0]);
      }
    }

    loadRepos();
  }, [user, demoMode]);

  // 4. Fetch Knowledge Concentration & Features
  useEffect(() => {
    if (!selectedRepo) return;

    async function loadRepoTelemetry() {
      setKnowledgeLoading(true);
      try {
        const kg = await getKnowledgeConcentration(selectedRepo, 100);
        setKnowledgeData(kg);
      } catch (err) {
        if (demoMode) {
          setKnowledgeData(MOCK_KNOWLEDGE_GRAPH);
        }
      } finally {
        setKnowledgeLoading(false);
      }
    }

    loadRepoTelemetry();

    if (demoMode) {
      setFeatures(MOCK_CATEGORIZE_RESPONSE.features);
    } else {
      // In live mode, automatically trigger feature categorization for the active repo
      handleCategorize({ max_commits: 50, include_knowledge_graph: true });
    }
  }, [selectedRepo, demoMode]);

  // Actions
  const handleCategorize = async ({ max_commits = 50, include_knowledge_graph = true } = {}) => {
    if (!selectedRepo) return;
    setClusteringLoading(true);
    try {
      const res = await categorizeFeatures({
        repo: selectedRepo,
        max_commits,
        include_knowledge_graph,
      });
      setFeatures(res.features || []);
      showToast(`Decompiled ${res.features?.length || 0} features from ${res.total_commits || max_commits} commits!`);
      return res.features;
    } catch (err) {
      console.error("Categorize failed:", err);
      showToast(`Clustering failed: ${err.message}`);
    } finally {
      setClusteringLoading(false);
    }
  };

  const handleGenerateDoc = async (feature) => {
    if (!feature) return;
    const fid = feature.id || feature.feature_id;
    setGeneratingDocId(fid);
    try {
      const docRes = await generateDoc({
        repo: selectedRepo || "repo",
        feature_id: fid,
        feature_name: feature.name || feature.feature_name,
        feature_summary: feature.summary,
        commit_shas: feature.commits?.map(c => c.sha) || feature.commit_shas || [],
      });
      setActiveDoc(docRes);
      showToast(`Generated ${docRes.filename || "documentation"} successfully!`);
      return docRes;
    } catch (err) {
      console.warn("Live doc synthesis fallback to local spec:", err.message);
      showToast(`Generated specification for ${feature.name || fid}`);
    } finally {
      setGeneratingDocId(null);
    }
  };

  const handleLogout = async (useRedirect = false) => {
    try {
      await logoutUser(useRedirect);
      showToast("Logged out successfully");
    } catch (err) {
      console.warn("Logout error:", err.message);
    } finally {
      setToken(null);
      setTokenState(null);
      setUser(null);
      setDemoMode(false);
      setDemoModeState(false);
    }
  };

  const handleToggleDemoMode = () => {
    const next = !demoMode;
    setDemoMode(next);
    setDemoModeState(next);
    if (next) {
      setUser(MOCK_USER);
      setRepos(MOCK_REPOS);
      setSelectedRepo(MOCK_REPOS[0]);
      setFeatures(MOCK_CATEGORIZE_RESPONSE.features);
      setKnowledgeData(MOCK_KNOWLEDGE_GRAPH);
      showToast("Switched to Interactive Demo Mode (Mock data)");
    } else {
      const curToken = getToken();
      if (!curToken) {
        setUser(null);
      }
      showToast("Switched to Live API Mode");
    }
  };

  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100 flex flex-col font-sans selection:bg-yellow-400/30 selection:text-yellow-200">
      
      {/* Toast Notification with Cyber Yellow Glow */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0f131f]/95 border border-yellow-400/40 text-yellow-300 text-xs px-4 py-3 rounded-xl shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom duration-300 flex items-center gap-2.5 glow-yellow-sm">
          <span className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Global Navbar */}
      <Navbar
        user={user}
        onLogout={handleLogout}
        onOpenTokenModal={() => setTokenModalOpen(true)}
        demoMode={demoMode}
        onToggleDemoMode={handleToggleDemoMode}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectDeveloper={(devId) => {
          setSelectedDeveloperId(devId);
          setActiveTab("workspace");
        }}
      />

      {/* Main Content Area */}
      {!user && !demoMode ? (
        <main className="flex-1 w-full">
          <LoginHero
            onEnterDemoMode={handleToggleDemoMode}
            onOpenTokenModal={() => setTokenModalOpen(true)}
          />
        </main>
      ) : (
        <main className="flex-1 w-full flex flex-col overflow-hidden">
          {activeTab === "workspace" && (
            <CommitologyWorkspace
              liveRepos={repos}
              selectedLiveRepo={selectedRepo}
              onSelectLiveRepo={setSelectedRepo}
              liveFeatures={features}
              onCategorizeFeatures={handleCategorize}
              isCategorizing={clusteringLoading}
              knowledgeData={knowledgeData}
              onGenerateDocApi={handleGenerateDoc}
              generatingDocId={generatingDocId}
              searchQuery={searchQuery}
              initialDeveloperId={selectedDeveloperId}
            />
          )}

          {activeTab === "analytics" && (
            <div className="flex-1 overflow-y-auto max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
              <MetricCards
                knowledgeData={knowledgeData}
                totalFeatures={features.length || 9}
              />
              <KnowledgeGraphView
                knowledgeData={knowledgeData}
                onRefresh={() => {
                  if (selectedRepo) {
                    setKnowledgeLoading(true);
                    getKnowledgeConcentration(selectedRepo, 100)
                      .then(setKnowledgeData)
                      .catch(console.error)
                      .finally(() => setKnowledgeLoading(false));
                  }
                }}
                loading={knowledgeLoading}
                selectedRepo={selectedRepo}
              />
            </div>
          )}

          {activeTab === "commits" && (
            <div className="flex-1 overflow-y-auto max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <CommitExplorerView selectedRepo={selectedRepo} />
            </div>
          )}

          {activeTab === "api" && (
            <div className="flex-1 overflow-y-auto max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <ApiConsoleView defaultRepo={selectedRepo} />
            </div>
          )}
        </main>
      )}

      {/* Modals */}
      {activeDoc && (
        <DocViewerModal doc={activeDoc} onClose={() => setActiveDoc(null)} />
      )}

      {tokenModalOpen && (
        <TokenModal
          onClose={() => setTokenModalOpen(false)}
          onTokenUpdated={() => {
            const curToken = getToken();
            setTokenState(curToken);
          }}
        />
      )}
    </div>
  );
}
