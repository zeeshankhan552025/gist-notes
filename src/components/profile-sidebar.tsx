interface ProfileSidebarProps {
  name: string
  username: string
  githubUrl: string
  avatarUrl?: string | null
  bio?: string | null
  followers?: number
  following?: number
  publicRepos?: number
}

export function ProfileSidebar({
  name,
  username,
  githubUrl,
  avatarUrl,
  bio,
  followers = 0,
  following = 0,
  publicRepos = 0,
}: ProfileSidebarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="profile-card">
      {/* Avatar with actual image or initials fallback */}
      <div className="profile-card__avatar" aria-hidden="true">
        {avatarUrl ? (
          <img 
            src={avatarUrl} 
            alt={`${name}'s avatar`}
            onError={(e) => {
              console.log('Avatar image failed to load:', avatarUrl);
              // Hide the image and show initials instead
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.parentElement?.querySelector('.avatar-fallback');
              if (fallback) {
                (fallback as HTMLElement).style.display = 'block';
              }
            }}
            onLoad={() => {
              console.log('Avatar image loaded successfully:', avatarUrl);
            }}
          />
        ) : null}
        
        {/* Fallback initials */}
        <span 
          className="avatar-fallback"
          style={{ 
            display: avatarUrl ? 'none' : 'block'
          }}
        >
          {initials}
        </span>
      </div>

      <div className="profile-card__name" aria-label="Full name">
        {name}
      </div>

      <div className="profile-card__username" aria-label="Username">
        @{username}
      </div>

      {bio && (
        <div className="profile-card__bio" aria-label="Bio">
          {bio}
        </div>
      )}

      <div className="profile-card__stats">
        <div className="profile-card__stat">
          <span className="profile-card__stat-number">{followers}</span>
          <span className="profile-card__stat-label">Followers</span>
        </div>
        <div className="profile-card__stat">
          <span className="profile-card__stat-number">{following}</span>
          <span className="profile-card__stat-label">Following</span>
        </div>
        <div className="profile-card__stat">
          <span className="profile-card__stat-number">{publicRepos}</span>
          <span className="profile-card__stat-label">Repos</span>
        </div>
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
