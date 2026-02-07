import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Card, Container } from '../ui/Layout';
import { Heading1, Paragraph } from '../ui/Typography';
import { Button } from '../ui/Button';
import { RefreshCcw, Home, AlertTriangle } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <Container size="md">
            <Card className="p-8 text-center border-rose-100 shadow-xl shadow-rose-900/5">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-100 text-rose-600 mb-6">
                <AlertTriangle size={32} />
              </div>
              <Heading1 className="text-2xl mb-2">Something went wrong</Heading1>
              <Paragraph className="text-slate-600 mb-8">
                We encountered an unexpected error. Don't worry, your progress is safe. You can try refreshing the page or going back to the dashboard.
              </Paragraph>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={this.handleReset} className="flex items-center gap-2">
                  <RefreshCcw size={16} />
                  Reload Page
                </Button>
                <Button variant="outline" onClick={this.handleGoHome} className="flex items-center gap-2">
                  <Home size={16} />
                  Go to Home
                </Button>
              </div>

              {import.meta.env.DEV && (
                <div className="mt-8 p-4 bg-slate-100 rounded text-left overflow-auto max-h-40">
                  <p className="text-xs font-mono text-rose-700">
                    {this.state.error?.toString()}
                  </p>
                </div>
              )}
            </Card>
          </Container>
        </div>
      );
    }

    return this.props.children;
  }
}
