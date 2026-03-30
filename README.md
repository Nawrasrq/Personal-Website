# Personal Website

My personal portfolio website — built with a Next.js frontend and a Flask backend.

Live at: https://personal-website-hazel-nine-39.vercel.app/

---

## Overview

| Layer    | Stack                                      |
|----------|--------------------------------------------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, shadcn/ui |
| Backend  | Flask, SQLAlchemy 2.0, Pydantic v2, Flask-Migrate |
| Database | PostgreSQL                                  |

---

## Directory Structure

```
.
├── frontend/           # Next.js app (pages, components, content)
│   ├── app/            # App Router pages
│   ├── components/     # UI and layout components
│   ├── content/        # MDX files (blog posts, about page)
│   ├── lib/            # Utilities (GitHub API, MDX helpers, types)
│   └── public/         # Static assets (resume PDF)
│
└── backend/            # Flask API
    ├── app/
    │   ├── controllers/ # Route handlers
    │   ├── services/    # Business logic
    │   ├── repositories/# Database access
    │   ├── models/      # SQLAlchemy models
    │   ├── schemas/     # Pydantic schemas
    │   └── core/        # Config, extensions, error handling
    ├── migrations/      # Alembic migrations
    └── tests/           # Pytest test suite
```

---

## Frontend

### Features
- **Home** — hero section with links to projects and blog
- **About** — bio (MDX), skills grouped by category, work/education timeline, resume download
- **Blog** — MDX posts with syntax highlighting, tag filter pills, responsive 3-column grid, and read time estimates
- **Projects** — GitHub repos tagged with the `portfolio` topic, fetched live via GitHub API (ISR, revalidates hourly)
- Dark/light theme toggle, defaulting to dark

### Requirements
- Node.js 18+
- A GitHub personal access token (for the Projects page)

### Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local   # then fill in your GitHub token
npm run dev
```

### Environment Variables

| Variable          | Description                        |
|-------------------|------------------------------------|
| `GITHUB_TOKEN`    | GitHub personal access token       |
| `GITHUB_USERNAME` | Your GitHub username (`nawrasrq`)  |

### Adding a Blog Post

Create a `.mdx` file in `frontend/content/posts/`:

```md
---
title: "Post Title"
date: "2026-01-01"
description: "Short summary."
tags: ["tag1", "tag2"]
published: true
---

Post content here.
```

---

## Backend

### Features
- Health check endpoint (`/health`)
- OpenAPI/Swagger docs (`/docs`)
- MSCR architecture (Model → Service → Controller → Repository)
- Flask-Migrate for database migrations

### Requirements
- Python 3.11+
- PostgreSQL

### Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env      # then fill in your database URL
flask db upgrade
flask run
```

### Environment Variables

| Variable        | Description                              |
|-----------------|------------------------------------------|
| `DATABASE_URL`  | PostgreSQL connection string             |
| `SECRET_KEY`    | Flask secret key                         |
| `FLASK_ENV`     | `development` or `production`            |

---

## License

MIT
