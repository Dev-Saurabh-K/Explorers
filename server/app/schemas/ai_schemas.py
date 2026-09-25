from pydantic import BaseModel, Field
from typing import List, Optional


class FeatureClusterItem(BaseModel):
    feature_id: str = Field(..., description="Unique kebab-case identifier, e.g., 'github-oauth-authentication'")
    feature_name: str = Field(..., description="Human readable name, e.g., 'GitHub OAuth & User Authentication'")
    summary: str = Field(..., description="Concise 1-2 sentence description of what this feature encompasses.")
    category: str = Field(default="General", description="Domain tag: Authentication, Database, Frontend UI, AI Pipeline, API, Infrastructure")
    commit_shas: List[str] = Field(default_factory=list, description="List of commit SHAs belonging to this feature")
    commit_count: int = Field(default=0, description="Total count of commits mapped to this feature")
    primary_files_hint: List[str] = Field(default_factory=list, description="Key files or directories inferred from commits")


class CategorizeFeaturesRequest(BaseModel):
    repo: str = Field(..., description="Full repository name: owner/repo")
    max_commits: Optional[int] = Field(default=50, description="Max commits to analyze in bulk")


class CategorizeFeaturesResponse(BaseModel):
    repo: str
    total_commits: int
    features: List[FeatureClusterItem]


class GenerateDocRequest(BaseModel):
    repo: str = Field(..., description="Full repository name: owner/repo")
    feature_id: str = Field(..., description="Unique feature identifier")
    feature_name: str = Field(..., description="Title of the feature")
    feature_summary: Optional[str] = Field(default="", description="Summary of the feature")
    commit_shas: List[str] = Field(..., description="List of commit SHAs included in this feature")


class GenerateDocResponse(BaseModel):
    repo: str
    feature_id: str
    feature_name: str
    filename: str  # e.g., "github-oauth-authentication.md"
    markdown_content: str
