/**
 * Language detection utilities for file extensions
 */

/**
 * Language map for common file extensions
 */
const LANGUAGE_MAP: Record<string, string> = {
  // JavaScript/TypeScript
  'js': 'javascript',
  'jsx': 'jsx',
  'ts': 'typescript',
  'tsx': 'tsx',
  'mjs': 'javascript',
  'cjs': 'javascript',
  
  // Web technologies
  'html': 'html',
  'htm': 'html',
  'css': 'css',
  'scss': 'scss',
  'sass': 'sass',
  'less': 'less',
  'json': 'json',
  'xml': 'xml',
  'yaml': 'yaml',
  'yml': 'yaml',
  
  // Programming languages
  'py': 'python',
  'java': 'java',
  'c': 'c',
  'cpp': 'cpp',
  'cxx': 'cpp',
  'cc': 'cpp',
  'cs': 'csharp',
  'php': 'php',
  'rb': 'ruby',
  'go': 'go',
  'rs': 'rust',
  'kt': 'kotlin',
  'scala': 'scala',
  'swift': 'swift',
  'dart': 'dart',
  
  // Shell/Config
  'sh': 'bash',
  'bash': 'bash',
  'zsh': 'zsh',
  'fish': 'fish',
  'ps1': 'powershell',
  'bat': 'batch',
  'cmd': 'batch',
  
  // Database
  'sql': 'sql',
  
  // Documentation
  'md': 'markdown',
  'markdown': 'markdown',
  'rst': 'rst',
  'txt': 'text',
  
  // Config files
  'toml': 'toml',
  'ini': 'ini',
  'cfg': 'ini',
  'conf': 'ini',
  'dockerfile': 'dockerfile',
  
  // Other
  'r': 'r',
  'matlab': 'matlab',
  'm': 'matlab',
  'pl': 'perl',
  'lua': 'lua',
  'vim': 'vim',
};

/**
 * Supported languages for monaco editor (more restricted set)
 */
export type MonacoLanguage = 'json' | 'javascript' | 'typescript' | 'markdown';

/**
 * Get programming language from filename extension
 * @param filename - The filename to analyze
 * @returns The detected language or 'text' as fallback
 */
export function getLanguageFromFilename(filename: string): string {
  if (!filename) return 'text';
  
  const extension = filename.split('.').pop()?.toLowerCase();
  if (!extension) return 'text';
  
  return LANGUAGE_MAP[extension] || 'text';
}

/**
 * Get Monaco Editor compatible language from filename
 * @param filename - The filename to analyze
 * @returns Monaco-compatible language type
 */
export function getMonacoLanguageFromFilename(filename: string): MonacoLanguage {
  const extension = filename.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'js':
    case 'jsx':
    case 'mjs':
    case 'cjs':
      return 'javascript';
    case 'ts':
    case 'tsx':
      return 'typescript';
    case 'json':
      return 'json';
    case 'md':
    case 'markdown':
      return 'markdown';
    default:
      return 'javascript'; // Default fallback for Monaco
  }
}

/**
 * Check if a file extension is supported for syntax highlighting
 * @param filename - The filename to check
 * @returns Whether the file type supports syntax highlighting
 */
export function isSyntaxHighlightSupported(filename: string): boolean {
  const language = getLanguageFromFilename(filename);
  return language !== 'text';
}

/**
 * Get a human-readable language name
 * @param filename - The filename to analyze
 * @returns Human-readable language name
 */
export function getLanguageDisplayName(filename: string): string {
  const language = getLanguageFromFilename(filename);
  
  const displayNames: Record<string, string> = {
    'javascript': 'JavaScript',
    'typescript': 'TypeScript',
    'jsx': 'React JSX',
    'tsx': 'React TSX',
    'python': 'Python',
    'java': 'Java',
    'csharp': 'C#',
    'cpp': 'C++',
    'html': 'HTML',
    'css': 'CSS',
    'scss': 'SCSS',
    'sass': 'Sass',
    'markdown': 'Markdown',
    'json': 'JSON',
    'yaml': 'YAML',
    'bash': 'Bash',
    'sql': 'SQL',
    'text': 'Text',
  };
  
  return displayNames[language] || language.charAt(0).toUpperCase() + language.slice(1);
}