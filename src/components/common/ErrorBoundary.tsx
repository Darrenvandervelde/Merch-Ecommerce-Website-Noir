import { Component, type ReactNode } from 'react';
import { Button } from './Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message?: string;
}

/**
 * Catches render errors so the whole app doesn't white-screen.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // In production, send to your error tracking service
    console.error('ErrorBoundary caught:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, message: undefined });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-brand-50">
          <div className="max-w-md text-center">
            <h1 className="text-2xl font-bold text-brand-950">
              Something went wrong
            </h1>
            <p className="mt-3 text-brand-500 text-sm">
              We hit an unexpected error. You can go back to the homepage and
              keep shopping.
            </p>
            {import.meta.env.DEV && this.state.message && (
              <p className="mt-4 text-xs text-red-600 font-mono break-all">
                {this.state.message}
              </p>
            )}
            <Button className="mt-8" onClick={this.handleReset}>
              Go home
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
