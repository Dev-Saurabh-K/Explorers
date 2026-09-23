from sqlalchemy import Column, Integer, String

from app.database.database import Base


class User(Base):

    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    github_id = Column(
        String,
        unique=True,
        nullable=False
    )

    username = Column(
        String,
        nullable=False
    )

    name = Column(
        String,
        nullable=True
    )

    email = Column(
        String,
        nullable=True
    )

    avatar_url = Column(
        String,
        nullable=True
    )

    github_access_token = Column(
        String,
        nullable=True
    )