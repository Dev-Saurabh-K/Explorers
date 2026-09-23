from typing import Any, Dict, List
import httpx
from fastapi import HTTPException, status

from app.core.config import settings

GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token"
GITHUB_USER_URL = "https://api.github.com/user"
GITHUB_EMAILS_URL = "https://api.github.com/user/emails"


async def exchange_code_for_token(code: str) -> str:
    """Exchange GitHub temporary code for access token."""
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                GITHUB_TOKEN_URL,
                data={
                    "client_id": settings.github_client_id,
                    "client_secret": settings.github_client_secret,
                    "code": code,
                    "redirect_uri": settings.github_redirect_url,
                },
                headers={
                    "Accept": "application/json"
                },
                timeout=15.0
            )
            response.raise_for_status()
        except httpx.HTTPError as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Failed to communicate with GitHub token service: {str(exc)}"
            )

        data = response.json()

        if "error" in data:
            error_desc = data.get("error_description", data.get("error"))
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"GitHub authentication error: {error_desc}"
            )

        access_token = data.get("access_token")
        if not access_token:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="GitHub did not return an access token"
            )

        return access_token


async def get_github_user(access_token: str) -> Dict[str, Any]:
    """Fetch GitHub user profile."""
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                GITHUB_USER_URL,
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "Accept": "application/vnd.github+json"
                },
                timeout=15.0
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Failed to fetch user profile from GitHub: {str(exc)}"
            )


async def get_github_emails(access_token: str) -> List[Dict[str, Any]]:
    """Fetch GitHub user emails. Returns empty list if unavailable."""
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                GITHUB_EMAILS_URL,
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "Accept": "application/vnd.github+json"
                },
                timeout=15.0
            )
            if response.status_code == 200:
                return response.json()
            return []
        except httpx.HTTPError:
            return []