import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught rendering error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-6 animate-fade-in">
          <div className="glass-card p-8 sm:p-10 max-w-lg w-full text-center border-rose-200 shadow-2xl space-y-4 bg-white">
            <div className="p-3 bg-rose-50 text-rose-600 border border-rose-200 rounded-2xl w-fit mx-auto shadow-sm">
              <AlertCircle className="w-8 h-8" />
            </div>

            <h2 className="text-xl font-extrabold text-slate-900">Something Went Wrong</h2>
            <p className="text-xs text-slate-600 font-medium">
              An unexpected display error occurred while rendering this page.
            </p>

            {this.state.error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-left font-mono text-[11px] text-rose-700 overflow-x-auto max-h-32 font-medium">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <button
                onClick={this.handleReload}
                className="btn-primary flex items-center gap-2 text-xs shadow-md shadow-sky-500/25"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Page</span>
              </button>

              <a
                href="/"
                className="btn-secondary flex items-center gap-2 text-xs font-semibold text-slate-700"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Return to Dashboard</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
