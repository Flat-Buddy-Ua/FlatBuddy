import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Header } from "../components/Header.jsx";
import { fetchWithAuth } from "../utils/api.js";
import "./BuddiesPage.css";

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

const DEMO_BUDDY = {
    name: "Роман Яцишин",
    age: 19,
    photos: [
        "http://flatbuddyua.com/media/user_photos/user_53/photo_2025-11-10_13-54-55.jpg",
        "http://flatbuddyua.com/media/user_photos/user_53/photo_2025-12-14_01-15-19.jpg",
        "http://flatbuddyua.com/media/user_photos/user_53/photo_2026-01-05_12-42-46.jpg",
    ],
    sub: "Львів · Студент і працюю · STEM та IT",
    badges: [
        { kind: "yellow", text: "Шукає квартиру та сусіда" },
        { kind: "default", text: "Бюджет 7 000–10 000 ₴" },
        { kind: "outline", text: "Львів — Личаківський, Галицький, Залізничний, Сихівський, Франківський, Шевченківський" },
    ],
    myVibe:
        "Студент 2-го курсу Львівської політехніки, спеціальність — програмна інженерія. Паралельно з навчанням працюю фронтенд-розробником на парт-тайм у невеликій продуктовій команді, тому половина дня — пари, друга половина — код. По вечорах і на вихідних сідаю на велосипед і їжджу від Високого Замку до Винників — це мій спосіб скинути голову. Не курю в квартирі, до людей довкола ставлюсь без зайвого драматизму, можу мовчати поряд цілий день і це нормально.",
    buddyVibe:
        "Шукаю співмешканця приблизно мого віку (18–25), бажано теж студента або айтівця. Найважливіше — щоб людина була охайна на спільних зонах (кухня, ванна) і поважала особистий простір: я не люблю гучних компаній серед буднього вечора, але якщо запросиш друзів на вихідних — це нормально. Стать не принципова. Готовий ділити кімнату, якщо квартира гарна і ціна того варта. Романтичних відносин не шукаю, тільки рівне сусідство.",
    cleanlinessPct: 80,
    personalityPct: 100,
    schedule: "Пари 08:30–14:00, робота 15:00–19:00. Вечорами вдома або на велосипеді.",
    sleepSchedule: "Лягаю 23:30–00:30, встаю 07:30.",
    smokingLabel: "Іноді палю",
    partyingLabel: "Це не проблема для мене",
    politicalEconLabel: "Центрист",
    politicalEconPct: 47.5,
    politicalSocLabel: "Центрист",
    politicalSocPct: 52.5,
    languages: [
        "🇬🇧 English",
        "🇺🇦 Українська",
        "🇵🇱 Polski",
    ],
    hobbies: ["Велоспорт"],
    customHobbies: [],
    housing: [
        ["Преференція", "Mені комфортно ділити кімнату з співмешканцем"],
        ["З ким готовий жити", "Не має значення"],
        ["Ситуація", "Я шукаю квартиру та співмешканця"],
        ["Бюджет", "7 000 – 10 000 ₴"],
        ["Місто", "Львів"],
        ["Бажані райони", "Личаківський, Галицький, Залізничний, Сихівський, Франківський, Шевченківський"],
        ["Термін проживання", "Від 6 до 12 місяців"],
        ["Дата заселення", "04.05.2026"],
        ["Тваринка", "—"],
    ],
    email: "roman.yatsyshyn.shi.2024@lpnu.ua",
    phone: "+38 (096) 996-52-30",
};

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

            {/* CONTACT */}
            <div className="bp-card">
                <h2>Контакти</h2>
                <div className="bp-row">
                    <div>
                        <div className="bp-label">Email</div>
                        <div className="bp-val">{buddy.email}</div>
                    </div>
                    <div>
                        <div className="bp-label">Телефон</div>
                        <div className="bp-val">{buddy.phone}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function BuddiesPage() {
    if (!localStorage.getItem("access_token")) {
        alert("Необхідний вхід у профіль");
        return <Navigate to="/" replace />;
    }

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [isComplete, setIsComplete] = useState(false);

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
                const photos = photosRes.ok ? await photosRes.json() : [];

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

    const isBlurred = loading || !isComplete;
    const showGate = !loading && !isComplete;

    return (
        <>
            <div className={`bp-page ${isBlurred ? "is-blurred" : ""}`}>
                <Header />
                <main className="bp-main">
                    <ProfileCard buddy={DEMO_BUDDY} />
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
