import { Avatar, Button, Skeleton, Table, message } from "antd"
import type { ColumnsType } from "antd/es/table"
import { ForkOutlined, StarOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import type { GitHubGist } from "../../services/github-api"
import { githubApiService } from "../../services/github-api"
import { formatUpdatedDate } from "../../utils/date-utils"

import "../../pages/public-gist/table/public-gist-table-view.scss"

type Row = {
  key: string
  name: string
  gistName: string
  description: string
  updated: string
  avatarUrl: string
  language: string
  gistUrl: string
  starCount: number
  forkCount: number
}

interface PublicGistsTableProps {
  gists: GitHubGist[]
  loading?: boolean
}

export function PublicGistsTable({ gists, loading = false }: PublicGistsTableProps) {
  const navigate = useNavigate();
  const [starredGists, setStarredGists] = useState<Set<string>>(new Set());
  const [loadingActions, setLoadingActions] = useState<Set<string>>(new Set());
  const [rowData, setRowData] = useState<Row[]>([]);

  // Update row data when gists change
  useEffect(() => {
    const updatedRows: Row[] = gists.map((gist) => {
      const firstFile = Object.values(gist.files)[0]
      return {
        key: gist.id,
        name: gist.owner.login,
        gistName: Object.keys(gist.files)[0] ?? 'untitled',
        description: gist.description ?? 'No description',
        updated: gist.updated_at,
        avatarUrl: gist.owner.avatar_url,
        language: firstFile?.language ?? 'Text',
        gistUrl: gist.html_url,
        starCount: gist.stargazers_count || 0,
        forkCount: gist.forks || 0
      }
    });
    setRowData(updatedRows);
  }, [gists]);

  // Handle star gist with optimistic updates
  const handleStarGist = async (gistId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLoadingActions(prev => new Set(prev).add(`star-${gistId}`));
    
    // Optimistic update
    setRowData(prev => prev.map(row => 
      row.key === gistId 
        ? { ...row, starCount: row.starCount + 1 }
        : row
    ));
    
    try {
      await githubApiService.starGist(gistId);
      setStarredGists(prev => new Set(prev).add(gistId));
      message.success('Gist starred successfully!');
    } catch (error) {
      // Revert optimistic update on error
      setRowData(prev => prev.map(row => 
        row.key === gistId 
          ? { ...row, starCount: Math.max(0, row.starCount - 1) }
          : row
      ));
      console.error('Failed to star gist:', error);
      message.error('Failed to star gist. Please try again.');
    } finally {
      setLoadingActions(prev => {
        const newSet = new Set(prev);
        newSet.delete(`star-${gistId}`);
        return newSet;
      });
    }
  };

  // Handle fork gist with optimistic updates
  const handleForkGist = async (gistId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLoadingActions(prev => new Set(prev).add(`fork-${gistId}`));
    
    // Optimistic update
    setRowData(prev => prev.map(row => 
      row.key === gistId 
        ? { ...row, forkCount: row.forkCount + 1 }
        : row
    ));
    
    try {
      const forkedGist = await githubApiService.forkGist(gistId);
      message.success('Gist forked successfully!');
      // Optionally navigate to the forked gist
      void navigate(`/gist/${forkedGist.id}`);
    } catch (error) {
      // Revert optimistic update on error
      setRowData(prev => prev.map(row => 
        row.key === gistId 
          ? { ...row, forkCount: Math.max(0, row.forkCount - 1) }
          : row
      ));
      console.error('Failed to fork gist:', error);
      message.error('Failed to fork gist. Please try again.');
    } finally {
      setLoadingActions(prev => {
        const newSet = new Set(prev);
        newSet.delete(`fork-${gistId}`);
        return newSet;
      });
    }
  };

  // Handle row click to navigate to detail page
  const handleRowClick = (record: Row) => {
    if (!loading && record.key && !record.key.startsWith('skeleton-')) {
      void navigate(`/gist/${record.key}`);
    }
  };
  // Generate skeleton rows for loading state
  const generateSkeletonRows = (count = 5): Row[] => {
    return Array.from({ length: count }, (_, index) => ({
      key: `skeleton-${index}`,
      name: '',
      gistName: '',
      description: '',
      updated: '',
      avatarUrl: '',
      language: '',
      gistUrl: '',
      starCount: 0,
      forkCount: 0
    }));
  };

  // Use rowData for the table, which includes optimistic updates
  const rows: Row[] = loading ? generateSkeletonRows() : rowData;

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
            {formatUpdatedDate(dateString)}
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
                aria-label="Fork gist"
                loading={loadingActions.has(`fork-${record.key}`)}
                onClick={(e) => handleForkGist(record.key, e)}
                size="small"
              />
              <Button 
                type="text" 
                icon={<StarOutlined />} 
                aria-label="Star gist"
                loading={loadingActions.has(`star-${record.key}`)}
                style={{ 
                  color: starredGists.has(record.key) ? '#faad14' : undefined 
                }}
                onClick={(e) => handleStarGist(record.key, e)}
                size="small"
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