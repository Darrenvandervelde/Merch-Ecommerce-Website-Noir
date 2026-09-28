import { Component, type ReactNode } from 'react';
import { Button } from './Button';
import { isChunkLoadError, reloadOnceForChunkError } from '../../utils/lazyRetry';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message?: string;
  isChunk?: boolean;
}

/**
 * Catches render errors so the whole app doesn't white-screen.
 * Stale Vite chunks after deploy trigger a one-time hard reload.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      message: error.message,
      isChunk: isChunkLoadError(error),
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
    if (isChunkLoadError(error)) {
      reloadOnceForChunkError();
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, message: undefined, isChunk: false });
    window.location.href = '/';
  };

  handleHardRefresh = () => {
    try {
      sessionStorage.removeItem('noir-chunk-reload');
    } catch {
      /* ignore */
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-brand-50">
          <div className="max-w-md text-center">
            <h1 className="text-2xl font-bold text-brand-950">
              {this.state.isChunk ? 'Update available' : 'Something went wrong'}
            </h1>
            <p className="mt-3 text-brand-500 text-sm">
              {this.state.isChunk
                ? 'The site was updated. Refresh to load the latest version.'
                : 'We hit an unexpected error. You can go back to the homepage and keep shopping.'}
            </p>
            {import.meta.env.DEV && this.state.message && (
              <p className="mt-4 text-xs text-red-600 font-mono break-all">
                {this.state.message}
              </p>
            )}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {this.state.isChunk && (
                <Button onClick={this.handleHardRefresh}>Refresh page</Button>
              )}
              <Button variant={this.state.isChunk ? 'outline' : 'primary'} onClick={this.handleReset}>
                Go home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
