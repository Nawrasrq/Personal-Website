"""Tests for controller layer (API endpoints)."""

import pytest


class TestHealthController:
    @pytest.mark.unit
    def test_health_check(self, client):
        response = client.get("/health")

        assert response.status_code == 200

        data = response.get_json()
        assert data["success"] is True
        assert data["data"]["status"] == "healthy"
        assert "timestamp" in data["data"]


class TestDocsController:
    @pytest.mark.unit
    def test_openapi_spec(self, client):
        response = client.get("/api/docs/openapi.json")

        assert response.status_code == 200

        data = response.get_json()
        assert "openapi" in data
        assert "info" in data
        assert "paths" in data

    @pytest.mark.unit
    def test_swagger_ui(self, client):
        response = client.get("/api/docs/swagger")

        assert response.status_code == 200
        assert b"swagger-ui" in response.data
