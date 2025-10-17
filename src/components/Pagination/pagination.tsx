import { Input } from "antd"
import { LeftOutlined, RightOutlined } from "@ant-design/icons"
import { useEffect, useState } from "react"
import "./pagination.scss"

export interface PaginationProps {
  currentPage: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
  onPageChange: (page: number) => void
  loading?: boolean
  className?: string
}

export function Pagination({
  currentPage,
  totalPages,
  hasNext,
  hasPrev,
  onPageChange,
  loading = false,
  className = ""
}: PaginationProps) {
  const [inputPage, setInputPage] = useState(currentPage.toString())

  // Update input when currentPage changes
  useEffect(() => {
    setInputPage(currentPage.toString())
  }, [currentPage])

  const handleInputPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPage(e.target.value)
  }

  const handleInputPageSubmit = () => {
    const pageNum = parseInt(inputPage, 10)
    if (pageNum && pageNum > 0 && pageNum !== currentPage) {
      onPageChange(pageNum)
    } else if (!pageNum || pageNum <= 0) {
      setInputPage(currentPage.toString())
    }
  }

  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputPageSubmit()
    }
  }

  const handlePrevPage = () => {
    if (hasPrev && !loading) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (hasNext && !loading) {
      onPageChange(currentPage + 1)
    }
  }

  // Only hide pagination if we're on page 1 and there's no next page
  if (currentPage === 1 && !hasNext) {
    return null
  }

  return (
    <div className={`pagination ${className}`}>
      <div className="pagination__input">
        <LeftOutlined 
          className={`pagination__arrow ${!hasPrev || loading ? 'pagination__arrow--disabled' : ''}`}
          onClick={handlePrevPage}
          aria-label="Previous page"
        />
        <span>page</span>
        <Input
          value={inputPage}
          onChange={handleInputPageChange}
          onBlur={handleInputPageSubmit}
          onKeyPress={handleInputKeyPress}
          size="small"
          className="pagination__page-input"
          disabled={loading}
        />
        <span>{hasNext ? `of ${totalPages}+` : `of ${currentPage}`}</span>
      </div>
      <div className="pagination__controls">
        <RightOutlined 
          className={`pagination__arrow ${!hasNext || loading ? 'pagination__arrow--disabled' : ''}`}
          onClick={handleNextPage}
          aria-label="Next page"
        />
      </div>
    </div>
  )
}
