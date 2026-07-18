import { Component } from 'react';
import ErrorPage from '../pages/ErrorPage';

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorPage resetError={() => this.setState({ hasError: false })} />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
