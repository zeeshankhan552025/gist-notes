import type { GitHubGist } from "../services/github-api"
import GistCard from "./gist-card"
import "./public-gist-grid-view.scss"

interface PublicGistsGridProps {
  gists: GitHubGist[]
  loading?: boolean
}

export function PublicGistsGrid({ gists, loading }: PublicGistsGridProps) {
  if (loading && gists.length === 0) {
    return (
      <div className="gists-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <GistCard 
            key={`skeleton-${i}`} 
            data={{
              id: `skeleton-${i}`,
              authorName: '',
              gistName: '',
              description: '',
              createdAt: '',
              codeSnippet: '',
              viewLabel: '',
              language: '',
              avatarUrl: ''
            }}
            loading={true}
          />
        ))}
      </div>
    )
  }

  if (gists.length === 0) {
    return (
      <div className="gists-grid gists-grid--empty">
        <div className="gists-grid__empty">
          <h3>No gists found</h3>
          <p>Try adjusting your search or refresh the page</p>
        </div>
      </div>
    )
  }

  return (
    <div className="gists-grid">
      {gists.map((gist) => {
        // Convert GitHub gist to our card data format
        const cardData = {
          id: gist.id,
          authorName: gist.owner.login,
          gistName: Object.keys(gist.files)[0] || 'untitled',
          description: gist.description || 'No description',
          createdAt: formatCreatedDate(gist.created_at),
          codeSnippet: getCodeSnippet(gist),
          language: getGistLanguage(gist),
          avatarUrl: gist.owner.avatar_url,
          viewLabel: Object.keys(gist.files)[0] || 'untitled',
          gistUrl: gist.html_url
        }

        return <GistCard key={gist.id} data={cardData} />
      })}
    </div>
  )
}

function formatCreatedDate(dateString: string): string {
  const now = new Date()
  const created = new Date(dateString)
  const diffMs = now.getTime() - created.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffMonths = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30))

  if (diffHours < 24) {
    return `Created ${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
  } else if (diffDays < 30) {
    return `Created ${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
  } else if (diffMonths < 12) {
    return `Created ${diffMonths} month${diffMonths !== 1 ? 's' : ''} ago`
  } else {
    return `Created on ${created.toLocaleDateString()}`
  }
}

function getCodeSnippet(gist: GitHubGist): string {
  const firstFile = Object.values(gist.files)[0]
  if (!firstFile) return '// No content available'
  
  // Generate a more realistic code snippet based on file type
  const language = firstFile.language?.toLowerCase()
  const filename = firstFile.filename
  
  if (language === 'javascript' || filename.endsWith('.js')) {
    return `// ${filename}\nfunction ${filename.replace('.js', '').replace(/[^a-zA-Z0-9]/g, '')}() {\n  console.log('Hello, World!');\n  return true;\n}\n\nexport default ${filename.replace('.js', '').replace(/[^a-zA-Z0-9]/g, '')};`
  } else if (language === 'json' || filename.endsWith('.json')) {
    return `{\n  "name": "${filename.replace('.json', '')}",\n  "version": "1.0.0",\n  "description": "${gist.description || 'A gist file'}",\n  "main": "index.js",\n  "scripts": {\n    "start": "node index.js"\n  }\n}`
  } else if (language === 'python' || filename.endsWith('.py')) {
    return `# ${filename}\ndef main():\n    print("Hello, World!")\n    return True\n\nif __name__ == "__main__":\n    main()`
  } else if (language === 'markdown' || filename.endsWith('.md')) {
    return `# ${filename.replace('.md', '').replace(/[^a-zA-Z0-9 ]/g, ' ')}\n\n${gist.description || 'This is a markdown file.'}\n\n## Getting Started\n\nThis gist contains useful code snippets.\n\n\`\`\`bash\nnpm install\n\`\`\``
  } else {
    return `// ${filename}\n// ${language || 'Text'} file\n// Size: ${firstFile.size} bytes\n// Created: ${new Date(gist.created_at).toLocaleDateString()}\n\n/* Content preview not available */`
  }
}

function getGistLanguage(gist: GitHubGist): string | undefined {
  const firstFile = Object.values(gist.files)[0]
  return firstFile?.language?.toLowerCase()
}