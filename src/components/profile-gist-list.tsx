import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'

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
    return languageMap[extension || ''] || 'text'
  }

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
            <SyntaxHighlighter
              language={g.language || getLanguageFromFilename(g.fileName)}
              style={oneLight}
              showLineNumbers={true}
              customStyle={{
                margin: 0,
                padding: '12px',
                fontSize: '13px',
                lineHeight: '1.4',
                backgroundColor: '#fafafa',
                border: 'none'
              }}
              lineNumberStyle={{
                minWidth: '2.5em',
                paddingRight: '1em',
                color: '#999',
                fontSize: '12px'
              }}
            >
              {g.lines.join('\n')}
            </SyntaxHighlighter>
          </div>

          <div className="gist-list__meta">
            <div className="gist-list__meta-left">
              <div className="gist-list__avatar" aria-hidden="true">
                {g.ownerAvatar ? (
                  <img 
                    src={g.ownerAvatar} 
                    alt={`${g.owner}'s avatar`}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  getInitials(g.owner || 'User')
                )}
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
