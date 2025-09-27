import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Header } from "../../layout/header"
import "./create-gist.scss"
import GistFileEditor, { type GistFile } from "../../components/gist-file-editor"
import { githubService } from "../../services/github"
import { useAuth } from "../../contexts/AuthContext"
import { v4 as uuidv4 } from "uuid"

export default function CreateGistPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [description, setDescription] = useState<string>("")
  const [isPublic,] = useState<boolean>(true)
  const [isCreating, setIsCreating] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    // Clear previous messages
    setError("")
    setSuccess("")

    // Check if user is authenticated
    if (!isAuthenticated) {
      setError("Please log in with GitHub to create gists.")
      return
    }

    // Basic validation
    const validFiles = files.filter((f) => f.filename.trim() && f.content.trim())
    if (validFiles.length === 0) {
      setError("Add at least one file with a filename and content.")
      return
    }

    // Check for duplicate filenames
    const filenames = validFiles.map(f => f.filename.trim())
    const uniqueFilenames = new Set(filenames)
    if (filenames.length !== uniqueFilenames.size) {
      setError("Each file must have a unique filename.")
      return
    }

    setIsCreating(true)

    try {
      // Format files for GitHub API
      const gistFiles: Record<string, { content: string }> = {}
      validFiles.forEach((file) => {
        gistFiles[file.filename.trim()] = {
          content: file.content
        }
      })

      // Create gist payload
      const gistData = {
        description: description.trim() || "Created with Gist Notes App",
        public: isPublic,
        files: gistFiles
      }

      console.log("Creating gist with data:", gistData)

      // Create the gist on GitHub
      const createdGist = await githubService.createGist(gistData)
      
      console.log("Gist created successfully:", createdGist)
      
      // Show success message
      setSuccess(`Gist created successfully! View it at: ${createdGist.html_url}`)
      
      // Wait a moment to show the success message, then navigate
      setTimeout(() => {
        navigate(`/gist/${createdGist.id}`)
      }, 2000)
      
    } catch (error) {
      console.error("Error creating gist:", error)
      
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          setError("Authentication failed. Please log in again with GitHub.")
        } else if (error.message.includes('403')) {
          setError("Permission denied. Please check your GitHub token permissions.")
        } else if (error.message.includes('422')) {
          setError("Invalid gist data. Please check your files and try again.")
        } else {
          setError(`Failed to create gist: ${error.message}`)
        }
      } else {
        setError("Failed to create gist. Please try again.")
      }
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <>
      <Header />
      <main className="gist-create" role="main" aria-labelledby="create-gist-title">
      <h1 id="create-gist-title" className="gist-create__title">
        Create Gist
      </h1>

      <form className="gist-create__form" onSubmit={handleSubmit}>
        {error && (
          <div className="gist-create__message gist-create__message--error">
            {error}
          </div>
        )}
        
        {success && (
          <div className="gist-create__message gist-create__message--success">
            {success}
          </div>
        )}

        <label className="gist-create__label" htmlFor="gist-description">
          Description
        </label>
        <input
          id="gist-description"
          className="gist-create__description"
          placeholder="This is a Git Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isCreating}
        />

        <div className="gist-create__files">
          {files.map((file) => (
            <GistFileEditor 
              key={file.id} 
              file={file} 
              onChange={handleFileChange} 
              onRemove={handleRemove}
              disabled={isCreating}
            />
          ))}
        </div>

        <div className="gist-create__actions">
          <button type="button" onClick={handleAddFile} className="btn btn--ghost" disabled={isCreating}>
            Add file
          </button>
          <button type="submit" className="btn btn--primary" disabled={isCreating}>
            {isCreating ? "Creating..." : "Create Gist"}
          </button>
        </div>
      </form>
    </main>
    </>
  )
}
