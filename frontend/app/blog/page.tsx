import type { Metadata } from 'next'
import { PostCard } from '@/components/blog/PostCard'
import { getAllPosts } from '@/lib/mdx'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Thoughts on software engineering, web development, and more.',
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 space-y-8">
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
        <div className="grid gap-4">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
