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
  initialDeveloperId = null
}) {
  // Responsive layout: detect small screen (<1024px)
  const [devsCollapsed, setDevsCollapsed] = useState(() => (typeof window !== "undefined" ? window.innerWidth < 1024 : false));
  const [reposCollapsed, setReposCollapsed] = useState(() => (typeof window !== "undefined" ? window.innerWidth < 1024 : false));
  const [featuresCollapsed, setFeaturesCollapsed] = useState(false);

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

        // Gather real commits or formatted fallback commits
        const extractedCommits = [];
        (knowledgeData.features || liveFeatures || []).forEach(f => {
          (f.commits || []).forEach(c => {
            if (!c.author || c.author.toLowerCase().includes(devName.toLowerCase()) || d.is_dominant) {
              if (extractedCommits.length < 8) {
                extractedCommits.push({
                  sha: c.sha ? c.sha.slice(0, 7) : "8f4d21b",
                  message: c.message || `feat(${f.name || "core"}): update architecture implementation`,
                  date: c.date || "Recent"
                });
              }
            }
          });
        });

        const fallbackCommits = [
          { sha: "8f4d21b", message: `feat(${selectedLiveRepo ? selectedLiveRepo.split('/').pop() : "core"}): optimize core architecture and pipeline`, date: "2 hours ago" },
          { sha: "6e2c91a", message: "fix(telemetry): refine AST parsing and contributor heuristics", date: "1 day ago" },
          { sha: "4b7a15d", message: "refactor(api): stream knowledge graph nodes and edge weights", date: "3 days ago" },
          { sha: "1c9e42f", message: "test(pipeline): add regression suite for commit categorizer", date: "5 days ago" }
        ];

        const recentCommits = extractedCommits.length > 0 ? extractedCommits : fallbackCommits;

        return {
          id: d.developer,
          name: d.developer,
          developer: d.developer,
          role: d.is_dominant ? "Lead Maintainer" : "Contributor",
          email: `${d.developer.toLowerCase()}@github.com`,
          avatar: d.avatar_url || `https://ui-avatars.com/api/?name=${d.developer}&background=0c0f18&color=00e5ff`,
          isDominant: d.is_dominant || idx === 0,
          commitsCount: d.commit_count || 1,
          knowledge_percentage: devPercentage,
          overall_contribution: devPercentage,
          riskLevel: d.risk_level || (d.is_dominant ? "HIGH" : "LOW"),
          riskTitle: d.is_dominant ? "High Knowledge Concentration" : "Balanced Contributor",
          riskDescription: `${d.commit_count} commits analyzed • ${devPercentage}% overall knowledge share`,
          primaryAreas,
          affectedStats: {
            files: Math.max(4, Math.min((d.commit_count || 1) * 2, 28)),
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
  }, [knowledgeData, selectedLiveRepo, liveFeatures]);

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
      />

      {/* Column 2: Repositories Tape Selector */}
      <RepositoriesColumn
        repositories={repositories}
        selectedRepoId={selectedRepoId}
        onSelectRepo={handleSelectRepo}
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
            onBack={() => setViewMode("overview")}
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
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center font-mono bg-[#080a0f]">
            <div className="p-4 rounded-2xl bg-black border border-[#00e5ff]/40 shadow-[0_0_25px_rgba(0,229,255,0.15)] max-w-md w-full space-y-4">
              <div className="text-center">
                <span className="text-3xl">⚡</span>
                <h2 className="text-sm font-black text-white uppercase tracking-wider mt-2">
                  Semantic Feature Decompiler Ready
                </h2>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Repository <span className="text-[#00e5ff] font-bold">"{selectedRepoId}"</span> is mounted. Decompile raw git commits into functional architecture features.
                </p>
              </div>

              <button
                onClick={() => onCategorizeFeatures({ max_commits: 50, include_knowledge_graph: true })}
                disabled={isCategorizing}
                className="w-full py-3 bg-[#ffb000] hover:bg-[#00ff66] text-black font-black uppercase tracking-wider text-xs rounded border border-white shadow-[2px_2px_0px_#000] transition active:translate-x-0.5 active:translate-y-0.5"
              >
                {isCategorizing ? "[DECOMPILING COMMITS VIA GEMINI 2.5 FLASH...]" : "► INITIALIZE CLUSTER SCAN"}
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

export { CommitologyWorkspace as GitOcxWorkspace };
