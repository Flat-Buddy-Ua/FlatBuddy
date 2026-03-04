import React from "react";
import { Header } from "../components/Header.jsx";

export function MAIN({ onFindRoommate, onLoginClick, onGoHome }) {
    return (
        <div className="landing-page">
            <Header onLoginClick={onLoginClick} onFBClick={onGoHome} onHomeClick={onGoHome} />

            <main className="landing-main">
                <section className="landing-hero">
                    <h1 className="landing-title">FLAT BUDDY</h1>
                    <p className="landing-about">
                        Flat Buddy is a simple platform to find housing and a compatible roommate in one flow.
                        You can browse profiles, compare preferences, and start a safe conversation before moving in.
                    </p>

                    <div className="landing-actions">
                        <button
                            type="button"
                            className="landing-btn landing-btn-primary"
                            onClick={onFindRoommate}
                        >
                            {"\u0417\u043d\u0430\u0439\u0442\u0438 \u0441\u043f\u0456\u0432\u043c\u0435\u0448\u043a\u0430\u043d\u0446\u044f"}
                        </button>
                        <button type="button" className="landing-btn landing-btn-secondary">
                            {"\u0417\u043d\u0430\u0439\u0442\u0438 \u043e\u0441\u0435\u043b\u044e"}
                        </button>
                    </div>
                </section>

                <img
                    className="landing-image"
                    src="/img/photo_kyiv.jpg"
                    alt="Flat Buddy project"
                />
            </main>
        </div>
    );
}

export default MAIN;
