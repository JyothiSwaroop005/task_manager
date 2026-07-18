import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="status-page">
      <h1 className="status-code">404</h1>
      <p className="status-message">Oops! The page you're looking for doesn't exist.</p>
      <Link to="/dashboard" className="btn btn-primary">
        Go to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
