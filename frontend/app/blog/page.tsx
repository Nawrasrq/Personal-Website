import type { Metadata } from 'next'
import { BlogClient } from '@/components/blog/BlogClient'
import { getAllPosts } from '@/lib/mdx'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Thoughts on software engineering, web development, and more.',
}

export default function BlogPage() {
  const posts = getAllPosts()

  const tags = Array.from(
    new Set(posts.flatMap((p) => p.frontmatter.tags ?? []))
  ).sort()

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
        <p className="text-muted-foreground">
          Thoughts on software engineering, web development, and more.
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="text-muted-foreground py-12 text-center">
          No posts yet — check back soon.
        </p>
      ) : (
        <BlogClient posts={posts} tags={tags} />
      )}
    </div>
  )
}
