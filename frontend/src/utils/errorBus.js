// Простий event-bus для помилок. Заведено окремим модулем, щоб
// `console.error` / `window.onerror` / ErrorBoundary могли пушити сюди
// без імпорту React-компонентів.

const listeners = new Set();
const entries   = [];
const MAX_ENTRIES = 50;

function stringify(value) {
    if (value == null) return String(value);
    if (typeof value === 'string') return value;
    if (value instanceof Error) return value.stack || value.message;
    try { return JSON.stringify(value); } catch { return String(value); }
}

export function pushEntry(entry) {
    const enriched = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        at: new Date().toISOString(),
        url: window.location.href,
        ...entry,
    };
    entries.push(enriched);
    if (entries.length > MAX_ENTRIES) entries.shift();
    for (const l of listeners) l(entries.slice());
}

export function subscribe(listener) {
    listeners.add(listener);
    listener(entries.slice());
    return () => listeners.delete(listener);
}

export function clearEntries() {
    entries.length = 0;
    for (const l of listeners) l(entries.slice());
}

// ── Перехоплювачі ─────────────────────────────────────────────────────────

let installed = false;

export function installInterceptors() {
    if (installed) return;
    installed = true;

    const origError = console.error.bind(console);
    const origWarn  = console.warn.bind(console);

    console.error = (...args) => {
        pushEntry({ type: 'console.error', message: args.map(stringify).join(' ') });
        origError(...args);
    };
    console.warn = (...args) => {
        pushEntry({ type: 'console.warn', message: args.map(stringify).join(' ') });
        origWarn(...args);
    };

    window.addEventListener('error', (event) => {
        pushEntry({
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
        pushEntry({
            type: 'unhandledrejection',
            message: String(reason?.message ?? reason),
            stack: reason?.stack,
        });
    });
}
