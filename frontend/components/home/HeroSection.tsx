import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button-variants'
import { Github, Linkedin, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function HeroSection() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-32 md:py-40">
      <div className="space-y-6">
        <p className="text-sm font-medium tracking-widest text-primary uppercase">
          Software Engineer
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Hi, I&apos;m{' '}
          <span className="text-primary">Nawras</span>
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground leading-relaxed">
          I build fast, modern web applications and enjoy solving complex
          problems with clean, maintainable code.
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link href="/projects" className={cn(buttonVariants())}>
            View Projects
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link href="/blog" className={cn(buttonVariants({ variant: 'outline' }))}>
            Read Blog
          </Link>
        </div>
        <p className="max-w-xl text-sm text-muted-foreground leading-relaxed">
          My work spans database architecture, ETL pipeline design, REST APIs, E-Commerce
          integrations, and workflow automation primarily in Python and SQL. I&apos;m most
          at home designing the infrastructure that sits between raw data and the people who rely on it.
        </p>
        <div className="flex items-center gap-4 pt-2">
          <Link
            href="https://github.com/nawrasrq"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="GitHub"
          >
            <Github className="h-5 w-5" />
          </Link>
          <Link
            href="https://www.linkedin.com/in/nawras-rawas-qalaji-057a15147/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
