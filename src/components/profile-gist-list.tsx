import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { EyeOutlined } from '@ant-design/icons'
import { Avatar, Tooltip } from 'antd'
import { useNavigate } from 'react-router-dom'
import './profile-gist-card.scss'

type GistItem = {
  id: string
  fileName: string
  owner: string
  gistName: string
  description: string
  createdAt: string
  lines: string[]
  ownerAvatar?: string | null
  language?: string
}

export function ProfileGistList({ items }: { items: GistItem[] }) {
  const navigate = useNavigate();
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

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
    return languageMap[extension ?? ''] ?? 'text'
  }

  return (
    <div className="profile-gist-grid">
      {items.map((g) => {
        const handleCardClick = () => {
          void navigate(`/gist/${g.id}`);
        };

        const handleViewClick = (e: React.MouseEvent) => {
          e.stopPropagation();
          // Open gist on GitHub
          window.open(`https://gist.github.com/${g.id}`, '_blank', 'noopener,noreferrer');
        };

        const truncateFilename = (filename: string, maxLength = 20): string => {
          if (filename.length <= maxLength) {
            return filename
          }
          return `${filename.substring(0, maxLength - 3)  }...`;
        };

        const truncatedFilename = truncateFilename(g.fileName);
        const viewText = `View ${truncatedFilename}`;

        return (
          <article 
            key={g.id} 
            className="profile-gist-card profile-gist-card--clickable"
            onClick={handleCardClick}
            style={{ cursor: 'pointer' }}
            aria-label={`${g.owner} / ${g.gistName}`}
          >
            {/* Top-right view button */}
            <div className="profile-gist-card__view-button-container">
              <Tooltip title={`View ${g.fileName}`}>
                <button 
                  className="profile-gist-card__view-btn" 
                  aria-label={viewText}
                  onClick={handleViewClick}
                >
                  <EyeOutlined />
                  <span className="profile-gist-card__view-text">{viewText}</span>
                </button>
              </Tooltip>
            </div>

            <div className="profile-gist-card__code">
              <SyntaxHighlighter
                language={g.language ?? getLanguageFromFilename(g.fileName)}
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
                {g.lines.join('\n')}
              </SyntaxHighlighter>
              <div className="profile-gist-card__code-fade"></div>
            </div>

            <div className="profile-gist-card__meta">
              <div className="profile-gist-card__author">
                <Avatar
                  size={32}
                  src={g.ownerAvatar}
                  style={{ 
                    flexShrink: 0,
                    backgroundColor: g.ownerAvatar ? 'transparent' : "#0b3f46",
                    color: "#ffffff", 
                    fontWeight: "600" 
                  }}
                  aria-label={`${g.owner} avatar`}
                >
                  {getInitials(g.owner || 'User')}
                </Avatar>
                <div className="profile-gist-card__author-info">
                  <div className="profile-gist-card__author-name" title={`${g.owner} / ${g.gistName}`}>
                    <span className="profile-gist-card__username">{g.owner}</span>
                    <span className="profile-gist-card__separator"> / </span>
                    <span className="profile-gist-card__gist-name">{g.gistName}</span>
                  </div>
                  <div className="profile-gist-card__details">
                    <span className="profile-gist-card__created">{g.createdAt}</span>
                  </div>
                  {g.description && (
                    <div className="profile-gist-card__description-line">
                      <span className="profile-gist-card__description" title={g.description}>
                        {g.description}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
