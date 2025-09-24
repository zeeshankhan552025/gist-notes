
import { useState, useEffect } from "react"
import { Spin, message } from "antd"
import { useAuth } from "../../contexts/AuthContext"
import { ProfileGistList } from "../../components/profile-gist-list"
import { ProfileSidebar } from "../../components/profile-sidebar"
import { githubService } from "../../services/github"
import type { GitHubGist } from "../../services/github"
import "./profile.scss"

export default function ProfilePage() {
  const { userInfo, isAuthenticated, githubToken } = useAuth()
  const [gists, setGists] = useState<GitHubGist[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingContent, setLoadingContent] = useState(false)
  const [githubUserData, setGithubUserData] = useState<any>(null)
  const [gistContents, setGistContents] = useState<Record<string, string>>({})
  
  // Fetch individual gist content
  const fetchGistContent = async (gistId: string) => {
    if (gistContents[gistId]) return gistContents[gistId]
    
    try {
      const gist = await githubService.searchGistById(gistId)
      if (gist && gist.files) {
        const firstFile = Object.values(gist.files)[0]
        const content = firstFile?.content || 'No content available'
        setGistContents(prev => ({ ...prev, [gistId]: content }))
        return content
      }
    } catch (error) {
      console.error('Error fetching gist content:', error)
      return 'Error loading content'
    }
    return 'No content available'
  }
  
  // Fetch user's GitHub data and gists when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated || !githubToken) {
        setLoading(false)
        return
      }

      try {
        console.log('Starting data fetch...')
        console.log('Auth token available:', !!githubToken)
        
        // Fetch user's GitHub profile data
        const userData = await githubService.getAuthenticatedUser()
        console.log('GitHub User Data:', userData)
        setGithubUserData(userData)

        // Fetch user's gists
        const gistResponse = await githubService.fetchAuthenticatedUserGists(1)
        console.log('GitHub Gists Response:', gistResponse)
        console.log('Number of gists:', gistResponse.gists.length)
        setGists(gistResponse.gists)
        
        // Fetch content for each gist
        if (gistResponse.gists.length > 0) {
          console.log('Fetching individual gist content...')
          setLoadingContent(true)
          
          const contentPromises = gistResponse.gists.slice(0, 5).map(async (gist) => {
            try {
              const fullGist = await githubService.searchGistById(gist.id)
              if (fullGist && fullGist.files) {
                const firstFile = Object.values(fullGist.files)[0]
                return {
                  gistId: gist.id,
                  content: firstFile?.content || 'No content available'
                }
              }
            } catch (error) {
              console.error(`Error fetching content for gist ${gist.id}:`, error)
              return {
                gistId: gist.id,
                content: 'Error loading content'
              }
            }
            return { gistId: gist.id, content: 'No content available' }
          })
          
          const contents = await Promise.all(contentPromises)
          const contentMap: Record<string, string> = {}
          contents.forEach(({ gistId, content }) => {
            contentMap[gistId] = content
          })
          setGistContents(contentMap)
          setLoadingContent(false)
          console.log('Loaded gist contents:', contentMap)
        }
        
      } catch (error) {
        console.error('Error fetching user data:', error)
        console.error('Error details:', {
          message: (error as Error).message,
          stack: (error as Error).stack
        })
        message.error('Failed to load profile data: ' + (error as Error).message)
        
        // Set empty state so UI doesn't stay loading
        setGithubUserData({})
        setGists([])
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [isAuthenticated, githubToken])

  // Use real GitHub user data
  const profile = {
    name: githubUserData?.name || githubUserData?.login || userInfo?.displayName || "GitHub User",
    username: githubUserData?.login || "unknown", 
    githubUrl: githubUserData?.html_url || `https://github.com/${githubUserData?.login || 'unknown'}`,
    avatarUrl: githubUserData?.avatar_url || userInfo?.photoURL || null,
    bio: githubUserData?.bio || null,
    followers: githubUserData?.followers || 0,
    following: githubUserData?.following || 0,
    publicRepos: githubUserData?.public_repos || 0,
  }

  console.log('Profile object:', profile)

  // Helper function to transform GitHub gists to the format expected by ProfileGistList
  const transformGistsForDisplay = (gists: GitHubGist[]) => {
    return gists.map(gist => {
      const firstFile = Object.values(gist.files)[0]
      console.log('Processing gist:', gist.id, 'First file:', firstFile)
      
      // Use fetched content if available, otherwise try from API response
      let contentLines = ['// Loading content...']
      const fetchedContent = gistContents[gist.id]
      
      if (fetchedContent && fetchedContent !== 'No content available' && fetchedContent !== 'Error loading content') {
        contentLines = fetchedContent.split('\n').slice(0, 15)
      } else if (firstFile?.content) {
        contentLines = firstFile.content.split('\n').slice(0, 15)
      } else {
        // Show file info when content is not available
        contentLines = [
          `// ${firstFile?.filename || 'Unknown file'}`,
          `// File size: ${firstFile?.size || 0} bytes`,
          `// Language: ${firstFile?.language || 'Unknown'}`,
          '// Content loading...'
        ]
      }
      
      return {
        id: gist.id,
        fileName: firstFile?.filename || 'untitled',
        owner: profile.name || 'GitHub User',
        ownerAvatar: profile.avatarUrl,
        gistName: gist.description || `Gist ${gist.id.slice(0, 7)}`,
        description: gist.description || 'No description provided',
        createdAt: `Created ${new Date(gist.created_at).toLocaleDateString()}`,
        lines: contentLines,
        language: firstFile?.language?.toLowerCase() || undefined
      }
    })
  }

  if (loading) {
    return (
      <main className="profile-page" role="main" aria-label="Profile page">
        <div className="profile-page__container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Spin size="large" />
        </div>
      </main>
    )
  }

  if (!isAuthenticated) {
    return (
      <main className="profile-page" role="main" aria-label="Profile page">
        <div className="profile-page__container" style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Please log in to view your profile</h2>
        </div>
      </main>
    )
  }

  return (
    <main className="profile-page" role="main" aria-label="Profile page">
      <div className="profile-page__container">
        <aside className="profile-page__sidebar" aria-label="User profile">
          <ProfileSidebar 
            name={profile.name} 
            username={profile.username} 
            githubUrl={profile.githubUrl}
            avatarUrl={profile.avatarUrl}
            bio={profile.bio}
            followers={profile.followers}
            following={profile.following}
            publicRepos={profile.publicRepos}
          />
        </aside>

        <section className="profile-page__content" aria-label="All gists">
          <header className="profile-page__header">
            <h1 className="profile-page__title">All Gists</h1>
            <span className="profile-page__count" aria-label="Gists count">
              {gists.length}
            </span>
          </header>

          {gists.length > 0 ? (
            <>
              {loadingContent && (
                <div style={{ textAlign: 'center', padding: '1rem', color: '#666', fontStyle: 'italic' }}>
                  Loading gist content...
                </div>
              )}
              <ProfileGistList items={transformGistsForDisplay(gists)} />
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
              <p>No gists found. Create your first gist!</p>
            </div>
          )}

          {gists.length > 0 && (
            <footer className="profile-page__pagination" aria-label="Pagination">
              <button className="profile-page__pager-btn" aria-label="Previous page">
                {"<"}
              </button>
              <span className="profile-page__pager-page" aria-live="polite">
                1
              </span>
              <span className="profile-page__pager-of">of 1</span>
              <button className="profile-page__pager-btn" aria-label="Next page">
                {">"}
              </button>
            </footer>
          )}
        </section>
      </div>
    </main>
  )
}
