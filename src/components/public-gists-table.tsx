import { Avatar, Button, Table } from "antd"
import type { ColumnsType } from "antd/es/table"
import { ForkOutlined, StarOutlined } from "@ant-design/icons"
import type { GitHubGist } from "../services/github"

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
  // Convert GitHub gists to table rows
  const rows: Row[] = gists.map((gist) => {
    const firstFile = Object.values(gist.files)[0]
    return {
      key: gist.id,
      name: gist.owner.login,
      gistName: Object.keys(gist.files)[0] || 'untitled',
      description: gist.description || 'No description',
      updated: new Date(gist.updated_at).toLocaleDateString(),
      avatarUrl: gist.owner.avatar_url,
      language: firstFile?.language || 'Text',
      gistUrl: gist.html_url
    }
  })

  const columns: ColumnsType<Row> = [
    {
      title: "User",
      dataIndex: "name",
      key: "name",
      render: (_: unknown, r) => (
        <span className="gists-table__user">
          <Avatar size={28} src={r.avatarUrl} />
          <span className="gists-table__user-name">{r.name}</span>
        </span>
      ),
    },
    {
      title: "Gist Name",
      dataIndex: "gistName",
      key: "gistName",
      render: (text: string, record) => (
        <a 
          href={record.gistUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="gists-table__gist-name"
        >
          {text}
        </a>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text: string) => (
        <span className="gists-table__description" title={text}>
          {text.length > 50 ? `${text.substring(0, 50)}...` : text}
        </span>
      ),
    },
    {
      title: "Language",
      dataIndex: "language",
      key: "language",
      render: (text: string) => <span className="gists-table__badge">{text}</span>,
    },
    {
      title: "Updated",
      dataIndex: "updated",
      key: "updated",
      render: (text: string) => <span className="gists-table__updated">{text}</span>,
    },
    {
      title: "",
      key: "actions",
      width: 96,
      render: (_, record) => (
        <div aria-label="Actions">
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
        </div>
      ),
    },
  ]

  return (
    <div className="gists-table" role="region" aria-label="Public gists table">
      <div className="gists-table__antd">
        <Table<Row> 
          columns={columns} 
          dataSource={rows} 
          pagination={false} 
          rowKey="key"
          loading={loading}
          scroll={{ x: 800 }}
        />
      </div>
    </div>
  )
}