export interface GitHubRepo {
  id: number
  name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  stargazers_count: number
  topics: string[]
  updated_at: string
}

export interface PostFrontmatter {
  title: string
  date: string
  description: string
  tags: string[]
  published: boolean
}

export interface Post {
  slug: string
  frontmatter: PostFrontmatter
  readingTime: number
}
