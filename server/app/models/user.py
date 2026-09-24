from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer
from app.database.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    github_id: Mapped[str] = mapped_column(
        String,
        unique=True,
        nullable=False
    )

    username: Mapped[str] = mapped_column(
        String,
        nullable=False
    )

    name: Mapped[str | None] = mapped_column(
        String,
        nullable=True
    )

    email: Mapped[str | None] = mapped_column(
        String,
        nullable=True
    )

    avatar_url: Mapped[str | None] = mapped_column(
        String,
        nullable=True
    )

    github_access_token: Mapped[str | None] = mapped_column(
        String,
        nullable=True
    )
