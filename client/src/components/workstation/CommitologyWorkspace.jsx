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
  onGenerateDocApi = () => {},
  generatingDocId = null,
  searchQuery = "",
  initialDeveloperId = null
}) {
  // Merge mock data with any live repos/features if present
  const [developers, setDevelopers] = useState(MOCK_DEVELOPERS);
  const [repositories, setRepositories] = useState(() => {
    if (liveRepos && liveRepos.length > 0) {
      // Merge live repos with mock repositories
      const liveItems = liveRepos.map((r) => ({
        id: typeof r === "string" ? r : r.name,
        name: typeof r === "string" ? r : r.name,
        visibility: "Public",
        updated: "Live repository",
        commits: 50,
        featuresCount: 3
      }));
      const seen = new Set();
      return [...liveItems, ...MOCK_REPOSITORIES].filter((item) => {
        if (seen.has(item.name)) return false;
        seen.add(item.name);
        return true;
      });
    }
    return MOCK_REPOSITORIES;
  });

  const [selectedRepoId, setSelectedRepoId] = useState(() => {
    return selectedLiveRepo || MOCK_REPOSITORIES[0].id;
  });

  const [features, setFeatures] = useState(() => {
    if (liveFeatures && liveFeatures.length > 0) {
      return liveFeatures.map((f, idx) => ({
        id: f.feature_id || `feat-${idx}`,
        name: f.feature_name || f.name,
        summary: f.summary,
        commitsCount: f.commit_count || f.commit_shas?.length || 10,
        filesCount: f.primary_files_hint?.length || 4,
        servicesCount: 3,
        integrationsCount: 2,
        riskLevel: f.knowledge_graph?.risk_level || "MEDIUM",
        riskBadge: f.knowledge_graph?.risk_summary || "Moderate concentration",
        icon: idx % 3 === 0 ? "Lock" : idx % 3 === 1 ? "CreditCard" : "Package",
        contributors: f.knowledge_graph?.developers?.map((d) => ({
          name: d.developer,
          percentage: Math.round(d.commit_percentage || d.knowledge_percentage || 50),
          commits: d.commit_count || 5,
          color: d.color || "#facc15",
          avatar: d.avatar_url || `https://ui-avatars.com/api/?name=${d.developer}&background=facc15&color=090a0f`
        })) || MOCK_FEATURES[0].contributors,
        documentation: MOCK_FEATURES[0].documentation
      }));
    }
    return MOCK_FEATURES;
  });

  const [selectedFeatureId, setSelectedFeatureId] = useState(MOCK_FEATURES[0].id);
  const [selectedDeveloperId, setSelectedDeveloperId] = useState(initialDeveloperId);
  const [viewMode, setViewMode] = useState("overview"); // "overview" | "documentation" | "developer"
  const [isGenerating, setIsGenerating] = useState(false);

  // Sync developer selection prop
  useEffect(() => {
    if (initialDeveloperId) {
      setSelectedDeveloperId(initialDeveloperId);
      setViewMode("developer");
    }
  }, [initialDeveloperId]);

  // Sync live repos
  useEffect(() => {
    if (liveRepos && liveRepos.length > 0) {
      const liveItems = liveRepos.map((r) => ({
        id: typeof r === "string" ? r : r.name,
        name: typeof r === "string" ? r : r.name,
        visibility: "Public",
        updated: "Live repository",
        commits: 50,
        featuresCount: 3
      }));
      setRepositories((prev) => {
        const seen = new Set();
        return [...liveItems, ...prev].filter((item) => {
          if (seen.has(item.name)) return false;
          seen.add(item.name);
          return true;
        });
      });
    }
  }, [liveRepos]);

  // Sync live features
  useEffect(() => {
    if (liveFeatures && liveFeatures.length > 0) {
      const mapped = liveFeatures.map((f, idx) => ({
        id: f.feature_id || `feat-${idx}`,
        name: f.feature_name || f.name,
        summary: f.summary,
        commitsCount: f.commit_count || f.commit_shas?.length || 10,
        filesCount: f.primary_files_hint?.length || 4,
        servicesCount: 3,
        integrationsCount: 2,
        riskLevel: f.knowledge_graph?.risk_level || "MEDIUM",
        riskBadge: f.knowledge_graph?.risk_summary || "Moderate concentration",
        icon: idx % 3 === 0 ? "Lock" : idx % 3 === 1 ? "CreditCard" : "Package",
        contributors: f.knowledge_graph?.developers?.map((d) => ({
          name: d.developer,
          percentage: Math.round(d.commit_percentage || d.knowledge_percentage || 50),
          commits: d.commit_count || 5,
          color: d.color || "#facc15",
          avatar: d.avatar_url || `https://ui-avatars.com/api/?name=${d.developer}&background=facc15&color=090a0f`
        })) || MOCK_FEATURES[0].contributors,
        documentation: MOCK_FEATURES[0].documentation
      }));
      setFeatures(mapped);
      if (mapped.length > 0) {
        setSelectedFeatureId(mapped[0].id);
      }
    }
  }, [liveFeatures]);

  const activeFeature = features.find((f) => f.id === selectedFeatureId) || features[0];
  const activeDeveloper = developers.find((d) => d.id === selectedDeveloperId) || developers[0];

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
    setIsGenerating(true);
    try {
      if (onGenerateDocApi) {
        await onGenerateDocApi(feat);
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
    <div className="flex-1 flex w-full h-[calc(100vh-3.5rem)] overflow-hidden bg-[#08090d]">
      
      {/* Column 1: Developers */}
      <DevelopersColumn
        developers={developers}
        selectedDeveloperId={viewMode === "developer" ? selectedDeveloperId : null}
        onSelectDeveloper={handleSelectDeveloper}
        searchQuery={searchQuery}
      />

      {/* Column 2: Repositories */}
      <RepositoriesColumn
        repositories={repositories}
        selectedRepoId={selectedRepoId}
        onSelectRepo={handleSelectRepo}
        onAddRepo={() => {
          const newName = prompt("Enter GitHub repository (e.g. facebook/react):");
          if (newName) {
            const newRepo = {
              id: newName,
              name: newName,
              visibility: "Public",
              updated: "Imported just now",
              commits: 40,
              featuresCount: 3
            };
            setRepositories([newRepo, ...repositories]);
            handleSelectRepo(newName);
          }
        }}
      />

      {/* Column 3: Features */}
      <FeaturesColumn
        features={features}
        selectedFeatureId={selectedFeatureId}
        onSelectFeature={handleSelectFeature}
        onClusterNew={() => {
          alert("Triggering Gemini AI clustering pipeline across git commit diffs...");
        }}
      />

      {/* Column 4: Main Content Panel */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {viewMode === "developer" ? (
          <DeveloperProfileView
            developer={activeDeveloper}
            onBack={() => setViewMode("overview")}
            onSelectFeature={(featId) => {
              const matched = features.find((f) => f.id === featId || f.name.toLowerCase().includes(featId));
              if (matched) {
                setSelectedFeatureId(matched.id);
              }
              setViewMode("overview");
            }}
          />
        ) : viewMode === "documentation" ? (
          <FeatureDocumentationView
            feature={activeFeature}
            repoName={selectedRepoId}
            onBack={() => setViewMode("overview")}
            onRegenerate={handleGenerateDocumentation}
            isRegenerating={isGenerating || Boolean(generatingDocId)}
          />
        ) : (
          <FeatureOverviewView
            feature={activeFeature}
            onGenerateDoc={handleGenerateDocumentation}
            onSelectDeveloper={handleSelectDeveloper}
            isGenerating={isGenerating || Boolean(generatingDocId)}
          />
        )}
      </div>

    </div>
  );
}
