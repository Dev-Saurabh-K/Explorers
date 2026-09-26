import {
  MOCK_USER,
  MOCK_REPOS,
  MOCK_COMMITS,
  MOCK_CONTRIBUTORS,
  MOCK_CATEGORIZE_RESPONSE,
  MOCK_KNOWLEDGE_GRAPH,
  MOCK_GENERATE_DOC_RESPONSE,
  MOCK_DEVELOPERS,
} from "./mockData";

function resolveApiBaseUrl() {
  const value = String(import.meta.env.VITE_API_BASE_URL || "")
    .trim()
    .replace(/\/+$/, "");
  return value || "http://localhost:8000";
}

export const API_BASE_URL = resolveApiBaseUrl();

// Helper to retrieve token
export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function setToken(token) {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
}

export function isDemoMode() {
  if (typeof window === "undefined") return false;
  return (localStorage.getItem("gitocx_demo_mode") || localStorage.getItem("commitology_demo_mode")) === "false";
}

export function setDemoMode(enabled) {
  if (typeof window === "undefined") return;
  localStorage.setItem("gitocx_demo_mode", enabled ? "true" : "false");
}

export async function apiRequest(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include", // For cookie fallback
  });

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status} ${response.statusText}`;
    try {
      const errorJson = await response.json();
      if (errorJson?.detail) {
        errorMessage = errorJson.detail;
      }
    } catch {
      // Body not JSON
    }

    if (response.status === 401 && !endpoint.includes("/auth/logout")) {
      // Don't auto-redirect if in demo mode
      if (!isDemoMode()) {
        setToken(null);
      }
    }

    const error = new Error(errorMessage);
    error.status = response.status;
    throw error;
  }

  return response.json();
}

// System Health
export async function checkHealth() {
  if (isDemoMode()) {
    return { message: "API is running (Demo Mode active)" };
  }
  return apiRequest("/");
}

// Auth
export async function getMe() {
  if (isDemoMode()) {
    return MOCK_USER;
  }
  return apiRequest("/auth/me");
}

export async function logoutUser(useRedirect = false) {
  if (useRedirect) {
    setToken(null);
    window.location.href = `${API_BASE_URL}/auth/logout?redirect=true`;
    return;
  }
  try {
    const res = await apiRequest("/auth/logout", { method: "POST" });
    setToken(null);
    return res;
  } catch (err) {
    setToken(null);
    throw err;
  }
}

// GitHub Data
export async function getRepos(refresh = false) {
  if (isDemoMode()) {
    return MOCK_REPOS;
  }
  return apiRequest(`/github/repos${refresh ? "?refresh=true" : ""}`);
}

export const MOCK_REPO_NAMES = [
  "ecommerce-platform",
  "auth-microservice",
  "analytics-pipeline",
  "payment-gateway"
];

export function isMockRepo(repo) {
  if (!repo) return true;
  return MOCK_REPO_NAMES.includes(repo) || !repo.includes("/");
}

export async function getRepoCommits(repo, refresh = false) {
  if (isDemoMode() || isMockRepo(repo)) {
    return MOCK_COMMITS;
  }
  return apiRequest(`/github/repo/commits?repo=${encodeURIComponent(repo)}${refresh ? "&refresh=true" : ""}`);
}

export async function getRepoContributors(repo, refresh = false) {
  if (isDemoMode() || isMockRepo(repo)) {
    return MOCK_CONTRIBUTORS;
  }
  return apiRequest(`/github/repo/contributors?repo=${encodeURIComponent(repo)}${refresh ? "&refresh=true" : ""}`);
}

export async function getContributorCommits(repo, contributor, refresh = false) {
  if (isDemoMode() || isMockRepo(repo)) {
    return MOCK_COMMITS.filter((c) => c.author.toLowerCase().includes(contributor.toLowerCase()));
  }
  return apiRequest(
    `/github/repo/contributor/commits?repo=${encodeURIComponent(repo)}&contributor=${encodeURIComponent(contributor)}${refresh ? "&refresh=true" : ""}`
  );
}

// AI Endpoints
export async function categorizeFeatures({ repo, max_commits = 50, include_knowledge_graph = true, refresh = false } = {}) {
  if (isDemoMode() || isMockRepo(repo)) {
    // Simulate slight delay for realistic experience
    await new Promise((r) => setTimeout(r, 400));
    return {
      ...MOCK_CATEGORIZE_RESPONSE,
      repo,
    };
  }
  return apiRequest(`/ai/features/categorize${refresh ? "?refresh=true" : ""}`, {
    method: "POST",
    body: JSON.stringify({
      repo,
      max_commits,
      include_knowledge_graph,
    }),
  });
}

export async function generateDoc({ repo, feature_id, feature_name, feature_summary, commit_shas }) {
  if (isDemoMode() || isMockRepo(repo)) {
    await new Promise((r) => setTimeout(r, 600));
    return {
      ...MOCK_GENERATE_DOC_RESPONSE,
      repo,
      feature_id,
      feature_name,
      filename: `${feature_id}.md`,
    };
  }
  return apiRequest("/ai/features/generate-doc", {
    method: "POST",
    body: JSON.stringify({
      repo,
      feature_id,
      feature_name,
      feature_summary,
      commit_shas,
    }),
  });
}

// Knowledge Concentration & Graph Endpoints
export async function getKnowledgeConcentration(repo, max_commits = 100, refresh = false) {
  if (isDemoMode() || isMockRepo(repo)) {
    return { ...MOCK_KNOWLEDGE_GRAPH, repository: repo };
  }
  return apiRequest(
    `/github/repo/knowledge-concentration?repo=${encodeURIComponent(repo)}&max_commits=${max_commits}${refresh ? "&refresh=true" : ""}`
  );
}

export async function syncRepoData(repo, max_commits = 100) {
  if (isDemoMode()) {
    return { success: true, message: "Demo mode sync simulated" };
  }
  return apiRequest("/sync", {
    method: "POST",
    body: JSON.stringify({
      action: "repo",
      repo,
      max_commits,
    }),
  });
}

export async function getKnowledgeGraph(repo, max_commits = 100) {
  if (isDemoMode()) {
    return { ...MOCK_KNOWLEDGE_GRAPH, repository: repo };
  }
  return apiRequest(`/github/repo/knowledge-graph?repo=${encodeURIComponent(repo)}&max_commits=${max_commits}`);
}

export async function getFeatureKnowledge({ repo, feature_id, feature_name, commit_shas, include_diff_stats = true }) {
  if (isDemoMode()) {
    const feat = MOCK_CATEGORIZE_RESPONSE.features.find((f) => f.feature_id === feature_id);
    return feat ? feat.knowledge_graph : MOCK_CATEGORIZE_RESPONSE.features[0].knowledge_graph;
  }
  return apiRequest("/github/repo/feature-knowledge", {
    method: "POST",
    body: JSON.stringify({
      repo,
      feature_id,
      feature_name,
      commit_shas,
      include_diff_stats,
    }),
  });
}

export async function getFeaturesKnowledgeBatch({ repo, features, include_diff_stats = false }) {
  if (isDemoMode()) {
    return { ...MOCK_KNOWLEDGE_GRAPH, repository: repo };
  }
  return apiRequest("/github/repo/features-knowledge-batch", {
    method: "POST",
    body: JSON.stringify({
      repo,
      features,
      include_diff_stats,
    }),
  });
}

// ----------------- Team & Succession Planning Endpoints -----------------
export async function getTeamOverview(repo = null) {
  if (isDemoMode()) {
    // Return rich simulated team overview with 0 GitHub API calls
    const devs = MOCK_DEVELOPERS.map((d) => ({
      developer_name: d.name,
      role: d.role,
      avatar_url: d.avatar,
      email: d.email,
      status: localStorage.getItem(`demo_dev_status_${d.name.toLowerCase()}`) || "active",
      is_dominant: d.isDominant,
      knowledge_percentage: d.primaryAreas?.[0]?.percentage || (d.isDominant ? 42.0 : 22.0),
      risk_level: d.riskLevel,
      commits_count: d.commitsCount,
      owned_features: d.primaryAreas?.map((a) => a.name) || [],
      top_domains: d.primaryAreas?.map((a) => a.name) || ["Core Engine & API"],
      availability_score: d.isDominant ? 0.6 : 0.9,
      quit_at: localStorage.getItem(`demo_dev_quit_${d.name.toLowerCase()}`) || null,
    }));

    return {
      total_developers: devs.length,
      active_developers: devs.filter((d) => d.status !== "quitted").length,
      quitted_developers: devs.filter((d) => d.status === "quitted").length,
      orphaned_features_count: 0,
      reassigned_features_count: 0,
      api_calls_made: 0,
      cache_status: "DATABASE_ACTIVE",
      developers: devs,
      recent_assignments: [],
    };
  }

  const query = repo ? `?repo=${encodeURIComponent(repo)}` : "";
  return apiRequest(`/team/overview${query}`);
}

export async function offboardDeveloper({ developer_name, repo = null, reason = "" }) {
  if (isDemoMode()) {
    localStorage.setItem(`demo_dev_status_${developer_name.toLowerCase()}`, "quitted");
    localStorage.setItem(`demo_dev_quit_${developer_name.toLowerCase()}`, new Date().toISOString());

    // Generate smart simulated successor recommendation
    const activeCandidates = MOCK_DEVELOPERS.filter(
      (d) => d.name.toLowerCase() !== developer_name.toLowerCase()
    );
    const successor = activeCandidates[0] || MOCK_DEVELOPERS[1];

    return {
      developer_name,
      status: "quitted",
      affected_features_count: 2,
      api_calls_made: 0,
      message: `Offboarded @${developer_name}. Reassigned orphaned features to @${successor.name} (0 GitHub API calls).`,
      reassignments: [
        {
          feature_id: "feat-payment",
          feature_name: "Payment Gateway Integration",
          category: "Payments & Billing",
          previous_owner: developer_name,
          assigned_successor: successor.name,
          successor_avatar: successor.avatar,
          successor_score: 87.5,
          status: "assigned",
          is_manual_override: false,
          rationale: `Rank #1: Direct touch in Payment module (${successor.commitsCount} commits), domain overlap in Financial APIs, and unconstrained availability.`,
          top_candidates: activeCandidates.map((c, i) => ({
            developer_name: c.name,
            avatar_url: c.avatar,
            role: c.role,
            total_score: Math.max(30, 88 - i * 18),
            direct_experience_score: Math.max(5, 30 - i * 10),
            file_overlap_score: Math.max(5, 22 - i * 5),
            domain_affinity_score: Math.max(5, 23 - i * 4),
            availability_score: 13.0,
            rank: i + 1,
            match_tier: i === 0 ? "EXCELLENT MATCH" : i === 1 ? "STRONG CANDIDATE" : "MODERATE FIT",
            rationale: `Historical touch on shared backend routes; availability score 13/15.`,
          })),
        },
      ],
    };
  }

  return apiRequest("/team/developer/offboard", {
    method: "POST",
    body: JSON.stringify({ developer_name, repo, reason }),
  });
}

