import React from "react";
import * as Sentry from "@sentry/react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Attach custom tags before sending
    Sentry.setTag("component", this.props.componentName || "unknown");
    Sentry.setTag("severity", "critical");

    Sentry.captureException(error, { extra: errorInfo });
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h2>Something went wrong 🚧</h2>
          <p>{this.state.error?.message || "Unexpected error occurred."}</p>
          <button onClick={this.handleReset}>Try Again</button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;