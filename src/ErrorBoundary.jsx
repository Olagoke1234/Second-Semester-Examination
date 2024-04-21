// ErrorBoundary.jsx
import React, { Component } from "react";
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state to indicate an error has occurred
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI when an error occurs
      return (
        <div>
          <h2>Something went wrong.</h2>
          <p>Please try again later.</p>
        </div>
      );
    }
    // Render children components normally if no error occurred
    return this.props.children;
  }
}

export default ErrorBoundary;
