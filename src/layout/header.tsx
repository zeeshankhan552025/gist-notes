import { useState } from "react"
import { Input, Button, Avatar, Dropdown, message } from "antd"
import { SearchOutlined, UserOutlined, LogoutOutlined, SettingOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import type { MenuProps } from "antd"
import { githubService } from "../services/github"
import { useAuth } from "../contexts/AuthContext"
import "./header.scss"

interface HeaderProps {
  onSearchResult?: (gist: any) => void
}

export function Header({ onSearchResult }: HeaderProps) {
  const { isAuthenticated, userInfo, login, logout } = useAuth()
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState("")
  const [searching, setSearching] = useState(false)

  const handleGitHubLogin = async () => {
    try {
      await login()
      message.success('Successfully logged in with GitHub!')
    } catch (error) {
      console.error('Login failed:', error)
      message.error('Failed to login. Please try again.')
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      message.success('Logged out successfully')
    } catch (error) {
      console.error('Logout failed:', error)
      message.error('Failed to logout. Please try again.')
    }
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

  const handleMenuClick = (info: any) => {
    switch (info.key) {
      case 'profile':
        navigate('/profile')
        break
      case 'settings':
        // You can navigate to settings page when it's created
        message.info('Settings page coming soon!')
        break
      case 'logout':
        handleLogout()
        break
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
    },
  ]

  const getUserInitials = (name: string | null) => {
    if (!name) return "U"
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
        <div 
          className="topbar__brand" 
          aria-label="Brand"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
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
            {isAuthenticated ? (
              <>
                <Button 
                  type="default" 
                  onClick={() => navigate('/create-gist')}
                  style={{ marginRight: '12px' }}
                >
                  Create Gist
                </Button>
                <Dropdown 
                  menu={{ items: userMenuItems, onClick: handleMenuClick }} 
                  placement="bottomRight" 
                  arrow
                >
                <div className="topbar__user-menu">
                  <Avatar 
                    size={32}
                    style={{ backgroundColor: '#1890ff', cursor: 'pointer' }}
                    src={userInfo?.photoURL}
                  >
                    {!userInfo?.photoURL && getUserInitials(userInfo?.displayName || null)}
                  </Avatar>
                </div>
              </Dropdown>
              </>
            ) : (
              <Button 
                type="primary" 
                className="topbar__login" 
                onClick={handleGitHubLogin}
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
