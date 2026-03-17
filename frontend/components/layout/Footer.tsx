import Link from 'next/link'
import { Github, Linkedin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border/40 mt-24">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-8">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Nawras
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/nawrasrq"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="h-5 w-5" />
          </Link>
          <Link
            href="https://www.linkedin.com/in/nawras-rawas-qalaji-057a15147/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Linkedin className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </footer>
  )
}
