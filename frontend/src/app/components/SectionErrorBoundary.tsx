import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  name?: string;
  /** Overlay widgets (e.g. chat) should vanish on error instead of leaving a gap */
  silent?: boolean;
}

interface State {
  hasError: boolean;
}

/** Isolates a section so its errors never crash the rest of the page. */
export class SectionErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: unknown) {
    console.error(`[Section${this.props.name ? `: ${this.props.name}` : ""}]`, error, errorInfo);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.silent) return null;

    // Never render nothing for in-flow content — a blank gap reads as the page
    // losing its UI. Show a recoverable message instead.
    return (
      <section className="bg-white py-10">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <p className="text-sm text-slate-500">
            This section could not be displayed.
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
            className="mt-3 rounded-full border border-slate-200 px-4 py-1.5 text-sm font-semibold text-[#0F2A5F] transition-colors hover:bg-slate-50"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }
}
