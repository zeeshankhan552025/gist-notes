import { Avatar, Button, Skeleton, Table } from "antd"
import type { ColumnsType } from "antd/es/table"
import { EditOutlined, EyeOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import type { GitHubGist } from "../../services/github-api"
import { formatUpdatedDate } from "../../utils/date-utils"
import { GistActions } from "../GistActions/GistActions"

type Row = {
  key: string
  name: string
  gistName: string
  description: string
  updated: string
  avatarUrl: string
  language: string
  gistUrl: string
  isPublic: boolean
}

interface ProfileGistsTableProps {
  gists: GitHubGist[]
  loading?: boolean
}

export function ProfileGistsTable({ gists, loading = false }: ProfileGistsTableProps) {
  const navigate = useNavigate();

  // Handle row click to navigate to detail page
  const handleRowClick = (record: Row) => {
    if (!loading && record.key && !record.key.startsWith('skeleton-')) {
      void navigate(`/gist/${record.key}`);
    }
  };


  // Convert GitHubGist to table row format
  const rows: Row[] = gists.map((gist) => {
    const fileName = Object.keys(gist.files)[0] ?? 'untitled'
    const file = Object.values(gist.files)[0]
    const language = file?.language ?? 'Text'
    
    return {
      key: gist.id,
      name: gist.owner.login,
      gistName: fileName,
      description: gist.description ?? 'No description',
      updated: gist.updated_at,
      avatarUrl: gist.owner.avatar_url,
      language,
      gistUrl: gist.html_url,
      isPublic: gist.public,
    }
  })

  // Generate skeleton rows for loading state
  const generateSkeletonRows = (): Row[] => {
    return Array.from({ length: 6 }, (_, index) => ({
      key: `skeleton-${index}`,
      name: '',
      gistName: '',
      description: '',
      updated: '',
      avatarUrl: '',
      language: '',
      gistUrl: '',
      isPublic: false,
    }))
  }

  const columns: ColumnsType<Row> = [
    {
      title: "Name",
      key: "name",
      width: 200,
      render: (_, record) => (
        <div className="gists-table__name">
          {loading && !record.name ? (
            <>
              <Skeleton.Avatar size={32} active />
              <Skeleton.Input style={{ width: 120, height: 16, marginLeft: 12 }} active />
            </>
          ) : (
            <>
              <Avatar 
                size={32} 
                src={record.avatarUrl}
                alt={`${record.name} avatar`}
              >
                {record.name ? record.name.charAt(0).toUpperCase() : 'U'}
              </Avatar>
              <span>{record.gistName}</span>
            </>
          )}
        </div>
      ),
    },
    {
      title: "Description",
      key: "description",
      render: (_, record) => (
        loading && !record.description ? (
          <Skeleton.Input style={{ width: 300, height: 16 }} active />
        ) : (
          <span className="gists-table__description">
            {record.description}
          </span>
        )
      ),
    },
    {
      title: "Language",
      key: "language",
      width: 100,
      render: (_, record) => (
        loading && !record.language ? (
          <Skeleton.Input style={{ width: 80, height: 16 }} active />
        ) : (
          <span className="gists-table__language">
            {record.language}
          </span>
        )
      ),
    },
    {
      title: "Visibility",
      key: "visibility",
      width: 100,
      render: (_, record) => (
        loading && !record.name ? (
          <Skeleton.Input style={{ width: 60, height: 16 }} active />
        ) : (
          <span className={`gists-table__visibility ${record.isPublic ? 'gists-table__visibility--public' : 'gists-table__visibility--private'}`}>
            {record.isPublic ? 'Public' : 'Private'}
          </span>
        )
      ),
    },
    {
      title: "Updated",
      key: "updated",
      width: 200,
      render: (_, record) => (
        loading && !record.updated ? (
          <Skeleton.Input style={{ width: 200, height: 16 }} active />
        ) : (
          <span className="gists-table__updated">
            {formatUpdatedDate(record.updated)}
          </span>
        )
      ),
    },
    {
      title: "",
      key: "actions",
      width: 200,
      render: (_, record) => (
        <div aria-label="Actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {loading && !record.name ? (
            <>
              <Skeleton.Button style={{ width: 32, height: 32, marginRight: 8 }} active />
              <Skeleton.Button style={{ width: 32, height: 32, marginRight: 8 }} active />
              <Skeleton.Button style={{ width: 60, height: 32 }} active />
            </>
          ) : (
            <>
              <Button 
                type="text" 
                icon={<EyeOutlined />} 
                aria-label="View gist"
                size="small"
                onClick={(e) => {
                  e.stopPropagation()
                  void navigate(`/gist/${record.key}`)
                }}
              />
              <Button 
                type="text" 
                icon={<EditOutlined />} 
                aria-label="Edit gist"
                size="small"
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(record.gistUrl, '_blank')
                }}
              />
              <GistActions 
                gistId={record.key} 
                size="small"
                onForkSuccess={(forkedGist) => {
                  void navigate(`/gist/${forkedGist.id}`)
                }}
              />
            </>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="gists-table" role="region" aria-label="Profile gists table">
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