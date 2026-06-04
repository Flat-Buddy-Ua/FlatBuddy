import React from 'react';
import i18n from "i18next";
import { pushEntry } from '../utils/errorBus.js';

export class ErrorBoundary extends React.Component {
    state = { error: null, info: null };

    static getDerivedStateFromError(error) {
        return { error };
    }

    componentDidCatch(error, info) {
        this.setState({ info });
        pushEntry({
            type: 'react.boundary',
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
        try { navigator.clipboard?.writeText?.(text); } catch { /* mobile / no clipboard */ }
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
                <h2 style={{ marginTop: 0 }}>{i18n.t("error_boundary.title")}</h2>
                <p>
                    {i18n.t("error_boundary.description_1")}{' '}
                    {i18n.t("error_boundary.description_2")}
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
                        {i18n.t("error_boundary.copy_btn")}
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
                        {i18n.t("error_boundary.home_btn")}
                    </button>
                </div>
            </div>
        );
    }
}
