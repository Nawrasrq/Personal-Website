import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import type { Post } from '@/lib/types'

export function PostCard({ post }: { post: Post }) {
  const { slug, frontmatter } = post

  return (
    <Link href={`/blog/${slug}`} className="group block">
      <Card className="h-full transition-colors hover:border-primary/50">
        <CardHeader className="pb-3">
          <p className="text-xs text-muted-foreground">
            {new Date(frontmatter.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <h2 className="text-lg font-semibold group-hover:text-primary transition-colors leading-snug">
            {frontmatter.title}
          </h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {frontmatter.description}
          </p>
          {frontmatter.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {frontmatter.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
