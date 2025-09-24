type GistItem = {
  id: string
  fileName: string
  owner: string
  gistName: string
  description: string
  createdAt: string
  lines: string[]
}

export function ProfileGistList({ items }: { items: GistItem[] }) {
  return (
    <div className="gist-list">
      {items.map((g) => (
        <article key={g.id} className="gist-list__item" aria-label={`Gist ${g.gistName}`}>
          <div className="gist-list__filetab">
            <span className="gist-list__filename">{g.fileName}</span>
            <span className="gist-list__view-chip" role="button" tabIndex={0}>
              View {g.fileName}
            </span>
          </div>

          <div className="gist-list__code">
            <div className="gist-list__gutter" aria-hidden="true">
              {g.lines.map((_, i) => (
                <span key={i} className="gist-list__line-number">
                  {i + 1}
                </span>
              ))}
            </div>
            <pre className="gist-list__pre" aria-label="Code preview">
              {g.lines.join("\n")}
            </pre>
          </div>

          <div className="gist-list__meta">
            <div className="gist-list__meta-left">
              <div className="gist-list__avatar" aria-hidden="true">
                JD
              </div>
              <div className="gist-list__owner">
                <span className="gist-list__owner-name">{g.owner}</span>
                <span className="gist-list__slash">{" / "}</span>
                <span className="gist-list__gist-name" title={g.gistName}>
                  {g.gistName}
                </span>
                <div className="gist-list__created">{g.createdAt}</div>
                <div className="gist-list__desc" title={g.description}>
                  {g.description}
                </div>
              </div>
            </div>
            {/* Right side actions can be added later */}
          </div>
        </article>
      ))}
    </div>
  )
}
