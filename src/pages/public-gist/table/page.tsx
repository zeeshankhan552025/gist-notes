import { Header } from "../../../layout/header"
import CreateGistPage from "../../create-gist/page"
import GistDetailPage from "../../gist-detail/page"
import ProfilePage from "../../profile/page"
import PublicGistsCardsPage from "../card/page"
import "./public-gist-table-view.scss"

export default function PublicGistsPage() {
  return (
    <main className="gists">
      <Header />
      <section className="gists__container">
        <header className="gists__header">
          <h1 className="gists__title">Public Gists</h1>
          <div className="gists__view-switch" aria-label="View options">
            <button className="gists__icon-button" aria-label="List view">
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
              </svg>
            </button>
            <button className="gists__icon-button" aria-label="Grid view">
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 0h8v8h-8z" />
              </svg>
            </button>
          </div>
        </header>

      <ProfilePage />
      </section>
    </main>
  )
}
