import { useState } from "react"
import GistEditor from "./gist-editor"

export type GistFile = {
  id: string
  filename: string
  content: string
}

type GistFileEditorProps = {
  file: GistFile
  onChange: (file: GistFile) => void
  onRemove: (id: string) => void
  disabled?: boolean
}

export default function GistFileEditor({ file, onChange, onRemove, disabled = false }: GistFileEditorProps) {
  const [filename, setFilename] = useState(file.filename)
  const [content, setContent] = useState(file.content)

  const handleFilenameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilename = e.target.value
    setFilename(newFilename)
    onChange({ ...file, filename: newFilename })
  }

  const handleContentChange = (value: string | undefined) => {
    const newContent = value || ""
    setContent(newContent)
    onChange({ ...file, content: newContent })
  }

  // Detect language from filename extension
  const getLanguageFromFilename = (filename: string): "json" | "javascript" | "typescript" | "markdown" => {
    const extension = filename.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'js':
        return 'javascript'
      case 'ts':
        return 'typescript'
      case 'json':
        return 'json'
      case 'md':
      case 'markdown':
        return 'markdown'
      default:
        return 'javascript'
    }
  }

  return (
    <div className="gist-file-editor">
      <div className="gist-file-editor__header">
        <input
          type="text"
          className="gist-file-editor__filename"
          placeholder="filename.txt"
          value={filename}
          onChange={handleFilenameChange}
          disabled={disabled}
        />
        <button
          type="button"
          className="gist-file-editor__remove"
          onClick={() => onRemove(file.id)}
          aria-label="Remove file"
          disabled={disabled}
        >
          ×
        </button>
      </div>
      <div className="gist-file-editor__editor">
        <GistEditor
          value={content}
          language={getLanguageFromFilename(filename)}
          readOnly={disabled}
          height={300}
          onChange={handleContentChange}
        />
      </div>
    </div>
  )
}