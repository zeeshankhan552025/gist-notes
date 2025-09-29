import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import type { AppError } from '../types/common.types';
import { ErrorHandler } from './error-handler';

interface Props {
  children: ReactNode;
  fallback?: (error: AppError, resetError: () => void) => ReactNode;
  onError?: (error: AppError, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: AppError | null;
}

/**
 * Error boundary component to catch and handle React errors
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Convert error to AppError format
    const appError = ErrorHandler.createError(
      error.message ?? 'An unexpected error occurred',
      'REACT_ERROR',
      error
    );

    return {
      hasError: true,
      error: appError,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const appError = ErrorHandler.createError(
      error.message ?? 'An unexpected error occurred',
      'REACT_ERROR',
      { error, errorInfo }
    );

    // Log the error
    void ErrorHandler.logError(appError, 'ErrorBoundary');

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(appError, errorInfo);
    }
  }

  private resetError = () => {
    void this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError && this.state.error) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetError);
      }

      // Default fallback UI
      return (
        <div className='error-boundary-container p-6 text-center'>
          <h2 className='text-xl font-semibold text-red-600 mb-4'>Something went wrong</h2>
          <p className='text-gray-600 mb-6'>{this.state.error.message}</p>
          <button
            onClick={this.resetError}
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Higher-order component to wrap components with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: (error: AppError, resetError: () => void) => ReactNode,
  onError?: (error: AppError, errorInfo: ErrorInfo) => void
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback} onError={onError}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName ?? Component.name})`;

  return WrappedComponent;
}
