from typing import Optional
from urllib.parse import urlencode

from fastapi import HTTPException, status
from fastapi.responses import JSONResponse, RedirectResponse
from sqlalchemy.orm import Session

from app.core.config import settings
from app.services.auth_service import authenticate_github_user


async def github_login():
    """Redirect user to GitHub OAuth authorize URL."""
    params = {
        "client_id": settings.github_client_id,
        "redirect_uri": settings.github_redirect_url,
        "scope": "read:user user:email",
        "allow_signup": "true",
    }
    github_url = f"https://github.com/login/oauth/authorize?{urlencode(params)}"
    return RedirectResponse(github_url)


async def github_callback(
    code: Optional[str],
    error: Optional[str],
    error_description: Optional[str],
    db: Session
):
    """Handle callback from GitHub OAuth and redirect to frontend homepage with JWT."""
    frontend_base = settings.frontend_url.rstrip("/")

    if error:
        error_msg = error_description or error
        params = urlencode({"error": error_msg})
        return RedirectResponse(
            url=f"{frontend_base}/?{params}",
            status_code=status.HTTP_302_FOUND
        )

    if not code:
        params = urlencode({"error": "Authorization code is missing"})
        return RedirectResponse(
            url=f"{frontend_base}/?{params}",
            status_code=status.HTTP_302_FOUND
        )

    try:
        token, user = await authenticate_github_user(code, db)
    except HTTPException as e:
        params = urlencode({"error": str(e.detail)})
        return RedirectResponse(
            url=f"{frontend_base}/?{params}",
            status_code=status.HTTP_302_FOUND
        )

    redirect_url = f"{frontend_base}/?token={token}"
    response = RedirectResponse(url=redirect_url, status_code=status.HTTP_302_FOUND)

    # Set cookie for convenience
    response.set_cookie(
        key="token",
        value=token,
        httponly=False,
        samesite="lax",
        max_age=7 * 24 * 3600
    )

    return response


async def logout_user(redirect: bool = False):
    """Log out user by clearing the token cookie, optionally redirecting to frontend homepage."""
    frontend_base = settings.frontend_url.rstrip("/")

    if redirect:
        response = RedirectResponse(
            url=f"{frontend_base}/",
            status_code=status.HTTP_302_FOUND
        )
    else:
        response = JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": "Logged out successfully"}
        )

    response.delete_cookie(
        key="token",
        path="/"
    )

    return response