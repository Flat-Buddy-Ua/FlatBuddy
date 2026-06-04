import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from "react-i18next";
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
	const { t } = useTranslation();
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
					setErrorDetail(body.detail || t('verify_email.invalid_token'));
					setState(STATE.ERROR);
				}
			} catch {
				setErrorDetail(t('verify_email.network_error'));
				setState(STATE.ERROR);
			}
		})();
	}, [token, navigate]);

	const handleResend = async () => {
		if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
			setResendStatus({ kind: 'error', text: t('verify_email.enter_valid_email') });
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
				setResendStatus({ kind: 'ok', text: body.detail || t('verify_email.email_sent_to', { email }) });
			} else if (res.status === 429) {
				setResendStatus({ kind: 'error', text: body.detail || t('verify_email.too_many_attempts') });
			} else {
				setResendStatus({ kind: 'error', text: body.detail || t('verify_email.send_failed') });
			}
		} catch {
			setResendStatus({ kind: 'error', text: t('verify_email.network_error_retry') });
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
							<h2 className="verify-heading">{t('verify_email.loading')}</h2>
							<p className="verify-note">{t('verify_email.wait')}</p>
						</>
					)}

					{state === STATE.SUCCESS && (
						<>
							<div className="verify-icon">✅</div>
							<h2 className="verify-heading">{t('verify_email.success')}</h2>
							<p className="verify-note">{t('verify_email.redirecting')}</p>
						</>
					)}

					{state === STATE.ERROR && (
						<>
							<div className="verify-icon">⚠️</div>
							<h2 className="verify-heading">{errorDetail}</h2>
							<p className="verify-note">{t('verify_email.enter_email')}</p>
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
									btntext={isResending ? t('verify_email.send_new') : t('verify_email.enter_email')}
								/>
							</div>
							<button
								type="button"
								onClick={() => navigate('/')}
								className="verify-link-btn"
							>
								{t('verify_email.back_to_home')}
							</button>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
