# Commitology Backend API Documentation

> **Audience:** Frontend Developers building client applications (React, Next.js, Vue, etc.) for **Commitology**.  
> **Backend Base URL (Local):** `http://localhost:8000`  
> **Interactive Swagger UI:** `http://localhost:8000/docs`  
> **ReDoc Interface:** `http://localhost:8000/redoc`

---

## Table of Contents

1. [Architectural Overview & Authentication Flow](#1-architectural-overview--authentication-flow)
2. [Global Request & Response Conventions](#2-global-request--response-conventions)
3. [TypeScript Interface Reference (`types/api.ts`)](#3-typescript-interface-reference)
4. [System & Health Endpoints](#4-system--health-endpoints)
   - [GET /](#get-)
5. [Authentication Endpoints (`/auth`)](#5-authentication-endpoints-auth)
   - [GET /auth/github](#get-authgithub)
   - [GET /auth/github/callback](#get-authgithubcallback)
   - [GET /auth/me](#get-authme)
   - [POST /auth/logout](#post-authlogout)
   - [GET /auth/logout](#get-authlogout)
6. [GitHub Data Ingestion Endpoints (`/github`)](#6-github-data-ingestion-endpoints-github)
   - [GET /github/repos](#get-githubrepos)
   - [GET /github/repo/commits](#get-githubrepocommits)
   - [GET /github/repo/contributors](#get-githubrepocontributors)
   - [GET /github/repo/contributor/commits](#get-githubrepocontributorcommits)
7. [AI Feature Categorization & Documentation Endpoints (`/ai`)](#7-ai-feature-categorization--documentation-endpoints-ai)
   - [POST /ai/features/categorize](#post-aifeaturescategorize)
   - [POST /ai/features/generate-doc](#post-aifeaturesgenerate-doc)
8. [Developer Knowledge Concentration & Graph Endpoints (`/github/repo`)](#8-developer-knowledge-concentration--graph-endpoints-githubrepo)
   - [GET /github/repo/knowledge-concentration](#get-githubrepoknowledge-concentration)
   - [POST /github/repo/feature-knowledge](#post-githubrepofeature-knowledge)
   - [POST /github/repo/features-knowledge-batch](#post-githubrepofeatures-knowledge-batch)
   - [GET /github/repo/knowledge-graph](#get-githubrepoknowledge-graph)
9. [Frontend Integration Guide (React / Fetch Examples)](#9-frontend-integration-guide)

---

## 1. Architectural Overview & Authentication Flow

Commitology uses **GitHub OAuth 2.0** combined with **JWT (JSON Web Tokens)** for session security:

```mermaid
sequenceDiagram
    autonumber
    actor User as User Browser
    participant FE as Frontend Client (http://localhost:5173)
    participant BE as Backend API Gateway (http://localhost:8000)
    participant GH as GitHub OAuth Provider

    User->>FE: Click "Login with GitHub"
    FE->>BE: Navigate browser to GET /auth/github
    BE->>GH: 302 Redirect to GitHub Authorize URL
    User->>GH: Approves application permissions
    GH->>BE: 302 Redirect to /auth/github/callback?code=XYZ
    BE->>GH: Exchanges code for GitHub Access Token
    BE->>BE: Upserts User in DB & signs application JWT
    BE->>FE: 302 Redirect to http://localhost:5173/?token=JWT_TOKEN
    FE->>FE: Extract token from URL, store in localStorage, clean URL
    FE->>BE: GET /auth/me with Header Authorization: Bearer <JWT>
    BE-->>FE: Return UserProfile JSON
```

### Authentication Rules for Frontend:
1. **Public Routes:** `/`, `/docs`, `/redoc`, `/openapi.json`, `/auth/github`, `/auth/github/callback`, `/auth/logout`.
2. **Protected Routes:** All `/github/*` and `/ai/*` routes require the HTTP Header:
   ```http
   Authorization: Bearer <YOUR_JWT_TOKEN>
   ```
3. **Cookie Fallback:** The backend also sets a cookie named `token` with `SameSite=Lax`. When using `fetch()`, pass `credentials: "include"`.

---

## 2. Global Request & Response Conventions

### Request Headers
For all JSON requests:
```http
Content-Type: application/json
Authorization: Bearer <token>
```

### Standard Error Response Format
All 4xx and 5xx errors returned by FastAPI follow the standard schema:
```json
{
  "detail": "Descriptive error message here"
}
```

### HTTP Status Codes
| Status Code | Meaning | When It Occurs |
|---|---|---|
| **200 OK** | Success | Request succeeded with body payload. |
| **302 Found** | Redirect | OAuth redirection to GitHub or back to Frontend. |
| **400 Bad Request** | Client Error | Missing required query/body parameter or invalid commit SHA. |
| **401 Unauthorized** | Auth Failure | Missing, expired, or corrupted Bearer token. |
| **404 Not Found** | Resource Missing | Repository not found or has 0 commits. |
| **500 Server Error** | AI / Internal Failure | Gemini LLM or internal calculation failure. |
| **502 Bad Gateway** | GitHub Failure | Unable to communicate with GitHub API or rate limit exceeded. |

---

## 3. TypeScript Interface Reference

Copy and paste these interfaces into your frontend project at `src/types/api.ts`:

```typescript
// ==========================================
// Authentication & User Types
// ==========================================
export interface UserProfile {
  id: number;
  github_id: string;
  username: string;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
}

export interface AuthLogoutResponse {
  message: string;
}

// ==========================================
// GitHub Raw Data Types
// ==========================================
export interface CommitResponse {
  sha: string;
  message: string;
  author: string;
  date: string; // ISO 8601 string
}

export interface ContributorResponse {
  username: string;
  avatar_url: string | null;
}

export interface CommitByContributorResponse {
  sha: string;
  message: string;
  date: string; // ISO 8601 string
}

// ==========================================
// AI Documentation Types
// ==========================================
export interface FeatureClusterItem {
  feature_id: string;
  feature_name: string;
  summary: string;
  category: string;
  commit_shas: string[];
  commit_count: number;
  primary_files_hint?: string[];
  knowledge_graph?: FeatureKnowledgeGraph | null;
}

export interface CategorizeFeaturesRequest {
  repo: string; // "owner/repo"
  max_commits?: number; // default: 50
  include_knowledge_graph?: boolean; // default: true
}

export interface CategorizeFeaturesResponse {
  repo: string;
  total_commits: number;
  features: FeatureClusterItem[];
}

export interface GenerateDocRequest {
  repo: string; // "owner/repo"
  feature_id: string;
  feature_name: string;
  feature_summary?: string;
  commit_shas: string[];
}

export interface GenerateDocResponse {
  repo: string;
  feature_id: string;
  feature_name: string;
  filename: string; // e.g. "github-oauth-authentication.md"
  markdown_content: string; // Raw Markdown output
}

// ==========================================
// Knowledge Concentration & Graph Types
// ==========================================
export type RiskLevel = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export interface DeveloperConcentration {
  developer: string;
  avatar_url: string | null;
  commit_count: number;
  commit_percentage: number;
  lines_added: number;
  lines_deleted: number;
  lines_changed: number;
  lines_percentage: number;
  knowledge_percentage: number;
  risk_level: RiskLevel;
  is_dominant: boolean;
  color: string; // Hex color (e.g. "#00ff66")
}

export interface PieChartItem {
  label: string;
  value: number; // percentage
  count: number;
  color: string;
  avatar_url?: string | null;
}

export interface PieChartData {
  labels: string[];
  datasets: Array<{
    data: number[];
    backgroundColor: string[];
    borderColor?: string[];
  }>;
  items: PieChartItem[];
}

export interface BarChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor: string | string[];
  }>;
}

export interface StackedBarDataset {
  label: string;
  data: number[];
  backgroundColor: string;
}

export interface StackedBarChartData {
  features: string[];
  datasets: StackedBarDataset[];
}

export interface RadarChartDataset {
  developer: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
}

export interface RadarChartData {
  categories: string[];
  datasets: RadarChartDataset[];
}

export interface FeatureKnowledgeGraph {
  feature_id: string;
  feature_name: string;
  total_commits: number;
  total_lines_changed: number;
  bus_factor: number;
  risk_level: RiskLevel;
  risk_summary: string;
  dominant_developer: string | null;
  developers: DeveloperConcentration[];
  chart_data: {
    pie_chart: PieChartData;
    bar_chart: BarChartData;
  };
}

export interface RepositoryKnowledgeGraph {
  repository: string;
  total_commits_analyzed: number;
  total_contributors: number;
  repo_bus_factor: number;
  repo_risk_level: RiskLevel;
  repo_summary: string;
  dominant_contributor: string | null;
  high_risk_features_count: number;
  overall_developers: DeveloperConcentration[];
  feature_breakdown: FeatureKnowledgeGraph[];
  chart_data: {
    overall_pie_chart: PieChartData;
    features_stacked_bar: StackedBarChartData;
    radar_chart?: RadarChartData | null;
  };
}
```

---

## 4. System & Health Endpoints

### `GET /`
Check API server availability.

- **URL:** `/`
- **Method:** `GET`
- **Auth Required:** No (Public)
- **Headers:** None

#### Response (200 OK):
```json
{
  "message": "API is running"
}
```

---

## 5. Authentication Endpoints (`/auth`)

### `GET /auth/github`
Initiates the GitHub OAuth login flow.

- **URL:** `/auth/github`
- **Method:** `GET`
- **Auth Required:** No
- **Action:** Triggers an HTTP 302 redirect to `https://github.com/login/oauth/authorize`.
- **Frontend Usage:** Direct browser navigation:
  ```typescript
  window.location.href = "http://localhost:8000/auth/github";
  ```

---

### `GET /auth/github/callback`
GitHub OAuth callback handler.

- **URL:** `/auth/github/callback`
- **Method:** `GET`
- **Auth Required:** No
- **Query Parameters:**
  - `code` *(string, optional)*: GitHub authorization code.
  - `error` *(string, optional)*: OAuth error message if authorization was declined.
  - `error_description` *(string, optional)*: Detailed error message.
- **Action:** Exchanges code for GitHub access token, upserts User record, signs JWT token, and redirects back to the frontend:
  - **Success Redirect:** `${FRONTEND_URL}/?token=${jwt_token}`
  - **Error Redirect:** `${FRONTEND_URL}/?error=${error_msg}`

---

### `GET /auth/me`
Fetches the currently authenticated user's profile.

- **URL:** `/auth/me`
- **Method:** `GET`
- **Auth Required:** **Yes** (`Bearer <token>`)
- **Headers:**
  ```http
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```

#### Response (200 OK):
```json
{
  "id": 1,
  "github_id": "12345678",
  "username": "octocat",
  "name": "The Octocat",
  "email": "octocat@github.com",
  "avatar_url": "https://avatars.githubusercontent.com/u/583231?v=4"
}
```

#### Error Response (401 Unauthorized):
```json
{
  "detail": "Authentication required"
}
```

---

### `POST /auth/logout`
Logs out the user and clears authentication cookies.

- **URL:** `/auth/logout`
- **Method:** `POST`
- **Auth Required:** No (Clears cookies on request)
- **Headers:** `Content-Type: application/json`

#### Response (200 OK):
```json
{
  "message": "Logged out successfully"
}
```

---

### `GET /auth/logout`
Logs out user and redirects browser directly to frontend.

- **URL:** `/auth/logout?redirect=true`
- **Method:** `GET`
- **Query Parameters:**
  - `redirect` *(boolean, default: false)*: Set to `true` to redirect browser to frontend homepage after clearing cookie.

---

## 6. GitHub Data Ingestion Endpoints (`/github`)

### `GET /github/repos`
Lists all GitHub repositories owned or accessible by the authenticated user, sorted by last pushed date.

- **URL:** `/github/repos`
- **Method:** `GET`
- **Auth Required:** **Yes** (`Bearer <token>`)

#### Response (200 OK):
```json
[
  "octocat/Hello-World",
  "octocat/Spoon-Knife",
  "octocat/git-consortium"
]
```

---

### `GET /github/repo/commits`
Fetches the commit history for a specific repository.

- **URL:** `/github/repo/commits`
- **Method:** `GET`
- **Auth Required:** **Yes** (`Bearer <token>`)
- **Query Parameters:**
  - `repo` *(string, required)*: Full repository name formatted as `owner/repo`. Example: `repo=octocat/Hello-World`

#### Response (200 OK):
```json
[
  {
    "sha": "7fd1a60b01f91b314f59955a4e4d4e80d8edf11d",
    "message": "feat(auth): integrate github oauth login with jwt session support",
    "author": "The Octocat",
    "date": "2026-09-24T18:30:00Z"
  },
  {
    "sha": "6dcb09b5b57875f334f61aebed695e2e4193db5e",
    "message": "fix(db): add missing github_access_token column in users table",
    "author": "The Octocat",
    "date": "2026-09-24T17:15:00Z"
  }
]
```

---

### `GET /github/repo/contributors`
Fetches all contributors who have committed to the repository.

- **URL:** `/github/repo/contributors`
- **Method:** `GET`
- **Auth Required:** **Yes** (`Bearer <token>`)
- **Query Parameters:**
  - `repo` *(string, required)*: `owner/repo`

#### Response (200 OK):
```json
[
  {
    "username": "octocat",
    "avatar_url": "https://avatars.githubusercontent.com/u/583231?v=4"
  },
  {
    "username": "mona",
    "avatar_url": "https://avatars.githubusercontent.com/u/10001?v=4"
  }
]
```

---

### `GET /github/repo/contributor/commits`
Fetches commits authored by a specific contributor on a specific repository.

- **URL:** `/github/repo/contributor/commits`
- **Method:** `GET`
- **Auth Required:** **Yes** (`Bearer <token>`)
- **Query Parameters:**
  - `repo` *(string, required)*: `owner/repo`
  - `contributor` *(string, required)*: Contributor's GitHub username

#### Response (200 OK):
```json
[
  {
    "sha": "7fd1a60b01f91b314f59955a4e4d4e80d8edf11d",
    "message": "feat(auth): integrate github oauth login with jwt session support",
    "date": "2026-09-24T18:30:00Z"
  }
]
```

---

## 7. AI Feature Categorization & Documentation Endpoints (`/ai`)

### `POST /ai/features/categorize`
Analyzes repository commits in bulk and groups them into logical product features using Gemini LLM. It also computes developer knowledge concentration telemetry for each feature.

- **URL:** `/ai/features/categorize`
- **Method:** `POST`
- **Auth Required:** **Yes** (`Bearer <token>`)
- **Headers:** `Content-Type: application/json`

#### Request Body:
```json
{
  "repo": "octocat/Hello-World",
  "max_commits": 50,
  "include_knowledge_graph": true
}
```

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `repo` | `string` | **Yes** | — | Target repository in `owner/repo` format |
| `max_commits` | `number` | No | `50` | Maximum recent commits to analyze (10–100 recommended) |
| `include_knowledge_graph` | `boolean` | No | `true` | When true, computes developer knowledge concentration for each feature |

#### Response (200 OK):
```json
{
  "repo": "octocat/Hello-World",
  "total_commits": 35,
  "features": [
    {
      "feature_id": "github-oauth-authentication",
      "feature_name": "GitHub OAuth & JWT Authentication",
      "summary": "Implements OAuth 2.0 authorization code grant with GitHub, storing access tokens and issuing JWT session credentials.",
      "category": "Authentication",
      "commit_shas": [
        "7fd1a60b01f91b314f59955a4e4d4e80d8edf11d",
        "6dcb09b5b57875f334f61aebed695e2e4193db5e"
      ],
      "commit_count": 2,
      "primary_files_hint": [
        "app/controllers/auth_controller.py",
        "app/services/auth_service.py"
      ],
      "knowledge_graph": {
        "feature_id": "github-oauth-authentication",
        "feature_name": "GitHub OAuth & JWT Authentication",
        "total_commits": 2,
        "total_lines_changed": 340,
        "bus_factor": 1,
        "risk_level": "CRITICAL",
        "risk_summary": "High knowledge concentration on octocat (100.0% ownership). Single point of failure.",
        "dominant_developer": "octocat",
        "developers": [
          {
            "developer": "octocat",
            "avatar_url": "https://avatars.githubusercontent.com/u/583231?v=4",
            "commit_count": 2,
            "commit_percentage": 100.0,
            "lines_added": 310,
            "lines_deleted": 30,
            "lines_changed": 340,
            "lines_percentage": 100.0,
            "knowledge_percentage": 100.0,
            "risk_level": "CRITICAL",
            "is_dominant": true,
            "color": "#00ff66"
          }
        ],
        "chart_data": {
          "pie_chart": {
            "labels": ["octocat"],
            "datasets": [
              {
                "data": [100.0],
                "backgroundColor": ["#00ff66"]
              }
            ],
            "items": [
              {
                "label": "octocat",
                "value": 100.0,
                "count": 2,
                "color": "#00ff66",
                "avatar_url": "https://avatars.githubusercontent.com/u/583231?v=4"
              }
            ]
          },
          "bar_chart": {
            "labels": ["octocat"],
            "datasets": [
              {
                "label": "Commits",
                "data": [2],
                "backgroundColor": "#00ff66"
              }
            ]
          }
        }
      }
    }
  ]
}
```

---

### `POST /ai/features/generate-doc`
Synthesizes a production-grade `<feature_name>.md` technical document for a selected feature. The backend hydrates git diffs, file patches, and commit metadata using PyGithub before executing the Gemini documentation chain.

- **URL:** `/ai/features/generate-doc`
- **Method:** `POST`
- **Auth Required:** **Yes** (`Bearer <token>`)
- **Headers:** `Content-Type: application/json`

#### Request Body:
```json
{
  "repo": "octocat/Hello-World",
  "feature_id": "github-oauth-authentication",
  "feature_name": "GitHub OAuth & JWT Authentication",
  "feature_summary": "Implements OAuth 2.0 authorization code grant with GitHub.",
  "commit_shas": [
    "7fd1a60b01f91b314f59955a4e4d4e80d8edf11d",
    "6dcb09b5b57875f334f61aebed695e2e4193db5e"
  ]
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `repo` | `string` | **Yes** | Repository in `owner/repo` format |
| `feature_id` | `string` | **Yes** | Unique slug for feature (used to name file: `<feature_id>.md`) |
| `feature_name` | `string` | **Yes** | Human readable title of the feature |
| `feature_summary` | `string` | No | Short description of feature intent |
| `commit_shas` | `string[]` | **Yes** | Array of commit SHAs belonging to this feature |

#### Response (200 OK):
```json
{
  "repo": "octocat/Hello-World",
  "feature_id": "github-oauth-authentication",
  "feature_name": "GitHub OAuth & JWT Authentication",
  "filename": "github-oauth-authentication.md",
  "markdown_content": "# Feature Documentation: GitHub OAuth & JWT Authentication\n\n## 1. Executive Summary & Purpose\nThis feature introduces GitHub OAuth 2.0 authentication...\n\n```mermaid\nsequenceDiagram\n...\n```\n\n## 3. Implementation Details & File Breakdown\n- `app/services/auth_service.py`: Implements token exchange..."
}
```

---

## 8. Developer Knowledge Concentration & Graph Endpoints (`/github/repo`)

These endpoints compute **Knowledge Concentration**, **Bus Factor**, and **Telemetry Chart Data** (pre-formatted for Chart.js and Recharts).

### `GET /github/repo/knowledge-concentration`
Computes repository-wide developer ownership and bus factor risk.

- **URL:** `/github/repo/knowledge-concentration`
- **Method:** `GET`
- **Auth Required:** **Yes** (`Bearer <token>`)
- **Query Parameters:**
  - `repo` *(string, required)*: `owner/repo`
  - `max_commits` *(number, optional, default: 100, min: 5, max: 500)*

#### Response (200 OK):
```json
{
  "repository": "octocat/Hello-World",
  "total_commits_analyzed": 100,
  "total_contributors": 3,
  "repo_bus_factor": 1,
  "repo_risk_level": "CRITICAL",
  "repo_summary": "1 developer(s) control >=80% of repository knowledge. Immediate cross-training recommended.",
  "dominant_contributor": "octocat",
  "high_risk_features_count": 0,
  "overall_developers": [
    {
      "developer": "octocat",
      "avatar_url": "https://avatars.githubusercontent.com/u/583231?v=4",
      "commit_count": 85,
      "commit_percentage": 85.0,
      "lines_added": 0,
      "lines_deleted": 0,
      "lines_changed": 0,
      "lines_percentage": 0.0,
      "knowledge_percentage": 85.0,
      "risk_level": "CRITICAL",
      "is_dominant": true,
      "color": "#00ff66"
    }
  ],
  "feature_breakdown": [],
  "chart_data": {
    "overall_pie_chart": {
      "labels": ["octocat"],
      "datasets": [
        {
          "data": [85.0],
          "backgroundColor": ["#00ff66"]
        }
      ],
      "items": [
        {
          "label": "octocat",
          "value": 85.0,
          "count": 85,
          "color": "#00ff66",
          "avatar_url": "https://avatars.githubusercontent.com/u/583231?v=4"
        }
      ]
    },
    "features_stacked_bar": {
      "features": [],
      "datasets": []
    },
    "radar_chart": null
  }
}
```

---

### `POST /github/repo/feature-knowledge`
Calculates knowledge telemetry for an individual feature.

- **URL:** `/github/repo/feature-knowledge`
- **Method:** `POST`
- **Auth Required:** **Yes** (`Bearer <token>`)

#### Request Body:
```json
{
  "repo": "octocat/Hello-World",
  "feature_id": "auth-system",
  "feature_name": "Authentication System",
  "commit_shas": ["sha1", "sha2"],
  "include_diff_stats": true
}
```

#### Response (200 OK):
Returns a [FeatureKnowledgeGraph](#3-typescript-interface-reference) object.

---

### `POST /github/repo/features-knowledge-batch`
Calculates knowledge telemetry across multiple features simultaneously and generates a cross-feature stacked bar chart.

- **URL:** `/github/repo/features-knowledge-batch`
- **Method:** `POST`
- **Auth Required:** **Yes** (`Bearer <token>`)

#### Request Body:
```json
{
  "repo": "octocat/Hello-World",
  "features": [
    {
      "feature_id": "auth-system",
      "feature_name": "Authentication System",
      "category": "Authentication",
      "commit_shas": ["sha1", "sha2"]
    },
    {
      "feature_id": "database-layer",
      "feature_name": "Database Layer",
      "category": "Database",
      "commit_shas": ["sha3", "sha4"]
    }
  ],
  "include_diff_stats": false
}
```

#### Response (200 OK):
Returns a [RepositoryKnowledgeGraph](#3-typescript-interface-reference) object with populated `features_stacked_bar`.

---

### `GET /github/repo/knowledge-graph`
Full repository telemetry based on automatic commit-message heuristics.

- **URL:** `/github/repo/knowledge-graph`
- **Method:** `GET`
- **Auth Required:** **Yes** (`Bearer <token>`)
- **Query Parameters:**
  - `repo` *(string, required)*: `owner/repo`
  - `max_commits` *(number, optional, default: 100)*

#### Response (200 OK):
Returns a complete [RepositoryKnowledgeGraph](#3-typescript-interface-reference) object.

---

## 9. Frontend Integration Guide

### 9.1 API Client Setup (`src/services/apiClient.ts`)

```typescript
const BASE_URL = "http://localhost:8000";

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include", // Supports cookie fallback
  });

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status} ${response.statusText}`;
    try {
      const errorJson = await response.json();
      if (errorJson.detail) {
        errorMessage = errorJson.detail;
      }
    } catch {
      // Body not JSON
    }

    if (response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }

    throw new Error(errorMessage);
  }

  return response.json();
}
```

---

### 9.2 Complete React Implementation Example

Here is a clean React workflow demonstrating:
1. Fetching user profile (`/auth/me`)
2. Listing repositories (`/github/repos`)
3. Categorizing features with AI (`/ai/features/categorize`)
4. Generating feature documentation (`/ai/features/generate-doc`)

```tsx
import React, { useEffect, useState } from "react";
import { apiRequest } from "./services/apiClient";
import {
  UserProfile,
  CategorizeFeaturesResponse,
  FeatureClusterItem,
  GenerateDocResponse,
} from "./types/api";

export function CommitologyDashboard() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [repos, setRepos] = useState<string[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string>("");
  const [features, setFeatures] = useState<FeatureClusterItem[]>([]);
  const [activeDoc, setActiveDoc] = useState<GenerateDocResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // 1. Initial auth check
  useEffect(() => {
    // Check if token was passed in redirect URL query params
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");
    if (urlToken) {
      localStorage.setItem("token", urlToken);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    apiRequest<UserProfile>("/auth/me")
      .then(setUser)
      .catch(console.error);
  }, []);

  // 2. Fetch Repositories
  useEffect(() => {
    if (user) {
      apiRequest<string[]>("/github/repos")
        .then((data) => {
          setRepos(data);
          if (data.length > 0) setSelectedRepo(data[0]);
        })
        .catch(console.error);
    }
  }, [user]);

  // 3. Trigger AI Feature Categorization
  const handleCategorize = async () => {
    if (!selectedRepo) return;
    setLoading(true);
    setActiveDoc(null);
    try {
      const res = await apiRequest<CategorizeFeaturesResponse>("/ai/features/categorize", {
        method: "POST",
        body: JSON.stringify({
          repo: selectedRepo,
          max_commits: 50,
          include_knowledge_graph: true,
        }),
      });
      setFeatures(res.features);
    } catch (err: any) {
      alert("Categorization failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 4. Generate <feature_name>.md
  const handleGenerateDoc = async (feature: FeatureClusterItem) => {
    setLoading(true);
    try {
      const doc = await apiRequest<GenerateDocResponse>("/ai/features/generate-doc", {
        method: "POST",
        body: JSON.stringify({
          repo: selectedRepo,
          feature_id: feature.feature_id,
          feature_name: feature.feature_name,
          feature_summary: feature.summary,
          commit_shas: feature.commit_shas,
        }),
      });
      setActiveDoc(doc);
    } catch (err: any) {
      alert("Doc generation failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="p-8">
        <button
          onClick={() => (window.location.href = "http://localhost:8000/auth/github")}
          className="px-6 py-3 bg-black text-white font-semibold rounded-lg shadow"
        >
          Sign in with GitHub
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <header className="flex justify-between items-center border-b pb-4">
        <h1 className="text-2xl font-bold">Commitology Dashboard</h1>
        <div className="flex items-center space-x-4">
          <img src={user.avatar_url || ""} alt="" className="w-8 h-8 rounded-full" />
          <span>{user.name || user.username}</span>
          <button
            onClick={() => apiRequest("/auth/logout", { method: "POST" }).then(() => setUser(null))}
            className="text-red-500 text-sm hover:underline"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Repo Selector */}
      <div className="flex items-center space-x-4">
        <select
          value={selectedRepo}
          onChange={(e) => setSelectedRepo(e.target.value)}
          className="p-2 border rounded-md"
        >
          {repos.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <button
          onClick={handleCategorize}
          disabled={loading || !selectedRepo}
          className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
        >
          {loading ? "Analyzing Commits..." : "Extract Features with AI"}
        </button>
      </div>

      {/* Feature Grid */}
      {features.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feat) => (
            <div key={feat.feature_id} className="p-4 border rounded-lg shadow-sm space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg">{feat.feature_name}</h3>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">{feat.category}</span>
              </div>
              <p className="text-sm text-gray-600">{feat.summary}</p>
              <div className="text-xs text-gray-500">
                Commits: {feat.commit_count} | Bus Factor: {feat.knowledge_graph?.bus_factor ?? 1}
              </div>
              <button
                onClick={() => handleGenerateDoc(feat)}
                className="mt-2 px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700"
              >
                Generate {feat.feature_id}.md
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Markdown Document Display */}
      {activeDoc && (
        <div className="mt-8 p-6 bg-gray-50 border rounded-lg space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold font-mono">{activeDoc.filename}</h2>
            <button
              onClick={() => {
                const blob = new Blob([activeDoc.markdown_content], { type: "text/markdown" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = activeDoc.filename;
                a.click();
              }}
              className="px-3 py-1 bg-gray-800 text-white text-sm rounded"
            >
              Download .md
            </button>
          </div>
          <pre className="p-4 bg-white border rounded overflow-x-auto whitespace-pre-wrap font-mono text-sm">
            {activeDoc.markdown_content}
          </pre>
        </div>
      )}
    </div>
  );
}
```
