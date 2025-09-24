import { lazy, Suspense } from "react"

// Dynamically load Monaco editor for better performance
const MonacoEditor = lazy(() => import("@monaco-editor/react"))

type GistEditorProps = {
  value: string
  language?: "json" | "javascript" | "typescript" | "markdown"
  className?: string
  readOnly?: boolean
  height?: number | string
  onChange?: (value: string | undefined) => void
}

export default function GistEditor({
  value,
  language = "json",
  className,
  readOnly = true,
  height = 520,
  onChange,
}: GistEditorProps) {
  return (
    <div className={`gist-editor ${className || ""}`}>
      <Suspense fallback={<div>Loading editor...</div>}>
        <MonacoEditor
          height={height}
          defaultLanguage={language}
          value={value}
          onChange={onChange}
          theme="vs-light"
          options={{
            readOnly,
            minimap: { enabled: false },
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            roundedSelection: false,
            renderLineHighlight: "none",
            fontSize: 13,
            padding: { top: 12, bottom: 16 },
          }}
        />
      </Suspense>
    </div>
  )
}
