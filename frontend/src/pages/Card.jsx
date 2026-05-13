import React, { useEffect, useState, useCallback } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Header } from "../components/Header.jsx";
import { fetchWithAuth, getMatches, markSeen, getFomoData } from "../utils/api.js";
import { adaptMatch } from "../utils/adaptMatch.js";
import { FomoBlock } from "../components/FomoBlock.jsx";
import "./Card.css";

const BASE_URL = import.meta.env.VITE_API_URL;

const REQUIRED_PROFILE_FIELDS = [
    "status", "cleanliness",
    "my_vibe", "buddy_vibe",
    "schedule", "sleep_schedule",
    "smoking", "extra_intro_version",
    "hobbies", "partying",
];
const REQUIRED_HOUSING_FIELDS = [
    "room_sharing_preference", "preferred_gender", "housing_status",
    "budget_min", "budget_max", "destination",
    "planned_duration", "move_in_date",
];

function isMissing(val) {
    if (val === null || val === undefined) return true;
    if (val === "") return true;
    if (Array.isArray(val) && val.length === 0) return true;
    return false;
}

function checkCompleteness(profile, housing, photos) {
    if (!profile || !housing) return false;
    if (!Array.isArray(photos) || photos.length === 0) return false;
    for (const f of REQUIRED_PROFILE_FIELDS) {
        if (isMissing(profile[f])) return false;
    }
    for (const f of REQUIRED_HOUSING_FIELDS) {
        if (isMissing(housing[f])) return false;
    }
    return true;
}

const SCORE_ROWS = [
    { key: "vibe",        label: "Характер та цілі" },
    { key: "hobbies",     label: "Захоплення"       },
    { key: "cleanliness", label: "Охайність"         },
    { key: "smoking",     label: "Куріння"           },
    { key: "partying",    label: "Вечірки / гості"   },
    { key: "schedule",    label: "Розклад"           },
    { key: "personality", label: "Інтровертність"    },
    { key: "political",   label: "Світогляд"         },
];

function scoreColor(val) {
    if (val >= 0.75) return "#3aaf6f";
    if (val >= 0.50) return "#F58A3D";
    return "#e04b3a";
}

