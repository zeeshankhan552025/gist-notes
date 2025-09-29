/**
 * Generic API response wrapper
 */
export interface ApiResponse<T = unknown> {
  data: T;
  success: boolean;
  message?: string;
}

/**
 * Generic error type
 */
export interface AppError {
  message: string;
  code?: string | number;
  details?: unknown;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page: number;
  perPage: number;
}

/**
 * Pagination info
 */
export interface PaginationInfo {
  currentPage: number;
  totalPages?: number;
  hasNext: boolean;
  hasPrev: boolean;
  totalItems?: number;
}

/**
 * Search parameters
 */
export interface SearchParams {
  query: string;
  page?: number;
  perPage?: number;
}

/**
 * Loading state
 */
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

/**
 * Form validation error
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Component base props
 */
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Modal props
 */
export interface ModalProps extends BaseComponentProps {
  open: boolean;
  onClose: () => void;
  title?: string;
}

/**
 * Button variant types
 */
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

/**
 * Button size types
 */
export type ButtonSize = 'small' | 'medium' | 'large';

/**
 * Theme types
 */
export type Theme = 'light' | 'dark' | 'system';

/**
 * Environment configuration
 */
export interface AppConfig {
  apiUrl: string;
  environment: 'development' | 'production' | 'staging';
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
}
