"""
API documentation controller serving OpenAPI spec and Swagger UI.

This module provides endpoints for API documentation including:
- OpenAPI 3.0 JSON specification
- Swagger UI for interactive API exploration
"""

import logging

from flask import Blueprint, jsonify, render_template_string

from app.core.config import settings

logger = logging.getLogger(__name__)

# Create docs blueprint
docs_bp = Blueprint("docs", __name__, url_prefix="/api/docs")


# MARK: OpenAPI Specification
def get_openapi_spec() -> dict:
    """
    Generate OpenAPI 3.0 specification for the API.

    Returns
    -------
    dict
        OpenAPI specification dictionary
    """
    return {
        "openapi": settings.OPENAPI_VERSION,
        "info": {
            "title": settings.API_TITLE,
            "version": settings.API_VERSION,
            "description": "A production-ready Flask backend template with MSCR architecture.",
            "contact": {"name": "API Support"},
        },
        "servers": [
            {"url": "/", "description": "Current server"},
        ],
        "tags": [
            {"name": "Health", "description": "Health check endpoints"},
        ],
        "paths": {
            "/health": {
                "get": {
                    "tags": ["Health"],
                    "summary": "Health check",
                    "description": "Returns application health status",
                    "responses": {
                        "200": {
                            "description": "Application is healthy",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "$ref": "#/components/schemas/HealthResponse"
                                    }
                                }
                            },
                        }
                    },
                }
            },
        },
    }


@docs_bp.route("/openapi.json")
def openapi_spec():
    """
    Serve OpenAPI specification as JSON.

    Returns
    -------
    Response
        JSON response with OpenAPI specification
    """
    return jsonify(get_openapi_spec())


# Swagger UI HTML template
SWAGGER_UI_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ title }} - API Documentation</title>
    <link rel="stylesheet" type="text/css" href="{{ swagger_ui_url }}swagger-ui.css">
    <style>
        html { box-sizing: border-box; overflow-y: scroll; }
        *, *:before, *:after { box-sizing: inherit; }
        body { margin: 0; background: #fafafa; }
    </style>
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="{{ swagger_ui_url }}swagger-ui-bundle.js"></script>
    <script src="{{ swagger_ui_url }}swagger-ui-standalone-preset.js"></script>
    <script>
        window.onload = function() {
            const ui = SwaggerUIBundle({
                url: "{{ spec_url }}",
                dom_id: '#swagger-ui',
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIStandalonePreset
                ],
                layout: "StandaloneLayout",
                deepLinking: true,
                showExtensions: true,
                showCommonExtensions: true
            });
            window.ui = ui;
        };
    </script>
</body>
</html>
"""


@docs_bp.route("/swagger")
def swagger_ui():
    """
    Serve Swagger UI for interactive API documentation.

    Returns
    -------
    str
        Rendered Swagger UI HTML page
    """
    return render_template_string(
        SWAGGER_UI_TEMPLATE,
        title=settings.API_TITLE,
        swagger_ui_url=settings.OPENAPI_SWAGGER_UI_URL,
        spec_url="/api/docs/openapi.json",
    )


@docs_bp.route("")
def docs_index():
    """
    Redirect to Swagger UI.

    Returns
    -------
    str
        Redirect response to Swagger UI
    """
    return swagger_ui()
