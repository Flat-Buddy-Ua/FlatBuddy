import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getFomoData, initiateUnlock } from "../utils/api.js";
import "./DailyLimitBlock.css";

import { useNavigate } from "react-router-dom";

export function DailyLimitBlock({ data: initialData, shownMatchIds = [] }) {
    const { t } = useTranslation();
    const [data, setData] = useState(initialData ?? null);
    const [loading, setLoading] = useState(!initialData);
    const [error, setError] = useState("");
    const [unlocking, setUnlocking] = useState(false);

    // Стан після успішного initiateUnlock
    const [paymentData, setPaymentData] = useState(null); // { comment_id, instruction, jar_url, amount }
    const [copied, setCopied] = useState(false);

    const shownMatchIdsKey = shownMatchIds.filter(Boolean).join(",");

    const navigate = useNavigate();

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
                        setError(t("daily_limit_block.error_limit_data"));
                    }
                }
            } catch {
                if (!cancelled) setError(t("daily_limit_block.error_limit_data"));
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
                setError(result?.error || t("daily_limit_block.error_payment"));
                return;
            }

            // Показуємо інструкцію замість редіректу
            setPaymentData(result);
        } catch {
            setError(t("daily_limit_block.error_payment"));
        } finally {
            setUnlocking(false);
        }
    }, [canUnlock, unlock_match_id, unlocking]);

    // ── Крок 2: юзер натискає "Перейти до оплати" ────────────────────────
    const handleGoToPay = useCallback(() => {
        if (paymentData?.jar_url) {
            window.open(paymentData.jar_url, '_blank');
            navigate(`/payment/status/${paymentData.comment_id}`);
        }
    }, [paymentData, navigate]);

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
                    <div className="daily-limit-kicker">{t("daily_limit_block.payment_kicker")}</div>
                    <h2 className="daily-limit-title">{t("daily_limit_block.transfer_bank")}</h2>

                    <p className="daily-limit-desc">
                        {t("daily_limit_block.transfer_action")}{" "}
                        <strong>{paymentData.amount} {t("daily_limit_block.currency")}</strong>{" "}
                        {t("daily_limit_block.transfer_desc_1")}{" "}
                        {t("daily_limit_block.transfer_desc_2")}
                    </p>

                    {/* Блок з comment_id */}
                    <div className="daily-limit-comment-block">
                        <div className="daily-limit-comment-label">
                            {t("daily_limit_block.transfer_comment_label")}
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
                                {copied ? t("daily_limit_block.copied") : t("daily_limit_block.copy")}
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
                            {t("daily_limit_block.go_to_payment")}
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
                <div className="daily-limit-kicker">{t("daily_limit_block.daily_limit_kicker")}</div>
                <h2 className="daily-limit-title">
                    {t("daily_limit_block.views_exhausted")}
                </h2>

                {loading ? (
                    <p className="daily-limit-desc">{t("daily_limit_block.updating_limit")}</p>
                ) : (
                    <p className="daily-limit-desc">
                        {daily_limit
                            ? t("daily_limit_block.viewed_x_of_y", { viewed: viewedText, total: daily_limit })
                            : t("daily_limit_block.viewed_all")}
                        {" "}{t("daily_limit_block.new_views_tomorrow")}
                    </p>
                )}

                {hasHiddenProfiles && (
                    <div className="daily-limit-insight">
                        <div>
                            <span className="daily-limit-label">
                                {t("daily_limit_block.profiles_waiting", { count: hidden_count })}
                            </span>
                        </div>
                        {best_score !== null && best_score !== undefined && (
                            <div>
                                <span className="daily-limit-number">{Math.round(best_score)}%</span>
                                <span className="daily-limit-label">{t("daily_limit_block.best_compatibility")}</span>
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
                        {unlocking ? t("daily_limit_block.creating_payment") : t("daily_limit_block.unlock_profile")}
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