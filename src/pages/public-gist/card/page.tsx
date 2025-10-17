"use client"
import { Pagination } from "antd"
import "antd/dist/reset.css"
import GistCard from "../../../components/GistCard/gist-card"
import { mockGistCards } from "../../../data/mock-data"
import "./public-gist-card-view.scss"
export default function PublicGistsCardsPage() {
  return (
    <>
      <main className="gists-cards" aria-label="Public Gists Card View">


        <section className="gists-cards__grid" aria-live="polite">
          {mockGistCards.map((g) => (
            <GistCard key={g.id} data={g} />
          ))}
        </section>

        <footer className="gists-cards__footer" aria-label="Pagination">
          <Pagination size="small" current={1} total={140} pageSize={10} />
        </footer>
      </main>
    </>
  )
}
