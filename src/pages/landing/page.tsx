import { useState, useEffect } from "react"
import { Button, Pagination, Spin, message } from "antd"
import { Header } from "../../layout/header"
import { PublicGistsTable } from "../../components/public-gists-table"
import { PublicGistsGrid } from "../../components/public-gists-grid"
import { githubService, type GitHubGist } from "../../services/github"
import "./landing.scss"

type ViewMode = 'list' | 'grid'

export default function LandingPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [gists, setGists] = useState<GitHubGist[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasNext, setHasNext] = useState(false)
  const [hasPrev, setHasPrev] = useState(false)

  const fetchGists = async (page: number) => {
    try {
      setLoading(true)
      const response = await githubService.fetchPublicGists(page)
      setGists(response.gists)
      setHasNext(response.hasNext)
      setHasPrev(response.hasPrev)
      setCurrentPage(response.currentPage)
    } catch (error) {
      message.error('Failed to fetch gists. Please try again.')
      console.error('Error fetching gists:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGists(1)
  }, [])

  const handlePageChange = (page: number) => {
    fetchGists(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode)
  }

  const handleRefresh = () => {
    fetchGists(currentPage)
  }

  return (
    <main className="landing">
      <Header />
      <div className="landing__container">
        <header className="landing__header">
          <div className="landing__header-left">
            <h1 className="landing__title">Discover Public Gists</h1>
            <p className="landing__subtitle">
              Explore and discover public code snippets from the GitHub community
            </p>
            <Button onClick={handleRefresh} loading={loading} size="small">
              Refresh
            </Button>
          </div>
          <div className="landing__view-switch" aria-label="View options">
            <button 
              className={`landing__icon-button ${viewMode === 'list' ? 'landing__icon-button--active' : ''}`}
              onClick={() => handleViewModeChange('list')}
              aria-label="List view"
              title="List view"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
              </svg>
            </button>
            <button 
              className={`landing__icon-button ${viewMode === 'grid' ? 'landing__icon-button--active' : ''}`}
              onClick={() => handleViewModeChange('grid')}
              aria-label="Grid view"
              title="Grid view"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 0h8v8h-8z" />
              </svg>
            </button>
          </div>
        </header>

        <div className="landing__content">
          {loading && gists.length === 0 ? (
            <div className="landing__loading">
              <Spin size="large" />
              <p>Loading public gists from GitHub...</p>
            </div>
          ) : (
            <>
              {viewMode === 'list' ? (
                <PublicGistsTable gists={gists} loading={loading} />
              ) : (
                <PublicGistsGrid gists={gists} loading={loading} />
              )}
            </>
          )}
        </div>

        {(hasNext || hasPrev || gists.length > 0) && (
          <div className="landing__pagination">
            <Pagination
              current={currentPage}
              pageSize={30}
              showSizeChanger={false}
              showQuickJumper={false}
              showTotal={() => `Page ${currentPage}`}
              onChange={handlePageChange}
              disabled={loading}
              showPrevNextJumpers={true}
              hideOnSinglePage={false}
              itemRender={(_, type, originalElement) => {
                if (type === 'prev') {
                  return <Button disabled={!hasPrev || loading}>Previous</Button>
                }
                if (type === 'next') {
                  return <Button disabled={!hasNext || loading}>Next</Button>
                }
                return originalElement
              }}
            />
          </div>
        )}
      </div>
    </main>
  )
}
