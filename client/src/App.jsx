import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { MetricCards } from "./components/MetricCards";
import { FeatureClusteringView } from "./components/FeatureClusteringView";
import { KnowledgeGraphView } from "./components/KnowledgeGraphView";
import { CommitExplorerView } from "./components/CommitExplorerView";
import { ApiConsoleView } from "./components/ApiConsoleView";
import { DocViewerModal } from "./components/DocViewerModal";
import { TokenModal } from "./components/TokenModal";
import { LoginHero } from "./components/LoginHero";

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
} from "./services/mockData";

export default function App() {
  const [token, setTokenState] = useState(getToken);
  const [demoMode, setDemoModeState] = useState(isDemoMode);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState("");
  const [features, setFeatures] = useState([]);
  const [knowledgeData, setKnowledgeData] = useState(null);

  const [activeTab, setActiveTab] = useState("features");
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

  // 3. Fetch Repositories when user is authenticated or demo mode active
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
          setRepos(["octocat/Hello-World"]);
          setSelectedRepo("octocat/Hello-World");
        }
      } catch (err) {
        console.error("Failed to fetch repos:", err);
        // Fallback to sample repo
        setRepos(["octocat/Hello-World"]);
        setSelectedRepo("octocat/Hello-World");
      }
    }

    loadRepos();
  }, [user, demoMode]);

  // 4. Fetch Knowledge Concentration & initial Features when selectedRepo changes
  useEffect(() => {
    if (!selectedRepo) return;

    async function loadRepoTelemetry() {
      setKnowledgeLoading(true);
      try {
        const kg = await getKnowledgeConcentration(selectedRepo, 100);
        setKnowledgeData(kg);
      } catch (err) {
        console.warn("Could not fetch knowledge concentration:", err.message);
        if (demoMode) {
          setKnowledgeData(MOCK_KNOWLEDGE_GRAPH);
        }
      } finally {
        setKnowledgeLoading(false);
      }
    }

    loadRepoTelemetry();

    // If demo mode, populate features
    if (demoMode) {
      setFeatures(MOCK_CATEGORIZE_RESPONSE.features);
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
      showToast(`Successfully clustered ${res.features?.length || 0} features from ${res.total_commits || max_commits} commits!`);
    } catch (err) {
      console.error("Categorize failed:", err);
      showToast(`Clustering failed: ${err.message}`);
    } finally {
      setClusteringLoading(false);
    }
  };

  const handleGenerateDoc = async (feature) => {
    if (!selectedRepo || !feature) return;
    setGeneratingDocId(feature.feature_id);
    try {
      const docRes = await generateDoc({
        repo: selectedRepo,
        feature_id: feature.feature_id,
        feature_name: feature.feature_name,
        feature_summary: feature.summary,
        commit_shas: feature.commit_shas,
      });
      setActiveDoc(docRes);
      showToast(`Generated ${docRes.filename} successfully!`);
    } catch (err) {
      console.error("Generate doc failed:", err);
      showToast(`Doc synthesis failed: ${err.message}`);
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
      showToast("Switched to Offline Demo Mode with mock data");
    } else {
      const curToken = getToken();
      if (!curToken) {
        setUser(null);
      }
      showToast("Switched to Live API Mode");
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-cyan-500/40 text-cyan-200 text-xs px-4 py-2.5 rounded-xl shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom duration-300 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Navbar */}
      <Navbar
        user={user}
        repos={repos}
        selectedRepo={selectedRepo}
        onSelectRepo={setSelectedRepo}
        onLogout={handleLogout}
        onOpenTokenModal={() => setTokenModalOpen(true)}
        demoMode={demoMode}
        onToggleDemoMode={handleToggleDemoMode}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!user && !demoMode ? (
          <LoginHero
            onEnterDemoMode={handleToggleDemoMode}
            onOpenTokenModal={() => setTokenModalOpen(true)}
          />
        ) : (
          <div className="space-y-6">
            
            {/* Top Metric Cards */}
            <MetricCards
              knowledgeData={knowledgeData}
              totalFeatures={features.length}
            />

            {/* Tab Views */}
            {activeTab === "features" && (
              <FeatureClusteringView
                features={features}
                loading={clusteringLoading}
                onCategorize={handleCategorize}
                onGenerateDoc={handleGenerateDoc}
                generatingDocId={generatingDocId}
                selectedRepo={selectedRepo}
              />
            )}

            {activeTab === "knowledge" && (
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
            )}

            {activeTab === "commits" && (
              <CommitExplorerView selectedRepo={selectedRepo} />
            )}

            {activeTab === "api-explorer" && (
              <ApiConsoleView defaultRepo={selectedRepo} />
            )}
          </div>
        )}
      </main>

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
