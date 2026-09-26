import json
import os
import re
from typing import List
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from app.core.config import settings
from app.schemas.ai_schemas import FeatureClusterItem
from app.services.knowledge_service import KnowledgeConcentrationService


class LLMFeatureCategorizer:
    def __init__(self):
        self._llm = None
        self.knowledge_service = KnowledgeConcentrationService()

    def get_llm(self):
        if self._llm is None:
            api_key = settings.google_api_key or os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
            if not api_key:
                raise ValueError("Google Gemini API Key is required. Please set GOOGLE_API_KEY in .env or config.")
            self._llm = ChatGoogleGenerativeAI(
                model="gemini-3.6-flash",
                temperature=0.1,
                google_api_key=api_key,
            )
        return self._llm

    def categorize_commits(
        self,
        repo_name: str,
        commits: list[dict],
        include_knowledge_graph: bool = True,
        db = None
    ) -> List[FeatureClusterItem]:
        prompt = ChatPromptTemplate.from_messages([
            ("system", """You are a Principal Software Architect analyzing a Git repository's commit history.
Your task is to analyze all commit messages and group the commits into distinct, cohesive, high-level product features.

Rules:
1. Every commit SHA must belong to at most one most appropriate feature cluster.
2. Group commits logically by architectural and functional cohesiveness (e.g. 'Authentication & OAuth Flow', 'Database Persistence & Migrations', 'GitHub API Integration', 'Frontend UI & Theme', 'AI Processing Pipeline').
3. Disregard pure boilerplate noise by merging minor chore commits into their closest functional feature.
4. Output must strictly be a valid JSON array of objects conforming to this schema:
[
  {{
    "feature_id": "kebab-case-slug",
    "feature_name": "Human Readable Feature Name",
    "summary": "1-2 concise sentences describing what this feature encompasses.",
    "category": "Authentication | Database | UI | Backend API | DevOps | AI | General",
    "commit_shas": ["sha1", "sha2"],
    "commit_count": 2,
    "primary_files_hint": ["app/routes/auth_routes.py", "app/models/user.py"]
  }}
]
Do NOT enclose output in markdown backticks or extra commentary. Return raw JSON array only."""),
            ("user", "Repository: {repo_name}\n\nCommits:\n{commits_json}")
        ])

        parsed = None
        try:
            chain = prompt | self.get_llm()
            commits_payload = json.dumps([
                {
                    "sha": c.get("sha", "")[:7],
                    "message": c.get("message", ""),
                    "date": c.get("date", ""),
                    "author": c.get("author", "")
                }
                for c in commits
            ], indent=2)

            response = chain.invoke({"repo_name": repo_name, "commits_json": commits_payload})
            raw_text = response.content.strip()

            # Clean any accidental markdown code fences
            if raw_text.startswith("```json"):
                raw_text = raw_text[7:]
            elif raw_text.startswith("```"):
                raw_text = raw_text[3:]
            if raw_text.endswith("```"):
                raw_text = raw_text[:-3]

            raw_text = raw_text.strip()

            try:
                parsed = json.loads(raw_text)
            except json.JSONDecodeError:
                match = re.search(r'\[.*\]', raw_text, re.DOTALL)
                if match:
                    parsed = json.loads(match.group(0))
        except Exception as e:
            # Fallback to intelligent commit clustering based on semantic scopes & message analysis
            parsed = None

        if not parsed:
            # Heuristic grouping by message content
            buckets: dict[str, dict] = {
                "Authentication & Security": {"category": "Authentication", "shas": [], "summary": "User authentication, OAuth2 token handling, session guards, and access control."},
                "Database & Persistence": {"category": "Database", "shas": [], "summary": "Data persistence models, SQLite/PostgreSQL schemas, and ORM migrations."},
                "Frontend UI & Shell": {"category": "UI", "shas": [], "summary": "User interface components, responsive layout systems, views, and styling tokens."},
                "Backend API & Routing": {"category": "Backend API", "shas": [], "summary": "FastAPI endpoints, middleware handlers, request controllers, and route declarations."},
                "AI & Intelligence Services": {"category": "AI", "shas": [], "summary": "LLM integrations, feature clustering, telemetry graphs, and automated doc synthesis."},
                "DevOps & Infrastructure": {"category": "DevOps", "shas": [], "summary": "Configuration management, container setup, dependency locks, and CI workflows."},
                "Core Engineering Features": {"category": "General", "shas": [], "summary": "Core utilities, foundational business logic, and shared codebase libraries."}
            }

            for c in commits:
                msg = c.get("message", "").lower()
                sha_short = c.get("sha", "")[:7]
                if any(k in msg for k in ["auth", "login", "jwt", "token", "oauth", "security", "user"]):
                    buckets["Authentication & Security"]["shas"].append(sha_short)
                elif any(k in msg for k in ["db", "database", "sql", "migration", "table", "schema", "model"]):
                    buckets["Database & Persistence"]["shas"].append(sha_short)
                elif any(k in msg for k in ["ui", "css", "style", "page", "component", "frontend", "view", "theme"]):
                    buckets["Frontend UI & Shell"]["shas"].append(sha_short)
                elif any(k in msg for k in ["api", "route", "endpoint", "controller", "server", "fastapi"]):
                    buckets["Backend API & Routing"]["shas"].append(sha_short)
                elif any(k in msg for k in ["ai", "gemini", "langchain", "prompt", "doc", "cluster"]):
                    buckets["AI & Intelligence Services"]["shas"].append(sha_short)
                elif any(k in msg for k in ["docker", "ci", "deploy", "action", "infra", "config", "env"]):
                    buckets["DevOps & Infrastructure"]["shas"].append(sha_short)
                else:
                    buckets["Core Engineering Features"]["shas"].append(sha_short)

            parsed = []
            for name, b in buckets.items():
                if b["shas"]:
                    slug = name.lower().replace(" & ", "-").replace(" ", "-")
                    parsed.append({
                        "feature_id": slug,
                        "feature_name": name,
                        "summary": b["summary"],
                        "category": b["category"],
                        "commit_shas": b["shas"],
                        "commit_count": len(b["shas"]),
                        "primary_files_hint": []
                    })

        # Build commit lookup map for fast author enrichment
        commit_lookup: dict[str, dict] = {}
        for c in commits:
            full_sha = c.get("sha", "")
            short_sha = full_sha[:7]
            commit_lookup[full_sha] = c
            commit_lookup[short_sha] = c

        results = []
        for item in parsed:
            # Ensure commit_count is set
            shas = item.get("commit_shas", [])
            item["commit_count"] = item.get("commit_count") or len(shas)

            # Match commits belonging to this feature
            feature_commits = []
            for sha in shas:
                s_sha = sha[:7]
                if s_sha in commit_lookup:
                    feature_commits.append(commit_lookup[s_sha])
                elif sha in commit_lookup:
                    feature_commits.append(commit_lookup[sha])

            feature_item = FeatureClusterItem(**item)
            if include_knowledge_graph and feature_commits:
                feature_item.knowledge_graph = self.knowledge_service.calculate_feature_knowledge(
                    commits=feature_commits,
                    feature_id=feature_item.feature_id,
                    feature_name=feature_item.feature_name
                )
            results.append(feature_item)

        return results
