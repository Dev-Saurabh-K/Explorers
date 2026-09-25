from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.cached_responses import (
    CachedRepository,
    CachedCommit,
    CachedContributor,
    CachedContributorCommit,
    CachedRepositoryKnowledgeGraph,
    CachedFeatureKnowledgeGraph,
    CachedFeatureCategorization,
    CachedFeatureDoc,
    utc_now,
)


def parse_datetime(val: Any) -> datetime:
    if isinstance(val, datetime):
        return val
    if isinstance(val, str) and val:
        try:
            return datetime.fromisoformat(val.replace("Z", "+00:00"))
        except Exception:
            pass
    return datetime.now(timezone.utc)


class CacheService:
    # ----------------- REPOSITORIES -----------------
    @staticmethod
    def get_repositories(db: Session, user_id: int) -> Optional[List[str]]:
        rows = (
            db.query(CachedRepository)
            .filter(CachedRepository.user_id == user_id)
            .order_by(CachedRepository.id.asc())
            .all()
        )
        if not rows:
            return None
        return [r.repo_name for r in rows]

    @staticmethod
    def set_repositories(db: Session, user_id: int, repo_names: List[str]) -> List[str]:
        # Delete existing cached repos for this user
        db.query(CachedRepository).filter(CachedRepository.user_id == user_id).delete()
        now = utc_now()
        for name in repo_names:
            db.add(CachedRepository(user_id=user_id, repo_name=name, synced_at=now))
        db.commit()
        return repo_names

    # ----------------- COMMITS -----------------
    @staticmethod
    def get_commits(db: Session, user_id: int, repo_name: str, limit: Optional[int] = None) -> Optional[List[Dict[str, Any]]]:
        query = (
            db.query(CachedCommit)
            .filter(CachedCommit.user_id == user_id, CachedCommit.repo_name == repo_name)
            .order_by(CachedCommit.date.desc())
        )
        if limit:
            query = query.limit(limit)
        rows = query.all()
        if not rows:
            return None
        return [
            {
                "sha": r.sha,
                "message": r.message,
                "author": r.author,
                "avatar_url": r.avatar_url,
                "date": r.date.isoformat() if isinstance(r.date, datetime) else str(r.date)
            }
            for r in rows
        ]

    @staticmethod
    def set_commits(db: Session, user_id: int, repo_name: str, commits: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        db.query(CachedCommit).filter(
            CachedCommit.user_id == user_id,
            CachedCommit.repo_name == repo_name
        ).delete()
        now = utc_now()
        for c in commits:
            db.add(CachedCommit(
                user_id=user_id,
                repo_name=repo_name,
                sha=c.get("sha", ""),
                message=c.get("message", ""),
                author=c.get("author", "Unknown"),
                avatar_url=c.get("avatar_url"),
                date=parse_datetime(c.get("date")),
                synced_at=now
            ))
        db.commit()
        return commits

    # ----------------- CONTRIBUTORS -----------------
    @staticmethod
    def get_contributors(db: Session, user_id: int, repo_name: str) -> Optional[List[Dict[str, Any]]]:
        rows = (
            db.query(CachedContributor)
            .filter(CachedContributor.user_id == user_id, CachedContributor.repo_name == repo_name)
            .all()
        )
        if not rows:
            return None
        return [{"username": r.username, "avatar_url": r.avatar_url} for r in rows]

    @staticmethod
    def set_contributors(db: Session, user_id: int, repo_name: str, contributors: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        db.query(CachedContributor).filter(
            CachedContributor.user_id == user_id,
            CachedContributor.repo_name == repo_name
        ).delete()
        now = utc_now()
        for cont in contributors:
            db.add(CachedContributor(
                user_id=user_id,
                repo_name=repo_name,
                username=cont.get("username", ""),
                avatar_url=cont.get("avatar_url"),
                synced_at=now
            ))
        db.commit()
        return contributors

    # ----------------- CONTRIBUTOR COMMITS -----------------
    @staticmethod
    def get_contributor_commits(db: Session, user_id: int, repo_name: str, contributor: str) -> Optional[List[Dict[str, Any]]]:
        rows = (
            db.query(CachedContributorCommit)
            .filter(
                CachedContributorCommit.user_id == user_id,
                CachedContributorCommit.repo_name == repo_name,
                CachedContributorCommit.contributor == contributor
            )
            .order_by(CachedContributorCommit.date.desc())
            .all()
        )
        if rows:
            return [
                {
                    "sha": r.sha,
                    "message": r.message,
                    "date": r.date.isoformat() if isinstance(r.date, datetime) else str(r.date)
                }
                for r in rows
            ]
        # Fallback: check if we have commits in CachedCommit for this author
        commit_rows = (
            db.query(CachedCommit)
            .filter(
                CachedCommit.user_id == user_id,
                CachedCommit.repo_name == repo_name,
                CachedCommit.author == contributor
            )
            .order_by(CachedCommit.date.desc())
            .all()
        )
        if commit_rows:
            return [
                {
                    "sha": r.sha,
                    "message": r.message,
                    "date": r.date.isoformat() if isinstance(r.date, datetime) else str(r.date)
                }
                for r in commit_rows
            ]
        return None

    @staticmethod
    def set_contributor_commits(
        db: Session,
        user_id: int,
        repo_name: str,
        contributor: str,
        commits: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        db.query(CachedContributorCommit).filter(
            CachedContributorCommit.user_id == user_id,
            CachedContributorCommit.repo_name == repo_name,
            CachedContributorCommit.contributor == contributor
        ).delete()
        now = utc_now()
        for c in commits:
            db.add(CachedContributorCommit(
                user_id=user_id,
                repo_name=repo_name,
                contributor=contributor,
                sha=c.get("sha", ""),
                message=c.get("message", ""),
                date=parse_datetime(c.get("date")),
                synced_at=now
            ))
        db.commit()
        return commits

    # ----------------- REPOSITORY KNOWLEDGE GRAPH -----------------
    @staticmethod
    def get_repo_knowledge_graph(db: Session, user_id: int, repo_name: str, graph_type: str = "concentration") -> Optional[Dict[str, Any]]:
        row = (
            db.query(CachedRepositoryKnowledgeGraph)
            .filter(
                CachedRepositoryKnowledgeGraph.user_id == user_id,
                CachedRepositoryKnowledgeGraph.repo_name == repo_name,
                CachedRepositoryKnowledgeGraph.graph_type == graph_type
            )
            .first()
        )
        if not row:
            return None
        return row.data

    @staticmethod
    def set_repo_knowledge_graph(db: Session, user_id: int, repo_name: str, graph_type: str, data: Dict[str, Any]) -> Dict[str, Any]:
        row = (
            db.query(CachedRepositoryKnowledgeGraph)
            .filter(
                CachedRepositoryKnowledgeGraph.user_id == user_id,
                CachedRepositoryKnowledgeGraph.repo_name == repo_name,
                CachedRepositoryKnowledgeGraph.graph_type == graph_type
            )
            .first()
        )
        now = utc_now()
        if not row:
            row = CachedRepositoryKnowledgeGraph(
                user_id=user_id,
                repo_name=repo_name,
                graph_type=graph_type,
                data=data,
                synced_at=now
            )
            db.add(row)
        else:
            row.data = data
            row.synced_at = now
        db.commit()
        return data

    # ----------------- FEATURE KNOWLEDGE GRAPH -----------------
    @staticmethod
    def get_feature_knowledge_graph(db: Session, user_id: int, repo_name: str, feature_id: str) -> Optional[Dict[str, Any]]:
        row = (
            db.query(CachedFeatureKnowledgeGraph)
            .filter(
                CachedFeatureKnowledgeGraph.user_id == user_id,
                CachedFeatureKnowledgeGraph.repo_name == repo_name,
                CachedFeatureKnowledgeGraph.feature_id == feature_id
            )
            .first()
        )
        if not row:
            return None
        return row.data

    @staticmethod
    def set_feature_knowledge_graph(db: Session, user_id: int, repo_name: str, feature_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        row = (
            db.query(CachedFeatureKnowledgeGraph)
            .filter(
                CachedFeatureKnowledgeGraph.user_id == user_id,
                CachedFeatureKnowledgeGraph.repo_name == repo_name,
                CachedFeatureKnowledgeGraph.feature_id == feature_id
            )
            .first()
        )
        now = utc_now()
        if not row:
            row = CachedFeatureKnowledgeGraph(
                user_id=user_id,
                repo_name=repo_name,
                feature_id=feature_id,
                data=data,
                synced_at=now
            )
            db.add(row)
        else:
            row.data = data
            row.synced_at = now
        db.commit()
        return data

    # ----------------- FEATURE CATEGORIZATION -----------------
    @staticmethod
    def get_feature_categorization(db: Session, user_id: int, repo_name: str) -> Optional[Dict[str, Any]]:
        row = (
            db.query(CachedFeatureCategorization)
            .filter(
                CachedFeatureCategorization.user_id == user_id,
                CachedFeatureCategorization.repo_name == repo_name
            )
            .first()
        )
        if not row:
            return None
        return {
            "repo": row.repo_name,
            "total_commits": row.total_commits,
            "features": row.features_data
        }

    @staticmethod
    def set_feature_categorization(
        db: Session,
        user_id: int,
        repo_name: str,
        total_commits: int,
        features_data: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        row = (
            db.query(CachedFeatureCategorization)
            .filter(
                CachedFeatureCategorization.user_id == user_id,
                CachedFeatureCategorization.repo_name == repo_name
            )
            .first()
        )
        now = utc_now()
        if not row:
            row = CachedFeatureCategorization(
                user_id=user_id,
                repo_name=repo_name,
                total_commits=total_commits,
                features_data=features_data,
                synced_at=now
            )
            db.add(row)
        else:
            row.total_commits = total_commits
            row.features_data = features_data
            row.synced_at = now
        db.commit()
        return {
            "repo": repo_name,
            "total_commits": total_commits,
            "features": features_data
        }

    # ----------------- FEATURE DOCS -----------------
    @staticmethod
    def get_feature_doc(db: Session, user_id: int, repo_name: str, feature_id: str) -> Optional[Dict[str, Any]]:
        row = (
            db.query(CachedFeatureDoc)
            .filter(
                CachedFeatureDoc.user_id == user_id,
                CachedFeatureDoc.repo_name == repo_name,
                CachedFeatureDoc.feature_id == feature_id
            )
            .first()
        )
        if not row:
            return None
        return {
            "repo": row.repo_name,
            "feature_id": row.feature_id,
            "feature_name": row.feature_name,
            "filename": row.filename,
            "markdown_content": row.markdown_content
        }

    @staticmethod
    def set_feature_doc(
        db: Session,
        user_id: int,
        repo_name: str,
        feature_id: str,
        feature_name: str,
        filename: str,
        markdown_content: str
    ) -> Dict[str, Any]:
        row = (
            db.query(CachedFeatureDoc)
            .filter(
                CachedFeatureDoc.user_id == user_id,
                CachedFeatureDoc.repo_name == repo_name,
                CachedFeatureDoc.feature_id == feature_id
            )
            .first()
        )
        now = utc_now()
        if not row:
            row = CachedFeatureDoc(
                user_id=user_id,
                repo_name=repo_name,
                feature_id=feature_id,
                feature_name=feature_name,
                filename=filename,
                markdown_content=markdown_content,
                synced_at=now
            )
            db.add(row)
        else:
            row.feature_name = feature_name
            row.filename = filename
            row.markdown_content = markdown_content
            row.synced_at = now
        db.commit()
        return {
            "repo": repo_name,
            "feature_id": feature_id,
            "feature_name": feature_name,
            "filename": filename,
            "markdown_content": markdown_content
        }

    # ----------------- SYNC STATUS -----------------
    @staticmethod
    def get_sync_status(db: Session, user_id: int, repo_name: Optional[str] = None) -> Dict[str, Dict[str, Any]]:
        status = {}

        # 1. Repositories
        repo_count = db.query(func.count(CachedRepository.id)).filter(CachedRepository.user_id == user_id).scalar() or 0
        repo_last = db.query(func.max(CachedRepository.synced_at)).filter(CachedRepository.user_id == user_id).scalar()
        status["repositories"] = {"count": repo_count, "last_synced": repo_last}

        if repo_name:
            # 2. Commits
            c_count = db.query(func.count(CachedCommit.id)).filter(
                CachedCommit.user_id == user_id, CachedCommit.repo_name == repo_name
            ).scalar() or 0
            c_last = db.query(func.max(CachedCommit.synced_at)).filter(
                CachedCommit.user_id == user_id, CachedCommit.repo_name == repo_name
            ).scalar()
            status["commits"] = {"count": c_count, "last_synced": c_last}

            # 3. Contributors
            cont_count = db.query(func.count(CachedContributor.id)).filter(
                CachedContributor.user_id == user_id, CachedContributor.repo_name == repo_name
            ).scalar() or 0
            cont_last = db.query(func.max(CachedContributor.synced_at)).filter(
                CachedContributor.user_id == user_id, CachedContributor.repo_name == repo_name
            ).scalar()
            status["contributors"] = {"count": cont_count, "last_synced": cont_last}

            # 4. Knowledge Graphs
            kg_count = db.query(func.count(CachedRepositoryKnowledgeGraph.id)).filter(
                CachedRepositoryKnowledgeGraph.user_id == user_id, CachedRepositoryKnowledgeGraph.repo_name == repo_name
            ).scalar() or 0
            kg_last = db.query(func.max(CachedRepositoryKnowledgeGraph.synced_at)).filter(
                CachedRepositoryKnowledgeGraph.user_id == user_id, CachedRepositoryKnowledgeGraph.repo_name == repo_name
            ).scalar()
            status["repo_knowledge_graphs"] = {"count": kg_count, "last_synced": kg_last}

            # 5. Feature Knowledge Graphs
            fkg_count = db.query(func.count(CachedFeatureKnowledgeGraph.id)).filter(
                CachedFeatureKnowledgeGraph.user_id == user_id, CachedFeatureKnowledgeGraph.repo_name == repo_name
            ).scalar() or 0
            fkg_last = db.query(func.max(CachedFeatureKnowledgeGraph.synced_at)).filter(
                CachedFeatureKnowledgeGraph.user_id == user_id, CachedFeatureKnowledgeGraph.repo_name == repo_name
            ).scalar()
            status["feature_knowledge_graphs"] = {"count": fkg_count, "last_synced": fkg_last}

            # 6. Feature Categorizations
            fc_count = db.query(func.count(CachedFeatureCategorization.id)).filter(
                CachedFeatureCategorization.user_id == user_id, CachedFeatureCategorization.repo_name == repo_name
            ).scalar() or 0
            fc_last = db.query(func.max(CachedFeatureCategorization.synced_at)).filter(
                CachedFeatureCategorization.user_id == user_id, CachedFeatureCategorization.repo_name == repo_name
            ).scalar()
            status["feature_categorization"] = {"count": fc_count, "last_synced": fc_last}

            # 7. Feature Docs
            fd_count = db.query(func.count(CachedFeatureDoc.id)).filter(
                CachedFeatureDoc.user_id == user_id, CachedFeatureDoc.repo_name == repo_name
            ).scalar() or 0
            fd_last = db.query(func.max(CachedFeatureDoc.synced_at)).filter(
                CachedFeatureDoc.user_id == user_id, CachedFeatureDoc.repo_name == repo_name
            ).scalar()
            status["feature_docs"] = {"count": fd_count, "last_synced": fd_last}

        return status
