import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginPopup } from "./LoginPopup.jsx";

export function Header({
  onHomeClick,
  onFindRoommateClick,
  onRentClick,
  onLoginClick,
  onFBClick,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const navigate = useNavigate();

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) closeMenu();
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") closeMenu();
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleMenuAction = (callback) => {
    if (typeof callback === "function") callback();
    closeMenu();
  };

  const handleBrandClick = () => {
    if (typeof onFBClick === "function") {
      onFBClick();
      closeMenu();
      return;
    }
    window.location.href = "/";
  };

  const handleLoginOpen = () => {
    setIsLoginOpen(true);
    closeMenu();
  };

  const handleLoginSuccess = (data) => {
    if (typeof onLoginClick === "function") {
      onLoginClick(data);
    }
  };

  const handleSignUpClick = () => {
    closeMenu();

    if (typeof onRentClick === "function") {
      onRentClick();
      return;
    }

    navigate("/register");
  };

  return (
    <>
      <header className="fb-header">
        <div className="fb-header__inner">
          <nav className={`fb-header__nav ${isMenuOpen ? "is-open" : ""}`} aria-label="Main navigation">
            <div className="fb-header__left">
              <button type="button" className="fb-header__link" onClick={() => handleMenuAction(onHomeClick)}>
                Дім
              </button>
              <button type="button" className="fb-header__link" onClick={() => handleMenuAction(onFindRoommateClick)}>
                Знайти buddy
              </button>
            </div>

            <div className="fb-header__right">
              <button type="button" className="fb-header__link fb-header__auth-link" onClick={handleLoginOpen}>
                Log In
              </button>
              <button type="button" className="fb-header__link fb-header__auth-link" onClick={handleSignUpClick}>
                Sign Up
              </button>
            </div>
          </nav>

          <button type="button" className="fb-header__brand fb-header__brand-btn" onClick={handleBrandClick} aria-label="Go to home page">
            FB
          </button>

          <button
            type="button"
            className={`fb-header__burger ${isMenuOpen ? "is-open" : ""}`}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <LoginPopup
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSuccess={handleLoginSuccess}
      />
    </>
  );
}
