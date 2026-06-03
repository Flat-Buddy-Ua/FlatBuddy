import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Header } from "../components/Header.jsx";
import "./MAIN.css";

export default function MAIN() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div className="landing-page">
            <Header />

            <main className="landing-main">
                <section className="landing-hero">
                    <h1 className="landing-title">
                        <span style={{ color: "black" }}>F</span>
                        <span style={{ color: "#F58A3D" }}>L</span>
                        <span style={{ color: "black" }}>A</span>
                        <span style={{ color: "#FCD531" }}>T</span>
                        <br />
                        <span style={{ color: "black" }}> B</span>
                        <span style={{ color: "#FCD531" }}>U</span>
                        <span style={{ color: "black" }}>D</span>
                        <span style={{ color: "#F58A3D" }}>D</span>
                        <span style={{ color: "black" }}>Y</span>
                    </h1>
                    <p className="landing-about">
                        {t('main.about')}
                    </p>

                    <div className="landing-actions">
                        <button
                            type="button"
                            className="landing-btn landing-btn-secondary"
                            onClick={() => navigate('/register')}
                        >
                            {t('main.register')}
                        </button>
                        <button
                            type="button"
                            className="landing-btn landing-btn-primary"
                            onClick={() => navigate('/buddies')}
                        >
                            {t('main.find_buddy')}
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
                    <h2 className="landing-section-title">{t('main.how_it_works')}</h2>
                    <div className="how-it-works-grid">
                        <div className="step-card">
                            <div className="step-number">1</div>
                            <h3>{t('main.step1_title')}</h3>
                            <p>{t('main.step1_desc')}</p>
                        </div>
                        <div className="step-card">
                            <div className="step-number" style={{ color: "#FCD531" }}>2</div>
                            <h3>{t('main.step2_title')}</h3>
                            <p>{t('main.step2_desc')}</p>
                        </div>
                        <div className="step-card">
                            <div className="step-number">3</div>
                            <h3>{t('main.step3_title')}</h3>
                            <p>{t('main.step3_desc')}</p>
                        </div>
                        <div className="step-card">
                            <div className="step-number" style={{ color: "#FCD531" }}>4</div>
                            <h3>{t('main.step4_title')}</h3>
                            <p>{t('main.step4_desc')}</p>
                        </div>
                    </div>
                </section>

                {/* 3. СЕКЦІЯ: ЧОМУ FLAT BUDDY (на кольоровому фоні) */}
                <section className="landing-section bg-peach">
                    <h2 className="landing-section-title">{t('main.why_us')}</h2>
                    <div className="features-grid">
                        <div className="feature-item">
                            <h3>{t('main.compatibility')}</h3>
                            <p>{t('main.compatibility_desc')}</p>
                        </div>
                        <div className="feature-item">
                            <h3>{t('main.security')}</h3>
                            <p>{t('main.security_desc')}</p>
                        </div>
                        <div className="feature-item">
                            <h3>{t('main.economy')}</h3>
                            <p>{t('main.economy_desc')}</p>
                        </div>
                    </div>
                </section>
            </main>

            {/* 4. ФУТЕР */}
            <footer className="landing-footer">
                <div className="footer-content">
                    <div className="footer-logo">
                        <span style={{ color: "white" }}>FLAT</span>
                        <span style={{ color: "#FCD531" }}> BUDDY</span>
                    </div>
                    <div className="footer-links">
                        <a href="/privacy">{t('main.privacy_policy')}</a>
                        <a href="/terms">{t('main.terms_of_use')}</a>
                        <a href="mailto:support@flatbuddyua.com">{t('main.support')}</a>
                    </div>
                </div>
                <div className="footer-bottom">
                    © {new Date().getFullYear()} {t('main.rights_reserved')}
                </div>
            </footer>
        </div>
    );
}
