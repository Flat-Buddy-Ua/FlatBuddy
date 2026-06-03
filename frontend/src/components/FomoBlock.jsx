import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./FomoBlock.css";

/**
 * FomoBlock
 * Показується коли безкоштовний юзер переглянув усі доступні картки.
 * data: { hidden_count: number, best_score: number | null }
 */
export function FomoBlock({ data }) {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { hidden_count, best_score } = data ?? {};

    const hasFomo = hidden_count > 0;

    return (
        <div className="fomo-wrap">
            <div className="fomo-card">
                <div className="fomo-icon">🔒</div>

                {hasFomo ? (
                    <>
                        <h2 className="fomo-title">
                            {t("fomo_block.matches_waiting_prefix")}{" "}
                            <span className="fomo-accent">{hidden_count}</span>{" "}
                            {plural(
                                hidden_count,
                                t("fomo_block.match_one", "збіг чекає на тебе"),
                                t("fomo_block.match_few", "збіги чекають на тебе"),
                                t("fomo_block.match_many", "збігів чекають на тебе")
                            )}
                        </h2>
                        {best_score !== null && best_score !== undefined && (
                            <p className="fomo-sub">
                                {t("fomo_block.best_score_hidden")}{" "}
                                <strong>{Math.round(best_score)}%</strong>
                            </p>
                        )}
                        <p className="fomo-desc">
                            {t("fomo_block.free_plan_desc")}
                        </p>
                    </>
                ) : (
                    <>
                        <h2 className="fomo-title">{t("fomo_block.new_matches_soon")}</h2>
                        <p className="fomo-desc">
                            {t("fomo_block.viewed_all_desc")}
                        </p>
                    </>
                )}

                {hasFomo && (
                    <button
                        className="fomo-btn"
                        onClick={() => navigate("/profile/personal")}
                    >
                        {t("fomo_block.get_premium_btn")}
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
