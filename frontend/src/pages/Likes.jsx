import React, { useCallback, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Header } from "../components/Header.jsx";
import {
    getIncomingLikes,
    getOutgoingLikes,
    getUserMatches,
    likeUser,
    unlikeUser,
} from "../utils/api.js";
import "./Likes.css";

const TABS = [
    { key: "matches",  label: "Матчі"     },
    { key: "incoming", label: "Хто лайкнув мене" },
    { key: "outgoing", label: "Кого я лайкнув"   },
];

function PersonCard({ user, score, dateLabel, actions }) {
    const photo = user?.photo;
    const name  = `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() || "Без імені";

    return (
        <div className="likes-card">
            <div
                className="likes-card-photo"
                style={photo ? { backgroundImage: `url('${photo}')` } : undefined}
            >
                {!photo && <div className="likes-card-photo-placeholder">?</div>}
            </div>
            <div className="likes-card-body">
                <div className="likes-card-name">{name}</div>
                {score !== undefined && score !== null && (
                    <div className="likes-card-score">
                        Сумісність: <strong>{Math.round(score)}%</strong>
                    </div>
                )}
                {dateLabel && (
                    <div className="likes-card-date">{dateLabel}</div>
                )}
                {actions && <div className="likes-card-actions">{actions}</div>}
            </div>
        </div>
    );
}

function formatDate(iso) {
    if (!iso) return "";
    try {
        const d = new Date(iso);
        return d.toLocaleDateString("uk-UA", {
            day: "2-digit", month: "2-digit", year: "numeric",
        });
    } catch {
        return "";
    }
}

export function Likes() {
    if (!localStorage.getItem("access_token")) {
        return <Navigate to="/" replace />;
    }

    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("matches");
    const [loading,   setLoading]   = useState(false);
    const [error,     setError]     = useState(null);

    const [matches,  setMatches]  = useState([]);
    const [incoming, setIncoming] = useState([]);
    const [outgoing, setOutgoing] = useState([]);

    const [pendingId, setPendingId] = useState(null); // id юзера в процесі дії

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [mRes, iRes, oRes] = await Promise.all([
                getUserMatches(),
                getIncomingLikes(),
                getOutgoingLikes(),
            ]);
            const m = mRes.ok ? await mRes.json() : [];
            const i = iRes.ok ? await iRes.json() : [];
            const o = oRes.ok ? await oRes.json() : [];
            setMatches(Array.isArray(m) ? m : []);
            setIncoming(Array.isArray(i) ? i : []);
            setOutgoing(Array.isArray(o) ? o : []);
        } catch (e) {
            setError("Не вдалось завантажити дані. Спробуй пізніше.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    // ── Дії ──────────────────────────────────────────────────────────────
    const handleLikeBack = useCallback(async (userId) => {
        if (pendingId) return;
        setPendingId(userId);
        try {
            await likeUser(userId);
            await load();
        } finally {
            setPendingId(null);
        }
    }, [load, pendingId]);

    const handleUnlike = useCallback(async (userId) => {
        if (pendingId) return;
        setPendingId(userId);
        try {
            await unlikeUser(userId);
            await load();
        } finally {
            setPendingId(null);
        }
    }, [load, pendingId]);

    // ── Рендер ───────────────────────────────────────────────────────────
    const counts = {
        matches:  matches.length,
        incoming: incoming.length,
        outgoing: outgoing.length,
    };

    let body;
    if (loading) {
        body = <div className="likes-empty">Завантаження…</div>;
    } else if (error) {
        body = <div className="likes-empty">{error}</div>;
    } else if (activeTab === "matches") {
        body = matches.length === 0 ? (
            <div className="likes-empty">
                Поки що жодного матчу. Лайкай профілі — і коли хтось відповість тим самим, вони з'являться тут.
            </div>
        ) : (
            <div className="likes-grid">
                {matches.map((m) => (
                    <PersonCard
                        key={m.id}
                        user={m.other_user}
                        score={m.compatibility_score}
                        dateLabel={`Матч від ${formatDate(m.matched_at)}`}
                        actions={
                            <button
                                className="likes-btn"
                                onClick={() => navigate(
                                    m.match_result_id
                                        ? `/buddies/${m.match_result_id}`
                                        : "/buddies"
                                )}
                            >
                                До стрічки
                            </button>
                        }
                    />
                ))}
            </div>
        );
    } else if (activeTab === "incoming") {
        body = incoming.length === 0 ? (
            <div className="likes-empty">
                Поки що тебе ніхто не лайкнув. Заповни профіль — це сильно допомагає.
            </div>
        ) : (
            <div className="likes-grid">
                {incoming.map((like) => {
                    const u = like.from_user;
                    return (
                        <PersonCard
                            key={like.id}
                            user={u}
                            dateLabel={`Лайк від ${formatDate(like.created_at)}`}
                            actions={
                                <button
                                    className="likes-btn primary"
                                    disabled={pendingId === u.id}
                                    onClick={() => handleLikeBack(u.id)}
                                >
                                    {pendingId === u.id ? "…" : "Лайкнути у відповідь ♥"}
                                </button>
                            }
                        />
                    );
                })}
            </div>
        );
    } else {
        body = outgoing.length === 0 ? (
            <div className="likes-empty">
                Ти ще нікого не лайкнув. Зайди в стрічку і починай.
            </div>
        ) : (
            <div className="likes-grid">
                {outgoing.map((like) => {
                    const u = like.to_user;
                    return (
                        <PersonCard
                            key={like.id}
                            user={u}
                            dateLabel={`Лайк від ${formatDate(like.created_at)}`}
                            actions={
                                <button
                                    className="likes-btn"
                                    disabled={pendingId === u.id}
                                    onClick={() => handleUnlike(u.id)}
                                >
                                    {pendingId === u.id ? "…" : "Скасувати лайк"}
                                </button>
                            }
                        />
                    );
                })}
            </div>
        );
    }

    return (
        <>
            <Header />
            <main className="likes-page">
                <h1 className="likes-title">Лайки</h1>

                <div className="likes-tabs">
                    {TABS.map((t) => (
                        <button
                            key={t.key}
                            className={`likes-tab ${activeTab === t.key ? "is-active" : ""}`}
                            onClick={() => setActiveTab(t.key)}
                        >
                            {t.label}
                            <span className="likes-tab-count">{counts[t.key]}</span>
                        </button>
                    ))}
                </div>

                {body}
            </main>
        </>
    );
}
