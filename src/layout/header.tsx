import { useState } from "react"
import { Input, Button, Avatar, Dropdown, message } from "antd"
import { SearchOutlined, UserOutlined, LogoutOutlined, SettingOutlined, GithubOutlined } from "@ant-design/icons"
import type { MenuProps } from "antd"
import { githubService } from "../services/github"
import "./header.scss"

interface HeaderProps {
  onSearchResult?: (gist: any) => void
}

export function Header({ onSearchResult }: HeaderProps) {
  // Mock user state - replace with actual auth state management
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [searching, setSearching] = useState(false)
  const user = { name: "John Doe", email: "john@example.com" }

  const handleGitHubLogin = () => {
    // GitHub OAuth login
    const clientId = process.env.REACT_APP_GITHUB_CLIENT_ID || 'your-github-client-id'
    const redirectUri = encodeURIComponent(window.location.origin + '/auth/callback')
    const scope = 'read:user,public_repo'
    
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`
    
    // Open GitHub OAuth in same window
    window.location.href = authUrl
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    localStorage.removeItem('github_token')
    message.success('Logged out successfully')
  }

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      message.warning('Please enter a Gist ID')
      return
    }

    try {
      setSearching(true)
      const gist = await githubService.searchGistById(searchValue.trim())
      
      if (gist) {
        message.success('Gist found!')
        onSearchResult?.(gist)
        // Optionally redirect to gist detail page
        window.open(gist.html_url, '_blank')
      } else {
        message.error('Gist not found')
      }
    } catch (error) {
      message.error('Error searching for gist')
      console.error('Search error:', error)
    } finally {
      setSearching(false)
    }
  }

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ]

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="topbar" role="banner">
      <div className="topbar__inner">
        {/* Left side - Brand */}
        <div className="topbar__brand" aria-label="Brand">
          <span aria-hidden="true">
            <img src="/logo.svg" alt="EMUMBA Logo" />
          </span>
          <span className="topbar__name">EMUMBA</span>
        </div>

        {/* Right side - Search and User actions */}
        <div className="topbar__right">
          <form className="topbar__search" role="search" aria-label="Search gists by ID">
            <Input
              allowClear
              placeholder="Enter Gist ID to search..."
              prefix={<SearchOutlined />}
              suffix={
                <Button 
                  type="text" 
                  size="small"
                  loading={searching}
                  onClick={handleSearch}
                >
                  Search
                </Button>
              }
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              className="topbar__search-input"
              type="search"
              aria-label="Search gists by ID"
            />
          </form>

          <div className="topbar__actions">
            {isLoggedIn ? (
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
                <div className="topbar__user-menu">
                  <Avatar 
                    size={32}
                    style={{ backgroundColor: '#1890ff', cursor: 'pointer' }}
                  >
                    {getUserInitials(user.name)}
                  </Avatar>
                </div>
              </Dropdown>
            ) : (
              <Button 
                type="primary" 
                className="topbar__login" 
                onClick={handleGitHubLogin}
                icon={<GithubOutlined />}
              >
                Login with GitHub
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
