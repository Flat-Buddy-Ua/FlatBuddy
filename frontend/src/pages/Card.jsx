import React, { use, useEffect, useState } from "react";
import { Header } from "../components/Header.jsx";
import { useLocation } from "react-router-dom";

export function Card({ onGoHome, onLoginClick, onFindRoommate }) {
    const [cardData, setCardData] = useState(null);
    const [photoIndex, setPhotoIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const location = useLocation();
    const [showWaitListMessage, setShowWaitListMessage] = useState(false);
    // Фолбек фото (якщо API не працює)
    const fallbackPhotos = [
        "/img/photo_2025-11-10_13-54-55.jpg",
        "/img/photo_2025-12-14_01-15-19.jpg",
        "/img/photo_2026-01-05_12-42-46.jpg",
    ];

    useEffect(() => {
        // Симуляція запиту або реальний запит
        fetch("/api/card")
            .then((response) => response.json())
            .then((data) => setCardData(data))
            .catch((error) => console.error("Error fetching card data:", error));
    }, []);

    useEffect(() => {
        if (location.state?.justRegistered) {
            setShowWaitListMessage(true);
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, [location]);

    const photosFromApi = cardData?.photos || cardData?.images || [];
    const photos = Array.isArray(photosFromApi) && photosFromApi.length > 0
            ? photosFromApi
            : fallbackPhotos;

    useEffect(() => {
        setPhotoIndex(0);
    }, [photos.length]);

    const nextPhoto = (e) => {
        e.stopPropagation(); // Щоб клік не перегортав картку
        setPhotoIndex((prev) => (prev + 1) % photos.length);
    };

    const prevPhoto = (e) => {
        e.stopPropagation();
        setPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
    };

    // Фолбек дані
    const fallbackData = {
        title: "Роман, 19",
        description: "Шукаю сусіда для оренди 2-кімнатної квартири на Подолі. Бюджет до 10к.",
        moreInfo: "Працюю айтішником з дому.\nЛюблю чистоту, але без фанатизму.\nНа вихідних граю в настолки.\nБез тварин.\nПалю на балконі.",
    };

    const title = cardData?.title || fallbackData.title;
    const description = cardData?.description || fallbackData.description;
    const moreInfo = cardData?.moreInfo || fallbackData.moreInfo;

    const styles = {
        banner: {
            paddingTop: '24px',
            marginBottom: '32px', // Відступ до картки
            width: '100%',
            textAlign: 'center',
            animation: 'slideDown 0.4s ease-out forwards',
            fontFamily: "'Inter', sans-serif",
        },
        bannerTitle: {
            fontFamily: "Seenonim",
            margin: '0 0 12px 0',
            fontSize: '72px',
            color: 'black',
        },
        bannerText: {
            fontSize: '15px',
            color: '#555',
            lineHeight: '1.4',
            marginBottom: '20px',
        },
        bannerBtn: {
            backgroundColor: '#FCD531',
            border: '2px solid black',
            boxShadow: '3px 3px 0px black',
            padding: '8px 24px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontFamily: "'Inter', sans-serif",
        }
    };

    // Додаємо анімацію виїзду зверху
    if (typeof document !== 'undefined' && !document.getElementById('banner-animations')) {
        const styleSheet = document.createElement("style");
        styleSheet.id = 'banner-animations';
        styleSheet.innerText = `
            @keyframes slideDown {
                0% { transform: translateY(-20px); opacity: 0; }
                100% { transform: translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styleSheet);
    }


    return (
        <div className="landing-page">
            <Header />

                {showWaitListMessage && (
                    <div style={styles.banner}>
                        <h2 style={styles.bannerTitle}>Ти у <span style={{color: "#F58A3D"}}>Wait</span> <span style={{color: "#FCD531"}}>List!</span></h2>
                        <p style={styles.bannerText}>
                            Твою анкету успішно створено. Поки ми шукаємо ідеальний метч, можеш переглянути анкети інших користувачів нижче.
                        </p>
                        <button 
                            style={styles.bannerBtn} 
                            onClick={() => {
                                // setShowWaitListMessage(false);  
                                onGoHome();    
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'translate(-2px, -2px)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'translate(0, 0)'}
                        >
                            Зрозуміло
                        </button>
                    </div>
                )}

            <main className="landing-main" style={{ display: 'flex', justifyContent: 'center', padding: '40px 20px' }}>
                

                {/* Головний контейнер картки */}
                <div className="buddy-card-wrapper">
                    
                    <div className={`buddy-card-inner ${isFlipped ? "is-flipped" : ""}`}>
                        
                        {/* === ПЕРЕДНЯ ЧАСТИНА === */}
                        <div className="buddy-card-face buddy-card-front">
                            <div className="buddy-photo-container">
                                <img
                                    src={photos[photoIndex]}
                                    alt={`${title} - фото ${photoIndex + 1}`}
                                    className="buddy-photo"
                                />
                                
                                {/* Кнопки перемикання фото */}
                                {photos.length > 1 && (
                                    <>
                                        <button className="buddy-nav-btn prev" onClick={prevPhoto}>{"<"}</button>
                                        <button className="buddy-nav-btn next" onClick={nextPhoto}>{">"}</button>
                                    </>
                                )}

                                {/* Індикатори (крапочки) */}
                                {photos.length > 1 && (
                                    <div className="buddy-dots">
                                        {photos.map((_, i) => (
                                            <div key={i} className={`buddy-dot ${i === photoIndex ? "active" : ""}`} />
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="buddy-info-front">
                                <h2>{title}</h2>
                                <p>{description}</p>
                            </div>
                        </div>

                        {/* === ЗАДНЯ ЧАСТИНА (ДЕТАЛІ) === */}
                        <div className="buddy-card-face buddy-card-back">
                            <div className="buddy-back-header">
                                <h2>Детальна інфа</h2>
                            </div>
                            <div className="buddy-back-content">
                                <h3>Коротко</h3>
                                <p className="highlight-desc">{description}</p>
                                
                                <h3>Більше про мене</h3>
                                {moreInfo.split("\n").map((line, index) => (
                                    <div key={index} className="buddy-detail-item">
                                        <span className="buddy-check">✔</span> {line}
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Кнопка перегортання */}
                    <button
                        className="buddy-flip-btn"
                        onClick={() => setIsFlipped(!isFlipped)}
                    >
                        {isFlipped ? "Повернутись до фото" : "Більше інформації"}
                    </button>
                </div>
            </main>
        </div>
    );
}
