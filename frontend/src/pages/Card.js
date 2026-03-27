import React from "react";
import { useEffect, useState } from "react";
import { Header } from "../components/Header.jsx";

export function Card({ onGoHome, onLoginClick, onFindRoommate }) {
    const [cardData, setCardData] = useState(null);
    const [photoIndex, setPhotoIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const fallbackPhotos = [
        "/img/photo_2025-12-14_01-15-19.jpg",
        "/img/photo_2025-11-10_13-54-55.jpg",
        "/img/photo_2026-01-05_12-42-46.jpg",
    ];

    useEffect(() => {
        fetch("/api/card")
            .then((response) => response.json())
            .then((data) => setCardData(data))
            .catch((error) => console.error("Error fetching card data:", error));
    }, []);

    const photosFromApi = cardData?.photos || cardData?.images || [];
    const photos =
        Array.isArray(photosFromApi) && photosFromApi.length > 0
            ? photosFromApi
            : fallbackPhotos;

    useEffect(() => {
        setPhotoIndex(0);
    }, [photos.length]);

    const nextPhoto = () => {
        setPhotoIndex((prev) => (prev + 1) % photos.length);
    };

    const prevPhoto = () => {
        setPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
    };

    const title = cardData?.title || "\u042f\u0446\u0438\u0448\u0438\u043d \u0420\u043e\u043c\u0430\u043d";
    const description = cardData?.description || "\u043c. \u041b\u044c\u0432\u0456\u0432, 19 \u0440\u043e\u043a\u0456\u0432";
    const moreInfo = cardData?.moreInfo || "Національний уніерситет \"Львівська політехніка\"\nСистеми Штучного Інтелекту, 2 курс\nПоліт. координата: Центрист\nГотовий до переїзду: з 1 вересня\nПереваги: охайний, некурящий, люблю готувати\nНедоліки: іноді можу бути надто тихим, не люблю гучну музику";

    return (
        <div className="landing-page">
            <div className="header-grid">
                <Header
                    onFBClick={onGoHome}
                    onHomeClick={onGoHome}
                    onLoginClick={onLoginClick}
                    onFindRoommateClick={onFindRoommate}
                />
            </div>
            <main className="tinder-card-stage">
                <article className={`tinder-card ${isFlipped ? "is-flipped" : ""}`}>
                    <div className="tinder-card-inner">
                        <section className="tinder-card-face tinder-card-face-front" aria-hidden={isFlipped}>
                            <img
                                className="profile-image-square tinder-card-image"
                                src={photos[photoIndex]}
                                alt={`${title} photo ${photoIndex + 1}`}
                            />

                            {photos.length > 1 && (
                                <>
                                    <button
                                        className="tinder-card-photo-nav tinder-card-photo-nav-left"
                                        onClick={prevPhoto}
                                        type="button"
                                        aria-label="Previous photo"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" style={{ fill: "white", margin: "4px 0 0 0" }}>
                                            <path d="M73.4 297.4C60.9 309.9 60.9 330.2 73.4 342.7L233.4 502.7C245.9 515.2 266.2 515.2 278.7 502.7C291.2 490.2 291.2 469.9 278.7 457.4L173.3 352L544 352C561.7 352 576 337.7 576 320C576 302.3 561.7 288 544 288L173.3 288L278.7 182.6C291.2 170.1 291.2 149.8 278.7 137.3C266.2 124.8 245.9 124.8 233.4 137.3L73.4 297.3z" />
                                        </svg>
                                    </button>
                                    <button
                                        className="tinder-card-photo-nav tinder-card-photo-nav-right"
                                        onClick={nextPhoto}
                                        type="button"
                                        aria-label="Next photo"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" style={{ fill: "white", margin: "4px 0 0 0" }}>
                                            <path d="M566.6 342.6C579.1 330.1 579.1 309.8 566.6 297.3L406.6 137.3C394.1 124.8 373.8 124.8 361.3 137.3C348.8 149.8 348.8 170.1 361.3 182.6L466.7 288L96 288C78.3 288 64 302.3 64 320C64 337.7 78.3 352 96 352L466.7 352L361.3 457.4C348.8 469.9 348.8 490.2 361.3 502.7C373.8 515.2 394.1 515.2 406.6 502.7L566.6 342.7z" />
                                        </svg>
                                    </button>

                                    <div className="tinder-card-photo-dots">
                                        {photos.map((_, index) => (
                                            <button
                                                key={`photo-dot-${index}`}
                                                type="button"
                                                className={`tinder-card-photo-dot ${index === photoIndex ? "is-active" : ""}`}
                                                onClick={() => setPhotoIndex(index)}
                                                aria-label={`Go to photo ${index + 1}`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}

                            <div className="tinder-card-gradient" />
                            <div className="tinder-card-content">
                                <h2>{title}</h2>
                                <p>{description}</p>
                            </div>
                        </section>

                        <section className="tinder-card-face tinder-card-face-back" aria-hidden={!isFlipped}>
                            <div className="tinder-card-content tinder-card-content-back">
                                <h2>Детальна інформація</h2>
                                <p>{description}</p>
                                {moreInfo.split("\n").map((line, index) => (
                                        <p key={index} className="paragraph">
                                            {line}
                                        </p>
                                ))}
                            </div>
                        </section>
                    </div>

                    <button
                        className="tinder-card-flip-button"
                        type="button"
                        onClick={() => setIsFlipped((prev) => !prev)}
                        aria-label={isFlipped ? "Show front side" : "Show back side"}
                    >
                        {isFlipped ? "Менше інформації" : "Більше інформації"}
                    </button>
                </article>
            </main>
        </div>
    );
}
