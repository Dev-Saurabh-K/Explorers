from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.controllers.auth_controller import (
    github_login,
    github_callback,
    logout_user
)
from app.core.security import get_current_user
from app.database.database import get_db
from app.models.user import User
from app.schemas.auth import TokenResponse, UserResponse

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.get("/github", summary="Redirect to GitHub OAuth login")
async def login_with_github():
    return await github_login()


@router.get(
    "/github/callback",
    summary="GitHub OAuth callback endpoint (redirects to frontend homepage)"
)
async def github_auth_callback(
    code: Optional[str] = Query(None, description="GitHub authorization code"),
    error: Optional[str] = Query(None, description="GitHub OAuth error code"),
    error_description: Optional[str] = Query(None, description="GitHub OAuth error description"),
    db: Session = Depends(get_db)
):
    return await github_callback(
        code=code,
        error=error,
        error_description=error_description,
        db=db
    )


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get authenticated user profile"
)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.post(
    "/logout",
    summary="Logout user and clear auth cookie"
)
@router.get(
    "/logout",
    summary="Logout user (supports optional browser redirect)"
)
async def logout(
    redirect: bool = Query(False, description="Whether to redirect to frontend homepage after logout")
):
    return await logout_user(redirect=redirect)