# CLAUDE.md - AI Context for Personal Website Frontend

This file provides context for AI assistants working on this Next.js frontend.

## Project Overview

Personal portfolio website for Nawras Rawas Qalaji. Pages: Home, About, Blog, Projects.

### Tech Stack

- **Framework:** Next.js 14 (App Router), TypeScript
- **Styling:** Tailwind CSS v3 with CSS custom properties (HSL variables)
- **Components:** shadcn/ui v4 (installed via `shadcn` CLI)
- **Theme:** `next-themes` — dark/light toggle, defaults to dark
- **Blog:** MDX via `next-mdx-remote/rsc`, syntax highlighting via `rehype-pretty-code` + `shiki`
- **Projects:** GitHub REST API, filtered by `portfolio` topic, ISR revalidation (1 hour)

---

## Critical: shadcn v4 + Tailwind v3 Incompatibility

shadcn v4 uses `@base-ui/react` instead of Radix UI. This causes two recurring issues:

### 1. CSS: shadcn v4 outputs oklch colors and `@import` directives incompatible with Tailwind v3

`globals.css` uses standard Tailwind v3 directives — do NOT reintroduce shadcn v4's generated CSS:

```css
/* ✅ Correct — Tailwind v3 */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ❌ Never add these back */
@import "shadcn/tailwind.css";
@import "tw-animate-css";
```

All theme colors are defined as HSL CSS variables in `globals.css` and extended in `tailwind.config.ts`.

### 2. No `asChild` prop — use `buttonVariants` with `<Link>` or `<a>` instead

shadcn v4 components do not support the Radix `asChild` pattern.

```tsx
// ❌ Does not work in shadcn v4
<Button asChild><Link href="/foo">Click</Link></Button>

// ✅ Correct pattern
import { buttonVariants } from '@/components/ui/button-variants'
import { cn } from '@/lib/utils'

<Link href="/foo" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
  Click
</Link>
```

### 3. `@base-ui/react` breaks SSR/prerendering

Components that import from `@base-ui/react` cannot be used in server components — they cause `TypeError: (0 , n.d) is not a function` during static generation.

**Pattern:** Any shadcn component that uses `@base-ui/react` must either:
- Be replaced with a plain HTML equivalent (e.g. `<hr>` instead of `<Separator>`)
- Have its `@base-ui/react` dependency removed and replaced with native HTML elements

**Already fixed:**
- `components/ui/button.tsx` — replaced `ButtonPrimitive` with `<button>`
- `components/ui/badge.tsx` — replaced `useRender`/`mergeProps` with `<span>`
- `components/ui/button-variants.ts` — CVA logic extracted here so server components can import it without pulling in `@base-ui/react`
- `components/ui/tooltip.tsx` — `TooltipProvider` removed from layout entirely (unused)
- `app/about/page.tsx` — `<Separator>` replaced with `<hr className="border-border">`

**Rule:** When adding any new shadcn component, check if it imports from `@base-ui/react`. If it does and it's used in a server component, replace the primitive with a native HTML element.

---

## File Structure

```
app/
├── layout.tsx              # Root layout: ThemeProvider, NavBar, Footer
├── globals.css             # Tailwind directives + HSL CSS variables
├── page.tsx                # Home — renders HeroSection
├── about/page.tsx          # About — MDX body, SkillBadges, Timeline, resume download
├── blog/
│   ├── page.tsx            # Blog index — getAllPosts() + PostCard grid
│   └── [slug]/page.tsx     # Blog post — generateStaticParams + MDX render
└── projects/page.tsx       # Projects — getPortfolioRepos() + ProjectCard grid

components/
├── layout/
│   ├── NavBar.tsx          # Sticky nav with links + ThemeToggle
│   ├── Footer.tsx          # GitHub + LinkedIn icon links
│   └── ThemeToggle.tsx     # 'use client' — useTheme() with mounted guard
├── home/
│   └── HeroSection.tsx     # Hero with CTA buttons and social links
├── about/
│   ├── SkillBadges.tsx     # Skill badges grouped by category
│   └── Timeline.tsx        # Work/education timeline with bullet points
├── blog/
│   ├── PostCard.tsx        # Blog post card (title, date, description, tags)
│   └── PostHeader.tsx      # Blog post header
├── projects/
│   └── ProjectCard.tsx     # GitHub repo card (language, stars, links)
└── ui/
    ├── button.tsx          # Button component (native <button>, no @base-ui)
    ├── button-variants.ts  # CVA buttonVariants — import this in server components
    ├── badge.tsx           # Badge component (native <span>, no @base-ui)
    └── card.tsx            # Card components (native divs, safe for server use)

lib/
├── mdx.ts                  # getAllPosts(), getPostBySlug(), getAboutContent()
├── github.ts               # getPortfolioRepos() — GitHub API with ISR
├── types.ts                # GitHubRepo, PostFrontmatter, Post interfaces
└── utils.ts                # cn() helper (clsx + tailwind-merge)

content/
├── about.mdx               # About page bio content
└── posts/                  # Blog post MDX files
```

---

## Theming

Colors are defined as HSL CSS variables in `globals.css`:

```css
:root {
  --background: 0 0% 98%;
  --primary: 263 70% 50%;   /* violet-600 */
  /* ... */
}
.dark {
  --background: 240 10% 3.9%;
  --primary: 263 67% 64%;   /* violet-500 */
  /* ... */
}
```

Extended in `tailwind.config.ts` as `hsl(var(--*))` values. Always use semantic color tokens (`bg-background`, `text-foreground`, `text-primary`, `text-muted-foreground`) — never hardcode colors.

---

## Content

### Blog Posts

Add `.mdx` files to `content/posts/`. Required frontmatter:

```mdx
---
title: "Post Title"
date: "2026-01-01"
description: "Short summary shown on the blog index."
tags: ["tag1", "tag2"]
published: true
---
```

Only posts with `published: true` are shown. Sorted by date descending.

### About Page

Edit `content/about.mdx`. Supports full MDX — blank lines between paragraphs are required for spacing (standard Markdown). The `prose prose-zinc dark:prose-invert` classes handle typography (requires `@tailwindcss/typography`).

### Projects

Repos are pulled from GitHub API filtered by the `portfolio` topic. Tag a repo on GitHub: repo → About (gear icon) → Topics → add `portfolio`.

Set `GITHUB_TOKEN` and `GITHUB_USERNAME` in `.env.local`.

---

## Environment Variables

| Variable          | Description                      |
|-------------------|----------------------------------|
| `GITHUB_TOKEN`    | GitHub personal access token     |
| `GITHUB_USERNAME` | GitHub username (`nawrasrq`)     |

---

## Running

```bash
npm run dev     # Dev server at localhost:3000
npm run build   # Production build
npm run lint    # ESLint
```

---

## Gotchas

- **ThemeToggle mounted guard:** `useTheme()` returns `undefined` on the server. The component renders an invisible placeholder icon (`opacity-0`) until hydrated to prevent layout shift.
- **`next-mdx-remote/rsc`:** Uses React Server Components — import from `next-mdx-remote/rsc`, not `next-mdx-remote`.
- **ISR on projects page:** GitHub repos are cached for 1 hour (`next: { revalidate: 3600 }`). Changes to repo topics won't reflect immediately.
- **Resume PDF:** Stored at `public/resume.pdf`. Replace this file to update the downloadable resume.
- **`@tailwindcss/typography`** must be in `tailwind.config.ts` plugins for `prose` classes to work on the About page.
