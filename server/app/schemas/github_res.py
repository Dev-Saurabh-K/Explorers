from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class CommitResponse(BaseModel):
    sha: str
    message: str
    author: str
    date: datetime

class ContributorsResponse(BaseModel):
    username: str
    avatar_url: Optional[str] = None

class CommitByContributorResponse(BaseModel):
    sha: str
    message: str
    date: datetime