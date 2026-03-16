"""
Pytest configuration and fixtures.
"""

import os

os.environ["TESTING"] = "true"
os.environ["DATABASE_URL"] = "sqlite:///:memory:"
os.environ["FLASK_ENV"] = "testing"

import pytest
from flask import Flask
from flask.testing import FlaskClient

from app import create_app, db


@pytest.fixture(scope="session")
def app() -> Flask:
    app = create_app()
    app.config["TESTING"] = True

    with app.app_context():
        db.create_all()

    yield app

    with app.app_context():
        db.drop_all()


@pytest.fixture(scope="function")
def client(app: Flask) -> FlaskClient:
    return app.test_client()
