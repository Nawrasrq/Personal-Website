import { Badge } from '@/components/ui/badge'

const skillGroups = [
  {
    label: 'Languages',
    skills: ['Python', 'SQL', 'JavaScript', 'C++'],
  },
  {
    label: 'Frameworks & Libraries',
    skills: ['Flask', 'FastAPI', 'Django', 'Node.js', 'Express', 'NumPy', 'Pandas'],
  },
  {
    label: 'Databases & Data',
    skills: ['MySQL', 'PostgreSQL', 'ETLs', 'Web Scraping', 'Machine Learning', 'Query Optimization', 'Normalization'],
  },
  {
    label: 'Tools & Platforms',
    skills: ['Git', 'Docker', 'Linux', 'WSL2', 'Jira', 'Confluence', 'DataGrip', 'VS Code'],
  },
  {
    label: 'E-Commerce',
    skills: ['Amazon', 'Shopify', 'TikTok Shop', 'eBay'],
  },
  {
    label: 'Expertise',
    skills: ['Backend', 'REST APIs', 'Data Engineering', 'Database Architecture', 'System Monitoring'],
  },
]

export function SkillBadges() {
  return (
    <div className="space-y-4">
      {skillGroups.map((group) => (
        <div key={group.label}>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            {group.label}
          </p>
          <div className="flex flex-wrap gap-2">
            {group.skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="text-sm px-3 py-1">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
