'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class SafePreviewBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('SafePreviewBoundary intercepted runtime error:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full max-w-lg p-6 rounded-2xl border border-red-500/30 bg-red-950/20 text-slate-200 space-y-4 shadow-xl">
          <div className="flex items-center gap-3 text-red-400">
            <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-white">Preview Render Error</h4>
              <p className="text-xs text-red-300">
                Component {this.props.componentName ? `"${this.props.componentName}"` : ''} encountered a runtime exception.
              </p>
            </div>
          </div>

          <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-red-300 overflow-x-auto max-h-36 scrollbar-none whitespace-pre-wrap">
            {this.state.error?.message || 'Unknown runtime error'}
          </pre>

          <button
            onClick={this.handleReset}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/30 text-xs font-medium transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Stage</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
