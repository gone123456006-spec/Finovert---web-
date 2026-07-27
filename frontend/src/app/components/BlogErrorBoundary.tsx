import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Error boundary specifically for the blog section
 * Prevents blog errors from crashing the entire app
 */
export class BlogErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: unknown) {
    // Log silently - don't crash the app
    console.warn("[Blog Section] Error caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Return minimal fallback or null to not show anything
      return null;
    }

    return this.props.children;
  }
}
