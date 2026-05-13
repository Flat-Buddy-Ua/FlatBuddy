import React from "react";
import { useNavigate } from "react-router-dom";
import "./MatchModal.css";

export function MatchModal({ buddy, onClose }) {
    const navigate = useNavigate();
    const photo = buddy?.photos?.[0];

    const handleSeeMatches = () => {
        onClose();
        navigate("/likes");
    };

    return (
        <div className="match-modal-backdrop" onClick={onClose}>
            <div className="match-modal" onClick={(e) => e.stopPropagation()}>
                <div className="match-modal-title">Це матч!</div>
                <div className="match-modal-sub">
                    Ви з {buddy?.name?.split(" ")[0] ?? "цією людиною"} обоє поставили лайк.
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
                        Переглянути матчі
                    </button>
                    <button
                        className="match-modal-btn"
                        onClick={onClose}
                    >
                        Продовжити пошук
                    </button>
                </div>
            </div>
        </div>
    );
}
