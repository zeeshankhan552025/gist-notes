import { GitFork, Star } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { message, Skeleton } from "antd"
import { Header } from "../../layout/header"
import { githubApiService, type GitHubGist } from "../../services/github-api"
import { formatSimpleCreatedDate } from "../../utils/date-utils"
import { useAuthStore } from "../../stores/authStore"
import "./gist-detail.scss"
import GistEditor from "../../components/GistEditor/gist-editor"

export default function GistDetailPage() {
  const { gistId } = useParams<{ gistId: string }>()
  const navigate = useNavigate()
  const { githubUserData, isAuthenticated } = useAuthStore()
  const [gist, setGist] = useState<GitHubGist | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeFile, setActiveFile] = useState<string>('')
  const [isStarred, setIsStarred] = useState(false)
  const [starLoading, setStarLoading] = useState(false)
  const [forkLoading, setForkLoading] = useState(false)
  const [starCount, setStarCount] = useState(0)
  const [forkCount, setForkCount] = useState(0)

  // Check if current user owns this gist
  const isOwner = Boolean(
    gist && 
    isAuthenticated && 
    githubUserData && 
    gist.owner.login === githubUserData.login
  )

  // Debug logging
  useEffect(() => {
    if (gist && githubUserData) {
      console.log('Gist owner:', gist.owner.login)
      console.log('Current user:', githubUserData.login)
      console.log('Is authenticated:', isAuthenticated)
      console.log('Is owner:', isOwner)
    }
  }, [gist, githubUserData, isAuthenticated, isOwner])

  // Handle star gist
  const handleStarGist = async () => {
    if (!gist) return
    
    // Check if user owns the gist
    if (isOwner) {
      message.info('You cannot star your own gist')
      return
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
      message.error('Please log in to star gists')
      return
    }
    
    setStarLoading(true)
    try {
      await githubApiService.starGist(gist.id)
      setIsStarred(true)
      setStarCount(prev => prev + 1)
      message.success('Gist starred successfully!')
      
      // Optionally refresh gist data but keep counts as managed locally
      try {
        await githubApiService.getGistById(gist.id)
        // Don't update counts from server - keep them as user-managed
      } catch (error) {
        // Could not refresh gist data
      }
    } catch (error) {
      console.error('Failed to star gist:', error)
      
      // Show specific error message based on error type
      const errorMessage = error instanceof Error ? error.message : 'Failed to star gist'
      if (errorMessage.includes('own gist')) {
        message.error('You cannot star your own gist')
      } else if (errorMessage.includes('authentication') || errorMessage.includes('401')) {
        message.error('Please log in to star gists')
      } else {
        message.error('Failed to star gist. Please try again.')
      }
      
      setStarCount(prev => Math.max(0, prev - 1)) // Revert optimistic update
    } finally {
      setStarLoading(false)
    }
  }

  // Handle fork gist
  const handleForkGist = async () => {
    if (!gist) return
    
    // Check if user owns the gist
    if (isOwner) {
      message.info('You cannot fork your own gist')
      return
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
      message.error('Please log in to fork gists')
      return
    }
    
    setForkLoading(true)
    try {
      const forkedGist = await githubApiService.forkGist(gist.id)
      setForkCount(prev => prev + 1)
      message.success('Gist forked successfully!')
      
      // Optionally refresh gist data but keep counts as managed locally
      try {
        await githubApiService.getGistById(gist.id)
        // Don't update counts from server - keep them as user-managed
      } catch (error) {
        // Could not refresh gist data
      }
      
      // Navigate to the forked gist
      void navigate(`/gist/${forkedGist.id}`)
    } catch (error) {
      console.error('Failed to fork gist:', error)
      
      // Show specific error message based on error type
      const errorMessage = error instanceof Error ? error.message : 'Failed to fork gist'
      if (errorMessage.includes('own gist')) {
        message.error('You cannot fork your own gist')
      } else if (errorMessage.includes('authentication') || errorMessage.includes('401')) {
        message.error('Please log in to fork gists')
      } else {
        message.error('Failed to fork gist. Please try again.')
      }
      
      setForkCount(prev => Math.max(0, prev - 1)) // Revert optimistic update
    } finally {
      setForkLoading(false)
    }
  }

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
          
          // Initialize counts to 0 for detail page
          setStarCount(0)
          setForkCount(0)
          
          // Check if gist is starred
          try {
            const starred = await githubApiService.isGistStarred(gistId)
            setIsStarred(starred)
          } catch (error) {
            // Could not check star status - non-critical error, continue without star status
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
              disabled={forkLoading || isOwner || !isAuthenticated}
              onClick={handleForkGist}
              title={
                !isAuthenticated 
                  ? "Please log in to fork gists"
                  : isOwner 
                    ? "You cannot fork your own gist" 
                    : "Fork this gist"
              }
            >
              <span className="btn__icon" aria-hidden>
                <GitFork size={16} />
              </span>
              {forkLoading ? 'Forking...' : 'Fork'}
              <span className="btn__count" aria-label="Fork count">
                {forkCount}
              </span>
            </button>
            <button 
              className="btn" 
              aria-label="Star gist"
              disabled={starLoading || isOwner || !isAuthenticated}
              onClick={handleStarGist}
              title={
                !isAuthenticated 
                  ? "Please log in to star gists"
                  : isOwner 
                    ? "You cannot star your own gist" 
                    : "Star this gist"
              }
              style={{ 
                backgroundColor: isStarred ? '#faad14' : undefined,
                color: isStarred ? 'white' : undefined
              }}
            >
              <span className="btn__icon" aria-hidden>
                <Star size={16} fill={isStarred ? 'currentColor' : 'none'} />
              </span>
              {starLoading ? 'Starring...' : (isStarred ? 'Starred' : 'Star')}
              <span className="btn__count" aria-label="Star count">
                {starCount}
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
