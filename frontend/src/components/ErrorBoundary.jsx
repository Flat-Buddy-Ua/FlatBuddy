import React from 'react';

function persistError(payload) {
    try {
        localStorage.setItem('lastError', JSON.stringify({
            ...payload,
            at: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
        }));
    } catch {
        // localStorage недоступний (private mode або quota) — мовчки.
    }
}

export class ErrorBoundary extends React.Component {
    state = { error: null, info: null };

    static getDerivedStateFromError(error) {
        return { error };
    }

    componentDidCatch(error, info) {
        this.setState({ info });
        persistError({
            type: 'react',
            message: String(error?.message ?? error),
            stack: error?.stack,
            componentStack: info?.componentStack,
        });
    }

    handleCopy = () => {
        const text = JSON.stringify({
            message: String(this.state.error?.message ?? this.state.error),
            stack: this.state.error?.stack,
            componentStack: this.state.info?.componentStack,
            url: window.location.href,
        }, null, 2);
        try {
            navigator.clipboard?.writeText?.(text);
        } catch { /* mobile / no clipboard — пофіг */ }
    };

    render() {
        if (!this.state.error) return this.props.children;

        const message = String(this.state.error?.message ?? this.state.error);

        return (
            <div style={{
                padding: 32,
                fontFamily: 'Inter, sans-serif',
                maxWidth: 720,
                margin: '40px auto',
                lineHeight: 1.5,
            }}>
                <h2 style={{ marginTop: 0 }}>Щось пішло не так 😔</h2>
                <p>
                    Сторінка зловила помилку. Скопіюй текст нижче і надішли в підтримку —
                    допоможе швидко полагодити.
                </p>
                <pre style={{
                    background: '#f5f5f5',
                    padding: 12,
                    borderRadius: 8,
                    overflow: 'auto',
                    fontSize: 12,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    maxHeight: 240,
                }}>{message}</pre>

                <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                    <button
                        onClick={this.handleCopy}
                        style={{
                            padding: '10px 16px',
                            border: 'none',
                            borderRadius: 8,
                            background: '#FCD531',
                            cursor: 'pointer',
                            fontFamily: 'Inter, sans-serif',
                        }}
                    >
                        Скопіювати помилку
                    </button>
                    <button
                        onClick={() => { window.location.href = '/'; }}
                        style={{
                            padding: '10px 16px',
                            border: '1px solid #ccc',
                            borderRadius: 8,
                            background: '#fff',
                            cursor: 'pointer',
                            fontFamily: 'Inter, sans-serif',
                        }}
                    >
                        На головну
                    </button>
                </div>
            </div>
        );
    }
}

// Глобальні слухачі — ловлять навіть те, чого ErrorBoundary не бачить
// (помилки в обробниках подій, unhandled Promise rejections).
// Записують у localStorage.lastError, щоб можна було подивитись пост-фактум.
export function installGlobalErrorHandlers() {
    window.addEventListener('error', (event) => {
        persistError({
            type: 'window.error',
            message: event.message,
            source: event.filename,
            line: event.lineno,
            col: event.colno,
            stack: event.error?.stack,
        });
    });

    window.addEventListener('unhandledrejection', (event) => {
        const reason = event.reason;
        persistError({
            type: 'unhandledrejection',
            message: String(reason?.message ?? reason),
            stack: reason?.stack,
        });
    });
}
