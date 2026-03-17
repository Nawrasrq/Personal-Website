import Link from 'next/link'
import { Star, ExternalLink, Github } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button-variants'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { GitHubRepo } from '@/lib/types'

const languageColors: Record<string, string> = {
  Python: 'bg-blue-500',
  TypeScript: 'bg-blue-400',
  JavaScript: 'bg-yellow-400',
  Rust: 'bg-orange-500',
  Go: 'bg-cyan-500',
  Java: 'bg-red-500',
  'C++': 'bg-pink-500',
  HTML: 'bg-orange-400',
  CSS: 'bg-purple-500',
}

export function ProjectCard({ repo }: { repo: GitHubRepo }) {
  const dotColor = repo.language
    ? languageColors[repo.language] ?? 'bg-zinc-400'
    : null

  return (
    <Card className="flex flex-col h-full hover:border-primary/50 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-snug">{repo.name}</h3>
          {repo.stargazers_count > 0 && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
              <Star className="h-3.5 w-3.5" />
              {repo.stargazers_count}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        {repo.description && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {repo.description}
          </p>
        )}
        {repo.language && dotColor && (
          <div className="flex items-center gap-1.5">
            <span className={`h-2.5 w-2.5 rounded-full ${dotColor}`} />
            <span className="text-xs text-muted-foreground">{repo.language}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2 pt-4">
        <Link
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
        >
          <Github className="mr-1.5 h-3.5 w-3.5" />
          Code
        </Link>
        {repo.homepage && (
          <Link
            href={repo.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ size: 'sm' }))}
          >
            <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
            Live Demo
          </Link>
        )}
      </CardFooter>
    </Card>
  )
}
