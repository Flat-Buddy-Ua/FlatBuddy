import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginPopup } from "./LoginPopup.jsx";
import "./Header.css";



export function Header({
  	onSignUpClick,
	onExitClick,
}) {
  	const [isMenuOpen, setIsMenuOpen] = useState(false);
  	const [isLoginOpen, setIsLoginOpen] = useState(false);
  	const navigate = useNavigate();

	const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("access_token"));

	const onFBClick = () => navigate('/');
	const onHomeClick = () => navigate('/');
	const onLoginClick = () => navigate('/login');
	const onProfileClick = () => navigate('/profile/details');
	const onFindRoommateClick = () => navigate('/buddies');
	const onLikesClick = () => navigate('/likes');

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("access_token");
		localStorage.removeItem("refresh_token");
		localStorage.removeItem("user");
		setIsLoggedIn(false);
		navigate("/");
	}

  	const closeMenu = () => setIsMenuOpen(false);

  	useEffect(() => {
    	const handleResize = () => {
      		if (window.innerWidth > 768) closeMenu();
    	};

    	const handleEscape = (event) => {
      		if (event.key === "Escape") closeMenu();
    	};

		const handleStorageChange = (event) => {
			setIsLoggedIn(!!localStorage.getItem("access_token"));
		};

    	window.addEventListener("resize", handleResize);
    	window.addEventListener("keydown", handleEscape);
		window.addEventListener("storage", handleStorageChange);
    	return () => {
      		window.removeEventListener("resize", handleResize);
      		window.removeEventListener("keydown", handleEscape);
			window.removeEventListener("storage", handleStorageChange);
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
		setIsLoggedIn(true);
    	if (typeof onProfileClick === "function") {
      		onProfileClick(data);
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

	const handleProfileClick = () => {
		closeMenu();
		if (typeof onProfileClick === "function") {
			onProfileClick();
			return;
		}
		navigate("/profile/details");
	}

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
              				{isLoggedIn && (
                				<button
                  					type="button"
                  					className="fb-header__link fb-header__icon-link"
                  					onClick={() => handleMenuAction(onLikesClick)}
                  					aria-label="Лайки"
                  					title="Лайки"
                				>
                  					<svg
                    					className="fb-header__heart"
                    					viewBox="0 0 24 24"
                    					width="22"
                    					height="22"
                    					aria-hidden="true"
                  					>
                    					<path
                      						d="M12 21s-7.2-4.35-9.6-9.05C.85 8.4 2.55 4.6 6.15 4.6c2.05 0 3.45 1.2 4.35 2.55h0c.9-1.35 2.3-2.55 4.35-2.55 3.6 0 5.3 3.8 3.75 7.35C19.2 16.65 12 21 12 21Z"
                      						fill="none"
                      						stroke="currentColor"
                      						strokeWidth="2"
                      						strokeLinejoin="round"
                    					/>
                  					</svg>
                				</button>
              				)}
            			</div>

					{!isLoggedIn ? (
            			<div className="fb-header__right">
              				<button type="button" className="fb-header__link fb-header__auth-link" onClick={handleLoginOpen}>
                				Вхід
              				</button>
              				<button type="button" className="fb-header__link fb-header__auth-link" onClick={handleSignUpClick}>
                				Зареєструватися
              				</button>
            			</div>
					) : (
						<div className="fb-header__right">
			  				<button type="button" className="fb-header__link fb-header__auth-link" onClick={handleProfileClick}>
								Профіль
			  				</button>
			  				<button type="button" className="fb-header__link fb-header__auth-link" onClick={handleLogout}>
								Вийти
			  				</button>
						</div>
					)}
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
