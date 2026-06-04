import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LoginPopup } from "./LoginPopup.jsx";
import "./Header.css";



export function Header({
	onSignUpClick,
	onExitClick,
}) {
	const { t } = useTranslation();
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
								{t("header.home")}
							</button>
							<button type="button" className="fb-header__link" onClick={() => handleMenuAction(onFindRoommateClick)}>
								{t("header.find_buddy")}
							</button>
							{isLoggedIn && (
								<button
									type="button"
									className="fb-header__link fb-header__icon-link"
									onClick={() => handleMenuAction(onLikesClick)}
									aria-label={t("likes.title")}
									title={t("likes.title")}
								>
									<svg
										className="fb-header__heart"
										viewBox="0 0 24 24"
										width="26"
										height="26"
										aria-hidden="true"
									>
										<path
											d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</button>
							)}
						</div>

						{!isLoggedIn ? (
							<div className="fb-header__right">
								<button type="button" className="fb-header__link fb-header__auth-link" onClick={handleLoginOpen}>
									{t("header.login")}
								</button>
								<button type="button" className="fb-header__link fb-header__auth-link" onClick={handleSignUpClick}>
									{t("header.register")}
								</button>
							</div>
						) : (
							<div className="fb-header__right">
								<button type="button" className="fb-header__link fb-header__auth-link" onClick={handleProfileClick}>
									{t("header.profile")}
								</button>
								<button type="button" className="fb-header__link fb-header__auth-link" onClick={handleLogout}>
									{t("header.logout")}
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
