import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Header } from '../components/Header.jsx';
import { SubmitBtn } from '../components/SubmitBtn.jsx';
import './VerifyEmail.css';

const BASE_URL = import.meta.env.VITE_API_URL;

const STATE = {
	LOADING: 'loading',
	SUCCESS: 'success',
	ERROR: 'error',
};

const Spinner = () => <div className="verify-spinner" />;

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

			<div className="verify-page">
				<div className="verify-card">
					{state === STATE.LOADING && (
						<>
							<Spinner />
							<h2 className="verify-heading">Підтверджуємо вашу пошту…</h2>
							<p className="verify-note">Зачекайте секунду.</p>
						</>
					)}

					{state === STATE.SUCCESS && (
						<>
							<div className="verify-icon">✅</div>
							<h2 className="verify-heading">Пошта підтверджена</h2>
							<p className="verify-note">Зараз перенаправимо на заповнення профілю…</p>
						</>
					)}

					{state === STATE.ERROR && (
						<>
							<div className="verify-icon">⚠️</div>
							<h2 className="verify-heading">{errorDetail}</h2>
							<p className="verify-note">
								Введіть email і ми надішлемо новий лист підтвердження.
							</p>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="your@email.com"
								disabled={isResending}
								className="verify-input"
							/>
							{resendStatus.text && (
								<p className={`verify-note ${resendStatus.kind === 'ok' ? 'verify-note--ok' : 'verify-note--error'}`}>
									{resendStatus.text}
								</p>
							)}
							<div className="verify-submit-row">
								<SubmitBtn
									onClick={handleResend}
									disabled={isResending || !email.trim()}
									btntext={isResending ? 'Надсилання…' : 'Надіслати новий лист'}
								/>
							</div>
							<button
								type="button"
								onClick={() => navigate('/')}
								className="verify-link-btn"
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
