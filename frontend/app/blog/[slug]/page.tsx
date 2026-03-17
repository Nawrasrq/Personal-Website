import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PostHeader } from '@/components/blog/PostHeader'
import { getAllPosts, getPostBySlug } from '@/lib/mdx'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)
  if (!post) return {}
  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug)
  if (!post) notFound()

  return (
    <article className="mx-auto max-w-3xl px-6 py-16 space-y-8">
      <PostHeader frontmatter={post.frontmatter} />
      <div className="prose prose-zinc dark:prose-invert max-w-none">
        {post.content}
      </div>
    </article>
  )
}
