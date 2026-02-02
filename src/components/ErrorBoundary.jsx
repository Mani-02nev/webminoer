import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '40px', color: '#ff5555', backgroundColor: '#1a1a1a', minHeight: '100vh', fontFamily: 'monospace' }}>
                    <h1>Something went wrong.</h1>
                    <h2 style={{ color: '#fff' }}>{this.state.error?.toString()}</h2>
                    <details style={{ whiteSpace: 'pre-wrap', marginTop: '20px', color: '#aaa' }}>
                        {this.state.errorInfo?.componentStack}
                    </details>
                    <button
                        onClick={() => window.location.reload()}
                        style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer', background: '#333', color: 'white', border: 'none', borderRadius: '5px' }}
                    >
                        Reload Page
                    </button>
                    <button
                        onClick={() => window.location.href = '/'}
                        style={{ marginLeft: '10px', marginTop: '20px', padding: '10px 20px', cursor: 'pointer', background: '#333', color: 'white', border: 'none', borderRadius: '5px' }}
                    >
                        Go Home
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
