import React from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header.jsx";

export default function MAIN() {
    const navigate = useNavigate();

    return (
        <div className="landing-page">
            <Header />

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
                        Flat Buddy — це проста та зручна платформа для пошуку житла та співмешканців (buddy) в одному процесі.
                        Ви можете переглядати профілі, порівнювати вподобання та вести безпечну розмову перед переїздом.
                    </p>

                    <div className="landing-actions">
                        <button 
                            type="button" 
                            className="landing-btn landing-btn-secondary"
                            onClick={() => navigate('/register')}
                        >
                            {"Зареєструватись"}
                        </button>
                        <button
                            type="button"
                            className="landing-btn landing-btn-primary"
                            onClick={() => navigate('/buddies')}
                        >
                            {"Знайти співмешканця"}
                        </button>
                    </div>
                </section>

                <img
                    className="landing-image"
                    src="/img/photo_kyiv.jpg"
                    alt="Flat Buddy project"
                />

                {/* 2. СЕКЦІЯ: ЯК ЦЕ ПРАЦЮЄ */}
                <section className="landing-section">
                    <h2 className="landing-section-title">Як це працює?</h2>
                    <div className="how-it-works-grid">
                        <div className="step-card">
                            <div className="step-number">1</div>
                            <h3>Розкажи про себе</h3>
                            <p>Створи профіль та поділися своїми звичками, біоритмами і побажаннями до житла.</p>
                        </div>
                        <div className="step-card">
                            <div className="step-number" style={{color: "#FCD531"}}>2</div>
                            <h3>Знайди метч</h3>
                            <p>Наш алгоритм покаже людей, з якими тобі буде максимально комфортно жити разом.</p>
                        </div>
                        <div className="step-card">
                            <div className="step-number">3</div>
                            <h3>Спишіться</h3>
                            <p>Обговоріть усі деталі у безпечному внутрішньому чаті без розголошення контактів.</p>
                        </div>
                        <div className="step-card">
                            <div className="step-number" style={{color: "#FCD531"}}>4</div>
                            <h3>Живіть у кайф</h3>
                            <p>Орендуйте омріяне житло разом, діліть витрати навпіл та насолоджуйтесь життям.</p>
                        </div>
                    </div>
                </section>

                {/* 3. СЕКЦІЯ: ЧОМУ FLAT BUDDY (на кольоровому фоні) */}
                <section className="landing-section bg-peach">
                    <h2 className="landing-section-title">Чому ми?</h2>
                    <div className="features-grid">
                        <div className="feature-item">
                            <h3>/cумісність</h3>
                            <p>Ми враховуємо все: від ставлення до домашніх тварин до того, чи ти сова, чи жайворонок.</p>
                        </div>
                        <div className="feature-item">
                            <h3>/безпека</h3>
                            <p>Твої особисті дані та номер телефону приховані, поки ти сам не вирішиш ними поділитися.</p>
                        </div>
                        <div className="feature-item">
                            <h3>/економія</h3>
                            <p>Розділивши оренду, ти зможеш дозволити собі більшу квартиру в кращому районі міста.</p>
                        </div>
                    </div>
                </section>
            </main>

            {/* 4. ФУТЕР */}
            <footer className="landing-footer">
                <div className="footer-content">
                    <div className="footer-logo">
                        <span style={{color: "white"}}>FLAT</span>
                        <span style={{color: "#FCD531"}}> BUDDY</span>
                    </div>
                    <div className="footer-links">
                        <a href="/privacy">Політика конфіденційності</a>
                        <a href="/terms">Умови використання</a>
                        <a href="mailto:support@flatbuddyua.com">Підтримка</a>
                    </div>
                </div>
                <div className="footer-bottom">
                    © {new Date().getFullYear()} Flat Buddy. Всі права захищені.
                </div>
            </footer>
        </div>
    );
}
