import React from "react";
import { useNavigate } from "react-router-dom";
import "./FomoBlock.css";

/**
 * FomoBlock
 * Показується коли безкоштовний юзер переглянув усі доступні картки.
 * data: { hidden_count: number, best_score: number | null }
 */
export function FomoBlock({ data }) {
    const navigate = useNavigate();
    const { hidden_count, best_score } = data ?? {};

    const hasFomo = hidden_count > 0;

    return (
        <div className="fomo-wrap">
            <div className="fomo-card">
                <div className="fomo-icon">🔒</div>

                {hasFomo ? (
                    <>
                        <h2 className="fomo-title">
                            Ще <span className="fomo-accent">{hidden_count}</span>{" "}
                            {plural(hidden_count, "збіг", "збіги", "збігів")} чекає на тебе
                        </h2>
                        {best_score !== null && best_score !== undefined && (
                            <p className="fomo-sub">
                                Найкращий скор сумісності серед прихованих —{" "}
                                <strong>{Math.round(best_score * 100)}%</strong>
                            </p>
                        )}
                        <p className="fomo-desc">
                            Безкоштовний план показує лише 5 найкращих збігів.
                            Перейди на преміум і знайди ідеального сусіда.
                        </p>
                    </>
                ) : (
                    <>
                        <h2 className="fomo-title">Нові збіги незабаром</h2>
                        <p className="fomo-desc">
                            Ти переглянув усі доступні анкети. Повертайся пізніше — ми
                            регулярно додаємо нових користувачів.
                        </p>
                    </>
                )}

                {hasFomo && (
                    <button
                        className="fomo-btn"
                        onClick={() => navigate("/profile/personal")}
                    >
                        Отримати преміум →
                    </button>
                )}
            </div>
        </div>
    );
}

/** Проста функція відмінювання числівників */
function plural(n, one, few, many) {
    const mod10  = n % 10;
    const mod100 = n % 100;
    if (mod100 >= 11 && mod100 <= 19) return many;
    if (mod10 === 1) return one;
    if (mod10 >= 2 && mod10 <= 4) return few;
    return many;
}
