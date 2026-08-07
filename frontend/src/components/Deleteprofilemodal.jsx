import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const CONFIRM_PHRASE = 'Yes, I confirm deleting profile!';

const REASON_CODES = [
	{ code: 'found_here', key: 'reason_found_here' },
	{ code: 'found_elsewhere', key: 'reason_found_elsewhere' },
	{ code: 'not_useful', key: 'reason_not_useful' },
	{ code: 'too_many_notifications', key: 'reason_notifications' },
	{ code: 'privacy_concerns', key: 'reason_privacy' },
	{ code: 'technical_issues', key: 'reason_technical' },
	{ code: 'other', key: 'reason_other' },
];

/**
 * @param {boolean} isOpen
 * @param {() => void} onClose
 * @param {(reason: {code: string, note?: string} | null) => Promise<void>} onConfirmDelete
 *        Викликається, коли юзер підтвердив видалення. reason === null, якщо причину пропустили.
 */
export function DeleteProfileModal({ isOpen, onClose, onConfirmDelete }) {
	const { t } = useTranslation();

	const REASON_OPTIONS = REASON_CODES.map(({ code, key }) => ({
		value: code,
		label: t(`delete_profile.${key}`),
	}));

	const [step, setStep] = useState('confirm'); // 'confirm' | 'reason' | 'submitting'
	const [confirmText, setConfirmText] = useState('');
	const [selectedReason, setSelectedReason] = useState(null);
	const [otherNote, setOtherNote] = useState('');
	const [error, setError] = useState('');

	if (!isOpen) return null;

	const isConfirmTextValid = confirmText.trim() === CONFIRM_PHRASE;

	function resetAndClose() {
		setStep('confirm');
		setConfirmText('');
		setSelectedReason(null);
		setOtherNote('');
		setError('');
		onClose();
	}

	function handleProceedToReason() {
		if (!isConfirmTextValid) return;
		setStep('reason');
	}

	async function finalizeDelete(reason) {
		setStep('submitting');
		setError('');
		try {
			await onConfirmDelete(reason);
			// Успішне видалення — навігацію/логаут виконує батьківський компонент
		} catch (e) {
			setError(t('delete_profile.error_generic'));
			setStep('reason');
		}
	}

	function handleSkipReason() {
		finalizeDelete(null);
	}

	function handleSubmitReason() {
		if (!selectedReason) {
			finalizeDelete(null);
			return;
		}
		finalizeDelete({
			code: selectedReason,
			note: selectedReason === 'other' ? otherNote.trim() : undefined,
		});
	}

	return (
		<div style={overlayStyle} onClick={resetAndClose}>
			<div style={modalStyle} onClick={(e) => e.stopPropagation()}>
				<button type="button" onClick={resetAndClose} style={closeBtnStyle} aria-label="Закрити">
					&times;
				</button>

				{step === 'confirm' && (
					<>
						<h2 style={titleStyle}>{t('delete_profile.title')}</h2>
						<p style={textStyle}>{t('delete_profile.warning')}</p>
						<p style={{ ...textStyle, fontSize: 14, color: '#888' }}>
							{t('delete_profile.type_to_confirm')}
						</p>
						<div style={phraseBoxStyle}>{CONFIRM_PHRASE}</div>
						<input
							type="text"
							value={confirmText}
							onChange={(e) => setConfirmText(e.target.value)}
							placeholder={CONFIRM_PHRASE}
							style={inputStyle}
							autoFocus
						/>
						<div style={btnRowStyle}>
							<button type="button" onClick={resetAndClose} style={cancelBtnStyle}>
								{t('delete_profile.cancel')}
							</button>
							<button
								type="button"
								onClick={handleProceedToReason}
								disabled={!isConfirmTextValid}
								style={{
									...dangerBtnStyle,
									opacity: isConfirmTextValid ? 1 : 0.5,
									cursor: isConfirmTextValid ? 'pointer' : 'not-allowed',
								}}
							>
								{t('delete_profile.continue')}
							</button>
						</div>
					</>
				)}

				{(step === 'reason' || step === 'submitting') && (
					<>
						<h2 style={titleStyle}>{t('delete_profile.reason_title')}</h2>
						<p style={{ ...textStyle, fontSize: 14, color: '#888' }}>
							{t('delete_profile.reason_optional')}
						</p>

						<div style={reasonListStyle}>
							{REASON_OPTIONS.map((opt) => (
								<label key={opt.value} style={reasonItemStyle}>
									<input
										type="radio"
										name="delete_reason"
										checked={selectedReason === opt.value}
										onChange={() => setSelectedReason(opt.value)}
										disabled={step === 'submitting'}
									/>
									{opt.label}
								</label>
							))}
						</div>

						{selectedReason === 'other' && (
							<textarea
								value={otherNote}
								onChange={(e) => setOtherNote(e.target.value)}
								placeholder={t('delete_profile.reason_other_placeholder')}
								style={textareaStyle}
								disabled={step === 'submitting'}
							/>
						)}

						{error && <p style={{ color: '#c62828', fontSize: 14 }}>{error}</p>}

						<div style={btnRowStyle}>
							<button
								type="button"
								onClick={handleSkipReason}
								disabled={step === 'submitting'}
								style={cancelBtnStyle}
							>
								{t('delete_profile.skip')}
							</button>
							<button
								type="button"
								onClick={handleSubmitReason}
								disabled={step === 'submitting'}
								style={dangerBtnStyle}
							>
								{step === 'submitting'
									? t('delete_profile.deleting')
									: t('delete_profile.confirm_delete')}
							</button>
						</div>
					</>
				)}
			</div>
		</div>
	);
}

