# CLAUDE.md - AI Context for Personal Website Backend

This file provides context for AI assistants when working with this Flask backend.

## Project Overview

This is the backend for a personal portfolio website. It serves as an API layer and infrastructure foundation. Content (blog posts, about page) is handled entirely by the Next.js frontend using MDX files — the backend has no domain models yet.

### Tech Stack

- **Framework:** Flask 3.x with Flask-SQLAlchemy 3.x
- **ORM:** SQLAlchemy 2.0 with type hints (`Mapped[]`, `mapped_column()`)
- **Validation:** Pydantic v2 for request/response schemas
- **Database:** SQLite for development, PostgreSQL for production
- **Testing:** pytest

## Architecture: MSCR Pattern

```
Controllers (HTTP) → Services (Business Logic) → Repositories (Data Access) → Models (ORM)
     ↑                      ↑                           ↑                         ↑
  Schemas              Schemas                    db.session                  Database
```

### Layer Responsibilities

| Layer | Location | Responsibility |
|-------|----------|----------------|
| **Models** | `app/models/` | SQLAlchemy ORM models, database schema |
| **Schemas** | `app/schemas/` | Pydantic models for validation |
| **Controllers** | `app/controllers/` | Flask blueprints, HTTP handling |
| **Repositories** | `app/repositories/` | Database CRUD operations |
| **Services** | `app/services/` | Business logic, transaction control |

### Transaction Control Pattern

**Critical:** Services control transaction boundaries, repositories handle database operations.

```python
# Repository: flush() only (tactical)
def create(self, **kwargs) -> ModelType:
    instance = self.model(**kwargs)
    self.session.add(instance)
    self.flush()  # Stage changes, get ID
    return instance

# Service: commit() after business logic (strategic)
def create_thing(self, data: ThingCreate) -> Thing:
    try:
        thing = self.repo.create(**data.model_dump())
        self.repo.commit()  # Service decides when to commit
        return thing
    except Exception:
        self.repo.rollback()
        raise
```

## File Structure

```
app/
├── __init__.py              # App factory (create_app)
├── core/
│   ├── config.py            # Pydantic Settings (env vars)
│   ├── exceptions.py        # Custom API exceptions
│   └── responses.py         # Response helpers (success_response, error_response)
├── controllers/
│   ├── health_controller.py # GET /health
│   └── docs_controller.py   # GET /api/docs/swagger, /api/docs/openapi.json
├── services/                # Business logic (empty — add new services here)
├── repositories/
│   └── base.py              # Generic BaseRepository[T]
├── models/
│   └── base.py              # Mixins: TimestampMixin, SoftDeleteMixin, PublicIdMixin
├── schemas/
│   ├── base.py              # BaseSchema, BaseResponseSchema
│   └── common_schemas.py    # PaginationParams, PaginatedResponse, ErrorResponse
└── db/
    └── session.py           # SQLAlchemy db instance
```

## Key Patterns & Conventions

### 1. Dual-ID Architecture

All models use integer primary keys internally + UUID for external API exposure:

```python
# Internal: Integer PK (fast JOINs)
id: Mapped[int] = mapped_column(primary_key=True)

# External: UUID (prevents enumeration attacks)
public_id: Mapped[str] = mapped_column(String(36), unique=True, index=True)
```

**API Pattern:**
- External endpoints use `public_id` (UUID)
- Internal operations use `id` (integer)
- Never expose integer IDs in API responses

### 2. Model Mixins (`app/models/base.py`)

| Mixin | Fields | Usage |
|-------|--------|-------|
| `PublicIdMixin` | `public_id` (UUID) | Add to models exposed via API |
| `TimestampMixin` | `created_at`, `updated_at` | Add to all models |
| `SoftDeleteMixin` | `is_deleted`, `deleted_at` | Add to models needing soft delete |

```python
class MyModel(db.Model, TimestampMixin, PublicIdMixin):
    __tablename__ = "my_models"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
```

### 3. Custom Declarative Base

Flask-SQLAlchemy is initialized with a custom base class:

```python
# app/models/base.py
class Base(DeclarativeBase, SoftDeleteMixin):
    __abstract__ = True
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

# app/db/session.py
db = SQLAlchemy(model_class=Base)
```

### 4. Enum Pattern

Use `str, PyEnum` for API-friendly enums:

```python
from enum import Enum as PyEnum

class MyStatus(str, PyEnum):
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"
```

Benefits: JSON serializable, string comparisons work, clean API responses.

### 5. Boolean Queries

```python
# ❌ Avoid
query.where(Model.is_deleted == False)

# ✅ Use
query.where(Model.is_deleted.is_(False))  # For False
query.where(Model.is_active)              # For True
```

