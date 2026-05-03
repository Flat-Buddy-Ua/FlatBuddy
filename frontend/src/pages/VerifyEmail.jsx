import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Header } from '../components/Header.jsx';
import { SubmitBtn } from '../components/SubmitBtn.jsx';

const BASE_URL = import.meta.env.VITE_API_URL;

const STATE = {
	LOADING: 'loading',
	SUCCESS: 'success',
	ERROR: 'error',
};

const cardStyle = {
	width: '100%',
	maxWidth: 560,
	border: '3px solid #F6DDD4',
	padding: 'clamp(24px, 6vw, 80px)',
	margin: 'auto',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	gap: '16px',
	boxSizing: 'border-box',
	textAlign: 'center',
	fontFamily: 'Inter, sans-serif',
};

const headingStyle = {
	fontFamily: 'Seenonim, Inter, sans-serif',
	fontSize: 28,
	margin: 0,
};

const noteStyle = {
	color: '#555',
	fontSize: 16,
	margin: 0,
};

const inputStyle = {
	width: '100%',
	padding: '12px 16px',
	border: '2px solid #F6DDD4',
	background: '#F6DDD4',
	fontFamily: 'Inter, sans-serif',
	fontSize: 16,
	boxSizing: 'border-box',
};

const Spinner = () => (
	<div style={{
		width: 36, height: 36, borderRadius: '50%',
		border: '4px solid #F6DDD4', borderTopColor: '#FCD531',
		animation: 'spin 0.9s linear infinite',
	}} />
);

export default function VerifyEmail() {
	const { token } = useParams();
	const navigate = useNavigate();
	const [state, setState] = useState(STATE.LOADING);
	const [errorDetail, setErrorDetail] = useState('');
	const [email, setEmail] = useState('');
	const [resendStatus, setResendStatus] = useState({ kind: null, text: '' });
	const [isResending, setIsResending] = useState(false);
	const triggered = useRef(false);

	useEffect(() => {
		// Guard against double-fire in React 18 StrictMode (dev) — token is one-shot
		if (triggered.current) return;
		triggered.current = true;

		(async () => {
			try {
				const res = await fetch(`${BASE_URL}/api/verify/${token}/`, { method: 'GET' });
				if (res.ok) {
					const data = await res.json();
					if (data.access) localStorage.setItem('access_token', data.access);
					if (data.refresh) localStorage.setItem('refresh_token', data.refresh);
					window.dispatchEvent(new Event('storage'));
					setState(STATE.SUCCESS);
					setTimeout(() => {
						navigate('/profile/details', { state: { justRegistered: true } });
					}, 1800);
				} else {
					const body = await res.json().catch(() => ({}));
					setErrorDetail(body.detail || 'Посилання недійсне або застаріло');
					setState(STATE.ERROR);
				}
			} catch {
				setErrorDetail('Мережева помилка. Перевірте з\'єднання та спробуйте знову.');
				setState(STATE.ERROR);
			}
		})();
	}, [token, navigate]);

	const handleResend = async () => {
		if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
			setResendStatus({ kind: 'error', text: 'Введіть коректну адресу пошти' });
			return;
		}
		setIsResending(true);
		setResendStatus({ kind: null, text: '' });
		try {
			const res = await fetch(`${BASE_URL}/api/resend-link/`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email: email.trim() }),
			});
			const body = await res.json().catch(() => ({}));
			if (res.ok) {
				setResendStatus({ kind: 'ok', text: body.detail || `Лист надіслано на ${email}` });
			} else if (res.status === 429) {
				setResendStatus({ kind: 'error', text: body.detail || 'Забагато спроб, спробуй пізніше' });
			} else {
				setResendStatus({ kind: 'error', text: body.detail || 'Не вдалося надіслати лист' });
			}
		} catch {
			setResendStatus({ kind: 'error', text: 'Мережева помилка. Спробуйте знову.' });
		} finally {
			setIsResending(false);
		}
	};

	return (
		<div className="landing-page">
			<Header />
			<style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

			<div style={{ padding: '60px 20px' }}>
				<div style={cardStyle}>
					{state === STATE.LOADING && (
						<>
							<Spinner />
							<h2 style={headingStyle}>Підтверджуємо вашу пошту…</h2>
							<p style={noteStyle}>Зачекайте секунду.</p>
						</>
					)}

					{state === STATE.SUCCESS && (
						<>
							<div style={{ fontSize: 48 }}>✅</div>
							<h2 style={headingStyle}>Пошта підтверджена</h2>
							<p style={noteStyle}>Зараз перенаправимо на заповнення профілю…</p>
						</>
					)}

					{state === STATE.ERROR && (
						<>
							<div style={{ fontSize: 48 }}>⚠️</div>
							<h2 style={headingStyle}>{errorDetail}</h2>
							<p style={noteStyle}>
								Введіть email і ми надішлемо новий лист підтвердження.
							</p>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="your@email.com"
								disabled={isResending}
								style={inputStyle}
							/>
							{resendStatus.text && (
								<p style={{
									...noteStyle,
									color: resendStatus.kind === 'ok' ? '#2e7d32' : '#c62828',
								}}>
									{resendStatus.text}
								</p>
							)}
							<div style={{ width: '100%' }}>
								<SubmitBtn
									onClick={handleResend}
									disabled={isResending || !email.trim()}
									btntext={isResending ? 'Надсилання…' : 'Надіслати новий лист'}
								/>
							</div>
							<button
								type="button"
								onClick={() => navigate('/')}
								style={{
									background: 'none', border: 'none', padding: 0,
									color: '#555', fontFamily: 'Inter', fontSize: 14,
									cursor: 'pointer', textDecoration: 'underline',
								}}
							>
								На головну
							</button>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
