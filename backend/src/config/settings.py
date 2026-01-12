from pydantic_settings import BaseSettings
import os


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    """

    # Basic Settings
    app_name: str = "Task Management API"
    api_version: str = "v1"
    debug: bool = False

    # Database settings
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./test.db")

    # JWT settings
    secret_key: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    algorithm: str = os.getenv("ALGORITHM", "HS256")
    access_token_expire_minutes: int = int(
        os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "10080")  # 7 days (7 * 24 * 60 minutes)
    )

    # CORS settings
    allowed_origins: str = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")

    # Better Auth settings
    better_auth_url: str = os.getenv("BETTER_AUTH_URL", "http://localhost:8000")
    better_auth_secret: str = os.getenv("BETTER_AUTH_SECRET", "")

    # Server settings
    port: int = int(os.getenv("PORT", "8000"))

    class Config:
        env_file = ".env"


# Create a single instance of settings
settings = Settings()
