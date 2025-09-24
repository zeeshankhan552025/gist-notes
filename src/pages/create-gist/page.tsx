import type React from "react"

import { useState } from "react"
import "./create-gist.scss"
import GistFileEditor, { type GistFile } from "../../components/gist-file-editor"
import { v4 as uuidv4 } from "uuid"

export default function CreateGistPage() {
  const [description, setDescription] = useState<string>("")
  const [files, setFiles] = useState<GistFile[]>([
    {
      id: uuidv4(),
      filename: "filename.txt",
      content: "",
    },
  ])

  function handleFileChange(updated: GistFile) {
    setFiles((prev) => prev.map((f) => (f.id === updated.id ? updated : f)))
  }

  function handleRemove(id: string) {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  function handleAddFile() {
    setFiles((prev) => [...prev, { id: uuidv4(), filename: "", content: "" }])
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Basic validation
    const nonEmpty = files.filter((f) => f.filename.trim() && f.content.trim())
    if (nonEmpty.length === 0) {
      alert("Add at least one file with a filename and content.")
      return
    }

    const payload = {
      description: description.trim(),
      files: nonEmpty.map(({ filename, content }) => ({ filename, content })),
    }

    // Placeholder: wire this to your API/server action as needed
    console.log("[v0] Create Gist payload:", payload)
    alert("Gist data captured in the console. Wire this to your backend to create the gist.")
  }

  return (
    <main className="gist-create" role="main" aria-labelledby="create-gist-title">
      <h1 id="create-gist-title" className="gist-create__title">
        Create Gist
      </h1>

      <form className="gist-create__form" onSubmit={handleSubmit}>
        <label className="gist-create__label" htmlFor="gist-description">
          Description
        </label>
        <input
          id="gist-description"
          className="gist-create__description"
          placeholder="This is a Git Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="gist-create__files">
          {files.map((file) => (
            <GistFileEditor key={file.id} file={file} onChange={handleFileChange} onRemove={handleRemove} />
          ))}
        </div>

        <div className="gist-create__actions">
          <button type="button" onClick={handleAddFile} className="btn btn--ghost">
            Add file
          </button>
          <button type="submit" className="btn btn--primary">
            Create Gist
          </button>
        </div>
      </form>
    </main>
  )
}
