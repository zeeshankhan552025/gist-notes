import type { AppError } from '../types/common.types';
import { ERROR_MESSAGES } from '../constants';

/**
 * Error handling utilities
 */
export class ErrorHandler {
  /**
   * Create a standardized app error
   */
  static createError(message: string, code?: string | number, details?: unknown): AppError {
    return {
      message,
      code,
      details,
    };
  }

  /**
   * Handle GitHub API errors with proper formatting
   */
  static handleGitHubApiError(error: unknown): AppError {
    if (error instanceof Response) {
      const { status } = error;

      switch (status) {
        case 401:
          return this.createError(ERROR_MESSAGES.AUTH_REQUIRED, 401);
        case 403:
          return this.createError(ERROR_MESSAGES.RATE_LIMIT_EXCEEDED, 403);
        case 404:
          return this.createError(ERROR_MESSAGES.GIST_NOT_FOUND, 404);
        default:
          return this.createError(`GitHub API error: ${status}`, status);
      }
    }

    if (error instanceof Error) {
      return this.createError(error.message, 'CLIENT_ERROR', error);
    }

    return this.createError(ERROR_MESSAGES.UNKNOWN_ERROR, 'UNKNOWN', error);
  }

  /**
   * Handle network errors
   */
  static handleNetworkError(error: unknown): AppError {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return this.createError(ERROR_MESSAGES.NETWORK_ERROR, 'NETWORK_ERROR');
    }

    if (error instanceof Error) {
      return this.createError(error.message, 'NETWORK_ERROR', error);
    }

    return this.createError(ERROR_MESSAGES.UNKNOWN_ERROR, 'UNKNOWN', error);
  }

  /**
   * Log error with context
   */
  static logError(error: AppError, context?: string): void {
    const logMessage = context ? `[${context}] ${error.message}` : error.message;

    void console.error(logMessage, {
      code: error.code,
      details: error.details,
    });
  }

  /**
   * Check if error is retryable
   */
  static isRetryableError(error: AppError): boolean {
    const retryableCodes: (string | number)[] = [429, 500, 502, 503, 504, 'NETWORK_ERROR'];
    return error.code !== undefined && retryableCodes.includes(error.code);
  }
}

/**
 * Validation utilities
 */
export class Validator {
  /**
   * Validate gist data before creation/update
   */
  static validateGistData(data: {
    description?: string;
    files?: Record<string, { content: string }>;
  }): string[] {
    const errors: string[] = [];

    if (data.files) {
      // Check if at least one file is provided
      if (Object.keys(data.files).length === 0) {
        void errors.push('At least one file is required');
      }

      // Validate each file
      Object.entries(data.files).forEach(([filename, file]) => {
        if (!filename.trim()) {
          void errors.push('Filename cannot be empty');
        }

        if (!file.content.trim()) {
          void errors.push(`File "${filename}" cannot be empty`);
        }
      });
    }

    return errors;
  }

  /**
   * Validate search query
   */
  static validateSearchQuery(query: string): string[] {
    const errors: string[] = [];

    if (!query.trim()) {
      void errors.push('Search query cannot be empty');
    }

    if (query.length < 2) {
      void errors.push('Search query must be at least 2 characters long');
    }

    if (query.length > 100) {
      void errors.push('Search query must not exceed 100 characters');
    }

    return errors;
  }

  /**
   * Validate pagination parameters
   */
  static validatePagination(page: number, perPage: number): string[] {
    const errors: string[] = [];

    if (page < 1) {
      void errors.push('Page number must be at least 1');
    }

    if (perPage < 1 || perPage > 100) {
      void errors.push('Items per page must be between 1 and 100');
    }

    return errors;
  }
}

/**
 * Retry mechanism for failed operations
 */
export class RetryHandler {
  static async withRetry<T>(operation: () => Promise<T>, maxRetries = 3, delay = 1000): Promise<T> {
    let lastError: Error = new Error('Unknown error');

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;

        // Don't retry on the last attempt
        if (attempt === maxRetries) {
          break;
        }

        // Check if error is retryable
        const appError = ErrorHandler.handleGitHubApiError(error);
        if (!ErrorHandler.isRetryableError(appError)) {
          break;
        }

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)));
      }
    }

    if (lastError) {
      throw lastError;
    }
    throw new Error('Operation failed after retries');
  }
}
