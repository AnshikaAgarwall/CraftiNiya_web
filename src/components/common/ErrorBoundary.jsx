import { Component } from "react";
import Button from "../ui/Button.jsx";
import { EmptyState } from "../ui/Feedback.jsx";

/**
 * Catches render-time crashes so one broken component does not blank the whole
 * site. Service failures are handled by ErrorState instead — this is the net
 * for the bugs we did not anticipate.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Replace with a real reporter (Sentry et al) when one exists.
    console.error("Unhandled UI error:", error, info?.componentStack);
  }

  render() {
    const { error } = this.state;
    const { children, fallback } = this.props;

    if (!error) return children;
    if (fallback) return fallback;

    return (
      <div className="container" style={{ paddingBlock: "var(--sp-11)" }}>
        <EmptyState
          title="Something broke on this page"
          message="This is our fault, not yours. Reloading usually clears it."
          action={
            <Button onClick={() => window.location.reload()}>Reload the page</Button>
          }
        />
      </div>
    );
  }
}
