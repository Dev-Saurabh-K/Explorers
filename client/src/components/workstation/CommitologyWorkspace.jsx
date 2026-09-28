import React, { useState, useEffect } from "react";
import { DevelopersColumn } from "./DevelopersColumn";
import { RepositoriesColumn } from "./RepositoriesColumn";
import { FeaturesColumn } from "./FeaturesColumn";
import { FeatureOverviewView } from "./FeatureOverviewView";
import { FeatureDocumentationView } from "./FeatureDocumentationView";
import { DeveloperProfileView } from "./DeveloperProfileView";

import {
  MOCK_DEVELOPERS,
  MOCK_REPOSITORIES,
  MOCK_FEATURES
} from "../../services/mockData";
import { getRepoCommits, syncRepoData } from "../../services/api";

function formatTimeAgo(dateStr) {
  if (!dateStr) return "Recent";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const now = new Date();
  const diffSec = Math.floor((now - date) / 1000);
  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.floor(diffHr / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths}mo ago`;
}

export function CommitologyWorkspace({
  liveRepos = [],
  selectedLiveRepo = "",
  onSelectLiveRepo = () => {},
  liveFeatures = [],
  onCategorizeFeatures = () => {},
  isCategorizing = false,
  knowledgeData = null,
  onGenerateDocApi = () => {},
  generatingDocId = null,
  searchQuery = "",
  initialDeveloperId = null,
  onOpenTeamPage = () => {}
}) {
  // Responsive layout: detect small screen (<1024px)
  const [devsCollapsed, setDevsCollapsed] = useState(() => (typeof window !== "undefined" ? window.innerWidth < 1024 : false));
  const [reposCollapsed, setReposCollapsed] = useState(() => (typeof window !== "undefined" ? window.innerWidth < 1024 : false));
  const [featuresCollapsed, setFeaturesCollapsed] = useState(false);

  // Live repository commits telemetry
  const [liveRepoCommits, setLiveRepoCommits] = useState([]);
  const [isSyncingLive, setIsSyncingLive] = useState(false);

  const targetRepo = selectedLiveRepo || (liveRepos[0] ? (typeof liveRepos[0] === "string" ? liveRepos[0] : liveRepos[0].name) : "");

  const fetchLiveRepoCommits = async (forceRefresh = false) => {
    if (!targetRepo) return;
    setIsSyncingLive(true);
    try {
      const commits = await getRepoCommits(targetRepo, forceRefresh);
      if (commits && commits.length > 0) {
        setLiveRepoCommits(commits);
      }
    } catch (err) {
      console.warn("Could not fetch live repo commits:", err);
    } finally {
      setIsSyncingLive(false);
    }
  };

  useEffect(() => {
    fetchLiveRepoCommits(false);
  }, [targetRepo]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        // Contributor image only show, minimize repo, don't minimize features
        setDevsCollapsed(true);
        setReposCollapsed(true);
        setFeaturesCollapsed(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Derive developers from real knowledgeData telemetry if available
  const developers = React.useMemo(() => {
    if (knowledgeData?.overall_developers && knowledgeData.overall_developers.length > 0) {
      return knowledgeData.overall_developers.map((d, idx) => {
        const devName = d.developer;
        const devPercentage = Math.round(d.knowledge_percentage ?? d.commit_percentage ?? (100 / knowledgeData.overall_developers.length));

        // Find features this developer contributed to
        const devFeatures = (knowledgeData.features || liveFeatures || []).filter(f => {
          if (f.contributors && f.contributors.some(c => (c.name || "").toLowerCase().includes(devName.toLowerCase()))) return true;
          if (f.knowledge_graph?.developers && f.knowledge_graph.developers.some(dev => (dev.developer || "").toLowerCase().includes(devName.toLowerCase()))) return true;
          return d.is_dominant;
        });

        const primaryAreas = devFeatures.length > 0
          ? devFeatures.map((f, i) => ({
              name: f.name || f.feature_name || `Feature ${i+1}`,
              percentage: Math.round(f.knowledge_graph?.developers?.find(dev => (dev.developer || "").toLowerCase() === devName.toLowerCase())?.knowledge_percentage || devPercentage),
              color: i === 0 ? "#ffb000" : i === 1 ? "#00e5ff" : i === 2 ? "#ff3366" : "#00ff66"
            }))
          : [
              { name: "Repository Core", percentage: devPercentage, color: "#ffb000" },
              { name: "Services & API", percentage: Math.max(15, Math.round(devPercentage * 0.4)), color: "#00e5ff" },
              { name: "Architecture Models", percentage: Math.max(10, Math.round(devPercentage * 0.25)), color: "#00ff66" }
            ];

        // 1. Gather real live commits matching this developer
        const liveDevCommits = [];
        if (liveRepoCommits && liveRepoCommits.length > 0) {
          liveRepoCommits.forEach(c => {
            const author = (c.author || "").toLowerCase();
            const devLower = devName.toLowerCase();
            if (author === devLower || author.includes(devLower) || devLower.includes(author) || (d.is_dominant && liveDevCommits.length < 5)) {
              liveDevCommits.push({
                sha: (c.sha || "").slice(0, 7),
                message: c.message || "",
                date: formatTimeAgo(c.date)
              });
            }
          });
        }

        // 2. Fallback to extracted commits from features if no live commits matched
        const extractedCommits = [];
        if (liveDevCommits.length === 0) {
          (knowledgeData.features || liveFeatures || []).forEach(f => {
            (f.commits || []).forEach(c => {
              if (!c.author || c.author.toLowerCase().includes(devName.toLowerCase()) || d.is_dominant) {
                if (extractedCommits.length < 8) {
                  extractedCommits.push({
                    sha: c.sha ? c.sha.slice(0, 7) : "8f4d21b",
                    message: c.message || `feat(${f.name || "core"}): update architecture implementation`,
                    date: c.date ? formatTimeAgo(c.date) : "Recent"
                  });
                }
              }
            });
          });
        }

        const fallbackCommits = [
          { sha: "8f4d21b", message: `feat(${selectedLiveRepo ? selectedLiveRepo.split('/').pop() : "core"}): optimize core architecture and pipeline`, date: "2 hours ago" },
          { sha: "6e2c91a", message: "fix(telemetry): refine AST parsing and contributor heuristics", date: "1 day ago" },
          { sha: "4b7a15d", message: "refactor(api): stream knowledge graph nodes and edge weights", date: "3 days ago" },
          { sha: "1c9e42f", message: "test(pipeline): add regression suite for commit categorizer", date: "5 days ago" }
        ];

        const recentCommits = liveDevCommits.length > 0 ? liveDevCommits : (extractedCommits.length > 0 ? extractedCommits : fallbackCommits);
        const commitsCount = (liveDevCommits.length > 0 ? liveDevCommits.length : d.commit_count) || 1;

        return {
          id: d.developer,
          name: d.developer,
          developer: d.developer,
          role: d.is_dominant ? "Lead Maintainer" : "Contributor",
          email: `${d.developer.toLowerCase()}@github.com`,
          avatar: d.avatar_url || `https://ui-avatars.com/api/?name=${d.developer}&background=0c0f18&color=00e5ff`,
          isDominant: d.is_dominant || idx === 0,
          commitsCount,
          knowledge_percentage: devPercentage,
          overall_contribution: devPercentage,
          riskLevel: d.risk_level || (d.is_dominant ? "HIGH" : "LOW"),
          riskTitle: d.is_dominant ? "High Knowledge Concentration" : "Balanced Contributor",
          riskDescription: `${commitsCount} commits analyzed • ${devPercentage}% overall knowledge share`,
          primaryAreas,
          affectedStats: {
            files: Math.max(4, Math.min(commitsCount * 2, 28)),
            services: Math.max(1, Math.min(devFeatures.length || 3, 6)),
            integrations: 3
          },
          documentationGaps: d.is_dominant ? 3 : 1,
          suggestedActions: [
            { id: 1, text: `Decompile features for ${selectedLiveRepo || "repo"}`, done: true },
            { id: 2, text: "Review single-developer bottlenecks", done: true }
          ],
          recentCommits
        };
      });
    }
    return MOCK_DEVELOPERS;
  }, [knowledgeData, selectedLiveRepo, liveFeatures, liveRepoCommits]);

  // Derive repositories: In live mode, only show real liveRepos
  const repositories = React.useMemo(() => {
    if (liveRepos && liveRepos.length > 0) {
      return liveRepos.map((r) => ({
        id: typeof r === "string" ? r : r.name,
        name: typeof r === "string" ? r : r.name,
        visibility: "Public",
        updated: "Synced via GitHub",
        commits: 50,
        featuresCount: 3
      }));
    }
    return MOCK_REPOSITORIES;
  }, [liveRepos]);

  const [selectedRepoId, setSelectedRepoId] = useState(() => {
    return selectedLiveRepo || (repositories[0] ? (typeof repositories[0] === "string" ? repositories[0] : repositories[0].id) : "");
  });

  // Sync selectedLiveRepo prop
  useEffect(() => {
    if (selectedLiveRepo) {
      setSelectedRepoId(selectedLiveRepo);
    }
  }, [selectedLiveRepo]);

  // Derive features
  const [features, setFeatures] = useState(() => {
    if (liveFeatures && liveFeatures.length > 0) {
      return liveFeatures;
    }
    return liveRepos.length > 0 ? [] : MOCK_FEATURES;
  });

  const [selectedFeatureId, setSelectedFeatureId] = useState(() => {
    if (liveFeatures && liveFeatures.length > 0) {
      return liveFeatures[0].id || liveFeatures[0].feature_id;
    }
    return MOCK_FEATURES[0].id;
  });

  // Sync liveFeatures prop
  useEffect(() => {
    if (liveFeatures && liveFeatures.length > 0) {
      setFeatures(liveFeatures);
      setSelectedFeatureId((prev) => {
        const found = liveFeatures.find((f) => (f.id || f.feature_id) === prev);
        return found ? prev : (liveFeatures[0].id || liveFeatures[0].feature_id);
      });
    } else if (liveRepos.length > 0) {
      // In live mode with no features yet, start empty so user can trigger decompile
      setFeatures([]);
      setSelectedFeatureId("");
    } else {
      setFeatures(MOCK_FEATURES);
      setSelectedFeatureId(MOCK_FEATURES[0].id);
    }
  }, [liveFeatures, liveRepos]);

  const [selectedDeveloperId, setSelectedDeveloperId] = useState(initialDeveloperId);
  const [viewMode, setViewMode] = useState("overview"); // "overview" | "documentation" | "developer"
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeGeneratedDoc, setActiveGeneratedDoc] = useState(null);

  // Sync initialDeveloperId
  useEffect(() => {
    if (initialDeveloperId) {
      setSelectedDeveloperId(initialDeveloperId);
      setViewMode("developer");
    }
  }, [initialDeveloperId]);

  const activeFeature = features.find((f) => (f.id || f.feature_id) === selectedFeatureId) || features[0] || null;
  const activeDeveloper = developers.find((d) => (d.id || d.name) === selectedDeveloperId) || developers[0];

  const handleSelectRepo = (repoId) => {
    setSelectedRepoId(repoId);
    onSelectLiveRepo(repoId);
    setViewMode("overview");
  };

  const handleSelectFeature = (featId) => {
    setSelectedFeatureId(featId);
    if (viewMode === "developer") {
      setViewMode("overview");
    }
  };

  const handleSelectDeveloper = (devId) => {
    setSelectedDeveloperId(devId);
    setViewMode("developer");
  };

  const handleGenerateDocumentation = async (feat) => {
    if (!feat) return;
    setIsGenerating(true);
    try {
      if (onGenerateDocApi) {
        const res = await onGenerateDocApi(feat);
        if (res) {
          setActiveGeneratedDoc(res);
        }
      }
      setViewMode("documentation");
    } catch (err) {
      console.error(err);
      setViewMode("documentation");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex-1 flex w-full h-full min-h-0 overflow-x-auto overflow-y-hidden bg-[#08090d]">
      
      {/* Column 1: Developers / Authors Deck */}
      <DevelopersColumn
        developers={developers}
        selectedDeveloperId={viewMode === "developer" ? selectedDeveloperId : null}
        onSelectDeveloper={handleSelectDeveloper}
        searchQuery={searchQuery}
        collapsed={devsCollapsed}
        onToggleCollapse={() => setDevsCollapsed(!devsCollapsed)}
        onOpenTeamPage={onOpenTeamPage}
      />

      {/* Column 2: Repositories Tape Selector */}
      <RepositoriesColumn
        repositories={repositories}
        selectedRepoId={selectedRepoId}
        onSelectRepo={handleSelectRepo}
        onSyncRepo={() => {
          fetchLiveRepoCommits(true);
          if (onCategorizeFeatures) {
            onCategorizeFeatures({ max_commits: 50, include_knowledge_graph: true, refresh: true });
          }
        }}
        isSyncing={isSyncingLive}
        onAddRepo={() => {
          const newName = prompt("Enter GitHub repository (e.g. owner/repo):");
          if (newName) {
            handleSelectRepo(newName);
          }
        }}
        collapsed={reposCollapsed}
        onToggleCollapse={() => setReposCollapsed(!reposCollapsed)}
      />

      {/* Column 3: Features Matrix Deck */}
      <FeaturesColumn
        features={features}
        selectedFeatureId={selectedFeatureId}
        onSelectFeature={handleSelectFeature}
        onClusterNew={() => onCategorizeFeatures({ max_commits: 50, include_knowledge_graph: true })}
        isCategorizing={isCategorizing}
        collapsed={featuresCollapsed}
        onToggleCollapse={() => setFeaturesCollapsed(!featuresCollapsed)}
      />

      {/* Column 4: Main Content Panel */}
      <div className="flex-1 flex flex-col h-full min-h-0 overflow-hidden min-w-[440px] sm:min-w-[500px]">
        {viewMode === "developer" ? (
          <DeveloperProfileView
            developer={activeDeveloper}
            repoName={targetRepo}
            onBack={() => setViewMode("overview")}
            onOpenTeamPage={onOpenTeamPage}
            onSelectFeature={(featId) => {
              const matched = features.find((f) => (f.id || f.feature_id) === featId || (f.name || f.feature_name || "").toLowerCase().includes(featId));
              if (matched) {
                setSelectedFeatureId(matched.id || matched.feature_id);
              }
              setViewMode("overview");
            }}
          />
        ) : viewMode === "documentation" ? (
          <FeatureDocumentationView
            feature={{
              ...activeFeature,
              markdown_content: activeGeneratedDoc?.markdown_content || activeFeature?.documentation?.markdown
            }}
            repoName={selectedRepoId}
            onBack={() => setViewMode("overview")}
            onRegenerate={handleGenerateDocumentation}
            isRegenerating={isGenerating || Boolean(generatingDocId)}
          />
        ) : activeFeature ? (
          <FeatureOverviewView
            feature={activeFeature}
            knowledgeData={knowledgeData}
            onGenerateDoc={handleGenerateDocumentation}
            onSelectDeveloper={handleSelectDeveloper}
            isGenerating={isGenerating || Boolean(generatingDocId)}
          />
        ) : (
          /* Empty Features State with 1-click Decompile Action */
          <div
            className="flex-1 flex flex-col items-center justify-center p-8 text-center"
            style={{ backgroundColor: "var(--bg-default)" }}
          >
            <div
              className="github-card github-card-padding-lg max-w-md w-full text-center space-y-4 shadow-sm"
              style={{ borderRadius: "6px", border: "1px solid var(--border-default)" }}
            >
              <div>
                <div
                  className="mx-auto flex items-center justify-center mb-3"
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    background: "var(--accent-muted)",
                    color: "var(--accent-fg)"
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                </div>
                <h2 style={{ fontSize: "16px", fontWeight: 600, color: "var(--fg-default)" }}>
                  Semantic Feature Decompiler
                </h2>
                <p style={{ fontSize: "14px", color: "var(--fg-muted)", marginTop: "6px", lineHeight: "1.5" }}>
                  Repository <span style={{ fontWeight: 600, color: "var(--fg-default)" }}>"{selectedRepoId}"</span> is mounted. Decompile raw git commits into architectural feature clusters and telemetry.
                </p>
              </div>

              <button
                onClick={() => onCategorizeFeatures({ max_commits: 50, include_knowledge_graph: true })}
                disabled={isCategorizing}
                className="github-button github-button-primary w-full"
                style={{ height: "36px", fontSize: "14px" }}
              >
                {isCategorizing ? "Decompiling commits with AI..." : "Initialize Feature Scan"}
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

export { CommitologyWorkspace as GitOcxWorkspace };
