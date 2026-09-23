from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    github_client_id: str = ""
    github_client_secret: str = ""
    github_redirect_url: str = ""

    jwt_secret: str = ""
    jwt_algorithm: str = "HS256"

    database_url: str = "sqlite:///./app.db"
    frontend_url: str = "http://localhost:5173"

    @property
    def github_redirect_uri(self) -> str:
        return self.github_redirect_url

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()