const overlayStyle = {
	position: 'fixed',
	inset: 0,
	background: 'rgba(17, 17, 17, 0.55)',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	zIndex: 2000,
	padding: 16,
};

const modalStyle = {
	position: 'relative',
	background: '#fff',
	border: '3px solid #111',
	boxShadow: '6px 6px 0 #111',
	padding: '32px 36px',
	maxWidth: 480,
	width: '100%',
	fontFamily: 'Inter, sans-serif',
};

const closeBtnStyle = {
	position: 'absolute',
	top: 12,
	right: 16,
	background: 'transparent',
	border: 'none',
	fontSize: 28,
	lineHeight: 1,
	cursor: 'pointer',
	color: '#111',
};

const titleStyle = {
	margin: '0 0 12px',
	fontSize: 22,
	fontWeight: 700,
	color: '#111',
};

const textStyle = {
	margin: '0 0 12px',
	fontSize: 15,
	lineHeight: 1.5,
	color: '#333',
};

const phraseBoxStyle = {
	background: '#faf6f3',
	border: '1.5px dashed #F6DDD4',
	padding: '10px 14px',
	fontFamily: 'monospace',
	fontSize: 14,
	marginBottom: 12,
	userSelect: 'all',
};

const inputStyle = {
	width: '100%',
	boxSizing: 'border-box',
	padding: '10px 12px',
	border: '2px solid #111',
	fontSize: 15,
	fontFamily: 'Inter, sans-serif',
	marginBottom: 20,
};

const btnRowStyle = {
	display: 'flex',
	gap: 12,
	justifyContent: 'flex-end',
	marginTop: 8,
};

const cancelBtnStyle = {
	background: '#fff',
	border: '2px solid #111',
	padding: '10px 20px',
	fontSize: 15,
	fontWeight: 600,
	cursor: 'pointer',
	fontFamily: 'Inter, sans-serif',
};

const dangerBtnStyle = {
	background: '#e63946',
	color: '#fff',
	border: '2px solid #111',
	padding: '10px 20px',
	fontSize: 15,
	fontWeight: 700,
	cursor: 'pointer',
	fontFamily: 'Inter, sans-serif',
};

const reasonListStyle = {
	display: 'flex',
	flexDirection: 'column',
	gap: 10,
	margin: '12px 0 16px',
};

const reasonItemStyle = {
	display: 'flex',
	alignItems: 'center',
	gap: 8,
	fontSize: 15,
	cursor: 'pointer',
};

const textareaStyle = {
	width: '100%',
	boxSizing: 'border-box',
	minHeight: 70,
	padding: '10px 12px',
	border: '2px solid #111',
	fontSize: 14,
	fontFamily: 'Inter, sans-serif',
	marginBottom: 16,
	resize: 'vertical',
};