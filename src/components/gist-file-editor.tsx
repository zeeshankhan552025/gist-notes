import { useState } from "react"

export type GistFile = {
  id: string
  filename: string
  content: string
}

type GistFileEditorProps = {
  file: GistFile
  onChange: (file: GistFile) => void
  onRemove: (id: string) => void
}

export default function GistFileEditor({ file, onChange, onRemove }: GistFileEditorProps) {
  const [filename, setFilename] = useState(file.filename)
  const [content, setContent] = useState(file.content)

  const handleFilenameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilename = e.target.value
    setFilename(newFilename)
    onChange({ ...file, filename: newFilename })
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setContent(newContent)
    onChange({ ...file, content: newContent })
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
        />
        <button
          type="button"
          className="gist-file-editor__remove"
          onClick={() => onRemove(file.id)}
          aria-label="Remove file"
        >
          ×
        </button>
      </div>
      <textarea
        className="gist-file-editor__content"
        placeholder="Enter file content..."
        value={content}
        onChange={handleContentChange}
        rows={10}
      />
    </div>
  )
}