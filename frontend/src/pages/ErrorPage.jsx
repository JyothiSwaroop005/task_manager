import { Link } from 'react-router-dom';

const ErrorPage = ({ resetError }) => {
  return (
    <div className="status-page">
      <h1 className="status-code">⚠️</h1>
      <p className="status-message">Something went wrong. Please try again.</p>
      <div className="status-actions">
        {resetError && (
          <button className="btn btn-secondary" onClick={resetError}>
            Try Again
          </button>
        )}
        <Link to="/dashboard" className="btn btn-primary">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
