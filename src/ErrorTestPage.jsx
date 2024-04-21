import React from "react";
import { Link } from "react-router-dom";
import "./ErrorTestPage.css"; // Import the CSS file for styling

const ErrorTestPage = () => {
  try {
    // Intentionally throwing an error for testing the error boundary
    throw new Error("An error occurred in ErrorTestPage");
  } catch (error) {
    // Display the error message
    return (
      <div className="error-test-page">
        <h2>Error Test Page</h2>
        <p>An error occurred: {error.message}</p>
        <Link to="/">Go back to the main page</Link>
      </div>
    );
  }
};

export default ErrorTestPage;
