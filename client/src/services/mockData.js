// Realistic sample data matching server/api_documentation.md schemas

export const MOCK_USER = {
  id: 1,
  github_id: "583231",
  username: "octocat",
  name: "The Octocat",
  email: "octocat@github.com",
  avatar_url: "https://avatars.githubusercontent.com/u/583231?v=4"
};

export const MOCK_REPOS = [
  "octocat/Hello-World",
  "octocat/Spoon-Knife",
  "octocat/git-consortium",
  "meta-llama/llama3-core",
  "tailwindlabs/tailwindcss"
];

export const MOCK_COMMITS = [
  {
    sha: "7fd1a60b01f91b314f59955a4e4d4e80d8edf11d",
    message: "feat(auth): integrate github oauth login with jwt session support",
    author: "The Octocat",
    date: "2026-09-24T18:30:00Z"
  },
  {
    sha: "6dcb09b5b57875f334f61aebed695e2e4193db5e",
    message: "fix(db): add missing github_access_token column in users table",
    author: "The Octocat",
    date: "2026-09-24T17:15:00Z"
  },
  {
    sha: "3a8f921cc410a7b4512e9b015d86241a79f04128",
    message: "feat(ai): integrate Gemini 1.5 flash for feature clustering and extraction",
    author: "Elena Rostova",
    date: "2026-09-23T14:40:00Z"
  },
  {
    sha: "1bc83921509174092b210a4176210b418a991823",
    message: "perf(telemetry): optimize bus factor calculation and diff hydration pipeline",
    author: "Dev Saurabh",
    date: "2026-09-22T09:20:00Z"
  },
  {
    sha: "9918274a01984029381029384729104820194820",
    message: "refactor(api): standardize error payload format and CORS headers",
    author: "The Octocat",
    date: "2026-09-21T11:05:00Z"
  }
];

export const MOCK_CONTRIBUTORS = [
  {
    username: "octocat",
    avatar_url: "https://avatars.githubusercontent.com/u/583231?v=4"
  },
  {
    username: "elena-ai",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  },
  {
    username: "dev-saurabh",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  }
];

