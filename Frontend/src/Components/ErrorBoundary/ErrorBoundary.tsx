import React, { ReactNode } from 'react'
import SharedButton from '../Button/SharedButton'
import './ErrorBoundary.scss'

interface ErrorBoundaryProps {
  children: ReactNode
  boundaryName?: string
  fallbackUI?: (error: Error, retry: () => void) => ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

/**
 * Global Error Boundary Component
 * Catches rendering errors in child components and displays a fallback UI
 *
 * @example
 * <ErrorBoundary boundaryName="Global">
 *   <App />
 * </ErrorBoundary>
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo })

    // Log error details to console in development
    if (import.meta.env.DEV) {
      const errorDetails = {
        message: error.toString(),
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        boundaryName: this.props.boundaryName || 'Unknown',
      }
      console.error('Error caught by Error Boundary:', errorDetails)
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  handleReloadApp = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback UI if provided
      if (this.props.fallbackUI && this.state.error) {
        return this.props.fallbackUI(this.state.error, this.handleReset)
      }

      // Default fallback UI
      return (
        <div className="error-boundary-container">
          <div className="error-boundary-content">
            <div className="error-icon">⚠️</div>
            <h1 className="error-title">Something Went Wrong</h1>
            <p className="error-message">
              We encountered an unexpected error. Please try again or reload the application.
            </p>

            <div className="error-actions">
              <SharedButton
                label="Retry"
                onClick={this.handleReset}
                variant="primary"
              />
              <SharedButton
                label="Reload Application"
                onClick={this.handleReloadApp}
                variant="primary"
              />
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
