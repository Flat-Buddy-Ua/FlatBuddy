import React from "react";
import { Header } from "../components/Header.jsx";

export function MAIN({ onFindRoommate, onLoginClick, onGoHome }) {
    return (
        <div className="landing-page">
            <Header onLoginClick={onLoginClick} onFBClick={onGoHome} onHomeClick={onGoHome} />

            <main className="landing-main">
                <section className="landing-hero">
                    <h1 className="landing-title">
                        <span style={{color: "black"}}>F</span>
                        <span style={{color: "#F58A3D"}}>L</span>
                        <span style={{color: "black"}}>A</span>
                        <span style={{color: "#FCD531"}}>T</span>
                        <br />
                        <span style={{color: "black"}}> B</span>
                        <span style={{color: "#FCD531"}}>U</span>
                        <span style={{color: "black"}}>D</span>
                        <span style={{color: "#F58A3D"}}>D</span>
                        <span style={{color: "black"}}>Y</span>
                    </h1>
                    <p className="landing-about">
                        Flat Buddy — це проста та зручнаплатформа для пошуку житла та співмешканців (buddy) в одному процесі.
                        Ви можете переглядати профілі, порівнювати вподобання та вести безпечну розмову перед переїздом.
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
