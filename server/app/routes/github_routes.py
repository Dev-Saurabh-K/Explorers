from typing import List
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session

from app.models.user import User
from app.core.security import get_current_user
from app.database.database import get_db
from app.schemas.github_res import (
    CommitResponse,
    ContributorsResponse,
    CommitByContributorResponse
)
from app.services.github_functions import (
    get_latest_repos,
    get_repo_commits,
    get_commit_authors,
    get_commits_by_contributer
)
from app.services.cache_service import CacheService

router = APIRouter(
    prefix="/github",
    tags=["github"]
)


def ensure_token(user: User) -> str:
    token = user.github_access_token
    if not token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Authenticated user does not have a linked GitHub access token"
        )
    return token


@router.get(
    "/repos",
    response_model=List[str],
    summary="Get list of all repositories of user (cached)"
)
async def get_repo(
    refresh: bool = Query(False, description="Force refresh from GitHub API"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not refresh:
        cached = CacheService.get_repositories(db, current_user.id)
        if cached is not None:
            return cached

    token = ensure_token(current_user)
    repos_list = get_latest_repos(token=token)
    CacheService.set_repositories(db, current_user.id, repos_list)
    return repos_list


@router.get(
    "/repo/commits",
    response_model=List[CommitResponse],
    summary="Get list of commits for a specific repository (cached)"
)
async def get_commits_for_repo(
    repo: str = Query(..., description="Repository full name, e.g. 'owner/repo'"),
    refresh: bool = Query(False, description="Force refresh from GitHub API"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not refresh:
        cached = CacheService.get_commits(db, current_user.id, repo)
        if cached is not None:
            return cached

    token = ensure_token(current_user)
    commits = get_repo_commits(token, repo)
    CacheService.set_commits(db, current_user.id, repo, commits)
    return commits


@router.get(
    "/repo/contributors",
    response_model=List[ContributorsResponse],
    summary="Get all contributors for a repo (cached)"
)
async def get_repo_contributors(
    repo: str = Query(..., description="Repository full name, e.g. 'owner/repo'"),
    refresh: bool = Query(False, description="Force refresh from GitHub API"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not refresh:
        cached = CacheService.get_contributors(db, current_user.id, repo)
        if cached is not None:
            return cached

    token = ensure_token(current_user)
    contributors = get_commit_authors(token, repo)
    CacheService.set_contributors(db, current_user.id, repo, contributors)
    return contributors


@router.get(
    "/repo/contributor/commits",
    response_model=List[CommitByContributorResponse],
    summary="Get all commits done by a specific contributor on a repo (cached)"
)
async def get_commits_by_contributor(
    repo: str = Query(..., description="Repository full name, e.g. 'owner/repo'"),
    contributor: str = Query(..., description="GitHub username or Git author name"),
    refresh: bool = Query(False, description="Force refresh from GitHub API"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not refresh:
        cached = CacheService.get_contributor_commits(db, current_user.id, repo, contributor)
        if cached is not None:
            return cached

    token = ensure_token(current_user)
    commits = get_commits_by_contributer(token, repo, contributor)
    CacheService.set_contributor_commits(db, current_user.id, repo, contributor, commits)
    return commits
