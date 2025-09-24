import { GitFork, Star } from "lucide-react"
import "./gist-detail.scss"
import GistEditor from "../../components/gist-editor"

type PageProps = {
  params: { id: string }
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/)
  const a = parts[0]?.[0] || ""
  const b = parts[1]?.[0] || ""
  return (a + b).toUpperCase()
}

export default function GistDetailPage({ params }: PageProps) {
  // Mock data – replace with real data when backend is ready
  const userName = "John Doe"
  const gistName = "gist_name"
  const created = "Created 7 hours ago"
  const description = "Gist Description"
  const fileName = "vercel_package.json"
  const forkCount = 18
  const starCount = 528

  const code = `{
  "name": "vercel-monorepo",
  "version": "0.0.1",
  "private": true,
  "license": "Apache-2.0",
  "packageManager": "pnpm@8.31",
  "dependencies": {
    "next": "15.0.0"
  },
  "devDependencies": {
    "typescript": "5.6.2",
    "eslint": "^9.11.1"
  }
}
`

  return (
    <>
      <main className="gist-detail" aria-labelledby="gist-heading">
        <header className="gist-detail__header">
          <div className="gist-detail__author">
            <div className="gist-detail__avatar" aria-hidden>
              {getInitials(userName)}
            </div>
            <div>
              <h1 id="gist-heading" className="gist-detail__title">
                <span className="gist-detail__name">{userName}</span>
                <span className="gist-detail__sep">/</span>
                <span className="gist-detail__gist">{gistName}</span>
              </h1>
              <div className="gist-detail__meta">{created}</div>
              <p className="gist-detail__desc">{description}</p>
            </div>
          </div>

          <div className="gist-detail__actions" aria-label="Gist actions">
            <button className="btn" aria-label="Fork gist">
              <span className="btn__icon" aria-hidden>
                <GitFork size={16} />
              </span>
              Fork
              <span className="btn__count" aria-label={`${forkCount} forks`}>
                {forkCount}
              </span>
            </button>
            <button className="btn" aria-label="Star gist">
              <span className="btn__icon" aria-hidden>
                <Star size={16} />
              </span>
              Star
              <span className="btn__count" aria-label={`${starCount} stars`}>
                {starCount}
              </span>
            </button>
          </div>
        </header>

        <section className="gist-detail__file" aria-label="Gist file">
          <div className="gist-detail__filetab" role="tab" aria-selected="true">
            {fileName}
          </div>
          <div className="gist-detail__editor">
            <GistEditor value={code} language="json" readOnly height={520} />
          </div>
        </section>
      </main>
    </>
  )
}
