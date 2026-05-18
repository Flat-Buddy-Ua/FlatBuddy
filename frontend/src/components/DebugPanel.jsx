import React, { useEffect, useState } from 'react';
import { subscribe, clearEntries } from '../utils/errorBus.js';

// Плаваюча панель для перегляду помилок, які зазвичай видно тільки
// у DevTools. Невидима, поки нічого не сталось. На першу помилку
// зʼявляється червоний значок з лічильником; клік — розгортається.

export function DebugPanel() {
    const [entries, setEntries] = useState([]);
    const [open, setOpen] = useState(false);

    useEffect(() => subscribe(setEntries), []);

    const count = entries.length;
    if (count === 0 && !open) return null;

    const handleCopy = () => {
        const text = JSON.stringify(entries, null, 2);
        try { navigator.clipboard?.writeText?.(text); }
        catch { /* no clipboard — пофіг */ }
    };

    return (
        <>
            <button
                onClick={() => setOpen(o => !o)}
                aria-label="Помилки на сторінці"
                style={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                    zIndex: 999999,
                    background: '#e04b3a',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 24,
                    padding: '10px 14px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                }}
            >
                ⚠ Помилки: {count}
            </button>

            {open && (
                <div style={{
                    position: 'fixed',
                    bottom: 72,
                    right: 16,
                    zIndex: 999999,
                    width: 420,
                    maxWidth: '95vw',
                    maxHeight: '70vh',
                    background: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: 12,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    fontFamily: 'Inter, sans-serif',
                }}>
                    <div style={{
                        padding: '10px 12px',
                        borderBottom: '1px solid #eee',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: '#fafafa',
                    }}>
                        <strong style={{ fontSize: 14 }}>
                            Помилки на сторінці ({count})
                        </strong>
                        <div style={{ display: 'flex', gap: 6 }}>
                            <PanelBtn onClick={handleCopy}>Копіювати все</PanelBtn>
                            <PanelBtn onClick={clearEntries}>Очистити</PanelBtn>
                            <PanelBtn onClick={() => setOpen(false)}>×</PanelBtn>
                        </div>
                    </div>

                    <div style={{ overflow: 'auto', padding: 8 }}>
                        {entries.length === 0 && (
                            <div style={{ color: '#888', padding: 12 }}>
                                Поки що помилок нема.
                            </div>
                        )}
                        {entries.slice().reverse().map(e => (
                            <ErrorEntry key={e.id} entry={e} />
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}

function PanelBtn({ onClick, children }) {
    return (
        <button
            onClick={onClick}
            style={{
                padding: '4px 10px',
                border: '1px solid #ccc',
                borderRadius: 6,
                background: '#fff',
                cursor: 'pointer',
                fontSize: 12,
                fontFamily: 'Inter, sans-serif',
            }}
        >
            {children}
        </button>
    );
}

function ErrorEntry({ entry }) {
    const [expanded, setExpanded] = useState(false);
    const time = new Date(entry.at).toLocaleTimeString();

    return (
        <div
            onClick={() => setExpanded(x => !x)}
            style={{
                marginBottom: 6,
                padding: 8,
                background: '#fbf3f2',
                border: '1px solid #f5d6d1',
                borderRadius: 6,
                fontSize: 12,
                cursor: 'pointer',
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <strong style={{ color: '#a02414' }}>
                    {entry.type}
                    {entry.count > 1 && (
                        <span style={{ color: '#888', fontWeight: 400 }}> ×{entry.count}</span>
                    )}
                </strong>
                <span style={{ color: '#888', fontSize: 11 }}>{time}</span>
            </div>
            <pre style={{
                margin: '4px 0 0 0',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                maxHeight: expanded ? 'none' : 60,
                overflow: 'hidden',
            }}>{entry.message}</pre>
            {expanded && entry.stack && (
                <pre style={{
                    margin: '8px 0 0 0',
                    fontSize: 11,
                    color: '#555',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                }}>{entry.stack}</pre>
            )}
            {expanded && entry.componentStack && (
                <pre style={{
                    margin: '8px 0 0 0',
                    fontSize: 11,
                    color: '#555',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                }}>{entry.componentStack}</pre>
            )}
            {expanded && entry.url && (
                <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>
                    {entry.url}
                </div>
            )}
        </div>
    );
}
