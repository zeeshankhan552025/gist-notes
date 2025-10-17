import { useState } from "react"
import { Trash2 } from "lucide-react"
import { getMonacoLanguageFromFilename } from "../../utils/language-utils"
import GistEditor from "../GistEditor/gist-editor"

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
    const newContent = value ?? ""
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
          disabled={disabled}
        />
        <button
          type="button"
          className="gist-file-editor__remove"
          onClick={() => onRemove(file.id)}
          aria-label="Remove file"
          disabled={disabled}
        >
          <Trash2 size={16} />
        </button>
      </div>
      <div className="gist-file-editor__editor">
        <GistEditor
          value={content}
          language={getMonacoLanguageFromFilename(filename)}
          readOnly={disabled}
          height={300}
          onChange={handleContentChange}
        />
      </div>
    </div>
  )
}