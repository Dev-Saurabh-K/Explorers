from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class CandidateScoreBreakdown(BaseModel):
    developer_name: str
    avatar_url: Optional[str] = None
    role: Optional[str] = None
    total_score: float = Field(..., description="Overall composite score (0-100)")
    direct_experience_score: float = Field(..., description="Direct touches and commits in this feature (0-35)")
    file_overlap_score: float = Field(..., description="Touched files and directory matching (0-25)")
    domain_affinity_score: float = Field(..., description="Technical stack and domain category affinity (0-25)")
    availability_score: float = Field(..., description="Availability & current workload bandwidth (0-15)")
    rank: int = Field(..., description="1-based candidate rank")
    match_tier: str = Field(..., description="EXCELLENT MATCH | STRONG CANDIDATE | MODERATE FIT | BACKUP")
    rationale: str = Field(..., description="Detailed explanation of score drivers")


class FeatureReassignmentResult(BaseModel):
    feature_id: str
    feature_name: str
    category: str
    previous_owner: str
    assigned_successor: str
    successor_avatar: Optional[str] = None
    successor_score: float
    status: str = "assigned"  # assigned | overridden | reverted
    is_manual_override: bool = False
    top_candidates: List[CandidateScoreBreakdown] = []
    rationale: str


class DeveloperStatusResponse(BaseModel):
    developer_name: str
    role: str
    avatar_url: Optional[str] = None
    email: Optional[str] = None
    status: str = "active"  # active | quitted
    is_dominant: bool = False
    knowledge_percentage: float = 0.0
    risk_level: str = "LOW"
    commits_count: int = 0
    owned_features: List[str] = []
    top_domains: List[str] = []
    availability_score: float = 1.0
    quit_at: Optional[str] = None


class TeamOverviewResponse(BaseModel):
    total_developers: int
    active_developers: int
    quitted_developers: int
    orphaned_features_count: int
    reassigned_features_count: int
    api_calls_made: int = 0  # 0 indicates zero GitHub API overload
    cache_status: str = "DATABASE_ACTIVE"
    developers: List[DeveloperStatusResponse]
    recent_assignments: List[FeatureReassignmentResult] = []


class OffboardDeveloperRequest(BaseModel):
    developer_name: str
    repo: Optional[str] = None
    reason: Optional[str] = None


class OffboardDeveloperResponse(BaseModel):
    developer_name: str
    status: str
    affected_features_count: int
    reassignments: List[FeatureReassignmentResult]
    api_calls_made: int = 0
    message: str


class ReinstateDeveloperRequest(BaseModel):
    developer_name: str
    repo: Optional[str] = None


class OverrideSuccessionRequest(BaseModel):
    feature_id: str
    repo: str
    new_developer: str
    notes: Optional[str] = None


class SimulateSuccessionRequest(BaseModel):
    developer_name: str
    repo: str
