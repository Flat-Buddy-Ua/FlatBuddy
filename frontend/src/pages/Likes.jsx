import React, { useCallback, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
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
    { key: "matches", get label() { return i18n.t("likes.tab_matches"); } },
    { key: "incoming", get label() { return i18n.t("likes.tab_incoming"); } },
    { key: "outgoing", get label() { return i18n.t("likes.tab_outgoing"); } },
];

function PersonCard({ user, score, dateLabel, actions, matchResultId }) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const photo = user?.photo;
    const name = `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() || t('likes.no_name');

    const handlePhotoClick = () => {
        if (matchResultId && user?.id) {
            navigate(`/buddies/${user.id}`);
            return;
        }

        if (user?.id) {
            navigate(`/users/${user.id}`);
        }
    };

    return (
        <div className="likes-card">
            <div
                className="likes-card-photo"
                style={{
                    ...(photo ? { backgroundImage: `url('${photo}')` } : {}),
                    cursor: "pointer"
                }}
                onClick={handlePhotoClick}
            >
                {!photo && <div className="likes-card-photo-placeholder">?</div>}
            </div>
            <div className="likes-card-body">
                <div className="likes-card-name">{name}</div>
                {score !== undefined && score !== null && (
                    <div className="likes-card-score">
                        {t('likes.compatibility')} <strong>{Math.round(score)}%</strong>
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
    const { t } = useTranslation();

    if (!localStorage.getItem("access_token")) {
        return <Navigate to="/" replace />;
    }

    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("matches");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [matches, setMatches] = useState([]);
    const [incoming, setIncoming] = useState([]);
    const [outgoing, setOutgoing] = useState([]);

    const [pendingId, setPendingId] = useState(null); // id юзера в процесі дії
    const [contactUser, setContactUser] = useState(null);

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
            setError(t('likes.error_load'));
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

    const handleOpenContacts = useCallback((user) => {
        setContactUser(user ?? null);
    }, []);

    const handleCloseContacts = useCallback(() => {
        setContactUser(null);
    }, []);

    // ── Рендер ───────────────────────────────────────────────────────────
    const counts = {
        matches: matches.length,
        incoming: incoming.length,
        outgoing: outgoing.length,
    };

    let body;
    if (loading) {
        body = <div className="likes-empty">{t('likes.loading')}</div>;
    } else if (error) {
        body = <div className="likes-empty">{error}</div>;
    } else if (activeTab === "matches") {
        body = matches.length === 0 ? (
            <div className="likes-empty">
                {t('likes.empty_matches')}
            </div>
        ) : (
            <div className="likes-grid">
                {matches.map((m) => (
                    <PersonCard
                        key={m.id}
                        user={m.other_user}
                        score={m.compatibility_score}
                        dateLabel={`${t('likes.match_from')} ${formatDate(m.matched_at)}`}
                        matchResultId={m.match_result_id}
                        actions={
                            <>
                                <button
                                    className="likes-btn"
                                    onClick={() => navigate(
                                        m.other_user?.id
                                            ? `/buddies/${m.other_user.id}`
                                            : "/buddies"
                                    )}
                                >
                                    {t('likes.to_feed')}
                                </button>
                                <button
                                    className="likes-btn"
                                    onClick={() => handleOpenContacts(m.other_user)}
                                >
                                    {t('likes.contacts')}
                                </button>
                            </>
                        }
                    />
                ))}
            </div>
        );
    } else if (activeTab === "incoming") {
        body = incoming.length === 0 ? (
            <div className="likes-empty">
                {t('likes.empty_incoming')}
            </div>
        ) : (
            <div className="likes-grid">
                {incoming.map((like) => {
                    const u = like.from_user;
                    return (
                        <PersonCard
                            key={like.id}
                            user={u}
                            dateLabel={`${t('likes.like_from')} ${formatDate(like.created_at)}`}
                            actions={
                                <button
                                    className="likes-btn primary"
                                    disabled={pendingId === u.id}
                                    onClick={() => handleLikeBack(u.id)}
                                >
                                    {pendingId === u.id ? "…" : t('likes.like_back')}
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
                {t('likes.empty_outgoing')}
            </div>
        ) : (
            <div className="likes-grid">
                {outgoing.map((like) => {
                    const u = like.to_user;
                    return (
                        <PersonCard
                            key={like.id}
                            user={u}
                            dateLabel={`${t('likes.like_from')} ${formatDate(like.created_at)}`}
                            actions={
                                <button
                                    className="likes-btn"
                                    disabled={pendingId === u.id}
                                    onClick={() => handleUnlike(u.id)}
                                >
                                    {pendingId === u.id ? "…" : t('likes.unlike')}
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
                <h1 className="likes-title">{t('likes.title')}</h1>

                <div className="likes-tabs">
                    {TABS.map((tabItem) => (
                        <button
                            key={tabItem.key}
                            className={`likes-tab ${activeTab === tabItem.key ? "is-active" : ""}`}
                            onClick={() => setActiveTab(tabItem.key)}
                        >
                            {tabItem.label}
                            <span className="likes-tab-count">{counts[tabItem.key]}</span>
                        </button>
                    ))}
                </div>

                {body}
            </main>

            {contactUser && (
                <div className="likes-contact-backdrop" onClick={handleCloseContacts}>
                    <div
                        className="likes-contact-modal"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="likes-contact-close"
                            onClick={handleCloseContacts}
                            aria-label={t('likes.close')}
                        >
                            ×
                        </button>
                        <div className="likes-contact-title">{t('likes.contacts')}</div>
                        <div className="likes-contact-name">
                            {`${contactUser?.first_name ?? ""} ${contactUser?.last_name ?? ""}`.trim() || t('likes.fallback_user')}
                        </div>
                        <div className="likes-contact-phone-label">{t('likes.phone_label')}</div>
                        <a
                            className="likes-contact-phone"
                            href={contactUser?.phone_number ? `tel:${contactUser.phone_number}` : undefined}
                        >
                            {contactUser?.phone_number || t('likes.no_phone')}
                        </a>
                        <div className="likes-contact-actions">
                            <button type="button" className="likes-btn primary" onClick={handleCloseContacts}>
                                {t('likes.close')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
