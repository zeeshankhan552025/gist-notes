import { EyeOutlined } from "@ant-design/icons"
import { Avatar, Skeleton, Tooltip } from "antd"
import { useNavigate } from "react-router-dom"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'

export type GistCardData = {
  id: string
  authorName: string
  gistName: string
  description: string
  createdAt: string
  codeSnippet: string
  viewLabel?: string
  language?: string
  avatarUrl?: string
  gistUrl?: string
}

interface GistCardProps {
  data: GistCardData
  loading?: boolean
}

export default function GistCard({ data, loading = false }: GistCardProps) {
  const navigate = useNavigate();
  
  const initials =
    data.authorName
      .split(" ")
      .map((n) => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U"

  // Handle card click to navigate to detail page
  const handleCardClick = () => {
    if (!loading && data.id) {
      navigate(`/gist/${data.id}`);
    }
  };

  // Handle view button click to open gist in new tab (keep original behavior)
  const handleViewClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when view button is clicked
    if (data.gistUrl) {
      window.open(data.gistUrl, '_blank', 'noopener,noreferrer')
    }
  };

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

  const truncateFilename = (filename: string, maxLength: number = 20): string => {
    if (filename.length <= maxLength) {
      return filename
    }
    return filename.substring(0, maxLength - 3) + '...'
  }

  const filename = data?.viewLabel ?? "vercel_package.json"
  const truncatedFilename = truncateFilename(filename)
  const viewText = `View ${truncatedFilename}`

  // Render skeleton card when loading
  if (loading) {
    return (
      <article className="gist-card gist-card--skeleton" aria-label="Loading gist...">
        {/* Skeleton view button */}
        <div className="gist-card__view-button-container">
          <Skeleton.Button style={{ width: 120, height: 32, borderRadius: 6 }} active />
        </div>
        
        <div className="gist-card__code">
          <div className="gist-card__code-skeleton">
            <div className="gist-card__code-line-numbers">
              <Skeleton.Input style={{ width: 20, height: 16, marginBottom: 4 }} active />
              <Skeleton.Input style={{ width: 20, height: 16, marginBottom: 4 }} active />
              <Skeleton.Input style={{ width: 20, height: 16, marginBottom: 4 }} active />
              <Skeleton.Input style={{ width: 20, height: 16, marginBottom: 4 }} active />
              <Skeleton.Input style={{ width: 20, height: 16, marginBottom: 4 }} active />
            </div>
            <div className="gist-card__code-content">
              <Skeleton.Input style={{ width: '90%', height: 16, marginBottom: 4 }} active />
              <Skeleton.Input style={{ width: '75%', height: 16, marginBottom: 4 }} active />
              <Skeleton.Input style={{ width: '85%', height: 16, marginBottom: 4 }} active />
              <Skeleton.Input style={{ width: '60%', height: 16, marginBottom: 4 }} active />
              <Skeleton.Input style={{ width: '80%', height: 16, marginBottom: 4 }} active />
              <Skeleton.Input style={{ width: '70%', height: 16, marginBottom: 4 }} active />
            </div>
          </div>
          <div className="gist-card__code-fade"></div>
        </div>

        <div className="gist-card__meta">
          <div className="gist-card__author">
            <Skeleton.Avatar size={32} active />
            <div className="gist-card__author-info">
              <div className="gist-card__author-name">
                <Skeleton.Input style={{ width: 200, height: 16, marginBottom: 4 }} active />
              </div>
              <div className="gist-card__details">
                <Skeleton.Input style={{ width: 150, height: 14 }} active />
              </div>
            </div>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article 
      className={`gist-card ${!loading ? 'gist-card--clickable' : ''}`} 
      aria-label={`${data.authorName} / ${data.gistName}`}
      onClick={handleCardClick}
      style={{ cursor: loading ? 'default' : 'pointer' }}
    >
      {/* Top-right view button */}
      <div className="gist-card__view-button-container">
        <Tooltip title={`View ${filename}`}>
          <button 
            className="gist-card__view-btn" 
            aria-label={viewText}
            onClick={handleViewClick}
            disabled={!data.gistUrl}
          >
            <EyeOutlined />
            <span className="gist-card__view-text">{viewText}</span>
          </button>
        </Tooltip>
      </div>
      
      <div className="gist-card__code">
        <SyntaxHighlighter
          language={data.language || getLanguageFromFilename(data.gistName)}
          style={tomorrow}
          showLineNumbers={true}
          customStyle={{
            margin: 0,
            padding: '16px',
            fontSize: '13px',
            lineHeight: '1.4',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '0',
            maxHeight: '200px',
            overflow: 'hidden'
          }}
          lineNumberStyle={{
            minWidth: '2.5em',
            paddingRight: '1em',
            color: '#6b7280',
            fontSize: '12px',
            userSelect: 'none'
          }}
        >
          {data.codeSnippet}
        </SyntaxHighlighter>
        <div className="gist-card__code-fade"></div>
      </div>

      <div className="gist-card__meta">
        <div className="gist-card__author">
          <Avatar
            size={32}
            src={data.avatarUrl}
            style={{ 
              flexShrink: 0,
              backgroundColor: data.avatarUrl ? 'transparent' : "#0b3f46",
              color: "#ffffff", 
              fontWeight: "600" 
            }}
            aria-label={`${data.authorName} avatar`}
          >
            {initials}
          </Avatar>
          <div className="gist-card__author-info">
            <div className="gist-card__author-name" title={`${data.authorName} / ${data.gistName}`}>
              <span className="gist-card__username">{data.authorName}</span>
              <span className="gist-card__separator"> / </span>
              <span className="gist-card__gist-name">{data.gistName}</span>
            </div>
            <div className="gist-card__details">
              <span className="gist-card__created">{data.createdAt}</span>
              {data.description && (
                <>
                  <span className="gist-card__dot" aria-hidden="true">•</span>
                  <span className="gist-card__description" title={data.description}>
                    {data.description}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

      </div>
    </article>
  )
}
