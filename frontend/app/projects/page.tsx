import type { Metadata } from 'next'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { getPortfolioRepos } from '@/lib/github'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'A selection of my personal projects.',
}

export default async function ProjectsPage() {
  const repos = await getPortfolioRepos()

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <p className="text-muted-foreground">
          A selection of my personal projects.
        </p>
      </div>

      {repos.length === 0 ? (
        <p className="text-muted-foreground py-12 text-center">
          No projects found. Tag a GitHub repo with the{' '}
          <code className="text-xs bg-muted px-1.5 py-0.5 rounded">portfolio</code>{' '}
          topic to display it here.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {repos.map((repo) => (
            <ProjectCard key={repo.id} repo={repo} />
          ))}
        </div>
      )}
    </div>
  )
}
