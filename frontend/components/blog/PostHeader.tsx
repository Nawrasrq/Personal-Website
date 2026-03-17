import { Badge } from '@/components/ui/badge'
import type { PostFrontmatter } from '@/lib/types'

export function PostHeader({ frontmatter }: { frontmatter: PostFrontmatter }) {
  return (
    <div className="space-y-4 pb-8 border-b border-border">
      <p className="text-sm text-muted-foreground">
        {new Date(frontmatter.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </p>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        {frontmatter.title}
      </h1>
      <p className="text-lg text-muted-foreground">{frontmatter.description}</p>
      {frontmatter.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {frontmatter.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
