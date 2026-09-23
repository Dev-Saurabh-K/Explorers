from typing import Tuple
from sqlalchemy.orm import Session

from app.services.github_service import (
    exchange_code_for_token,
    get_github_user,
    get_github_emails
)
from app.models.user import User
from app.core.security import create_access_token


async def authenticate_github_user(
    code: str,
    db: Session
) -> Tuple[str, User]:
    # 1. Exchange temporary code for GitHub access token
    github_token = await exchange_code_for_token(code)

    # 2. Get GitHub user profile
    github_user = await get_github_user(github_token)

    # 3. Get user emails
    emails = await get_github_emails(github_token)

    primary_email = None
    if emails:
        primary_email = next(
            (
                email.get("email")
                for email in emails
                if email.get("primary")
            ),
            None
        )
    if not primary_email:
        primary_email = github_user.get("email")

    github_id = str(github_user["id"])
    username = github_user.get("login") or f"user_{github_id}"
    name = github_user.get("name")
    avatar_url = github_user.get("avatar_url")

    # 4. Find or create user in database
    user = (
        db.query(User)
        .filter(User.github_id == github_id)
        .first()
    )

    if not user:
        user = User(
            github_id=github_id,
            username=username,
            name=name,
            email=primary_email,
            avatar_url=avatar_url,
            github_access_token=github_token
        )
        db.add(user)
    else:
        # Update user fields with latest GitHub data
        user.username = username
        user.github_access_token = github_token
        if name:
            user.name = name
        if primary_email:
            user.email = primary_email
        if avatar_url:
            user.avatar_url = avatar_url

    db.commit()
    db.refresh(user)

    # 5. Generate application JWT
    access_token = create_access_token(user.id)

    return access_token, user