# Personal Website — Backend

Flask backend for my personal portfolio website. Provides API infrastructure and a foundation for future endpoints. Content (blog posts, about page) lives in the Next.js frontend as MDX files.

## Tech Stack

- **Flask 3.x** — web framework
- **SQLAlchemy 2.0** — ORM with type hints
- **Pydantic v2** — request/response validation
- **Flask-Migrate** — database migrations (Alembic)
- **SQLite** (dev) / **PostgreSQL** (production)

## Quick Start

1. **Activate the virtual environment**
   ```bash
   .venv\Scripts\activate     # Windows
   source .venv/bin/activate  # macOS/Linux
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

3. **Initialize database**
   ```bash
   flask db upgrade
   ```

4. **Run the dev server**
   ```bash
   python run.py
   ```

The API will be available at `http://localhost:5000`

## Project Structure

```
app/
├── __init__.py          # App factory
├── core/                # Config, exceptions, responses
├── controllers/         # Flask blueprints (API endpoints)
├── services/            # Business logic
├── repositories/        # Data access layer (BaseRepository)
├── models/              # SQLAlchemy models + mixins
├── schemas/             # Pydantic schemas
└── db/                  # Database session
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/docs/swagger` | Swagger UI |
| GET | `/api/docs/openapi.json` | OpenAPI spec |

## Architecture: MSCR Pattern

```
Controllers (HTTP) → Services (Business Logic) → Repositories (Data Access) → Models (ORM)
```

| Layer | Responsibility |
|-------|----------------|
| **Controllers** | HTTP handling, parse request, return response |
| **Services** | Business logic, own transaction boundaries (commit/rollback) |
| **Repositories** | CRUD operations, flush only (never commit) |
| **Models** | SQLAlchemy ORM, database schema |

### Model Mixins

| Mixin | Fields | Usage |
|-------|--------|-------|
| `PublicIdMixin` | `public_id` (UUID) | API-safe identifier, prevents enumeration |
| `TimestampMixin` | `created_at`, `updated_at` | Automatic timestamp tracking |
| `SoftDeleteMixin` | `is_deleted`, `deleted_at` | Soft delete instead of hard delete |

### Dual-ID Pattern

All models use integer PKs internally and UUIDs externally:

```python
# Internal (fast JOINs, never exposed)
id: Mapped[int] = mapped_column(primary_key=True)

# External (safe to expose in URLs and API responses)
public_id: Mapped[str] = mapped_column(String(36), unique=True, index=True)
```

| Aspect | Internal (Integer PK) | External (UUID) |
|--------|----------------------|-----------------|
| **Used for** | Foreign keys, JOINs | API endpoints, URLs |
| **Storage** | 4 bytes | 16 bytes |
| **Performance** | Faster (sequential, cache-friendly) | Indexed lookup ~1ms |
| **Security** | Never exposed externally | Safe to expose (no enumeration) |

### Soft Delete

Models with `SoftDeleteMixin` are never hard deleted — they are marked as deleted instead:

```python
item.soft_delete()   # sets is_deleted=True, deleted_at=now
item.restore()       # sets is_deleted=False, deleted_at=None
```

Queries should always filter out deleted records:

```python
stmt = select(Model).where(Model.is_deleted.is_(False))
```

### Enum Pattern

Use `str, PyEnum` for API-friendly enums:

```python
from enum import Enum as PyEnum

class MyStatus(str, PyEnum):
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"
```

Benefits: JSON serializable automatically, string comparisons work (`status == "draft"`), clean API responses.

### Race Condition Prevention

For unique constraints, use a check-then-catch pattern:

```python
def create_thing(self, name: str) -> Thing:
    try:
        # 1. Optimistic check (fast path, catches 99% of duplicates)
        if self.find_by_name(name):
            raise ConflictError("Already exists")

        # 2. Create with database constraint
        thing = Thing(name=name)
        self.session.add(thing)
        self.flush()
        return thing

    except IntegrityError:
        # 3. Safety net for race conditions
        self.rollback()
        raise ConflictError("Already exists")
```

### Transaction Control

```python
# Service controls the transaction boundary
def create_thing(self, data: ThingCreate) -> Thing:
    try:
        thing = self.repo.create(**data.model_dump())  # flush (gets ID)
        self.repo.commit()  # Service decides when to commit
        return thing
    except Exception:
        self.repo.rollback()
        raise
```

## SQLAlchemy Best Practices

### `default` vs `server_default`

Use both for production safety:

```python
is_published: Mapped[bool] = mapped_column(
    default=True,           # Python-level: used when ORM creates the object
    server_default="true",  # Database-level: used in raw SQL / migrations
)
```

### Boolean Comparisons

```python
# ❌ Avoid — triggers linter warnings
stmt = select(Item).where(Item.is_deleted == False)

# ✅ Use .is_(False) for False checks
stmt = select(Item).where(Item.is_deleted.is_(False))

# ✅ Direct reference for True checks
stmt = select(Item).where(Item.is_active)
```

