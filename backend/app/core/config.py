"""
Application configuration using Pydantic Settings.

This module defines the Settings class which loads configuration from
environment variables and provides type-safe access to application settings.
"""

from typing import List

from pydantic import Field, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.

    All settings are type-checked and validated using Pydantic.
    Sensitive values use SecretStr to prevent accidental logging.
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Flask Settings
    APP_NAME: str = Field(default="Personal Website API")
    FLASK_ENV: str = Field(default="development")
    DEBUG: bool = Field(default=True)
    SECRET_KEY: SecretStr = Field(
        default=SecretStr("dev-secret-key-change-in-production")
    )

    # Database Settings
    DATABASE_URL: str = Field(default="sqlite:///app.db")

    # CORS Settings
    CORS_ORIGINS: str = Field(default="*")

    def get_cors_origins(self) -> List[str]:
        """
        Parse CORS origins from comma-separated string to list.

        Returns
        -------
        List[str]
            List of CORS origins
        """
        if self.CORS_ORIGINS == "*":
            return ["*"]
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

    # Caching Settings
    CACHE_TYPE: str = Field(default="simple")
    CACHE_DEFAULT_TIMEOUT: int = Field(default=300, ge=0)

    # Testing Settings
    TESTING: bool = Field(default=False)

    # API Documentation Settings
    API_TITLE: str = Field(default="Personal Website API")
    API_VERSION: str = Field(default="1.0.0")
    OPENAPI_VERSION: str = Field(default="3.0.3")
    OPENAPI_URL_PREFIX: str = Field(default="/api/docs")
    OPENAPI_SWAGGER_UI_PATH: str = Field(default="/swagger")
    OPENAPI_SWAGGER_UI_URL: str = Field(
        default="https://cdn.jsdelivr.net/npm/swagger-ui-dist/"
    )


# Singleton settings instance
settings = Settings()
