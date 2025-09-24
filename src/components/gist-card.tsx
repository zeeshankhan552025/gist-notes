import { Avatar, Tooltip } from "antd"
import { ForkOutlined, StarOutlined } from "@ant-design/icons"

export type GistCardData = {
  id: string
  authorName: string
  gistName: string
  description: string
  createdAt: string
  codeSnippet: string
  viewLabel?: string
}

export default function GistCard({ data }: { data: GistCardData }) {
  const initials =
    data.authorName
      .split(" ")
      .map((n) => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U"

  const lines = data.codeSnippet.split("\n")
  const viewText = `View ${data.viewLabel ?? "vercel_package.json"}`

  return (
    <article className="gists-cards__card" aria-label={`${data.authorName} / ${data.gistName}`}>
      <div className="gists-cards__code">
        <ol className="gists-cards__gutter" aria-hidden="true">
          {lines.map((_, i) => (
            <li key={i}>{i + 1}</li>
          ))}
        </ol>
        <pre className="gists-cards__code-pre" aria-label="Code preview">
          {data.codeSnippet}
        </pre>
        <button className="gists-cards__view-chip" aria-label={viewText}>
          {viewText}
        </button>
      </div>

      <div className="gists-cards__meta">
        <div className="gists-cards__author">
          <Avatar
            size={28}
            style={{ backgroundColor: "#0b3f46", color: "#ffffff" }}
            aria-label={`${data.authorName} avatar`}
          >
            {initials}
          </Avatar>
          <div className="gists-cards__author-text">
            <div className="gists-cards__name" title={`${data.authorName} / ${data.gistName}`}>
              <span className="gists-cards__name-author">{data.authorName}</span>
              <span className="gists-cards__name-sep"> / </span>
              <span className="gists-cards__name-gist">{data.gistName}</span>
            </div>
            <div className="gists-cards__subtext">
              <span className="gists-cards__created">{data.createdAt}</span>
              <span className="gists-cards__dot" aria-hidden="true">
                •
              </span>
              <span className="gists-cards__desc" title={data.description}>
                {data.description}
              </span>
            </div>
          </div>
        </div>

        <div className="gists-cards__actions" aria-label="Actions">
          <Tooltip title="Fork">
            <button className="gists-cards__action-btn" aria-label="Fork gist">
              <ForkOutlined />
            </button>
          </Tooltip>
          <Tooltip title="Star">
            <button className="gists-cards__action-btn" aria-label="Star gist">
              <StarOutlined />
            </button>
          </Tooltip>
        </div>
      </div>
    </article>
  )
}
