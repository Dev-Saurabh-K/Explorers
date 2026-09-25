import json
import os
import re
from typing import List
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from app.core.config import settings
from app.schemas.ai_schemas import FeatureClusterItem


class LLMFeatureCategorizer:
    def __init__(self):
        self._llm = None

    def get_llm(self):
        if self._llm is None:
            api_key = settings.google_api_key or os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
            if not api_key:
                raise ValueError("Google Gemini API Key is required. Please set GOOGLE_API_KEY in .env or config.")
            self._llm = ChatGoogleGenerativeAI(
                model="gemini-2.5-flash",
                temperature=0.1,
                google_api_key=api_key,
            )
        return self._llm

    def categorize_commits(self, repo_name: str, commits: list[dict]) -> List[FeatureClusterItem]:
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

        # Parse JSON
        try:
            parsed = json.loads(raw_text)
        except json.JSONDecodeError:
            # Attempt to extract JSON array using regex if surrounded by prose
            match = re.search(r'\[.*\]', raw_text, re.DOTALL)
            if match:
                parsed = json.loads(match.group(0))
            else:
                # Fallback to single general feature cluster
                return [
                    FeatureClusterItem(
                        feature_id="core-features",
                        feature_name="Core Repository Features",
                        summary=f"Aggregated commits for {repo_name}",
                        category="General",
                        commit_shas=[c.get("sha", "")[:7] for c in commits],
                        commit_count=len(commits),
                        primary_files_hint=[]
                    )
                ]

        results = []
        for item in parsed:
            # Ensure commit_count is set
            shas = item.get("commit_shas", [])
            item["commit_count"] = item.get("commit_count") or len(shas)
            results.append(FeatureClusterItem(**item))

        return results
