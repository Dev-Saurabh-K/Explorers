from datetime import datetime, timezone
from typing import Optional, Any
from sqlalchemy import String, Integer, Text, DateTime, ForeignKey, UniqueConstraint, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.database import Base


def utc_now():
    return datetime.now(timezone.utc)


class CachedRepository(Base):
    """Caches list of user repositories (GET /github/repos)."""
    __tablename__ = "cached_repositories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    repo_name: Mapped[str] = mapped_column(String, nullable=False, index=True)
    synced_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utc_now,
        nullable=False
    )

    __table_args__ = (
        UniqueConstraint("user_id", "repo_name", name="uq_cached_repo_user_repo"),
    )


class CachedCommit(Base):
    """Caches repository commits (GET /github/repo/commits)."""
    __tablename__ = "cached_commits"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    repo_name: Mapped[str] = mapped_column(String, nullable=False, index=True)
    sha: Mapped[str] = mapped_column(String, nullable=False, index=True)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    author: Mapped[str] = mapped_column(String, nullable=False, index=True)
    avatar_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    synced_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utc_now,
        nullable=False
    )

    __table_args__ = (
        UniqueConstraint("user_id", "repo_name", "sha", name="uq_cached_commit_user_repo_sha"),
    )


class CachedContributor(Base):
    """Caches repository contributors (GET /github/repo/contributors)."""
    __tablename__ = "cached_contributors"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    repo_name: Mapped[str] = mapped_column(String, nullable=False, index=True)
    username: Mapped[str] = mapped_column(String, nullable=False, index=True)
    avatar_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    synced_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utc_now,
        nullable=False
    )

    __table_args__ = (
        UniqueConstraint("user_id", "repo_name", "username", name="uq_cached_contrib_user_repo_user"),
    )


class CachedContributorCommit(Base):
    """Caches contributor-specific commits (GET /github/repo/contributor/commits)."""
    __tablename__ = "cached_contributor_commits"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    repo_name: Mapped[str] = mapped_column(String, nullable=False, index=True)
    contributor: Mapped[str] = mapped_column(String, nullable=False, index=True)
    sha: Mapped[str] = mapped_column(String, nullable=False, index=True)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    synced_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utc_now,
        nullable=False
    )

    __table_args__ = (
        UniqueConstraint("user_id", "repo_name", "contributor", "sha", name="uq_cached_cc_user_repo_c_sha"),
    )


class CachedRepositoryKnowledgeGraph(Base):
    """Caches repository-wide knowledge graphs and concentration metrics."""
    __tablename__ = "cached_repo_knowledge_graphs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    repo_name: Mapped[str] = mapped_column(String, nullable=False, index=True)
    graph_type: Mapped[str] = mapped_column(String, nullable=False, default="concentration", index=True)
    data: Mapped[Any] = mapped_column(JSON, nullable=False)
    synced_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utc_now,
        nullable=False
    )

    __table_args__ = (
        UniqueConstraint("user_id", "repo_name", "graph_type", name="uq_cached_repo_kg_user_repo_type"),
    )


class CachedFeatureKnowledgeGraph(Base):
    """Caches feature-level knowledge graphs and bus factors."""
    __tablename__ = "cached_feature_knowledge_graphs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    repo_name: Mapped[str] = mapped_column(String, nullable=False, index=True)
    feature_id: Mapped[str] = mapped_column(String, nullable=False, index=True)
    data: Mapped[Any] = mapped_column(JSON, nullable=False)
    synced_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utc_now,
        nullable=False
    )

    __table_args__ = (
        UniqueConstraint("user_id", "repo_name", "feature_id", name="uq_cached_feat_kg_user_repo_feat"),
    )


class CachedFeatureCategorization(Base):
    """Caches AI feature clustering and categorization."""
    __tablename__ = "cached_feature_categorizations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    repo_name: Mapped[str] = mapped_column(String, nullable=False, index=True)
    total_commits: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    features_data: Mapped[Any] = mapped_column(JSON, nullable=False)
    synced_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utc_now,
        nullable=False
    )

    __table_args__ = (
        UniqueConstraint("user_id", "repo_name", name="uq_cached_feat_cat_user_repo"),
    )


class CachedFeatureDoc(Base):
    """Caches AI synthesized technical documentation files."""
    __tablename__ = "cached_feature_docs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    repo_name: Mapped[str] = mapped_column(String, nullable=False, index=True)
    feature_id: Mapped[str] = mapped_column(String, nullable=False, index=True)
    feature_name: Mapped[str] = mapped_column(String, nullable=False)
    filename: Mapped[str] = mapped_column(String, nullable=False)
    markdown_content: Mapped[str] = mapped_column(Text, nullable=False)
    synced_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utc_now,
        nullable=False
    )

    __table_args__ = (
        UniqueConstraint("user_id", "repo_name", "feature_id", name="uq_cached_doc_user_repo_feat"),
    )
