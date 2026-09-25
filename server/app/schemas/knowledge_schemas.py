from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any


class DeveloperConcentration(BaseModel):
    developer: str = Field(..., description="Developer GitHub username or Git author name")
    avatar_url: Optional[str] = Field(default=None, description="GitHub avatar URL if available")
    commit_count: int = Field(default=0, description="Total commits authored by this developer")
    commit_percentage: float = Field(default=0.0, description="Percentage of total commits (0.0 to 100.0)")
    lines_added: int = Field(default=0, description="Lines of code added by this developer")
    lines_deleted: int = Field(default=0, description="Lines of code deleted by this developer")
    lines_changed: int = Field(default=0, description="Total code churn (additions + deletions)")
    lines_percentage: float = Field(default=0.0, description="Percentage of total code churn (0.0 to 100.0)")
    knowledge_percentage: float = Field(
        default=0.0,
        description="Composite knowledge concentration percentage (0.0 to 100.0) combining commits and churn"
    )
    risk_level: str = Field(
        default="LOW",
        description="Knowledge concentration risk: CRITICAL (>=80%), HIGH (>=60%), MEDIUM (40-60%), LOW (<40%)"
    )
    is_dominant: bool = Field(
        default=False,
        description="True if this developer is the primary knowledge owner / single point of failure"
    )
    color: str = Field(
        default="#00ff66",
        description="Assigned retro-palette hex color for UI chart rendering"
    )


class PieChartItem(BaseModel):
    label: str
    value: float = Field(..., description="Knowledge percentage (0.0 to 100.0)")
    count: int = Field(default=0, description="Commit count")
    color: str
    avatar_url: Optional[str] = None


class PieChartData(BaseModel):
    labels: List[str]
    datasets: List[Dict[str, Any]]
    items: List[PieChartItem] = Field(default_factory=list, description="Flat list of items for easy UI binding")


class BarChartData(BaseModel):
    labels: List[str]
    datasets: List[Dict[str, Any]]


class StackedBarDataset(BaseModel):
    label: str = Field(..., description="Developer name")
    data: List[float] = Field(..., description="Percentage of ownership per feature in corresponding order")
    backgroundColor: str = Field(..., description="Hex color for this developer's bar segments")


class StackedBarChartData(BaseModel):
    features: List[str] = Field(..., description="List of feature names along the X-axis")
    datasets: List[StackedBarDataset] = Field(..., description="Stacked developer series")


class RadarChartDataset(BaseModel):
    developer: str
    data: List[float] = Field(..., description="Knowledge percentage across category dimensions")
    borderColor: str
    backgroundColor: str


class RadarChartData(BaseModel):
    categories: List[str] = Field(..., description="Dimensions/domains (e.g. Auth, Database, UI, AI, DevOps)")
    datasets: List[RadarChartDataset]


class FeatureChartData(BaseModel):
    pie_chart: PieChartData
    bar_chart: BarChartData


class RepoChartData(BaseModel):
    overall_pie_chart: PieChartData
    features_stacked_bar: StackedBarChartData
    radar_chart: Optional[RadarChartData] = None


class FeatureKnowledgeGraph(BaseModel):
    feature_id: str
    feature_name: str
    total_commits: int
    total_lines_changed: int = 0
    bus_factor: int = Field(default=1, description="Minimum developers whose departure causes critical knowledge loss")
    risk_level: str = Field(default="LOW", description="CRITICAL, HIGH, MEDIUM, LOW")
    risk_summary: str = Field(..., description="Human-readable assessment of knowledge silo risk")
    dominant_developer: Optional[str] = Field(default=None, description="Username of highest contributor if >50%")
    developers: List[DeveloperConcentration] = Field(default_factory=list)
    chart_data: FeatureChartData


class RepositoryKnowledgeGraph(BaseModel):
    repository: str
    total_commits_analyzed: int
    total_contributors: int
    repo_bus_factor: int
    repo_risk_level: str
    repo_summary: str
    dominant_contributor: Optional[str] = None
    high_risk_features_count: int = 0
    overall_developers: List[DeveloperConcentration] = Field(default_factory=list)
    feature_breakdown: List[FeatureKnowledgeGraph] = Field(default_factory=list)
    chart_data: RepoChartData


class FeatureKnowledgeRequest(BaseModel):
    repo: str = Field(..., description="Full repository name: owner/repo")
    feature_id: str = Field(..., description="Unique feature slug")
    feature_name: str = Field(..., description="Human-readable feature name")
    commit_shas: List[str] = Field(..., description="List of commit SHAs belonging to this feature")
    include_diff_stats: Optional[bool] = Field(
        default=False,
        description="Whether to fetch full diff patches for detailed line counts (consumes more GitHub API quota)"
    )


class FeatureItemInput(BaseModel):
    feature_id: str
    feature_name: str
    category: Optional[str] = "General"
    commit_shas: List[str]


class BatchFeaturesKnowledgeRequest(BaseModel):
    repo: str = Field(..., description="Full repository name: owner/repo")
    features: List[FeatureItemInput]
    include_diff_stats: Optional[bool] = Field(default=False)
