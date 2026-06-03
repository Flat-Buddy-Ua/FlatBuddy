import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./MatchModal.css";

export function MatchModal({ buddy, onClose }) {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const photo = buddy?.photos?.[0];

    const handleSeeMatches = () => {
        onClose();
        navigate("/likes");
    };

    return (
        <div className="match-modal-backdrop" onClick={onClose}>
            <div className="match-modal" onClick={(e) => e.stopPropagation()}>
                <div className="match-modal-title">{t("match_modal.title")}</div>
                <div className="match-modal-sub">
                    {t("match_modal.subtitle", { name: buddy?.name?.split(" ")[0] ?? t("match_modal.subtitle_fallback") })}
                </div>

                {photo && (
                    <div
                        className="match-modal-photo"
                        style={{ backgroundImage: `url('${photo}')` }}
                    />
                )}

                <div className="match-modal-actions">
                    <button
                        className="match-modal-btn primary"
                        onClick={handleSeeMatches}
                    >
                        {t("match_modal.see_matches")}
                    </button>
                    <button
                        className="match-modal-btn"
                        onClick={onClose}
                    >
                        {t("match_modal.keep_searching")}
                    </button>
                </div>
            </div>
        </div>
    );
}
