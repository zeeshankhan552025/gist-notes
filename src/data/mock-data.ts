/**
 * Shared mock data for testing and development
 */

import type { GistCardData } from '../components/GistCard/gist-card';
import type { GitHubGist } from '../services/github-api';

/**
 * Mock gist card data for UI testing
 */
export const mockGistCards: GistCardData[] = [
  {
    id: "1",
    authorName: "John Doe",
    gistName: "package.json",
    description: "Node.js package configuration with modern dependencies",
    createdAt: "Created 7 hours ago",
    language: "json",
    avatarUrl: "https://avatars.githubusercontent.com/u/1?v=4",
    gistUrl: "https://gist.github.com/johndoe/1",
    codeSnippet: `{
  "name": "modern-web-app",
  "version": "1.0.0",
  "private": true,
  "license": "MIT",
  "packageManager": "pnpm@8.3.1",
  "dependencies": {
    "react": "^18.2.0",
    "next": "^14.0.0",
    "typescript": "^5.0.0"
  },
  "devDependencies": {
    "eslint": "^8.0.0",
    "prettier": "^3.0.0"
  }
}`,
  },
  {
    id: "2",
    authorName: "Jane Smith",
    gistName: "utils.ts",
    description: "TypeScript utility functions for common operations",
    createdAt: "Created 2 days ago",
    language: "typescript",
    avatarUrl: "https://avatars.githubusercontent.com/u/2?v=4",
    gistUrl: "https://gist.github.com/janesmith/2",
    codeSnippet: `// utils.ts
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T => {
  let timeoutId: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  }) as T;
};`,
  },
  {
    id: "3",
    authorName: "Alex Chen",
    gistName: "api-helpers.js",
    description: "JavaScript API helper functions with error handling",
    createdAt: "Created 1 week ago",
    language: "javascript",
    avatarUrl: "https://avatars.githubusercontent.com/u/3?v=4",
    gistUrl: "https://gist.github.com/alexchen/3",
    codeSnippet: `// api-helpers.js
const API_BASE_URL = 'https://api.example.com';

async function fetchWithRetry(url, options = {}, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      
      if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`);
      }
      
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

export { fetchWithRetry };`,
  },
  {
    id: "4",
    authorName: "Maria Rodriguez",
    gistName: "styles.css",
    description: "Modern CSS utility classes and component styles",
    createdAt: "Created 3 days ago",
    language: "css",
    avatarUrl: "https://avatars.githubusercontent.com/u/4?v=4",
    gistUrl: "https://gist.github.com/mariarodriguez/4",
    codeSnippet: `/* styles.css */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: opacity 0.2s ease;
}`,
  },
  {
    id: "5",
    authorName: "David Kim",
    gistName: "README.md",
    description: "Comprehensive project documentation template",
    createdAt: "Created 5 days ago",
    language: "markdown",
    avatarUrl: "https://avatars.githubusercontent.com/u/5?v=4",
    gistUrl: "https://gist.github.com/davidkim/5",
    codeSnippet: `# Project Name

A brief description of what this project does and who it's for.

## Features

- 🚀 Fast and lightweight
- 📱 Responsive design
- 🎨 Modern UI components
- 🔧 Easy to customize

## Installation

