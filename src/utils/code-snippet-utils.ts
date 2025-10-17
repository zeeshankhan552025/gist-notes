/**
 * Code snippet generation utilities for creating sample code based on file types
 */

import type { GitHubGist } from '../services/github-api';

/**
 * Generate a sample code snippet based on file type and language
 * @param filename - The filename to generate code for
 * @param language - The programming language (optional)
 * @param description - The gist description (optional)
 * @returns Generated code snippet
 */
export function generateCodeSnippet(
  filename: string, 
  language?: string, 
  description?: string
): string {
  const extension = filename.split('.').pop()?.toLowerCase();
  const baseName = filename.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, '');
  const cleanBaseName = baseName || 'untitled';
  
  // JavaScript/TypeScript files
  if (language === 'javascript' || extension === 'js') {
    return `// ${filename}
function ${cleanBaseName}() {
  console.log('Hello, World!');
  return true;
}

export default ${cleanBaseName};`;
  }
  
  if (language === 'typescript' || extension === 'ts') {
    return `// ${filename}
interface ${cleanBaseName}Config {
  name: string;
  version: string;
}

function ${cleanBaseName}(config: ${cleanBaseName}Config): boolean {
  console.log(\`\${config.name} v\${config.version}\`);
  return true;
}

export default ${cleanBaseName};`;
  }
  
  // JSON files
  if (language === 'json' || extension === 'json') {
    return `{
  "name": "${cleanBaseName}",
  "version": "1.0.0",
  "description": "${description || 'A gist file'}",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  }
}`;
  }
  
  // Python files
  if (language === 'python' || extension === 'py') {
    return `# ${filename}
def main():
    print("Hello, World!")
    return True

if __name__ == "__main__":
    main()`;
  }
  
  // Markdown files
  if (language === 'markdown' || extension === 'md') {
    return `# ${cleanBaseName}

${description || 'A sample markdown file'}

## Features

- Feature 1
- Feature 2
- Feature 3

## Usage

\`\`\`bash
# Example usage
echo "Hello, World!"
\`\`\``;
  }
  
  // HTML files
  if (language === 'html' || extension === 'html') {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${cleanBaseName}</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>${description || 'A sample HTML file'}</p>
</body>
</html>`;
  }
  
  // CSS files
  if (language === 'css' || extension === 'css') {
    return `/* ${filename} */
.${cleanBaseName} {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: #f0f0f0;
  border-radius: 8px;
}

.${cleanBaseName}__title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}`;
  }
  
  // Shell scripts
  if (language === 'bash' || extension === 'sh') {
    return `#!/bin/bash
# ${filename}

echo "Hello, World!"
echo "Running ${cleanBaseName} script..."

# Add your script logic here
exit 0`;
  }
  
  // Default fallback
  return `// ${filename}
// ${language?.toUpperCase() || 'Text'} file
// Size: Unknown
// Created: ${new Date().toLocaleDateString()}

/* Content preview not available */`;
}

/**
 * Generate code snippet from GitHub Gist data
 * @param gist - GitHub gist object
 * @returns Generated code snippet
 */
export function getCodeSnippetFromGist(gist: GitHubGist): string {
  const firstFile = Object.values(gist.files)[0];
  if (!firstFile) return '// No content available';
  
  const filename = Object.keys(gist.files)[0] || 'untitled.txt';
  const language = firstFile.language?.toLowerCase();
  
  return generateCodeSnippet(filename, language, gist.description || undefined);
}

/**
 * Get language icon/emoji for display purposes
 * @param language - The programming language
 * @returns Emoji or icon string
 */
export function getLanguageIcon(language?: string): string {
  const icons: Record<string, string> = {
    javascript: '🟨',
    typescript: '🔷',
    python: '🐍',
    java: '☕',
    html: '🌐',
    css: '🎨',
    json: '📄',
    markdown: '📝',
    bash: '💻',
    shell: '💻',
    php: '🐘',
    ruby: '💎',
    go: '🐹',
    rust: '🦀',
    cpp: '⚙️',
    c: '⚙️',
    csharp: '🔷',
  };
  
  return icons[language?.toLowerCase() || ''] || '📄';
}