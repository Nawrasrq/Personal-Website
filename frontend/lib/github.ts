import type { GitHubRepo } from './types'

export async function getPortfolioRepos(): Promise<GitHubRepo[]> {
  const username = process.env.GITHUB_USERNAME ?? 'nawrasrq'
  const token = process.env.GITHUB_TOKEN

  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
    {
      headers,
      next: { revalidate: 3600 }, // ISR: revalidate every hour
    }
  )

  if (!res.ok) {
    console.error(`GitHub API error: ${res.status} ${res.statusText}`)
    return []
  }

  const repos: GitHubRepo[] = await res.json()

  return repos
    .filter((repo) => repo.topics.includes('portfolio'))
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
}
