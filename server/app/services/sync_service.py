from typing import Optional, Dict, Any, List
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.user import User
from app.services.cache_service import CacheService
from app.services.github_functions import (
    get_latest_repos,
    get_repo_commits,
    get_commit_authors,
)
from app.services.knowledge_service import KnowledgeConcentrationService
from app.services.ai_feature_service import LLMFeatureCategorizer


class SyncService:
    def __init__(self):
        self.knowledge_service = KnowledgeConcentrationService()
        self._categorizer = None

    @property
    def categorizer(self):
        if self._categorizer is None:
            self._categorizer = LLMFeatureCategorizer()
        return self._categorizer

    def _ensure_token(self, user: User) -> str:
        token = user.github_access_token
        if not token:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User does not have a linked GitHub access token"
            )
        return token

    def sync_repositories(self, db: Session, user: User) -> List[str]:
        token = self._ensure_token(user)
        repos = get_latest_repos(token)
        CacheService.set_repositories(db, user.id, repos)
        return repos

    def sync_commits(self, db: Session, user: User, repo: str, limit: int = 100) -> List[Dict[str, Any]]:
        token = self._ensure_token(user)
        commits = get_repo_commits(token, repo, limit=limit)
        CacheService.set_commits(db, user.id, repo, commits)
        return commits

    def sync_contributors(self, db: Session, user: User, repo: str) -> List[Dict[str, Any]]:
        token = self._ensure_token(user)
        contributors = get_commit_authors(token, repo)
        CacheService.set_contributors(db, user.id, repo, contributors)
        return contributors

    def sync_knowledge_graphs(self, db: Session, user: User, repo: str, max_commits: int = 100) -> Dict[str, Any]:
        token = self._ensure_token(user)
        # Fetch fresh commits or check existing
        commits = get_repo_commits(token, repo, limit=max_commits)
        CacheService.set_commits(db, user.id, repo, commits)

        # 1. Calculate Concentration Graph
        concentration_graph = self.knowledge_service.calculate_repository_knowledge(
            repo_name=repo,
            all_commits=commits,
            feature_breakdown=[]
        )
        conc_dict = concentration_graph.model_dump()
        CacheService.set_repo_knowledge_graph(db, user.id, repo, "concentration", conc_dict)

        # 2. Heuristic domain clustering for full graph
        clusters: Dict[str, List[dict]] = {}
        for c in commits:
            msg = c.get("message", "").lower()
            if any(k in msg for k in ["auth", "login", "jwt", "token", "oauth", "security", "user"]):
                cat = "Authentication & Security"
            elif any(k in msg for k in ["db", "database", "sql", "migration", "table", "schema", "model"]):
                cat = "Database & Models"
            elif any(k in msg for k in ["ui", "css", "style", "page", "component", "frontend", "view", "theme"]):
                cat = "Frontend UI & Views"
            elif any(k in msg for k in ["api", "route", "endpoint", "controller", "server", "fastapi"]):
                cat = "Backend & API Routing"
            elif any(k in msg for k in ["ai", "gemini", "langchain", "prompt", "doc", "cluster"]):
                cat = "AI & Intelligence Services"
            elif any(k in msg for k in ["docker", "ci", "deploy", "action", "infra", "config", "env"]):
                cat = "DevOps & Infrastructure"
            else:
                cat = "Core Features & Utilities"
            clusters.setdefault(cat, []).append(c)

        feature_graphs = []
        for cat_name, cat_commits in clusters.items():
            feat_id = cat_name.lower().replace(" & ", "-").replace(" ", "-")
            fg = self.knowledge_service.calculate_feature_knowledge(
                commits=cat_commits,
                feature_id=feat_id,
                feature_name=cat_name
            )
            # Also cache each feature knowledge graph
            CacheService.set_feature_knowledge_graph(db, user.id, repo, feat_id, fg.model_dump())
            feature_graphs.append(fg)

        full_graph = self.knowledge_service.calculate_repository_knowledge(
            repo_name=repo,
            all_commits=commits,
            feature_breakdown=feature_graphs
        )
        full_dict = full_graph.model_dump()
        CacheService.set_repo_knowledge_graph(db, user.id, repo, "full_graph", full_dict)

        return {
            "concentration": conc_dict,
            "full_graph": full_dict
        }

    def sync_ai_features(self, db: Session, user: User, repo: str, max_commits: int = 50) -> Dict[str, Any]:
        token = self._ensure_token(user)
        # Check cached commits or fetch
        cached_commits = CacheService.get_commits(db, user.id, repo, limit=max_commits)
        if not cached_commits:
            cached_commits = get_repo_commits(token, repo, limit=max_commits)
            CacheService.set_commits(db, user.id, repo, cached_commits)

        scoped_commits = cached_commits[:max_commits]
        features = self.categorizer.categorize_commits(
            repo_name=repo,
            commits=scoped_commits,
            include_knowledge_graph=True
        )

        features_serialized = [f.model_dump() for f in features]
        CacheService.set_feature_categorization(
            db=db,
            user_id=user.id,
            repo_name=repo,
            total_commits=len(scoped_commits),
            features_data=features_serialized
        )

        # Cache each feature graph
        for f in features:
            if f.knowledge_graph:
                CacheService.set_feature_knowledge_graph(
                    db=db,
                    user_id=user.id,
                    repo_name=repo,
                    feature_id=f.feature_id,
                    data=f.knowledge_graph.model_dump()
                )

        return {
            "repo": repo,
            "total_commits": len(scoped_commits),
            "features_count": len(features_serialized)
        }

    def sync_repository_full(
        self,
        db: Session,
        user: User,
        repo: str,
        max_commits: int = 100,
        include_ai: bool = False
    ) -> Dict[str, Any]:
        commits = self.sync_commits(db, user, repo, limit=max_commits)
        contributors = self.sync_contributors(db, user, repo)
        kg_data = self.sync_knowledge_graphs(db, user, repo, max_commits=max_commits)

        details = {
            "commits_count": len(commits),
            "contributors_count": len(contributors),
            "knowledge_graphs_synced": True
        }

        if include_ai:
            ai_data = self.sync_ai_features(db, user, repo, max_commits=min(max_commits, 50))
            details["ai_features_count"] = ai_data.get("features_count", 0)

        return details
