
import { ProfileGistList } from "../../components/profile-gist-list"
import { ProfileSidebar } from "../../components/profile-sidebar"
import "./profile.scss"

export default function ProfilePage() {
  // Mock profile + gists (replace with real data later)
  const profile = {
    name: "John Doe",
    username: "johndoe",
    githubUrl: "https://github.com/johndoe",
  }

  const gists = [
    {
      id: "1",
      fileName: "vercel_package.json",
      owner: "John Doe",
      gistName: "gist_name",
      description: "Gist Description",
      createdAt: "Created 7 hours ago",
      lines: [
        "{",
        '  "name": "vercel-monorepo",',
        '  "version": "0.0.0",',
        '  "private": true,',
        '  "license": "Apache-2.0",',
        '  "packageManager": "pnpm@8.3.1",',
        '  "dependencies": {',
        '    "nerno": "5.6.2"',
        "  },",
        '  "devDependencies": {',
        "  }",
        "}",
      ],
    },
    {
      id: "2",
      fileName: "index.ts",
      owner: "John Doe",
      gistName: "a very long gist name that will overflow if it reaches the end of the container…",
      description: "A very long gist description that will overflow this container…",
      createdAt: "Created 7 hours ago",
      lines: [
        "export function add(a: number, b: number) {",
        "  return a + b",
        "}",
        "",
        "export function mul(a: number, b: number) {",
        "  return a * b",
        "}",
      ],
    },
  ]

  return (
    <main className="profile-page" role="main" aria-label="Profile page">
      <div className="profile-page__container">
        <aside className="profile-page__sidebar" aria-label="User profile">
          <ProfileSidebar name={profile.name} username={profile.username} githubUrl={profile.githubUrl} />
        </aside>

        <section className="profile-page__content" aria-label="All gists">
          <header className="profile-page__header">
            <h1 className="profile-page__title">All Gists</h1>
            <span className="profile-page__count" aria-label="Gists count">
              5
            </span>
          </header>

          <ProfileGistList items={gists} />

          <footer className="profile-page__pagination" aria-label="Pagination">
            <button className="profile-page__pager-btn" aria-label="Previous page">
              {"<"}
            </button>
            <span className="profile-page__pager-page" aria-live="polite">
              1
            </span>
            <span className="profile-page__pager-of">of 14</span>
            <button className="profile-page__pager-btn" aria-label="Next page">
              {">"}
            </button>
          </footer>
        </section>
      </div>
    </main>
  )
}
