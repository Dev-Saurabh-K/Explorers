import {
  MOCK_USER,
  MOCK_REPOS,
  MOCK_COMMITS,
  MOCK_CONTRIBUTORS,
  MOCK_CATEGORIZE_RESPONSE,
  MOCK_KNOWLEDGE_GRAPH,
  MOCK_GENERATE_DOC_RESPONSE,
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
  return (localStorage.getItem("gitocx_demo_mode") || localStorage.getItem("commitology_demo_mode")) === "true";
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

export async function getRepoCommits(repo, refresh = false) {
  if (isDemoMode()) {
    return MOCK_COMMITS;
  }
  return apiRequest(`/github/repo/commits?repo=${encodeURIComponent(repo)}${refresh ? "&refresh=true" : ""}`);
}

export async function getRepoContributors(repo, refresh = false) {
  if (isDemoMode()) {
    return MOCK_CONTRIBUTORS;
  }
  return apiRequest(`/github/repo/contributors?repo=${encodeURIComponent(repo)}${refresh ? "&refresh=true" : ""}`);
}

export async function getContributorCommits(repo, contributor, refresh = false) {
  if (isDemoMode()) {
    return MOCK_COMMITS.filter((c) => c.author.toLowerCase().includes(contributor.toLowerCase()));
  }
  return apiRequest(
    `/github/repo/contributor/commits?repo=${encodeURIComponent(repo)}&contributor=${encodeURIComponent(contributor)}${refresh ? "&refresh=true" : ""}`
  );
}

// AI Endpoints
export async function categorizeFeatures({ repo, max_commits = 50, include_knowledge_graph = true, refresh = false } = {}) {
  if (isDemoMode()) {
    // Simulate slight delay for realistic experience
    await new Promise((r) => setTimeout(r, 900));
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
  if (isDemoMode()) {
    await new Promise((r) => setTimeout(r, 1100));
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
  if (isDemoMode()) {
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