### DateTime Best Practices

```python
from datetime import datetime, timezone

# ✅ Always use timezone.utc (Python 3.8+ compatible)
now = datetime.now(timezone.utc)
```

### Session Management

Flask-SQLAlchemy automatically manages sessions per request:
- Session created per HTTP request
- Automatic rollback on exceptions
- Session closed when request ends

Use `flush()` in repositories to stage changes and get IDs assigned. Use `commit()` in services to persist. Never call `commit()` in a repository.

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

# Relationship (one-to-many)
items: Mapped[list["Item"]] = relationship(back_populates="owner")

# Relationship (many-to-one)
owner: Mapped["User"] = relationship(back_populates="items")
```

### Bound TypeVars for Repositories

```python
from typing import TypeVar, Generic
from sqlalchemy.orm import DeclarativeBase

ModelType = TypeVar("ModelType", bound=DeclarativeBase)

class BaseRepository(Generic[ModelType]):
    def get_by_id(self, id: int) -> ModelType | None:
        ...
```

## Database

```bash
# Create a new migration after model changes
flask db migrate -m "Description"

# Apply migrations
flask db upgrade

# Rollback last migration
flask db downgrade
```

## Testing

```bash
python -m pytest
python -m pytest --cov=app --cov-report=html
python -m pytest -m unit
python -m pytest -m integration
```

## Configuration

All configuration via environment variables. See `.env.example` for all options.

| Variable | Description | Default |
|----------|-------------|---------|
| `SECRET_KEY` | Flask secret key | Required in production |
| `DATABASE_URL` | Database connection URL | `sqlite:///app.db` |
| `CORS_ORIGINS` | Allowed CORS origins | `*` |
| `DEBUG` | Debug mode | `True` |

## Adding New Features

### New Model

```python
# app/models/new_model.py
from app.db import db
from app.models.base import TimestampMixin, PublicIdMixin

class NewModel(db.Model, TimestampMixin, PublicIdMixin):
    __tablename__ = "new_models"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
```

Then export from `app/models/__init__.py` and run `flask db migrate`.

### New Repository

```python
from app.repositories.base import BaseRepository
from app.models.new_model import NewModel

class NewModelRepository(BaseRepository[NewModel]):
    def __init__(self):
        super().__init__(NewModel)

    # Add custom queries here
    def get_published(self) -> list[NewModel]:
        stmt = select(self.model).where(self.model.is_published.is_(True))
        return list(self.session.scalars(stmt))
```

### New Schemas

```python
from app.schemas.base import BaseSchema, BaseResponseSchema

class NewModelCreate(BaseSchema):
    name: str
    description: str | None = None

class NewModelUpdate(BaseSchema):
    name: str | None = None
    description: str | None = None

class NewModelResponse(BaseResponseSchema):
    name: str
    description: str | None
```

### New Service

```python
from app.repositories.new_model_repository import NewModelRepository
from app.schemas.new_model_schemas import NewModelCreate, NewModelUpdate
from app.core.exceptions import NotFoundError

class NewModelService:
    def __init__(self, repo: NewModelRepository | None = None):
        self.repo = repo or NewModelRepository()

    def get_by_public_id(self, public_id: str) -> NewModel:
        item = self.repo.get_by_public_id(public_id)
        if not item:
            raise NotFoundError("Not found")
        return item

    def create(self, data: NewModelCreate) -> NewModel:
        try:
            instance = self.repo.create(**data.model_dump())
            self.repo.commit()
            return instance
        except Exception:
            self.repo.rollback()
            raise

    def update(self, public_id: str, data: NewModelUpdate) -> NewModel:
        instance = self.get_by_public_id(public_id)
        try:
            updated = self.repo.update(instance.id, **data.model_dump(exclude_none=True))
            self.repo.commit()
            return updated
        except Exception:
            self.repo.rollback()
            raise
```

### New Controller

```python
from flask import Blueprint, request
from app.core.responses import success_response
from app.core.exceptions import NotFoundError
from app.services.new_model_service import NewModelService
from app.schemas.new_model_schemas import NewModelCreate, NewModelResponse

bp = Blueprint("new_models", __name__, url_prefix="/api/v1/new-models")
service = NewModelService()

@bp.route("", methods=["GET"])
def list_all():
    items = service.get_all()
    return success_response([NewModelResponse.model_validate(i).model_dump() for i in items])

@bp.route("/<public_id>", methods=["GET"])
def get_one(public_id: str):
    item = service.get_by_public_id(public_id)
    return success_response(NewModelResponse.model_validate(item).model_dump())

@bp.route("", methods=["POST"])
def create():
    data = NewModelCreate(**request.get_json())
    item = service.create(data)
    return success_response(NewModelResponse.model_validate(item).model_dump(), status=201)
```

Register in `app/__init__.py` → `register_blueprints()`.
Export from `app/controllers/__init__.py`.
