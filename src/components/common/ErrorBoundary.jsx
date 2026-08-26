import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

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
          <div className="glass-card p-8 sm:p-10 max-w-lg w-full text-center border-rose-500/30 shadow-2xl space-y-4">
            <div className="p-3 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-2xl w-fit mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>

            <h2 className="text-xl font-bold text-white">Something Went Wrong</h2>
            <p className="text-xs text-slate-400">
              An unexpected display error occurred while rendering this page.
            </p>

            {this.state.error && (
              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-left font-mono text-[11px] text-rose-400/90 overflow-x-auto max-h-32">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <button
                onClick={this.handleReload}
                className="btn-primary flex items-center gap-2 text-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Page</span>
              </button>

              <a
                href="/"
                className="btn-secondary flex items-center gap-2 text-xs"
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
