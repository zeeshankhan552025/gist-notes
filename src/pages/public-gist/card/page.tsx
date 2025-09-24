"use client"
import "antd/dist/reset.css"
import { Pagination, Tooltip, Button } from "antd"
import { AppstoreOutlined, UnorderedListOutlined } from "@ant-design/icons"
import "./public-gist-card-view.scss"
import type { GistCardData } from "../../../components/gist-card"
import GistCard from "../../../components/gist-card"

const mockGists: GistCardData[] = [
  {
    id: "1",
    authorName: "John Doe",
    gistName: "gist_name",
    description: "Gist Description",
    createdAt: "Created 7 hours ago",
    codeSnippet: `{
  "name": "vercel-monorepo",
  "version": "0.0.0",
  "private": true,
  "license": "Apache-2.0",
  "packageManager": "pnpm@8.3.1",
  "dependencies": {
    "next": "15.0.0"
  },
  "devDependencies": {
  }
}`,
  },
  {
    id: "2",
    authorName: "John Doe",
    gistName: "gist_name",
    description: "Gist Description",
    createdAt: "Created 7 hours ago",
    codeSnippet: `{
  "name": "vercel-monorepo",
  "version": "0.0.0",
  "private": true,
  "dependencies": {
    "react": "19.0.0",
    "react-dom": "19.0.0"
  }
}`,
  },
  {
    id: "3",
    authorName: "John Doe",
    gistName: "a very long gist name",
    description: "A very long gist description that will overflow",
    createdAt: "Created 7 hours ago",
    codeSnippet: `{
  "name": "vercel-monorepo",
  "version": "0.0.0",
  "private": true,
  "dependencies": {
    "next": "15.0.0"
  },
  "devDependencies": { }
}`,
  },
  {
    id: "4",
    authorName: "John Doe",
    gistName: "gist_name",
    description: "Gist Description",
    createdAt: "Created 7 hours ago",
    codeSnippet: `{
  "name": "vercel-monorepo",
  "license": "Apache-2.0",
  "dependencies": {
    "typescript": "5.6.2"
  }
}`,
  },
  {
    id: "5",
    authorName: "John Doe",
    gistName: "gist_name",
    description: "Gist Description",
    createdAt: "Created 7 hours ago",
    codeSnippet: `{
  "name": "vercel-monorepo",
  "dependencies": {
    "eslint": "^9.0.0"
  }
}`,
  },
  {
    id: "6",
    authorName: "John Doe",
    gistName: "gist_name",
    description: "Gist Description",
    createdAt: "Created 7 hours ago",
    codeSnippet: `{
  "name": "vercel-monorepo",
  "private": true
}`,
  },
]

export default function PublicGistsCardsPage() {
  return (
    <>
      <main className="gists-cards" aria-label="Public Gists Card View">


        <section className="gists-cards__grid" aria-live="polite">
          {mockGists.map((g) => (
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
