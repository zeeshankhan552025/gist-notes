import type { GitHubGist } from "../../services/github-api"
import { formatCreatedDate } from "../../utils/date-utils"
import { getCodeSnippetFromGist } from "../../utils/code-snippet-utils"
import GistCard from "../GistCard/gist-card"
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
          gistName: Object.keys(gist.files)[0] ?? 'untitled',
          description: gist.description ?? 'No description',
          createdAt: formatCreatedDate(gist.created_at),
          codeSnippet: getCodeSnippetFromGist(gist),
          language: getGistLanguage(gist),
          avatarUrl: gist.owner.avatar_url,
          viewLabel: Object.keys(gist.files)[0] ?? 'untitled',
          gistUrl: gist.html_url
        }

        return <GistCard key={gist.id} data={cardData} />
      })}
    </div>
  )
}

function getGistLanguage(gist: GitHubGist): string | undefined {
  const firstFile = Object.values(gist.files)[0]
  return firstFile?.language?.toLowerCase()
}