/**
 * @fileoverview Error boundary component for CodeForge IDE
 * @module components/common/ErrorBoundary
 * @version 1.0.0
 * @author CodeForge Team
 *
 * @description
 * React error boundary that catches JavaScript errors in component tree,
 * logs error details, and displays fallback UI with recovery options.
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKeys?: Array<string | number>;
  resetOnPropsChange?: boolean;
  isolate?: boolean;
}

/**
 * Error boundary component that catches and handles React errors
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    };
  }

  /**
   * Static method to update state when an error occurs
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      hasError: true,
      error,
      errorId,
    };
  }

  /**
   * Lifecycle method called when an error occurs
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error details
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error Info:', errorInfo);

    // Update state with error info
    this.setState({
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      try {
        this.props.onError(error, errorInfo);
      } catch (handlerError) {
        console.error('Error in custom error handler:', handlerError);
      }
    }

    // Log to external service (placeholder)
    this.logErrorToService(error, errorInfo);
  }

  /**
   * Check if component should reset based on prop changes
   */
  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    const { resetKeys, resetOnPropsChange } = this.props;
    const { hasError } = this.state;

    if (hasError && resetOnPropsChange) {
      // Reset if any prop changed
      if (prevProps !== this.props) {
        this.resetErrorBoundary();
      }
    }

    if (hasError && resetKeys) {
      // Reset if any reset key changed
      const prevResetKeys = prevProps.resetKeys || [];
      const hasResetKeyChanged = resetKeys.some(
        (key, index) => key !== prevResetKeys[index]
      );

      if (hasResetKeyChanged) {
        this.resetErrorBoundary();
      }
    }
  }

  /**
   * Cleanup timeout on unmount
   */
  componentWillUnmount(): void {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  /**
   * Reset the error boundary state
   */
  resetErrorBoundary = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    });
  };

  /**
   * Reset with a delay
   */
  resetWithDelay = (delay: number = 1000): void => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }

    this.resetTimeoutId = window.setTimeout(() => {
      this.resetErrorBoundary();
    }, delay);
  };

  /**
   * Reload the current page
   */
  reloadPage = (): void => {
    window.location.reload();
  };

  /**
   * Log error to external service (implement as needed)
   */
  private logErrorToService(error: Error, errorInfo: ErrorInfo): void {
    // This would be where you send error data to your logging service
    // For now, we'll just log to console with structured data
    const errorData = {
      timestamp: new Date().toISOString(),
      errorId: this.state.errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: 'anonymous', // Would be actual user ID in real app
    };

    console.error('Error logged to service:', errorData);

    // TODO: Implement actual error reporting service
    // Example: sendToErrorService(errorData);
  }

  /**
   * Render fallback UI when error occurs
   */
  private renderErrorUI(): ReactNode {
    const { error, errorInfo, errorId } = this.state;
    const { fallback } = this.props;

    // Use custom fallback if provided
    if (fallback) {
      return fallback;
    }

    // Default error UI
    return (
      <div className="error-boundary">
        <div className="error-boundary-container">
          <div className="error-boundary-icon">⚠️</div>

          <h1 className="error-boundary-title">Something went wrong</h1>

          <p className="error-boundary-message">
            We're sorry, but something unexpected happened. The error has been logged
            and we'll work to fix it.
          </p>

          <div className="error-boundary-actions">
            <button
              className="error-boundary-button primary"
              onClick={this.resetErrorBoundary}
              type="button"
            >
              Try Again
            </button>

            <button
              className="error-boundary-button secondary"
              onClick={this.reloadPage}
              type="button"
            >
              Reload Page
            </button>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <details className="error-boundary-details">
              <summary>Error Details (Development Only)</summary>

              <div className="error-boundary-debug">
                <div className="error-boundary-section">
                  <h3>Error ID:</h3>
                  <code>{errorId}</code>
                </div>

                <div className="error-boundary-section">
                  <h3>Error Message:</h3>
                  <code>{error?.message}</code>
                </div>

                <div className="error-boundary-section">
                  <h3>Stack Trace:</h3>
                  <pre className="error-boundary-stack">
                    {error?.stack}
                  </pre>
                </div>

                {errorInfo && (
                  <div className="error-boundary-section">
                    <h3>Component Stack:</h3>
                    <pre className="error-boundary-stack">
                      {errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          )}
        </div>
      </div>
    );
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.renderErrorUI();
    }

    return this.props.children;
  }
}

/**
 * Higher-order component for wrapping components with error boundary
 */
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
};

/**
 * Hook for manually triggering error boundary
 */
export const useErrorHandler = () => {
  return React.useCallback((error: Error) => {
    throw error;
  }, []);
};

export default ErrorBoundary;