export const MOCK_CATEGORIZE_RESPONSE = {
  repo: "octocat/Hello-World",
  total_commits: 35,
  features: [
    {
      feature_id: "github-oauth-authentication",
      feature_name: "GitHub OAuth & JWT Authentication",
      summary: "Implements OAuth 2.0 authorization code grant with GitHub, storing access tokens and issuing JWT session credentials.",
      category: "Authentication",
      commit_shas: [
        "7fd1a60b01f91b314f59955a4e4d4e80d8edf11d",
        "6dcb09b5b57875f334f61aebed695e2e4193db5e"
      ],
      commit_count: 2,
      primary_files_hint: [
        "app/controllers/auth_controller.py",
        "app/services/auth_service.py"
      ],
      knowledge_graph: {
        feature_id: "github-oauth-authentication",
        feature_name: "GitHub OAuth & JWT Authentication",
        total_commits: 2,
        total_lines_changed: 340,
        bus_factor: 1,
        risk_level: "CRITICAL",
        risk_summary: "High knowledge concentration on octocat (100.0% ownership). Single point of failure.",
        dominant_developer: "octocat",
        developers: [
          {
            developer: "octocat",
            avatar_url: "https://avatars.githubusercontent.com/u/583231?v=4",
            commit_count: 2,
            commit_percentage: 100.0,
            lines_added: 310,
            lines_deleted: 30,
            lines_changed: 340,
            lines_percentage: 100.0,
            knowledge_percentage: 100.0,
            risk_level: "CRITICAL",
            is_dominant: true,
            color: "#06b6d4"
          }
        ],
        chart_data: {
          pie_chart: {
            labels: ["octocat"],
            datasets: [{ data: [100.0], backgroundColor: ["#06b6d4"] }],
            items: [
              {
                label: "octocat",
                value: 100.0,
                count: 2,
                color: "#06b6d4",
                avatar_url: "https://avatars.githubusercontent.com/u/583231?v=4"
              }
            ]
          },
          bar_chart: {
            labels: ["octocat"],
            datasets: [{ label: "Commits", data: [2], backgroundColor: "#06b6d4" }]
          }
        }
      }
    },
    {
      feature_id: "gemini-doc-generation",
      feature_name: "Gemini AI Documentation Chain",
      summary: "Hydrates file diffs and commit messages to generate comprehensive markdown system architecture and feature documentation.",
      category: "AI & LLM",
      commit_shas: [
        "3a8f921cc410a7b4512e9b015d86241a79f04128"
      ],
      commit_count: 1,
      primary_files_hint: [
        "aiservice/doc_generator.py",
        "app/controllers/ai_controller.py"
      ],
      knowledge_graph: {
        feature_id: "gemini-doc-generation",
        feature_name: "Gemini AI Documentation Chain",
        total_commits: 1,
        total_lines_changed: 420,
        bus_factor: 1,
        risk_level: "HIGH",
        risk_summary: "Elena owns 100% of the AI chain module.",
        dominant_developer: "elena-ai",
        developers: [
          {
            developer: "elena-ai",
            avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            commit_count: 1,
            commit_percentage: 100.0,
            lines_added: 400,
            lines_deleted: 20,
            lines_changed: 420,
            lines_percentage: 100.0,
            knowledge_percentage: 100.0,
            risk_level: "HIGH",
            is_dominant: true,
            color: "#8b5cf6"
          }
        ],
        chart_data: {
          pie_chart: {
            labels: ["elena-ai"],
            datasets: [{ data: [100.0], backgroundColor: ["#8b5cf6"] }],
            items: [
              {
                label: "elena-ai",
                value: 100.0,
                count: 1,
                color: "#8b5cf6",
                avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              }
            ]
          },
          bar_chart: {
            labels: ["elena-ai"],
            datasets: [{ label: "Commits", data: [1], backgroundColor: "#8b5cf6" }]
          }
        }
      }
    },
    {
      feature_id: "bus-factor-telemetry",
      feature_name: "Developer Knowledge Concentration Telemetry",
      summary: "Computes code ownership percentages, single points of failure risks, and structured Chart.js telemetry across commits.",
      category: "Analytics",
      commit_shas: [
        "1bc83921509174092b210a4176210b418a991823"
      ],
      commit_count: 1,
      primary_files_hint: [
        "app/services/telemetry_service.py",
        "app/models/knowledge.py"
      ],
      knowledge_graph: {
        feature_id: "bus-factor-telemetry",
        feature_name: "Developer Knowledge Concentration Telemetry",
        total_commits: 1,
        total_lines_changed: 580,
        bus_factor: 1,
        risk_level: "HIGH",
        risk_summary: "Dev Saurabh implemented knowledge concentration engine.",
        dominant_developer: "dev-saurabh",
        developers: [
          {
            developer: "dev-saurabh",
            avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
            commit_count: 1,
            commit_percentage: 100.0,
            lines_added: 520,
            lines_deleted: 60,
            lines_changed: 580,
            lines_percentage: 100.0,
            knowledge_percentage: 100.0,
            risk_level: "HIGH",
            is_dominant: true,
            color: "#10b981"
          }
        ],
        chart_data: {
          pie_chart: {
            labels: ["dev-saurabh"],
            datasets: [{ data: [100.0], backgroundColor: ["#10b981"] }],
            items: [
              {
                label: "dev-saurabh",
                value: 100.0,
                count: 1,
                color: "#10b981",
                avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
              }
            ]
          },
          bar_chart: {
            labels: ["dev-saurabh"],
            datasets: [{ label: "Commits", data: [1], backgroundColor: "#10b981" }]
          }
        }
      }
    }
  ]
};

