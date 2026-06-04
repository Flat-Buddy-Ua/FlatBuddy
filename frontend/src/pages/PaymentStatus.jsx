import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPaymentStatus } from "../utils/api.js";
import "./PaymentStatus.css";

const POLL_INTERVAL = 4000;  // 4 секунди
const MAX_POLLS     = 30;    // максимум 2 хвилини

export function PaymentStatus() {
    const { commentId } = useParams();
    const navigate      = useNavigate();

    const [status,    setStatus]    = useState("pending"); // pending | paid | expired | error
    const [pollCount, setPollCount] = useState(0);
    const [loading,   setLoading]   = useState(true);

    const check = useCallback(async () => {
        try {
            const r    = await getPaymentStatus(commentId);
            const data = r.ok ? await r.json().catch(() => null) : null;

            if (!data) { setStatus("error"); return; }

            setStatus(data.status);
            return data.status;
        } catch {
            setStatus("error");
            return "error";
        } finally {
            setLoading(false);
        }
    }, [commentId]);

    useEffect(() => {
        let timer;

        async function poll() {
            const s = await check();

            if (s === "paid" || s === "expired" || s === "error") return;

            setPollCount(prev => {
                const next = prev + 1;
                if (next >= MAX_POLLS) {
                    setStatus("timeout");
                    return next;
                }
                timer = setTimeout(poll, POLL_INTERVAL);
                return next;
            });
        }

        poll();
        return () => clearTimeout(timer);
    }, [check]);

    const STATES = {
        pending: {
            icon:  "⏳",
            kicker: "Очікуємо оплату",
            title: "Перевіряємо платіж…",
            desc:  "Це займає до 2 хвилин. Не закривай сторінку.",
            color: "#F58A3D",
        },
        paid: {
            icon:  "✅",
            kicker: "Успішно",
            title: "Оплату підтверджено!",
            desc:  "Анкету розблоковано. Можеш переглянути профіль.",
            color: "#3aaf6f",
        },
        expired: {
            icon:  "⏰",
            kicker: "Прострочено",
            title: "Час оплати вийшов",
            desc:  "Замовлення скасовано. Спробуй ще раз.",
            color: "#aaa",
        },
        error: {
            icon:  "❌",
            kicker: "Помилка",
            title: "Щось пішло не так",
            desc:  "Не вдалося перевірити статус. Зверніться до підтримки.",
            color: "#e04b3a",
        },
        timeout: {
            icon:  "🔄",
            kicker: "Затримка",
            title: "Оплата ще не підтверджена",
            desc:  "Якщо ти вже заплатив — зачекай ще кілька хвилин і оновіть сторінку. Якщо ні — спробуй ще раз.",
            color: "#F58A3D",
        },
    };

    const state = STATES[status] ?? STATES.error;

    return (
        <div className="ps-wrap">
            <div className="ps-card">
                <div className="ps-kicker" style={{ background: `${state.color}22`, color: state.color }}>
                    {state.kicker}
                </div>

                <div className="ps-icon">
                    {status === "pending" && loading === false
                        ? <span className="ps-spinner" />
                        : state.icon}
                </div>

                <h2 className="ps-title">{state.title}</h2>
                <p  className="ps-desc">{state.desc}</p>

                {status === "pending" && (
                    <div className="ps-progress">
                        <div
                            className="ps-progress-fill"
                            style={{ width: `${Math.min((pollCount / MAX_POLLS) * 100, 100)}%` }}
                        />
                    </div>
                )}

                <div className="ps-actions">
                    {status === "paid" && (
                        <button
                            className="ps-btn ps-btn-primary"
                            onClick={() => navigate("/buddies")}
                        >
                            Переглянути профіль →
                        </button>
                    )}

                    {(status === "expired" || status === "error" || status === "timeout") && (
                        <button
                            className="ps-btn ps-btn-secondary"
                            onClick={() => navigate("/buddies")}
                        >
                            Повернутись
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}