// Простий event-bus для помилок. Заведено окремим модулем, щоб
// `console.error` / `window.onerror` / ErrorBoundary могли пушити сюди
// без імпорту React-компонентів.

const listeners   = new Set();
const entries     = [];
const MAX_ENTRIES = 50;

// Якщо одна й та сама помилка летить пачкою (типове для render-loop-у),
// не плодимо записи — оновлюємо лічильник на останньому збігу.
const DEDUPE_WINDOW_MS = 500;

function stringify(value) {
    if (value == null) return String(value);
    if (typeof value === 'string') return value;
    if (value instanceof Error) return value.stack || value.message;
    try { return JSON.stringify(value); } catch { return String(value); }
}

// Deferred-notify: збираємо всі synchronous push'и в одну порцію через
// queueMicrotask. Це не дає DebugPanel-listener-у самому стати ланкою
// нескінченного циклу setState, якщо помилка прилетіла з рендеру.
let notifyScheduled = false;

function scheduleNotify() {
    if (notifyScheduled) return;
    notifyScheduled = true;
    queueMicrotask(() => {
        notifyScheduled = false;
        const snapshot = entries.slice();
        for (const l of listeners) {
            try { l(snapshot); }
            catch (err) {
                // Не пишемо в bus — інакше нескінченний рекурсивний пуш.
                try { (console.__origError ?? console.error)(err); } catch {}
            }
        }
    });
}

export function pushEntry(entry) {
    const now = Date.now();
    const last = entries[entries.length - 1];

    const newType    = entry?.type    ?? 'unknown';
    const newMessage = entry?.message ?? '';

    // Дедуп: однакові за вікно — лише оновлюємо лічильник на існуючому.
    if (
        last
        && last.type === newType
        && last.message === newMessage
        && now - last.lastAtEpoch < DEDUPE_WINDOW_MS
    ) {
        last.count       = (last.count || 1) + 1;
        last.at          = new Date(now).toISOString();
        last.lastAtEpoch = now;
        scheduleNotify();
        return;
    }

    const enriched = {
        id: `${now}-${Math.random().toString(36).slice(2, 8)}`,
        at: new Date(now).toISOString(),
        lastAtEpoch: now,
        url: window.location.href,
        count: 1,
        ...entry,
    };

    entries.push(enriched);
    if (entries.length > MAX_ENTRIES) entries.shift();
    scheduleNotify();
}

export function subscribe(listener) {
    listeners.add(listener);
    listener(entries.slice());
    return () => listeners.delete(listener);
}

export function clearEntries() {
    entries.length = 0;
    scheduleNotify();
}

// ── Перехоплювачі ─────────────────────────────────────────────────────────

let installed = false;

export function installInterceptors() {
    if (installed) return;
    installed = true;

    const origError = console.error.bind(console);
    const origWarn  = console.warn.bind(console);

    // Зберігаємо оригінали окремо — щоб scheduleNotify() міг логувати
    // помилки listener-ів напряму в браузер, обходячи наш патч (інакше
    // — потенційний рекурсивний цикл).
    console.__origError = origError;
    console.__origWarn  = origWarn;

    console.error = (...args) => {
        try { pushEntry({ type: 'console.error', message: args.map(stringify).join(' ') }); }
        catch { /* не валимо оригінал, якщо bus сам поламається */ }
        origError(...args);
    };
    console.warn = (...args) => {
        try { pushEntry({ type: 'console.warn', message: args.map(stringify).join(' ') }); }
        catch { /* same */ }
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
