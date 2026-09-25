from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field


class SyncRequest(BaseModel):
    action: str = Field(
        default="repo",
        description="Action to execute: 'repos' (sync user repo list), 'repo' (sync commits, contributors & knowledge graph for a repo), 'ai' (sync AI features & docs for a repo), or 'all'"
    )
    repo: Optional[str] = Field(
        default=None,
        description="Repository full name (e.g. 'owner/repo'). Required if action is 'repo', 'ai', or 'all'"
    )
    max_commits: Optional[int] = Field(
        default=100,
        ge=5,
        le=500,
        description="Max commits to fetch and analyze during sync"
    )
    include_ai: Optional[bool] = Field(
        default=False,
        description="Whether to also trigger AI feature categorization and docs during 'repo' sync"
    )


class SyncResponse(BaseModel):
    success: bool = True
    action: str
    repo: Optional[str] = None
    synced_at: datetime
    message: str
    details: Dict[str, Any] = Field(default_factory=dict)


class TableSyncInfo(BaseModel):
    count: int
    last_synced: Optional[datetime] = None


class SyncStatusResponse(BaseModel):
    user_id: int
    repo: Optional[str] = None
    status: Dict[str, TableSyncInfo]
