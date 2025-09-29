/**
 * Application constants
 */

// API Configuration
export const API_CONFIG = {
  GITHUB_BASE_URL: 'https://api.github.com',
  DEFAULT_PER_PAGE: 10,
  MAX_PER_PAGE: 100,
  RATE_LIMIT_DELAY: 1000,
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  GITHUB_TOKEN: 'github_token',
  USER_INFO: 'user_info',
  THEME: 'theme',
} as const;

// GitHub OAuth Scopes
export const GITHUB_SCOPES = ['gist', 'read:user', 'public_repo'] as const;

// Pagination Defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PER_PAGE: 10,
  MAX_PAGES_TO_LOAD: 5,
} as const;

// File Type Constants
export const SUPPORTED_LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'java',
  'cpp',
  'c',
  'html',
  'css',
  'scss',
  'json',
  'markdown',
  'yaml',
  'xml',
  'sql',
  'bash',
  'powershell',
  'dockerfile',
] as const;

// Error Messages
export const ERROR_MESSAGES = {
  AUTH_REQUIRED: 'Authentication required. Please log in with GitHub.',
  TOKEN_MISSING: 'No authentication token available',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded. Please try again later.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNKNOWN_ERROR: 'An unknown error occurred',
  GIST_NOT_FOUND: 'Gist not found',
  INVALID_GIST_DATA: 'Invalid gist data provided',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  GIST_CREATED: 'Gist created successfully',
  GIST_UPDATED: 'Gist updated successfully',
  GIST_DELETED: 'Gist deleted successfully',
  LOGIN_SUCCESS: 'Logged in successfully',
  LOGOUT_SUCCESS: 'Logged out successfully',
} as const;

// Route Paths
export const ROUTES = {
  HOME: '/',
  PROFILE: '/profile',
  CREATE_GIST: '/create-gist',
  GIST_DETAIL: '/gist/:gistId',
  PUBLIC_GISTS: '/public-gists',
} as const;

// Component Constants
export const COMPONENT_DEFAULTS = {
  DEBOUNCE_DELAY: 300,
  LOADING_TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
} as const;
