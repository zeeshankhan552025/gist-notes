import { Avatar, Tooltip } from "antd"
import { ForkOutlined, StarOutlined } from "@ant-design/icons"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'

export type GistCardData = {
  id: string
  authorName: string
  gistName: string
  description: string
  createdAt: string
  codeSnippet: string
  viewLabel?: string
  language?: string
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

  const getLanguageFromFilename = (filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase()
    const languageMap: Record<string, string> = {
      'js': 'javascript',
      'jsx': 'jsx',
      'ts': 'typescript',
      'tsx': 'tsx',
      'py': 'python',
      'java': 'java',
      'c': 'c',
      'cpp': 'cpp',
      'cs': 'csharp',
      'php': 'php',
      'rb': 'ruby',
      'go': 'go',
      'rs': 'rust',
      'sh': 'bash',
      'sql': 'sql',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'json': 'json',
      'xml': 'xml',
      'yml': 'yaml',
      'yaml': 'yaml',
      'md': 'markdown',
      'dockerfile': 'dockerfile'
    }
    return languageMap[extension || ''] || 'text'
  }

  const viewText = `View ${data.viewLabel ?? "vercel_package.json"}`

  return (
    <article className="gists-cards__card" aria-label={`${data.authorName} / ${data.gistName}`}>
      <div className="gists-cards__code">
        <SyntaxHighlighter
          language={data.language || getLanguageFromFilename(data.gistName)}
          style={oneLight}
          showLineNumbers={true}
          customStyle={{
            margin: 0,
            padding: '12px',
            fontSize: '12px',
            lineHeight: '1.3',
            backgroundColor: '#fafafa',
            border: 'none',
            borderRadius: '6px 6px 0 0'
          }}
          lineNumberStyle={{
            minWidth: '2em',
            paddingRight: '0.8em',
            color: '#999',
            fontSize: '11px'
          }}
        >
          {data.codeSnippet}
        </SyntaxHighlighter>
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
