import React, { useCallback, useEffect, useState } from "react";
import { getFomoData, initiateUnlock } from "../utils/api.js";
import "./DailyLimitBlock.css";

export function DailyLimitBlock({ data: initialData, shownMatchIds = [] }) {
    const [data, setData] = useState(initialData ?? null);
    const [loading, setLoading] = useState(!initialData);
    const [error, setError] = useState("");
    const [unlocking, setUnlocking] = useState(false);

    // Стан після успішного initiateUnlock
    const [paymentData, setPaymentData] = useState(null); // { comment_id, instruction, jar_url, amount }
    const [copied, setCopied] = useState(false);

    const shownMatchIdsKey = shownMatchIds.filter(Boolean).join(",");

    useEffect(() => {
        let cancelled = false;
        const ids = shownMatchIdsKey
            .split(",")
            .map(id => Number(id))
            .filter(Boolean);

        async function loadLimitData() {
            setLoading(true);
            setError("");

            try {
                const response = await getFomoData(ids);
                const nextData = response.ok ? await response.json().catch(() => null) : null;

                if (!cancelled) {
                    if (nextData) {
                        setData(nextData);
                    } else {
                        setError("Не вдалося отримати дані про ліміт.");
                    }
                }
            } catch {
                if (!cancelled) setError("Не вдалося отримати дані про ліміт.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        loadLimitData();

        return () => {
            cancelled = true;
        };
    }, [shownMatchIdsKey]);

    const {
        hidden_count = 0,
        best_score,
        daily_limit,
        daily_viewed,
        unlock_match_id,
    } = data ?? {};

    const hasHiddenProfiles = hidden_count > 0;
    const viewedText = daily_viewed ?? daily_limit;
    const canUnlock = Boolean(unlock_match_id);

    // ── Крок 1: ініціюємо платіж, показуємо інструкцію ──────────────────
    const handleUnlock = useCallback(async () => {
        if (!canUnlock || unlocking) return;

        setUnlocking(true);
        setError("");

        try {
            const response = await initiateUnlock(unlock_match_id);
            const result = response.ok ? await response.json().catch(() => null) : null;

            if (!response.ok || !result?.jar_url) {
                setError(result?.error || "Не вдалося створити платіж.");
                return;
            }

            // Показуємо інструкцію замість редіректу
            setPaymentData(result);
        } catch {
            setError("Не вдалося створити платіж.");
        } finally {
            setUnlocking(false);
        }
    }, [canUnlock, unlock_match_id, unlocking]);

    // ── Крок 2: юзер натискає "Перейти до оплати" ────────────────────────
    const handleGoToPay = useCallback(() => {
        if (paymentData?.jar_url) {
            window.location.href = paymentData.jar_url;
        }
    }, [paymentData]);

    // ── Копіювання comment_id ─────────────────────────────────────────────
    const handleCopy = useCallback(async () => {
        if (!paymentData?.comment_id) return;
        try {
            await navigator.clipboard.writeText(paymentData.comment_id);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // fallback для старих браузерів
            const el = document.createElement("textarea");
            el.value = paymentData.comment_id;
            document.body.appendChild(el);
            el.select();
            document.execCommand("copy");
            document.body.removeChild(el);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, [paymentData]);

    // ── Рендер інструкції після отримання paymentData ─────────────────────
    if (paymentData) {
        return (
            <section className="daily-limit-wrap" aria-live="polite">
                <div className="daily-limit-card">
                    <div className="daily-limit-kicker">Оплата</div>
                    <h2 className="daily-limit-title">Переказ на банку</h2>

                    <p className="daily-limit-desc">
                        Переведи{" "}
                        <strong>{paymentData.amount} грн</strong>{" "}
                        на банку та вкажи коментар нижче у призначенні платежу.
                        Без коментаря ми не зможемо підтвердити оплату.
                    </p>

                    {/* Блок з comment_id */}
                    <div className="daily-limit-comment-block">
                        <div className="daily-limit-comment-label">
                            Коментар до переказу
                        </div>
                        <div className="daily-limit-comment-row">
                            <code className="daily-limit-comment-id">
                                {paymentData.comment_id}
                            </code>
                            <button
                                className="daily-limit-btn daily-limit-btn-secondary daily-limit-btn-copy"
                                type="button"
                                onClick={handleCopy}
                            >
                                {copied ? "Скопійовано ✓" : "Копіювати"}
                            </button>
                        </div>
                    </div>

                    {error && <div className="daily-limit-error">{error}</div>}

                    <div className="daily-limit-actions">
                        <button
                            className="daily-limit-btn daily-limit-btn-primary"
                            type="button"
                            onClick={handleGoToPay}
                        >
                            Перейти до оплати →
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    // ── Основний рендер ───────────────────────────────────────────────────
    return (
        <section className="daily-limit-wrap" aria-live="polite">
            <div className="daily-limit-card">
                <div className="daily-limit-kicker">Денний ліміт</div>
                <h2 className="daily-limit-title">
                    Перегляди профілів на сьогодні вичерпано
                </h2>

                {loading ? (
                    <p className="daily-limit-desc">Оновлюємо дані про твій ліміт...</p>
                ) : (
                    <p className="daily-limit-desc">
                        {daily_limit
                            ? `Ти вже переглянув ${viewedText} із ${daily_limit} доступних профілів за своїм планом.`
                            : "Ти переглянув усі доступні на сьогодні профілі."}
                        {" "}Нові перегляди відкриються завтра.
                    </p>
                )}

                {hasHiddenProfiles && (
                    <div className="daily-limit-insight">
                        <div>
                            <span className="daily-limit-number">{hidden_count}</span>
                            <span className="daily-limit-label">
                                {plural(hidden_count, "профіль", "профілі", "профілів")} ще чекає
                            </span>
                        </div>
                        {best_score !== null && best_score !== undefined && (
                            <div>
                                <span className="daily-limit-number">{Math.round(best_score)}%</span>
                                <span className="daily-limit-label">найкраща сумісність</span>
                            </div>
                        )}
                    </div>
                )}

                {error && <div className="daily-limit-error">{error}</div>}

                <div className="daily-limit-actions">
                    <button
                        className="daily-limit-btn daily-limit-btn-primary"
                        type="button"
                        onClick={handleUnlock}
                        disabled={!canUnlock || unlocking || loading}
                    >
                        {unlocking ? "Створюємо платіж..." : "Розблокувати анкету"}
                    </button>
                </div>
            </div>
        </section>
    );
}

function plural(n, one, few, many) {
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod100 >= 11 && mod100 <= 19) return many;
    if (mod10 === 1) return one;
    if (mod10 >= 2 && mod10 <= 4) return few;
    return many;
}