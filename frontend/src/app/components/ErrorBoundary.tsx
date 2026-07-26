import { Component, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
          <div className="max-w-2xl text-center">
            <div className="mb-4 text-6xl">⚠️</div>
            <h1 className="mb-2 text-2xl font-bold text-gray-900">Something went wrong</h1>
            <p className="mb-4 text-gray-600">
              We're sorry, but something unexpected happened. Please refresh the page to continue.
            </p>
            {/* Show error details in development */}
            {import.meta.env.DEV && this.state.error && (
              <div className="mb-6 rounded-lg bg-red-50 p-4 text-left">
                <p className="mb-2 font-mono text-sm text-red-900">
                  <strong>Error:</strong> {this.state.error.message}
                </p>
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs text-red-700">Stack trace</summary>
                  <pre className="mt-2 overflow-x-auto text-xs text-red-800">
                    {this.state.error.stack}
                  </pre>
                </details>
              </div>
            )}
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-[#0F2A5F] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#0b1f47]"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
