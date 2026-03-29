import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { compileMDX } from 'next-mdx-remote/rsc'
import rehypePrettyCode from 'rehype-pretty-code'
import type { Post, PostFrontmatter } from './types'

const contentDir = path.join(process.cwd(), 'content')
const postsDir = path.join(contentDir, 'posts')

export function getAllPosts(): Post[] {
  if (!fs.existsSync(postsDir)) return []

  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.mdx'))

  const posts = files
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, '')
      const raw = fs.readFileSync(path.join(postsDir, filename), 'utf-8')
      const { data, content } = matter(raw)
      const wordCount = content.trim().split(/\s+/).length
      return {
        slug,
        frontmatter: data as PostFrontmatter,
        readingTime: Math.max(1, Math.round(wordCount / 200)),
      }
    })
    .filter((post) => post.frontmatter.published)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    )

  return posts
}

export async function getPostBySlug(slug: string) {
  const filepath = path.join(postsDir, `${slug}.mdx`)
  if (!fs.existsSync(filepath)) return null

  const raw = fs.readFileSync(filepath, 'utf-8')

  const { content, frontmatter } = await compileMDX<PostFrontmatter>({
    source: raw,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        rehypePlugins: [
          [
            rehypePrettyCode,
            {
              theme: 'one-dark-pro',
              keepBackground: true,
            },
          ],
        ],
      },
    },
  })

  return { content, frontmatter, slug }
}

export async function getAboutContent() {
  const filepath = path.join(contentDir, 'about.mdx')
  if (!fs.existsSync(filepath)) return null

  const raw = fs.readFileSync(filepath, 'utf-8')

  const { content, frontmatter } = await compileMDX<{ title: string; lastUpdated: string }>({
    source: raw,
    options: {
      parseFrontmatter: true,
    },
  })

  return { content, frontmatter }
}