export async function reinstateDeveloper({ developer_name, repo = null }) {
  if (isDemoMode()) {
    localStorage.removeItem(`demo_dev_status_${developer_name.toLowerCase()}`);
    localStorage.removeItem(`demo_dev_quit_${developer_name.toLowerCase()}`);
    return {
      developer_name,
      status: "active",
      message: `@{developer_name} reinstated to active team roster.`,
    };
  }

  return apiRequest("/team/developer/reinstate", {
    method: "POST",
    body: JSON.stringify({ developer_name, repo }),
  });
}

export async function simulateSuccession({ developer_name, repo = "default" }) {
  if (isDemoMode()) {
    const activeCandidates = MOCK_DEVELOPERS.filter(
      (d) => d.name.toLowerCase() !== developer_name.toLowerCase()
    );
    const best = activeCandidates[0] || MOCK_DEVELOPERS[1];
    return [
      {
        feature_id: "feat-auth",
        feature_name: "OAuth2 & JWT Session Gate",
        category: "Security & Authentication",
        previous_owner: developer_name,
        assigned_successor: best.name,
        successor_avatar: best.avatar,
        successor_score: 89.2,
        status: "simulated",
        is_manual_override: false,
        rationale: "Strong candidate with 35% past touch in authentication and high capacity.",
        top_candidates: activeCandidates.map((c, i) => ({
          developer_name: c.name,
          avatar_url: c.avatar,
          role: c.role,
          total_score: Math.max(35, 89 - i * 15),
          direct_experience_score: Math.max(10, 32 - i * 8),
          file_overlap_score: Math.max(8, 22 - i * 5),
          domain_affinity_score: Math.max(10, 22 - i * 4),
          availability_score: 13.0,
          rank: i + 1,
          match_tier: i === 0 ? "EXCELLENT MATCH" : "STRONG CANDIDATE",
          rationale: "Verified experience in security middleware and authentication flows.",
        })),
      },
    ];
  }

  return apiRequest("/team/succession/simulate", {
    method: "POST",
    body: JSON.stringify({ developer_name, repo }),
  });
}

export async function overrideSuccession({ feature_id, repo, new_developer, notes = "" }) {
  if (isDemoMode()) {
    return {
      status: "success",
      feature_id,
      assigned_developer: new_developer,
      message: `Successfully assigned @${new_developer} to feature.`,
    };
  }

  return apiRequest("/team/succession/override", {
    method: "POST",
    body: JSON.stringify({ feature_id, repo, new_developer, notes }),
  });
}