\`\`\`bash
npm install project-name
# or
yarn add project-name
\`\`\`

## Usage

\`\`\`javascript
import { Component } from 'project-name';

const app = new Component({
  theme: 'dark',
  animation: true
});
\`\`\`

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request`,
  },
  {
    id: "6",
    authorName: "Sarah Wilson",
    gistName: "config.py",
    description: "Python configuration management with environment variables",
    createdAt: "Created 1 week ago",
    language: "python",
    avatarUrl: "https://avatars.githubusercontent.com/u/6?v=4",
    gistUrl: "https://gist.github.com/sarahwilson/6",
    codeSnippet: `# config.py
import os
from typing import Optional

class Config:
    """Application configuration management."""
    
    def __init__(self):
        self.debug = self._get_bool_env('DEBUG', False)
        self.database_url = self._get_env('DATABASE_URL', 'sqlite:///app.db')
        self.secret_key = self._get_env('SECRET_KEY', 'dev-secret-key')
        self.api_timeout = self._get_int_env('API_TIMEOUT', 30)
    
    @staticmethod
    def _get_env(key: str, default: str = '') -> str:
        """Get environment variable with default value."""
        return os.environ.get(key, default)
    
    @staticmethod
    def _get_bool_env(key: str, default: bool = False) -> bool:
        """Get boolean environment variable."""
        value = os.environ.get(key, '').lower()
        return value in ('true', '1', 'yes', 'on')
    
    @staticmethod
    def _get_int_env(key: str, default: int = 0) -> int:
        """Get integer environment variable."""
        try:
            return int(os.environ.get(key, str(default)))
        except ValueError:
            return default

# Global config instance
config = Config()`,
  }
];

/**
 * Mock GitHub API response data
 */
export const mockGitHubGists: GitHubGist[] = mockGistCards.map((card, index) => ({
  id: card.id,
  description: card.description,
  html_url: card.gistUrl || `https://gist.github.com/${index}`,
  created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
  updated_at: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
  public: true,
  files: {
    [card.gistName]: {
      filename: card.gistName,
      type: 'text/plain',
      language: card.language || 'Text',
      raw_url: `https://gist.githubusercontent.com/raw/${card.id}/${card.gistName}`,
      size: card.codeSnippet.length,
      truncated: false,
      content: card.codeSnippet
    }
  },
  owner: {
    login: card.authorName.toLowerCase().replace(' ', ''),
    id: parseInt(card.id, 10),
    avatar_url: card.avatarUrl || `https://avatars.githubusercontent.com/u/${card.id}?v=4`,
    html_url: `https://github.com/${card.authorName.toLowerCase().replace(' ', '')}`,
    type: 'User'
  },
  forks: Math.floor(Math.random() * 50),
  comments: Math.floor(Math.random() * 20),
  git_pull_url: `https://gist.github.com/${card.id}.git`,
  git_push_url: `https://gist.github.com/${card.id}.git`
}));

/**
 * Get a subset of mock gists for pagination testing
 * @param page - Page number (1-based)
 * @param pageSize - Number of items per page
 * @returns Paginated mock gists
 */
export function getMockGistsPaginated(page: number = 1, pageSize: number = 10) {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return {
    gists: mockGistCards.slice(startIndex, endIndex),
    total: mockGistCards.length,
    page,
    pageSize,
    totalPages: Math.ceil(mockGistCards.length / pageSize)
  };
}

/**
 * Generate additional mock gists for testing large datasets
 * @param count - Number of additional gists to generate
 * @returns Array of generated mock gists
 */
export function generateMockGists(count: number): GistCardData[] {
  const languages = ['javascript', 'typescript', 'python', 'css', 'html', 'json', 'markdown'];
  const authors = ['Alice Johnson', 'Bob Smith', 'Carol Brown', 'David Lee', 'Eva Garcia'];
  const extensions = ['js', 'ts', 'py', 'css', 'html', 'json', 'md'];
  
  return Array.from({ length: count }, (_, index) => {
    const baseId = mockGistCards.length + index + 1;
    const language = languages[index % languages.length];
    const author = authors[index % authors.length];
    const extension = extensions[index % extensions.length];
    
    return {
      id: baseId.toString(),
      authorName: author,
      gistName: `sample-file-${baseId}.${extension}`,
      description: `Sample ${language} file for testing purposes`,
      createdAt: `Created ${Math.floor(Math.random() * 30) + 1} days ago`,
      language,
      avatarUrl: `https://avatars.githubusercontent.com/u/${baseId}?v=4`,
      gistUrl: `https://gist.github.com/${author.toLowerCase().replace(' ', '')}/${baseId}`,
      codeSnippet: `// Sample ${language} code\nconsole.log('Hello from ${author}!');`
    };
  });
}