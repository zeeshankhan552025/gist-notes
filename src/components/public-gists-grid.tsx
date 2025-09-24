import type { GitHubGist } from "../services/github"
import GistCard from "./gist-card"
import "./public-gist-grid-view.scss"

interface PublicGistsGridProps {
  gists: GitHubGist[]
  loading?: boolean
}

export function PublicGistsGrid({ gists, loading }: PublicGistsGridProps) {
  if (loading) {
    return (
      <div className="gists-grid gists-grid--loading">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="gists-grid__skeleton">
            <div className="skeleton skeleton--code"></div>
            <div className="skeleton skeleton--meta">
              <div className="skeleton skeleton--avatar"></div>
              <div className="skeleton skeleton--text">
                <div className="skeleton skeleton--line"></div>
                <div className="skeleton skeleton--line skeleton--line--short"></div>
              </div>
            </div>
          </div>
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
          createdAt: new Date(gist.created_at).toLocaleDateString(),
          codeSnippet: getCodeSnippet(gist),
          language: getGistLanguage(gist)
        }

        return <GistCard key={gist.id} data={cardData} />
      })}
    </div>
  )
}

function getCodeSnippet(gist: GitHubGist): string {
  const firstFile = Object.values(gist.files)[0]
  if (!firstFile) return ''
  
  // For now, return a placeholder since we don't have content in the API response
  // In a real app, you'd fetch the raw content or truncate if available
  return `// ${firstFile.filename}\n// ${firstFile.language || 'Text'} file\n// ${firstFile.size} bytes`
}

function getGistLanguage(gist: GitHubGist): string | undefined {
  const firstFile = Object.values(gist.files)[0]
  return firstFile?.language?.toLowerCase()
}