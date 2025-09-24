export function ProfileSidebar({
  name,
  username,
  githubUrl,
}: {
  name: string
  username: string
  githubUrl: string
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="profile-card">
      {/* Avatar with initials, no external image */}
      <div className="profile-card__avatar" aria-hidden="true">
        {initials}
      </div>

      <div className="profile-card__name" aria-label="Full name">
        {name}
      </div>

      <a
        className="profile-card__button"
        href={githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`View ${username}'s GitHub profile`}
      >
        View GitHub Profile
      </a>
    </div>
  )
}
