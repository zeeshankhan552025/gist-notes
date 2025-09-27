import { useState, useEffect } from "react"
import { message } from "antd"
import { Header } from "../../layout/header"
import { PublicGistsTable } from "../../components/public-gists-table"
import { PublicGistsGrid } from "../../components/public-gists-grid"
import { Pagination } from "../../components/pagination"
import { githubService, type GitHubGist } from "../../services/github"
import "./landing.scss"

type ViewMode = 'list' | 'grid'

export default function LandingPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [gists, setGists] = useState<GitHubGist[]>([])
  const [searchResult, setSearchResult] = useState<GitHubGist | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasNext, setHasNext] = useState(false)
  const [hasPrev, setHasPrev] = useState(false)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

  const [searchResults, setSearchResults] = useState<GitHubGist[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  const fetchGists = async (page: number) => {
    try {
      setLoading(true)
      const response = await githubService.fetchPublicGists(page)
      setGists(response.gists)
      setHasNext(response.hasNext)
      setHasPrev(response.hasPrev)
      setCurrentPage(response.currentPage)
      
      // Estimate total pages based on current data
      // Since we don't know exact total, we'll show at least current + 1 if hasNext
      setTotalPages(response.hasNext ? page + 1 : page)
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

  const handleSearchResult = (result: any) => {
    console.log('📄 Landing page received search result:', result)
    
    if (result.cleared) {
      // Search input was cleared, reset all search state
      console.log('📄 Search cleared, resetting state')
      setSearchResult(null)
      setSearchResults([])
      setHasSearched(false)
      return
    }
    
    setHasSearched(true) // Mark that a search was performed
    
    if (result.multiple && result.results) {
      // Multiple results from content search (including empty results)
      console.log('📄 Setting multiple search results:', result.results.length)
      setSearchResults(result.results)
      setSearchResult(null)
    } else if (result && !result.multiple) {
      // Single result from ID search
      console.log('📄 Setting single search result:', result.id)
      setSearchResult(result)
      setSearchResults([])
    } else {
      // No results or invalid result
      console.log('📄 No valid results received')
      setSearchResult(null)
      setSearchResults([])
    }
  }

  const clearSearch = () => {
    console.log('📄 Clearing search results')
    setSearchResult(null)
    setSearchResults([])
    setHasSearched(false) // Reset search state
  }

  const handlePageChange = (page: number) => {
    fetchGists(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode)
  }

  return (
    <main className="landing">
      <Header onSearchResult={handleSearchResult} />
      
      <div className="landing__container">
        <header className="landing__header">
          <div className="landing__header-left">
            <h1 className="landing__title">Public Gists</h1>
          </div>
          <div className="landing__view-switch" aria-label="View options">
            <button 
              className={`landing__icon-button ${viewMode === 'grid' ? 'landing__icon-button--active' : ''}`}
              onClick={() => handleViewModeChange('grid')}
              aria-label="Grid view"
              title="Grid view"
            >
            <img src="/public/card.svg" alt="" />
    
            </button>

            <button 
              className={`landing__icon-button ${viewMode === 'list' ? 'landing__icon-button--active' : ''}`}
              onClick={() => handleViewModeChange('list')}
              aria-label="List view"
              title="List view"
            >
              <img src="/public/list.svg" alt="" />
            </button>
           
          </div>
        </header>

        <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {(searchResult || searchResults.length > 0 || hasSearched) ? (
            <>
              <div style={{ fontWeight: 600 }}>
                {searchResult ? 'Search result' : 
                 searchResults.length > 0 ? `Found ${searchResults.length} gists` : 
                 'No gists found'}
              </div>
              <button className="btn" onClick={clearSearch}>Clear</button>
            </>
          ) : null}
        </div>

        <div className="landing__content">
          {hasSearched && !searchResult && searchResults.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
              <p>No gists found for your search. Try different terms or check the spelling.</p>
            </div>
          ) : viewMode === 'list' ? (
            <PublicGistsTable 
              gists={searchResult ? [searchResult] : (searchResults.length > 0 ? searchResults : gists)} 
              loading={loading} 
            />
          ) : (
            <PublicGistsGrid 
              gists={searchResult ? [searchResult] : (searchResults.length > 0 ? searchResults : gists)} 
              loading={loading} 
            />
          )}
        </div>

        {!searchResult && searchResults.length === 0 && !hasSearched && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            hasNext={hasNext}
            hasPrev={hasPrev}
            onPageChange={handlePageChange}
            loading={loading}
          />
        )}
      </div>
    </main>
  )
}