export const MOCK_KNOWLEDGE_GRAPH = {
  repository: "octocat/Hello-World",
  total_commits_analyzed: 35,
  total_contributors: 3,
  repo_bus_factor: 1,
  repo_risk_level: "CRITICAL",
  repo_summary: "1 developer(s) control >= 70% of repository knowledge. Cross-training recommended for Authentication and Core Data services.",
  dominant_contributor: "octocat",
  high_risk_features_count: 2,
  overall_developers: [
    {
      developer: "octocat",
      avatar_url: "https://avatars.githubusercontent.com/u/583231?v=4",
      commit_count: 24,
      commit_percentage: 68.6,
      lines_added: 3420,
      lines_deleted: 410,
      lines_changed: 3830,
      lines_percentage: 65.4,
      knowledge_percentage: 67.0,
      risk_level: "CRITICAL",
      is_dominant: true,
      color: "#06b6d4"
    },
    {
      developer: "elena-ai",
      avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      commit_count: 7,
      commit_percentage: 20.0,
      lines_added: 1200,
      lines_deleted: 150,
      lines_changed: 1350,
      lines_percentage: 23.0,
      knowledge_percentage: 21.5,
      risk_level: "MEDIUM",
      is_dominant: false,
      color: "#8b5cf6"
    },
    {
      developer: "dev-saurabh",
      avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      commit_count: 4,
      commit_percentage: 11.4,
      lines_added: 620,
      lines_deleted: 60,
      lines_changed: 680,
      lines_percentage: 11.6,
      knowledge_percentage: 11.5,
      risk_level: "LOW",
      is_dominant: false,
      color: "#10b981"
    }
  ],
  feature_breakdown: MOCK_CATEGORIZE_RESPONSE.features.map(f => f.knowledge_graph),
  chart_data: {
    overall_pie_chart: {
      labels: ["octocat", "elena-ai", "dev-saurabh"],
      datasets: [
        {
          data: [67.0, 21.5, 11.5],
          backgroundColor: ["#06b6d4", "#8b5cf6", "#10b981"]
        }
      ],
      items: [
        {
          label: "octocat",
          value: 67.0,
          count: 24,
          color: "#06b6d4",
          avatar_url: "https://avatars.githubusercontent.com/u/583231?v=4"
        },
        {
          label: "elena-ai",
          value: 21.5,
          count: 7,
          color: "#8b5cf6",
          avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
        },
        {
          label: "dev-saurabh",
          value: 11.5,
          count: 4,
          color: "#10b981",
          avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
        }
      ]
    },
    features_stacked_bar: {
      features: ["Auth & Session", "Gemini Chain", "Telemetry Engine"],
      datasets: [
        {
          label: "octocat",
          data: [100, 0, 15],
          backgroundColor: "#06b6d4"
        },
        {
          label: "elena-ai",
          data: [0, 100, 10],
          backgroundColor: "#8b5cf6"
        },
        {
          label: "dev-saurabh",
          data: [0, 0, 75],
          backgroundColor: "#10b981"
        }
      ]
    },
    radar_chart: {
      categories: ["Auth", "AI Pipeline", "Data Ingestion", "Infrastructure", "API Gateways"],
      datasets: [
        {
          developer: "octocat",
          data: [95, 20, 80, 85, 90],
          borderColor: "#06b6d4",
          backgroundColor: "rgba(6, 182, 212, 0.2)"
        },
        {
          developer: "elena-ai",
          data: [15, 90, 30, 20, 40],
          borderColor: "#8b5cf6",
          backgroundColor: "rgba(139, 92, 246, 0.2)"
        }
      ]
    }
  }
};

export const MOCK_GENERATE_DOC_RESPONSE = {
  repo: "octocat/Hello-World",
  feature_id: "github-oauth-authentication",
  feature_name: "GitHub OAuth & JWT Authentication",
  filename: "github-oauth-authentication.md",
  markdown_content: `# Feature Documentation: GitHub OAuth & JWT Authentication

## 1. Executive Summary & Purpose
This feature implements secure, tokenized user authentication through the **GitHub OAuth 2.0 authorization code flow**, paired with **JWT (JSON Web Tokens)** for stateless frontend session authentication. It enables end-users to link their GitHub profile, sync accessible repositories, and seamlessly authorize backend AI pipelines without entering raw credentials.

---

## 2. Architecture & Sequence Flow

\`\`\`mermaid
sequenceDiagram
    autonumber
    actor User as Client Browser
    participant FE as React Client
    participant BE as FastAPI Gateway
    participant GH as GitHub OAuth Provider

    User->>FE: Click "Login with GitHub"
    FE->>BE: GET /auth/github
    BE->>GH: 302 Redirect to authorize
    User->>GH: Approves application access
    GH->>BE: 302 Redirect to /auth/github/callback?code=AUTH_CODE
    BE->>GH: Exchange code for GitHub access token
    BE->>BE: Upsert User in database & generate Bearer JWT
    BE->>FE: Redirect to /?token=JWT_TOKEN
    FE->>FE: Store token in localStorage
    FE->>BE: GET /auth/me with Bearer JWT
    BE-->>FE: Return UserProfile JSON
\`\`\`

---

## 3. Implementation Details & File Breakdown

- **\`app/controllers/auth_controller.py\`**: Handles incoming OAuth callbacks, parameter validations, redirect sanitization, and sets secure \`SameSite=Lax\` cookies.
- **\`app/services/auth_service.py\`**: Orchestrates code-for-token exchange via GitHub REST API, verifies scopes, and signs application JWT tokens using the server secret key.
- **\`app/models/user.py\`**: Stores user profile attributes including \`github_id\`, \`username\`, \`email\`, and encrypted access tokens for subsequent API queries.

---

## 4. Key Commits
- \`7fd1a60\`: \`feat(auth): integrate github oauth login with jwt session support\` (octocat)
- \`6dcb09b\`: \`fix(db): add missing github_access_token column in users table\` (octocat)

---

## 5. Security & Risk Assessment
- **Bus Factor Risk**: **CRITICAL** (100% of lines authored by \`octocat\`).
- **Mitigation Strategy**: Ensure secondary maintainers review \`auth_service.py\` token lifecycle tests and token refresh procedures.
`
};