### 6. Race Condition Prevention

For unique constraints, use check-then-catch pattern:

```python
def create_thing(self, name: str) -> Thing:
    try:
        if self.find_by_name(name):
            raise ConflictError("Already exists")

        thing = Thing(name=name)
        self.session.add(thing)
        self.flush()
        return thing

    except IntegrityError:
        self.rollback()
        raise ConflictError("Already exists")
```

### 7. Response Helpers (`app/core/responses.py`)

```python
# Success: { success: true, data: {...}, timestamp }
return success_response(data_dict, status=200)

# Error: { success: false, message: "...", timestamp }
return error_response("Not found", status=404)
```

### 8. Custom Exceptions (`app/core/exceptions.py`)

```python
from app.core.exceptions import NotFoundError, ConflictError, ValidationError

raise NotFoundError("Post not found")   # → 404
raise ConflictError("Already exists")   # → 409
raise ValidationError("Invalid input")  # → 400
```

### 9. `default` vs `server_default`

Use both for production safety:

```python
is_published: Mapped[bool] = mapped_column(
    default=True,           # Python-level (ORM creates)
    server_default="true",  # Database-level (SQL, migrations)
)
```

### 10. DateTime Best Practices

```python
from datetime import datetime, timezone

# ✅ Always use timezone.utc
now = datetime.now(timezone.utc)
```

## Adding New Features

### Adding a New Model

1. Create `app/models/new_model.py`:
```python
from app.db import db
from app.models.base import TimestampMixin, PublicIdMixin
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String

class NewModel(db.Model, TimestampMixin, PublicIdMixin):
    __tablename__ = "new_models"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
```

2. Export in `app/models/__init__.py`
3. Create migration: `flask db migrate -m "Add new_model table"`
4. Apply migration: `flask db upgrade`

### Adding a New Repository

```python
from app.repositories.base import BaseRepository
from app.models.new_model import NewModel

class NewModelRepository(BaseRepository[NewModel]):
    def __init__(self):
        super().__init__(NewModel)

    # Add custom queries here
```

### Adding a New Service

```python
from app.repositories.new_model_repository import NewModelRepository
from app.schemas.new_model_schemas import NewModelCreate

class NewModelService:
    def __init__(self, repo: NewModelRepository | None = None):
        self.repo = repo or NewModelRepository()

    def create(self, data: NewModelCreate) -> NewModel:
        instance = self.repo.create(**data.model_dump())
        self.repo.commit()
        return instance
```

### Adding a New Controller

```python
from flask import Blueprint, request
from app.core.responses import success_response
from app.services.new_model_service import NewModelService
from app.schemas.new_model_schemas import NewModelCreate, NewModelResponse

new_model_bp = Blueprint("new_models", __name__, url_prefix="/api/v1/new-models")
service = NewModelService()

@new_model_bp.route("", methods=["GET"])
def list_all():
    items = service.get_all()
    return success_response([NewModelResponse.model_validate(i).model_dump() for i in items])
```

Register in `app/__init__.py` → `register_blueprints()`.

## Running the App

```bash
# Activate venv
.venv\Scripts\activate       # Windows
source .venv/bin/activate    # macOS/Linux

# Run dev server
python run.py

# Run migrations
flask db upgrade

# Run tests
python -m pytest
python -m pytest --cov=app
```

## Environment Variables

See `.env.example` for all options. Key variables:

```bash
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///app.db   # or postgresql://...
CORS_ORIGINS=http://localhost:3000
```

## Current API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/docs/swagger` | Swagger UI |
| GET | `/api/docs/openapi.json` | OpenAPI spec |

## SQLAlchemy Best Practices

### Type Hints Reference

```python
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Text, Boolean, DateTime, ForeignKey

# Required column
name: Mapped[str] = mapped_column(String(100))

# Optional column
description: Mapped[str | None] = mapped_column(Text, nullable=True)

# Foreign key
user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

# Relationship
items: Mapped[list["Item"]] = relationship(back_populates="user")
```

### Session Management

Flask-SQLAlchemy automatically manages sessions per request:
- Session created per HTTP request
- Automatic rollback on exceptions
- Session closed when request ends

Use `flush()` in repositories to stage changes (gets the ID assigned), `commit()` in services to persist.

## Troubleshooting

1. **Import errors with `db.Model`**: Ensure models import `db` from `app.db`, not `app`
2. **Type checker errors on `model.id`**: The custom `Base` class defines `id` — ensure models inherit from `db.Model`
3. **Migration conflicts**: Delete migration files and recreate if schema significantly changed during development
4. **`.mypy_cache` appearing at project root**: mypy is being run from the root instead of `backend/` — always run tools from inside the `backend/` directory
