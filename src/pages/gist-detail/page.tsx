import { GitFork, Star } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { message, Skeleton } from "antd"
import { Header } from "../../layout/header"
import { githubApiService, type GitHubGist } from "../../services/github-api"
import { formatSimpleCreatedDate } from "../../utils/date-utils"
import "./gist-detail.scss"
import GistEditor from "../../components/GistEditor/gist-editor"

export default function GistDetailPage() {
  const { gistId } = useParams<{ gistId: string }>()
  const navigate = useNavigate()
  const [gist, setGist] = useState<GitHubGist | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeFile, setActiveFile] = useState<string>('')

  useEffect(() => {
    const fetchGist = async () => {
      if (!gistId) {
        setError('Gist ID not found')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const gistData = await githubApiService.searchGistById(gistId)
        
        if (!gistData) {
          setError('Gist not found')
        } else {
          setGist(gistData)
          // Set the first file as active by default
          const firstFileName = Object.keys(gistData.files)[0]
          if (firstFileName) {
            setActiveFile(firstFileName)
          }
        }
      } catch {
        setError('Failed to load gist')
        message.error('Failed to load gist details')
      } finally {
        setLoading(false)
      }
    }

    void fetchGist()
  }, [gistId])

  // Helper function to get initials
  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/)
    const a = parts[0]?.[0] || ""
    const b = parts[1]?.[0] || ""
    return (a + b).toUpperCase()
  }



  // Loading state
  if (loading) {
    return (
      <main className="gist-detail" aria-labelledby="gist-heading">
        <header className="gist-detail__header">
          <div className="gist-detail__author">
            <Skeleton.Avatar size={48} className="gist-detail__avatar" />
            <div>
              <Skeleton.Input style={{ width: 300, height: 32, marginBottom: 8 }} active />
              <Skeleton.Input style={{ width: 200, height: 16, marginBottom: 8 }} active />
              <Skeleton.Input style={{ width: 400, height: 16 }} active />
            </div>
          </div>
          <div className="gist-detail__actions">
            <Skeleton.Button style={{ width: 80, height: 36, marginRight: 8 }} active />
            <Skeleton.Button style={{ width: 80, height: 36 }} active />
          </div>
        </header>
        <section className="gist-detail__file">
          <Skeleton.Input style={{ width: 200, height: 40, marginBottom: 16 }} active />
          <div className="gist-detail__editor">
            <Skeleton.Input style={{ width: '100%', height: 400 }} active />
          </div>
        </section>
      </main>
    )
  }

  // Error state
  if (error || !gist) {
    return (
      <main className="gist-detail" aria-labelledby="error-heading">
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <h1 id="error-heading" style={{ fontSize: '2rem', marginBottom: '1rem', color: '#ef4444' }}>
            {error ?? 'Gist not found'}
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#6b7280', marginBottom: '2rem' }}>
            The gist you're looking for doesn't exist or couldn't be loaded.
          </p>
          <button 
            onClick={() => void navigate('/')}
            style={{ 
              padding: '0.75rem 1.5rem', 
              fontSize: '1rem', 
              backgroundColor: '#0366d6', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Back to Gists
          </button>
        </div>
      </main>
    )
  }

  // Get all files and the currently active file
  const {files} = gist
  const fileNames = Object.keys(files)
  
  // Debug logging
  console.log('Gist files:', files)
  console.log('File names:', fileNames)
  console.log('Active file:', activeFile)
  
  const currentFile = activeFile && files[activeFile] ? files[activeFile] : null
  const fileName = currentFile?.filename ?? 'untitled'
  const fileContent = currentFile?.content ?? '// File content not available'
  const language = (() => {
    const lang = currentFile?.language?.toLowerCase() ?? 'text'
    // Map to supported languages or return undefined for auto-detection
    const supportedLanguages = ['json', 'javascript', 'typescript', 'markdown']
    return supportedLanguages.includes(lang) ? lang as 'json' | 'javascript' | 'typescript' | 'markdown' : undefined
  })()

  return (
    <>
      <Header />
      <main className="gist-detail" aria-labelledby="gist-heading">
        <header className="gist-detail__header">
          <div className="gist-detail__author">
            <div className="gist-detail__avatar" aria-hidden>
              {gist.owner.avatar_url ? (
                <img src={gist.owner.avatar_url} alt={`${gist.owner.login} avatar`} />
              ) : (
                getInitials(gist.owner.login)
              )}
            </div>
            <div>
              <h1 id="gist-heading" className="gist-detail__title">
                <span className="gist-detail__name">{gist.owner.login}</span>
                <span className="gist-detail__sep">/</span>
                <span className="gist-detail__gist">{fileName}</span>
              </h1>
              <div className="gist-detail__meta">{formatSimpleCreatedDate(gist.created_at)}</div>
              <p className="gist-detail__desc">{gist.description ?? 'No description provided'}</p>
            </div>
          </div>

          <div className="gist-detail__actions" aria-label="Gist actions">
            <button 
              className="btn" 
              aria-label="Fork gist"
              onClick={() => window.open(gist.git_pull_url, '_blank')}
            >
              <span className="btn__icon" aria-hidden>
                <GitFork size={16} />
              </span>
              Fork
              <span className="btn__count" aria-label="Fork count">
                {gist.comments || 0}
              </span>
            </button>
            <button 
              className="btn" 
              aria-label="Star gist"
              onClick={() => window.open(gist.html_url, '_blank')}
            >
              <span className="btn__icon" aria-hidden>
                <Star size={16} />
              </span>
              Star
              <span className="btn__count" aria-label="Star count">
                {gist.comments || 0}
              </span>
            </button>
          </div>
        </header>

        <section className="gist-detail__file" aria-label="Gist files">
          <div className="gist-detail__filetabs" role="tablist">
            {fileNames.map((filename) => (
              <button
                key={filename}
                className={`gist-detail__filetab ${activeFile === filename ? 'gist-detail__filetab--active' : ''}`}
                role="tab"
                aria-selected={activeFile === filename}
                onClick={() => setActiveFile(filename)}
              >
                {filename}
              </button>
            ))}
          </div>
          <div className="gist-detail__editor">
            <GistEditor value={fileContent} language={language} readOnly height={520} />
          </div>
        </section>
      </main>
    </>
  )
}
