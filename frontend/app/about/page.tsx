import type { Metadata } from 'next'
import Link from 'next/link'
import { Github, Linkedin, Download } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button-variants'
import { cn } from '@/lib/utils'
import { SkillBadges } from '@/components/about/SkillBadges'
import { Timeline } from '@/components/about/Timeline'
import { getAboutContent } from '@/lib/mdx'

export const metadata: Metadata = {
  title: 'About',
  description: 'About Nawras — software engineer.',
}

export default async function AboutPage() {
  const about = await getAboutContent()

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 space-y-12">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">About Me</h1>
        <div className="flex flex-wrap gap-3">
          <Link
            href="https://github.com/nawrasrq"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
          >
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </Link>
          <Link
            href="https://www.linkedin.com/in/nawras-rawas-qalaji-057a15147/"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
          >
            <Linkedin className="mr-2 h-4 w-4" />
            LinkedIn
          </Link>
          <a
            href="/resume.pdf"
            download="Nawras_Resume.pdf"
            className={cn(buttonVariants({ size: 'sm' }))}
          >
            <Download className="mr-2 h-4 w-4" />
            Resume
          </a>
        </div>
      </div>

      {about && (
        <div className="prose prose-zinc dark:prose-invert max-w-none">
          {about.content}
        </div>
      )}

      <hr className="border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Skills & Tech Stack</h2>
        <SkillBadges />
      </section>

      <hr className="border-border" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Experience & Education</h2>
        <Timeline />
      </section>
    </div>
  )
}
