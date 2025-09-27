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
      <Suspense fallback={
        <div style={{ 
          height: typeof height === 'number' ? `${height}px` : height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fafafa',
          border: '1px solid #e6e8eb',
          borderRadius: '6px',
          color: '#666'
        }}>
          Loading editor...
        </div>
      }>
        <MonacoEditor
          height={height}
          defaultLanguage={language}
          language={language}
          value={value}
          onChange={onChange}
          theme="vs"
          loading={
            <div style={{ 
              height: typeof height === 'number' ? `${height}px` : height,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#fafafa',
              color: '#666'
            }}>
              Loading...
            </div>
          }
          options={{
            readOnly,
            minimap: { enabled: false },
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            roundedSelection: false,
            renderLineHighlight: readOnly ? "none" : "line",
            fontSize: 13,
            lineHeight: 18,
            padding: { top: 12, bottom: 16 },
            wordWrap: "on",
            wrappingIndent: "indent",
            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
              alwaysConsumeMouseWheel: false
            },
            overviewRulerLanes: 0,
            hideCursorInOverviewRuler: true,
            overviewRulerBorder: false,
            colorDecorators: true,
            bracketPairColorization: { enabled: true }
          }}
        />
      </Suspense>
    </div>
  )
}
