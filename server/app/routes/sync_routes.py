from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from app.database.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.sync_schemas import (
    SyncRequest,
    SyncResponse,
    SyncStatusResponse,
    TableSyncInfo
)
from app.services.cache_service import CacheService
from app.services.sync_service import SyncService

router = APIRouter(prefix="/sync", tags=["Data Synchronization & Cache"])
sync_service = SyncService()


@router.post(
    "",
    response_model=SyncResponse,
    summary="Unified sync endpoint to trigger data synchronization on user action"
)
async def trigger_sync(
    req: SyncRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    now = datetime.now(timezone.utc)
    action = req.action.lower().strip()

    if action == "repos":
        repos = sync_service.sync_repositories(db, current_user)
        return SyncResponse(
            success=True,
            action="repos",
            repo=None,
            synced_at=now,
            message=f"Successfully synced {len(repos)} repositories",
            details={"repositories_count": len(repos), "repositories": repos}
        )

    if not req.repo:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Field 'repo' (e.g. 'owner/repo') is required for this sync action"
        )

    if action == "repo":
        details = sync_service.sync_repository_full(
            db=db,
            user=current_user,
            repo=req.repo,
            max_commits=req.max_commits or 100,
            include_ai=req.include_ai or False
        )
        return SyncResponse(
            success=True,
            action="repo",
            repo=req.repo,
            synced_at=now,
            message=f"Successfully synced repository data for '{req.repo}'",
            details=details
        )

    if action == "ai":
        details = sync_service.sync_ai_features(
            db=db,
            user=current_user,
            repo=req.repo,
            max_commits=req.max_commits or 50
        )
        return SyncResponse(
            success=True,
            action="ai",
            repo=req.repo,
            synced_at=now,
            message=f"Successfully synthesized AI features for '{req.repo}'",
            details=details
        )

    if action == "all":
        repos = sync_service.sync_repositories(db, current_user)
        repo_details = {}
        if req.repo:
            repo_details = sync_service.sync_repository_full(
                db=db,
                user=current_user,
                repo=req.repo,
                max_commits=req.max_commits or 100,
                include_ai=req.include_ai or False
            )
        return SyncResponse(
            success=True,
            action="all",
            repo=req.repo,
            synced_at=now,
            message="Full sync completed successfully",
            details={"repositories_count": len(repos), "repo_details": repo_details}
        )

    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=f"Unknown sync action '{action}'. Valid actions are: 'repos', 'repo', 'ai', 'all'"
    )


@router.post(
    "/repos",
    response_model=SyncResponse,
    summary="Sync user repository list from GitHub into database cache"
)
async def sync_repos(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    now = datetime.now(timezone.utc)
    repos = sync_service.sync_repositories(db, current_user)
    return SyncResponse(
        success=True,
        action="repos",
        synced_at=now,
        message=f"Successfully synced {len(repos)} repositories",
        details={"count": len(repos), "repositories": repos}
    )


@router.post(
    "/repo",
    response_model=SyncResponse,
    summary="Sync repository commits, contributors, and knowledge graph into database cache"
)
async def sync_repo_endpoint(
    repo: str = Query(..., description="Repository full name, e.g. 'owner/repo'"),
    max_commits: int = Query(default=100, ge=5, le=500),
    include_ai: bool = Query(default=False, description="Whether to also trigger AI feature clustering"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    now = datetime.now(timezone.utc)
    details = sync_service.sync_repository_full(
        db=db,
        user=current_user,
        repo=repo,
        max_commits=max_commits,
        include_ai=include_ai
    )
    return SyncResponse(
        success=True,
        action="repo",
        repo=repo,
        synced_at=now,
        message=f"Successfully synced repository data for '{repo}'",
        details=details
    )


@router.post(
    "/ai",
    response_model=SyncResponse,
    summary="Trigger AI clustering for a repository and cache in database"
)
async def sync_ai_features_endpoint(
    repo: str = Query(..., description="Repository full name, e.g. 'owner/repo'"),
    max_commits: int = Query(default=50, ge=5, le=200),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    now = datetime.now(timezone.utc)
    details = sync_service.sync_ai_features(
        db=db,
        user=current_user,
        repo=repo,
        max_commits=max_commits
    )
    return SyncResponse(
        success=True,
        action="ai",
        repo=repo,
        synced_at=now,
        message=f"Successfully synced AI features for '{repo}'",
        details=details
    )


@router.get(
    "/status",
    response_model=SyncStatusResponse,
    summary="Get sync status, cached record counts, and last synced timestamps"
)
async def get_sync_status(
    repo: str = Query(None, description="Optional repository full name to check repo-specific tables"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    raw_status = CacheService.get_sync_status(db, current_user.id, repo_name=repo)
    parsed_status = {
        tbl: TableSyncInfo(count=v["count"], last_synced=v["last_synced"])
        for tbl, v in raw_status.items()
    }
    return SyncStatusResponse(
        user_id=current_user.id,
        repo=repo,
        status=parsed_status
    )
