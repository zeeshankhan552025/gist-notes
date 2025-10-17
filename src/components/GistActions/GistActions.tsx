import React from 'react'
import { Button, Space, message } from 'antd'
import { StarOutlined, StarFilled, ForkOutlined } from '@ant-design/icons'
import { 
  useIsGistStarred, 
  useStarGist, 
  useUnstarGist, 
  useForkGist 
} from '../../hooks/queries/useGists'
import { useAuthStore } from '../../stores'
import './gist-actions.scss'

interface GistActionsProps {
  gistId: string
  size?: 'small' | 'middle' | 'large'
  onForkSuccess?: (forkedGist: any) => void
}

export const GistActions: React.FC<GistActionsProps> = ({
  gistId,
  size = 'middle',
  onForkSuccess,
}) => {
  const { isAuthenticated } = useAuthStore()
  const { data: isStarred, isLoading: isCheckingStarred } = useIsGistStarred(gistId)
  const starMutation = useStarGist()
  const unstarMutation = useUnstarGist()
  const forkMutation = useForkGist()

  const handleStar = async () => {
    if (!isAuthenticated) {
      message.warning('Please login to star gists')
      return
    }

    try {
      if (isStarred) {
        await unstarMutation.mutateAsync(gistId)
        message.success('Gist unstarred successfully')
      } else {
        await starMutation.mutateAsync(gistId)
        message.success('Gist starred successfully')
      }
    } catch (error) {
      message.error(`Failed to ${isStarred ? 'unstar' : 'star'} gist`)
      console.error('Star/Unstar error:', error)
    }
  }

  const handleFork = async () => {
    if (!isAuthenticated) {
      message.warning('Please login to fork gists')
      return
    }

    try {
      const forkedGist = await forkMutation.mutateAsync(gistId)
      message.success('Gist forked successfully')
      onForkSuccess?.(forkedGist)
    } catch (error) {
      message.error('Failed to fork gist')
      console.error('Fork error:', error)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <Space className="gist-actions" size="small">
      <Button
        type="text"
        size={size}
        icon={isStarred ? <StarFilled /> : <StarOutlined />}
        loading={isCheckingStarred || starMutation.isPending || unstarMutation.isPending}
        onClick={handleStar}
        className={isStarred ? 'starred' : 'unstarred'}
      >
        {isStarred ? 'Starred' : 'Star'}
      </Button>
      
      <Button
        type="text"
        size={size}
        icon={<ForkOutlined />}
        loading={forkMutation.isPending}
        onClick={handleFork}
      >
        Fork
      </Button>
    </Space>
  )
}