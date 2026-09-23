from typing import Optional
from pydantic import BaseModel, ConfigDict


class UserResponse(BaseModel):
    id: int
    github_id: str
    username: str
    name: Optional[str] = None
    email: Optional[str] = None
    avatar_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Optional[UserResponse] = None
