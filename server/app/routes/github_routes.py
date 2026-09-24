from fastapi import APIRouter, Depends
from app.models.user import User
from app.core.security import get_current_user
from app.schemas.github_res import CommitResponse, ContributorsResponse, CommitByContributorResponse

from sqlalchemy.orm import Session
from app.database.database import get_db

from app.services.github_functions import get_latest_repos, get_repo_commits, get_commit_authors, get_commits_by_contributer

from typing import List

router = APIRouter(
    prefix="/github",
    tags=["github"]
)


@router.get(
    "/repos",
    response_model=list[str],
    summary="Get list of all repositories of user"
)
async def get_repo(current_user: User = Depends(get_current_user)):
    token = current_user.github_access_token
    repos_list = get_latest_repos(token=token)
    return repos_list

# GET /api/github/repos/:owner/:repo/commits
# two route one is owner and repo specific and another is repo specific
@router.get("/repo/commits", summary="Get list of commits for a specific repository", response_model=list[CommitResponse])
async def get_commits_for_repo(repo: str, current_user: User = Depends(get_current_user)):
    token = current_user.github_access_token
    return get_repo_commits(token, repo)

# get all users specific to a repo
@router.get("/repo/contributors", summary="get all contributors for a repo", response_model=list[ContributorsResponse])
async def get_repo_contributors(repo: str, current_user: User = Depends(get_current_user)):
    token = current_user.github_access_token
    return (get_commit_authors(token, repo))


# get all commits done by a specific user on a specific repo
@router.get("/repo/contributor/commits", response_model=List[CommitByContributorResponse])
async def get_commits_by_contributor(repo: str, contributor: str, current_user: User = Depends(get_current_user)):
    token = current_user.github_access_token
    return (get_commits_by_contributer(token, repo, contributor))

