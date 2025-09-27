import { Avatar, Button, Table, Skeleton } from "antd"
import type { ColumnsType } from "antd/es/table"
import { ForkOutlined, StarOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import type { GitHubGist } from "../services/github-api"

import "../pages/public-gist/table/public-gist-table-view.scss"

type Row = {
  key: string
  name: string
  gistName: string
  description: string
  updated: string
  avatarUrl: string
  language: string
  gistUrl: string
}

interface PublicGistsTableProps {
  gists: GitHubGist[]
  loading?: boolean
}

export function PublicGistsTable({ gists, loading = false }: PublicGistsTableProps) {
  const navigate = useNavigate();

  // Handle row click to navigate to detail page
  const handleRowClick = (record: Row) => {
    if (!loading && record.key && !record.key.startsWith('skeleton-')) {
      navigate(`/gist/${record.key}`);
    }
  };
  // Helper function to format relative dates
  const formatRelativeDate = (dateString: string): string => {
    const now = new Date();
    const updatedDate = new Date(dateString);
    const diffInMs = now.getTime() - updatedDate.getTime();
    
    const minutes = Math.floor(diffInMs / (1000 * 60));
    const hours = Math.floor(diffInMs / (1000 * 60 * 60));
    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const months = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 30));
    const years = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 365));
    
    if (minutes < 60) {
      return minutes <= 1 ? 'Last updated a few minutes ago' : `Last updated ${minutes} minutes ago`;
    } else if (hours < 24) {
      return hours === 1 ? 'Last updated an hour ago' : `Last updated ${hours} hours ago`;
    } else if (days < 30) {
      return days === 1 ? 'Last updated a day ago' : `Last updated ${days} days ago`;
    } else if (months < 12) {
      return months === 1 ? 'Last updated a month ago' : `Last updated ${months} months ago`;
    } else {
      return years === 1 ? 'Last updated a year ago' : `Last updated ${years} years ago`;
    }
  };

  // Generate skeleton rows for loading state
  const generateSkeletonRows = (count: number = 5): Row[] => {
    return Array.from({ length: count }, (_, index) => ({
      key: `skeleton-${index}`,
      name: '',
      gistName: '',
      description: '',
      updated: '',
      avatarUrl: '',
      language: '',
      gistUrl: ''
    }));
  };

  // Convert GitHub gists to table rows
  const rows: Row[] = gists.map((gist) => {
    const firstFile = Object.values(gist.files)[0]
    return {
      key: gist.id,
      name: gist.owner.login,
      gistName: Object.keys(gist.files)[0] || 'untitled',
      description: gist.description || 'No description',
      updated: gist.updated_at, // Keep original ISO string for relative formatting
      avatarUrl: gist.owner.avatar_url,
      language: firstFile?.language || 'Text',
      gistUrl: gist.html_url
    }
  })

  const columns: ColumnsType<Row> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_: unknown, r) => (
        <div className="gists-table__user">
          {loading && !r.name ? (
            <>
              <Skeleton.Avatar size={32} active />
              <Skeleton.Input style={{ width: 100, height: 16, marginLeft: 8 }} active />
            </>
          ) : (
            <>
              <Avatar 
                size={32} 
                src={r.avatarUrl} 
                className="gists-table__avatar"
                style={{ flexShrink: 0 }}
              />
              <span className="gists-table__user-name">{r.name}</span>
            </>
          )}
        </div>
      ),
    },
    {
      title: "Notebook Name",
      dataIndex: "gistName",
      key: "gistName",
      render: (text: string) => (
        loading && !text ? (
          <Skeleton.Input style={{ width: 150, height: 16 }} active />
        ) : (
          <span className="gists-table__gist-name">
            {text}
          </span>
        )
      ),
    },
    {
      title: "Keyword",
      dataIndex: "description",
      key: "description",
      render: (text: string) => {
        if (loading && !text) {
          return <Skeleton.Button style={{ width: 80, height: 24, borderRadius: 20 }} active />;
        }
        // Extract first word as keyword
        const keyword = text.split(' ')[0] || 'general';
        return (
          <span className="gists-table__keyword-badge">
            {keyword}
          </span>
        );
      },
    },
    {
      title: "Updated",
      dataIndex: "updated",
      key: "updated",
      render: (dateString: string) => (
        loading && !dateString ? (
          <Skeleton.Input style={{ width: 200, height: 16 }} active />
        ) : (
          <span className="gists-table__updated">
            {formatRelativeDate(dateString)}
          </span>
        )
      ),
    },
    {
      title: "",
      key: "actions",
      width: 96,
      render: (_, record) => (
        <div aria-label="Actions">
          {loading && !record.name ? (
            <>
              <Skeleton.Button style={{ width: 32, height: 32, marginRight: 8 }} active />
              <Skeleton.Button style={{ width: 32, height: 32 }} active />
            </>
          ) : (
            <>
              <Button 
                type="text" 
                icon={<ForkOutlined />} 
                aria-label="View gist"
                onClick={() => window.open(record.gistUrl, '_blank')}
              />
              <Button 
                type="text" 
                icon={<StarOutlined />} 
                aria-label="Star gist"
                onClick={() => window.open(record.gistUrl, '_blank')}
              />
            </>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="gists-table" role="region" aria-label="Public gists table">
      <div className="gists-table__antd">
        <Table<Row> 
          columns={columns} 
          dataSource={loading && gists.length === 0 ? generateSkeletonRows() : rows} 
          pagination={false} 
          rowKey="key"
          loading={false} // We handle loading with skeletons
          scroll={{ x: 800 }}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
            style: { cursor: loading ? 'default' : 'pointer' }
          })}
        />
      </div>
    </div>
  )
}