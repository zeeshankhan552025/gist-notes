
import { useState, useEffect } from "react"
import { Spin, message } from "antd"
import { Header } from "../../layout/header"
import { useAuth } from "../../contexts/AuthContext"
import { ProfileGistList } from "../../components/profile-gist-list"
import { ProfileSidebar } from "../../components/profile-sidebar"
import { Pagination } from "../../components/pagination"
import { githubApiService } from "../../services/github-api"
import type { GitHubGist } from "../../services/github-api"
import "./profile.scss"


export default function ProfilePage() {
  const { userInfo, isAuthenticated, githubToken } = useAuth()
  const [gists, setGists] = useState<GitHubGist[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingContent, setLoadingContent] = useState(false)
  const [githubUserData, setGithubUserData] = useState<any>(null)
  const [gistContents, setGistContents] = useState<Record<string, string>>({})
  const [searchResult, setSearchResult] = useState<GitHubGist | null>(null)
  const [searchResults, setSearchResults] = useState<GitHubGist[]>([])
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [hasNext, setHasNext] = useState(false)
  const [hasPrev, setHasPrev] = useState(false)
  const [totalPages, setTotalPages] = useState(1)
  
  // Fetch user's gists with pagination
  const fetchGists = async (page: number = 1) => {
    if (!isAuthenticated || !githubToken) {
      return
    }

    try {
      setLoadingContent(true)
      const gistResponse = await githubApiService.fetchAuthenticatedUserGists(page)
      
      setGists(gistResponse.gists)
      setCurrentPage(gistResponse.currentPage)
      setHasNext(gistResponse.hasNext)
      setHasPrev(gistResponse.hasPrev)
      // For GitHub API pagination, we don't know total pages ahead of time
      // Set a reasonable estimate to ensure pagination shows when there are more pages
      setTotalPages(gistResponse.hasNext ? Math.max(page + 1, 2) : Math.max(page, 1))
      
      // Fetch content for each gist
      if (gistResponse.gists.length > 0) {
        const contentPromises = gistResponse.gists.slice(0, 5).map(async (gist) => {
          try {
            const fullGist = await githubApiService.searchGistById(gist.id)
            if (fullGist && fullGist.files) {
              const firstFile = Object.values(fullGist.files)[0]
              return {
                gistId: gist.id,
                content: firstFile?.content || 'No content available'
              }
            }
          } catch (error: unknown) {
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
      }
      
    } catch (error: unknown) {
      message.error('Failed to load gists.')
    } finally {
      setLoadingContent(false)
    }
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    fetchGists(page)
  }
  
  const handleSearchResult = (result: any) => {
    if (result.multiple && result.results) {
      // Multiple results from content search
      setSearchResults(result.results)
      setSearchResult(null)
    } else {
      // Single result from ID search
      setSearchResult(result)
      setSearchResults([])
    }
  }

  const clearSearch = () => {
    setSearchResult(null)
    setSearchResults([])
  }
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated || !githubToken) {
        setLoading(false)
        return
      }

      try {
        // Fetch user's GitHub profile data
        const userData = await githubApiService.getAuthenticatedUser()
        setGithubUserData(userData)

        // Fetch initial page of gists
        await fetchGists(1)
        
      } catch (error: unknown) {
        message.error('Failed to load profile data')
        
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

  // Helper function to transform GitHub gists to the format expected by ProfileGistList
  const transformGistsForDisplay = (gists: GitHubGist[]) => {
    return gists.map(gist => {
      const firstFile = Object.values(gist.files)[0]
      
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
        description: gist.description ? `${gist.description}` : 'No description provided',
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
    <>
      <Header onSearchResult={handleSearchResult} />
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
            <div className="profile-page__header-left">
              <h1 className="profile-page__title">All Gists</h1>
              <span className="profile-page__count" aria-label="Gists count">
                {gists.length}
              </span>
            </div>
          </header>

          {searchResult || searchResults.length > 0 ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ fontWeight: 600 }}>
                  {searchResult ? 'Search result' : `Found ${searchResults.length} gists`}
                </div>
                <button className="btn" onClick={clearSearch}>Clear</button>
              </div>
              {(
                <ProfileGistList items={transformGistsForDisplay(searchResult ? [searchResult] : searchResults)} />
              )}
            </>
          ) : gists.length > 0 ? (
            <>
              {loadingContent && (
                <div style={{ textAlign: 'center', padding: '1rem', color: '#666', fontStyle: 'italic' }}>
                  Loading gist content...
                </div>
              )}
              {(
                <ProfileGistList items={transformGistsForDisplay(gists)} />
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
              <p>No gists found. Create your first gist!</p>
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            hasNext={hasNext}
            hasPrev={hasPrev}
            onPageChange={handlePageChange}
            loading={loadingContent}
          />
        </section>
      </div>
    </main>
    </>
  )
}
