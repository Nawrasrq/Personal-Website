interface TimelineItem {
  title: string
  organization: string
  location: string
  period: string
  bullets?: string[]
  description?: string
  type: 'work' | 'education'
}

const items: TimelineItem[] = [
  {
    type: 'work',
    title: 'Software Engineer',
    organization: 'Designer Eyes',
    location: 'Sunrise, FL',
    period: 'July 2024 – Present',
    bullets: [
      'Developed and maintained databases, optimizing index and schema design to enhance data integrity and automation potential. (Python)',
      'Led engineers in restructuring our multi-channel fulfillment pipelines, transforming short solutions into long-term ones. (Python, SQL, Batch)',
      'Optimized large-scale data processing automation using Pandas and query analysis, significantly improving processing speed. (Python, Pandas, SQL)',
      'Designed ETL pipelines to collect, clean, and integrate data from multiple sources, improving old and new access to data pools. (Python, SQL, Batch)',
      'Integrated several 3rd-party product analysis and fulfillment software, expanding access to new channels. (Python, SQL, Sellercloud, Keepa)',
      'Automated manual tasks, reducing hours spent on daily tasks such as cost price calculation and historical market sales analysis. (Python, SQL, Batch)',
    ],
  },
  {
    type: 'work',
    title: 'Computer Science Teacher',
    organization: 'Fusion Academy',
    location: 'Boca Raton, FL',
    period: 'September 2023 – February 2024',
    bullets: [
      'Taught a variety of STEM-related courses such as Coding, Robotics, Web Development, and more. (Python, JS, CSS, HTML)',
    ],
  },
  {
    type: 'work',
    title: 'Software Engineer',
    organization: 'Motorola Solutions',
    location: 'Plantation, FL',
    period: 'May 2020 – August 2022',
    bullets: [
      'Enhanced present analysis tools used for automated testing, addressing user bug reports and feature suggestions. (Python, JavaScript, PHP)',
      'Created a dynamic central dashboard, improving visibility and management of automated testing on multiple radios. (Python, PHP, JavaScript)',
      'Designed a webpage to display testing summaries for multiple systems to more efficiently gauge automated testing. (PHP, JavaScript)',
    ],
  },
  {
    type: 'education',
    title: 'B.S. Computer Science',
    organization: 'University of Central Florida',
    location: 'Orlando, FL',
    period: 'August 2019 – May 2023',
    description: 'GPA: 3.2',
  },
]

export function Timeline() {
  return (
    <div className="space-y-6">
      {items.map((item, i) => (
        <div key={i} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="h-2.5 w-2.5 rounded-full bg-primary mt-1.5 shrink-0" />
            {i < items.length - 1 && (
              <div className="w-px flex-1 bg-border mt-2" />
            )}
          </div>
          <div className="pb-6 space-y-1">
            <div className="flex flex-wrap items-baseline gap-2">
              <h3 className="font-medium">{item.title}</h3>
              <span className="text-sm text-muted-foreground">
                @ {item.organization} · {item.location}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{item.period}</p>
            {item.description && (
              <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
            )}
            {item.bullets && item.bullets.length > 0 && (
              <ul className="mt-2 space-y-1 list-disc list-inside">
                {item.bullets.map((b, j) => (
                  <li key={j} className="text-sm text-muted-foreground">
                    {b}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