function CompatibilityPanel({ buddy }) {
    const total = buddy.totalScore ?? 0;
    const scores = buddy.scores ?? {};

    return (
        <div className="bp-compat-panel">
            <div className="bp-compat-total">
                <div className="bp-compat-total-label">Загальна сумісність</div>
                <div
                    className="bp-compat-total-value"
                    style={{ color: scoreColor(total) }}
                >
                    {Math.round(total * 100)}%
                </div>
                <div className="bp-compat-total-bar-track">
                    <div
                        className="bp-compat-total-bar-fill"
                        style={{
                            width: `${Math.round(total * 100)}%`,
                            background: scoreColor(total),
                        }}
                    />
                </div>
            </div>

            <div className="bp-compat-divider" />

            <div className="bp-compat-rows">
                {SCORE_ROWS.map(({ key, label }) => {
                    const val = scores[key] ?? 0;
                    const pct = Math.round(val * 100);
                    return (
                        <div key={key} className="bp-compat-row">
                            <div className="bp-compat-row-label">{label}</div>
                            <div className="bp-compat-row-right">
                                <div className="bp-compat-bar-track">
                                    <div
                                        className="bp-compat-bar-fill"
                                        style={{
                                            width: `${pct}%`,
                                            background: scoreColor(val),
                                        }}
                                    />
                                </div>
                                <div
                                    className="bp-compat-row-pct"
                                    style={{ color: scoreColor(val) }}
                                >
                                    {pct}%
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function ProfileCard({ buddy }) {
    return (
        <div className="bp-wrap">
            {/* HERO */}
            <div className="bp-hero">
                <div className="bp-photo-stack">
                    <div
                        className="bp-photo-main"
                        style={{ backgroundImage: `url('${buddy.photos[0]}')` }}
                    />
                    <div className="bp-photo-row">
                        {buddy.photos.map((src, i) => (
                            <div
                                key={i}
                                className="bp-photo-thumb"
                                style={{ backgroundImage: `url('${src}')` }}
                            />
                        ))}
                    </div>
                </div>
                <div>
                    <h1 className="bp-name">{buddy.name}, {buddy.age}</h1>
                    <p className="bp-sub">{buddy.sub}</p>
                    <div className="bp-badges">
                        {buddy.badges.map((b, i) => (
                            <div key={i} className={`bp-badge ${b.kind === "yellow" ? "yellow" : b.kind === "outline" ? "outline" : ""}`}>
                                {b.text}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ABOUT */}
            <div className="bp-card">
                <h2>Про мене</h2>
                <p className="bp-bio">{buddy.myVibe}</p>
            </div>

            {/* LOOKING FOR */}
            <div className="bp-card">
                <h2>Кого шукаю</h2>
                <p className="bp-bio">{buddy.buddyVibe}</p>
            </div>

            {/* LIFESTYLE */}
            <div className="bp-card">
                <h2>Стиль життя</h2>

                <div className="bp-slider-row">
                    <div className="bp-label">Охайність</div>
                    <div className="bp-slider-track">
                        <div className="bp-slider-thumb" style={{ left: `${buddy.cleanlinessPct}%` }} />
                    </div>
                    <div className="bp-slider-labels"><span>Абсолютно неохайний</span><span>Чистюня</span></div>
                </div>

                <div className="bp-slider-row">
                    <div className="bp-label">Інтроверт ↔ Екстраверт</div>
                    <div className="bp-slider-track">
                        <div className="bp-slider-thumb" style={{ left: `${buddy.personalityPct}%` }} />
                    </div>
                    <div className="bp-slider-labels"><span>Інтроверт</span><span>Амбіверт</span><span>Екстраверт</span></div>
                </div>

                <div className="bp-row" style={{ marginTop: 8 }}>
                    <div>
                        <div className="bp-label">Розклад</div>
                        <div className="bp-val">{buddy.schedule}</div>
                    </div>
                    <div>
                        <div className="bp-label">Графік сну</div>
                        <div className="bp-val">{buddy.sleepSchedule}</div>
                    </div>
                    <div>
                        <div className="bp-label">Ставлення до куріння</div>
                        <div className="bp-val">{buddy.smokingLabel}</div>
                    </div>
                    <div>
                        <div className="bp-label">Ставлення до вечірок/гостей</div>
                        <div className="bp-val">{buddy.partyingLabel}</div>
                    </div>
                </div>
            </div>

            {/* POLITICAL */}
            <div className="bp-card">
                <h2>Світогляд</h2>

                <div className="bp-slider-row">
                    <div className="bp-label">Економічна ось — {buddy.politicalEconLabel}</div>
                    <div className="bp-slider-track">
                        <div className="bp-slider-thumb" style={{ left: `${buddy.politicalEconPct}%` }} />
                    </div>
                    <div className="bp-slider-labels"><span>Лівий</span><span>·</span><span>Правий</span></div>
                </div>

                <div className="bp-slider-row">
                    <div className="bp-label">Соціальна ось — {buddy.politicalSocLabel}</div>
                    <div className="bp-slider-track">
                        <div className="bp-slider-thumb" style={{ left: `${buddy.politicalSocPct}%` }} />
                    </div>
                    <div className="bp-slider-labels"><span>Ліберальний</span><span>·</span><span>Комунітарний</span></div>
                </div>
            </div>

            {/* LANGUAGES */}
            <div className="bp-card">
                <h2>Мови</h2>
                <div className="bp-tag-list">
                    {buddy.languages.map((l, i) => (
                        <span key={i} className="bp-tag">{l}</span>
                    ))}
                </div>
            </div>

            {/* HOBBIES */}
            <div className="bp-card">
                <h2>Захоплення / хобі</h2>
                <div className="bp-tag-list">
                    {buddy.hobbies.map((h, i) => (
                        <span key={i} className="bp-tag">{h}</span>
                    ))}
                    {buddy.customHobbies.map((h, i) => (
                        <span key={`c${i}`} className="bp-tag custom">{h}</span>
                    ))}
                </div>
            </div>

            {/* HOUSING */}
            <div className="bp-card">
                <h2>Житлові уподобання</h2>
                <div className="bp-housing-grid">
                    {buddy.housing.map(([label, val], i) => (
                        <div key={i} className="bp-housing-cell">
                            <div className="bp-label">{label}</div>
                            <div className="bp-val">{val}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function Card() {
    if (!localStorage.getItem("access_token")) {
        alert("Необхідний вхід у профіль");
        return <Navigate to="/" replace />;
    }

    const navigate = useNavigate();

    // ── стан профілю ──────────────────────────────────────────────────────
    const [loading,    setLoading]    = useState(true);
    const [isComplete, setIsComplete] = useState(false);

    // ── стан стрічки ──────────────────────────────────────────────────────
    const [matches,     setMatches]     = useState([]);   // адаптовані матчі
    const [index,       setIndex]       = useState(0);    // поточна картка
    const [feedLoading, setFeedLoading] = useState(false);
    const [fomoData,    setFomoData]    = useState(null); // { hidden_count, best_score }

    // ── завантаження повноти профілю ──────────────────────────────────────
    useEffect(() => {
        let cancelled = false;

        async function loadAndCheck() {
            try {
                const [profileRes, housingRes, photosRes] = await Promise.all([
                    fetchWithAuth(`${BASE_URL}/api/profile/personal/`),
                    fetchWithAuth(`${BASE_URL}/api/profile/housing/`),
                    fetchWithAuth(`${BASE_URL}/api/profile/photos/`),
                ]);

                const profile = profileRes.ok ? await profileRes.json() : null;
                const housing = housingRes.ok ? await housingRes.json() : null;
                const photos  = photosRes.ok  ? await photosRes.json() : [];

                if (cancelled) return;
                setIsComplete(checkCompleteness(profile, housing, photos));
            } catch (e) {
                if (!cancelled) setIsComplete(false);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        loadAndCheck();
        return () => { cancelled = true; };
    }, []);

    // ── завантаження стрічки матчів ───────────────────────────────────────
    useEffect(() => {
        if (!isComplete) return;

        let cancelled = false;
        setFeedLoading(true);

        getMatches()
            .then(r => r.ok ? r.json() : [])
            .then(raw => {
                if (cancelled) return;
                setMatches(raw.map(adaptMatch));
                setIndex(0);
            })
            .catch(() => { if (!cancelled) setMatches([]); })
            .finally(() => { if (!cancelled) setFeedLoading(false); });

        return () => { cancelled = true; };
    }, [isComplete]);

    // ── навігація: наступна картка ────────────────────────────────────────
    const handleNext = useCallback(async () => {
        const current = matches[index];
        if (current) {
            await markSeen(current.id).catch(() => {});
        }

        const nextIndex = index + 1;

        if (nextIndex >= matches.length) {
            // Кінець стрічки — спробуємо отримати FOMO
            try {
                const r = await getFomoData();
                if (r.ok) setFomoData(await r.json());
                else      setFomoData({ hidden_count: 0, best_score: null });
            } catch {
                setFomoData({ hidden_count: 0, best_score: null });
            }
        } else {
            setIndex(nextIndex);
        }
    }, [matches, index]);

    // ── рендер ────────────────────────────────────────────────────────────
    const isBlurred  = loading || !isComplete;
    const showGate   = !loading && !isComplete;
    const currentBuddy = matches[index] ?? null;

    return (
        <>
            <div className={`bp-page ${isBlurred ? "is-blurred" : ""}`}>
                <Header />
                <main className="bp-main">
                    {feedLoading && (
                        <div className="bp-feed-loading">Завантаження…</div>
                    )}

                    {!feedLoading && fomoData !== null && (
                        <FomoBlock data={fomoData} />
                    )}

                    {!feedLoading && fomoData === null && currentBuddy && (
                        <>
                            <div className="bp-feed-layout">
                                <ProfileCard buddy={currentBuddy} />
                                <CompatibilityPanel buddy={currentBuddy} />
                            </div>
                            <div className="bp-nav">
                                <button className="bp-nav-btn" onClick={handleNext}>
                                    Далі →
                                </button>
                            </div>
                        </>
                    )}

                    {!feedLoading && fomoData === null && !currentBuddy && matches.length === 0 && (
                        <div className="bp-empty">
                            Поки немає нових збігів. Зайди пізніше 👋
                        </div>
                    )}
                </main>
            </div>

            {showGate && (
                <div className="bp-gate">
                    <div className="bp-gate-card">
                        <h2>Перевір заповненість профілю</h2>
                        <button
                            className="bp-gate-btn"
                            onClick={() => navigate("/profile/personal")}
                        >
                            Перейти до заповнення
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
