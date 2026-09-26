from datetime import datetime, timezone
from typing import Optional, Any
from sqlalchemy import String, Integer, Float, Text, DateTime, ForeignKey, UniqueConstraint, JSON, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from app.database.database import Base


def utc_now():
    return datetime.now(timezone.utc)


class DeveloperStatus(Base):
    """Tracks developer roster status (active, quitted/offboarded) and metadata."""
    __tablename__ = "developer_statuses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    repo_name: Mapped[Optional[str]] = mapped_column(String, nullable=True, index=True)
    developer_name: Mapped[str] = mapped_column(String, nullable=False, index=True)
    status: Mapped[str] = mapped_column(String, nullable=False, default="active")  # active | quitted | offboarded
    role: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    email: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    avatar_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    quit_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utc_now,
        nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utc_now,
        onupdate=utc_now,
        nullable=False
    )

    __table_args__ = (
        UniqueConstraint("user_id", "developer_name", "repo_name", name="uq_dev_status_user_dev_repo"),
    )


class FeatureSuccessionAssignment(Base):
    """Stores automated and manual feature succession reassignments when developers depart."""
    __tablename__ = "feature_succession_assignments"

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
    departed_developer: Mapped[str] = mapped_column(String, nullable=False, index=True)
    assigned_developer: Mapped[str] = mapped_column(String, nullable=False, index=True)
    suitability_score: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    score_breakdown: Mapped[Any] = mapped_column(JSON, nullable=False)
    is_manual_override: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    status: Mapped[str] = mapped_column(String, default="assigned", nullable=False)  # assigned | reverted | overridden
    assigned_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utc_now,
        nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utc_now,
        onupdate=utc_now,
        nullable=False
    )

    __table_args__ = (
        UniqueConstraint("user_id", "repo_name", "feature_id", name="uq_succ_assign_user_repo_feat"),
    )


class DeveloperExperienceProfile(Base):
    """Caches aggregated past developer metrics, touched files, domain affinities, and availability to prevent GitHub API overload."""
    __tablename__ = "developer_experience_profiles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    developer_name: Mapped[str] = mapped_column(String, nullable=False, index=True)
    repo_name: Mapped[Optional[str]] = mapped_column(String, nullable=True, index=True)
    total_commits: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    touched_files: Mapped[Any] = mapped_column(JSON, nullable=False)
    domains: Mapped[Any] = mapped_column(JSON, nullable=False)
    primary_languages: Mapped[Any] = mapped_column(JSON, nullable=False)
    features_summary: Mapped[Any] = mapped_column(JSON, nullable=False)
    availability_score: Mapped[float] = mapped_column(Float, default=1.0, nullable=False)
    synced_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utc_now,
        nullable=False
    )

    __table_args__ = (
        UniqueConstraint("user_id", "developer_name", "repo_name", name="uq_dev_exp_user_dev_repo"),
    )
