'use client'

import { useState } from 'react'
import { PostCard } from './PostCard'
import { cn } from '@/lib/utils'
import type { Post } from '@/lib/types'

export function BlogClient({ posts, tags }: { posts: Post[]; tags: string[] }) {
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const filtered = activeTag
    ? posts.filter((p) => p.frontmatter.tags?.includes(activeTag))
    : posts

  return (
    <div className="space-y-8">
      {/* Tag filter pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTag(null)}
          className={cn(
            'rounded-full border px-4 py-1.5 text-sm transition-colors',
            activeTag === null
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
          )}
        >
          All
        </button>
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            className={cn(
              'rounded-full border px-4 py-1.5 text-sm transition-colors',
              activeTag === tag
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
            )}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Posts grid */}
      {filtered.length === 0 ? (
        <p className="text-muted-foreground py-12 text-center">No posts found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
